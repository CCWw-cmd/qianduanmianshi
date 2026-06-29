
# HTML模块

## 1 如何理解 HTML 语义化

- 用正确的标签做正确的事情！
- `HTML`语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；
- 在没有样式`CSS`情况下也以一种文档格式显示，并且是容易阅读的。
- 搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 `SEO`。
- 使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解

## 2 H5 的新特性有哪些

- 画布(`Canvas`) API
- 地理(`Geolocation`) API
- 音频、视频 API(`audio`,`video`)
- `localStorage`和`sessionStorage`
- `webworker`, `websocket`
- 新的一套标签 `header`,`nav`,`footer`,`aside`,`article`,`section`
- `web worker`是运行在浏览器后台的 js 程序，他不影响主程序的运行，是另开的一个 js 线程，可以用这个线程执行复杂的数据操作，然后把操作结果通过`postMessage`传递给主线程，这样在进行复杂且耗时的操作时就不会阻塞主线程了
- `HTML5 History`两个新增的 API：`history.pushState` 和 `history.replaceState`，两个 `API` 都会操作浏览器的历史记录，而不会引起页面的刷新

> `Hash`就是`url` 中看到 `#` ,我们需要一个根据监听哈希变化触发的事件( `hashchange`) 事件。我们用 `window.location`处理哈希的改变时不会重新渲染页面，而是当作新页面加到历史记录中，这样我们跳转页面就可以在 `hashchange` 事件中注册 `ajax` 从而改变页面内容。 可以为`hash`的改变添加监听事件：

```js
window.addEventListener("hashchange", funcRef, false)
```

- `WebSocket` 使用`ws`或`wss`协议，`Websocket`是一个持久化的协议，相对于`HTTP`这种非持久的协议来说。`WebSocket API`最伟大之处在于服务器和客户端可以在给定的时间范围内的任意时刻，相互推送信息。`WebSocket`并不限于以`Ajax`(或`XHR`)方式通信，因为`Ajax`技术需要客户端发起请求，而`WebSocket`服务器和客户端可以彼此相互推送信息；`XHR`受到域的限制，而`WebSocket`允许跨域通信

```js
// 创建一个Socket实例
var socket = new WebSocket('ws://localhost:8080');
// 打开Socket
socket.onopen = function(event) {
  // 发送一个初始化消息
  socket.send('I am the client and I\'m listening!');
  // 监听消息
  socket.onmessage = function(event) {
    console.log('Client received a message',event);
  };
  // 监听Socket的关闭
  socket.onclose = function(event) {
    console.log('Client notified socket has closed',event);
  };
  // 关闭Socket....
  //socket.close()
};
```

## 3 说一下 HTML5 drag api

## 4 iframe 有那些缺点

## 5 如何实现浏览器内多个标签页之间的通信

## 6 简述一下 src 与 href 的区别

## 7 知道的网页制作会用到的图片格式有哪些

## 8 script 标签中 defer 和 async 的区别

## 9 说一下 web worker

## 10 用一个 div 模拟 textarea 的实现

## 11 介绍下资源预加载 prefetch/preload

## 12 介绍下 viewport

## 13 如何解决 a 标点击后 hover 事件失效的问题?

## 14 点击一个 input 依次触发的事件

## 15 有写过原生的自定义事件吗

## 16 addEventListener 和 attachEvent 的区别？

## 17 addEventListener 函数的第三个参数

## 18 DOM 事件流是什么？

## 19 冒泡和捕获的具体过程

## 20 关于一些兼容性

## 21 如何阻止冒泡和默认事件(兼容写法)

## 22 所有的事件都有冒泡吗？

## 23 拖拽有哪些知识点

## 24 offset、scroll、client 的区别

## 25 target="\_blank"有哪些问题？

## 26 children 以及 childNodes 的区别

## 27 HTMLCollection 和 NodeList 的区别
