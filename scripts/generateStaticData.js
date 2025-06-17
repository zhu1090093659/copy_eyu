const fs = require('fs');
const path = require('path');

async function generateStaticData() {
  console.log('开始生成静态数据...');
  
  // 确保输出目录存在
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  const articlesDataDir = path.join(publicDataDir, 'articles');
  
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  
  if (!fs.existsSync(articlesDataDir)) {
    fs.mkdirSync(articlesDataDir, { recursive: true });
  }

  try {
    // 1. 读取所有文章数据
    const allArticlesPath = path.join(process.cwd(), 'finance_articles', 'all_complete_articles.json');
    const allArticlesContent = fs.readFileSync(allArticlesPath, 'utf8');
    const articles = JSON.parse(allArticlesContent);
    
    // 按创建时间倒序排列
    const sortedArticles = articles.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // 2. 生成文章列表文件
    fs.writeFileSync(
      path.join(publicDataDir, 'articles.json'),
      JSON.stringify(sortedArticles, null, 2)
    );
    console.log(`✓ 生成文章列表: ${sortedArticles.length} 篇文章`);

    // 3. 读取individual目录中的详细文章
    const individualDir = path.join(process.cwd(), 'finance_articles', 'individual');
    const individualFiles = fs.readdirSync(individualDir);
    
    let processedCount = 0;
    
    // 4. 为每篇文章生成单独的静态文件
    for (const file of individualFiles) {
      if (file.endsWith('.json')) {
        const match = file.match(/^(\d+)_/);
        if (match) {
          const articleId = match[1];
          const filePath = path.join(individualDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // 将文章保存到 public/data/articles/{id}.json
          fs.writeFileSync(
            path.join(articlesDataDir, `${articleId}.json`),
            content
          );
          processedCount++;
        }
      }
    }
    
    console.log(`✓ 生成单篇文章文件: ${processedCount} 个文件`);

    // 5. 生成搜索索引
    const searchIndex = sortedArticles.map(article => ({
      id: article.id,
      title: article.title.toLowerCase(),
      brief: article.brief.toLowerCase(),
      category: article.column.name.toLowerCase(),
      createdAt: article.createdAt
    }));
    
    fs.writeFileSync(
      path.join(publicDataDir, 'search-index.json'),
      JSON.stringify(searchIndex, null, 2)
    );
    console.log('✓ 生成搜索索引');

    // 6. 生成分类信息
    const categories = [...new Set(articles.map(article => article.column.name))];
    const categoryData = categories.map(name => {
      const categoryArticles = sortedArticles.filter(article => article.column.name === name);
      return {
        name,
        count: categoryArticles.length,
        articles: categoryArticles
      };
    });
    
    fs.writeFileSync(
      path.join(publicDataDir, 'categories.json'),
      JSON.stringify(categoryData, null, 2)
    );
    console.log(`✓ 生成分类数据: ${categories.length} 个分类`);

    console.log('静态数据生成完成！');
    
  } catch (error) {
    console.error('生成静态数据时出错:', error);
    process.exit(1);
  }
}

generateStaticData(); 