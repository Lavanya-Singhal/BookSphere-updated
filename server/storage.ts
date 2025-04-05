import { users, books, bookTransactions, bookReservations, bookReviews, courses, courseBooks, 
  researchPapers, aiRecommendations, notifications, type User, type InsertUser, type Book, 
  type InsertBook, type BookTransaction, type InsertBookTransaction, type BookReservation, 
  type InsertBookReservation, type BookReview, type InsertBookReview, type Course, 
  type InsertCourse, type CourseBook, type InsertCourseBook, type ResearchPaper, 
  type InsertResearchPaper, type Notification, type InsertNotification, type AIRecommendation } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define IStorage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Book operations
  getBooks(limit?: number, offset?: number): Promise<Book[]>;
  getBooksByIds(ids: number[]): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  searchBooks(query: string): Promise<Book[]>;
  getBooksByCourse(courseId: number): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, data: Partial<InsertBook>): Promise<Book | undefined>;
  
  // Book Transaction operations
  getBorrowedBooks(userId: number): Promise<BookTransaction[]>;
  getBorrowedBooksWithDetails(userId: number): Promise<(BookTransaction & { book: Book })[]>;
  getBookTransaction(id: number): Promise<BookTransaction | undefined>;
  createBookTransaction(transaction: InsertBookTransaction): Promise<BookTransaction>;
  updateBookTransaction(id: number, data: Partial<BookTransaction>): Promise<BookTransaction | undefined>;
  returnBook(id: number): Promise<BookTransaction | undefined>;
  
  // Book Reservation operations
  getReservations(userId: number): Promise<BookReservation[]>;
  getReservationsWithDetails(userId: number): Promise<(BookReservation & { book: Book })[]>;
  getBookReservation(id: number): Promise<BookReservation | undefined>;
  createBookReservation(reservation: InsertBookReservation): Promise<BookReservation>;
  updateBookReservation(id: number, data: Partial<BookReservation>): Promise<BookReservation | undefined>;
  
  // Book Review operations
  getBookReviews(bookId: number): Promise<BookReview[]>;
  getBookReviewsWithUsers(bookId: number): Promise<(BookReview & { user: User })[]>;
  createBookReview(review: InsertBookReview): Promise<BookReview>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCourseByCode(code: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // CourseBook operations
  getCourseBooks(courseId: number): Promise<CourseBook[]>;
  getCourseBooksWithDetails(courseId: number): Promise<(CourseBook & { book: Book })[]>;
  createCourseBook(courseBook: InsertCourseBook): Promise<CourseBook>;
  
  // Research Paper operations
  getResearchPapers(limit?: number, offset?: number): Promise<ResearchPaper[]>;
  getResearchPaperById(id: number): Promise<ResearchPaper | undefined>;
  createResearchPaper(paper: InsertResearchPaper): Promise<ResearchPaper>;
  
  // AI Recommendation operations
  getAIRecommendations(userId: number): Promise<AIRecommendation[]>;
  getAIRecommendationsWithBooks(userId: number): Promise<(AIRecommendation & { book: Book })[]>;
  createAIRecommendation(userId: number, bookId: number, reason: string): Promise<AIRecommendation>;
  
  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private booksMap: Map<number, Book>;
  private bookTransactionsMap: Map<number, BookTransaction>;
  private bookReservationsMap: Map<number, BookReservation>;
  private bookReviewsMap: Map<number, BookReview>;
  private coursesMap: Map<number, Course>;
  private courseBooksMap: Map<number, CourseBook>;
  private researchPapersMap: Map<number, ResearchPaper>;
  private aiRecommendationsMap: Map<number, AIRecommendation>;
  private notificationsMap: Map<number, Notification>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private bookId: number = 1;
  private transactionId: number = 1;
  private reservationId: number = 1;
  private reviewId: number = 1;
  private courseId: number = 1;
  private courseBookId: number = 1;
  private paperId: number = 1;
  private recommendationId: number = 1;
  private notificationId: number = 1;

  constructor() {
    this.usersMap = new Map();
    this.booksMap = new Map();
    this.bookTransactionsMap = new Map();
    this.bookReservationsMap = new Map();
    this.bookReviewsMap = new Map();
    this.coursesMap = new Map();
    this.courseBooksMap = new Map();
    this.researchPapersMap = new Map();
    this.aiRecommendationsMap = new Map();
    this.notificationsMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, borrowedCount: 0 };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  // Book operations
  async getBooks(limit: number = 10, offset: number = 0): Promise<Book[]> {
    const books = Array.from(this.booksMap.values());
    return books.slice(offset, offset + limit);
  }

  async getBooksByIds(ids: number[]): Promise<Book[]> {
    return ids.map(id => this.booksMap.get(id)).filter(Boolean) as Book[];
  }

  async getBookById(id: number): Promise<Book | undefined> {
    return this.booksMap.get(id);
  }

  async searchBooks(query: string): Promise<Book[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.booksMap.values()).filter(
      (book) => 
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery) || 
        book.isbn.toLowerCase().includes(lowerQuery)
    );
  }

  async getBooksByCourse(courseId: number): Promise<Book[]> {
    const courseBooks = Array.from(this.courseBooksMap.values()).filter(
      cb => cb.courseId === courseId
    );
    
    return this.getBooksByIds(courseBooks.map(cb => cb.bookId));
  }

  async createBook(book: InsertBook): Promise<Book> {
    const id = this.bookId++;
    const newBook: Book = { ...book, id, addedAt: new Date() };
    this.booksMap.set(id, newBook);
    return newBook;
  }

  async updateBook(id: number, data: Partial<InsertBook>): Promise<Book | undefined> {
    const book = await this.getBookById(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...data };
    this.booksMap.set(id, updatedBook);
    return updatedBook;
  }

  // Book Transaction operations
  async getBorrowedBooks(userId: number): Promise<BookTransaction[]> {
    return Array.from(this.bookTransactionsMap.values()).filter(
      (transaction) => transaction.userId === userId && transaction.status !== 'returned'
    );
  }

  async getBorrowedBooksWithDetails(userId: number): Promise<(BookTransaction & { book: Book })[]> {
    const transactions = await this.getBorrowedBooks(userId);
    return transactions.map(transaction => {
      const book = this.booksMap.get(transaction.bookId);
      if (!book) throw new Error(`Book with id ${transaction.bookId} not found`);
      return { ...transaction, book };
    });
  }

  async getBookTransaction(id: number): Promise<BookTransaction | undefined> {
    return this.bookTransactionsMap.get(id);
  }

  async createBookTransaction(transaction: InsertBookTransaction): Promise<BookTransaction> {
    const id = this.transactionId++;
    const book = await this.getBookById(transaction.bookId);
    if (!book) throw new Error(`Book with id ${transaction.bookId} not found`);
    if (book.copiesAvailable < 1) throw new Error(`No copies available for book ${book.title}`);
    
    // Update book availability
    await this.updateBook(book.id, {
      copiesAvailable: book.copiesAvailable - 1
    });
    
    // Update user borrowed count
    const user = await this.getUser(transaction.userId);
    if (!user) throw new Error(`User with id ${transaction.userId} not found`);
    await this.updateUser(user.id, {
      borrowedCount: user.borrowedCount + 1
    });
    
    const newTransaction: BookTransaction = {
      ...transaction,
      id,
      issueDate: new Date(),
      returnDate: null,
      fineAmount: 0,
      finePaid: false,
      status: 'active',
    };
    
    this.bookTransactionsMap.set(id, newTransaction);
    return newTransaction;
  }

  async updateBookTransaction(id: number, data: Partial<BookTransaction>): Promise<BookTransaction | undefined> {
    const transaction = await this.getBookTransaction(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...data };
    this.bookTransactionsMap.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async returnBook(id: number): Promise<BookTransaction | undefined> {
    const transaction = await this.getBookTransaction(id);
    if (!transaction) return undefined;
    if (transaction.status === 'returned') throw new Error('Book already returned');
    
    const book = await this.getBookById(transaction.bookId);
    if (!book) throw new Error(`Book with id ${transaction.bookId} not found`);
    
    // Update book availability
    await this.updateBook(book.id, {
      copiesAvailable: book.copiesAvailable + 1
    });
    
    // Update user borrowed count
    const user = await this.getUser(transaction.userId);
    if (!user) throw new Error(`User with id ${transaction.userId} not found`);
    await this.updateUser(user.id, {
      borrowedCount: Math.max(0, user.borrowedCount - 1)
    });
    
    // Calculate fine if overdue
    let fineAmount = 0;
    const now = new Date();
    if (now > transaction.dueDate) {
      const overdueDays = Math.ceil((now.getTime() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fineAmount = overdueDays * 0.5; // $0.50 per day
    }
    
    const updatedTransaction: BookTransaction = {
      ...transaction,
      returnDate: now,
      status: 'returned',
      fineAmount
    };
    
    this.bookTransactionsMap.set(id, updatedTransaction);
    
    // Check if book has reservations
    const reservations = Array.from(this.bookReservationsMap.values()).filter(
      r => r.bookId === book.id && r.status === 'pending'
    ).sort((a, b) => a.reservationDate.getTime() - b.reservationDate.getTime());
    
    if (reservations.length > 0) {
      const nextReservation = reservations[0];
      await this.updateBookReservation(nextReservation.id, {
        status: 'ready',
        notifiedAt: new Date()
      });
      
      // Create notification for the user
      await this.createNotification({
        userId: nextReservation.userId,
        title: 'Book Available',
        message: `The book "${book.title}" you reserved is now available for pickup.`,
        type: 'reservation',
        relatedData: { reservationId: nextReservation.id, bookId: book.id }
      });
    }
    
    return updatedTransaction;
  }

  // Book Reservation operations
  async getReservations(userId: number): Promise<BookReservation[]> {
    return Array.from(this.bookReservationsMap.values()).filter(
      (reservation) => reservation.userId === userId
    );
  }

  async getReservationsWithDetails(userId: number): Promise<(BookReservation & { book: Book })[]> {
    const reservations = await this.getReservations(userId);
    return reservations.map(reservation => {
      const book = this.booksMap.get(reservation.bookId);
      if (!book) throw new Error(`Book with id ${reservation.bookId} not found`);
      return { ...reservation, book };
    });
  }

  async getBookReservation(id: number): Promise<BookReservation | undefined> {
    return this.bookReservationsMap.get(id);
  }

  async createBookReservation(reservation: InsertBookReservation): Promise<BookReservation> {
    const id = this.reservationId++;
    const book = await this.getBookById(reservation.bookId);
    if (!book) throw new Error(`Book with id ${reservation.bookId} not found`);
    
    // Set expiry date to 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    
    const newReservation: BookReservation = {
      ...reservation,
      id,
      reservationDate: new Date(),
      expiryDate: reservation.expiryDate || expiryDate,
      status: 'pending',
      notifiedAt: null
    };
    
    this.bookReservationsMap.set(id, newReservation);
    return newReservation;
  }

  async updateBookReservation(id: number, data: Partial<BookReservation>): Promise<BookReservation | undefined> {
    const reservation = await this.getBookReservation(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, ...data };
    this.bookReservationsMap.set(id, updatedReservation);
    return updatedReservation;
  }

  // Book Review operations
  async getBookReviews(bookId: number): Promise<BookReview[]> {
    return Array.from(this.bookReviewsMap.values()).filter(
      (review) => review.bookId === bookId
    );
  }

  async getBookReviewsWithUsers(bookId: number): Promise<(BookReview & { user: User })[]> {
    const reviews = await this.getBookReviews(bookId);
    return reviews.map(review => {
      const user = this.usersMap.get(review.userId);
      if (!user) throw new Error(`User with id ${review.userId} not found`);
      return { ...review, user };
    });
  }

  async createBookReview(review: InsertBookReview): Promise<BookReview> {
    const id = this.reviewId++;
    const newReview: BookReview = {
      ...review,
      id,
      createdAt: new Date()
    };
    this.bookReviewsMap.set(id, newReview);
    return newReview;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return Array.from(this.coursesMap.values());
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    return this.coursesMap.get(id);
  }

  async getCourseByCode(code: string): Promise<Course | undefined> {
    return Array.from(this.coursesMap.values()).find(
      (course) => course.code === code
    );
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const newCourse: Course = { ...course, id };
    this.coursesMap.set(id, newCourse);
    return newCourse;
  }

  // CourseBook operations
  async getCourseBooks(courseId: number): Promise<CourseBook[]> {
    return Array.from(this.courseBooksMap.values()).filter(
      (courseBook) => courseBook.courseId === courseId
    );
  }

  async getCourseBooksWithDetails(courseId: number): Promise<(CourseBook & { book: Book })[]> {
    const courseBooks = await this.getCourseBooks(courseId);
    return courseBooks.map(courseBook => {
      const book = this.booksMap.get(courseBook.bookId);
      if (!book) throw new Error(`Book with id ${courseBook.bookId} not found`);
      return { ...courseBook, book };
    });
  }

  async createCourseBook(courseBook: InsertCourseBook): Promise<CourseBook> {
    const id = this.courseBookId++;
    const newCourseBook: CourseBook = { ...courseBook, id };
    this.courseBooksMap.set(id, newCourseBook);
    return newCourseBook;
  }

  // Research Paper operations
  async getResearchPapers(limit: number = 10, offset: number = 0): Promise<ResearchPaper[]> {
    const papers = Array.from(this.researchPapersMap.values());
    return papers.slice(offset, offset + limit);
  }

  async getResearchPaperById(id: number): Promise<ResearchPaper | undefined> {
    return this.researchPapersMap.get(id);
  }

  async createResearchPaper(paper: InsertResearchPaper): Promise<ResearchPaper> {
    const id = this.paperId++;
    const newPaper: ResearchPaper = { 
      ...paper, 
      id, 
      uploadedAt: new Date()
    };
    this.researchPapersMap.set(id, newPaper);
    return newPaper;
  }

  // AI Recommendation operations
  async getAIRecommendations(userId: number): Promise<AIRecommendation[]> {
    return Array.from(this.aiRecommendationsMap.values()).filter(
      (recommendation) => recommendation.userId === userId
    );
  }

  async getAIRecommendationsWithBooks(userId: number): Promise<(AIRecommendation & { book: Book })[]> {
    const recommendations = await this.getAIRecommendations(userId);
    return recommendations.map(recommendation => {
      const book = this.booksMap.get(recommendation.bookId);
      if (!book) throw new Error(`Book with id ${recommendation.bookId} not found`);
      return { ...recommendation, book };
    });
  }

  async createAIRecommendation(userId: number, bookId: number, reason: string): Promise<AIRecommendation> {
    const id = this.recommendationId++;
    const newRecommendation: AIRecommendation = {
      id,
      userId,
      bookId,
      reason,
      createdAt: new Date(),
      viewed: false
    };
    this.aiRecommendationsMap.set(id, newRecommendation);
    return newRecommendation;
  }

  // Notification operations
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notificationsMap.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date()
    };
    this.notificationsMap.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notificationsMap.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notificationsMap.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
