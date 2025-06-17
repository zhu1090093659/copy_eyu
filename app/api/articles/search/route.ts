import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Article } from '../route';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    const filePath = path.join(process.cwd(), 'finance_articles', 'all_complete_articles.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const articles: Article[] = JSON.parse(fileContents);
    
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      // 如果没有查询，返回所有文章
      const sortedArticles = articles.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return NextResponse.json(sortedArticles);
    }
    
    const keywords = lowerQuery.split(/\s+/);
    
    const filteredArticles = articles.filter(article => {
      const searchFields = [
        article.title.toLowerCase(),
        article.brief.toLowerCase(),
        article.column.name.toLowerCase()
      ];
      
      // 检查是否包含所有关键词
      return keywords.every(keyword => 
        searchFields.some(field => field.includes(keyword))
      );
    }).sort((a, b) => {
      // 按相关性排序：标题匹配 > 摘要匹配 > 分类匹配
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
    
    return NextResponse.json(filteredArticles);
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json([], { status: 500 });
  }
} 