import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import StudentDashboard from "@/pages/student-dashboard";
import FacultyDashboard from "@/pages/faculty-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import BooksPage from "@/pages/books-page";
import ResearchPapersPage from "@/pages/research-papers-page";
import MyBooksPage from "@/pages/my-books-page";
import SearchPage from "@/pages/search-page";
import ProfilePage from "@/pages/profile-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={StudentDashboard} />
      <ProtectedRoute path="/faculty-dashboard" component={FacultyDashboard} requiredRole="faculty" />
      <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} requiredRole="admin" />
      <Route path="/books" component={BooksPage} />
      <Route path="/research-papers" component={ResearchPapersPage} />
      <ProtectedRoute path="/my-books" component={MyBooksPage} />
      <Route path="/books/search" component={SearchPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
