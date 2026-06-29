# Webpack开源插件实例剖析

要想熟练编写插件，需要深入理解常见 Hook 调用时机，以及各类上下文参数的用法，这方面没有太多学习资料，我建议直接翻阅相关开源插件源码，下面我会抽几个比较经典、逻辑简单、容易理解的插件，剖析如何灵活使用 Hook。

## 实例剖析：`imagemin-webpack-plugin`

> 学习如何遍历、修改最终产物文件

[imagemin-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2FKlathmon%2Fimagemin-webpack-plugin "https://github1s.com/Klathmon/imagemin-webpack-plugin") 是一个用于实现图像压缩的插件，它会在 Webpack 完成前置的代码分析构建，提交([emit](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompiler-hooks%2F%23emit "https://webpack.js.org/api/compiler-hooks/#emit"))产物时，找出所有图片资源并调用 [imagemin](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fimagemin%2Fimagemin "https://github.com/imagemin/imagemin") 压缩图像。核心逻辑：

```
js
复制代码
export default class ImageminPlugin {
  constructor(options = {}) {
    // init options
  }

  apply(compiler) {
    // ...
    const onEmit = async (compilation, callback) => {
      // ...
      await Promise.all([
        ...this.optimizeWebpackImages(throttle, compilation),
        ...this.optimizeExternalImages(throttle),
      ]);
    };

    compiler.hooks.emit.tapAsync(this.constructor.name, onEmit);
  }

  optimizeWebpackImages(throttle, compilation) {}

  optimizeExternalImages(throttle) {}
}
```

上述代码主要用到 `compiler.hooks.emit` 钩子，该钩子在 Webpack 完成代码构建与打包操作，准备将产物发送到输出目录之前执行，我们可以在此修改产物内容，如上例 `optimizeWebpackImages` 函数：

```
js
复制代码
export default class ImageminPlugin {
  optimizeWebpackImages(throttle, compilation) {
    const {
        // 用于判断是否对特定文件做图像压缩操作
        testFunction,
        // 缓存目录
        cacheFolder
      } = this.options
  
    // 遍历 `assets` 产物数组
      return map(compilation.assets, (asset, filename) => throttle(async () => {
        // 读取产物内容
        const assetSource = asset.source()
        if (testFunction(filename, assetSource)) {
          // 尝试从缓存中读取
          let optimizedImageBuffer = await getFromCacheIfPossible(cacheFolder, assetSource, () => {
            // 调用 `imagemin` 压缩图片
            return optimizeImage(assetSource, this.options)
          })
  
          // 之后，使用优化版本替换原始文件
          compilation.assets[filename] = new RawSource(optimizedImageBuffer)
        }
      }))
  }
}
```

这里面的关键逻辑是：

1.  遍历 `compilation.assets` 产物列表，调用 `asset.source()` 方法读取产物内容；
1.  调用 `imagemin` 压缩图片；
1.  修改 `compilation.assets`，使用优化后的图片 `RawSource` 对象替换原始 `asset` 对象。

至此完成文件压缩操作。

> 提示：`Source` 是 Webpack 内代表资源内容的类，由 [webpack-source](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2Fwebpack%2Fwebpack-sources%2Fblob%2FHEAD%2Flib%2Findex.js "https://github1s.com/webpack/webpack-sources/blob/HEAD/lib/index.js") 库实现，支持 `RawSource/ConcatSource` 等子类型，用于实现文件读写、合并、修改、Sourcemap 等操作。

## 实例剖析：`eslint-webpack-plugin`

> 学习如何提交错误日志

[eslint-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2Fwebpack-contrib%2Feslint-webpack-plugin "https://github1s.com/webpack-contrib/eslint-webpack-plugin") 是一个基于 ESLint 实现的代码风格检查插件，它的实现比较巧妙，一是使用多个 Hook，在不同时间点执行 Lint 检查；二是复用 Webpack 内置的 `error/warn` 方法提交代码风格问题。核心逻辑：

