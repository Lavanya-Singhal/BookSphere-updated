import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  requiredRole?: 'student' | 'faculty' | 'admin' | string[];
};

export function ProtectedRoute({
  path,
  component: Component,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check for required role if specified
  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      // If requiredRole is an array, check if user's role is in the array
      if (!requiredRole.includes(user.role)) {
        return (
          <Route path={path}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p>You don't have permission to access this page.</p>
            </div>
          </Route>
        );
      }
    } else if (user.role !== requiredRole) {
      // If requiredRole is a string, check if it matches user's role
      return (
        <Route path={path}>
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </Route>
      );
    }
  }

  // If all checks pass, render the component
  return <Route path={path} component={Component} />;
}
