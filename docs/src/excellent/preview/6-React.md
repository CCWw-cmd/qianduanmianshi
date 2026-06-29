
## 0 如何理解React State不可变性的原则

在 React 中，不可变性是指数据一旦被创建，就不能被修改。React 推崇使用不可变数据的原则，这意味着在更新数据时，应该创建新的数据对象而不是直接修改现有的数据。

**以下是理解 React 中不可变性原则的几个关键点：**

1. **数据一旦创建就不能被修改**：在 React 中，组件的状态（state）和属性（props）应该被视为不可变的。一旦创建了状态或属性对象，就不应该直接修改它们的值。这样可以确保组件的数据在更新时是不可变的，从而避免意外的数据改变和副作用。
2. **创建新的数据对象**：当需要更新状态或属性时，应该创建新的数据对象。这可以通过使用对象展开运算符、数组的 `concat()`、`slice()` 等方法，或者使用不可变数据库（如 `Immutable.js`、`Immer` 等）来创建新的数据副本。
3. **比较数据变化**：React 使用 `Virtual DOM` 来比较前后两个状态树的差异，并仅更新需要更新的部分。通过使用不可变数据，React 可以更高效地进行比较，因为它可以简单地比较对象引用是否相等，而不必逐个比较对象的属性。
4. **性能优化**：使用不可变数据可以带来性能上的优势。由于 React 可以更轻松地比较前后状态的差异，可以减少不必要的重新渲染和组件更新，提高应用的性能和响应性。

**不可变性的原则在 React 中有以下好处：**

* **简化数据变更追踪**：由于数据不可变，可以更轻松地追踪数据的变化。这样可以更好地理解代码的行为和数据的流动。
* **避免副作用**：可变数据容易引发副作用和难以追踪的 bug。通过使用不可变数据，可以避免许多与副作用相关的问题。
* **方便的历史记录和回滚**：不可变数据使得记录和回滚应用状态的历史变得更容易。可以在不改变原始数据的情况下，创建和保存不同时间点的数据快照。

## 1 JSX本质

* `React.createElement` 即`h`函数，返回`vnode`
  * **createElement 与 cloneElement 的区别是什么**
    * `createElement`函数是`JSX`编译之后使用的创建`React Element`的函数
    * 而`cloneElement`则是用于复制某个元素并传入新的`Props`
* 第一个参数，可能是组件，也可能是`html tag`
* 组件名，首字母必须是大写（`React`规定）

```js
React.createElement(
  type,
  [props],
  [...children]
)
// - 第一个参数是必填，传入的是似HTML标签名称，eg: ul, li
// - 第二个参数是选填，表示的是属性，eg: className
// - 第三个参数是选填, 子节点，eg: 要显示的文本内容
```

```js
// React.createElement写法
React.createElement('tag', null, [child1,child2])
React.createElement('tag', props, child1,child2,child3)
React.createElement(Comp, props, child1,child2,'文本节点')
```

```js
// jsx基本用法
<div className="container">
  <p>tet</p>
  <img src={imgSrc} />
</div>

// 编译后 https://babeljs.io/repl
React.createElement(
  "div",
  {
    className: "container"
  },
  React.createElement("p", null, "tet"),
  React.createElement("img", {
    src: imgSrc
  })
);
```

```js
// jsx style
const styleData = {fontSize:'20px',color:'#f00'}
const styleElem = <p style={styleData}>设置style</p>

// 编译后
const styleData = {
  fontSize: "20px",
  color: "#f00"
};
const styleElem = React.createElement(
  "p",
  {
    style: styleData
  },
  "\u8BBE\u7F6Estyle"
);
```

```js
// jsx加载组件
const app = <div>
    <Input submitTitle={onSubmitTitle} />
    <List list={list} />
</div>

// 编译后
const app = React.createElement(
  "div",
  null,
  React.createElement(Input, {
    submitTitle: onSubmitTitle
  }),
  React.createElement(List, {
    list: list
  })
);
```

