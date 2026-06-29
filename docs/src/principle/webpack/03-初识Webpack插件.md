# 初识Webpack插件

先去[官网](https://webpack.js.org/contribute/writing-a-plugin/#root)了解一下 **Webpack Plugin** 的概念：

> Webpack Plugin：向第三方开发者提供了 Webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以在 Webpack 构建流程中引入自定义的行为。创建插件比创建 loader 更加高级，因为你需要理解 Webpack 底层的特性来处理相应的钩子

![867997b1-26f7-40fb-b4b2-c911306bdda4.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c39c0d448c904341a5498725396881ec~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=Vk8gcq1TRSRB5a4DfKinB9nGv3s%3D)

通俗点说就是`可以在构建流程中插入我们的自定义的行为`，至于在哪个阶段插入或者做什么事情都可以通过 Webpack Plugin 来完成。

另外官网还提到，想要弄清楚 **Webpack 插件** 得先弄清楚这三个东西：[tapable](https://www.npmjs.com/package/tapable)、[compiler](https://webpack.js.org/plugins/internal-plugins/#compiler) 和 [compilation对象](https://webpack.js.org/api/compilation-object/#root)，先快点花几分钟去了解一下，争取在中午吃饭前搞定！

![27df2766-960f-4c9c-823c-46d62092bdd9.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6f55994ecbe1446cad674607cc8dacf7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=KkCMTj81ExDz2H7N%2BCf%2BPvze4M4%3D)

## 💁 tapable的使用姿势

[tapable](https://www.npmjs.com/package/tapable)是一个类似于 Node.js 中的 [EventEmitter](https://www.npmjs.com/package/events) 的库，但它**更专注于自定义事件的触发和处理**。通过 [tapable](https://www.npmjs.com/package/tapable) 我们可以注册自定义事件，然后在适当的时机去触发执行。

![e9bb13dc-a5b9-4e89-a258-8001c80d7558.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/8edf5de615ab4ddc82303450a2a8f670~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=8GtZnQ7tdQHPAXjpkL6hlVaZ7wQ%3D)

举个例子🌰：类比到 `Vue` 和 `React` 框架中的生命周期函数，它们就是到了固定的时间节点就执行对应的生命周期，`tapable` 做的事情就和这个差不多，可以先注册一系列的生命周期函数，然后在合适的时间点执行。

概念了解的差不多了，接下来去实操一下。初始化项目，安装依赖：

```js
npm init //初始化项目
yarn add tapable -D //安装依赖
```

安装完项目依赖后，根据以下目录结构来添加对应的目录和文件：

```
csharp
├── dist # 打包输出目录
├── node_modules
├── package-lock.json
├── package.json
└── src # 源码目录
     └── index.js # 入口文件
```

根据官方介绍，[tapable](https://www.npmjs.com/package/tapable) 使用起来还是挺简单的，只需三步：

1. 实例化钩子函数（ [tapable](https://www.npmjs.com/package/tapable)会暴露出各种各样的 hook，这里以同步钩子`Synchook`为例）
1. 注册事件
1. 触发事件

**src/index.js**

```js
const { SyncHook } = require("tapable"); //这是一个同步钩子

//第一步：实例化钩子函数，可以在这里定义形参
const syncHook = new SyncHook(["author"]);

//第二步：注册事件1
syncHook.tap("监听器1", (name) => {
  console.log("监听器1:", name);
});

//第二步：注册事件2
syncHook.tap("监听器2", (name) => {
  console.log("监听器2", name);
});

//第三步：触发事件
syncHook.call("不要秃头啊");
```

运行 `node ./src/index.js`，拿到执行结果：

```js
监听器1 不要秃头啊
监听器2 不要秃头啊
```

![63c7e8b4-11bd-4cc5-a96d-be8bcc486365.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e45670b6c1ad4b4aa5cd36cc736f3f60~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=wZ71IOdP%2Bbq0oqSuCdq9Eb3I0K4%3D)

从上面的例子中可以看出 [tapable](https://www.npmjs.com/package/tapable) 采用的是**发布订阅模式**，`通过 tap 函数注册监听函数，然后通过 call 函数按顺序执行之前注册的函数`。

大致原理：

```js
class SyncHook {
  constructor() {
    this.taps = [];
  }

  //注册监听函数，这里的name其实没啥用
  tap(name, fn) {
    this.taps.push({ name, fn });
  }

  //执行函数
  call(...args) {
    this.taps.forEach((tap) => tap.fn(...args));
  }
}
```

另外，[tapable](https://www.npmjs.com/package/tapable) 中不仅有 `Synchook`，还有其他类型的 hook:

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6127e0db51074d1abfbd0392bfab23e1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=O4K8mn38MCYop46ifvsywbxNoX4%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/766a0775c5e44cdcbcc205f68749a3c2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=dlZMayEEZiyaAD98xdVWMnBr10I%3D)

这里详细说一下这几个类型的概念：

- **Basic（基本的）** ：执行每一个事件函数，不关心函数的返回值
- **Waterfall（瀑布式的**）：如果前一个事件函数的结果 `result !== undefined`，则 result 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）
- **Bail（保险的）** ：执行每一个事件函数，遇到第一个结果 `result !== undefined` 则返回，不再继续执行（也就是只要其中一个有返回了，后面的就不执行了）
- **Loop（循环的）** ：不停的循环执行事件函数，直到所有函数结果 `result === undefined`

大家也不用死记硬背，遇到相关的需求时查文档就好了。

在上面的例子中我们用的`SyncHook`，它就是一个同步的钩子。又因为并不关心返回值，所以也算是一个基本类型的 hook。

![0564085f-3d25-4be0-aeed-6e24c6205762.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/840a4486021a4800b931978b8785fa0d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=cyODlxvm0qQ5ebDlhjZFZDfTv0g%3D)

## 👫 tabpable 和 Webpack 的关系

要说它们俩的关系，可真有点像男女朋友之间的难舍难分......

![5be98b8a-f500-4f28-8240-a69e567e71b1.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b01e4243072d442db7bdc963113f38fb~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=fBXa1xnRN%2BCXoT4oIxlwIOYeKdo%3D)

`Webpack 本质上是一种事件流的机制`，它的工作流程就是将各个插件串联起来，比如

- 在打包前需要处理用户传过来的参数，判断是采用单入口还是多入口打包，就是通过 `EntryOptionPlugin` 插件来做的
- 在打包过程中，需要知道采用哪种读文件的方式就是通过 `NodeEnvironmentPlugin` 插件来做的
- 在打包完成后，需要先清空 dist 文件夹，就是通过 `CleanWebpackPlugin` 插件来完成的
- ......

而实现这一切的核心就是 [tapable](https://www.npmjs.com/package/tapable)。Webpack 内部通过 [tapable](https://www.npmjs.com/package/tapable) 会提前定义好一系列不同阶段的 hook ，然后在固定的时间点去执行（触发 `call` 函数）。而插件要做的就是通过 `tap` 函数注册自定义事件，从而让其控制在 Webapack 事件流上运行：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/06297bbdfcf14e7db4262ee17bda49ac~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=L8373ZIdDBISvSeFPasvWzd18E8%3D)

继续拿 Vue 和 React 举例，就好像框架内部定义了一系列的生命周期，而我们要做的就是在需要的时候定义好这些生命周期函数就好。

![9fca05f9-1d48-436a-bafd-f45d808a3b49.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9281914c19d94b2991c653d2a6778951~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=1IqcY8tpatjHnsN%2FCURHHg29HTA%3D)

## 🏊‍♀️ Compiler 和 Compilation

在插件开发中还有两个很重要的资源：[compiler](https://webpack.js.org/plugins/internal-plugins/#compiler) 和 [compilation对象](https://webpack.js.org/api/compilation-object/#root)。理解它们是扩展 Webpack 引擎的第一步。

- `compiler 对象代表了完整的 webpack 生命周期`。这个对象在启动 Webpack 时被一次性建立，并配置好所有可操作的设置，包括 `options`，`loader` 和 `plugin`。当在 Webpack 环境中应用一个插件时，插件将收到此 `compiler` 对象的引用。可以使用它来访问 Webpack 的主环境。
- `compilation 对象代表了一次资源版本构建`。当运行 Webpack 开发环境中间件（ [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)）时，`每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源`。一个 `compilation` 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

![5dd8339b-4ebd-4007-9e14-f1ca58c17d53.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/733999a9cfe7499096295f860b7abbf7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=B9BuVQjeq%2B0mtwGMvAFWAvOCCLo%3D)

还是拿 React 框架举例子...... React:

![590d1a42-2273-41c5-8ac2-d9e9ed90cf76.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2bcf14ffa65c4d92a2f9f75a0939bad6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=%2BE2c0%2BxirfuCSiTgBqTayih4TjM%3D)

把`compiler`比喻成 React 组件，在 React 组件中有一系列的生命周期函数（`componentDidMount()`、`render()`、`componentDidUpdate()`等等），这些钩子函数都可以在组件中被定义。

把`compilation`比喻成 `componentDidUpdate()`，`componentDidUpdate()`只是组件中的某一个钩子，它专门负责重复渲染的工作（`compilation`只是`compiler`中某一阶段的 hook ,主要负责对模块资源的处理，只不过它的工作更加细化，在它内部还有一些子生命周期函数）。

如果还是不理解，这里画个图帮助大家理解：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/808fec3f714e472291dbd0bafdb0246a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992697&x-orig-sign=RtjaBNbYPClK8cBnBsFGg4e1cAw%3D)

图上的 [entryOption](https://webpack.docschina.org/api/compiler-hooks/#entryoption)、[afterPlugins](https://webpack.docschina.org/api/compiler-hooks/#afterplugins)、[beforeRun](https://webpack.docschina.org/api/compiler-hooks/#beforerun)、[compilation](https://webpack.docschina.org/api/compiler-hooks/#compilation) 等均是构建过程中的生命周期，而 [compilation](https://webpack.docschina.org/api/compiler-hooks/#compilation) 只是该过程中的其中一部分，它主要负责对模块资源的处理。在 [compilation](https://webpack.docschina.org/api/compiler-hooks/#compilation) 内部也有自己的一系列生命周期，例如图中的 [buildModule](https://webpack.docschina.org/api/compilation-hooks/#buildmodule)、[finishModules](https://webpack.docschina.org/api/compilation-hooks/#finishmodules) 等。

![cf8d3c96-74d9-434b-a27d-060dc5244311.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f90efa1366424015920f1c059ed2d124~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=wHFFlrLukQrzcF%2FPjIZ682GpYvA%3D)

至于为什么要这么处理，`原因当然是为了解耦`！！！

比如当我们启动 [Webpack 的 watch模式](https://webpack.docschina.org/configuration/watch#root)，当文件模块发生变化时会重新进行编译，这个时候`并不需要每次都重新创建 compiler 实例，只需要重新创建一个 compilation 来记录编译信息即可`。

另外，图中并没有将全部的 hook 展示出来，更多的hook可以自行查阅官网：[compiler上挂载的 hook](https://webpack.docschina.org/api/compiler-hooks/) ，[compilation上挂载的 hook](https://webpack.docschina.org/api/compilation-hooks/)。

![ef377b09-4933-4828-9ce1-6bd2b2536e6f.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/717b7a1514f8489181e7e81c33b3d23c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=B6Ohbr4446pPy%2F%2BtO7e%2FbUhzHEo%3D)

## 🏃 如何编写插件

说了这么多，到底要怎么写一个 Webpack 插件？小舒还等着我呢！！！

![bb9b6a98-7058-48fc-9ec5-bc84d7bcf8f2.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/7be7c92fe3e04e659473c1d4cde75bf0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992697&x-orig-sign=J7UX3YXBisWPDjtnd5lMc6b2arM%3D)

刚才知道了在 Webpack 中的 `compiler` 和 `compilation` 对象上挂载着一系列的生命周期 hook ，那接下来应该怎么在这些生命周期中注册自定义事件呢？

webpack 插件：

![cb597c1b-a21a-4b8d-9fa8-b129380a3b9e.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e10ed90b523540619e25e85eff8ec816~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=oHnkschNmJnGUGeYUhz2p5%2BwCPI%3D)

`Webpack Plugin 其实就是一个普通的函数，在该函数中需要我们定制一个 apply 方法。`当 Webpack 内部进行插件挂载时会执行 apply 函数。我们可以在 apply 方法中订阅各种生命周期钩子，当到达对应的时间点时就会执行。

![bb740142-acbd-49da-898c-e0e765ec6552.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/aa75194e1cad47dfb9bf2c1e657e00f7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=TOPnVFKPzlwJeth0vFL4TrJn4U0%3D)

这里可能有同学要问了，为什么非要定制一个apply方法？为什么不是其他的方法？

在这里我贴下官方源码：[github.com/webpack/web…](https://github.com/webpack/webpack/blob/master/lib/webpack.js#L60-L69) ， 大家一看便一目了然：

```js
if (options.plugins && Array.isArray(options.plugins)) {
  //这里的options.plugins就是webpack.config.js中的plugins
  for (const plugin of options.plugins) {
    plugin.apply(compiler); //执行插件的apply方法
  }
}
```

这里官方写死了执行插件中的 apply 方法....，并没有什么很高深的原因.....

![68456079-6083-46b1-9248-97f943d7d06d.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a493eea7da8148ca91149b969d44a5a5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=Xcp67dA0Uca%2FKBgo4kA7UIlLJtc%3D)

那我们就按照规范写一个简易版的插件赶紧来练练手：在**构建完成**后打印日志。

首先我们需要知道**构建完成**后对应的的生命周期是哪个，通过 [查阅文档](https://webpack.docschina.org/api/compiler-hooks/#done)得知是 `complier` 中的[done](https://webpack.docschina.org/api/compiler-hooks/#done) 这个 hook ：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f53dae66c0a343b288d298fb7da7ff8e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992697&x-orig-sign=VxzLl6i5oEJD0Buomkg4VQ9L7%2BQ%3D)

接下来创建一个新项目验证我们的想法，时间不早了！小舒现在肯定很着急！！！

安装依赖：

```js
npm init //初始化项目
yarn add webpack webpack-cli -D
```

安装完项目依赖后，根据以下目录结构来添加对应的目录和文件：

```
csharp
├── dist # 打包输出目录
├── plugins # 自定义插件文件夹
│   └── demo-plugin.js
├── node_modules
├── package-lock.json
├── package.json
├── src # 源码目录
│   └── index.js # 入口文件
└── webpack.config.js # webpack配置文件
```

**demo-plugin.js**

```
javascript
class DemoPlugin {
  apply(compiler) {
    //在done（构建完成后执行）这个hook上注册自定义事件
    compiler.hooks.done.tap("DemoPlugin", () => {
      console.log("DemoPlugin：编译结束了");
    });
  }
}

module.exports = DemoPlugin;
```

**package.json**

```js
{
  "name": "webpack-plugin",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "devDependencies": {
    "tapable": "^2.2.1",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0"
  }
}
```

**src/index.js**

```js
console.log("author："，"不要秃头啊");
```

**webpack.config.js**

```js
const DemoPlugin = require("./plugins/demo-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: false,
  plugins: [new DemoPlugin()],
};
```

运行 yarn build，运行结果：

```js
yarn build
$ webpack
DemoPlugin：编译结束了
asset main.js 643 bytes [emitted] (name: main)
./src/index.js 476 bytes [built] [code generated]
webpack 5.74.0 compiled successfully in 71 ms
✨  Done in 0.64s.
```

![db4cafab-ece6-4bbb-8103-79e4589f0ebe.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c38fd30353c14d4a9362be6ac515eaa8~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749992696&x-orig-sign=C%2FaBvmaHx95TYo0fRtOEUBtGMs0%3D)
