"use client";

import { Suspense, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { IndustryOverview } from "@/components/IndustryOverview";
import { CategoryFilter } from "@/components/CategoryFilter";
import { fetchArticles, Article } from "@/lib/staticApi";
import { categorizeByIndustry, getIndustryStats, INDUSTRY_CATEGORIES } from "@/lib/categoryUtils";
import { Factory } from "lucide-react";

export default function IndustryAnalysisPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industryStats, setIndustryStats] = useState<Record<string, { count: number; readNum: number }>>({});
  const [categorizedArticles, setCategorizedArticles] = useState<Record<string, Article[]>>({});
  
  // 加载文章数据
  useEffect(() => {
    const loadArticles = async () => {
      const articles = await fetchArticles();
      setAllArticles(articles);
      
      // 分类文章
      const categorized = categorizeByIndustry(articles);
      setCategorizedArticles(categorized);
      
      // 计算统计信息
      const stats = getIndustryStats(articles);
      setIndustryStats(stats);
      
      // 默认显示所有文章
      setDisplayArticles(articles);
    };
    loadArticles();
  }, []);

  // 处理行业选择
  const handleIndustrySelect = (industry: string | null) => {
    if (!industry || industry === selectedIndustry) {
      setSelectedIndustry(null);
      setDisplayArticles(allArticles);
    } else {
      setSelectedIndustry(industry);
      setDisplayArticles(categorizedArticles[industry] || []);
    }
  };

  // 获取有文章的行业列表
  const industriesWithArticles = Object.keys(INDUSTRY_CATEGORIES).filter(
    industry => industryStats[industry]?.count > 0
  );

  // 获取分类统计（用于筛选器）
  const categoryStats = Object.entries(industryStats)
    .filter(([_, stats]) => stats.count > 0)
    .reduce((acc, [industry, stats]) => {
      acc[industry] = stats.count;
      return acc;
    }, {} as Record<string, number>);

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
              title="行业分析"
              description="深度解析各行业发展趋势，洞察投资机会"
              count={displayArticles.length}
              icon={<Factory className="h-6 w-6 text-blue-600" />}
            />

            {/* 行业概览卡片 */}
            <IndustryOverview
              industryStats={industryStats}
              onIndustrySelect={handleIndustrySelect}
              selectedIndustry={selectedIndustry}
            />

            {/* 分类筛选器 */}
            <CategoryFilter
              categories={industriesWithArticles}
              selectedCategory={selectedIndustry}
              onCategorySelect={handleIndustrySelect}
              categoryStats={categoryStats}
            />

            {/* 文章网格 */}
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