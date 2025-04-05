import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Info, BookmarkPlus, PlusCircle } from "lucide-react";
import { Book } from "@/lib/types";

interface AIRecommendedBookCardProps {
  book: Book;
  reason: string;
  showBookDetails: (bookId: number) => void;
}

export default function AIRecommendedBookCard({
  book,
  reason,
  showBookDetails
}: AIRecommendedBookCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  
  const isAvailable = book.copiesAvailable > 0;
  
  const borrowMutation = useMutation({
    mutationFn: async () => {
      setIsBorrowing(true);
      const res = await apiRequest("POST", `/api/books/${book.id}/borrow`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book borrowed successfully",
        description: `You have borrowed "${book.title}"`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/books"] });
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
  
  const reserveMutation = useMutation({
    mutationFn: async () => {
      setIsReserving(true);
      const res = await apiRequest("POST", `/api/books/${book.id}/reserve`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book reserved successfully",
        description: `You will be notified when "${book.title}" becomes available`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/reservations"] });
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
    borrowMutation.mutate();
  };
  
  const handleReserve = () => {
    reserveMutation.mutate();
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-800">{book.title}</h3>
          </div>
          
          <p className="text-gray-600 text-sm mt-1">{book.author}</p>
          
          <div className="flex items-center space-x-2 mt-3">
            <span className={`text-xs ${
              isAvailable 
                ? 'bg-green-100 text-success' 
                : book.copiesAvailable === 0 
                  ? 'bg-red-100 text-error' 
                  : 'bg-yellow-100 text-warning'
            } px-2 py-1 rounded-full`}>
              {isAvailable 
                ? book.copiesAvailable > 1 
                  ? `${book.copiesAvailable} Copies Available` 
                  : 'Available'
                : 'Not Available'}
            </span>
            
            {book.subjects?.slice(0, 1).map((subject, index) => (
              <span key={index} className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">
                {subject}
              </span>
            ))}
          </div>
          
          <div className="mt-3 p-2 bg-purple-50 rounded text-sm">
            <p className="text-gray-700">
              <span className="text-accent font-medium">Why we recommend this:</span> 
              {reason}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showBookDetails(book.id)}
            className="text-primary hover:text-primary-dark"
          >
            <Info className="mr-1 h-4 w-4" /> Details
          </Button>
          
          {isAvailable ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleBorrow}
              disabled={isBorrowing}
              className="bg-primary hover:bg-primary-dark text-white"
            >
              {isBorrowing ? (
                <>
                  <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                  Borrowing...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-1 h-4 w-4" /> Borrow
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReserve}
              disabled={isReserving}
            >
              {isReserving ? (
                <>
                  <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                  Reserving...
                </>
              ) : (
                <>
                  <BookmarkPlus className="mr-1 h-4 w-4" /> Reserve
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
