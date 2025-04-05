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
    
    // Add sample books
    this.addSampleBooks();
    
    // Add sample courses
    this.addSampleCourses();
    
    // Add sample research papers
    this.addSampleResearchPapers();
    
    // Add sample AI recommendations
    this.addSampleAIRecommendations();
  }
  
  private addSampleBooks() {
    const sampleBooks: InsertBook[] = [
      {
        title: "Data Structures and Algorithms",
        author: "Thomas H. Cormen",
        publisher: "MIT Press",
        isbn: "978-0262033848",
        year: 2009,
        edition: "3rd Edition",
        description: "The latest revised edition of the bestselling classic, providing a comprehensive introduction to data structures and algorithms.",
        subjects: ["Computer Science", "Algorithms", "Programming"],
        location: "CS-101",
        copiesTotal: 10,
        copiesAvailable: 8
      },
      {
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        publisher: "Prentice Hall",
        isbn: "978-0132350884",
        year: 2008,
        description: "A must-read for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
        subjects: ["Software Engineering", "Programming", "Best Practices"],
        location: "SE-203",
        copiesTotal: 5,
        copiesAvailable: 3
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt, David Thomas",
        publisher: "Addison-Wesley Professional",
        isbn: "978-0201616224",
        year: 1999,
        edition: "1st Edition",
        description: "Cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
        subjects: ["Software Engineering", "Programming", "Professional Development"],
        location: "SE-205",
        copiesTotal: 7,
        copiesAvailable: 4
      },
      {
        title: "Introduction to Machine Learning with Python",
        author: "Andreas C. Müller, Sarah Guido",
        publisher: "O'Reilly Media",
        isbn: "978-1449369415",
        year: 2016,
        description: "A practical guide to machine learning with Python and scikit-learn, covering a wide range of algorithms for classification, regression, clustering, and dimensionality reduction.",
        subjects: ["Machine Learning", "Python", "Data Science"],
        location: "DS-301",
        copiesTotal: 8,
        copiesAvailable: 6
      },
      {
        title: "Database System Concepts",
        author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
        publisher: "McGraw-Hill Education",
        isbn: "978-0073523323",
        year: 2010,
        edition: "6th Edition",
        description: "Database System Concepts provides a unified overview of database systems for undergraduates.",
        subjects: ["Databases", "Computer Science", "Information Systems"],
        location: "CS-202",
        copiesTotal: 6,
        copiesAvailable: 2
      }
    ];
    
    sampleBooks.forEach(book => {
      const id = this.bookId++;
      const newBook: Book = { 
        ...book, 
        id, 
        addedAt: new Date(),
        coverImage: null,
        addedBy: null
      };
      this.booksMap.set(id, newBook);
    });
  }
  
  private addSampleCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        name: "Data Structures and Algorithms",
        code: "CS-301",
        description: "A comprehensive course covering fundamental data structures and algorithms used in computer science.",
        department: "Computer Science"
      },
      {
        name: "Object-Oriented Programming",
        code: "CS-201",
        description: "Introduction to object-oriented programming concepts and design patterns.",
        department: "Computer Science"
      },
      {
        name: "Database Management Systems",
        code: "CS-405",
        description: "Study of database design, implementation, and management techniques.",
        department: "Computer Science"
      },
      {
        name: "Computer Networks",
        code: "CS-450",
        description: "Principles of computer networks, protocols, and network security.",
        department: "Computer Science"
      },
      {
        name: "Software Engineering",
        code: "SE-310",
        description: "Methods and practices for developing large-scale software systems.",
        department: "Software Engineering"
      },
      {
        name: "Artificial Intelligence",
        code: "CS-480",
        description: "Introduction to AI concepts, algorithms, and applications.",
        department: "Computer Science"
      },
      {
        name: "Digital Electronics",
        code: "EE-220",
        description: "Fundamentals of digital circuit design and analysis.",
        department: "Electrical Engineering"
      },
      {
        name: "Machine Learning",
        code: "CS-490",
        description: "Techniques and algorithms for machine learning and data mining.",
        department: "Computer Science"
      },
      {
        name: "Operating Systems",
        code: "CS-410",
        description: "Design and implementation of modern operating systems.",
        department: "Computer Science"
      },
      {
        name: "Web Development",
        code: "CS-370",
        description: "Technologies and frameworks for building web applications.",
        department: "Computer Science"
      }
    ];
    
    sampleCourses.forEach(course => {
      const id = this.courseId++;
      const newCourse: Course = { 
        ...course, 
        id
      };
      this.coursesMap.set(id, newCourse);
      
      // Associate some books with courses
      if (course.code === "CS-301") { // Data Structures and Algorithms
        this.createCourseBook({
          courseId: id,
          bookId: 1, // "Data Structures and Algorithms" book
          addedBy: 2, // Faculty user
          priority: 1,
          isRequired: true
        });
      } else if (course.code === "CS-405") { // Database Management Systems
        this.createCourseBook({
          courseId: id,
          bookId: 5, // "Database System Concepts" book
          addedBy: 2, // Faculty user
          priority: 1,
          isRequired: true
        });
      } else if (course.code === "CS-490") { // Machine Learning
        this.createCourseBook({
          courseId: id,
          bookId: 4, // "Introduction to Machine Learning with Python" book
          addedBy: 2, // Faculty user
          priority: 1,
          isRequired: true
        });
      } else if (course.code === "SE-310") { // Software Engineering
        this.createCourseBook({
          courseId: id,
          bookId: 2, // "Clean Code: A Handbook of Agile Software Craftsmanship" book
          addedBy: 2, // Faculty user
          priority: 1,
          isRequired: true
        });
        this.createCourseBook({
          courseId: id,
          bookId: 3, // "The Pragmatic Programmer" book
          addedBy: 2, // Faculty user
          priority: 2,
          isRequired: false
        });
      }
    });
  }
  
  private addSampleResearchPapers() {
    const samplePapers: InsertResearchPaper[] = [
      {
        title: "Advances in Natural Language Processing for Digital Libraries",
        author: "Sarah Johnson, Michael Chen",
        journal: "Journal of Digital Library Technologies",
        publishDate: "2023-02-15",
        subject: "Computer Science",
        abstract: "This paper explores recent advancements in natural language processing and their applications in digital library systems for improved content discovery and metadata extraction.",
        filePath: "/papers/advances-nlp-digital-libraries.pdf",
        uploadedBy: 2 // Faculty user
      },
      {
        title: "Machine Learning Approaches to Bibliographic Classification",
        author: "David Rodriguez, Emily Patel",
        journal: "International Journal of Library Science",
        publishDate: "2022-11-30",
        subject: "Machine Learning",
        abstract: "A comparative study of various machine learning algorithms used for automated classification of bibliographic records in academic libraries.",
        filePath: "/papers/ml-bibliographic-classification.pdf",
        uploadedBy: 2 // Faculty user
      },
      {
        title: "Blockchain Technology for Library Management Systems",
        author: "Robert Wilson",
        journal: "Emerging Technologies in Library Science",
        publishDate: "2023-05-10",
        subject: "Blockchain",
        abstract: "This research examines how blockchain technology can be implemented in library management systems to enhance security, transparency, and efficiency in resource tracking.",
        filePath: "/papers/blockchain-library-management.pdf",
        uploadedBy: 2 // Faculty user
      },
      {
        title: "Digital Preservation Strategies for Academic Libraries",
        author: "Jennifer Martinez, Thomas Wright",
        journal: "Journal of Library Administration",
        publishDate: "2022-08-22",
        subject: "Digital Preservation",
        abstract: "An analysis of current digital preservation strategies and best practices for academic libraries facing challenges with long-term digital content management.",
        filePath: "/papers/digital-preservation-academic-libraries.pdf",
        uploadedBy: 2 // Faculty user
      },
      {
        title: "User Experience Design in Library Catalog Systems",
        author: "Laura Kim",
        journal: "Human-Computer Interaction in Information Services",
        publishDate: "2023-03-17",
        subject: "User Experience",
        abstract: "This paper presents findings from a study on user experience design principles applied to library catalog systems and their impact on information retrieval efficiency.",
        filePath: "/papers/ux-design-library-catalogs.pdf",
        uploadedBy: 2 // Faculty user
      }
    ];
    
    samplePapers.forEach(paper => {
      const id = this.paperId++;
      const newPaper: ResearchPaper = {
        ...paper,
        id,
        uploadedAt: new Date()
      };
      this.researchPapersMap.set(id, newPaper);
    });
  }
  
  private addSampleAIRecommendations() {
    // Get all books
    const books = Array.from(this.booksMap.values());
    if (books.length === 0) return;
    
    // Create recommendations for the student user (id: 1)
    const studentId = 1;
    const recommendations = [
      {
        bookId: 1,
        reason: "Based on your interest in computer science courses"
      },
      {
        bookId: 4,
        reason: "This book on machine learning complements your current studies"
      },
      {
        bookId: 2,
        reason: "Popular among students with similar reading patterns"
      }
    ];
    
    recommendations.forEach(rec => {
      const id = this.recommendationId++;
      const newRecommendation: AIRecommendation = {
        id,
        userId: studentId,
        bookId: rec.bookId,
        reason: rec.reason,
        createdAt: new Date(),
        viewed: false
      };
      this.aiRecommendationsMap.set(id, newRecommendation);
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
      
      // Create in-app notification for the user
      await this.createNotification({
        userId: nextReservation.userId,
        title: 'Book Available',
        message: `The book "${book.title}" you reserved is now available for pickup.`,
        type: 'reservation',
        relatedData: { reservationId: nextReservation.id, bookId: book.id }
      });
      
      try {
        // Send email notification
        const reservationUser = await this.getUser(nextReservation.userId);
        if (reservationUser) {
          // Import and use email service dynamically to avoid circular dependencies
          const { sendBookAvailableNotification } = await import('./services/email');
          await sendBookAvailableNotification(reservationUser, book, nextReservation);
        }
      } catch (error) {
        console.error('Failed to send email notification:', error);
        // Continue even if email fails - user still has in-app notification
      }
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
