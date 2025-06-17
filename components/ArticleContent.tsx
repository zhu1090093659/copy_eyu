"use client";

import { useEffect, useRef } from "react";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // 处理图片
      const images = contentRef.current.querySelectorAll('img');
      images.forEach((img) => {
        // 添加响应式类
        img.classList.add('max-w-full', 'h-auto', 'rounded-lg', 'shadow-sm', 'my-4');
        
        // 处理图片地址（如果需要）
        const src = img.getAttribute('src');
        if (src && src.startsWith('//')) {
          img.src = 'https:' + src;
        }
        
        // 添加懒加载
        img.loading = 'lazy';
        
        // 添加点击放大功能
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          // 这里可以实现图片预览功能
          window.open(img.src, '_blank');
        });
      });

      // 处理链接
      const links = contentRef.current.querySelectorAll('a');
      links.forEach((link) => {
        link.classList.add('text-blue-600', 'hover:text-blue-800', 'underline');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });

      // 处理表格
      const tables = contentRef.current.querySelectorAll('table');
      tables.forEach((table) => {
        table.classList.add(
          'w-full', 'border-collapse', 'border', 'border-slate-300', 
          'rounded-lg', 'overflow-hidden', 'my-4'
        );
        
        // 处理表头
        const ths = table.querySelectorAll('th');
        ths.forEach((th) => {
          th.classList.add(
            'bg-slate-50', 'px-4', 'py-2', 'text-left', 'font-semibold', 
            'text-slate-900', 'border-b', 'border-slate-300'
          );
        });
        
        // 处理表格单元格
        const tds = table.querySelectorAll('td');
        tds.forEach((td) => {
          td.classList.add(
            'px-4', 'py-2', 'border-b', 'border-slate-200', 'text-slate-700'
          );
        });
      });

      // 处理代码块
      const codeBlocks = contentRef.current.querySelectorAll('pre');
      codeBlocks.forEach((pre) => {
        pre.classList.add(
          'bg-slate-900', 'text-slate-100', 'p-4', 'rounded-lg', 
          'overflow-x-auto', 'my-4', 'text-sm'
        );
      });

      // 处理行内代码
      const inlineCodes = contentRef.current.querySelectorAll('code');
      inlineCodes.forEach((code) => {
        if (!code.closest('pre')) { // 不是代码块中的代码
          code.classList.add(
            'bg-slate-100', 'text-slate-800', 'px-2', 'py-1', 
            'rounded', 'text-sm', 'font-mono'
          );
        }
      });

      // 处理引用块
      const blockquotes = contentRef.current.querySelectorAll('blockquote');
      blockquotes.forEach((blockquote) => {
        blockquote.classList.add(
          'border-l-4', 'border-blue-500', 'pl-4', 'italic', 
          'text-slate-600', 'bg-slate-50', 'p-4', 'rounded-r-lg', 'my-4'
        );
      });
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="prose prose-slate max-w-none prose-lg"
      style={{
        // 自定义样式变量
        '--tw-prose-body': 'rgb(71 85 105)',
        '--tw-prose-headings': 'rgb(15 23 42)',
        '--tw-prose-lead': 'rgb(51 65 85)',
        '--tw-prose-links': 'rgb(37 99 235)',
        '--tw-prose-bold': 'rgb(15 23 42)',
        '--tw-prose-counters': 'rgb(100 116 139)',
        '--tw-prose-bullets': 'rgb(148 163 184)',
        '--tw-prose-hr': 'rgb(226 232 240)',
        '--tw-prose-quotes': 'rgb(15 23 42)',
        '--tw-prose-quote-borders': 'rgb(226 232 240)',
        '--tw-prose-captions': 'rgb(100 116 139)',
        '--tw-prose-code': 'rgb(15 23 42)',
        '--tw-prose-pre-code': 'rgb(226 232 240)',
        '--tw-prose-pre-bg': 'rgb(15 23 42)',
        '--tw-prose-th-borders': 'rgb(209 213 219)',
        '--tw-prose-td-borders': 'rgb(229 231 235)',
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 