```
js
复制代码
class ESLintWebpackPlugin {
  constructor(options = {}) {
    // ...
  }

  apply(compiler) {
    compiler.hooks.run.tapPromise(this.key, (c) =>
      this.run(c, options, wanted, exclude)
    );
  }

  async run(compiler, options, wanted, exclude) {
    compiler.hooks.compilation.tap(this.key, (compilation) => {
      ({ lint, report, threads } = linter(this.key, options, compilation));

      const files = [];

      // 单个模块成功编译后触发
      compilation.hooks.succeedModule.tap(this.key, ({ resource }) => {
        // 判断是否需要检查该文件
        if (
          isMatch(file, wanted, { dot: true }) &&
          !isMatch(file, exclude, { dot: true })
        ) {
          lint(file);
        }
      });

      // 所有模块构建完毕后触发
      compilation.hooks.finishModules.tap(this.key, () => {
        if (files.length > 0 && threads <= 1) {
          lint(files);
        }
      });

      // 等待检查结果
      compilation.hooks.additionalAssets.tapPromise(this.key, processResults);

      async function processResults() {}
    });
  }
}
```

代码用到如下 Hook：

-   `compiler.hooks.compilation`：Compiler 环境初始化完毕，创建出 `compilation` 对象，准备开始执行构建前触发；
-   `compilation.hooks.succeedModule`：Webpack 完成单个「模块」的读入、运行 Loader、AST 分析、依赖分析等操作后触发；
-   `compilation.hooks.finishModules`：Webpack 完成「所有」模块的读入、运行 Loader、依赖分析等操作后触发；
-   `compilation.hooks.additionalAssets`：构建、打包完毕后触发，通常用于为编译创建附加资产。

其中，比较重要的是借助 `compilation.hooks.succeedModule` 钩子，在每个模块处理完毕之后立即通过 `lint` 函数添加非阻塞代码检查任务，相比于过去的 [eslint-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Feslint-loader "https://www.npmjs.com/package/eslint-loader") 的阻塞式执行，这种方式能够提高 ESLint 的并发度，效率更高。

其次，借助 `compilation.hooks.additionalAssets` 钩子，在所有模块处理完毕后读取检查结果 —— 即 `processResults` 函数，核心代码：

```
js
复制代码
async function processResults() {
  const { errors, warnings } = await report();

  if (warnings && !options.failOnWarning) {
    compilation.warnings.push(warnings);
  } else if (warnings && options.failOnWarning) {
    compilation.errors.push(warnings);
  }

  if (errors && options.failOnError) {
    compilation.errors.push(errors);
  } else if (errors && !options.failOnError) {
    compilation.warnings.push(errors);
  }
}
```

代码读取 ESLint 执行结果(`report` 函数)，并使用 `compilation` 的 `errors` 与 `warnings` 数组提交错误/警告信息，这种方式只会输出错误信息，不会中断编译流程，运行效果如：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f20b7925decf41b399a998e628de6465~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1750001996&x-orig-sign=EWnAd4WN3xCMksZRu3a4l6dUeXk%3D)

## 实例剖析：`DefinePlugin`

> 学习在插件中如何与 AST 结构交互

[DefinePlugin](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2Fwebpack%2Fwebpack "https://github1s.com/webpack/webpack") 是 Webpack 官方实现的，用于构建时注入预定义常量的插件，先简单回顾一下[用法](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Fplugins%2Fdefine-plugin%2F "https://webpack.js.org/plugins/define-plugin/")，如：

```
js
复制代码
const { DefinePlugin } = require("webpack");

const baseConfig = {
  // ...
  plugins: [
    new DefinePlugin({
      PROD: true,
      VERSION: JSON.stringify("12.13.0"),
    }),
  ],
};
```

之后，Webpack 会帮我们替换掉代码中所有 `DefinePlugin` 声明的属性值，例如：

```
js
复制代码
// 源码：
console.log(PROD, VERSION);

// 构建结果：
console.log(true, "5fa3b9");
```

`DefinePlugin` 的 [底层实现](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2Fwebpack%2Fwebpack%2Fblob%2FHEAD%2Flib%2FDefinePlugin.js "https://github1s.com/webpack/webpack/blob/HEAD/lib/DefinePlugin.js") 比较复杂，需要遍历 AST 找出变量名对应的代码位置之后再做替换，插件核心结构：

