"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  categoryStats?: Record<string, number>;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  categoryStats 
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(null)}
          className="h-8"
        >
          全部
          {categoryStats && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {Object.values(categoryStats).reduce((sum, count) => sum + count, 0)}
            </Badge>
          )}
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(selectedCategory === category ? null : category)}
            className="h-8 relative"
          >
            {category}
            {categoryStats && categoryStats[category] && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {categoryStats[category]}
              </Badge>
            )}
            {selectedCategory === category && (
              <X className="h-3 w-3 ml-1" />
            )}
          </Button>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-sm text-slate-600">已选择筛选条件:</span>
          <Badge variant="default" className="flex items-center space-x-1">
            <span>{selectedCategory}</span>
            <button
              onClick={() => onCategorySelect(null)}
              className="ml-1 hover:bg-blue-700 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
} 