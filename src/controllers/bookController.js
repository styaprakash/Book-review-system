const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    const book = await prisma.book.create({ data: { title, author, genre, publishedYear } });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (author) where.author = { contains: author, mode: 'insensitive' };
    if (genre) where.genre = { equals: genre, mode: 'insensitive' };

    const [books, total] = await Promise.all([
      prisma.book.findMany({ where, skip: +skip, take: +limit }),
      prisma.book.count({ where }),
    ]);
    res.json({ data: books, meta: { total, page: +page, limit: +limit } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const id = +req.params.id;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: { select: { username: true } } },
          skip: +(req.query.reviewPage - 1 || 0) * +(req.query.reviewLimit || 5),
          take: +(req.query.reviewLimit || 5),
        }
      }
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Calculate average rating
    const avg = await prisma.review.aggregate({
      where: { bookId: id },
      _avg: { rating: true }
    });

    res.json({
      ...book,
      averageRating: avg._avg.rating || null,
      reviews: book.reviews
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } }
        ]
      }
    });
    res.json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
