const path = require("path");
const fs = require("fs");
const { marked } = require("marked");
const ejs = require("ejs");
const cwd = process.cwd();

async function genPreview(name) {
  const dir = path.resolve(cwd, `./docs/src/${name}`);
  const files = fs.readdirSync(dir);
  const ejsTemplate = fs.readFileSync(
    path.resolve(cwd, "./preview.ejs"),
    "utf8"
  );
  // console.log(files);
  files.forEach((filename) => {
    if (filename.endsWith(".md")) {
      const mdContent = fs.readFileSync(path.join(dir, filename), "utf8");
      const tokens = marked.lexer(mdContent, { async: false });
      const filterTokens = [];
      let count = 2; // 可预览章数
      tokens.forEach((token) => {
        const isSecondHead = token.type === "heading" && token.depth === 2;
        const isThirdHead = token.type === "heading" && token.depth === 3;
        if (count >= 0) {
          filterTokens.push({
            raw: token.raw,
          });
          if (isSecondHead) {
            count--;
          }
        } else {
          if (isSecondHead || isThirdHead) {
            filterTokens.push({
              raw: token.raw,
            });
          }
        }
      });
      const previewContent = ejs.render(
        ejsTemplate,
        {
          tokens: filterTokens,
        },
        {
          async: false,
        }
      );
      // console.log(previewContent);

      fs.writeFileSync(
        path.join(dir, `./preview/${filename}`),
        previewContent,
        "utf8"
      );
    }
  });
}

genPreview("principle/javascript");
