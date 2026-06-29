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

```js
// createThunkMiddleware 用于创建 thunk
function createThunkMiddleware(extraArgument) {
  // 返回值是一个 thunk，它是一个函数
  return ({ dispatch, getState }) => (next) => (action) => {
    // thunk 若感知到 action 是一个函数，就会执行 action
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    // 若 action 不是一个函数，则不处理，直接放过
    return next(action);
  };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
export default thunk;
```

`redux-thunk 主要做的事情，就是在拦截到 action 以后，会去检查它是否是一个函数`。若 action 是一个函数，那么 redux-thunk 就会执行它并且返回执行结果；若 action 不是一个函数，那么它就不是 redux-thunk 的处理目标，直接调用 next，告诉 Redux “我这边的工作做完了”，工作流就可以继续往下走了。

## Redux 中间件机制是如何实现的

Redux 中间件是通过调用 `applyMiddleware` 来引入的，因此我们先看看 `applyMiddleware` 的源码

```js
// applyMiddlerware 会使用“...”运算符将入参收敛为一个数组
export default function applyMiddleware(...middlewares) {
  // 它返回的是一个接收 createStore 为入参的函数
  return createStore => (...args) => {
    // 首先调用 createStore，创建一个 store
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    // middlewareAPI 是中间件的入参
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 遍历中间件数组，调用每个中间件，并且传入 middlewareAPI 作为入参，得到目标函数数组 chain
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 改写原有的 dispatch：将 chain 中的函数按照顺序“组合”起来，调用最终组合出来的函数，传入 dispatch 作为入参
    dispatch = compose(...chain)(store.dispatch)

    // 返回一个新的 store 对象，这个 store 对象的 dispatch 已经被改写过了
    return {
      ...store,
      dispatch
    }
  }
}
```

在这段源码中，我们着重需要搞清楚的是以下几个问题：

* `applyMiddleware` 返回了一个什么样的函数？这个函数是如何与 createStore 配合工作的？
* `dispatch` 函数是如何被改写的？
* `compose` 函数是如何组合中间件的？

### 1. applyMiddleware 是如何与 createStore 配合工作的？

> 先来看看 applyMiddleware 的返回值。在源码的注释中，我已经标明，它返回的是一个接收 createStore 为入参的函数。这个函数将会作为入参传递给 createStore，那么 createStore 会如何理解它呢？这里就要带你复习一下 createStore 中，enhancer 相关的逻辑了，请看下面代码：

```js
function createStore(reducer, preloadedState, enhancer) {
    // 这里处理的是没有设定初始状态的情况，也就是第一个参数和第二个参数都传 function 的情况
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        // 此时第二个参数会被认为是 enhancer（中间件）
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    // 当 enhancer 不为空时，便会将原来的 createStore 作为参数传入到 enhancer 中
    if (typeof enhancer !== 'undefined') {
        return enhancer(createStore)(reducer, preloadedState);
    }
    ......
}
```

从这个代码片段中我们可以看出，一旦发现 enhancer 存在（对应到中间件场景下，enhancer 指的是 applyMiddleware 返回的函数），那么 createStore 内部就会直接 return 一个针对 enhancer 的调用。在这个调用中，第一层入参是 createStore，第二层入参是 reducer 和 preloadedState

我们可以尝试将这个逻辑在 applyMiddleware 中对号入座一下。下面我从出入参角度简单提取了一下 applyMiddleware 的源码框架：

```js
// applyMiddlerware 会使用“...”运算符将入参收敛为一个数组
export default function applyMiddleware(...middlewares) {
  // 它返回的是一个接收 createStore 为入参的函数
  return createStore => (...args) => {
    ......
  }
}
```

结合 createStore 中对 enhancer 的处理，我们可以知道，在 applyMiddleware return 出的这个函数中，createStore 这个入参对应的是 createStore 函数本身，而 args 入参则对应的是 reducer、preloadedState，这两个参数均为 createStore 函数的约定入参。

前面我们讲过，applyMiddleware 是 enhancer 的一种，而 enhancer 的意思是“增强器”，它增强的正是 createStore 的能力。因此调用 enhancer 时，传入 createStore 及其相关的入参信息是非常必要的。

### 2.dispatch 函数是如何被改写的

dispatch 函数的改写，是由下面这个代码片段完成的：

