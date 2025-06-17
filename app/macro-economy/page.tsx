"use client";

import { Suspense, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { fetchArticles, Article } from "@/lib/staticApi";
import { getMacroEconomyArticles, MACRO_ECONOMY_KEYWORDS } from "@/lib/categoryUtils";
import { Globe, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate } from "@/lib/utils";

export default function MacroEconomyPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [macroArticles, setMacroArticles] = useState<Article[]>([]);
  const [keywordStats, setKeywordStats] = useState<Record<string, number>>({});
  
  // 加载文章数据
  useEffect(() => {
    const loadArticles = async () => {
      const articles = await fetchArticles();
      setAllArticles(articles);
      
      // 筛选宏观经济文章
      const macroEconArticles = getMacroEconomyArticles(articles);
      setMacroArticles(macroEconArticles);
      
      // 统计关键词出现频率
      const stats: Record<string, number> = {};
      MACRO_ECONOMY_KEYWORDS.forEach(keyword => {
        stats[keyword] = macroEconArticles.filter(article => 
          `${article.title} ${article.brief || ''}`.toLowerCase().includes(keyword.toLowerCase())
        ).length;
      });
      setKeywordStats(stats);
    };
    loadArticles();
  }, []);

  // 获取最新的宏观经济研报
  const latestMacroArticles = macroArticles.slice(0, 6);

  // 获取热门关键词（出现次数大于0的关键词，按频率排序）
  const popularKeywords = Object.entries(keywordStats)
    .filter(([_, count]) => count > 0)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // 计算总阅读量
  const totalReadNum = macroArticles.reduce((sum, article) => 
    sum + (article.full_content?.articleStat?.readNum || 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        searchQuery=""
        onSearchChange={() => {}}
        onClearSearch={() => {}}
        articles={allArticles}
        isSearching={false}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Sidebar articles={macroArticles} />
          </div>
          
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <PageHeader
              title="宏观经济"
              description="追踪全球经济动态，解读政策影响与市场趋势"
              count={macroArticles.length}
              icon={<Globe className="h-6 w-6 text-blue-600" />}
            />

            {/* 宏观经济概览 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    研报总数
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {macroArticles.length}
                  </div>
                  <p className="text-sm text-slate-600">篇宏观经济研报</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    总阅读量
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {formatNumber(totalReadNum)}
                  </div>
                  <p className="text-sm text-slate-600">次总阅读</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-orange-600" />
                    平均阅读量
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {macroArticles.length > 0 ? Math.round(totalReadNum / macroArticles.length) : 0}
                  </div>
                  <p className="text-sm text-slate-600">次平均阅读</p>
                </CardContent>
              </Card>
            </div>

            {/* 热门关键词 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">热门主题</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map(([keyword, count]) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary" 
                      className="text-sm py-1 px-3"
                    >
                      {keyword} ({count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 最新研报 */}
            {latestMacroArticles.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">最新宏观研报</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {latestMacroArticles.map((article) => (
                      <div key={article.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <h4 className="font-medium text-slate-900 mb-2 line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {article.brief}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{formatDate(article.createdAt)}</span>
                          <span>{formatNumber(article.full_content?.articleStat?.readNum || 0)} 阅读</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 所有宏观经济文章 */}
            <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
              <ArticleGrid 
                articles={macroArticles}
                searchQuery=""
                isSearchMode={false}
                isLoading={false}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 