const asyncHandler = require('express-async-handler');
const Expense = require('../../models/Expense');

// @desc    Get all expenses
// @route   GET /api/admin/expenses
// @access  Private/Admin
const getExpenses = asyncHandler(async (req, res) => {
    const { keyword, staffName, startDate, endDate } = req.query;
    let query = { isDeleted: false };

    if (keyword) {
        query.$or = [
            { expenseType: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
        ];
    }

    if (staffName) {
        query.staffName = staffName;
    }

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
});

// @desc    Create an expense
// @route   POST /api/admin/expenses
// @access  Private/Admin
const createExpense = asyncHandler(async (req, res) => {
    const { expenseType, description, amount, date, paymentMode, staffName } = req.body;

    const expense = await Expense.create({
        expenseType,
        description,
        amount,
        date,
        paymentMode,
        staffName
    });

    res.status(201).json(expense);
});

// @desc    Update an expense
// @route   PUT /api/admin/expenses/:id
// @access  Private/Admin
const updateExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
        expense.expenseType = req.body.expenseType || expense.expenseType;
        expense.description = req.body.description !== undefined ? req.body.description : expense.description;
        expense.amount = req.body.amount || expense.amount;
        expense.date = req.body.date || expense.date;
        expense.paymentMode = req.body.paymentMode || expense.paymentMode;
        expense.staffName = req.body.staffName || expense.staffName;

        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } else {
        res.status(404);
        throw new Error('Expense not found');
    }
});

// @desc    Delete an expense (Soft delete)
// @route   DELETE /api/admin/expenses/:id
// @access  Private/Admin
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
        expense.isDeleted = true;
        await expense.save();
        res.json({ message: 'Expense removed' });
    } else {
        res.status(404);
        throw new Error('Expense not found');
    }
});

module.exports = {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
};
