import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Info, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { BookTransaction } from "@/lib/types";

interface BookCardProps {
  transaction: BookTransaction;
  showBookDetails: (bookId: number) => void;
}

export default function BookCard({ transaction, showBookDetails }: BookCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isReturning, setIsReturning] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  
  const dueDate = new Date(transaction.dueDate);
  const today = new Date();
  const isDueSoon = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 3;
  const isOverdue = dueDate < today;
  
  const returnMutation = useMutation({
    mutationFn: async () => {
      setIsReturning(true);
      const res = await apiRequest("POST", `/api/transactions/${transaction.id}/return`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book returned successfully",
        description: "The book has been returned to the library.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/books"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to return book",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsReturning(false);
    }
  });
  
  const handleReturn = () => {
    returnMutation.mutate();
  };
  
  const handleRenew = () => {
    setIsRenewing(true);
    // Implement renew functionality here
    toast({
      title: "Renewal Feature",
      description: "Renewal functionality is coming soon!",
      variant: "default",
    });
    setIsRenewing(false);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-800">{transaction.book?.title}</h3>
            {isDueSoon && !isOverdue && (
              <AlertCircle className="h-5 w-5 text-warning" title="Due soon" />
            )}
            {isOverdue && (
              <AlertCircle className="h-5 w-5 text-error" title="Overdue" />
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">{transaction.book?.author}</p>
          
          <div className="flex items-center space-x-2 mt-3">
            {transaction.book?.subjects?.map((subject, index) => (
              <span key={index} className="text-xs bg-blue-100 text-primary px-2 py-1 rounded-full">
                {subject}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-500">Due date:</span>
              <span className={`font-medium ${isOverdue ? 'text-error' : isDueSoon ? 'text-warning' : 'text-gray-700'}`}>
                {dueDate.toLocaleDateString()}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRenew}
              disabled={isRenewing}
              className="text-primary hover:text-primary-dark"
            >
              {isRenewing ? 'Renewing...' : 'Renew'}
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showBookDetails(transaction.book?.id || 0)}
            className="text-primary hover:text-primary-dark"
          >
            <Info className="mr-1 h-4 w-4" /> Details
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleReturn}
            disabled={isReturning}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            {isReturning ? (
              <>
                <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                Returning...
              </>
            ) : (
              <>
                <ArrowLeft className="mr-1 h-4 w-4" /> Return
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
