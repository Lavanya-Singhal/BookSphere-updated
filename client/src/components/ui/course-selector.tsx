import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Course } from "@/lib/types";

interface CourseSelectorProps {
  selectedCourseId: number | null;
  onCourseChange: (courseId: number) => void;
}

export default function CourseSelector({
  selectedCourseId,
  onCourseChange
}: CourseSelectorProps) {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });
  
  const [selected, setSelected] = useState<string>(
    selectedCourseId ? String(selectedCourseId) : ""
  );
  
  useEffect(() => {
    if (selectedCourseId) {
      setSelected(String(selectedCourseId));
    }
  }, [selectedCourseId]);
  
  const handleSelectionChange = (value: string) => {
    setSelected(value);
    onCourseChange(parseInt(value, 10));
  };
  
  if (isLoading) {
    return (
      <div className="mb-5 flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading courses...</span>
      </div>
    );
  }
  
  if (!courses || courses.length === 0) {
    return (
      <div className="mb-5">
        <p className="text-sm text-gray-500">No courses available</p>
      </div>
    );
  }
  
  return (
    <div className="mb-5">
      <Label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Course
      </Label>
      <Select value={selected} onValueChange={handleSelectionChange}>
        <SelectTrigger id="course-select" className="w-full">
          <SelectValue placeholder="Select a course" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={String(course.id)}>
              {course.code} - {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
