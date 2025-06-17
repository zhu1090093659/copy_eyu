export interface Article {
  id: number;
  top: number;
  featured: number;
  title: string;
  brief: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  columnId: number;
  column: {
    id: number;
    name: string;
  };
  full_content?: {
    id: number;
    top: number;
    featured: number;
    title: string;
    brief: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    column: {
      id: number;
      name: string;
    };
    articleStat: {
      id: number;
      readNum: number;
    };
    isSaved: boolean;
  };
}

// 读取文章列表
export async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// 根据ID获取单篇文章详情
export async function getArticleById(id: number): Promise<Article | null> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// 获取文章分类统计
export async function getColumnStats(): Promise<{ name: string; count: number }[]> {
  const articles = await getArticles();
  const columnMap = new Map<string, number>();
  
  articles.forEach(article => {
    const columnName = article.column.name;
    columnMap.set(columnName, (columnMap.get(columnName) || 0) + 1);
  });
  
  return Array.from(columnMap.entries()).map(([name, count]) => ({
    name,
    count
  }));
}

// 搜索文章
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to search articles');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

// 获取搜索建议
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query.trim() || query.length < 2) return [];
  
  const articles = await getArticles();
  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // 分类建议
  const categories = Array.from(new Set(articles.map(article => article.column.name)));
  categories.forEach(category => {
    if (category.toLowerCase().includes(lowerQuery)) {
      suggestions.add(category);
    }
  });
  
  // 标题关键词建议
  articles.forEach(article => {
    if (article.title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(article.title);
    }
  });
  
  return Array.from(suggestions).slice(0, 8);
}

// 获取热门文章（基于阅读数）
export async function getPopularArticles(): Promise<Article[]> {
  try {
    const articles = await getArticles();
    
    // 按阅读数排序，取前10
    return articles
      .filter(article => article.full_content?.articleStat?.readNum)
      .sort((a, b) => 
        (b.full_content?.articleStat?.readNum || 0) - (a.full_content?.articleStat?.readNum || 0)
      )
      .slice(0, 10);
  } catch (error) {
    console.error('Error reading popular articles:', error);
    return [];
  }
} 