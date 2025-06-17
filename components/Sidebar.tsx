"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, Calendar } from "lucide-react";
import { Article } from "@/lib/staticApi";
import { formatDate, formatNumber } from "@/lib/utils";

interface SidebarProps {
  articles: Article[];
}

export function Sidebar({ articles }: SidebarProps) {
  // 计算分类统计
  const categoryStats = articles.reduce((acc, article) => {
    const category = article.column.name;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 获取热门文章（按阅读数排序，限制前5条）
  const popularArticles = articles
    .filter(article => article.full_content?.articleStat?.readNum)
    .sort((a, b) => 
      (b.full_content?.articleStat?.readNum || 0) - (a.full_content?.articleStat?.readNum || 0)
    )
    .slice(0, 5);

  // 获取最新文章
  const latestArticles = articles.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            数据概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">总研报数</span>
              <Badge variant="secondary">{articles.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">分类数</span>
              <Badge variant="secondary">{Object.keys(categoryStats).length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">总阅读量</span>
              <Badge variant="secondary">
                {formatNumber(
                  articles.reduce((sum, article) => 
                    sum + (article.full_content?.articleStat?.readNum || 0), 0
                  )
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分类统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">研报分类</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(categoryStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([category, count]) => (
                <div key={category} className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-700 truncate">{category}</span>
                  <Badge variant="outline" className="text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* 热门文章 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Eye className="h-5 w-5 mr-2 text-orange-500" />
            热门研报
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {formatNumber(article.full_content?.articleStat?.readNum || 0)} 阅读
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最新文章 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-green-500" />
            最新发布
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {latestArticles.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {article.column.name}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 