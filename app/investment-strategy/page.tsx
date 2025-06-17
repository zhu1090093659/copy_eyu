"use client";

import { Suspense, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { CategoryFilter } from "@/components/CategoryFilter";
import { fetchArticles, Article } from "@/lib/staticApi";
import { getInvestmentStrategyArticles, INVESTMENT_STRATEGY_KEYWORDS } from "@/lib/categoryUtils";
import { Target, TrendingUp, AlertTriangle, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate } from "@/lib/utils";

export default function InvestmentStrategyPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [strategyArticles, setStrategyArticles] = useState<Article[]>([]);
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [strategyCategories, setStrategyCategories] = useState<Record<string, Article[]>>({});
  
  // 策略分类
  const STRATEGY_CATEGORIES = {
    '周报': ['周报', '周观察', '周跟踪'],
    '月报': ['月报', '月观察'],
    '季报': ['季报', '一季度', '二季度', '三季度', '四季度'],
    '年报': ['年报', '年度'],
    '专题报告': ['观察', '分析', '研究', '深度'],
    '行业跟踪': ['跟踪', '观点', '展望']
  };

  // 加载文章数据
  useEffect(() => {
    const loadArticles = async () => {
      const articles = await fetchArticles();
      setAllArticles(articles);
      
      // 筛选投资策略文章
      const investmentArticles = getInvestmentStrategyArticles(articles);
      setStrategyArticles(investmentArticles);
      setDisplayArticles(investmentArticles);
      
      // 按策略类型分类
      const categorized: Record<string, Article[]> = {};
      Object.keys(STRATEGY_CATEGORIES).forEach(category => {
        categorized[category] = [];
      });
      
      investmentArticles.forEach(article => {
        let categorized_flag = false;
        for (const [category, keywords] of Object.entries(STRATEGY_CATEGORIES)) {
          if (keywords.some(keyword => article.title.toLowerCase().includes(keyword.toLowerCase()))) {
            categorized[category].push(article);
            categorized_flag = true;
            break;
          }
        }
        if (!categorized_flag) {
          if (!categorized['其他']) categorized['其他'] = [];
          categorized['其他'].push(article);
        }
      });
      
      setStrategyCategories(categorized);
    };
    loadArticles();
  }, []);

  // 处理分类选择
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (!category) {
      setDisplayArticles(strategyArticles);
    } else {
      setDisplayArticles(strategyCategories[category] || []);
    }
  };

  // 获取有文章的分类列表
  const categoriesWithArticles = Object.keys(STRATEGY_CATEGORIES).filter(
    category => strategyCategories[category]?.length > 0
  );

  // 获取分类统计
  const categoryStats = Object.entries(strategyCategories)
    .filter(([_, articles]) => articles.length > 0)
    .reduce((acc, [category, articles]) => {
      acc[category] = articles.length;
      return acc;
    }, {} as Record<string, number>);

  // 计算统计数据
  const totalReadNum = strategyArticles.reduce((sum, article) => 
    sum + (article.full_content?.articleStat?.readNum || 0), 0
  );

  // 获取热门策略文章
  const popularArticles = strategyArticles
    .filter(article => article.full_content?.articleStat?.readNum)
    .sort((a, b) => 
      (b.full_content?.articleStat?.readNum || 0) - (a.full_content?.articleStat?.readNum || 0)
    )
    .slice(0, 4);

  // 获取最新策略文章
  const latestArticles = strategyArticles.slice(0, 4);

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
            <Sidebar articles={displayArticles} />
          </div>
          
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <PageHeader
              title="投资策略"
              description="专业投资分析与策略建议，助您制定最优投资决策"
              count={displayArticles.length}
              icon={<Target className="h-6 w-6 text-blue-600" />}
            />

            {/* 策略概览 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-600" />
                    策略研报
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {strategyArticles.length}
                  </div>
                  <p className="text-xs text-slate-600">篇策略分析</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    总阅读量
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatNumber(totalReadNum)}
                  </div>
                  <p className="text-xs text-slate-600">次总阅读</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Award className="h-4 w-4 mr-2 text-orange-600" />
                    策略分类
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {categoriesWithArticles.length}
                  </div>
                  <p className="text-xs text-slate-600">个策略类型</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                    平均阅读
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {strategyArticles.length > 0 ? Math.round(totalReadNum / strategyArticles.length) : 0}
                  </div>
                  <p className="text-xs text-slate-600">次平均阅读</p>
                </CardContent>
              </Card>
            </div>

            {/* 分类筛选器 */}
            <CategoryFilter
              categories={categoriesWithArticles}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              categoryStats={categoryStats}
            />

            {/* 热门与最新策略 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* 热门策略 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Award className="h-5 w-5 mr-2 text-orange-500" />
                    热门策略
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularArticles.map((article, index) => (
                      <div key={article.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{formatDate(article.createdAt)}</span>
                            <span>{formatNumber(article.full_content?.articleStat?.readNum || 0)} 阅读</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 最新策略 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-500" />
                    最新策略
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {latestArticles.map((article) => (
                      <div key={article.id} className="border-l-4 border-green-500 pl-4">
                        <h4 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <Badge variant="outline" className="text-xs">
                            {article.column.name}
                          </Badge>
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 所有策略文章 */}
            <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
              <ArticleGrid 
                articles={displayArticles}
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