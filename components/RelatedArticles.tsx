"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ArrowRight } from "lucide-react";
import { Article } from "@/lib/staticApi";
import { formatDate, formatNumber, truncateText } from "@/lib/utils";
import Link from "next/link";

interface RelatedArticlesProps {
  currentArticleId: number;
  category: string;
}

export function RelatedArticles({ currentArticleId, category }: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        // 从静态数据获取所有文章
        const response = await fetch('/data/articles.json');
        if (response.ok) {
          const allArticles = await response.json();
          
          // 过滤出同分类的其他文章，排除当前文章
          const related = allArticles
            .filter((article: Article) => 
              article.column.name === category && 
              article.id !== currentArticleId
            )
            .sort((a: Article, b: Article) => {
              // 优先显示阅读量高的文章
              const aReadNum = a.full_content?.articleStat?.readNum || 0;
              const bReadNum = b.full_content?.articleStat?.readNum || 0;
              return bReadNum - aReadNum;
            })
            .slice(0, 5);
            
          setRelatedArticles(related);
        }
      } catch (error) {
        console.error('Error fetching related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, category]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">相关研报</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 如果没有相关文章，显示同分类的其他文章
  const displayArticles = relatedArticles.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">相关研报</CardTitle>
      </CardHeader>
      <CardContent>
        {displayArticles.length > 0 ? (
          <div className="space-y-4">
            {displayArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/article/${article.id}`}
                className="block group"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {article.column.name}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
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
                </div>
                
                <div className="border-b border-slate-100 mt-3"></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-slate-500 text-sm">
              暂无相关文章
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 备用组件：静态相关文章（当动态加载失败时使用）
export function StaticRelatedArticles({ 
  currentArticleId, 
  category, 
  articles 
}: {
  currentArticleId: number;
  category: string;
  articles: Article[];
}) {
  // 过滤出同分类的其他文章，排除当前文章
  const relatedArticles = articles
    .filter(article => 
      article.column.name === category && 
      article.id !== currentArticleId
    )
    .sort((a, b) => {
      // 优先显示阅读量高的文章
      const aReadNum = a.full_content?.articleStat?.readNum || 0;
      const bReadNum = b.full_content?.articleStat?.readNum || 0;
      return bReadNum - aReadNum;
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">相关研报</CardTitle>
      </CardHeader>
      <CardContent>
        {relatedArticles.length > 0 ? (
          <div className="space-y-4">
            {relatedArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/article/${article.id}`}
                className="block group"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {article.column.name}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
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
                </div>
                
                {relatedArticles.indexOf(article) < relatedArticles.length - 1 && (
                  <div className="border-b border-slate-100 mt-3"></div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-slate-500 text-sm">
              暂无相关文章
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 