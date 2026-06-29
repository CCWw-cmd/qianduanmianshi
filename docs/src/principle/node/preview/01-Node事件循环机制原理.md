
# Node事件循环机制原理

## Node.js 事件循环

事件循环通俗来说就是一个无限的 while 循环。现在假设你对这个 while 循环什么都不了解，你一定会有以下疑问。

1. 谁来启动这个循环过程，循环条件是什么？
2. 循环的是什么任务呢？
3. 循环的任务是否存在优先级概念？
4. 什么进程或者线程来执行这个循环？
5. 无限循环有没有终点？

带着这些问题，我们先来看看 Node.js 官网提供的事件循环原理图。

## Node.js 循环原理

图 为 Node.js 官网的事件循环原理的核心流程图。

![](https://s.poetries.top/images/20210424180608.png)

可以看到，这一流程包含 6 个阶段，每个阶段代表的含义如下所示。

（1）`timers`：本阶段执行已经被 `setTimeout() 和 setInterval()` 调度的回调函数，简单理解就是由这两个函数启动的回调函数。

（2）`pending callbacks`：本阶段执行某些系统操作（如 TCP 错误类型）的回调函数。

（3）`idle、prepare`：仅系统内部使用，你只需要知道有这 2 个阶段就可以。

（4）`poll`：检索新的 I/O 事件，执行与 I/O 相关的回调，其他情况 Node.js 将在适当的时候在此阻塞。这也是最复杂的一个阶段，所有的事件循环以及回调处理都在这个阶段执行，接下来会详细分析这个过程。

（5）`check`：setImmediate() 回调函数在这里执行，setImmediate 并不是立马执行，而是当事件循环 poll 中没有新的事件处理时就执行该部分，如下代码所示：

```js
const fs = require('fs');
setTimeout(() => { // 新的事件循环的起点
    console.log('1'); 
}, 0);
setImmediate( () => {
    console.log('setImmediate 1');
});
/// 将会在 poll 阶段执行
fs.readFile('./test.conf', {encoding: 'utf-8'}, (err, data) => {
    if (err) throw err;
    console.log('read file success');
});
/// 该部分将会在首次事件循环中执行
Promise.resolve().then(()=>{
    console.log('poll callback');
});
// 首次事件循环执行
console.log('2');
```

> 在这一代码中有一个非常奇特的地方，就是 `setImmediate 会在 setTimeout 之后输出`。有以下几点原因：

* `setTimeout` 如果不设置时间或者设置时间为 0，则会默认为 \`1ms；\`\`
* 主流程执行完成后，超过 `1ms` 时，会将 `setTimeout` 回调函数逻辑插入到待执行回调函数 `poll` 队列中；
* 由于当前 poll 队列中存在可执行回调函数，因此需要先执行完，待完全执行完成后，才会执行check：setImmediate。

> `先执行回调函数，再执行 setImmediate`

（6）`close callbacks`：执行一些关闭的回调函数，如 `socket.on('close', ...)`

以上就是循环原理的 6 个过程，针对上面的点，我们再来解答上面提出的 5 个疑问。

## 运行起点

## Node.js 事件循环

## 单线程/多线程
