import fs from 'fs';
import path from 'path';
import { Article } from './staticApi';

// 服务端获取所有文章列表
export async function getArticlesServer(): Promise<Article[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'articles.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading articles file:', error);
    return [];
  }
}

// 服务端获取单篇文章详情
export async function getArticleServer(id: number | string): Promise<Article | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'articles', `${id}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading article ${id} file:`, error);
    return null;
  }
}

// 服务端获取分类数据
export async function getCategoriesServer(): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'categories.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading categories file:', error);
    return [];
  }
} 