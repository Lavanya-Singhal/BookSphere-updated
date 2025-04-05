import { useEffect } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Book, Search, Users, BarChart } from "lucide-react";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              BookSphere
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A modern approach to managing academic resources, enhancing accessibility and efficiency for students and faculty.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" onClick={() => setLocation("/auth")}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/books")}>
                Browse Books
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative h-72 w-72 md:h-96 md:w-96">
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-primary to-purple-600 rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Book className="h-32 w-32 md:h-48 md:w-48 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-gray-50 rounded-xl my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Key Features</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            BookSphere offers a comprehensive set of features designed to enhance your academic experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Find books easily with our smart search functionality and AI-powered recommendations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Course Books</h3>
            <p className="text-gray-600">
              Access recommended books for your courses, prioritized by professor ratings.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Research Papers</h3>
            <p className="text-gray-600">
              Access, download, and share academic research papers from faculty and researchers.
            </p>
          </div>
        </div>
      </section>
      
      {/* User Roles Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">For All Users</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Whether you're a student, faculty member, or administrator, our system is designed to meet your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Users className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Students</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="material-icons text-primary text-sm mr-2">check_circle</span>
                Borrow and reserve books
              </li>
              <li className="flex items-center">
                <span className="material-icons text-primary text-sm mr-2">check_circle</span>
                Get AI recommendations
              </li>
              <li className="flex items-center">
                <span className="material-icons text-primary text-sm mr-2">check_circle</span>
                Access research papers
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Users className="h-10 w-10 text-accent mb-4" />
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Faculty</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="material-icons text-accent text-sm mr-2">check_circle</span>
                Add books and research papers
              </li>
              <li className="flex items-center">
                <span className="material-icons text-accent text-sm mr-2">check_circle</span>
                Rate and review resources
              </li>
              <li className="flex items-center">
                <span className="material-icons text-accent text-sm mr-2">check_circle</span>
                Recommend course materials
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
            <Users className="h-10 w-10 text-warning mb-4" />
            <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">Administrators</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="material-icons text-warning text-sm mr-2">check_circle</span>
                Manage users and resources
              </li>
              <li className="flex items-center">
                <span className="material-icons text-warning text-sm mr-2">check_circle</span>
                Generate usage reports
              </li>
              <li className="flex items-center">
                <span className="material-icons text-warning text-sm mr-2">check_circle</span>
                Configure system settings
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-primary rounded-xl my-12 text-white text-center">
        <h2 className="text-3xl font-serif font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join BookSphere today and explore a world of knowledge at your fingertips.
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          className="bg-white text-primary hover:bg-gray-100"
          onClick={() => setLocation("/auth")}
        >
          Sign Up Now
        </Button>
      </section>
    </Layout>
  );
}
