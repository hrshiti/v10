const xlsx = require('xlsx');
const path = require('path');
try {
    const filePath = path.join(__dirname, 'memberships.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    if (rows.length > 0) {
        console.log('Headers:', Object.keys(rows[0]));
        console.log('First Row Sample:', JSON.stringify(rows[0], null, 2));
    } else {
        console.log('Sheet is empty');
    }
} catch (e) {
    console.error('Error reading file:', e.message);
}
