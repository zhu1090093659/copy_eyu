import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('zh-CN').format(num)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '')
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 搜索历史管理
const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  const history = getSearchHistory();
  const trimmedQuery = query.trim();
  
  // 移除重复项
  const filteredHistory = history.filter(item => item !== trimmedQuery);
  
  // 添加到开头
  const newHistory = [trimmedQuery, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
  
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch {
    // 忽略存储错误
  }
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // 忽略存储错误
  }
}

// 文本高亮处理
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const keywords = query.trim().split(/\s+/);
  let highlightedText = text;
  
  keywords.forEach(keyword => {
    if (keyword.length > 1) {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 text-yellow-900 rounded px-1">$1</mark>'
      );
    }
  });
  
  return highlightedText;
} 