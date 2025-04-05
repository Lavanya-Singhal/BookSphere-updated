import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import SectionHeader from "@/components/dashboard/section-header";
import StatCard from "@/components/dashboard/stat-card";
import BookDetailModal from "@/components/books/book-detail-modal";
import BookCard from "@/components/books/book-card";
import CourseSelector from "@/components/ui/course-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { 
  Loader2, 
  Book, 
  Clock, 
  BookPlus, 
  FileText, 
  Users, 
  Star, 
  PlusCircle 
} from "lucide-react";
import { Link } from "wouter";
import { BookTransaction, CourseBook } from "@/lib/types";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  
  // Fetch borrowed books
  const { data: borrowedBooks, isLoading: isLoadingBorrowedBooks } = useQuery<BookTransaction[]>({
    queryKey: ["/api/user/books"],
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
        title="Faculty Dashboard"
        description={`Welcome, Professor ${user?.name}. Manage your resources and recommendations.`}
      />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <Link href="/add-book">
              <a className="block p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <BookPlus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Add New Book</h3>
                      <p className="text-sm text-gray-500">Recommend a book to BookSphere</p>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <Link href="/add-research-paper">
              <a className="block p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Upload Research Paper</h3>
                      <p className="text-sm text-gray-500">Share your research with students</p>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <Link href="/manage-courses">
              <a className="block p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Manage Course Books</h3>
                      <p className="text-sm text-gray-500">Update recommended books for your courses</p>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>
      
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
            subtitle={`Out of 4 allowed`}
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
            title="Book Reviews"
            value="24"
            subtitle="From students on your recommendations"
            icon={<Star className="h-6 w-6 text-yellow-500" />}
            borderColor="border-yellow-500"
            iconBgColor="bg-yellow-100"
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
        </div>
      )}
      
      {/* Course Books Management */}
      <SectionHeader
        title="Manage Course Books"
        actionText="Manage All Courses"
        actionLink="/manage-courses"
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
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button variant="default" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Book to Course
                </Button>
              </div>
              
              {courseBooks && courseBooks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courseBooks.map((courseBook) => (
                    <Card key={courseBook.id} className="flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{courseBook.book?.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{courseBook.book?.author}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">Your rating</span>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">
                            {courseBook.isRequired ? 'Required' : 'Recommended'}
                          </span>
                          <span className="text-xs bg-purple-100 text-accent px-2 py-1 rounded-full">
                            Priority: {courseBook.priority}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Remove</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No books added to this course yet.</p>
                  <p className="text-gray-500 mt-2">Add books to help students find the right resources.</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Please select a course to manage its books.</p>
          </div>
        )}
      </div>
      
      {/* Research Papers Section */}
      <SectionHeader
        title="My Research Papers"
        actionText="Upload New Paper"
        actionLink="/add-research-paper"
      />
      
      <div className="mb-10">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Research Papers Uploaded</h3>
            <p className="text-gray-500 mb-4">Upload your research papers for students to access and download.</p>
            <Button variant="default">
              <PlusCircle className="h-4 w-4 mr-2" />
              Upload Research Paper
            </Button>
          </div>
        </div>
      </div>
      
      {/* Book Detail Modal */}
      <BookDetailModal
        bookId={selectedBookId}
        isOpen={selectedBookId !== null}
        onClose={closeBookDetails}
      />
    </Layout>
  );
}