```
js
复制代码
class DefinePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "DefinePlugin",
      (compilation, { normalModuleFactory }) => {
        const handler = (parser) => {
          // 递归处理 `DefinePlugin` 参数
          const walkDefinitions = (definitions, prefix) => {
            Object.keys(definitions).forEach((key) => {
              const code = definitions[key];
              if (isObject /*...*/) {
                // 递归处理对象属性
                walkDefinitions(code, prefix + key + ".");
                applyObjectDefine(prefix + key, code);
                return;
              }
              applyDefineKey(prefix, key);
              applyDefine(prefix + key, code);
            });
          };

          // 替换基本类型的表达式值
          const applyDefine = (key, code) => {
            if (!isTypeof) {
              // 借助 expression 钩子替换内容
              parser.hooks.expression.for(key).tap("DefinePlugin", (expr) => {
                /*...*/
              });
            }
            // 处理 `'typeof window': JSON.stringify('object'),` 场景
            parser.hooks.typeof.for(key).tap("DefinePlugin", (expr) => {
              /*...*/
            });
          };

          // 替换引用类型的表达式值
          const applyObjectDefine = (key, obj) => {
            // ...
            parser.hooks.expression.for(key).tap("DefinePlugin", (expr) => {
              /*...*/
            });
          };

          walkDefinitions(definitions, "");
        };

        // 监听 `parser` 钩子
        normalModuleFactory.hooks.parser
          .for("javascript/auto")
          .tap("DefinePlugin", handler);
        normalModuleFactory.hooks.parser
          .for("javascript/dynamic")
          .tap("DefinePlugin", handler);
        normalModuleFactory.hooks.parser
          .for("javascript/esm")
          .tap("DefinePlugin", handler);
      }
    );
  }
}
module.exports = DefinePlugin;
```

> 提示：可能有同学注意到，上例代码中出现 `xxx.hooks.xxx.for(condition).tap` 形式的调用，这里的 `for` 函数可以理解为 Hook 的过滤条件，仅在满足 `condition` 时触发，后面章节会详细讲解。

核心逻辑：

1.  使用 `normalModuleFactory.hooks.parser` 钩子(上例 48 行)，在 Webpack 创建出代码解析器 `Parser` 对象后执行 `handler` 函数。注意，此时还没有执行代码转 AST 操作；
1.  `walkDefinitions` 函数中递归遍历 `DefinePlugin` 参数对象，为每一个属性注册 `parser.hooks.expression` 钩子回调，该钩子会在 Webpack 遍历 AST 过程遇到表达式语句时触发；
1.  在 `parser.hooks.expression` 回调中创建新的 `Dependency` 对象，调用 [addPresentationalDependency](https://link.juejin.cn/?target=https%3A%2F%2Fgithub1s.com%2Fwebpack%2Fwebpack%2Fblob%2FHEAD%2Flib%2FModule.js%23L494 "https://github1s.com/webpack/webpack/blob/HEAD/lib/Module.js#L494") 添加为模块依赖：

```
js
复制代码
const toConstantDependency = (parser, value, runtimeRequirements) => {
  return function constDependency(expr) {
    const dep = new ConstDependency(value, expr.range, runtimeRequirements);
    dep.loc = expr.loc;
    // 创建静态依赖对象，替换 loc 指定位置内容
    parser.state.module.addPresentationalDependency(dep);
    return true;
  };
};

const applyDefine = (key, code) => {
  parser.hooks.expression.for(key).tap("DefinePlugin", (expr) => {
    const strCode = toCode(/*...*/);
    if (/*...*/) {
      /*...*/
    } else {
      return toConstantDependency(parser, strCode)(expr);
    }
  });
};
```

之后，Webpack 会借助 Template 接口将上述 `Dependency` 打包进 Chunk 中，替换对应位置(`loc`)代码：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a2b35b43a5264272b8b9c34ca5d91496~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1750001994&x-orig-sign=Yw%2B9skeKtwbuzHhF79utemcBKL4%3D)

这是一个功能效果看起来简单，但实现特别复杂的例子，底层需要使用 `Parser` 钩子遍历 AST 结构，之后借助 `Dependency` 声明代码依赖，最后借助 Template 替换代码内容，过程中已经涉及到许多 Webpack 底层对象。

这正是学习开发 Webpack 插件的难点，有时候你不仅仅需要了解每一个 Hook 的时机与作用、如何与上下文参数交互，还需要了解 Webpack 底层许多类型的实现、作用、接口等等，才能写出符合预期的功能，而 Webpack 是一个极度复杂、庞大的工具，这些具体知识点太多太碎，几乎不可能一一枚举。不过，我们可以换一种方式，从更高更抽象的视角审视 Webpack 插件架构，从“道”的角度加深理解。