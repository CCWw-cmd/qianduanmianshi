
## 一、Vue.js 运行机制全局概览

### 全局概览

这一节笔者将为大家介绍一下 Vue.js 内部的整个流程，希望能让大家对全局有一个整体的印象，然后我们再来逐个模块进行讲解。从来没有了解过 Vue.js 实现的同学可能会对一些内容感到疑惑，这是很正常的，这一节的目的主要是为了让大家对整个流程有一个大概的认识，算是一个概览预备的过程

首先我们来看一下笔者画的内部流程图。

![](https://s.poetries.top/gitee/2020/07/vue/1.png)

大家第一次看到这个图一定是一头雾水的，没有关系，我们来逐个讲一下这些模块的作用以及调用关系。相信讲完之后大家对Vue.js内部运行机制会有一个大概的认识。

### 初始化及挂载

![](https://s.poetries.top/gitee/2020/07/vue/2.png)

> 在 `new Vue()` 之后。 Vue 会调用 `_init` 函数进行初始化，也就是这里的 `init` 过程，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过 `Object.defineProperty` 设置 `setter` 与 `getter` 函数，用来实现「**响应式**」以及「**依赖收集**」，后面会详细讲到，这里只要有一个印象即可。

> 初始化之后调用 `$mount` 会挂载组件，如果是运行时编译，即不存在 render function 但是存在 template 的情况，需要进行「**编译**」步骤。

### 编译

compile编译可以分成 `parse`、`optimize` 与 `generate` 三个阶段，最终需要得到 render function。

![](https://s.poetries.top/gitee/2020/07/vue/3.png)

**1\. parse**

`parse` 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST。

**2\. optimize**

> `optimize` 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 `update` 更新界面时，会有一个 `patch` 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 `patch` 的性能。

**3\. generate**

> `generate` 是将 AST 转化成 `render function`字符串的过程，得到结果是 `render` 的字符串以及 staticRenderFns 字符串。

* 在经历过 `parse`、`optimize` 与 `generate` 这三个阶段以后，组件中就会存在渲染 `VNode` 所需的 `render function` 了。

### 响应式

接下来也就是 Vue.js 响应式核心部分。

![](https://s.poetries.top/gitee/2020/07/vue/4.png)

> 这里的 `getter` 跟 `setter` 已经在之前介绍过了，在 `init` 的时候通过 `Object.defineProperty` 进行了绑定，它使得当被设置的对象被读取的时候会执行 `getter` 函数，而在当被赋值的时候会执行 `setter` 函数。

* 当 `render function` 被渲染的时候，因为会读取所需对象的值，所以会触发 `getter` 函数进行「**依赖收集**」，「**依赖收集**」的目的是将观察者 `Watcher` 对象存放到当前闭包中的订阅者 `Dep` 的 `subs` 中。形成如下所示的这样一个关系。

![](https://s.poetries.top/gitee/2020/07/vue/5.png)

> 在修改对象的值的时候，会触发对应的 `setter`， `setter` 通知之前「**依赖收集**」得到的 Dep 中的每一个 Watcher，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 Watcher 就会开始调用 `update` 来更新视图，当然这中间还有一个 `patch` 的过程以及使用队列来异步更新的策略，这个我们后面再讲。

### Virtual DOM

> 我们知道，`render function` 会被转化成 `VNode` 节点。`Virtual DOM` 其实就是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

比如说下面这样一个例子：

```js
{
    tag: 'div',                 /*说明这是一个div标签*/
    children: [                 /*存放该标签的子节点*/
        {
            tag: 'a',           /*说明这是一个a标签*/
            text: 'click me'    /*标签的内容*/
        }
    ]
}

```

渲染后可以得到

```js
<div>
    <a>click me</a>
</div>

```

> 这只是一个简单的例子，实际上的节点有更多的属性来标志节点，比如 isStatic （代表是否为静态节点）、 isComment （代表是否为注释节点）等。

### 更新视图

![](https://s.poetries.top/gitee/2020/07/vue/6.png)

* 前面我们说到，在修改一个对象值的时候，会通过 `setter -> Watcher -> update` 的流程来修改对应的视图，那么最终是如何更新视图的呢？
* 当数据变化后，执行 render function 就可以得到一个新的 VNode 节点，我们如果想要得到新的视图，最简单粗暴的方法就是直接解析这个新的 VNode 节点，然后用 `innerHTML` 直接全部渲染到真实 DOM 中。但是其实我们只对其中的一小块内容进行了修改，这样做似乎有些「**浪费**」。
* 那么我们为什么不能只修改那些「改变了的地方」呢？这个时候就要介绍我们的「**`patch`**」了。我们会将新的 VNode 与旧的 VNode 一起传入 `patch` 进行比较，经过 diff 算法得出它们的「**差异**」。最后我们只需要将这些「**差异**」的对应 DOM 进行修改即可。

### 再看全局

![](https://s.poetries.top/gitee/2020/07/vue/7.png)

回过头再来看看这张图，是不是大脑中已经有一个大概的脉络了呢？

**那么，让我们继续学习每一个模块吧!**

## 二、响应式系统的基本原理

### 响应式系统

> `Vue.js` 是一款 MVVM 框架，数据模型仅仅是普通的 JavaScript 对象，但是对这些对象进行操作时，却能影响对应视图，它的核心实现就是「**响应式系统**」。尽管我们在使用 Vue.js 进行开发时不会直接修改「**响应式系统**」，但是理解它的实现有助于避开一些常见的「**坑**」，也有助于在遇见一些琢磨不透的问题时可以深入其原理来解决它。

### `Object.defineProperty`

首先我们来介绍一下 [`Object.defineProperty` (opens new window)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)，Vue.js就是基于它实现「**响应式系统**」的。

首先是使用方法：

```js
/*
    obj: 目标对象
    prop: 需要操作的目标对象的属性名
    descriptor: 描述符
    
    return value 传入对象
*/
Object.defineProperty(obj, prop, descriptor)

```

> descriptor的一些属性，简单介绍几个属性，具体可以参考 [MDN 文档 (opens new window)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。

* `enumerable`，属性是否可枚举，默认 false。
* `configurable`，属性是否可以被修改或者删除，默认 false。
* `get`，获取属性的方法。
* `set`，设置属性的方法。

### 实现 `observer`（可观察的）

> 知道了 `Object.defineProperty` 以后，我们来用它使对象变成可观察的。

这一部分的内容我们在第二小节中已经初步介绍过，在 `init` 的阶段会进行初始化，对数据进行「**响应式化**」。

![](https://s.poetries.top/gitee/2020/09/129.png)

* 为了便于理解，我们不考虑数组等复杂的情况，只对对象进行处理。
* 首先我们定义一个 `cb` 函数，这个函数用来模拟视图更新，调用它即代表更新视图，内部可以是一些更新视图的方法。

```js
function cb (val) {
    /* 渲染视图 */
    console.log("视图更新啦～");
}

```

> 然后我们定义一个 `defineReactive` ，这个方法通过 `Object.defineProperty` 来实现对对象的「**响应式**」化，入参是一个 obj（需要绑定的对象）、key（obj的某一个属性），val（具体的值）。经过 `defineReactive` 处理以后，我们的 obj 的 key 属性在「读」的时候会触发 `reactiveGetter` 方法，而在该属性被「写」的时候则会触发 `reactiveSetter` 方法。

```js
function defineReactive (obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,       /* 属性可枚举 */
        configurable: true,     /* 属性可被修改或删除 */
        get: function reactiveGetter () {
            return val;         /* 实际上会依赖收集，下一小节会讲 */
        },
        set: function reactiveSetter (newVal) {
            if (newVal === val) return;
            cb(newVal);
        }
    });
}

```

> 当然这是不够的，我们需要在上面再封装一层 `observer` 。这个函数传入一个 value（需要「**响应式**」化的对象），通过遍历所有属性的方式对该对象的每一个属性都通过 `defineReactive` 处理。（注：实际上 observer 会进行递归调用，为了便于理解去掉了递归的过程）

```js
function observer (value) {
    if (!value || (typeof value !== 'object')) {
        return;
    }
    
    Object.keys(value).forEach((key) => {
        defineReactive(value, key, value[key]);
    });
}

```

* 最后，让我们用 `observer` 来封装一个 `Vue` 吧！
* 在 Vue 的构造函数中，对 `options` 的 `data` 进行处理，这里的 `data` 想必大家很熟悉，就是平时我们在写 Vue 项目时组件中的 `data` 属性（实际上是一个函数，这里当作一个对象来简单处理）。

```js
class Vue {
    /* Vue构造类 */
    constructor(options) {
        this._data = options.data;
        observer(this._data);
    }
}

```

> 这样我们只要 new 一个 Vue 对象，就会将 `data` 中的数据进行「**响应式**」化。如果我们对 `data` 的属性进行下面的操作，就会触发 `cb` 方法更新视图。

```js
let o = new Vue({
    data: {
        test: "I am test."
    }
});
o._data.test = "hello,world.";  /* 视图更新啦～ */
```

> 至此，响应式原理已经介绍完了，接下来让我们学习「**响应式系统**」的另一部分 ——「**依赖收集**」。

注：本节代码参考[《响应式系统的基本原理》 (opens new window)](https://github.com/answershuto/VueDemo/blob/master/%E3%80%8A%E5%93%8D%E5%BA%94%E5%BC%8F%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%8E%9F%E7%90%86%E3%80%8B.js)。

## 三、响应式系统的依赖收集追踪原理

### 订阅者 Dep

### 观察者 Watcher

### 依赖收集

### 小结

## 四、实现 Virtual DOM 下的一个 VNode 节点

### 什么是VNode

### 实现一个VNode

## 五、template 模板是怎样通过 Compile 编译的

### Compile

### parse

### 正则

### advance

### stack

### parseEndTag

### parseText

### processIf与processFor

### optimize

### generate

## 六、数据状态更新时的差异 diff 及 patch 机制

### 数据更新视图

### 跨平台

### 一些API

### patch

### sameVnode

### patchVnode

### updateChildren

## 七、批量异步更新策略及 nextTick 原理

### 为什么要异步更新

### nextTick

### 再写 Watcher

### queueWatcher

### flushSchedulerQueue

### 举个例子

## 八、Vuex 状态管理的工作原理

### 为什么要使用 Vuex

### 安装

### Store

### 最后
