# Tapable

## 一、前言

> 回应标题：为什么我建议你一定要读一读 Tapable 源码？

所有人都知道 [Webpack](https://webpack.js.org/) 很复杂，但 Webpack 的源码却很优雅，是一个典型的**可插拔架构**，不仅逻辑清晰，而且灵活好扩展。近几年出来的一些构建工具，大多也都参考了 Webpack 的这种架构方式。

而实现这一切的核心就是借助了 [Tapable](https://www.npmjs.com/package/tapable)。

关于`Tapable`的源码其实并没有多少代码量，学习它的原理首当其冲的一定是可以让你在日常 [Webpack Plugin](https://webpack.js.org/concepts/plugins/) 开发中更得心应手，解决相关问题更加顺畅。

其次，Tapable 的内部以特别巧妙的方式实现了**发布订阅模式**，这之中会有非常多的知识点：比如**懒编译或者叫动态编译**，关于**类与继承抽象类的面向对象思想**以及 **this 指向的升华**等等...

在我个人看来， Tapable 源代码中的设计原则和实现过程是非常值得每一个前端开发者去阅读的。

> 回到正文

在本文中我们将会抛开 Webpack，在第 1 ～ 5 节主要是讲解基本原理和使用方式（奈何官方文档实在太简陋...），第 6 节则会以图文的形式深度分析 Tapable 的实现原理，熟悉使用的同学可跳过前面几节。

通篇将会采用**结论先行、自顶向下**的方式进行讲解，`注重实现思路，注重设计思想`，与 Webpack 完全解耦，可放心食用。

文中所涉及到的代码均放到个人 github 仓库中：[github.com/noBaldAaa/m…](https://github.com/noBaldAaa/my-tapable)

![852d0881-fca6-4faa-b281-50d378b099b1.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/0486617eb5c24954999848e898055400~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=0TYwOFArtuqggz3k%2FbtrRICExoY%3D)

## 二、Tapable是什么？

[Tapable](https://www.npmjs.com/package/tapable)是一个类似于 Node.js 中的 [EventEmitter](https://www.npmjs.com/package/events) 的库，但它**更专注于自定义事件的触发和处理**。通过 Tapable 我们可以注册自定义事件，然后在适当的时机去执行自定义事件。

![0f6a5dc1-229f-496c-a630-b7e724acef28.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/5835530ba5b64806a8e65528998c5810~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=7QsnkL9cnJzhx%2BPk8H74wp7ydqs%3D)

举个例子🌰：类比到 `Vue` 和 `React` 框架中的生命周期函数，它们就是到了固定的时间节点就执行对应的生命周期，`tapable` 做的事情就和这个差不多，我们可以通过它先注册一系列的生命周期函数，然后在合适的时间点执行。

概念了解的差不多了，接下来去实操一下。初始化项目，安装依赖：

```js
npm init //初始化项目
yarn add tapable -D //安装依赖
```

安装完项目依赖后，根据以下目录结构来添加对应的目录和文件：

```shell
csharp
├── node_modules
├── package-lock.json
├── package.json
└── src # 源码目录
     └── syncHookDemo.js
```

根据官方介绍，[tapable](https://www.npmjs.com/package/tapable) 使用起来还是挺简单的，只需三步：

1. 实例化钩子函数（ [tapable](https://www.npmjs.com/package/tapable)会暴露出各种各样的 Hook，这里先以同步钩子`Synchook`为例）
2. 注册事件
3. 触发事件

**src/syncHookDemo.js**

```js
const SyncHook = require("../my/SyncHook"); //这是一个同步钩子

//第一步：实例化钩子函数，可以在这里定义形参
const syncHook = new SyncHook(["author", "age"]);

//第二步：注册事件1
syncHook.tap("监听器1", (name, age) => {
  console.log("监听器1:", name, age);
});

//第二步：注册事件2
syncHook.tap("监听器2", (name) => {
  console.log("监听器2", name);
});

//第三步：注册事件3
syncHook.tap("监听器3", (name) => {
  console.log("监听器3", name);
});
//第三步：触发事件，这里传的是实参，会被每一个注册函数接收到
syncHook.call("不要秃头啊", "99");
```

运行 `node ./src/syncHookDemo.js`，拿到执行结果：

```shell
监听器1 不要秃头啊 99
监听器2 不要秃头啊
监听器3 不要秃头啊
```

![63c7e8b4-11bd-4cc5-a96d-be8bcc486365.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/049710dd26ad4750acfbc9808e563019~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=bQgX0%2B3mw5L%2BDBd7HolHtBsuMaE%3D)

从上面的例子中可以看出 [tapable](https://www.npmjs.com/package/tapable) 采用的是**发布订阅模式**，`通过 tap 函数注册监听函数，然后通过 call 函数按顺序执行之前注册的函数`。

大致原理（**真实源码中并不是这样，第六节会分析源码中的实现，这里帮助大家理解**）：

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

## 三、按照同步/异步分类

另外，[tapable](https://www.npmjs.com/package/tapable) 中不仅有 `Synchook`，还有其他 八个 `Hook` :

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

![583a28ed-ca3a-4436-8d3b-a440550b3c04.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/35e48f9743f04525b05c8798304d4759~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=gZEjc70hO54Z0x6mJwLwoYLo1ag%3D)

在这九个 `Hook` 中所注册的事件可以分为**同步、异步**两种执行方式，正如名称表述的那样：

- 同步表示注册的事件函数会同步进行执行
- 异步表示注册的事件函数会异步进行执行

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/cfd524c58d44443188dbff9f69440686~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=jwFq4WxI7QSJrve19%2FzCoHSsv2Y%3D)

对同步钩子来说， `tap` 方法是唯一注册事件的方法，通过 `call` 方法触发同步钩子的执行。

对异步钩子来说，可以通过 `tap`、`tapAsync`、`tapPromise`三种方式来注册，通过对应的 `callAsync`、`promise` 这两种方式来触发注册的函数。

同时异步钩子中还可以分为两类：

- 异步串行钩子( `AsyncSeries` )：可以被串联（连续按照顺序调用）执行的异步钩子函数。
- 异步并行钩子( `AsyncParallel` )：可以被并联（并发调用）执行的异步钩子函数。

***虽然这里分类分来分去，但是其实大家可以不用死记硬背，需要用到的时候查文档就好。***

## 四、按照执行机制分类

Tapable 同时也可以按照**执行机制**进行分类，这里说一下这几个类型的概念，后面会通过案例细讲：

- **Basic Hook** : 基本类型的钩子，执行每一个注册的事件函数，并不关心每个被调用的事件函数返回值如何。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/34cd1d73614a42cda2a413dc6f8b2ca6~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=bP%2F7DDGjmcoctVZ%2Fd55DSwPV7KE%3D)

- **Waterfall** : 瀑布类型的钩子，如果前一个事件函数的结果 `result !== undefined`，则 result 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/14ad995a8617454188f249c3cad3d7f2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997125&x-orig-sign=%2F11y5P3%2FkhskPEvoKFCrwhyAg5g%3D)

- **Bail** : 保险类型钩子，执行每一个事件函数，遇到第一个结果 `result !== undefined` 则返回，不再继续执行（也就是只要其中一个有结果了，后面的就不执行了）

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/feefd5c9d27548f2ba279528c9dd7c80~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=D%2BV2OJPd0Ewdqv3AbEn3AQScKzU%3D)

- **Loop** : 循环类型钩子，不停的循环执行事件函数，直到所有函数结果 `result === undefined`（有点像我们小时候打单机游戏一样，只要哪一关不小心死了，就得从头再来一遍，直到所有的关卡都打过才算通关）。

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/0dcc2bdf409b4520a9020877439a79a0~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=8SN7DlHRUkvzU9T%2B7QkLYiE68f4%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f22064e28a6a40828906397dafcb9f84~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=l1Pu%2F3JU9fIU3COd4d4Jp0hZv3M%3D)

在最开始的案例中我们用的`SyncHook`，它就是一个同步的钩子。又因为并不关心返回值，所以也算是一个基本类型的 `Hook`。

## 五、基本使用

### 5.1、SyncHook

开头所用的案例就是基于 `SyncHook`，就不再赘述。

### 5.2、SyncBailHook

`SyncBailHook` 是一个同步的、保险类型的 `Hook`，意思是只要其中一个有返回了，后面的就不执行了。

**src/syncBailHookDemo.js**

```js
const { SyncBailHook } = require("tapable");

const hook = new SyncBailHook(["author", "age"]); //先实例化，并定义回调函数的形参

//通过tap函数注册事件
hook.tap("测试1", (param1, param2) => {
  console.log("测试1接收的参数：", param1, param2);
});

//该监听函数有返回值
hook.tap("测试2", (param1, param2) => {
  console.log("测试2接收的参数：", param1, param2);
  return "123";
});

hook.tap("测试3", (param1, param2) => {
  console.log("测试3接收的参数：", param1, param2);
});

//通过call方法触发事件
hook.call("不要秃头啊", "99");
```

运行 `node ./src/syncBailHookDemo.js`，拿到执行结果：

```js
测试1接收的参数： 不要秃头啊 99
测试2接收的参数： 不要秃头啊 99
```

### 5.3、SyncWaterfallHook

`SyncWaterfallHook` 是一个同步的、瀑布式类型的 `Hook`。瀑布类型的钩子就是如果前一个事件函数的结果 `result !== undefined`，则 `result` 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）

**src/syncWaterfallHookDemo.js**

```js
const { SyncWaterfallHook } = require("tapable");

const hook = new SyncWaterfallHook(["author", "age"]); //先实例化，并定义回调函数的形参

//通过tap函数注册事件
hook.tap("测试1", (param1, param2) => {
  console.log("测试1接收的参数：", param1, param2);
});

hook.tap("测试2", (param1, param2) => {
  console.log("测试2接收的参数：", param1, param2);
  return "123";
});

hook.tap("测试3", (param1, param2) => {
  console.log("测试3接收的参数：", param1, param2);
});

//通过call方法触发事件
hook.call("不要秃头啊", "99");
```

运行 `node ./src/syncWaterfallHookDemo.js`，拿到执行结果：

```js
测试1接收的参数： 不要秃头啊 99
测试2接收的参数： 不要秃头啊 99
测试3接收的参数： 123 99
```

### 5.4、SyncLoopHook

`SyncLoopHook` 是一个同步、循环类型的 `Hook`。循环类型的含义是不停的循环执行事件函数，直到所有函数结果 `result === undefined`，不符合条件就调头重新开始执行。

**src/syncLoopHookDemo.js**

```js
const { SyncLoopHook } = require("tapable");

const hook = new SyncLoopHook([]); //先实例化，并定义回调函数的形参

let count = 5;

//通过tap函数注册事件
hook.tap("测试1", () => {
  console.log("测试1里面的count:", count);
  if ([1, 2, 3].includes(count)) {
    return undefined;
  } else {
    count--;
    return "123";
  }
});

hook.tap("测试2", () => {
  console.log("测试2里面的count:", count);
  if ([1, 2].includes(count)) {
    return undefined;
  } else {
    count--;
    return "123";
  }
});

hook.tap("测试3", () => {
  console.log("测试3里面的count:", count);
  if ([1].includes(count)) {
    return undefined;
  } else {
    count--;
    return "123";
  }
});

//通过call方法触发事件
hook.call();
```

运行 `node ./src/syncLoopHookDemo.js`，拿到执行结果：

```js
测试1里面的count: 5
测试1里面的count: 4
测试1里面的count: 3
测试2里面的count: 3
测试1里面的count: 2
测试2里面的count: 2
测试3里面的count: 2
测试1里面的count: 1
测试2里面的count: 1
测试3里面的count: 1
```

### 5.5、AsyncParallelHook

前面四个都是同步的 `Hook`，接下来开始看看异步的 `Hook`。

`AsyncParallelHook`是一个异步并行、基本类型的 `Hook`，它与同步 `Hook` 不同的地方在于：

- 它会同时开启多个异步任务，而且需要通过 `tapAsync` 方法来注册事件（同步 `Hook` 是通过 `tap` 方法）
- 在执行注册事件时需要使用 `callAsync` 方法来触发（同步 `Hook` 使用的是 `call` 方法）

同时，在每个注册函数的回调中，会多一个 `callback` 参数，它是一个函数。执行 `callback` 函数相当于告诉 `Hook` 它这一个异步任务执行完成了。

**src/asyncParallelHookDemo.js**

```js
const { AsyncParallelHook } = require("tapable");

const hook = new AsyncParallelHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  setTimeout(() => {
    console.log("测试1接收的参数：", param1, param2);
    callback();
  }, 2000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  callback();
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  callback();
});

//call方法只有同步钩子才有，异步钩子得使用callAsync
hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", err, result);
  console.timeEnd("time");
});
```

运行 `node ./src/asyncParallelHookDemo.js`，拿到执行结果：

```js
测试2接收的参数： 不要秃头啊 99
测试3接收的参数： 不要秃头啊 99
测试1接收的参数： 不要秃头啊 99
这是成功后的回调 undefined undefined
time: 2.008s
```

### 5.6、AsyncParallelBailHook

`AsyncParallelBailHook` 是一个异步并行、保险类型的 `Hook`，只要其中一个有返回值，就会执行 `callAsync` 中的回调函数。

**src/asyncParallelBailHookDemo.js**

```js
const { AsyncParallelBailHook } = require("tapable");

const hook = new AsyncParallelBailHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 1000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "测试2有返回值啦");
  }, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "测试3有返回值啦");
  }, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", result);
  console.timeEnd("time");
});
```

运行 `node ./src/asyncParallelBailHookDemo.js`，拿到执行结果：

```js
测试1接收的参数： 不要秃头啊 99
测试2接收的参数： 不要秃头啊 99
测试3接收的参数： 不要秃头啊 99
这是成功后的回调 测试2有返回值啦
time: 2.007s
```

### 5.7、AsyncSeriesHook

`AsyncSeriesHook` 是一个异步、串行类型的 `Hook`，只有前面的执行完成了，后面的才会一个接一个的执行。

**src/asyncSeriesHookDemo.js**

```js
const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 1000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", err, result);
  console.timeEnd("time");
});
```

运行 `node ./src/asyncSeriesHookDemo.js`，拿到执行结果：

```js
测试1接收的参数： 不要秃头啊 99
测试2接收的参数： 不要秃头啊 99
测试3接收的参数： 不要秃头啊 99
这是成功后的回调 undefined undefined
time: 6.017s
```

### 5.8、AsyncSeriesBailHook

`AsyncSeriesBailHook` 是一个异步串行、保险类型的 `Hook`。在串行的执行过程中，只要其中一个有返回值，后面的就不会执行了。

**src/asyncSeriesBailHookDemo.js**

```js
const { AsyncSeriesBailHook } = require("tapable");

const hook = new AsyncSeriesBailHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 1000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "123");
  }, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", result);
  console.timeEnd("time");
});
```

运行 `node ./src/asyncSeriesBailHookDemo.js`，拿到执行结果：

```js
测试1接收的参数： 不要秃头啊 99
测试2接收的参数： 不要秃头啊 99
这是成功后的回调 123
time: 3.010s
```

### 5.9、AsyncSeriesWaterfallHook

`AsyncSeriesWaterfallHook` 是一个异步串行、瀑布类型的 `Hook`。如果前一个事件函数的结果 `result !== undefined`，则 `result` 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）。

**src/asyncSeriesWaterfallHookDemo.js**

```js
const { AsyncSeriesWaterfallHook } = require("tapable");

const hook = new AsyncSeriesWaterfallHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "2");
  }, 1000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "3");
  }, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "4");
  }, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", err, result);
  console.timeEnd("time");
});
```

运行 `node ./src/asyncSeriesWaterfallHookDemo.js`，拿到执行结果：

```js
测试1接收的参数： 不要秃头啊 99
测试2接收的参数： 2 99
测试3接收的参数： 3 99
这是成功后的回调 null 4
time: 6.012s
```

## 六、具体实现

在开始读源码之前，我们先得弄清楚如何调试源码，以及如何在 IDE 中快速的执行代码文件。

### 6.1、工欲善其事，必先利其器

> （1）调试源码：

第一步：修改 `Hook` 的引用路径：

**syncHookDemo.js**

```js
//之前
const { SyncHook } = require("tapable");

//修改后
const SyncHook = require("../node_modules/tapable/lib/SyncHook");
```

第二步：打开 Vscode 调试工具，在代码中打上断点：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/64130596f4364936b1f950f5e8c51fa5~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=SDxt8FPtZ2tPdX9nnaLZMETv3I4%3D)

第三步：点击 Run and Debug，选择 Node.js 环境

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6150aed59b174cc9b1781580afc0512b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=3HbDreU8Ja4h5DGCc2sKgRg2pg8%3D)

> （2）在 IDE 中快速的执行代码文件

第一步：在 IDE 的应用商店中下载插件 [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/56fbd128894a4be3b755a86974512ed1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=qrL7jMmUhnrTCeHbwNU7mDE26wM%3D)

第二步：选择想要运行的文件，点击右键，选择 Run Code 选项：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a59e4dc776ec4ceabe0b8fbe66589f89~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=O0JdEuNhORBFTODVVgn9rzrxvB0%3D)

第三步：在控制台中查看结果：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c674cd57a5464dfd96ff7b45d2d6ce44~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=1zADAFg6%2Fz3a30Hu5g%2FheHLiPpY%3D)

