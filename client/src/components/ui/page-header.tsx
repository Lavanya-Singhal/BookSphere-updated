interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-bold text-gray-800">{title}</h1>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
  );
}
