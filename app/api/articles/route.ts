import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'finance_articles', 'all_complete_articles.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const articles: Article[] = JSON.parse(fileContents);
    
    // 按创建时间倒序排列
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json(sortedArticles);
  } catch (error) {
    console.error('Error reading articles:', error);
    return NextResponse.json([], { status: 500 });
  }
} 