import express from 'express';
import Budget from '../models/Budgets.js';

const router = express.Router();

// Add Budget
router.post('/add', async (req, res) => {
  const { category, monthlyLimit, month } = req.body;
  try {
    const newBudget = new Budget({ category, monthlyLimit, month });
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Budgets
router.get('/all', async (req, res) => {
  try {
    const budgets = await Budget.find().populate('category');
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Budget
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { monthlyLimit, currentSpending, month } = req.body;
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { monthlyLimit, currentSpending, month },
      { new: true }
    );
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Budget
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Budget.findByIdAndDelete(id);
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
