import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookCard from "@/components/books/book-card";
import BookDetailModal from "@/components/books/book-detail-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Clock, BookmarkCheck, History, AlertTriangle } from "lucide-react";
import { BookTransaction, BookReservation } from "@/lib/types";

export default function MyBooksPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("borrowed");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  
  // Fetch borrowed books
  const { data: borrowedBooks, isLoading: isLoadingBorrowedBooks } = useQuery<BookTransaction[]>({
    queryKey: ["/api/user/books"],
  });
  
  // Fetch reservations
  const { data: reservedBooks, isLoading: isLoadingReservations } = useQuery<BookReservation[]>({
    queryKey: ["/api/user/reservations"],
  });
  
  const showBookDetails = (bookId: number) => {
    setSelectedBookId(bookId);
  };
  
  const closeBookDetails = () => {
    setSelectedBookId(null);
  };
  
  // Filter borrowed books for those that are due soon (within 3 days)
  const dueSoonBooks = borrowedBooks?.filter(transaction => {
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  });
  
  // Filter borrowed books for those that are overdue
  const overdueBooks = borrowedBooks?.filter(transaction => {
    const dueDate = new Date(transaction.dueDate);
    const today = new Date();
    return dueDate < today;
  });
  
  // Filter reservations that are ready for pickup
  const readyReservations = reservedBooks?.filter(
    reservation => reservation.status === 'ready'
  );
  
  return (
    <Layout>
      <PageHeader 
        title="My Books"
        description="Manage your borrowed books, reservations, and history."
      />
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className={`${selectedTab === 'borrowed' ? 'border-primary' : ''}`}>
          <CardContent 
            className="p-0 cursor-pointer" 
            onClick={() => setSelectedTab('borrowed')}
          >
            <div className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Currently Borrowed</p>
                <p className="text-2xl font-bold">{borrowedBooks?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${selectedTab === 'due-soon' ? 'border-primary' : ''}`}>
          <CardContent 
            className="p-0 cursor-pointer" 
            onClick={() => setSelectedTab('due-soon')}
          >
            <div className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Due Soon</p>
                <p className="text-2xl font-bold">{dueSoonBooks?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${selectedTab === 'reservations' ? 'border-primary' : ''}`}>
          <CardContent 
            className="p-0 cursor-pointer" 
            onClick={() => setSelectedTab('reservations')}
          >
            <div className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <BookmarkCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Reservations</p>
                <p className="text-2xl font-bold">{reservedBooks?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${selectedTab === 'history' ? 'border-primary' : ''}`}>
          <CardContent 
            className="p-0 cursor-pointer" 
            onClick={() => setSelectedTab('history')}
          >
            <div className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <History className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">History</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="borrowed">Currently Borrowed</TabsTrigger>
          <TabsTrigger value="due-soon">Due Soon</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="borrowed" className="mt-6">
          {isLoadingBorrowedBooks ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : borrowedBooks && borrowedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map((transaction) => (
                <BookCard
                  key={transaction.id}
                  transaction={transaction}
                  showBookDetails={showBookDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">You haven't borrowed any books yet.</p>
              <p className="text-gray-500 mt-2">Browse our collection and find books you're interested in.</p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={() => window.location.href = '/books'}
              >
                Browse Books
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="due-soon" className="mt-6">
          {isLoadingBorrowedBooks ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dueSoonBooks && dueSoonBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dueSoonBooks.map((transaction) => (
                <BookCard
                  key={transaction.id}
                  transaction={transaction}
                  showBookDetails={showBookDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">You don't have any books due soon.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reservations" className="mt-6">
          {isLoadingReservations ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reservedBooks && reservedBooks.length > 0 ? (
            <div>
              {readyReservations && readyReservations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Ready for Pickup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {readyReservations.map((reservation) => (
                      <Card key={reservation.id}>
                        <CardContent className="p-4">
                          <div className="mb-2">
                            <h4 className="font-medium">{reservation.book?.title}</h4>
                            <p className="text-sm text-gray-600">{reservation.book?.author}</p>
                          </div>
                          <div className="flex items-center mt-3">
                            <span className="text-xs bg-green-100 text-success px-2 py-1 rounded-full">
                              Ready for Pickup
                            </span>
                          </div>
                          <div className="mt-4 text-sm text-gray-600">
                            <p>Available until: {new Date(reservation.expiryDate).toLocaleDateString()}</p>
                          </div>
                          <div className="mt-4 flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => showBookDetails(reservation.book?.id || 0)}>
                              Details
                            </Button>
                            <Button variant="default" size="sm">
                              Borrow
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-medium mb-4">Pending Reservations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservedBooks
                  .filter(reservation => reservation.status === 'pending')
                  .map((reservation) => (
                    <Card key={reservation.id}>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <h4 className="font-medium">{reservation.book?.title}</h4>
                          <p className="text-sm text-gray-600">{reservation.book?.author}</p>
                        </div>
                        <div className="flex items-center mt-3">
                          <span className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <p>Reserved on: {new Date(reservation.reservationDate).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => showBookDetails(reservation.book?.id || 0)}>
                            Details
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">You don't have any reserved books.</p>
              <p className="text-gray-500 mt-2">Browse our collection and reserve books that are currently unavailable.</p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={() => window.location.href = '/books'}
              >
                Browse Books
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Your transaction history will appear here.</p>
          </div>
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
