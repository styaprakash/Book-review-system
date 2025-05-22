const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBook, getBooks, getBookById, searchBooks } = require('../controllers/bookController');
const { createReview } = require('../controllers/reviewController');

// Add a new book (authenticated)
router.post('/', auth, createBook);

// Get all books (pagination, filter)
router.get('/', getBooks);

// Get book details by ID (with reviews/average)
router.get('/:id', getBookById);

// Submit a review (authenticated, one per user per book)
router.post('/:id/reviews', auth, createReview);

// Search books
router.get('/search', searchBooks);

module.exports = router;
