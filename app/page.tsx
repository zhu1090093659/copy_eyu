"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Sidebar } from "@/components/Sidebar";
import { fetchArticles, searchArticles, Article } from "@/lib/staticApi";
import { debounce, addToSearchHistory } from "@/lib/utils";
import Image from "next/image";

export default function HomePage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // 从URL参数初始化搜索
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setSearchQuery(query);
      setIsSearchMode(true);
      performSearch(query);
    }
  }, [searchParams]);

  // 加载文章数据
  useEffect(() => {
    const loadArticles = async () => {
      const articles = await fetchArticles();
      setAllArticles(articles);
      if (!isSearchMode) {
        setDisplayArticles(articles);
      }
    };
    loadArticles();
  }, [isSearchMode]);

  // 执行搜索
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setDisplayArticles(allArticles);
      setIsSearchMode(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchArticles(query);
      setDisplayArticles(results);
      setIsSearchMode(true);
      
      // 添加到搜索历史
      if (query.trim()) {
        addToSearchHistory(query.trim());
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setDisplayArticles([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
      
      // 更新URL参数
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        newSearchParams.set('q', query.trim());
      } else {
        newSearchParams.delete('q');
      }
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }, 300),
    [allArticles, searchParams, router]
  );

  // 处理搜索输入
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setDisplayArticles(allArticles);
    
    // 清除URL参数
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('q');
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onClearSearch={handleClearSearch}
        articles={allArticles}
        isSearching={isSearching}
      />
      
      {/* 横幅图片区域 */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src="/hero-banner.png"
          alt="鳄鱼派投资理念"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Sidebar articles={allArticles} />
          </div>
          
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {isSearchMode ? `搜索结果: "${searchQuery}"` : "鳄鱼派研报中心"}
              </h1>
              <p className="text-slate-600">
                {isSearchMode 
                  ? `找到 ${displayArticles.length} 篇相关研报`
                  : "专业的投资分析，助您把握市场脉搏"
                }
              </p>
            </div>
            
            <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
              <ArticleGrid 
                articles={displayArticles} 
                searchQuery={isSearchMode ? searchQuery : ""}
                isSearchMode={isSearchMode}
                isLoading={isSearching}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 