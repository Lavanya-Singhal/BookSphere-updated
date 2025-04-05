// Type definitions for the client side

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  maxBooks: number;
  borrowedCount: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  year: number;
  edition?: string;
  description: string;
  subjects: string[];
  location: string;
  copiesTotal: number;
  copiesAvailable: number;
  coverImage?: string;
  addedBy?: number;
  addedAt: string | Date;
}

export interface BookTransaction {
  id: number;
  bookId: number;
  userId: number;
  issueDate: string | Date;
  dueDate: string | Date;
  returnDate: string | Date | null;
  fineAmount: number;
  finePaid: boolean;
  status: 'active' | 'returned' | 'overdue';
  book?: Book; // When joined with book details
}

export interface BookReservation {
  id: number;
  bookId: number;
  userId: number;
  reservationDate: string | Date;
  expiryDate: string | Date;
  status: 'pending' | 'ready' | 'canceled' | 'completed';
  notifiedAt: string | Date | null;
  book?: Book; // When joined with book details
}

export interface BookReview {
  id: number;
  bookId: number;
  userId: number;
  rating: number;
  review?: string;
  createdAt: string | Date;
  user?: User; // When joined with user details
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  department: string;
}

export interface CourseBook {
  id: number;
  courseId: number;
  bookId: number;
  addedBy: number;
  priority: number;
  isRequired: boolean;
  book?: Book; // When joined with book details
}

export interface ResearchPaper {
  id: number;
  title: string;
  author: string;
  journal?: string;
  publishDate: string | Date;
  subject: string;
  abstract?: string;
  filePath: string;
  uploadedBy: number;
  uploadedAt: string | Date;
}

export interface AIRecommendation {
  id: number;
  userId: number;
  bookId: number;
  reason: string;
  createdAt: string | Date;
  viewed: boolean;
  book?: Book; // When joined with book details
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'due_date' | 'reservation' | 'fine' | 'system';
  read: boolean;
  createdAt: string | Date;
  relatedData?: any;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardStats {
  borrowedCount: number;
  dueSoonCount: number;
  reservationCount: number;
  availableReservations: number;
}
