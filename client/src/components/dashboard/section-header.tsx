import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({
  title,
  actionText,
  actionLink,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-serif font-bold text-gray-800">
        {icon && (
          <span className="flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
          </span>
        )}
        {!icon && title}
      </h2>
      
      {actionText && actionLink && (
        <Link href={actionLink}>
          <a className="text-primary hover:text-primary-dark text-sm font-medium flex items-center">
            {actionText} <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      )}
    </div>
  );
}
