
# Promise面试题

**event loop它的执行顺序：**

* 一开始整个脚本作为一个宏任务执行
* 执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列
* 当前宏任务执行完出队，检查微任务列表，有则依次执行，直到全部执行完
* 执行浏览器UI线程的渲染工作
* 检查是否有Web Worker任务，有则执行
* 执行完本轮的宏任务，回到2，依此循环，直到宏任务和微任务队列都为空

**微任务包括**：`MutationObserver`、`Promise.then()`或`reject()`、`Promise`为基础开发的其它技术，比如`fetch API`、`V8`的垃圾回收过程、`Node`独有的`process.nextTick`。

**宏任务包括**：`script、script` 、`setTimeout`、`setInterval` 、`setImmediate` 、`I/O` 、`UI rendering`

## 1 Promise的几道基础题

### 1.1 题目一

```js
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
})
console.log('1', promise1);
```

* 从上至下，先遇到new Promise，执行该构造函数中的代码promise1
* 然后执行同步代码1，此时promise1没有被resolve或者reject，因此状态还是pending

```js
'promise1'
'1' Promise{<pending>}
```

### 1.2 题目二

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

* 从上至下，先遇到new Promise，执行其中的同步代码1
* 再遇到resolve('success')， 将promise的状态改为了resolved并且将值保存下来
* 继续执行同步代码2
* 跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
* 执行同步代码4
* 本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。

```js
1 2 4 3
```

### 1.3 题目三

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

* 和题目二相似，只不过在`promise`中并没有`resolve`或者`reject`
* 因此`promise.then`并不会执行，它只有在被改变了状态之后才会执行。

```js
1 2 4
```

### 1.4 题目四

```js
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);
```

* 从上至下，先遇到`new Promise`，执行该构造函数中的代码`promise1`
* 碰到`resolve`函数, 将`promise1`的状态改变为`resolved`, 并将结果保存下来
* 碰到`promise1.then`这个微任务，将它放入微任务队列
* `promise2`是一个新的状态为`pending的`Promise\`
* 执行同步代码1， 同时打印出`promise1`的状态是`resolved`
* 执行同步代码2，同时打印出`promise2`的状态是`pending`
* 宏任务执行完毕，查找微任务队列，发现`promise1.then`这个微任务且状态为resolved，执行它。

```js
'promise1'
'1' Promise{<resolved>: 'resolve1'}
'2' Promise{<pending>}
'resolve1'
```

### 1.5 题目五

```js
const fn = () => (new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
}))
fn().then(res => {
  console.log(res)
})
console.log('start')
```

请仔细看看哦，fn函数它是直接返回了一个new Promise的，而且fn函数的调用是在start之前，所以它里面的内容应该会先执行。

```js
1
'start'
'success'
```

### 1.6 题目六

如果把fn的调用放到start之后呢？

```js
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then(res => {
  console.log(res);
});
```

现在start就在1之前打印出来了，因为fn函数是之后执行的。

> 注意⚠️：之前我们很容易就以为看到`new Promise()`就执行它的第一个参数函数了，其实这是不对的，就像这两道题中，我们得注意它是不是被包裹在函数当中，如果是的话，只有在函数调用的时候才会执行。

```js
"start"
1
"success"
```

## 2. Promise结合setTimeout

### 2.1 题目一

```js
console.log('start')
setTimeout(() => {
  console.log('time')
})
Promise.resolve().then(() => {
  console.log('resolve')
})
console.log('end')
```

* 刚开始整个脚本作为一个宏任务来执行，对于同步代码直接压入执行栈进行执行，因此先打印出start和end。
* setTimout作为一个宏任务被放入宏任务队列(下一个)
* Promise.then作为一个微任务被放入微任务队列
* 本次宏任务执行完，检查微任务，发现Promise.then，执行它
* 接下来进入下一个宏任务，发现setTimeout，执行。

```js
'start'
'end'
'resolve'
'time'
```

### 2.2 题目二

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
```

> 和题目1.2很像，不过在resolve的外层加了一层setTimeout定时器。

* 从上至下，先遇到new Promise，执行该构造函数中的代码1
* 然后碰到了定时器，将这个定时器中的函数放到下一个宏任务的延迟队列中等待执行 执行同步代码2
* 跳出promise函数，遇到promise.then，但其状态还是为pending，这里理解为先不执行 执行同步代码4
* 一轮循环过后，进入第二次宏任务，发现延迟队列中有setTimeout定时器，执行它
* 首先执行timerStart，然后遇到了resolve，将promise的状态改为resolved且保存结果并将之前的promise.then推入微任务队列
* 继续执行同步代码timerEnd
* 宏任务全部执行完毕，查找微任务队列，发现promise.then这个微任务，执行它

```js
1
2
4
"timerStart"
"timerEnd"
"success"
```

### 2.3 题目三

题目三分了两个题目，因为看着都差不多，不过执行的结果却不一样，大家不妨先猜猜下面两个题目分别执行什么：

```js
setTimeout(() => {
  console.log('timer1');
  setTimeout(() => {
    console.log('timer3')
  }, 0)
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
```