### 6.2、核心思想

这里以 `SyncHook` 的实现原理为例，其他的 `Hook` 也会整理一下思路，大家举一反三，重点在于理解思想。

![417eb28e-eeef-4bc8-9ec9-66b18f28cdca.jpg](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/04149089599d4be08662253c38ea7173~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=9e5w3%2FiOsstSg5B215xKMS4DMjM%3D)

我们再回过头来看看 `SyncHook` 的用法，也就是这三步：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6276906f273c4a92b811afe754212185~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg55-l5ZC-54yqXzbnv7vkuobniYg=:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzk2NjY5MzY4MzQ5NjU2OCJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1749997124&x-orig-sign=S6EeE7QGbucAvKI1L5n8t2MP%2BOY%3D)

核心思想：

其实 `tap` 函数就是一个收集器，当调用 `tap` 函数时需要将传入的这些信息进行收集，并转换成一个数组，数组里面存放着注册函数的`类型type`、`回调函数(fn)`等信息：

```js
this.taps = [
  {
    name: "监听器1",
    type: "sync",
    fn: (param1, param2) => {
      console.log("监听器1接收参数：", name, age);
    },
  },
  {
    name: "监听器2",
    type: "sync",
    fn: (param1, param2) => {
      console.log("监听器2接收参数：", name);
    },
  },
]; //用来存放我们的回调函数基本信息
```

