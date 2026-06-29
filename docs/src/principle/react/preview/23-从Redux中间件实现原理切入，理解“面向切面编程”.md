
## 认识 Redux 中间件

中间件相关的信息将作为 createStore 函数的一个 function 类型的入参被传入。这里我们简单复习一下 createStore 的调用规则，示例代码如下：

### 中间件的引入

```js
// 引入 redux
import { createStore, applyMiddleware } from 'redux'
......
// 创建 store
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)
);
```

可以看到，redux 对外暴露了 applyMiddleware 这个方法。applyMiddleware 接受任意个中间件作为入参，而它的返回值将会作为参数传入 createStore，这就是中间件的引入过程

### 中间件的工作模式

中间件的引入，会为 Redux 工作流带来什么样的改变呢？这里我们以 redux-thunk 为例，从经典的“异步 Action”场景切入，一起看看中间件是如何帮我们解决问题的。

**redux-thunk——经典的异步 Action 解决方案**

在针对 Redux 源码主流程的分析中，我们不难看出这样一个规律——Redux 源码中只有同步操作，也就是说当我们 `dispatch action 时，state 会被立即更新`。

那如果想要在 Redux 中引入异步数据流，该怎么办呢？Redux 官方给出的建议是使用中间件来增强 createStore。支持异步数据流的 Redux 中间件有很多，其中最适合用来快速上手的应该就是 redux-thunk了。

redux-thunk 的引入和普通中间件无异，可以参考以下示例：

```js
// 引入 redux-thunk
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'
// 将中间件用 applyMiddleware 包装后传入
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
```

```js
// 这里处理的是没有设定初始状态的情况，也就是第一个参数和第二个参数都传 function 的情况
if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
  // 此时第二个参数会被认为是 enhancer（中间件）
  enhancer = preloadedState;
  preloadedState = undefined;
}
```

这段代码告诉我们，在只传入两个参数的情况下，createStore 会去检查第二个参数是否是 function 类型，若是，则认为第二个参数是“enhancer”。这里的“enhancer”是“增强器”的意思，而 applyMiddleware 包装过的中间件，正是“增强器”的一种。这也就解释了为什么上面 redux-thunk 的调用示例中，applyMiddleware 调用明明是作为 createStore 的第二个参数被传入的，却仍然能够被识别为中间件信息

> redux-thunk 带来的改变非常好理解，它允许我们以函数的形式派发一个 action，像这样（解析在注释里）：

```js
// axios 是一个用于发起异步请求的库
import axios from 'axios' 
// 引入 createStore 和 applyMiddleware
import { createStore, applyMiddleware } from 'redux';
// 引入 redux-thunk
import thunk from 'redux-thunk';
// 引入 reducer
import reducer from './reducers';
// 创建一个有 thunk 中间件加持的 store 对象
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);
// 用于发起付款请求，并处理请求结果。由于涉及资金，我们希望感知请求的发送和响应的返回
// 入参是付款相关的信息（包括用户账密、金额等）
// 注意 payMoney 的返回值仍然是一个函数
const payMoney = (payInfo) => (dispatch) => {
  // 付款前发出准备信号
  dispatch({ type: 'payStart' })
  fetch().then(res => { dispatch()})
  return axios.post('/api/payMoney', {
    payInfo
  })
  .then(function (response) {
    console.log(response);
    // 付款成功信号
    dispatch({ type: 'paySuccess' })
  })
  .catch(function (error) {
    console.log(error);
    // 付款失败信号
    dispatch({ type: 'payError' })
  });
}
// 支付信息，入参
const payInfo = {
  userName: xxx,
  password: xxx,
  count: xxx,
  ......
}
// dispatch 一个 action，注意这个 action 是一个函数
store.dispatch(payMoney(payInfo));
```

这里我尝试用 `redux-thunk` 模拟了一个付款请求的发起 → 响应过程。

这个过程单从表面上看，和普通 Redux 调用最大的不同就是 dispatch 的入参从 action 对象变成了一个函数。这就不由得让人对 thunk 中间件加持下的 Redux 工作流心生好奇——action 入参必须是一个对象

要想搞清楚这个问题，你除了需要理解 thunk 的执行逻辑，更重要的是要知道 Redux 中间件是如何工作的。

## Redux 中间件是如何与 Redux 主流程相结合的

Redux 中间件将会在 `action` 被分发之后、到达 `reducer` 之前执行，对应到工作流中，它的执行时机如下图所示：

![](https://s.poetries.top/images/20210429162806.png)

若有多个中间件，那么 Redux 会结合它们被“安装”的先后顺序，依序调用这些中间件，这个过程如下图所示：

![](https://s.poetries.top/images/20210429162825.png)

中间件的执行时机，允许它在状态真正发生变化之前，结合 action 的信息做一些它想做的事情。

那么中间件又是如何“绕过” dispatch 的校验逻辑的呢？其实，“绕过”dispatch 只是咱们主观上的一个使用感受。dispatch 并非被“绕过”了，而是被“改写”了，改写它的不是别人，正是 applyMiddleware

读到这里，对于 Redux 中间件的工作模式，`你需要牢牢把握以下两点`：

* 中间件的执行时机，即 `action` 被分发之后、`reducer` 触发之前；
* 中间件的执行前提，即 `applyMiddleware` 将会对 `dispatch` 函数进行改写，使得 `dispatch` 在触发 `reducer` 之前，会首先执行对 `Redux` 中间件的链式调用。

结合这两点，再来看 `redux-thunk` 的源码，一切就会豁然开朗了。

## thunk 中间件到底做了什么？

## Redux 中间件机制是如何实现的

### 1. applyMiddleware 是如何与 createStore 配合工作的？

### 2.dispatch 函数是如何被改写的

### 3. compose 源码解读：函数的合成
