import { pgTable, text, serial, integer, boolean, date, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// USER SCHEMA
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["student", "faculty", "admin"] }).notNull().default("student"),
  maxBooks: integer("max_books").notNull().default(4),
  borrowedCount: integer("borrowed_count").notNull().default(0),
});

export const userRelations = relations(users, ({ many }) => ({
  borrowedBooks: many(bookTransactions),
  reservations: many(bookReservations),
  researchPapers: many(researchPapers),
}));

// BOOK SCHEMA
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  publisher: text("publisher").notNull(),
  isbn: text("isbn").notNull().unique(),
  year: integer("year").notNull(),
  edition: text("edition"),
  description: text("description").notNull(),
  subjects: text("subjects").array(),
  location: text("location").notNull(),
  copiesTotal: integer("copies_total").notNull().default(1),
  copiesAvailable: integer("copies_available").notNull().default(1),
  coverImage: text("cover_image"),
  addedBy: integer("added_by").references(() => users.id),
  addedAt: timestamp("added_at").defaultNow(),
});

export const bookRelations = relations(books, ({ many, one }) => ({
  transactions: many(bookTransactions),
  reservations: many(bookReservations),
  reviews: many(bookReviews),
  courseBooks: many(courseBooks),
  addedByUser: one(users, {
    fields: [books.addedBy],
    references: [users.id],
  }),
}));

// BOOK TRANSACTIONS SCHEMA
export const bookTransactions = pgTable("book_transactions", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => books.id),
  userId: integer("user_id").notNull().references(() => users.id),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  fineAmount: doublePrecision("fine_amount").default(0),
  finePaid: boolean("fine_paid").default(false),
  status: text("status", { enum: ["active", "returned", "overdue"] }).notNull().default("active"),
});

export const bookTransactionRelations = relations(bookTransactions, ({ one }) => ({
  book: one(books, {
    fields: [bookTransactions.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [bookTransactions.userId],
    references: [users.id],
  }),
}));

// BOOK RESERVATIONS SCHEMA
export const bookReservations = pgTable("book_reservations", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => books.id),
  userId: integer("user_id").notNull().references(() => users.id),
  reservationDate: timestamp("reservation_date").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  status: text("status", { enum: ["pending", "ready", "canceled", "completed"] }).notNull().default("pending"),
  notifiedAt: timestamp("notified_at"),
});

export const bookReservationRelations = relations(bookReservations, ({ one }) => ({
  book: one(books, {
    fields: [bookReservations.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [bookReservations.userId],
    references: [users.id],
  }),
}));

// BOOK REVIEWS SCHEMA
export const bookReviews = pgTable("book_reviews", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => books.id),
  userId: integer("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookReviewRelations = relations(bookReviews, ({ one }) => ({
  book: one(books, {
    fields: [bookReviews.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [bookReviews.userId],
    references: [users.id],
  }),
}));

// COURSES SCHEMA
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  department: text("department").notNull(),
});

export const courseRelations = relations(courses, ({ many }) => ({
  courseBooks: many(courseBooks),
}));

// COURSE BOOKS SCHEMA
export const courseBooks = pgTable("course_books", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  addedBy: integer("added_by").notNull().references(() => users.id),
  priority: integer("priority").notNull().default(1),
  isRequired: boolean("is_required").notNull().default(false),
});

export const courseBookRelations = relations(courseBooks, ({ one }) => ({
  course: one(courses, {
    fields: [courseBooks.courseId],
    references: [courses.id],
  }),
  book: one(books, {
    fields: [courseBooks.bookId],
    references: [books.id],
  }),
  addedByUser: one(users, {
    fields: [courseBooks.addedBy],
    references: [users.id],
  }),
}));

// RESEARCH PAPERS SCHEMA
export const researchPapers = pgTable("research_papers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  journal: text("journal"),
  publishDate: date("publish_date").notNull(),
  subject: text("subject").notNull(),
  abstract: text("abstract"),
  filePath: text("file_path").notNull(),
  uploadedBy: integer("uploaded_by").notNull().references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const researchPaperRelations = relations(researchPapers, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [researchPapers.uploadedBy],
    references: [users.id],
  }),
}));

// AI RECOMMENDATIONS SCHEMA
export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  viewed: boolean("viewed").default(false),
});

export const aiRecommendationRelations = relations(aiRecommendations, ({ one }) => ({
  user: one(users, {
    fields: [aiRecommendations.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [aiRecommendations.bookId],
    references: [books.id],
  }),
}));

// NOTIFICATIONS SCHEMA
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["due_date", "reservation", "fine", "system"] }).notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  relatedData: jsonb("related_data"),
});

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// INSERT SCHEMAS
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  borrowedCount: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  addedAt: true,
});

export const insertBookTransactionSchema = createInsertSchema(bookTransactions).omit({
  id: true,
  issueDate: true,
  returnDate: true,
  fineAmount: true,
  finePaid: true,
  status: true,
});

export const insertBookReservationSchema = createInsertSchema(bookReservations).omit({
  id: true,
  reservationDate: true,
  status: true,
  notifiedAt: true,
});

export const insertBookReviewSchema = createInsertSchema(bookReviews).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertCourseBookSchema = createInsertSchema(courseBooks).omit({
  id: true,
});

export const insertResearchPaperSchema = createInsertSchema(researchPapers).omit({
  id: true,
  uploadedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true,
});

// EXPORT TYPES
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type BookTransaction = typeof bookTransactions.$inferSelect;
export type InsertBookTransaction = z.infer<typeof insertBookTransactionSchema>;

export type BookReservation = typeof bookReservations.$inferSelect;
export type InsertBookReservation = z.infer<typeof insertBookReservationSchema>;

export type BookReview = typeof bookReviews.$inferSelect;
export type InsertBookReview = z.infer<typeof insertBookReviewSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CourseBook = typeof courseBooks.$inferSelect;
export type InsertCourseBook = z.infer<typeof insertCourseBookSchema>;

export type ResearchPaper = typeof researchPapers.$inferSelect;
export type InsertResearchPaper = z.infer<typeof insertResearchPaperSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type AIRecommendation = typeof aiRecommendations.$inferSelect;
