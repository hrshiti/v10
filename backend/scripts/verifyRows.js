const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', 'enquiries (2).xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get total range
const range = XLSX.utils.decode_range(worksheet['!ref']);
const totalRowsInSheet = range.e.r + 1; // 0-indexed to 1-indexed

const data = XLSX.utils.sheet_to_json(worksheet);
const dataRows = data.length;

console.log('Total Rows in Sheet (including header):', totalRowsInSheet);
console.log('Data Rows recognized by sheet_to_json:', dataRows);

// Check for empty names or IDs
const issues = [];
data.forEach((row, index) => {
    if (!row['Name'] || !row['ID'] || !row['Mobile Number']) {
        issues.push({ line: index + 2, data: row });
    }
});

console.log('Rows with potential issues:', issues.length);
if (issues.length > 0) {
    console.log('First 5 issues:', issues.slice(0, 5));
}
