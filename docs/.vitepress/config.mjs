import { defineConfig } from "vitepress";
import path from "node:path";
import fs from "node:fs";
import injectScriptPlugin from "./vite-plugin-inject-script";

const cwd = process.cwd();
// const tree = getFolderTree('');
// const sidebar = convertToSidebar(tree.items.filter((item) => item.items));
// console.log(JSON.stringify(sidebar, null, 2));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端进阶之旅",
  description: "系统进阶笔记 & 面试指南",
  titleTemplate: "面试命中率高达90%",
  srcDir: "src",
  // 设置GitHub Pages基础路径，需要与仓库名匹配
  base: process.env.NODE_ENV === 'production' ? '/qianduanmianshi/' : '/',
  // rewrites: {
  //   // 将 /guide 路由指向预览内容，但使用完整版生成目录
  //   'guide': 'preview/guide.md',
  //   'api': 'preview/api.md'
  // }
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      // message: "娃哈哈有限公司",
      copyright: "Copyright © 2035-present xiaozhu",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    search: {
      provider: "local",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "基础进阶",
        activeMatch: "/basic/",
        items: [
          { text: "基础篇", link: "/basic/base" },
          { text: "进阶篇", link: "/basic/improve" },
          { text: "高频篇", link: "/basic/high-frequency" },
          { text: "手写篇", link: "/basic/handlewritten" },
          { text: "综合题型", link: "/basic/comprehensive" },
          { text: "其它问题", link: "/basic/other-questions" },
        ],
      },
      {
        text: "原理篇",
        activeMatch: "/principle/",
        items: [
          { text: "Vue.js设计与实现", link: "/principle/Vue.js设计与实现/第1章权衡的艺术" },
          { text: "Vue", link: "/principle/vue/01-从源码解读Vue生命周期" },
          { text: "React", link: "/principle/react/01-React router原理" },
          { text: "Node", link: "/principle/node/01-Node事件循环机制原理" },
          { text: "Javascript", link: "/principle/javascript/01-JavaScript引擎如何执行JavaScript代码" },
          { text: "Webpack", link: "/principle/webpack/01-手写webpack打包核心原理 彻底讲明白Webpack设计理念" },
        ],
      },
      {
        text: "精选篇",
        link: "/excellent/01-HTML",
        activeMatch: "/excellent/",
      },
      {
        text: "面经篇",
        activeMatch: "/interview-exp/",
        link: "/interview-exp/index",
      },
      {
        text: "自检篇",
        activeMatch: "/qa/",
        link: "/qa/1-前端100题自检",
      },
      {
        text: "每日一题",
        activeMatch: "/days/",
        link: "/days/index",
      },
      {
        text: "更多",
        items: [
          {
            text: "综合",
            items: [
              {
                text: "算法面试",
                link: "/algorithm/01-数据结构（一）",
              },
              {
                text: "设计模式",
                link: "/design-pattern/base",
              },
            ],
          },
          {
            text: "前端基础",
            items: [
              {
                text: "Vue3",
                link: "https://cn.vuejs.org/",
              },
            ],
          },
        ],
      },
      {
        component: "UserInfo",
      },
    ],

    sidebar: {
      "/algorithm/": {
        items: [
          {
            text: "算法面试",
            items: getItems("algorithm"),
          },
        ],
      },
      "/basic/": {
        base: "/basic/",
        items: [
          {
            text: "基础进阶",
            collapsed: true,
            items: [
              { text: "基础篇", link: "base" },
              { text: "进阶篇", link: "improve" },
              { text: "高频篇", link: "high-frequency" },
              { text: "手写篇", link: "handlewritten" },
              { text: "综合题型", link: "comprehensive" },
              { text: "其它问题", link: "other-questions" },
            ],
          },
        ],
      },
      "/design-pattern/": {
        base: "/design-pattern/",
        items: [
          {
            text: "设计模式",
            collapsed: true,
            items: [
              { text: "1. 基础篇", link: "base" },
              { text: "2. 行为型模式", link: "behavioral" },
              { text: "3. 创建型模式", link: "creational" },
              { text: "4. 结构型模式", link: "structural" },
              { text: "5. 其它模式", link: "other" },
            ],
          },
        ],
      },
      "/excellent/": {
        items: [
          {
            text: "精选模块",
            items: getItems('excellent'),
          },
        ],
      },
      "/principle/": {
        items: [
          {
            text: "原理篇",
            collapsed: true,
            items: [
              {
                text: "Javascript",
                items: getItems("principle/javascript"),
              },
              {
                text: "Vue",
                items: getItems("principle/vue"),
              },
              {
                text: "React",
                items: getItems("principle/react"),
              },
              {
                text: "Node",
                items: getItems("principle/node"),
              },
              {
                text: "Webpack",
                items: getItems("principle/webpack"),
              },
            ],
          },
        ],
      },
      "/qa/": {
        items: [
          {
            text: "自检篇",
            collapsed: true,
            items: getItems("qa"),
          },
        ],
      },
    },

    lastUpdated: {
      text: "最后更新于",
    },

    outline: {
      level: "deep",
      label: "目录",
    },

    returnToTopLabel: "返回顶部",
  },
  vite: {
    plugins: [
      injectScriptPlugin({
        include: "**/*.md",
        exclude: ["index.md"],
      }),
    ],
  },
});

