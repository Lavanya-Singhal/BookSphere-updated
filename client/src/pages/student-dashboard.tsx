import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import StatCard from "@/components/dashboard/stat-card";
import SectionHeader from "@/components/dashboard/section-header";
import BookCard from "@/components/books/book-card";
import RecommendedBookCard from "@/components/books/recommended-book-card";
import AIRecommendedBookCard from "@/components/books/ai-recommended-book-card";
import BookDetailModal from "@/components/books/book-detail-modal";
import CourseSelector from "@/components/ui/course-selector";
import ResearchPaperList from "@/components/research/research-paper-list";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { Loader2, Book, Clock, Bookmark, BrainCircuit } from "lucide-react";
import { BookTransaction, AIRecommendation, CourseBook } from "@/lib/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  // Fetch borrowed books
  const { data: borrowedBooks, isLoading: isLoadingBorrowedBooks } = useQuery<BookTransaction[]>({
    queryKey: ["/api/user/books"],
  });
  
  // Fetch AI recommendations
  const { data: aiRecommendations, isLoading: isLoadingRecommendations } = useQuery<AIRecommendation[]>({
    queryKey: ["/api/user/recommendations"],
  });
  
  // Fetch course books when a course is selected
  const { data: courseBooks, isLoading: isLoadingCourseBooks } = useQuery<CourseBook[]>({
    queryKey: [`/api/courses/${selectedCourseId}/books`],
    enabled: !!selectedCourseId,
  });
  
  const showBookDetails = (bookId: number) => {
    setSelectedBookId(bookId);
  };
  
  const closeBookDetails = () => {
    setSelectedBookId(null);
  };
  
  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
  };
  
  return (
    <Layout>
      <PageHeader 
        title={`Student Dashboard`}
        description={`Welcome back, ${user?.name}. Manage your books and explore the library resources.`}
      />
      
      {/* Dashboard Stats */}
      {isLoadingStats ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Books Borrowed"
            value={stats.borrowedCount}
            subtitle={`Out of ${user?.maxBooks || 0} allowed`}
            icon={<Book className="h-6 w-6 text-primary" />}
            borderColor="border-primary"
            iconBgColor="bg-blue-100"
          />
          
          <StatCard
            title="Due Soon"
            value={stats.dueSoonCount}
            subtitle={stats.dueSoonCount === 1 ? "Return in 3 days" : "No books due soon"}
            icon={<Clock className="h-6 w-6 text-warning" />}
            borderColor="border-warning"
            iconBgColor="bg-orange-100"
          />
          
          <StatCard
            title="Pending Reservations"
            value={stats.reservationCount}
            subtitle={stats.availableReservations > 0 ? `${stats.availableReservations} available for pickup` : "No reservations ready"}
            icon={<Bookmark className="h-6 w-6 text-success" />}
            borderColor="border-success"
            iconBgColor="bg-green-100"
          />
        </div>
      )}
      
      {/* Borrowed Books Section */}
      <SectionHeader
        title="My Borrowed Books"
        actionText="View All"
        actionLink="/my-books"
      />
      
      {isLoadingBorrowedBooks ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : borrowedBooks && borrowedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {borrowedBooks.slice(0, 3).map((transaction) => (
            <BookCard
              key={transaction.id}
              transaction={transaction}
              showBookDetails={showBookDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You haven't borrowed any books yet.</p>
          <p className="text-gray-500 mt-2">Start by browsing our collection and finding books you're interested in.</p>
        </div>
      )}
      
      {/* Course Recommended Books Section */}
      <SectionHeader
        title="Course Recommended Books"
        actionText="Browse All Courses"
        actionLink="/books"
      />
      
      <div className="mb-10">
        <CourseSelector 
          selectedCourseId={selectedCourseId}
          onCourseChange={handleCourseChange}
        />
        
        {selectedCourseId ? (
          isLoadingCourseBooks ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : courseBooks && courseBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseBooks.map((courseBook) => (
                <RecommendedBookCard
                  key={courseBook.id}
                  book={courseBook.book!}
                  professorName="Professor Smith"
                  professorReview="Essential reading for understanding the subject."
                  rating={4.5}
                  showBookDetails={showBookDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No recommended books for this course.</p>
            </div>
          )
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Please select a course to see recommended books.</p>
          </div>
        )}
      </div>
      
      {/* AI Recommended Books Section */}
      <SectionHeader
        title="AI Recommended For You"
        actionText="See More"
        actionLink="/books"
        icon={<BrainCircuit className="h-6 w-6 text-accent" />}
      />
      
      {isLoadingRecommendations ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : aiRecommendations && aiRecommendations.length > 0 ? (
        <div className="mb-10">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-5">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-accent">Smart Recommendations:</span>
              Based on your previous borrowing pattern, course selections, and similar student preferences, we think you might like these books.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendations.map((recommendation) => (
              <AIRecommendedBookCard
                key={recommendation.id}
                book={recommendation.book!}
                reason={recommendation.reason}
                showBookDetails={showBookDetails}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 mb-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No AI recommendations available yet.</p>
          <p className="text-gray-500 mt-2">Borrow more books to get personalized recommendations.</p>
        </div>
      )}
      
      {/* Research Papers Section */}
      <SectionHeader
        title="Latest Research Papers"
        actionText="Browse All Papers"
        actionLink="/research-papers"
      />
      
      <ResearchPaperList limit={3} />
      
      {/* Book Detail Modal */}
      <BookDetailModal
        bookId={selectedBookId}
        isOpen={selectedBookId !== null}
        onClose={closeBookDetails}
      />
    </Layout>
  );
}
