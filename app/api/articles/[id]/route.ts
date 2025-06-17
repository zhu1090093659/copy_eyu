import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Article } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
  }

  try {
    const individualDir = path.join(process.cwd(), 'finance_articles', 'individual');
    const files = fs.readdirSync(individualDir);
    const targetFile = files.find(file => file.startsWith(`${id}_`));
    
    if (!targetFile) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    const fullPath = path.join(individualDir, targetFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const article: Article = JSON.parse(fileContents);
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error reading article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 