function getItems(name) {
  const dir = path.resolve(cwd, `./docs/src/${name}`);
  const files = fs.readdirSync(dir);
  return files
    .filter((filename) => filename !== "preview" && filename !== "images")
    .map((filename) => {
      return {
        text: filename.replace(/\.md$/, ""),
        link: `/${name}/${filename.replace(/\.md$/, "")}`,
      };
    })
}

/**
 * 遍历文件夹并转成树结构
 * @param {string} dirPath - 文件夹路径
 * @returns {object} - 树结构
 */
function getFolderTree(dirname) {
  const dirPath = path.resolve(cwd, "docs/src", dirname);
  const stats = fs.statSync(dirPath);

  // 如果路径不是文件夹，直接返回 null
  if (!stats.isDirectory()) {
    return null;
  }

  const tree = {
    text: path.basename(dirPath), // 当前文件夹名称
    items: [], // 子节点
  };

  const files = fs.readdirSync(dirPath);

  files
    // 过滤点掉 preview 和 public 文件夹以及以 .js 结尾的文件
    .filter((f) => f !== "preview" && f !== "public" && !f.endsWith(".js")) // 过滤掉 preview 和 public 文件夹
    .forEach((filename) => {
      const fullPath = path.join(dirPath, filename);
      const fileStats = fs.statSync(fullPath);

      if (fileStats.isDirectory()) {
        // 如果是文件夹，递归调用
        tree.items.push(getFolderTree(fullPath));
      } else {
        // 如果是文件，直接添加到子节点
        tree.items.push({
          text: filename,
        });
      }
    });

  return tree;
}

function convertToSidebar(data) {
  const sidebar = {};

  /**
   * 递归处理每个节点
   * @param {Array} items - 当前层级的 items
   * @param {string} basePath - 当前层级的路径前缀
   * @returns {Array} - 转换后的 sidebar items
   */
  function processItems(items, basePath) {
    return items.map((item) => {
      const currentPath = `${basePath}${item.text.replace(".md", "")}/`;

      if (item.items) {
        // 如果有子节点，递归处理
        return {
          text: item.text,
          collapsed: false,
          items: processItems(item.items, currentPath),
        };
      }

      // 如果是文件，生成 link
      return {
        text: item.text.replace(".md", ""),
        link: `${basePath}${item.text.replace(".md", "")}`,
      };
    });
  }

  data.forEach((item) => {
    const basePath = `/${item.text}/`;
    sidebar[basePath] = {
      // base: basePath,
      items: [
        {
          text: item.text,
          collapsed: false,
          items: item.items ? processItems(item.items, basePath) : [],
        },
      ],
    };
  });

  return sidebar;
}
