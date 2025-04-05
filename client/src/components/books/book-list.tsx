import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book } from "@/lib/types";
import { Book as BookIcon, Info } from "lucide-react";

interface BookListProps {
  books: Book[];
  showBookDetails: (bookId: number) => void;
}

export default function BookList({ books, showBookDetails }: BookListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center mr-4">
                    <BookIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {book.subjects.map((subject: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t text-sm text-gray-500 grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-gray-400">ISBN:</span>
                    <span>{book.isbn || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Published:</span>
                    <span>{book.year || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Available:</span>
                    <span>{book.copiesAvailable || 0} of {book.copiesTotal || 0}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Location:</span>
                    <span>{book.location || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center"
                    onClick={() => showBookDetails(book.id)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}