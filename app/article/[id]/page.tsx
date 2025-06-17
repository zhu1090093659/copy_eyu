import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getArticleById } from "@/lib/api";
import { formatDate, formatNumber } from "@/lib/utils";
import { ArticleContent } from "@/components/ArticleContent";
import { RelatedArticles } from "@/components/RelatedArticles";


interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const articleId = parseInt(params.id);
  const article = await getArticleById(articleId);

  if (!article || !article.full_content) {
    notFound();
  }

  const { full_content } = article;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 头部导航 */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>返回首页</span>
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                收藏
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                {/* 文章头部信息 */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {full_content.column.name}
                    </Badge>
                    {article.top === 1 && (
                      <Badge variant="destructive">置顶</Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                    {full_content.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 text-sm text-slate-500 pb-6 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>发布时间: {formatDate(full_content.createdAt)}</span>
                    </div>
                    
                    {full_content.updatedAt !== full_content.createdAt && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>更新时间: {formatDate(full_content.updatedAt)}</span>
                      </div>
                    )}
                    
                    {full_content.articleStat && (
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>阅读量: {formatNumber(full_content.articleStat.readNum)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 文章内容 */}
                <ArticleContent content={full_content.content} />
                
                {/* 文章底部信息 */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      文章ID: {full_content.id}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        分享文章
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        收藏
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 文章信息卡片 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">文章信息</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">分类</span>
                      <Badge variant="outline">{full_content.column.name}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">发布时间</span>
                      <span className="text-slate-900">{formatDate(full_content.createdAt)}</span>
                    </div>
                    {full_content.articleStat && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">阅读量</span>
                        <span className="text-slate-900">
                          {formatNumber(full_content.articleStat.readNum)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">文章ID</span>
                      <span className="text-slate-900">{full_content.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 相关文章 */}
              <RelatedArticles 
                currentArticleId={article.id} 
                category={full_content.column.name} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

 