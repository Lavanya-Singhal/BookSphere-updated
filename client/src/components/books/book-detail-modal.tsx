import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Star, StarHalf, BookOpen, MapPin, Barcode, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Book, BookReview } from "@/lib/types";

interface BookDetailModalProps {
  bookId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrow?: () => void;
}

export default function BookDetailModal({
  bookId,
  isOpen,
  onClose,
  onBorrow
}: BookDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  
  // Fetch book details
  const { data: book, isLoading: isLoadingBook } = useQuery<Book>({
    queryKey: [`/api/books/${bookId}`],
    enabled: isOpen && !!bookId,
  });
  
  // Fetch book reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<BookReview[]>({
    queryKey: [`/api/books/${bookId}/reviews`],
    enabled: isOpen && !!bookId,
  });
  
  const averageRating = reviews?.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
    
  // Mutation for borrowing a book
  const borrowMutation = useMutation({
    mutationFn: async () => {
      setIsBorrowing(true);
      if (!bookId) throw new Error("Book ID is missing");
      const res = await apiRequest("POST", `/api/books/${bookId}/borrow`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book borrowed successfully",
        description: `You have borrowed "${book?.title}". It's due back in 14 days.`,
        variant: "default",
      });
      // Invalidate queries to update book count and user's borrowed books
      queryClient.invalidateQueries({ queryKey: ["/api/user/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: [`/api/books/${bookId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to borrow book",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsBorrowing(false);
    }
  });
  
  // Mutation for reserving a book
  const reserveMutation = useMutation({
    mutationFn: async () => {
      setIsReserving(true);
      if (!bookId) throw new Error("Book ID is missing");
      const res = await apiRequest("POST", `/api/books/${bookId}/reserve`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book reserved successfully",
        description: `You have reserved "${book?.title}". You'll receive an email notification when it becomes available.`,
        variant: "default",
      });
      // Invalidate queries to update user's reservations
      queryClient.invalidateQueries({ queryKey: ["/api/user/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/dashboard/stats"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to reserve book",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsReserving(false);
    }
  });
  
  const handleBorrow = () => {
    if (onBorrow) {
      onBorrow();
    } else {
      borrowMutation.mutate();
    }
  };
  
  const handleReserve = () => {
    reserveMutation.mutate();
  };
  
  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        
        <span className="ml-1 text-sm text-gray-600">
          {rating.toFixed(1)} {reviews ? `(${reviews.length} reviews)` : ''}
        </span>
      </div>
    );
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif font-bold text-gray-800">Book Details</DialogTitle>
        </DialogHeader>
        
        {isLoadingBook ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : book ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="max-h-full max-w-full object-contain" 
                  />
                ) : (
                  <BookOpen className="text-gray-400 h-24 w-24" />
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${book.copiesAvailable > 0 ? 'text-success' : 'text-error'}`}>
                    {book.copiesAvailable > 0 ? `Available (${book.copiesAvailable})` : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{book.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ISBN:</span>
                  <span className="font-medium">{book.isbn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publication Year:</span>
                  <span className="font-medium">{book.year}</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-2xl font-serif font-bold text-gray-800">{book.title}</h2>
              <p className="text-gray-600 mt-1">{book.author}</p>
              
              <div className="mt-4 flex items-center space-x-4">
                {renderRating(averageRating)}
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {book.subjects.map((subject, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">
                  {book.description}
                </p>
              </div>
              
              {isLoadingReviews ? (
                <div className="mt-6 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Reviews</h3>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-l-4 border-blue-200 pl-4 py-2">
                        <div className="flex items-center mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {[...Array(5 - review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                        {review.review && (
                          <p className="text-gray-600">{review.review}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          - {review.user?.name || 'Anonymous'}, 
                          {review.user?.role === 'faculty' ? ' Faculty' : ' Student'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Reviews</h3>
                  <p className="text-gray-500 italic">No reviews yet for this book.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-error">Failed to load book details. Please try again.</p>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {book && book.copiesAvailable > 0 && (
            <Button 
              variant="default" 
              onClick={handleBorrow}
              disabled={isBorrowing}
            >
              {isBorrowing ? (
                <>
                  <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                  Borrowing...
                </>
              ) : 'Borrow'}
            </Button>
          )}
          
          {book && book.copiesAvailable === 0 && (
            <Button 
              variant="secondary" 
              onClick={handleReserve}
              disabled={isReserving}
            >
              {isReserving ? (
                <>
                  <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                  Reserving...
                </>
              ) : 'Reserve'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
