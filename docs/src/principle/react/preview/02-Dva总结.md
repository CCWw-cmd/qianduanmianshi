
## 一、环境搭建

```js
$ npm install dva-cli -g

# 创建应用
$ dva new dva-quickstart

# 启动
$ npm start
```

> react项目的推荐目录结构（如果使用dva脚手架创建，则自动生成如下）

```js
|── /mock/             # 数据mock的接口文件  
|── /src/              # 项目源码目录（我们开发的主要工作区域）   
|   |── /components/   # 项目组件（用于路由组件内引用的可复用组件）   
|   |── /routes/       # 路由组件（页面维度） 
|   |  |── route1.js  
|   |  |── route2.js   # 根据router.js中的映射，在不同的url下，挂载不同的路由组件
|   |  └── route3.js    
|   |── /models/       # 数据模型（可以理解为store，用于存储数据与方法）  
|   |  |── model1.js  
|   |  |── model2.js   # 选择分离为多个model模型，是根据业务实体进行划分
|   |  └── model3.js  
|   |── /services/     # 数据接口（处理前台页面的ajax请求，转发到后台）   
|   |── /utils/        # 工具函数（工具库，存储通用函数与配置参数）     
|   |── router.js       # 路由配置（定义路由与对应的路由组件）  
|   |── index.js       # 入口文件  
|   |── index.less      
|   └── index.html     
|── package.json       # 项目信息  
└── proxy.config.js    # 数据mock配置
```

**使用 antd**

```js
npm i babel-plugin-import --save
```

> `babel-plugin-import` 是用来按需加载 `antd` 的脚本和样式的

* 编辑 `.webpackrc`，使 `babel-plugin-import` 插件生效

```js
{
+  "extraBabelPlugins": [
+    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
+  ]
}
```

## 二、初识Dva

### 2.1 Dva的特性

```js
dva = React-Router + Redux + Redux-saga
```

* 仅有 5 个`API`，仅有5个主要的`api`
* 支持 `HMR`，支持模块的热更新
* 支持 `SSR (ServerSideRender)`，支持服务器端渲染
* 支持 `Mobile/ReactNative`，支持移动手机端的代码编写
* 支持`TypeScript`
* 支持路由和 `Model` 的动态加载

### 2.2 Dva的五个API

