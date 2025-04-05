import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertBookSchema, insertBookTransactionSchema, insertBookReservationSchema, 
  insertBookReviewSchema, insertCourseSchema, insertCourseBookSchema, 
  insertResearchPaperSchema, insertNotificationSchema } from "@shared/schema";

// Utility function to handle async routes
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Auth middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

const isFaculty = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && (req.user.role === 'faculty' || req.user.role === 'admin')) {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Faculty/Admin access required" });
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes
  setupAuth(app);
  
  // GET /api/books - Get all books
  app.get("/api/books", asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const books = await storage.getBooks(limit, offset);
    res.json(books);
  }));
  
  // GET /api/books/search - Search books
  app.get("/api/books/search", asyncHandler(async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const books = await storage.searchBooks(query);
    res.json(books);
  }));
  
  // GET /api/books/:id - Get book by ID
  app.get("/api/books/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await storage.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  }));
  
  // POST /api/books - Add a new book (faculty/admin only)
  app.post("/api/books", isFaculty, asyncHandler(async (req, res) => {
    const validationResult = insertBookSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const bookData = {
      ...validationResult.data,
      addedBy: req.user.id
    };
    
    const book = await storage.createBook(bookData);
    res.status(201).json(book);
  }));
  
  // GET /api/books/:id/reviews - Get reviews for a book
  app.get("/api/books/:id/reviews", asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const reviews = await storage.getBookReviewsWithUsers(bookId);
    res.json(reviews);
  }));
  
  // POST /api/books/:id/reviews - Add a review (authenticated users only)
  app.post("/api/books/:id/reviews", isAuthenticated, asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = await storage.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const validationResult = insertBookReviewSchema.safeParse({
      ...req.body,
      bookId,
      userId: req.user.id
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const review = await storage.createBookReview(validationResult.data);
    res.status(201).json(review);
  }));
  
  // GET /api/user/books - Get books borrowed by the user
  app.get("/api/user/books", isAuthenticated, asyncHandler(async (req, res) => {
    const borrowedBooks = await storage.getBorrowedBooksWithDetails(req.user.id);
    res.json(borrowedBooks);
  }));
  
  // POST /api/books/:id/borrow - Borrow a book
  app.post("/api/books/:id/borrow", isAuthenticated, asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = await storage.getBookById(bookId);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    if (book.copiesAvailable < 1) {
      return res.status(400).json({ error: "No copies available for borrowing" });
    }
    
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (user.borrowedCount >= user.maxBooks) {
      return res.status(400).json({ error: `You've reached the maximum limit of ${user.maxBooks} books` });
    }
    
    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    const validationResult = insertBookTransactionSchema.safeParse({
      bookId,
      userId: req.user.id,
      dueDate
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const transaction = await storage.createBookTransaction(validationResult.data);
    res.status(201).json(transaction);
  }));
  
  // POST /api/books/:id/return - Return a book
  app.post("/api/transactions/:id/return", isAuthenticated, asyncHandler(async (req, res) => {
    const transactionId = parseInt(req.params.id);
    const transaction = await storage.getBookTransaction(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    if (transaction.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(403).json({ error: "You can only return your own borrowed books" });
    }
    
    const returnedTransaction = await storage.returnBook(transactionId);
    res.json(returnedTransaction);
  }));
  
  // POST /api/books/:id/reserve - Reserve a book
  app.post("/api/books/:id/reserve", isAuthenticated, asyncHandler(async (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = await storage.getBookById(bookId);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    if (book.copiesAvailable > 0) {
      return res.status(400).json({ error: "Book is available for borrowing, no need to reserve" });
    }
    
    // Set expiry date to 3 days from notification
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    
    const validationResult = insertBookReservationSchema.safeParse({
      bookId,
      userId: req.user.id,
      expiryDate
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const reservation = await storage.createBookReservation(validationResult.data);
    res.status(201).json(reservation);
  }));
  
  // GET /api/user/reservations - Get user's reservations
  app.get("/api/user/reservations", isAuthenticated, asyncHandler(async (req, res) => {
    const reservations = await storage.getReservationsWithDetails(req.user.id);
    res.json(reservations);
  }));
  
  // GET /api/courses - Get all courses
  app.get("/api/courses", asyncHandler(async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  }));
  
  // GET /api/courses/:id - Get course by ID
  app.get("/api/courses/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const course = await storage.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  }));
  
  // GET /api/courses/:id/books - Get books for a course
  app.get("/api/courses/:id/books", asyncHandler(async (req, res) => {
    const courseId = parseInt(req.params.id);
    const books = await storage.getCourseBooksWithDetails(courseId);
    res.json(books);
  }));
  
  // POST /api/courses - Add a new course (admin only)
  app.post("/api/courses", isAdmin, asyncHandler(async (req, res) => {
    const validationResult = insertCourseSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const course = await storage.createCourse(validationResult.data);
    res.status(201).json(course);
  }));
  
  // POST /api/courses/:id/books - Add a book to a course (faculty/admin only)
  app.post("/api/courses/:id/books", isFaculty, asyncHandler(async (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = await storage.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    const validationResult = insertCourseBookSchema.safeParse({
      ...req.body,
      courseId,
      addedBy: req.user.id
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const courseBook = await storage.createCourseBook(validationResult.data);
    res.status(201).json(courseBook);
  }));
  
  // GET /api/research-papers - Get research papers
  app.get("/api/research-papers", asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const papers = await storage.getResearchPapers(limit, offset);
    res.json(papers);
  }));
  
  // GET /api/research-papers/:id - Get research paper by ID
  app.get("/api/research-papers/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const paper = await storage.getResearchPaperById(id);
    if (!paper) {
      return res.status(404).json({ error: "Research paper not found" });
    }
    res.json(paper);
  }));
  
  // POST /api/research-papers - Add a new research paper (faculty/admin only)
  app.post("/api/research-papers", isFaculty, asyncHandler(async (req, res) => {
    const validationResult = insertResearchPaperSchema.safeParse({
      ...req.body,
      uploadedBy: req.user.id
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors[0].message });
    }
    
    const paper = await storage.createResearchPaper(validationResult.data);
    res.status(201).json(paper);
  }));
  
  // GET /api/user/recommendations - Get AI recommendations for user
  app.get("/api/user/recommendations", isAuthenticated, asyncHandler(async (req, res) => {
    const recommendations = await storage.getAIRecommendationsWithBooks(req.user.id);
    res.json(recommendations);
  }));
  
  // GET /api/user/notifications - Get user notifications
  app.get("/api/user/notifications", isAuthenticated, asyncHandler(async (req, res) => {
    const notifications = await storage.getNotifications(req.user.id);
    res.json(notifications);
  }));
  
  // POST /api/notifications/:id/read - Mark notification as read
  app.post("/api/notifications/:id/read", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const notification = await storage.markNotificationAsRead(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  }));
  
  // GET /api/user/dashboard/stats - Get dashboard statistics for the user
  app.get("/api/user/dashboard/stats", isAuthenticated, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Get borrowed books
    const borrowedBooks = await storage.getBorrowedBooks(userId);
    
    // Get reservations
    const reservations = await storage.getReservations(userId);
    
    // Calculate due soon (books due in the next 3 days)
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const dueSoonBooks = borrowedBooks.filter(book => 
      book.dueDate >= now && book.dueDate <= threeDaysFromNow
    );
    
    // Calculate overdue books
    const overdueBooks = borrowedBooks.filter(book => 
      book.dueDate < now && book.status !== 'returned'
    );
    
    // Get total books count
    const books = await storage.getBooks(1000, 0);
    
    // Calculate popular category
    const bookSubjects = books.flatMap(book => book.subjects || []);
    const subjectCounts = bookSubjects.reduce((counts, subject) => {
      if (!subject) return counts;
      counts[subject] = (counts[subject] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    let popularCategory = '';
    let popularCategoryCount = 0;
    
    for (const [subject, count] of Object.entries(subjectCounts)) {
      if (count > popularCategoryCount) {
        popularCategory = subject;
        popularCategoryCount = count;
      }
    }
    
    // Get available reservations
    const availableReservations = reservations.filter(
      reservation => reservation.status === 'ready'
    ).length;
    
    const stats = {
      borrowedCount: borrowedBooks.filter(book => book.status !== 'returned').length,
      dueSoonCount: dueSoonBooks.length,
      reservationCount: reservations.length,
      availableReservations,
      overdueCount: overdueBooks.length,
      totalBookCount: books.length,
      popularCategoryCount,
      popularCategory
    };
    
    res.json(stats);
  }));
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
