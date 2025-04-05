import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookList from "@/components/books/book-list";
import CourseSelector from "@/components/ui/course-selector";
import BookDetailModal from "@/components/books/book-detail-modal";
import RecommendedBookCard from "@/components/books/recommended-book-card";
import { Loader2, Search } from "lucide-react";
import { Book, CourseBook } from "@/lib/types";

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  
  // Fetch all books
  const { data: books, isLoading: isLoadingBooks } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });
  
  // Fetch course books when a course is selected
  const { data: courseBooks, isLoading: isLoadingCourseBooks } = useQuery<CourseBook[]>({
    queryKey: [`/api/courses/${selectedCourseId}/books`],
    enabled: !!selectedCourseId && selectedTab === "courses",
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search query
      console.log("Searching for:", searchQuery);
    }
  };
  
  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
  };
  
  const showBookDetails = (bookId: number) => {
    setSelectedBookId(bookId);
  };
  
  const closeBookDetails = () => {
    setSelectedBookId(null);
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Books Collection"
        description="Browse our extensive collection of books and resources."
      />
      
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>
      
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="courses">Course Books</TabsTrigger>
          <TabsTrigger value="popular">Popular Books</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {isLoadingBooks ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : books && books.length > 0 ? (
            <BookList books={books} showBookDetails={showBookDetails} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No books found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="courses" className="mt-6">
          <CourseSelector 
            selectedCourseId={selectedCourseId}
            onCourseChange={handleCourseChange}
          />
          
          {selectedCourseId ? (
            isLoadingCourseBooks ? (
              <div className="flex justify-center my-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : courseBooks && courseBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseBooks.map((courseBook) => (
                  <RecommendedBookCard
                    key={courseBook.id}
                    book={courseBook.book!}
                    rating={4.5}
                    showBookDetails={showBookDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No course books found for this course.</p>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Please select a course to view its recommended books.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-6">
          {isLoadingBooks ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : books && books.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Most Borrowed Books</h3>
              <BookList books={books.slice(0, 6)} showBookDetails={showBookDetails} />
              
              <h3 className="text-lg font-medium mb-4 mt-8">Highest Rated Books</h3>
              <BookList books={books.slice(0, 6).reverse()} showBookDetails={showBookDetails} />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No popular books found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Book Detail Modal */}
      <BookDetailModal
        bookId={selectedBookId}
        isOpen={selectedBookId !== null}
        onClose={closeBookDetails}
      />
    </Layout>
  );
}
