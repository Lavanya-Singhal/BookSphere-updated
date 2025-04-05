import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  borderColor: string;
  iconBgColor: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  borderColor,
  iconBgColor,
}: StatCardProps) {
  return (
    <Card className={`dashboard-card p-6 border-l-4 ${borderColor} transition-all hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`h-12 w-12 rounded-full ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
