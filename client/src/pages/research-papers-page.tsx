import { useState } from "react";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResearchPaperList from "@/components/research/research-paper-list";
import { Search } from "lucide-react";

export default function ResearchPapersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search query
      console.log("Searching for:", searchQuery);
    }
  };
  
  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    { value: "computer-science", label: "Computer Science" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "biology", label: "Biology" },
    { value: "chemistry", label: "Chemistry" },
    { value: "economics", label: "Economics" },
    { value: "psychology", label: "Psychology" },
  ];
  
  return (
    <Layout>
      <PageHeader 
        title="Research Papers"
        description="Access and download academic research papers."
      />
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder="Search papers by title, author, or keywords..."
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
          
          <div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Papers</TabsTrigger>
          <TabsTrigger value="recent">Recently Published</TabsTrigger>
          <TabsTrigger value="popular">Most Downloaded</TabsTrigger>
          <TabsTrigger value="my-downloads">My Downloads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <ResearchPaperList />
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <ResearchPaperList />
        </TabsContent>
        
        <TabsContent value="popular" className="mt-6">
          <ResearchPaperList />
        </TabsContent>
        
        <TabsContent value="my-downloads" className="mt-6">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You haven't downloaded any research papers yet.</p>
            <p className="text-gray-500 mt-2">Browse our collection and download papers you're interested in.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
