
## 拆解 React 生命周期：从 React 15 说起

> 在 React 15 中，大家需要关注以下几个生命周期方法：

```js
constructor()
componentWillReceiveProps()
shouldComponentUpdate()
componentWillMount()
componentWillUpdate()
componentDidUpdate()
componentDidMount()
render()
componentWillUnmount()
```

> 如果你接触 React 足够早，或许会记得还有 `getDefaultProps` 和 `getInitState` 这两个方法，它们都是 `React.createClass()` 模式下初始化数据的方法。由于这种写法在 ES6 普及后已经不常见，这里不再详细展开

这些生命周期方法是如何彼此串联、相互依存的呢？这里我为你总结了一张大图：

![](https://s.poetries.top/images/20210428192615.png)

接下来，我就围绕这张大图，分阶段讨论组件生命周期的运作规律。在学习的过程中，下面这个 Demo 可以帮助你具体地验证每个阶段的工作流程：

```js
import React from "react";
import ReactDOM from "react-dom";
// 定义子组件
class LifeCycle extends React.Component {
  constructor(props) {
    console.log("进入constructor");
    super(props);
    // state 可以在 constructor 里初始化
    this.state = { text: "子组件的文本" };
  }
  // 初始化渲染时调用
  componentWillMount() {
    console.log("componentWillMount方法执行");
  }
  // 初始化渲染时调用
  componentDidMount() {
    console.log("componentDidMount方法执行");
  }
  // 父组件修改组件的props时会调用
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps方法执行");
  }
  // 组件更新时调用
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate方法执行");
    return true;
  }

  // 组件更新时调用
  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate方法执行");
  }
  // 组件更新后调用
  componentDidUpdate(preProps, preState) {
    console.log("componentDidUpdate方法执行");
  }
  // 组件卸载时调用
  componentWillUnmount() {
    console.log("子组件的componentWillUnmount方法执行");
  }
  // 点击按钮，修改子组件文本内容的方法
  changeText = () => {
    this.setState({
      text: "修改后的子组件文本"
    });
  };
  render() {
    console.log("render方法执行");
    return (
      <div className="container">
        <button onClick={this.changeText} className="changeText">
          修改子组件文本内容
        </button>
        <p className="textContent">{this.state.text}</p>
        <p className="fatherContent">{this.props.text}</p>
      </div>
    );
  }
}
// 定义 LifeCycle 组件的父组件
class LifeCycleContainer extends React.Component {

  // state 也可以像这样用属性声明的形式初始化
  state = {
    text: "父组件的文本",
    hideChild: false
  };
  // 点击按钮，修改父组件文本的方法
  changeText = () => {
    this.setState({
      text: "修改后的父组件文本"
    });
  };
  // 点击按钮，隐藏（卸载）LifeCycle 组件的方法
  hideChild = () => {
    this.setState({
      hideChild: true
    });
  };
  render() {
    return (
      <div className="fatherContainer">
        <button onClick={this.changeText} className="changeText">
          修改父组件文本内容
        </button>
        <button onClick={this.hideChild} className="hideChild">
          隐藏子组件
        </button>
        {this.state.hideChild ? null : <LifeCycle text={this.state.text} />}
      </div>
    );
  }
}
ReactDOM.render(<LifeCycleContainer />, document.getElementById("root"));
```

该入口文件对应的 index.html 中预置了 id 为 root 的真实 DOM 节点作为根节点，body 标签内容如下：

```js
<body>
  <div id="root"></div>
</body>
```

这个 Demo 渲染到浏览器上大概是这样的：

![](https://s.poetries.top/images/20210428192712.png)

此处由于我们强调的是对生命周期执行规律的验证，所以样式上从简，你也可以根据自己的喜好添加 CSS 相关的内容。

接下来我们就结合这个 Demo 和开头的生命周期大图，一起来看看`挂载、更新、卸载这 3 个阶段`，React 组件都经历了哪些事情。

## Mounting 阶段：组件的初始化渲染（挂载）

挂载过程在组件的一生中仅会发生一次，在这个过程中，组件被初始化，然后会被渲染到真实 DOM 里，完成所谓的“首次渲染”。

> 在挂载阶段，一个 `React` 组件会按照顺序经历如下图所示的生命周期：

![](https://s.poetries.top/images/20210428192753.png)

> 首先我们来看 `constructor` 方法，该方法仅仅在挂载的时候被调用一次，我们可以在该方法中对 `this.state` 进行初始化

```js
constructor(props) {
  console.log("进入constructor");
  super(props);
  // state 可以在 constructor 里初始化
  this.state = { text: "子组件的文本" };
}
```

> `componentWillMount`、`componentDidMount` 方法同样只会在挂载阶段被调用一次。其中 `componentWillMount` 会在执行 `render` 方法前被触发

接下来 `render 方法被触发`。注意 `render 在执行过程中并不会去操作真实 DOM（也就是说不会渲染）`，它的职能是把需要渲染的内容返回出来。`真实 DOM 的渲染工作，在挂载阶段是由 ReactDOM.render 来承接的`

`componentDidMount 方法在渲染结束后被触发`，此时因为真实 DOM 已经挂载到了页面上，我们可以在这个生命周期里执行真实 DOM 相关的操作。此外，类似于异步请求、数据初始化这样的操作也大可以放在这个生命周期来做

这一整个流程对应的其实就是我们 Demo 页面刚刚打开时，组件完成初始化渲染的过程。下图是 Demo 中的 LifeCycle 组件在挂载过程中控制台的输出，你可以用它来验证挂载过程中生命周期顺序的正确性：

![](https://s.poetries.top/images/20210428193117.png)

## Updating 阶段：组件的更新

## Unmounting 阶段：组件的卸载