![img](https://s.poetries.top/gitee/20191001/43.png)

#### 2.2.1 app = dva(Opts)

> `app = dva(Opts)`：创建应用，返回 `dva` 实例。(注：dva 支持多实例)\*\*

在`opts`可以配置所有的`hooks`

```js
const app = dva({
     history,
     initialState,
     onError,
     onAction,
     onStateChange,
     onReducer,
     onEffect,
     onHmr,
     extraReducers,
     extraEnhancers,
});
```

> hooks包含如下配置项

1、 `onError((err, dispatch) => {})`

* `effect` 执行错误或 `subscription` 通过`done` 主动抛错时触发，可用于管理全局出错状态
* 注意：`subscription` 并没有加 `try...catch`，所以有错误时需通过第二个参数 `done` 主动抛错

```js
app.model({
  subscriptions: {
    setup({ dispatch }, done) {
      done(e)
    },
  },
})
```

2、 `onAction(fn | fn[])`

> 在`action`被`dispatch`时触发，用于注册 `redux` 中间件。支持函数或函数数组格式

* 例如我们要通过 `redux-logger` 打印日志

```js
import createLogger from 'redux-logger';
const app = dva({
  onAction: createLogger(opts),
})
```

3、 `onStateChange(fn)`

> `state` 改变时触发，可用于同步 state 到 `localStorage`，服务器端等

4、 `onReducer(fn)`

> 封装 `reducer` 执行，比如借助 `redux-undo` 实现 `redo/undo`

```js
import undoable from 'redux-undo';
const app = dva({
  onReducer: reducer => {
    return (state, action) => {
      const undoOpts = {};
      const newState = undoable(reducer, undoOpts)(state, action);
      // 由于 dva 同步了 routing 数据，所以需要把这部分还原
      return { ...newState, routing: newState.present.routing };
    },
  },
})
```

5、 `onEffect(fn)`

> 封装 `effect` 执行。比如 `dva-loading` 基于此实现了自动处理 `loading` 状态

6、 `onHmr(fn)`

> 热替换相关，目前用于 `babel-plugin-dva-hmr`

7、 `extraReducers`

> 指定额外的 `reducer`，比如 `redux-form` 需要指定额外的 `form reducer`

```js
import { reducer as formReducer } from 'redux-form'
const app = dva({
  extraReducers: {
    form: formReducer,
  },
})
```

> 这里比较常用的是，`history`的配置，一般默认的是`hashHistory`，如果要配置 `history`为 `browserHistory`，可以这样

```js
import createHistory from 'history/createBrowserHistory';
const app = dva({
  history: createHistory(),
});
```

> initialState`：指定初始数据，优先级高于`model` 中的 `state`，默认是`{}`，但是基本上都在`modal`里面设置相应的`state

#### 2.2.2 app.use(Hooks)

> app.use(Hooks)：配置 hooks 或者注册插件

这里最常见的就是`dva-loading`插件的配置

```js
import createLoading from 'dva-loading';
...
app.use(createLoading(opts));
```

> 但是一般对于全局的`loading`我们会根据业务的不同来显示相应不同的`loading`图标，我们可以根据自己的需要来选择注册相应的插件

#### 2.2.3 app.model(ModelObject)

> `app.model(ModelObject)`：这个是你数据逻辑处理，数据流动的地方

![img](https://s.poetries.top/gitee/20191001/44.png)

#### 2.2.4 app.unmodel(namespace)

> 取消 `model` 注册，清理 `reducers`,`effects` 和 `subscriptions`。`subscription` 如果没有返回 `unlisten` 函数，使用 `app.unmodel` 会给予警告

#### 2.2.5 app.router(Function)

> 注册路由表，这一操作步骤在dva中也很重要

```js
// 注册路由
app.router(require('./router'))


// 路由文件
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage'
import TodoList from './routes/TodoList'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
        <Route path="/" component={IndexPage} />
        <Route path='/todoList' components={TodoList}/>
    </Router>
  )
}
export default RouterConfig
```

> 如果我们想解决组件动态加载问题，我们的路由文件也可以按照下面的写法来写

```js
import { Router, Switch, Route } from 'dva/router'
import dynamic from 'dva/dynamic'

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/IndexPage'),
  })

  const Users = dynamic({
    app,
    models: () => [import('./models/users')],
    component: () => import('./routes/Users'),
  })

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/users" component={Users} />
      </Switch>
    </Router>
  )
}

export default RouterConfig
```

> 其中`dynamic(opts)` 中`opt`包含三个配置项：

* `app`: `dva` 实例，加载 `models` 时需要
* `models`: 返回 `Promise` 数组的函数，`Promise`返回 dva model\`
* `component`：返回 `Promise`的函数，`Promise`返回 `React Component`

#### 2.2.6 app.start

> 启动应用，即将我们的应用跑起来

### 2.3 Dva九个概念

#### 2.3.1 State

> 初始值，我们在 `dva()` 初始化的时候和在 modal 里面的 `state` 对其两处进行定义，其中 modal 中的优先级低于传给 `dva()` 的 `opts.initialState`

```js
// dva()初始化
const app = dva({
  initialState: { count: 1 },
});

// modal()定义事件
app.model({
  namespace: 'count',
  state: 0,
});
```

#### 2.3.2 Action

> 表示操作事件，可以是同步，也可以是异步

* `action` 的格式如下，它需要有一个 `type`，表示这个 `action` 要触发什么操作；`payload` 则表示这个 `action` 将要传递的数据

```js
{
  type: String,
  payload: data,
}
```

> 我们通过 dispatch 方法来发送一个 action

```js
dispatch({ type: 'todos/add', payload: 'Learn Dva' });
```

> 其实我们可以构建一个Action 创建函数，如下

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

//我们直接dispatch(addTodo()),就发送了一个action。
dispatch(addTodo())
```

#### 2.3.3 Model

> `model` 是 `dva` 中最重要的概念，`Model` 非 `MVC` 中的 `M`，而是领域模型，用于把数据相关的逻辑聚合到一起，几乎所有的数据，逻辑都在这边进行处理分发

```js
import queryString from 'query-string'
import * as todoService from '../services/todo'

export default {
  namespace: 'todo',
  state: {
    list: []
  },
  reducers: {
    save(state, { payload: { list } }) {
      return { ...state, list }
    }
  },
  effects: {
    *addTodo({ payload: value }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService.query, value)
      console.log(data)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      const tempObj = {}
      tempObj.title = value
      tempObj.id = list.length
      tempObj.finished = false
      list.push(tempObj)
      yield put({ type: 'save', payload: { list }})
    },
    *toggle({ payload: index }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService.query, index)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      let obj = list[index]
      obj.finished = !obj.finished
      yield put({ type: 'save', payload: { list } })
    },
    *delete({ payload: index }, { call, put, select }) {
      const data = yield call(todoService.query, index)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      list.splice(index, 1)
      yield put({ type: 'save', payload: { list } })
    },
    *modify({ payload: { value, index } }, { call, put, select }) {
      const data = yield call(todoService.query, value)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      let obj = list[index]
      obj.title = value
      yield put({ type: 'save', payload: { list } })
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由的变化，请求页面数据
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search)
        let list = []
        if (pathname === 'todoList') {
          dispatch({ type: 'save', payload: {list} })
        }
      })
    }
  }
}
```

> `model`对象中包含5个重要的属性

**state**

> 这里的 state 跟我们刚刚讲的 state 的概念是一样的，只不过她的优先级比初始化的低，但是基本上项目中的 state 都是在这里定义的

**namespace**

> model` 的命名空间，同时也是他在全局 `state` 上的属性，只能用字符串，我们发送在发送 `action` 到相应的 `reducer` 时，就会需要用到 `namespace

**Reducer**

> 以`key/value` 格式定义 `reducer`，用于处理同步操作，唯一可以修改 `state` 的地方。由 `action` 触发。其实一个纯函数

```js
namespace: 'todo',
  state: {
    list: []
  },
  // reducers 写法
  reducers: {
    save(state, { payload: { list } }) {
      return { ...state, list }
    }
 }
```

**Effect**

> 用于处理异步操作和业务逻辑，不直接修改 `state`，简单的来说，就是获取从服务端获取数据，并且发起一个 `action`交给`reducer` 的地方

其中它用到了`redux-saga`，里面有几个常用的函数。

```js
// effects 写法
effects: {
    *addTodo({ payload: value }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService.query, value)
      console.log(data)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      const tempObj = {}
      tempObj.title = value
      tempObj.id = list.length
      tempObj.finished = false
      list.push(tempObj)
      yield put({ type: 'save', payload: { list }})
    },
    *toggle({ payload: index }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService.query, index)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      let obj = list[index]
      obj.finished = !obj.finished
      yield put({ type: 'save', payload: { list } })
    },
    *delete({ payload: index }, { call, put, select }) {
      const data = yield call(todoService.query, index)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      list.splice(index, 1)
      yield put({ type: 'save', payload: { list } })
    },
    *modify({ payload: { value, index } }, { call, put, select }) {
      const data = yield call(todoService.query, value)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      let obj = list[index]
      obj.title = value
      yield put({ type: 'save', payload: { list } })
    }
}
```

![](https://s.poetries.top/uploads/2022/07/b562e0491752f259.png)

> 在项目中最主要的会用到的是 `put` 与 `call`

**Subscription**

> * 以 `key/value` 格式定义 `subscription`，`subscription` 是订阅，用于订阅一个数据源，然后根据需要 dispatch 相应的 action
> * `subscription` 是订阅，用于订阅一个数据源，然后根据需要 `dispatch` 相应的`action`。在 `app.start()` 时被执行，数据源可以是当前的时间、当前页面的`url`、服务器的 `websocket` 连接、`history`路由变化等等。

* **注意**：如果要使用 `app.unmodel()`，`subscription` 必须返回 `unlisten` 方法，用于取消数据订阅

```js
// subscriptions 写法
subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由的变化，请求页面数据
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search)
        let list = []
        if (pathname === 'todoList') {
          dispatch({ type: 'save', payload: {list} })
        }
      })
    }
  }
```

#### 2.3.4 Router

> Router` 表示路由配置信息，项目中的 `router.js
js

```js
export default function({ history }){
  return(
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  );
}
```

**RouteComponent**

> `RouteComponent` 表示`Router` 里匹配路径的 `Component`，通常会绑定`model`的数据。如下:

```js
import { connect } from 'dva';

function App() {
  return <div>App</div>;
}

function mapStateToProps(state) {
  return { todos: state.todos };
}

export default connect(mapStateToProps)(App);
```

### 2.4 整体架构

![img](https://s.poetries.top/gitee/20191001/45.png)

* 首先我们根据 `url` 访问相关的 `Route-Component`，在组件中我们通过 `dispatch`发送 `action` 到 `model` 里面的 `effect` 或者直接 `Reducer`
* 当我们将`action`发送给`Effect`，基本上是取服务器上面请求数据的，服务器返回数据之后，`effect` 会发送相应的 `action`给 `reducer`，由唯一能改变 `state`的 `reducer` 改变 `state` ，然后通过`connect`重新渲染组件。
* 当我们将`action`发送给`reducer`，那直接由 `reducer` 改变 `state`，然后通过`connect`重新渲染组件

### 2.5 Dva图解

**图解一：加入Saga**

> React` 只负责页面渲染, 而不负责页面逻辑, 页面逻辑可以从中单独抽取出来, 变成 `store

![img](https://s.poetries.top/gitee/20191001/46.png)

> 使用 `Middleware` 拦截 `action`, 这样一来异步的网络操作也就很方便了, 做成一个 `Middleware`就行了, 这里使用`redux-saga` 这个类库

* 点击创建 `Todo`的按钮, 发起一个 `type == addTodo` 的 `action`
* `saga` 拦截这个 `action`, 发起 `http` 请求, 如果请求成功, 则继续向 `reducer` 发一个 `type == addTodoSucc` 的 `action`, 提示创建成功, 反之则发送 `type == addTodoFail` 的`action` 即可

**图解二：Dva表示法**

![img](https://s.poetries.top/gitee/20191001/47.png)

> dva做了 3 件很重要的事情

* 把 `store`及 `saga` 统一为一个 `model` 的概念, 写在一个 js 文件里面
* 增加了一个 `Subscriptions`, 用于收集其他来源的 `action`, eg: 键盘操作
* `model` 写法很简约, 类似于 `DSL` 或者 `RoR`

## 三、计数器例子

## 四、Dva实践

### 4.1 抽离Model

### 4.2 设计组件

### 4.3 添加Reducer

## 五、使用dva框架和直接使用redux写法的区别

### 5.1 使用 redux

### 5.2 使用dva

## 六、使用axios统一处理

### 6.1 示例代码

### 6.2 明确响应体

### 6.3 依赖包分析

### 6.4 axios 全局配置

### 6.5 加载 NProgress 过渡组件

### 6.6 网络请求成功处理

### 6.7 网络请求失败处理
