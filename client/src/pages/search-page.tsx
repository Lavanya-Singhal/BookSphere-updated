import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookList from "@/components/books/book-list";
import ResearchPaperList from "@/components/research/research-paper-list";
import BookDetailModal from "@/components/books/book-detail-modal";
import { Loader2, Search } from "lucide-react";
import { Book } from "@/lib/types";

export default function SearchPage() {
  const [, location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("books");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  
  // Extract search query from URL if it exists
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, []);
  
  // Fetch search results when query changes
  const { data: searchResults, isLoading, error } = useQuery<Book[]>({
    queryKey: [`/api/books/search?q=${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 0,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      location(`/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
        title="Search Library Resources"
        description="Find books, research papers, and other resources."
      />
      
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto">
          <Input
            type="text"
            placeholder="Search by title, author, ISBN, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </form>
      </div>
      
      {/* Search Results */}
      {searchQuery ? (
        <>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="research">Research Papers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="books" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center my-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-error">Error loading search results. Please try again.</p>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-4">Search Results for "{searchQuery}"</h3>
                  <BookList books={searchResults} showBookDetails={showBookDetails} />
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No books found matching "{searchQuery}".</p>
                  <p className="text-gray-500 mt-2">Try different keywords or browse our collection.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="research" className="mt-6">
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Research paper search is currently in development.</p>
                <p className="text-gray-500 mt-2">Please check back soon or browse our collection.</p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Enter a search term</h3>
          <p className="text-gray-600">Search for books by title, author, ISBN, or keywords.</p>
        </div>
      )}
      
      {/* Book Detail Modal */}
      <BookDetailModal
        bookId={selectedBookId}
        isOpen={selectedBookId !== null}
        onClose={closeBookDetails}
      />
    </Layout>
  );
}
