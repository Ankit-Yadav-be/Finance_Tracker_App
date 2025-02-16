import express from 'express';
import Transaction from "../models/Transactions.js";
import Category from "../models/Categorys.js";
const router = express.Router();

// Add Transaction
router.post('/add', async (req, res) => {
  const { amount, date, description, category } = req.body;
  try {
    const newTransaction = new Transaction({ amount, date, description, category });
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Transactions
router.get('/all', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('category');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  //console.log('Updating transaction with ID:', id);
 // console.log('Request Body:', req.body);

  try {
    const { amount, date, description, category } = req.body;

    // If category is a string, convert it to ObjectId
    let categoryId = category;
    if (typeof category === 'string' && category.length !== 24) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      categoryId = categoryDoc._id;
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, date, description, category: categoryId },
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Delete Transaction
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
