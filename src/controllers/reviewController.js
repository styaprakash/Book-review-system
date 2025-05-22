const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res) => {
  try {
    const bookId = +req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    // Check if already reviewed
    const exists = await prisma.review.findUnique({ where: { userId_bookId: { userId, bookId } } });
    if (exists) return res.status(400).json({ message: 'Already reviewed this book' });

    const review = await prisma.review.create({ data: { rating, comment, userId, bookId } });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const id = +req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review || review.userId !== userId)
      return res.status(404).json({ message: 'Review not found or not yours' });

    const updated = await prisma.review.update({ where: { id }, data: { rating, comment } });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const id = +req.params.id;
    const userId = req.user.id;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review || review.userId !== userId)
      return res.status(404).json({ message: 'Review not found or not yours' });

    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
