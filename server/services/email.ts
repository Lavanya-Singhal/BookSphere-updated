import { MailService } from '@sendgrid/mail';
import { User, Book, BookReservation } from '@shared/schema';

// Initialize SendGrid client
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set! Email notifications will not be sent.");
}

const sendgrid = new MailService();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

// Default sender email address
const DEFAULT_FROM_EMAIL = 'library@university.edu';

// Email templates
const TEMPLATES = {
  BOOK_AVAILABLE: (book: Book, expiryDate: Date) => ({
    subject: `Book Available: ${book.title}`,
    body: `
      <h2>Your Reserved Book is Available</h2>
      <p>Great news! The book you requested is now available for pickup:</p>
      <p><strong>${book.title}</strong> by ${book.author}</p>
      <p>Book Location: ${book.location}</p>
      <p>Please pick up your book by <strong>${expiryDate.toLocaleDateString()}</strong>. If not picked up by this date, your reservation will expire and the book will be made available to other users.</p>
      <p>Thank you for using our library services!</p>
    `
  }),
  
  BOOK_DUE_REMINDER: (book: Book, dueDate: Date) => ({
    subject: `Reminder: Book Due Soon - ${book.title}`,
    body: `
      <h2>Book Due Reminder</h2>
      <p>This is a friendly reminder that the following book is due soon:</p>
      <p><strong>${book.title}</strong> by ${book.author}</p>
      <p>Due Date: <strong>${dueDate.toLocaleDateString()}</strong></p>
      <p>Please return the book to the library by the due date to avoid any late fees.</p>
      <p>Thank you for using our library services!</p>
    `
  }),
  
  SHARE_RESEARCH_PAPER: (paperTitle: string, paperAuthor: string, downloadLink: string) => ({
    subject: `Research Paper: ${paperTitle}`,
    body: `
      <h2>Research Paper Shared</h2>
      <p>As requested, here is the research paper:</p>
      <p><strong>${paperTitle}</strong> by ${paperAuthor}</p>
      <p>You can download the paper using this link: <a href="${downloadLink}">${downloadLink}</a></p>
      <p>Thank you for using our library services!</p>
    `
  })
};

/**
 * Send an email notification
 * @param to Recipient email address
 * @param subject Email subject
 * @param html HTML content of the email
 * @param from Sender email address (defaults to library@university.edu)
 * @returns Promise resolving to boolean indicating success or failure
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from: string = DEFAULT_FROM_EMAIL
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(`[EMAIL NOT SENT - NO API KEY] To: ${to}, Subject: ${subject}`);
    return false;
  }
  
  try {
    await sendgrid.send({
      to,
      from,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send a notification when a reserved book becomes available
 */
export async function sendBookAvailableNotification(
  user: User,
  book: Book,
  reservation: BookReservation
): Promise<boolean> {
  const template = TEMPLATES.BOOK_AVAILABLE(book, reservation.expiryDate);
  return sendEmail(user.email, template.subject, template.body);
}

/**
 * Send a reminder when a book is due soon (e.g., in 3 days)
 */
export async function sendBookDueReminderNotification(
  user: User,
  book: Book,
  dueDate: Date
): Promise<boolean> {
  const template = TEMPLATES.BOOK_DUE_REMINDER(book, dueDate);
  return sendEmail(user.email, template.subject, template.body);
}

/**
 * Share a research paper via email
 */
export async function sendResearchPaperEmail(
  to: string,
  paperTitle: string,
  paperAuthor: string,
  downloadLink: string
): Promise<boolean> {
  const template = TEMPLATES.SHARE_RESEARCH_PAPER(paperTitle, paperAuthor, downloadLink);
  return sendEmail(to, template.subject, template.body);
}