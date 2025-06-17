"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Hash, X } from "lucide-react";
import { getSearchHistory, clearSearchHistory } from "@/lib/utils";
import { Article } from "@/lib/staticApi";

interface SearchSuggestionsProps {
  isVisible: boolean;
  onSelect: (query: string) => void;
  onClose: () => void;
  articles: Article[];
  currentQuery: string;
}

export function SearchSuggestions({ 
  isVisible, 
  onSelect, 
  onClose, 
  articles,
  currentQuery 
}: SearchSuggestionsProps) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, [isVisible]);

  if (!isVisible) return null;

  // 获取热门搜索词（基于分类名称和高频词汇）
  const getPopularSearchTerms = () => {
    const categories = Array.from(new Set(articles.map(article => article.column.name)));
    return categories.slice(0, 6);
  };

  // 获取相关分类建议
  const getCategorySuggestions = () => {
    if (!currentQuery.trim()) return [];
    
    const query = currentQuery.toLowerCase();
    return Array.from(new Set(articles.map(article => article.column.name)))
      .filter(category => category.toLowerCase().includes(query))
      .slice(0, 4);
  };

  // 获取标题匹配建议
  const getTitleSuggestions = () => {
    if (!currentQuery.trim() || currentQuery.length < 2) return [];
    
    const query = currentQuery.toLowerCase();
    return articles
      .filter(article => article.title.toLowerCase().includes(query))
      .map(article => article.title)
      .slice(0, 5);
  };

  const popularTerms = getPopularSearchTerms();
  const categorySuggestions = getCategorySuggestions();
  const titleSuggestions = getTitleSuggestions();

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
      <CardContent className="p-4">
        {/* 标题匹配建议 */}
        {titleSuggestions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm font-medium text-slate-700 mb-2">
              <Hash className="h-4 w-4 mr-2" />
              相关研报
            </div>
            <div className="space-y-1">
              {titleSuggestions.map((title, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(title)}
                  className="w-full text-left p-2 hover:bg-slate-50 rounded text-sm text-slate-600 line-clamp-1"
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 分类建议 */}
        {categorySuggestions.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm font-medium text-slate-700 mb-2">
              <Hash className="h-4 w-4 mr-2" />
              相关分类
            </div>
            <div className="flex flex-wrap gap-2">
              {categorySuggestions.map((category, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => onSelect(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 搜索历史 */}
        {searchHistory.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4 mr-2" />
                搜索历史
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
              >
                <X className="h-3 w-3 mr-1" />
                清空
              </Button>
            </div>
            <div className="space-y-1">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(query)}
                  className="w-full text-left p-2 hover:bg-slate-50 rounded text-sm text-slate-600"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 热门搜索 */}
        {!currentQuery.trim() && popularTerms.length > 0 && (
          <div>
            <div className="flex items-center text-sm font-medium text-slate-700 mb-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              热门分类
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTerms.map((term, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => onSelect(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 无建议时的提示 */}
        {currentQuery.trim() && 
         titleSuggestions.length === 0 && 
         categorySuggestions.length === 0 && (
          <div className="text-center py-4 text-slate-500 text-sm">
            没有找到相关建议，试试其他关键词
          </div>
        )}
      </CardContent>
    </Card>
  );
} 