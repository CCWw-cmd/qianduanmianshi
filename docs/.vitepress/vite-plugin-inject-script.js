import path from "path";
import fs from "fs";
import { createFilter } from "@rollup/pluginutils";

/**
 * 判断是否存在对应的 -preview.md 文件
 * @param {string} filePath - 原始文件路径
 * @returns {boolean} - 如果存在对应的 -preview.md 文件，返回 true，否则返回 false
 */
function getPreviewFile(filePath) {
  // 获取文件所在目录和文件名
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ".md"); // 去掉 .md 后缀

  // 构造 -preview.md 文件路径
  const previewFilePath = path.join(dir, `./preview/${baseName}.md`);

  // 判断文件是否存在
  const isExist = fs.existsSync(previewFilePath);

  return isExist ? previewFilePath : "";
}

export default function injectScriptPlugin(options = {}) {
  const scriptToInject = `
<script setup>
import { useAuth } from '/auth'
const { isLogin, login, logout } = useAuth(); 
</script>
`;

  const content = (code, previewContent) => {
    return `
<div class="md-content" v-if="!isLogin">

  ${previewContent ? previewContent : "暂无预览"}
  
</div>

<button @click="login" class="read-more" v-if="!isLogin">
  登录阅读全文
</button>

<template v-else>

  ${code}

</template>`;
  };

  const filter = createFilter(options.include || "**/*.md", options.exclude, {
    resolve: path.resolve(process.cwd(), "./docs/src"),
  });

  return {
    name: "vite-plugin-inject-script",
    enforce: "pre",
    transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const previewFilePath = getPreviewFile(id);
      const previewContent = previewFilePath
        ? fs.readFileSync(previewFilePath, "utf-8")
        : "";

      return {
        code: `${scriptToInject}\n${content(code, previewContent)}`,
        map: null,
      };
    },
  };
}
