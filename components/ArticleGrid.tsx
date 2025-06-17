"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, ArrowRight, Star, Search } from "lucide-react";
import { Article } from "@/lib/staticApi";
import { formatDate, formatNumber, stripHtml, truncateText } from "@/lib/utils";
import { HighlightText } from "@/components/HighlightText";

interface ArticleGridProps {
  articles: Article[];
  searchQuery?: string;
  isSearchMode?: boolean;
  isLoading?: boolean;
}

export function ArticleGrid({ 
  articles, 
  searchQuery = "", 
  isSearchMode = false,
  isLoading = false 
}: ArticleGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 24;
  const pathname = usePathname();

  // 导航项配置
  const navigationItems = [
    { href: "/", label: "首页" },
    { href: "/industry-analysis", label: "行业分析" },
    { href: "/macro-economy", label: "宏观经济" },
    { href: "/investment-strategy", label: "投资策略" },
  ];

  // 获取所有分类
  const categories = ["全部", ...Array.from(new Set(articles.map(article => article.column.name)))];

  // 过滤文章
  const filteredArticles = selectedCategory === "全部" 
    ? articles 
    : articles.filter(article => article.column.name === selectedCategory);

  // 分页
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 搜索模式下的统计信息
  const renderSearchStats = () => {
    if (!isSearchMode) return null;
    
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <Search className="h-5 w-5" />
          <span className="font-medium">
            搜索 "{searchQuery}" 找到 {filteredArticles.length} 个结果
          </span>
        </div>
        {filteredArticles.length > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            按相关性排序，标题匹配优先显示
          </p>
        )}
      </div>
    );
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="space-y-6">
        {renderSearchStats()}
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">搜索中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderSearchStats()}

      {/* 导航栏和分类筛选 */}
      <div className="space-y-4">
        {/* 主导航栏 */}
        <nav className="flex items-center space-x-8 border-b border-slate-200 pb-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`transition-colors font-medium pb-2 ${
                  isActive 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 分类筛选 - 搜索模式下仍可使用 */}
        {!isSearchMode && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* 文章统计信息 */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          共找到 <span className="font-semibold text-slate-900">{filteredArticles.length}</span> 篇研报
          {isSearchMode && searchQuery && (
            <span className="ml-2 text-blue-600">
              (关键词: "{searchQuery}")
            </span>
          )}
        </span>
        <span>
          第 {startIndex + 1}-{Math.min(startIndex + articlesPerPage, filteredArticles.length)} 条，
          共 {filteredArticles.length} 条
        </span>
      </div>

      {/* 文章网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.map((article) => (
          <Link 
            key={article.id}
            href={`/article/${article.id}`}
            className="block cursor-pointer"
          >
            <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-blue-300 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    {isSearchMode && searchQuery ? (
                      <HighlightText text={article.column.name} query={searchQuery} />
                    ) : (
                      article.column.name
                    )}
                  </Badge>
                  {article.top === 1 && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-lg leading-tight">
                  {isSearchMode && searchQuery ? (
                    <HighlightText text={article.title} query={searchQuery} />
                  ) : (
                    article.title
                  )}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {article.brief ? (
                    isSearchMode && searchQuery ? (
                      <HighlightText 
                        text={truncateText(stripHtml(article.brief), 100)} 
                        query={searchQuery} 
                      />
                    ) : (
                      truncateText(stripHtml(article.brief), 100)
                    )
                  ) : (
                    "暂无摘要"
                  )}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    {article.full_content?.articleStat?.readNum && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatNumber(article.full_content.articleStat.readNum)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm">阅读</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            上一页
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            下一页
          </Button>
        </div>
      )}

      {/* 空状态 */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            {isSearchMode ? (
              <Search className="h-12 w-12 text-slate-400" />
            ) : (
              <Calendar className="h-12 w-12 text-slate-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {isSearchMode ? "未找到相关研报" : "暂无研报"}
          </h3>
          <p className="text-slate-500">
            {isSearchMode 
              ? `没有找到包含 "${searchQuery}" 的研报，试试其他关键词`
              : "该分类下暂时没有研报，请选择其他分类"
            }
          </p>
          {isSearchMode && (
            <div className="mt-4">
              <p className="text-sm text-slate-400 mb-2">搜索建议：</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• 检查关键词是否正确</li>
                <li>• 尝试使用更通用的关键词</li>
                <li>• 使用分类名称进行搜索</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 