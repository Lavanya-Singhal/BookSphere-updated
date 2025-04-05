import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Book,
  BookOpen,
  FileText,
  BookMarked,
  History,
  User,
  LogOut,
  X,
  Settings,
  BarChart,
  BookPlus,
  FilePlus,
  Users
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => location === path;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              className="w-8 h-8 mr-2 text-primary" 
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
            <h2 className="text-xl font-serif font-bold text-primary">LibrarySystem</h2>
          </div>
          <button onClick={onClose} className="text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="py-4">
        {user && (
          <div className="px-4 py-2 mb-2">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
        
        <div 
          className={`block px-4 py-2 cursor-pointer ${isActive('/') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => {
            onClose();
            window.location.href = '/';
          }}
        >
          <div className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Home
          </div>
        </div>
        
        <div 
          className={`block px-4 py-2 cursor-pointer ${isActive('/books') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => {
            onClose();
            window.location.href = '/books';
          }}
        >
          <div className="flex items-center">
            <Book className="mr-2 h-5 w-5" />
            Books
          </div>
        </div>
        
        <div 
          className={`block px-4 py-2 cursor-pointer ${isActive('/research-papers') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => {
            onClose();
            window.location.href = '/research-papers';
          }}
        >
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Research Papers
          </div>
        </div>
        
        {user && (
          <>
            <div 
              className={`block px-4 py-2 cursor-pointer ${isActive('/my-books') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => {
                onClose();
                window.location.href = '/my-books';
              }}
            >
              <div className="flex items-center">
                <BookMarked className="mr-2 h-5 w-5" />
                My Borrowed Books
              </div>
            </div>
            
            <div 
              className={`block px-4 py-2 cursor-pointer ${isActive('/profile') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => {
                onClose();
                window.location.href = '/profile';
              }}
            >
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile
              </div>
            </div>
            
            {user.role === 'faculty' && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <p className="px-4 py-1 text-xs uppercase text-gray-500 font-semibold">Faculty Actions</p>
                
                <div 
                  className={`block px-4 py-2 cursor-pointer ${isActive('/faculty-dashboard') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    onClose();
                    window.location.href = '/faculty-dashboard';
                  }}
                >
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Faculty Dashboard
                  </div>
                </div>
                
                <div 
                  className={`block px-4 py-2 cursor-pointer ${isActive('/add-book') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    onClose();
                    window.location.href = '/add-book';
                  }}
                >
                  <div className="flex items-center">
                    <BookPlus className="mr-2 h-5 w-5" />
                    Add Book
                  </div>
                </div>
                
                <div 
                  className={`block px-4 py-2 cursor-pointer ${isActive('/add-research-paper') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    onClose();
                    window.location.href = '/add-research-paper';
                  }}
                >
                  <div className="flex items-center">
                    <FilePlus className="mr-2 h-5 w-5" />
                    Add Research Paper
                  </div>
                </div>
              </>
            )}
            
            {user.role === 'admin' && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <p className="px-4 py-1 text-xs uppercase text-gray-500 font-semibold">Admin Actions</p>
                
                <div 
                  className={`block px-4 py-2 cursor-pointer ${isActive('/admin-dashboard') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    onClose();
                    window.location.href = '/admin-dashboard';
                  }}
                >
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5" />
                    Admin Dashboard
                  </div>
                </div>
                
                <div 
                  className={`block px-4 py-2 cursor-pointer ${isActive('/manage-users') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    onClose();
                    window.location.href = '/manage-users';
                  }}
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Manage Users
                  </div>
                </div>
                
                <div 
                  className={`block px-4 py-2 cursor-pointer ${isActive('/system-settings') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => {
                    onClose();
                    window.location.href = '/system-settings';
                  }}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    System Settings
                  </div>
                </div>
              </>
            )}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                {logoutMutation.isPending ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin border-2 border-gray-500 border-t-transparent rounded-full"></div>
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-5 w-5" />
                    Log out
                  </>
                )}
              </div>
            </button>
          </>
        )}
        
        {!user && (
          <div 
            className={`block px-4 py-2 cursor-pointer ${isActive('/auth') ? 'text-primary bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => {
              onClose();
              window.location.href = '/auth';
            }}
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-5 w-5" />
              Login / Register
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