调用 `call` 函数的本质就是 **`按指定的类型`** 去执行 `this.taps`中的注册函数 `fn`，比如这里的 `type: sync`，就是得按同步的方式执行，那我们只需将运行代码改造成这样：

```js
function anonymous(param1, param2) {
  const taps = this.taps;
  
  let fn0 = taps[0].fn;
  fn0(param1, param2);

  let fn1 = taps[1].fn;
  fn1(param1, param2);
}
anonymous("不要秃头啊", "99");
```

如果要按照`SyncBailHook`（同步、保险类型：只要其中一个有返回值，后面的就不执行了 ）执行，那我们只需将运行代码改造成这样：

```js
function anonymous(param1, param2) {
  const taps = this.taps;
  
  let fn0 = taps[0].fn;
  let result0 = fn0(param1, param2);

  if (result0 !== undefined) {
    return result0;
  } else {
    let fn1 = taps[1].fn;
    let result1 = fn1(param1, param2);

    if (result1 !== undefined) {
      return result1;
    }
  }
}
anonymous("不要秃头啊", "99");
```

如果得按照 `AsyncSeriesHook`（异步、串行类型：只有前面的执行完成了，后面的才会一个接一个的执行 ）执行，那我们需要将运行代码改造成这样：

```js
function anonymous(param1, param2, callback) {
  const taps = this.taps;
  
  let fn0 = taps[0].fn;
  fn0(param1, param2, function (err) {
    if (err) {
      //如果运行过程中报错，则直接结束
      callback(err);
    } else {
      next0();
    }
  });

  function next0() {
    let fn1 = taps[1].fn;
    fn1(param1, param2, function (err) {
      if (err) {
        callback(err);
      } else {
        callback(); //在末尾执行最终的回调函数
      }
    });
  }
}
anonymous("不要秃头啊", "99", (err,result)=>"最终的回调函数");
```

