# 其他问题

## JS

- 解释一下原型链
- `instanceof`原理
- `apply和call`的作用及区别
- 说下你对`DOM`树的理解
- 实现 `add(1)(2)(3)`
- es5 实现继承
- 说下 generator 原理
- 实现一个 promise
- 说下事件模型
- bind 的实现
- 闭包的作用和原理
- 0.1+0.2 为什么不等于 0.3
- 前端模块化机制有哪些
- 谈谈变量提升
- new 操作符具体做了什么
- 谈下事件循环机制
- 谈谈你对作用域的理解
- v8 垃圾回收机制
- 合并二维有序数组成一维有序数组
- 实现一个 trim 方法
- 什么场景下会用策略模式
- 判断括号字符串是否有效
- 判断链表是否有环
- 爬楼梯问题
- 实现一个发布订阅模式
- 实现一个斐波那契数列

## CSS

- CSS 选择器有哪些
- 什么是 BFC，BFC 有什么作用，如何形成 BFC
- `position`有哪些值，作用分别是什么
- flex 布局有什么好处
- 介绍下盒子模型
- 有哪些方式可以使 div 居中
- css 优先级是怎么计算的
- CSS 相关的性能优化
- 双飞冀/圣杯布局
- 浮动元素会造成什么影响，如何清除浮动
- CSS 样式隔离手段
- 行内元素、块级元素有哪些，区别是什么
- CSS3 有哪些新特性
- 层叠上下文是什么
- 重排和重绘是什么，有什么区别
- 动画性能如何优化

## react

- react16 新增了哪些生命周期、有什么作用，为什么去掉某些 15 的生命周期
- `react setState`是同步还是异步
- 什么是高阶组件，请举例说明
- react 合成事件是什么，和原生事件的区别
- 为什么有时 react 两次`setState`，只执行一次
- redux 有哪些原则
- redux 和 redux-saga 的区别和原理
- react 如何处理异常
- react 为什么需要 fiber
- redux 中间件机制
- redux compose 函数做什么的
- redux-saga 是什么，和 redux-thunk 有什么区别
- redux 的理念(说了下 action dispatch state 啥的，单向数据流)
- react-redux 中 connect 怎么实现(高阶组件、context 注入 store、subscribe 订阅 store 数据变化)
- mixin hoc 继承的区别，优缺点
- useEffect 的实现原理
- 异步渲染和旧版的 diff 的区别
- react diff 如何实现
- react 旧版的 diff 用深度优先还是广度优先。为什么用深度优先，广度优先能实现吗
- diff 的时间复杂度？为什么？(o(n)。提了下 react 优化 o(n3)->o(n))
- `react fiber`有哪些优点，怎样做到的？如何实现异步渲染（链表/可中断）
- react 有哪些性能优化的点
- setState 和 hook 的区别
- react-router 实现原理(hash/html5 history)
- 客户端路由 hash/history 实现的区别、原理
- 实现一个 useState

## Vue

- vue 的数据绑定机制是如何实现的
- `vue next tick`实现原理
- vue 的`computed`和`watch`的区别
- 说下 vue 的`keep alive`
- vue/react 技术选型

## 工程化

- 是否有写过 webpack 插件
- webpack 工作流程是怎样的
- 谈下 webpack loader 机制
- node 模块机制是怎样的
- node require 具体实现是什么
- node 事件循环与浏览器的哪些不一样
- node 的异常处理方式
- tree shaking 是什么，有什么作用，原理是什么
- babel 是什么，怎么做到的
- babel 实现转码的过程（词法/语法分析）
- 项目的技术栈怎么选型

## HTTP

- 常用的 http 状态码(101 200 204 301 302 304 307 400 404 500...)
- `http 302 301 307`之间的区别
- 301 和 302 对于 seo 来说哪个更好 (301)
- `https`加密过程是怎样的
- `http2.0`做了哪些改进
- TCP3 次握手过程
- `http2.0`有哪些不足，`http3.0`是什么
- tcp 滑动窗口是什么
- websocket 建立过程
- tcp 重试机制
- https 的握手过程是怎样的
- 简单请求和复杂请求的区别

## 浏览器

- 聊下你知道的浏览器架构
- 浏览器缓存策略是怎样的
- 描述下浏览器从输入网址到页面展现的整个过程
- history 和 hash 两种路由方式的最大区别是什么？
- 你知道的前端性能优化手段有哪些
- 网站首页有大量的图片，加载很慢，如何去优化呢？
- 如何减少白屏的时间
- 如何定位内存泄露
- 跨域是什么、如何解决
- jsonp 有什么缺点

## 综合

- Mutation Observer、Intersection Observer 使用场景（Intersection 听过没用过）
- decorator 的作用，编译后是怎样的(@decorator -> decorator(target)...)
- symbol 是什么，一般用来做什么
- 小程序底层实现原理了解多少（说了下双线程模型/预加载 webview）
- websocket/轮询的好处和缺点 （性能、兼容性）
- websocket 的握手过程（urgrade websocket）
- tcp 的握手过程
- tcp/udp 的区别

## 模拟题

### 15 道运行题

![](https://s.poetries.top/images/20210519113203.png) ![](https://s.poetries.top/images/20210519113212.png) ![](https://s.poetries.top/images/20210519113221.png) ![](https://s.poetries.top/images/20210519113229.png) ![](https://s.poetries.top/images/20210519113236.png) ![](https://s.poetries.top/images/20210519113244.png) ![](https://s.poetries.top/images/20210519113252.png) ![](https://s.poetries.top/images/20210519113300.png) ![](https://s.poetries.top/images/20210519113307.png) ![](https://s.poetries.top/images/20210519113709.png) ![](https://s.poetries.top/images/20210519113717.png) ![](https://s.poetries.top/images/20210519113724.png) ![](https://s.poetries.top/images/20210519113732.png) ![](https://s.poetries.top/images/20210519113742.png) ![](https://s.poetries.top/images/20210519113749.png)

### 20 道简答题

1. JavaScript 创建对象的几种方式?

2. JavaScript 继承的几种实现方式?

3. 说一下对 this 的理解。

4.什么是 Proxy?

5. 事件委托是什么?

6. 说一下你所理解的闭包

7. 说一下你所理解的 ajax，如何创建一个 ajax?

8. 说一下你所理解的同源政策?

9. 你是如何解决的跨域问题的?

10. 你所理解的 JavaScript 的事件循环机制是什么?

11. 说一下对 Object.defineProperty()的理解。

12. 说一下图片的懒加载和预加载的理解。

13. 请求服务器数据，get 和 post 请求的区别是什么?

14. Reflect 对象创建的目的是什么?

15. require 模块引入的查找方式?

16 . 观察者模式和发布订阅模式有什么不同?

17. 检查数据类型的方法会几种，分别是什么?

18. 谈谈对 JSON 的了解。

19. 进行哪些操作会造成内存泄漏?

20. 谈谈你所理解的函数式编程。

### 15 道手写题

1. 实现 js 的节流和防抖函数，两者的区别是什么?

2. 实现 js 中的深拷贝

3. 手写 call 函数

4. 手写 apply 函数

5. 手写 bind 函数

6. 实现柯里化函数

7. 手写一个观察者模式

8. 手动实现 EventEmitter(发布订阅模式)

9. 手动实现 jsonp

10. 手动实现 new 关键字

11. 手动实现 `Object.assign`

12. 实现解析 url 参数为对象的函数

13. js 格式化数字(每三位加逗号)

14. 手写`instanceof`关键字

15. 手写数组去重的方法?