```js
// middlewareAPI 是中间件的入参
const middlewareAPI = {
  getState: store.getState,
  dispatch: (...args) => dispatch(...args)
}
// 遍历中间件数组，调用每个中间件，并且传入 middlewareAPI 作为入参，得到目标函数数组 chain
const chain = middlewares.map(middleware => middleware(middlewareAPI))
// 改写原有的 dispatch：将 chain 中的函数按照顺序“组合”起来，调用最终组合出来的函数，传入 dispatch 作为入参
dispatch = compose(...chain)(store.dispatch)
```

这个代码片段做了两件事：首先以 `middlewareAPI` 作为入参，逐个调用传入的 `middleware`，获取一个由“内层函数”组成的数组 chain；然后调用 compose 函数，将 chain 中的“内层函数”逐个组合起来，并调用最终组合出来的函数。

上面这段描述中，有两个点可能对你的理解构成障碍：

什么是“内层函数”？

* compose 函数到底是怎么组合函数的？它组合出来的又是个什么东西？
* 关于第 2 点，我们需要到 compose 源码中去看，这里先按下不表，咱们来说说“内层函数”在这里的含义。

首先我们需要站在函数的视角，来观察一下 thunk 中间件的源码：

```js
// createThunkMiddleware 用于创建 thunk
function createThunkMiddleware(extraArgument) {
  // 返回值是一个 thunk，它是一个函数
  return ({ dispatch, getState }) => (next) => (action) => {
    // thunk 若感知到 action 是一个函数，就会执行 action
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    // 若 action 不是一个函数，则不处理，直接放过
    return next(action);
  };
}
const thunk = createThunkMiddleware();
```

thunk 中间件是 `createThunkMiddleware` 的返回值，createThunkMiddleware 返回的是这样的一个函数：

```js
({ dispatch, getState }) => (next) => (action) => {
  // thunk 若感知到 action 是一个函数，就会执行 action
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgument);
  }
  // 若 action 不是一个函数，则不处理，直接放过
  return next(action);
};
```

该函数的返回值仍然是一个函数，显然它是一个高阶函数。事实上，按照约定，所有的 Redux 中间件都必须是高阶函数。在高阶函数中，我们习惯于将原函数称为“外层函数”，将 return 出来的函数称为“内层函数”。

而 apply 中遍历 middlewares 数组，逐个调用 `middleware(middlewareAPI)`，无非是为了获取中间件的内层函数。

以 thunk 的源码为例，不难看出，外层函数的主要作用是获取 dispatch、getState 这两个 API，而真正的中间件逻辑是在内层函数中包裹的。待`middlewares.map(middleware => middleware(middlewareAPI))` 执行完毕后，内层函数会被悉数提取至 chain 数组。接下来，我们直接拿 chain 数组开刀就行了

提取出 chain 数组之后，applyMiddleware 做的第一件事就是将数组中的中间件逻辑 compose 起来。

那么 compose 函数又是如何工作的呢？

### 3. compose 源码解读：函数的合成

函数合成（组合函数）并不是 Redux 的专利，而是函数式编程中一个通用的概念。因此在 Redux 源码中，compose 函数是作为一个独立文件存在的，它具备较强的工具属性。

我们还是先通过阅读源码，来弄清楚 compose 到底都做了什么。以下是 compose 的源码（解析在注释里）：

```js
// compose 会首先利用“...”运算符将入参收敛为数组格式
export default function compose(...funcs) {
  // 处理数组为空的边界情况
  if (funcs.length === 0) {
    return arg => arg
  }

  // 若只有一个函数，也就谈不上组合，直接返回
  if (funcs.length === 1) {
    return funcs[0]
  }
  // 若有多个函数，那么调用 reduce 方法来实现函数的组合
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

其实整段源码中值得你细细品味的只有最后这一行代码：

```js
// 若有多个函数，那么调用 reduce 方法来实现函数的组合
return funcs.reduce((a, b) => (...args) => a(b(...args)))
```

这行代码告诉我们，函数组合是通过调用数组的 reduce 方法来实现的。

reducer 方法的特点是，会对数组中的每个元素执行我们指定的函数逻辑，并将其结果汇总为单个返回值。因此对于这样的一个 compose 调用来说：

```js
compose(f1, f2, f3, f4)
```

它会把函数组合为这种形式：

```js
(...args) =>  f1(f2(f3(f4(...args))))
```

如此一来，f1、f2、f3、f4 这 4 个中间件的内层逻辑就会被组合到一个函数中去，当这个函数被调用时，f1、f2、f3、f4  将会按照顺序被依次调用。这就是“函数组合”在此处的含义