剩下的类型大家可以举一反三，就不类举了。

* * *

### 6.3、如何生成运行函数

有了可行的思路之后，现在的问题就变成了怎么样生成这些运行函数？

这里官方的源码中是通过 [new Function()](https://zh.javascript.info/new-function) 进行创建的，先了解一下 `new Function` 的语法：

```js
let func = new Function ([arg1, arg2, ...argN], functionBody);
```

- `arg1, arg2, ... argN（参数名称）`：是一个有效的 JavaScript 字符串（例如："a , b"），或者是一个字符串列表（例如：["a"，"b"]）。
- `functionBody（函数体）`：可执行的JavaScript字符串。

举个例子：

```js
const sum = new Function("a,b", "return a + b");
console.log(sum(2, 6));
//output: 8
```

这里大家可以仔细观察一下上面我们所需要的目标函数体，以 `SyncHook` 所需要的函数体为例：

```js
function anonymous(param1, param2) {
  const taps = this.taps;
  
  let fn0 = taps[0].fn;
  fn0(param1, param2);

  let fn1 = taps[1].fn;
  fn1(param1, param2);
}
anonymous("不要秃头啊", "99");
```

该函数体其实可以分为两部分：

- 第一部分（header）：获取存放着注册函数信息的数组 `taps`：

```js
 const taps = this.taps;
```

- 第二部分（content）：可以通过对 `taps` 进行遍历生成：

```js
  let fn0 = taps[0].fn;
  fn0(param1, param2);

  let fn1 = taps[1].fn;
  fn1(param1, param2);
```

现在通过`new Function()`生成我们想要的执行函数，就很简单了：

- 第一步：生成形参字符串（`"param1 , param2"`）
- 第二步：生成函数体中 `header` 部分
- 第三步：遍历 taps，生成 `content` 部分

```js
new Function(this.args().join(","), this.header() + this.content());
```

核心思路就是这些，接下来我们就去实操一下！

### 6.4、手撕代码

按照上面的思路，首先需要通过 `tap` 函数进行收集工作，并将收集到的函数格式化成这样：

```js
this.taps = [
  {
    name: "监听器1",
    type: "sync",
    fn: (param1, param2) => {
      console.log("监听器1接收参数：", name, age);
    },
  },
  {
    name: "监听器2",
    type: "sync",
    fn: (param1, param2) => {
      console.log("监听器2接收参数：", name);
    },
  },
]; //用来存放我们的回调函数基本信息
```

大致结构搭建：

```js
class SyncHook {
  constructor(args) {
    this.args = Array.isArray(args) ? args : []; //形参列表
    this.taps = []; //这是一个数组，用来存放注册函数的基本信息
  }
}
```

这里定义了两个变量：`this.args 用来存放实例化过程中传入的形参数组`，`this.taps` 用来存放注册函数的基本信息。

> （1）taps 的收集工作

这里分成两个小步骤，先对传入参数进行格式化。

我们之前在使用 `tap` 方法时是这么使用的：

```js
hook.tap("监听器1", callback);
```

这里其实是一个语法糖，写完整了是这样：

```js
hook.tap({name:"监听器1",后面还可以有其他参数}, callback);
```

因此先要做一层格式化处理：

```js
class SyncHook {
  //省略其他

+ tap(option, fn) {
+   //如果传入的是字符串，包装成对象
+   if (typeof option === "string") {
+     option = { name: option };
+   }
+ }
}
```

接着定义 `tap` 函数，收集注册函数信息：

```js
class SyncHook {
  //省略其他
  
  tap(option, fn) {
    //如果传入的是字符串，包装成对象
    if (typeof option === "string") {
      option = { name: option };
    }

+   const tapInfo = { ...option, type: "sync", fn }; //type=sync fn是注册函数
+   this.taps.push(tapInfo);
  }
}
```

> （2）动态生成执行代码

当调用 `call` 方法时，会走两个关键的步骤：**先动态生成执行代码，再执行生成的代码**。

最终我们要通过 `this.taps` 生成如下格式的运行代码：

```js
new Function(
  "param1 , param2",
  `  
  const taps = this.taps;
  let fn0 = taps[0].fn;
  fn0(param1, param2);
  let fn1 = taps[1].fn;
  fn1(param1, param2);
 `
);
```

这一步需要遍历 `this.taps` 数组，然后生成对应的函数体字符串，这里封装成一个函数 `compiler` 来做：

```js
class SyncHook {
  //省略其他

+ compile({ args, taps, type }) {
+   const getHeader = () => {
+     let code = "";
+     code += `var taps=this.taps;\n`;
+     return code;
+   };

+   const getContent = () => {
+     let code = "";
+     for (let i = 0; i < taps.length; i++) {
+       code += `var fn${i}=taps[${i}].fn;\n`;
+       code += `fn${i}(${args.join(",")});\n`;
+     }
+     return code;
+   };

+   return new Function(args.join(","), getHeader() + getContent());
  }
}
```

> （3）执行生成的代码

这里是最后一步，定义 `call` 方法，然后执行生成的函数体：

```js
class SyncHook {
  //省略其他
  
  call(...args) {
    this._call = this.compile({
      taps: this.taps, //tapInfo的数组 [{name,fn,type}]
      args: this.args, //形参数组
      type: "sync",
    }); //动态创建一个call方法 这叫懒编译或者动态编译，最开始没有，用的时候才去创建执行
    return this._call(...args);
  }
}
```

完整代码在文章开头的 github 链接中。

### 6.5、为什么这么设计？

看到这里，估计有不少小伙伴要懵了，为啥这么设计啊？我们开头讲的实现不是更简单吗？

像这样：

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

这么做一部分原因是为了极佳的性能考虑，比如只有在执行 `call` 方法时才会去动态生成执行函数，如果不执行则不处理（**懒编译或者叫动态编译**）。

还有一部分原因则是为了更加灵活。别忘了，该库里面还有其他类型的 `Hook`，如果我们想要实现其他 `Hook`，只需要定义好各自的 `compiler` 函数就可以了。

另外，Webpack作者也提到过为什么采用 `new Function` 的方案，一切都是为了性能考虑，链接在这里：[github.com/webpack/tap…](https://github.com/webpack/tapable/issues/162) ，有兴趣的可以去看看。

## 七、总结

本文从一个基础案例出发，先依次讲解了`Tapable`中各种类型 Hook 的基本用法和运行机制，接着再次回到最初的案例中，花了大量篇幅讲解 Tapable 的核心思想和实现思路。在这过程中不仅讲清楚了怎么去实现，更重要的是授人以渔，分析了为什么这么做。

最后在手撕代码环节，我们通过大约40行代码手写了 mini 版的 `SyncHook` 来加深印象，帮助大家在读源码的过程中会更加顺畅。
