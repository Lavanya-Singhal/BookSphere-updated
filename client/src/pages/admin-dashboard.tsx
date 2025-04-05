import { useState } from "react";
import Layout from "@/components/layout/layout";
import PageHeader from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart as BarChartIcon, 
  PieChart, 
  LineChart, 
  Users, 
  Book, 
  FileText, 
  Settings,
  Download,
  PlusCircle,
  BookOpen 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  BarChart,
  Bar,
  LineChart as ReChartsLineChart,
  Line,
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Sample data for charts
const borrowingData = [
  { name: 'Jan', count: 45 },
  { name: 'Feb', count: 52 },
  { name: 'Mar', count: 61 },
  { name: 'Apr', count: 58 },
  { name: 'May', count: 63 },
  { name: 'Jun', count: 49 },
];

const categoryData = [
  { name: 'Computer Science', value: 35 },
  { name: 'Mathematics', value: 25 },
  { name: 'Literature', value: 20 },
  { name: 'Physics', value: 15 },
  { name: 'Other', value: 5 },
];

const userActivityData = [
  { name: 'Week 1', students: 42, faculty: 15 },
  { name: 'Week 2', students: 38, faculty: 12 },
  { name: 'Week 3', students: 45, faculty: 18 },
  { name: 'Week 4', students: 52, faculty: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <Layout>
      <PageHeader 
        title="Admin Dashboard"
        description={`Welcome, ${user?.name}. Manage and monitor the BookSphere system.`}
      />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <p className="text-2xl font-bold mt-1">1,247</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Book className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold mt-1">583</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Books On Loan</p>
                <p className="text-2xl font-bold mt-1">218</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Research Papers</p>
                <p className="text-2xl font-bold mt-1">97</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-background border-b border-border p-0 h-auto">
          <div className="container flex overflow-x-auto">
            <TabsTrigger value="overview" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Users
            </TabsTrigger>
            <TabsTrigger value="books" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Books & Resources
            </TabsTrigger>
            <TabsTrigger value="reports" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-3 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Settings
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Monthly Book Borrowing
                </CardTitle>
                <CardDescription>Number of books borrowed per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={borrowingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Books Borrowed" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-accent" />
                  Books by Category
                </CardTitle>
                <CardDescription>Distribution of books across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-warning" />
                User Activity
              </CardTitle>
              <CardDescription>Weekly active users over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChartsLineChart
                    data={userActivityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" name="Students" stroke="#1976d2" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="faculty" name="Faculty" stroke="#9c27b0" />
                  </ReChartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Book className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New book added: "Data Structures and Algorithms"</p>
                      <p className="text-xs text-gray-500">10 minutes ago by Prof. Johnson</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New user registered: Sarah Williams</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FileText className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New research paper: "Advances in AI"</p>
                      <p className="text-xs text-gray-500">Yesterday by Prof. Davis</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Book className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Book request: "Machine Learning Applications"</p>
                        <p className="text-xs text-gray-500">Requested by Prof. Smith</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Decline</Button>
                      <Button variant="default" size="sm">Approve</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Research paper: "Quantum Computing Fundamentals"</p>
                        <p className="text-xs text-gray-500">Submitted by Prof. Wilson</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Decline</Button>
                      <Button variant="default" size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Management</span>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </CardTitle>
              <CardDescription>
                Manage users, their roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">
                User management interface would be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Books & Resources Management</span>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </CardTitle>
              <CardDescription>
                Manage books, research papers, and other resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">
                Books and resources management interface would be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reports & Analytics</span>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
              </CardTitle>
              <CardDescription>
                Generate and download system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">
                Reports and analytics interface would be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system parameters and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-20 text-gray-500">
                System settings interface would be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
