"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, FileText, Eye, Users } from "lucide-react";
import { Article } from "@/lib/staticApi";
import { INDUSTRY_CATEGORIES } from "@/lib/categoryUtils";
import { formatNumber, formatDate } from "@/lib/utils";

interface IndustryOverviewProps {
  industryStats: Record<string, { count: number; readNum: number }>;
  onIndustrySelect: (industry: string) => void;
  selectedIndustry: string | null;
}

export function IndustryOverview({ industryStats, onIndustrySelect, selectedIndustry }: IndustryOverviewProps) {
  // 获取有文章的行业，按文章数量排序
  const industriesWithArticles = Object.entries(industryStats)
    .filter(([_, stats]) => stats.count > 0)
    .sort(([,a], [,b]) => b.count - a.count);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      {industriesWithArticles.map(([industry, stats]) => (
        <Card 
          key={industry}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
            selectedIndustry === industry 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:bg-slate-50'
          }`}
          onClick={() => onIndustrySelect(selectedIndustry === industry ? '' : industry)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="truncate">{industry}</span>
              <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">研报数量</span>
                </div>
                <Badge variant="secondary" className="font-medium">
                  {stats.count}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">总阅读量</span>
                </div>
                <Badge variant="outline" className="font-medium">
                  {formatNumber(stats.readNum)}
                </Badge>
              </div>
              
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">
                    平均 {Math.round(stats.readNum / stats.count)} 阅读/篇
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 