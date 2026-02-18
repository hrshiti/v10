require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');

const Member = require('./models/Member');
const Subscription = require('./models/Subscription');
const Package = require('./models/Package');

const MONGO_URI = process.env.MONGO_URI;

function parseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  if (typeof dateStr === 'string' && dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) return new Date(dateStr);
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }
  const date = new Date(dateStr);
  return isNaN(date) ? null : date;
}

function normalizeGender(g) {
  if (!g) return 'Male';
  const gender = String(g).trim().toLowerCase();
  if (gender.startsWith('m')) return 'Male';
  if (gender.startsWith('f')) return 'Female';
  return 'Other';
}

function normalizeStatus(s) {
  if (!s) return 'Active';
  const status = String(s).trim().toLowerCase();
  if (status === 'active') return 'Active';
  if (status === 'past' || status === 'expired') return 'Expired';
  if (status === 'frozen') return 'Frozen';
  return 'Active';
}

const migrate = async () => {
  try {
    console.log("🚀 Subscription History Migration (Final Fix) Started...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    await Subscription.deleteMany({});
    await Member.deleteMany({});
    console.log("🧹 Old Data Cleared");

    const filePath = path.join(__dirname, 'memberships.xlsx');
    const workbook = xlsx.readFile(filePath);
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    console.log(`📄 Total Rows: ${rows.length}`);

    let success = 0;
    let skipped = 0;
    const memberMap = new Map();

    for (const row of rows) {
      try {
        const mobile = String(row["Mobile Number"] || "").trim();
        const durationStr = String(row["Duration"] || "");
        const durationValue = parseInt(durationStr.match(/\d+/) ? durationStr.match(/\d+/)[0] : 1);
        const planNameFromExcel = String(row["Plan Name"] || "General Training").trim();

        if (!mobile) { skipped++; continue; }

        let packageDoc = await Package.findOne({ durationValue, name: { $regex: planNameFromExcel, $options: "i" }, isDeleted: false }) ||
          await Package.findOne({ durationValue, isDeleted: false }) ||
          await Package.findOne({ name: { $regex: planNameFromExcel, $options: "i" }, isDeleted: false });

        if (!packageDoc) {
          const pkgPrice = Number(row["Paid Amount"]) || 0;
          packageDoc = await Package.create({
            name: `${planNameFromExcel} (${durationValue} months)`,
            type: planNameFromExcel.toLowerCase().includes('pt') ? 'pt' : 'general',
            activity: 'gym',
            timing: 'anytime',
            durationValue,
            durationType: 'Months',
            sessions: durationValue * 30, // Rough estimate
            rackRate: pkgPrice,
            baseRate: pkgPrice,
            active: true
          });
        }

        let startDate = parseDate(row["Start Date"]) || new Date();
        let endDate = parseDate(row["End Date"]) || new Date(new Date(startDate).setMonth(startDate.getMonth() + durationValue));

        const nameParts = (row["Name"] || "Unknown User").trim().split(" ");
        const firstName = nameParts[0] || "Unknown";
        const lastName = nameParts.slice(1).join(" ") || "User";

        const totalAmount = Number(row["Paid Amount"]) || (packageDoc.baseRate || 0);
        const discount = Number(row["Discount"]) || 0;
        const paidAmount = totalAmount;
        const gender = normalizeGender(row["Gender"]);
        const status = normalizeStatus(row["Membership Status"]);

        let memberId;
        if (memberMap.has(mobile)) {
          memberId = memberMap.get(mobile);
          // Only update member with the LATEST end date info
          const currentMember = await Member.findById(memberId);
          if (endDate > currentMember.endDate) {
            await Member.findByIdAndUpdate(memberId, {
              packageName: packageDoc.name,
              packageId: packageDoc._id,
              startDate, endDate, status,
              duration: durationValue,
              durationMonths: durationValue
            });
          }
        } else {
          try {
            const member = await Member.create({
              firstName, lastName, mobile, gender,
              email: row["Email"] || "",
              dob: parseDate(row["dob"]),
              membershipType: packageDoc.type === "pt" ? "Personal Training" : "General Training",
              packageName: packageDoc.name,
              packageId: packageDoc._id,
              duration: durationValue,
              durationType: "Months",
              startDate, endDate, totalAmount, paidAmount, discount, status,
              admissionDate: parseDate(row["Payment Date"]) || new Date()
            });
            memberId = member._id;
            memberMap.set(mobile, memberId);
          } catch (mErr) {
            // Handle mid-loop duplicate memberId collisions
            if (mErr.code === 11000) {
              console.log(`♻ Retrying for ${mobile} due to ID collision...`);
              // Just retry the loop once for this row
              const member = await Member.create({
                firstName, lastName, mobile, gender,
                email: row["Email"] || "",
                dob: parseDate(row["dob"]),
                membershipType: packageDoc.type === "pt" ? "Personal Training" : "General Training",
                packageName: packageDoc.name,
                packageId: packageDoc._id,
                duration: durationValue,
                durationType: "Months",
                startDate, endDate, totalAmount, paidAmount, discount, status,
                admissionDate: parseDate(row["Payment Date"]) || new Date()
              });
              memberId = member._id;
              memberMap.set(mobile, memberId);
            } else { throw mErr; }
          }
        }

        await Subscription.create({
          memberId,
          membershipType: packageDoc.type === "pt" ? "Personal Training" : "General Training",
          packageName: packageDoc.name,
          packageId: packageDoc._id,
          duration: durationValue,
          durationType: "Months",
          startDate, endDate, totalAmount, paidAmount, discount,
          status: status === 'Expired' ? 'Expired' : 'Active',
          isCurrent: false
        });

        success++;
      } catch (err) {
        console.log(`⚠ Error for ${row["Mobile Number"]}:`, err.message);
        skipped++;
      }
    }

    console.log("🛠 Finalizing current subscriptions...");
    for (const member_id of memberMap.values()) {
      const subscriptions = await Subscription.find({ memberId: member_id }).sort({ endDate: -1 });
      if (subscriptions.length > 0) {
        await Subscription.findByIdAndUpdate(subscriptions[0]._id, { isCurrent: true });
      }
    }

    console.log("\n=================================");
    console.log("✅ Final Core Migration Completed");
    console.log(`✔ Rows Success: ${success}`);
    console.log(`⚠ Rows Skipped: ${skipped}`);
    console.log(`👤 Unique Members: ${memberMap.size}`);
    console.log("=================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration Failed:", err.message);
    process.exit(1);
  }
};

migrate();
