import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Loader2, Download, Mail, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResearchPaper } from "@/lib/types";

interface ResearchPaperListProps {
  limit?: number;
  showPagination?: boolean;
}

export default function ResearchPaperList({ 
  limit = 10,
  showPagination = true 
}: ResearchPaperListProps) {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;
  
  const { data, isLoading, error } = useQuery<ResearchPaper[]>({
    queryKey: [`/api/research-papers?limit=${limit}&offset=${offset}`],
  });
  
  const handleDownload = (paper: ResearchPaper) => {
    // Create a download link for the mock PDF
    const link = document.createElement('a');
    link.href = `/sample-paper.pdf`;
    link.target = "_blank";
    link.download = paper.title.replace(/\s+/g, '-').toLowerCase() + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading ${paper.title}`,
    });
  };
  
  const handleEmail = (paper: ResearchPaper) => {
    // Create a mailto link with the paper details
    const subject = encodeURIComponent(`Research Paper: ${paper.title}`);
    const body = encodeURIComponent(
      `Dear Colleague,\n\nI thought you might be interested in this research paper:\n\n` +
      `Title: ${paper.title}\n` +
      `Author: ${paper.author}\n` +
      `Published: ${paper.publishDate}\n` +
      `Journal: ${paper.journal || 'N/A'}\n\n` +
      `Abstract: ${paper.abstract || 'N/A'}\n\n` +
      `The paper can be accessed through our library system.\n\n` +
      `Regards,\n${localStorage.getItem('userName') || 'A library user'}`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Email Client Opened",
      description: "Paper details have been added to a new email",
    });
  };
  
  const handleViewDetails = (paper: ResearchPaper) => {
    // In a real application, this would show details
    toast({
      title: "Paper Details",
      description: `Viewing details for ${paper.title}`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-error">
        <p>Error loading research papers. Please try again later.</p>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No research papers available.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((paper) => (
              <TableRow key={paper.id} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{paper.title}</div>
                      <div className="text-sm text-gray-500">{paper.journal || 'No Journal'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{paper.author}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-accent">
                    {paper.subject}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(paper.publishDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(paper)}
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEmail(paper)}
                      title="Email to me"
                    >
                      <Mail className="h-4 w-4 text-primary" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDetails(paper)}
                      title="View Details"
                    >
                      <Info className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {showPagination && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{offset + 1}</span> to{" "}
                <span className="font-medium">{Math.min(offset + limit, 97)}</span> of{" "}
                <span className="font-medium">97</span> results
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }} 
                  />
                </PaginationItem>
                {[...Array(5)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
