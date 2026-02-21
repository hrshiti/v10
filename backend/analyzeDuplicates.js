
0const xlsx = require('xlsx');
const path = require('path');

const analyzeDuplicates = () => {
    try {
        const filePath = path.join(__dirname, 'memberships.xlsx');
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        console.log(`Analyzing ${data.length} total rows...`);

        const mobileGroups = {};
        data.forEach((row, index) => {
            const mobile = String(row["Mobile Number"] || "").trim();
            if (!mobile) return;

            if (!mobileGroups[mobile]) {
                mobileGroups[mobile] = [];
            }
            mobileGroups[mobile].push({ rowIndex: index + 2, ...row });
        });

        const duplicates = Object.entries(mobileGroups).filter(([mob, rows]) => rows.length > 1);

        console.log(`\nFound ${duplicates.length} mobile numbers with multiple entries.`);

        const analysis = {
            renewals: 0,
            exactDuplicates: 0,
            other: 0
        };

        const detailedSamples = [];

        duplicates.forEach(([mobile, rows]) => {
            // Check if they are renewals (different plans or dates)
            const planNames = new Set(rows.map(r => r["Plan Name"]));
            const dates = new Set(rows.map(r => r["Start Date"]));

            if (planNames.size > 1 || dates.size > 1) {
                analysis.renewals++;
            } else if (planNames.size === 1 && dates.size === 1) {
                analysis.exactDuplicates++;
            } else {
                analysis.other++;
            }

            if (detailedSamples.length < 5) {
                detailedSamples.push({
                    mobile,
                    entries: rows.map(r => ({
                        row: r.rowIndex,
                        plan: r["Plan Name"],
                        start: r["Start Date"],
                        end: r["End Date"],
                        amount: r["Paid Amount"]
                    }))
                });
            }
        });

        console.log('\n--- Summary of Duplicates ---');
        console.log(`Total Unique Mobiles with Multiple Rows: ${duplicates.length}`);
        console.log(`- Potential Renewals/History (Different dates/plans): ${analysis.renewals}`);
        console.log(`- Exact Duplicate Rows (Same plan & dates): ${analysis.exactDuplicates}`);

        console.log('\n--- Detailed Samples of Multi-Entry Data ---');
        console.log(JSON.stringify(detailedSamples, null, 2));

    } catch (err) {
        console.error('Analysis failed:', err.message);
    }
};

analyzeDuplicates();
