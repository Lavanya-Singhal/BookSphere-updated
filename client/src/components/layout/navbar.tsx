import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Menu, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarProps = {
  toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Redirect to search page with query
      window.location.href = `/books/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-primary shadow-md z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <button onClick={toggleSidebar} className="lg:hidden text-white">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center">
              <svg 
                className="w-8 h-8 mr-2 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6V11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 11H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 16H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-white text-xl font-serif font-bold">LibrarySystem</h1>
            </Link>
          </div>
          
          <div className="hidden lg:flex space-x-6 text-white">
            <Link href="/" className={`py-2 px-1 border-b-2 ${isActive('/') ? 'border-white' : 'border-transparent hover:border-white'} font-medium`}>
              Home
            </Link>
            <Link href="/books" className={`py-2 px-1 border-b-2 ${isActive('/books') ? 'border-white' : 'border-transparent hover:border-white'} font-medium`}>
              Books
            </Link>
            <Link href="/research-papers" className={`py-2 px-1 border-b-2 ${isActive('/research-papers') ? 'border-white' : 'border-transparent hover:border-white'} font-medium`}>
              Research Papers
            </Link>
            <Link href="/my-books" className={`py-2 px-1 border-b-2 ${isActive('/my-books') ? 'border-white' : 'border-transparent hover:border-white'} font-medium`}>
              My Books
            </Link>
            
            {user && user.role === 'faculty' && (
              <Link href="/faculty-dashboard" className={`py-2 px-1 border-b-2 ${isActive('/faculty-dashboard') ? 'border-white' : 'border-transparent hover:border-white'} font-medium`}>
                Faculty Portal
              </Link>
            )}
            
            {user && user.role === 'admin' && (
              <Link href="/admin-dashboard" className={`py-2 px-1 border-b-2 ${isActive('/admin-dashboard') ? 'border-white' : 'border-transparent hover:border-white'} font-medium`}>
                Admin Portal
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search books..."
                className="py-1 px-3 pr-8 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-light"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </form>
            
            <button 
              onClick={() => window.location.href = '/books/search'} 
              className="md:hidden text-white"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 text-white">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline-block">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/profile'}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/my-books'}>
                    My Books
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout} disabled={logoutMutation.isPending}>
                    {logoutMutation.isPending ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </div>
                    ) : (
                      'Log out'
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" className="bg-white text-primary" onClick={() => window.location.href = '/auth'}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
