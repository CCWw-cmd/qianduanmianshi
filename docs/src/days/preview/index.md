
# 每日一题

## 第184题 假如有几十个请求，如何去控制并发

众所周知，浏览器发起的请求最大并发数量一般都是6~8个，这是因为浏览器会限制同一域名下的并发请求数量，以避免对服务器造成过大的压力

首先让我们来模拟大量请求的场景

```js
const ids = new Array(100).fill('')

console.time()
for (let i = 0; i < ids.length; i++) {
  console.log(i)
}
console.timeEnd()
```

![](https://s.poetries.top/uploads/2025/06/72a73a166b17c950.png)

一次性并发上百个请求，要是配置低一点，又或者带宽不够的服务器，直接宕机都有可能，所以我们前端这边是需要控制的并发数量去为服务器排忧解难

**什么是队列？**

先进先出就是队列，push一个的同时就会有一个被shift。我们看下面的动图可能就会更加的理解：

![](https://s.poetries.top/uploads/2025/06/9a337e98b41b5d70.webp)

我们接下来的操作就是要模拟上图的队列行为

定义请求池主函数函数

```js
export const handQueue = (  
  reqs // 请求数量
) => {}
```

接受一个参数reqs，它是一个数组，包含需要发送的请求。函数的主要目的是对这些请求进行队列管理，确保并发请求的数量不会超过设定的上限

定义dequeue函数

```js
const dequeue = () => {  
  while (current < concurrency && queue.length) {  
    current++;  
    const requestPromiseFactory = queue.shift() // 出列  
    requestPromiseFactory()  
      .then(() => { // 成功的请求逻辑  
      })  
      .catch(error => { // 失败  
        console.log(error)  
      })  
      .finally(() => {  
        current--  
        dequeue()  
      });  
  }  
}
```

> 这个函数用于从请求池中取出请求并发送。它在一个循环中运行，直到当前并发请求数current达到最大并发数concurrency或请求池queue为空。对于每个出队的请求，它首先增加current的值，然后调用请求函数requestPromiseFactory来发送请求。当请求完成（无论成功还是失败）后，它会减少current的值并再次调用dequeue，以便处理下一个请求

定义返回请求入队函数

```js
return (requestPromiseFactory) => {  
  queue.push(requestPromiseFactory) // 入队  
  dequeue()  
}
```

> 函数返回一个函数，这个函数接受一个参数requestPromiseFactory，表示一个返回Promise的请求工厂函数。这个返回的函数将请求工厂函数加入请求池queue，并调用dequeue来尝试发送新的请求，当然也可以自定义axios，利用Promise.all统一处理返回后的结果。

实验

```js
const enqueue = requestQueue(6) // 设置最大并发数
for (let i = 0; i < reqs.length; i++) {  // 请求
  enqueue(() => axios.get('/api/test' + i))  
}
```

![](https://s.poetries.top/uploads/2025/06/d1424eba5c151dd8.webp)

我们可以看到如上图所示,请求数确实被控制了，只有有请求响应成功的同时才会有新的请求进来，极大的降低里服务器的压力

```js
// 全部代码
export const handQueue = (
  reqs // 请求总数
) => {
  reqs = reqs || []

  const requestQueue = (concurrency) => {
    concurrency = concurrency || 6 // 最大并发数
    const queue = [] // 请求池
    let current = 0

    const dequeue = () => {
      while (current < concurrency && queue.length) {
        current++;
        const requestPromiseFactory = queue.shift() // 出列
        requestPromiseFactory()
          .then(() => { // 成功的请求逻辑
          })
          .catch(error => { // 失败
            console.log(error)
          })
          .finally(() => {
            current--
            dequeue()
          });
      }

    }

    return (requestPromiseFactory) => {
      queue.push(requestPromiseFactory) // 入队
      dequeue()
    }
  }

  const enqueue = requestQueue(6)

  for (let i = 0; i < reqs.length; i++) {
    enqueue(() => fetch.get('/api/test' + i))
  }
}
```

## 第183题 Hooks闭包陷阱问题

```js
import { useEffect, useState } from 'react';

function App() {
  const [count,setCount] = useState(0);

  useEffect(() => {
      setInterval(() => {
          console.log(count);
          setCount(count + 1);
      }, 1000);
  }, []);

  return <div>{count}</div>
}

export default App;
```

通过定时器不断的累加 `count`，`setCount` 时拿到的 `count` 一直是 `0`。`useEffect` 的依赖数组是 `[]`，也就是只会执行并保留第一次的 `function`。而第一次的 `function` 引用了当时的 `count`，形成了闭包，这就是闭包陷阱问题

**解法1**

```js
useEffect(() => {
  setInterval(() => {
      // 每次的 count 都是参数传入的上一次的 state，没有形成闭包
      setCount(count=>count + 1);
  }, 1000);
}, []);
```

**解法2**

```js
useEffect(() => {
  console.log(count);

  const timer = setInterval(() => {
      setCount(count + 1);
  }, 1000);

  return () => {
      clearInterval(timer);
  }
}, [count]);
```

> 依赖数组加上了 `count`，这样 `count` 变化的时候重新执行 `effect`，那执行的函数引用的就是最新的 `count` 值。

**解法3**

```js
const updateCount = () => {
    setCount(count + 1);
  };
  const ref = useRef(updateCount);

  ref.current = updateCount;

  useEffect(() => {
      const timer = setInterval(() => ref.current(), 1000);

      return () => {
          clearInterval(timer);
      }
  }, []);
```

通过 `useRef` 创建 `ref` 对象，保存执行的函数，每次渲染更新 `ref.current` 的值为最新函数。

这样，定时器执行的函数里就始终引用的是最新的 `count`。

`useEffect` 只跑一次，保证 `setIntervel` 不会重置，是每秒执行一次。

执行的函数是从 `ref.current` 取的，这个函数每次渲染都会更新，引用着最新的 `count`。

## 第182题 Suspense 有哪些使用场景，使用 Suspense 的好处有哪些？

## 第181题 怎么理解 React 并发更新特性

## 第180题 webpack性能优化-构建速度

### 优化babel-loader

### IgnorePlugin

### noParse

### happyPack

### parallelUglifyPlugin

### 自动刷新

### 热更新

### 优化打包速度完整代码

### DllPlugin 动态链接库

## 第179题 webpack性能优化-产出代码（线上运行）

## 第178题 获取当前页面URL参数

## 第177题 手写深度比较lodash.isEqual

## 第176题 常见的web前端攻击方式有哪些

## 第175题 前端性能优化

## 第174题 HTTP面试题总结

## 第173题 DOM和事件操作总结

## 第172题 Event Loop执行机制过程

## 第171题 async/await异步总结

## 第170题 Promise异步总结

## 第169题 手写Promise加载一张图片

## 第168题 创建10个a标签，点击弹出对应的序号

## 第167题 闭包读代码题输出

## 第166题 实现简易版jQuery

## 第165题 原型与原型链

## 第164题 两个数组求交集和并集

## 第163题 JS反转字符串

## 第162题 从零搭建开发环境需要考虑什么

## 第161题 手写Vue3基本响应式原理

## 第160题 实现机器人走方格

## 第159题 this读代码题

## 第158题 使用XML描述自定义DSL流程图

## 第157题 JS设计并实现撤销重做功能

## 第156题 根据jsx写出vnode和render函数

## 第155题 手写合并两个递增数组

## 第154题 React useEffect闭包陷阱问题

## 第153题 Vue React diff 算法有什么区别

## 第152题 如何做code-review

## 第151题 手写JS深拷贝-考虑各种数据类型和循环引用

## 第150题 用JS实现一个LRU缓存

## 第149题 手写EventBus自定义事件

## 第148题 手写curry函数，实现函数柯里化

## 第147题 手写一个LazyMan，实现sleep机制

## 第146题 深度优先和广度优先遍历一个DOM树

### 深度优先遍历一个DOM树

### 广度优先遍历一个DOM树

## 第145题 手写一个getType函数，获取详细的数据类型

## 第144题 手写一个JS函数，实现数组扁平化Array Flatten

## 第143题 设计实现一个H5图片懒加载

## 第142题 如果你是项目前端技术负责人，将如何做技术选型

## 第141题 开发一个H5抽奖页，需要后端提供哪些接口

## 第140题 简单描述hybrid模板的更新流程

## 第139题 设计一个“用户-角色-权限”的模型和功能

## 第138题 设计一个H5编辑器的数据模型和核心功能

## 第137题 SPA和MPA应该如何选择

## 第136题 如何设计一个前端统计SDK

## 第135题 React setState经典面试题

## 第134题 一道让人失眠的promise then执行顺序问题

## 第133题 把一个数组转换为树

## 答案是多少

## 第131题 工作中遇到过哪些项目难点，是如何解决的

## 第130题 如果一个H5很慢，如何排查性能问题

## 第129题 如何统一监听React组件报错

## 第128题 如何统一监听Vue组件报错

## 第127题 在实际工作中，你对React做过哪些优化

## 第126题 在实际工作中，你对Vue做过哪些优化

## 第125题 前端常用的设计模式和使用场景

## 第124题 后端一次性返回十万条数据，你该如何渲染

## 第123题 H5页面如何进行首屏优化

## 第122题 如何实现网页多标签tab通讯

## 第121题 从输入URL 到网页显示的完整过程

## 第120题 WebSocket和HTTP协议有什么区别

## 第119题 前端攻击手段有哪些，该如何预防

## 第118题 script标签的defer和async有什么区别

## 第117题 什么是HTTPS中间人攻击，如何预防（HTTPS加密过程、原理）

## 第116题 HTTP协议1.0和1.1和2.0有什么区别

## 第115题 HTTP请求中token、cookie、session有什么区别

## 第114题 移动端H5点击有300ms延迟，该如何解决

## 第113题 requestIdleCallback和requestAnimationFrame有什么区别

## 第112题 请描述js-bridge的实现原理

## 第111题 nodejs如何开启多进程，进程如何通讯

## 第110题 遍历一个数组用for和forEach哪个更快

## 第109题 虚拟DOM（vdom）真的很快吗

## 第108题 浏览器和nodejs事件循环（Event Loop）有什么区别

### 浏览器中的事件循环

### nodejs中的事件循环

## 第107题 JS内存泄露如何检测？场景有哪些？

### 垃圾回收机制

### 如何检测内存泄露

### 内存泄露的场景（Vue为例）

### 拓展 WeakMap WeakSet

## 第106题 HTTP跨域请求时为什么要发送options请求

## 第105题 HTMLCollection和NodeList的区别

## 第104题 for in和for of有什么区别

## 第103题 请描述TCP三次握手和四次挥手

## 第102题 什么时候不能使用箭头函数

## 第101题 切换字母大小写

### 切换字母大小写（正则表达式）

### 切换字母大小写（ASCII 编码）

## 第100题 实现数字千分位格式化

### 千分位格式化（使用数组）

### 数字千分位格式化（字符串分析）

## 第99题 高效的字符串前缀匹配如何做

## 第98题 获取1-10000之前所有的对称数（回文数）

### 查询 1-max 的所有对称数（数组反转）

### 查询 1-max 的所有对称数（字符串前后比较）

### 查询 1-max 的所有对称数（生成翻转数）

## 第97题 实现快速排序并说明时间复杂度

### 快速排序（使用 splice）

### 快速排序（使用 slice）

## 第96题 获取字符串中连续最多的字符以及次数

### 求连续最多的字符和次数（嵌套循环）

### 求连续最多的字符和次数（双指针）

### 其他方式

## 第95题 将数组中的0移动到末尾

### 移动 0 到数组的末尾（嵌套循环）

### 移动 0 到数组末尾（双指针）

## 第94题 求斐波那契数列的第n值

### 斐波那契数列（递归）

### 拓展：青蛙跳台阶

### 斐波那契数列（循环）

## 第93题 求一个二叉搜索树的第k小值

### 二叉树

### 思路分析

### 拓展：为什么二叉树很重要，而不是三叉树四叉树

### 拓展：堆有什么特点，和二叉树有什么关系

## 第92题 时间复杂度与空间复杂度基本概念

## 第91题 给一个数组，找出其中和为n的两个元素（两数之和）

### 寻找和为 n 的两个数（嵌套循环）

### 查找和为 n 的两个数（双指针）

## 第90题 实现二分查找并分析时间复杂度

### 二分查找（循环）

### 二分查找（递归）

## 第89题 反转一个单项链表

## 第88题 实现队列功能

### 请用两个栈，实现一个队列功能

### 使用链表实现队列

## e}f"是否括号匹配

## 第86题 下面这道题输出什么

## 第85题 下面这道题输出什么

## 第84题 下面这道题输出什么

## 点击格增加次数，次数互不干扰，次数通过弹窗显示

## 等于6

## 第81题 下面这道题输出什么

## 第80题 require 具体实现原理是什么

## 第79题 Es6 的 let 实现原理

## 第78题 原型链判断

## 第77题 手写 Vue.extend 实现

## 第76题 怎么在制定数据源里面生成一个长度为 n 的不重复随机数组 能有几种方法 时间复杂度多少（字节）

## 第75题 如何找到数组中第一个没出现的最小正整数 怎么优化（字节）

## 第74题 字符串最长的不重复子串

## 第73题 查找数组公共前缀（美团）

## 第72题 判断括号字符串是否有效（小米）

## 第71题 实现一个对象的 flatten 方法（阿里）

## 第70题 将虚拟DOM转化为真实DOM

## 第69题 手写setTimeout 模拟实现 setInterval（阿里）

## 第68题 Vue nextTick 原理

## 第67题 实现一个比setTimeout快 80 倍的定时器

## 第66题 数组转为tree

## 第65题 原型调用面试题 说出结果并说出 why

## 第64题 函数执行 说出结果并说出why

## 第63题 如何拦截全局Promise reject

## 第62题 JS执行机制 说出结果并说出why

## 第61题 实现继承

## 第60题 实现深拷贝

## 第59题 不使用循环API 来删除数组中指定位置的元素（如：删除第三位） 写越多越好

## 第58题 一个正则题

## 第57题 实现Promisify

## 第56题 完整实现Promises/A+规范

## 第55题 JS中 `??` 与 `||` 的区别

## 第54题 HTTP 中的 301、302、303、307、308 响应状态码

## 第53题 简单请求和复杂请求的区别

## 第52题 实现一个对象被for of遍历

## 第51题 判断JS对象是否存在循环引用

## 第50题 对象的深度比较

## 第49题 实现一个find函数，并且find函数能够满足下列条件

## 第48题 实现数组扁平化的 6 种方式

## 第47题 JS易错题

### `.` VS `=` 操作符优先级

### 作用域

### 类数组的length

### 非匿名自执行函数，函数名只读

### 变量提升

### 数组的原型是什么

### 数组比较大小

### 原型

### 函数名称

### Function.length

### "b" + "a" + +"a" + "a"

### 闭包

### 隐式转换

### 一道容易被人轻视的面试题

### let var

### 眼力题

## 第46题 关于0.1+0.2!=0.3浮点数计算分析与解决方法

## 第45题 介绍一下Tree Shaking及其工作原理

## 第44题 执行new Vue干了什么

## 第43题 说一下vue2.x中如何监测数组变化

## 第42题 介绍 HTTPS 握手过程

## 第41题 解释以下代码输出什么

## 功能

## 第39题 React setState 笔试题，下面的代码输出什么？

## 第38题 （头条）异步笔试题

## 第37题 实现ES6的class

## 第36题 实现一个柯里化函数

## 第35题 实现一个简易的MVVM

## 第34题 实现一下hash路由

## 第33题 实现一个发布订阅者模式

### 发布订阅者模式和观察者模式的区别？

## 第32题 关于async/await代码执行顺序

## 的polyfill

## 第30题 设计一个方法提取对象中所有value大于2的键值对并返回最新的对象

## 第29题 用一个正则提取字符串中所有`""`里内容

## 第28题 去除字符串首位空格

## 第27题 用正则写一个根据name获取cookie中的值的方法

## 第26题 实现 arr\[-1\] = arr\[arr.length - 1\]

## 第25题 JSONP的原理并用代码实现

## 第24题 实现一个拖拽

## 第23题 项目中你做过哪些优化

### 功能点的实现上

### 项目的构建上

### 网络缓存上

## 第22题 手写Promise最简20行版本，实现异步链式调用

### 实现代码

### 核心案例

### 构造函数

### then

### 其他版本实现

## 第21题 实现一个迷你版的vue

### 入口

### 实现Dep

### 实现watcher

### 实现compiler

### 实现Observer

### 使用

## 第20题 基于Promise.all实现Ajax的串行和并行

## 第19题 JQ Ajax、Axios、Fetch的核心区别

## 第18题 基于HTTP网络层的前端性能优化

### 第一步：URL解析

### 第二步：缓存检查

### 第三步：DNS解析

### 第四步：TCP三次握手

### 第五步：数据传输

### 第六步：TCP四次挥手

### 第七步：页面渲染

### 性能优化汇总

### HTTP1.0 VS HTTP1.1 VS HTTP2.0

### HTTP1.0和HTTP1.1的一些区别

### HTTP2.0和HTTP1.X相比的新特性

## 第17题 实现vue reactive原理

## 第16题 异步串行 | 异步并行

## 第15题 以下代码输出什么

## 条件成立

## 第13题 异步执行顺序问题

## 第12题 微任务执行问题 async await

## 第11题 this指向问题

## 第10题 promise执行问题

## 第9题 promise解决并发请求

## 第8题 跨域问题

## 第7题 下面输出什么

## 第6题 验证回文串

## 第5题 写一个函数来判断它是否是 3 的幂次方

## 第4题 旋转数组

## 第3题 修改嵌套层级很深对象的 key

## 第2题 只出现一次的数字

## 第1题 两数之和
