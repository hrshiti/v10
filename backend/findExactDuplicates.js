const xlsx = require('xlsx');
const path = require('path');

const findExactDuplicates = () => {
    try {
        const filePath = path.join(__dirname, 'memberships.xlsx');
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const mobileGroups = {};
        data.forEach((row, index) => {
            const mobile = String(row["Mobile Number"] || "").trim();
            if (!mobile) return;
            if (!mobileGroups[mobile]) mobileGroups[mobile] = [];
            mobileGroups[mobile].push({ row: index + 2, ...row });
        });

        console.log('--- Exact Duplicates (Same Mobile, Plan, and Date) ---');
        Object.entries(mobileGroups).forEach(([mobile, rows]) => {
            if (rows.length > 1) {
                const seen = new Set();
                rows.forEach(r => {
                    const key = `${r["Plan Name"]}-${r["Start Date"]}-${r["End Date"]}`;
                    if (seen.has(key)) {
                        console.log(`Mobile: ${mobile}, Name: ${r.Name}, Rows: ${rows.filter(x => `${x["Plan Name"]}-${x["Start Date"]}-${x["End Date"]}` === key).map(x => x.row).join(', ')}`);
                    }
                    seen.add(key);
                });
            }
        });
    } catch (err) {
        console.error(err.message);
    }
};

findExactDuplicates();