```js
// jsx事件
const eventList = <p onClick={this.clickHandler}>text</p>

// 编译后
const eventList = React.createElement(
  "p",
  {
    onClick: (void 0).clickHandler
  },
  "text"
);
```

```js
// jsx列表
const listElem = <ul>
{
  this.state.list.map((item,index)=>{
    return <li key={index}>index:{index},title:{item.title}</li>
  })
 }
</ul>

// 编译后

const listElem = React.createElement(
  "ul",
  null,
  (void 0).state.list.map((item, index) => {
    return React.createElement(
      "li",
      {
        key: index
      },
      "index:",
      index,
      ",title:",
      item.title
    );
  })
);
```

## 2 React合成事件机制

## 3 setState和batchUpdate机制

### setState主流程

### batchUpdate机制

### transaction事务机制

### 传入 setState 函数的第二个参数的作用是什么

### 调用 setState 之后发生了什么

### setState总结

## 4 组件渲染和更新过程

## 5 Diff算法相关

### 为什么虚拟dom会提高性能

### react 的渲染过程中，兄弟节点之间是怎么处理的？也就是key值不一样的时候

### diff算法

### Diff 的瓶颈以及 React 的应对

### React 中 key 的作用是什么

### 关于Fiber

## 6 受控组件与非受控组件

### 受控组件

### 非受控组件

## 7 组件生命周期

### react旧版生命周期函数

### 新版生命周期

### 为什么有些react生命周期钩子被标记为UNSAFE

### 在生命周期中的哪一步你应该发起 AJAX 请求

## 8 Portal传送门

## 9 Context

## 10 异步组件

## 11 性能优化

### 使用shouldComponentUpdate优化

### PureComponent和React.memo

### 优化性能的方式小结

### React实现的移动应用中，如果出现卡顿，有哪些可以考虑的优化方案

## 12 高阶组件和Render Props

### 高阶组件

### render props

### 拓展：vue中实现高阶组件

## 13 React Hooks相关

### React Hooks带来了那些便利

### class组件存在哪些问题

### 用useState实现state和setState功能

### 用useEffect模拟组件生命周期

### 用useEffect模拟WillUnMount时的注意事项

### useRef和useContext

### useReducer能代替redux吗

### 使用useMemo做性能优化

### 使用useCallback做性能优化

### 什么是自定义Hook

### 使用Hooks的两条重要规则

### 为何Hooks要依赖于调用顺序

### class组件逻辑复用有哪些问题

### Hooks组件逻辑复用有哪些好处

### Hooks使用中的几个注意事项

## 14 Redux相关

### 简述flux 思想

### redux中间件

### redux有什么缺点

### Redux设计理念

### Redux怎么实现dispstch一个函数

### connect高级组件原理

### Dva工作原理

## 15 React中Ref几种创建方式

### 三种使用 Ref 的方式

### 使用Ref获取组件实例

### 函数组件传递forwardRef

### useImperativeHandle

## 16 为什么 React 元素有一个 $$typeof 属性

## 17 React 如何区分 Class组件 和 Function组件

## 18 react组件的划分业务组件技术组件

## 19 React如何进行组件/逻辑复用?

## 20 说说你用react有什么坑点

## 21 react和vue的区别

## 22 对React实现原理的理解

### 前言介绍

### vdom

### dsl 的编译

### 渲染 vdom

### 组件

### 状态管理

### react 架构的演变

### fiber 架构

## 23 React18新增了哪些特性

### 前言

### 新特性一览

### Render API

### setState合并更新

### flushSync

### 改进Suspense

### 支持Concurrent模式

### 组件返回undefined不再报错

### startTransition

### useDeferredValue

## 24 React19新增了哪些特性

### 文档元数据和样式表支持

### Server Components与服务器端渲染

### Hooks相关

### 预加载资源

### ref

### Context
