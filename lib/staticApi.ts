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

export interface SearchIndex {
  id: number;
  title: string;
  brief: string;
  category: string;
  createdAt: string;
}

export interface Category {
  name: string;
  count: number;
  articles: Article[];
}

// 获取所有文章列表 - 客户端使用
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/data/articles.json');
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// 获取单篇文章详情 - 客户端使用
export async function fetchArticle(id: number | string): Promise<Article | null> {
  try {
    const response = await fetch(`/data/articles/${id}.json`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch article');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// 获取搜索索引 - 客户端使用
async function fetchSearchIndex(): Promise<SearchIndex[]> {
  try {
    const response = await fetch('/data/search-index.json');
    if (!response.ok) {
      throw new Error('Failed to fetch search index');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching search index:', error);
    return [];
  }
}

// 客户端搜索功能
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    // 如果没有查询词，返回所有文章
    if (!query.trim()) {
      return await fetchArticles();
    }

    const [articles, searchIndex] = await Promise.all([
      fetchArticles(),
      fetchSearchIndex()
    ]);

    const lowerQuery = query.toLowerCase().trim();
    const keywords = lowerQuery.split(/\s+/);

    // 过滤匹配的文章ID
    const matchingIds = searchIndex.filter(item => {
      // 检查是否包含所有关键词
      return keywords.every(keyword => 
        item.title.includes(keyword) ||
        item.brief.includes(keyword) ||
        item.category.includes(keyword)
      );
    }).map(item => item.id);

    // 获取匹配的完整文章数据
    const matchingArticles = articles.filter(article => 
      matchingIds.includes(article.id)
    );

    // 按相关性排序
    return matchingArticles.sort((a, b) => {
      const getRelevanceScore = (article: Article) => {
        let score = 0;
        const title = article.title.toLowerCase();
        const brief = article.brief.toLowerCase();
        const category = article.column.name.toLowerCase();
        
        keywords.forEach(keyword => {
          if (title.includes(keyword)) score += 3;
          if (brief.includes(keyword)) score += 2;
          if (category.includes(keyword)) score += 1;
        });
        
        return score;
      };
      
      return getRelevanceScore(b) - getRelevanceScore(a);
    });

  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

// 获取分类数据 - 客户端使用
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/data/categories.json');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// 根据分类获取文章
export async function fetchArticlesByCategory(categoryName: string): Promise<Article[]> {
  try {
    const articles = await fetchArticles();
    return articles.filter(article => article.column.name === categoryName);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
} 