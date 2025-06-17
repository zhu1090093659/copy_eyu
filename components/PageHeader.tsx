interface PageHeaderProps {
  title: string;
  description: string;
  count?: number;
  icon?: React.ReactNode;
}

export function PageHeader({ title, description, count, icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-3">
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-2">
            <span>{title}</span>
            {count !== undefined && (
              <span className="text-lg font-normal text-slate-600">
                ({count} 篇研报)
              </span>
            )}
          </h1>
          <p className="text-slate-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
} 