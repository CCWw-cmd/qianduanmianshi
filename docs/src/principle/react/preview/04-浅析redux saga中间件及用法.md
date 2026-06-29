
## 一、redux-thunk

### 1.1 redux的副作用处理

> redux中的数据流大致是

```js
UI—————>action（plain）—————>reducer——————>state——————>UI
```

![img](https://s.poetries.top/gitee/2019/10/484.png)

* `redux`是遵循函数式编程的规则，上述的数据流中，`action`是一个原始js对象（`plain object`）且`reducer`是一个纯函数，对于同步且没有副作用的操作，上述的数据流起到可以管理数据，从而控制视图层更新的目的
* 如果存在副作用函数，那么我们需要首先处理副作用函数，然后生成原始的js对象。如何处理副作用操作，在`redux`中选择在发出`action`，到`reducer`处理函数之间使用中间件处理副作用

> redux增加中间件处理副作用后的数据流大致如下：

```js
UI——>action(side function)—>middleware—>action(plain)—>reducer—>state—>UI
```

![img](https://s.poetries.top/gitee/2019/10/485.png)

> 在有副作用的`action`和原始的`action`之间增加中间件处理，从图中我们也可以看出，中间件的作用就是：

* 转换异步操作，**生成原始的action**，这样，`reducer`函数就能处理相应的`action`，从而改变`state`，更新`UI`

### 1.2 redux-thunk源码

> 在redux中，thunk是redux作者给出的中间件，实现极为简单，10多行代码

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

> 这几行代码做的事情也很简单，判别action的类型，如果action是函数，就调用这个函数，调用的步骤为

```js
action(dispatch, getState, extraArgument);
```

> 发现实参为`dispatch`和`getState`，因此我们在定义`action`为`thunk`函数是，一般形参为`dispatch`和`getState`

### 1.3 redux-thunk的缺点

> ```js
> thunk`的缺点也是很明显的，`thunk`仅仅做了执行这个函数，并不在乎函数主体内是什么，也就是说`thunk`使得`redux`可以接受函数作为`action`，但是函数的内部可以多种多样。比如下面是一个获取商品列表的异步操作所对应的`action
> ```

```js
export default ()=>(dispatch)=>{
    fetch('/api/goodList',{ //fecth返回的是一个promise
      method: 'get',
      dataType: 'json',
    }).then(function(json){
      var json=JSON.parse(json);
      if(json.msg==200){
        dispatch({type:'init',data:json.data});
      }
    },function(error){
      console.log(error);
    });
};
```

> 从这个具有副作用的`action`中，我们可以看出，函数内部极为复杂。如果需要为每一个异步操作都如此定义一个`action`，显然`action`不易维护

**action不易维护的原因**

* `action`的形式不统一
* 就是异步操作太为分散，分散在了各个`action`中

## 二、redux-saga 简介

> `redux-saga`是一个 `redux`中间件，它具有如下特性

* 集中处理 `redux` 副作用问题。
* 被实现为 `generator` 。
* 类 `redux-thunk` 中间件。
* `watch`/`worker`（监听->执行） 的工作形式

**redux-saga的优点**

* 集中处理了所有的异步操作，异步接口部分一目了然
* `action`是普通对象，这跟`redux`同步的`action`一模一样
* 通过`Effect`，方便异步接口的测试
* 通过`worker` 和`watcher`可以实现非阻塞异步调用，并且同时可以实现非阻塞调用下的事件监听
* 异步操作的流程是可以控制的，可以随时取消相应的异步操作

> 基本用法

* 使用`createSagaMiddleware`方法创建`saga` 的`Middleware`，然后在创建的`redux`的`store`时，使用`applyMiddleware`函数将创建的`saga Middleware`实例绑定到`store`上，最后可以调用`saga Middleware`的`run`函数来执行某个或者某些`Middleware`。
* 在`saga`的`Middleware`中，可以使用`takeEvery`或者`takeLatest`等`API`来监听某个`action`，当某个`action`触发后，`saga`可以使用`call`发起异步操作，操作完成后使用`put`函数触发`action`，同步更新`state`，从而完成整个`State`的更新。

## 三、redux-saga使用案例

## 四、redux-saga使用细节

### 4.1 声明式的Effect

### 4.2 Effect提供的具体方法

## 五、案例分析一

### 5.1 LoginPanel(登陆页)

### 5.2 LoginSuccess

## 六、案例分析二

### 6.1 配置saga信息

### 6.2 配置reduce

### 6.3 处理action

### 6.4 处理sagas

## 七、总结