```js
'start'
'timer1'
'timer2'
'timer3'
```

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
```

```js
'start'
'timer1'
'promise'
'timer2'
```

* 这两个例子，看着好像只是把第一个定时器中的内容换了一下而已。
* 一个是为定时器timer3，一个是为Promise.then
* 但是如果是定时器timer3的话，它会在timer2后执行，而Promise.then却是在timer2之前执行。
* 你可以这样理解，Promise.then是微任务，它会被加入到本轮中的微任务列表，而定时器timer3是宏任务，它会被加入到下一轮的宏任务中。
* 理解完这两个案例，可以来看看下面一道比较难的题目了

### 2.4 题目三

```js
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');
```

* 这道题稍微的难一些，在promise中执行定时器，又在定时器中执行promise；
* 并且要注意的是，这里的Promise是直接resolve的，而之前的new Promise不一样。

**因此过程分析为**

* 刚开始整个脚本作为第一次宏任务来执行，我们将它标记为宏1，从上至下执行
* 遇到Promise.resolve().then这个微任务，将then中的内容加入第一次的微任务队列标记为微1
* 遇到定时器timer1，将它加入下一次宏任务的延迟列表，标记为宏2，等待执行(先不管里面是什么内容)
* 执行宏1中的同步代码start
* 第一次宏任务(宏1)执行完毕，检查第一次的微任务队列(微1)，发现有一个promise.then这个微任务需要执行
* 执行打印出微1中同步代码promise1，然后发现定时器timer2，将它加入宏2的后面，标记为宏3
* 第一次微任务队列(微1)执行完毕，执行第二次宏任务(宏2)，首先执行同步代码timer1
* 然后遇到了promise2这个微任务，将它加入此次循环的微任务队列，标记为微2
* 宏2中没有同步代码可执行了，查找本次循环的微任务队列(微2)，发现了promise2，执行它
* 第二轮执行完毕，执行宏3，打印出timer2

```js
'start'
'promise1'
'timer1'
'promise2'
'timer2'
```

![](https://s.poetries.top/gitee/2020/03/2.png)

### 2.5 题目四

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)
```

* 从上至下，先执行第一个new Promise中的函数，碰到setTimeout将它加入下一个宏任务列表
* 跳出new Promise，碰到promise1.then这个微任务，但其状态还是为pending，这里理解为先不执行
* promise2是一个新的状态为pending的Promise
* 执行同步代码console.log('promise1')，且打印出的promise1的状态为pending
* 执行同步代码console.log('promise2')，且打印出的promise2的状态为pending
* 碰到第二个定时器，将其放入下一个宏任务列表
* 第一轮宏任务执行结束，并且没有微任务需要执行，因此执行第二轮宏任务
* 先执行第一个定时器里的内容，将promise1的状态改为resolved且保存结果并将之前的promise1.then推入微任务队列
* 该定时器中没有其它的同步代码可执行，因此执行本轮的微任务队列，也就是promise1.then，它抛出了一个错误，且将promise2的状态设置为了rejected
* 第一个定时器执行完毕，开始执行第二个定时器中的内容
* 打印出'promise1'，且此时promise1的状态为resolved
* 打印出'promise2'，且此时promise2的状态为rejected

```js
'promise1' Promise{<pending>}
'promise2' Promise{<pending>}
test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102
'promise1' Promise{<resolved>: "success"}
'promise2' Promise{<rejected>: Error: error!!!}
```

### 2.6 题目五

如果你上面这道题搞懂了之后，我们就可以来做做这道了，你应该能很快就给出答案：

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    console.log("timer1");
  }, 1000);
  console.log("promise1里的内容");
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("timer2");
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);
```

```js
'promise1里的内容'
'promise1' Promise{<pending>}
'promise2' Promise{<pending>}
'timer1'
test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102
'timer2'
'promise1' Promise{<resolved>: "success"}
'promise2' Promise{<rejected>: Error: error!!!}
```

## 3. Promise中的then、catch、finally

### 3.1 题目一

### 3.2 题目二

### 3.3 题目三

### 3.4 题目四

### 3.5 题目五

### 3.6 题目六

### 3.7 题目七

### 3.8 题目八

### 3.9 题目九

### 3.10 题目十

## 4. Promise中的all和race

### 4.1 题目一

### 4.2 题目二

### 4.3 题目三

### 4.4 题目四

## 5. async/await的几道题

### 5.1 题目一

### 5.2 题目二

### 5.3 题目三

### 5.4 题目四

### 5.5 题目五

### 5.6 题目六

### 5.7 题目七

### 5.8 题目八

### 5.9 题目九

## 6. async处理错误

### 6.1 题目一

### 6.2 题目二

## 7. 综合题

### 7.1 题目一

### 7.2 题目二

### 7.3 题目三

## 8. 几道大厂的面试题

### 8.1 使用Promise实现每隔1秒输出1,2,3

### 8.2 使用Promise实现红绿灯交替重复亮

### 8.3 实现mergePromise函数

### 8.4 封装一个异步加载图片的方法

### 8.5 限制异步操作的并发个数并尽可能快的完成全部
