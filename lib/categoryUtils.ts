import { Article } from './api';

// 行业分类映射
export const INDUSTRY_CATEGORIES = {
  '化工': ['化工', '石化', '化肥', '农药', '塑料', '基础化工', '新材料'],
  '军工': ['军工', '国防', '航空', '航天', '武器', '航空发动机'],
  '医药': ['医药', '生物', '制药', '医疗', '健康', '创新药', '保健品'],
  '汽车': ['汽车', '新能源车', '智能汽车', '汽车零部件'],
  '金融': ['银行', '证券', '保险', '金融', '稳定币'],
  '房地产': ['房地产', '地产', '物业', '建筑', '建材'],
  '能源': ['煤炭', '石油', '电力', '新能源', '风电', '核聚变', '氢能', '锂电池'],
  '有色金属': ['有色金属', '金属', '钢铁', '白银'],
  '消费': ['食品饮料', '纺织服装', '小家电', '乳制品', '白酒', '啤酒', '消费'],
  '科技': ['半导体', 'AI', '电子', '存储', '机器人', '人形机器人'],
  '农业': ['农林牧渔', '农业', '宠物经济'],
  '交通运输': ['交通运输', '港口航运', '物流'],
  '传媒': ['传媒', '短剧', '社会服务'],
  '轻工制造': ['轻工', '制造', '机械', '逆变器']
};

// 宏观经济关键词
export const MACRO_ECONOMY_KEYWORDS = [
  'CPI', 'GDP', '通胀', '利率', '货币政策', '财政政策', 
  '美联储', '央行', '宏观', '经济', '金融数据', '核心CPI',
  '关税', '美国', '中美', '贸易', '汇率', '人民币', '美元'
];

// 投资策略关键词
export const INVESTMENT_STRATEGY_KEYWORDS = [
  '投资策略', '投资建议', '市场展望', '配置建议', '风险提示',
  '年报', '季报', '中报', '综述', '策略', '展望', '分析',
  '周报', '月报', '跟踪', '观察'
];

// 按行业分类文章
export function categorizeByIndustry(articles: Article[]): Record<string, Article[]> {
  const result: Record<string, Article[]> = {};
  
  // 初始化分类
  Object.keys(INDUSTRY_CATEGORIES).forEach(industry => {
    result[industry] = [];
  });
  result['其他'] = [];

  articles.forEach(article => {
    let categorized = false;
    const titleAndContent = `${article.title} ${article.brief || ''}`.toLowerCase();
    
    // 检查每个行业分类
    for (const [industry, keywords] of Object.entries(INDUSTRY_CATEGORIES)) {
      if (keywords.some(keyword => titleAndContent.includes(keyword.toLowerCase()))) {
        result[industry].push(article);
        categorized = true;
        break;
      }
    }
    
    // 如果没有匹配到任何分类，放入其他
    if (!categorized) {
      result['其他'].push(article);
    }
  });

  return result;
}

// 获取宏观经济相关文章
export function getMacroEconomyArticles(articles: Article[]): Article[] {
  return articles.filter(article => {
    const titleAndContent = `${article.title} ${article.brief || ''}`.toLowerCase();
    return MACRO_ECONOMY_KEYWORDS.some(keyword => 
      titleAndContent.includes(keyword.toLowerCase())
    );
  });
}

// 获取投资策略相关文章
export function getInvestmentStrategyArticles(articles: Article[]): Article[] {
  return articles.filter(article => {
    const titleAndContent = `${article.title} ${article.brief || ''}`.toLowerCase();
    return INVESTMENT_STRATEGY_KEYWORDS.some(keyword => 
      titleAndContent.includes(keyword.toLowerCase())
    );
  });
}

// 获取行业统计信息
export function getIndustryStats(articles: Article[]): Record<string, { count: number; readNum: number }> {
  const categorized = categorizeByIndustry(articles);
  const stats: Record<string, { count: number; readNum: number }> = {};
  
  Object.entries(categorized).forEach(([industry, industryArticles]) => {
    stats[industry] = {
      count: industryArticles.length,
      readNum: industryArticles.reduce((sum, article) => 
        sum + (article.full_content?.articleStat?.readNum || 0), 0
      )
    };
  });
  
  return stats;
}

// 获取最新的行业文章
export function getLatestIndustryArticles(articles: Article[], industry: string, limit: number = 5): Article[] {
  const categorized = categorizeByIndustry(articles);
  return (categorized[industry] || []).slice(0, limit);
}

// 获取热门行业文章
export function getPopularIndustryArticles(articles: Article[], industry: string, limit: number = 5): Article[] {
  const categorized = categorizeByIndustry(articles);
  return (categorized[industry] || [])
    .filter(article => article.full_content?.articleStat?.readNum)
    .sort((a, b) => 
      (b.full_content?.articleStat?.readNum || 0) - (a.full_content?.articleStat?.readNum || 0)
    )
    .slice(0, limit);
} 