
## 进化的生命周期方法：React 16 生命周期工作流详解

> 来源于：[https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram (opens new window)](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram)

![](https://s.poetries.top/images/20210428184607.png)

> 在React 16.4之后，React 生命周期在之前版本的基础上又经历了一次微调，其实就调在了更新过程的`getDerivedStateFromProps` 这个生命周期上

![](https://s.poetries.top/images/20210428184635.png)

这里我先提供一个 Demo，它将辅助你理解新的生命周期。Demo 代码如下

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
  // 初始化/更新时调用
  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps方法执行");
    return {
      fatherText: props.text
    }
  }
  // 初始化渲染时调用
  componentDidMount() {
    console.log("componentDidMount方法执行");
  }
  // 组件更新时调用
  shouldComponentUpdate(prevProps, nextState) {
    console.log("shouldComponentUpdate方法执行");
    return true;
  }

  // 组件更新时调用
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate方法执行");
    return "haha";
  }
  // 组件更新后调用
  componentDidUpdate(preProps, preState, valueFromSnapshot) {
    console.log("componentDidUpdate方法执行");
    console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
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

React 16 以来的生命周期也可以按照“挂载”“更新”和“卸载”三个阶段来看，所以接下来我们要做的事情仍然是分阶段拆解工作流程。

## `Mounting 阶段`：组件的初始化渲染（挂载）

为了凸显 16 和 15 两个版本生命周期之间的差异，我将两个流程绘制到了同一张大图里，请看下面这张图：

![](https://s.poetries.top/images/20210428172751.png)

运行示例代码

![](https://s.poetries.top/images/20210428172830.png)

**消失的 componentWillMount，新增的 getDerivedStateFromProps**

从上图中不难看出，`React 15` 生命周期和 `React 16.3` 生命周期在**挂载阶段的主要差异在于**，`废弃了 componentWillMount，新增了 getDerivedStateFromProps`

> 注：细心的你可能记得，`React 16 对 render 方法也进行了一些改进`。React 16 之前，`render方法必须返回单个元素`，而 React 16 `允许我们返回元素数组和字符串`

**getDerivedStateFromProps 不是 componentWillMount 的替代品**

> 事实上，`componentWillMount` 的存在不仅“鸡肋”而且危险，因此它并不值得被“代替”，它就应该被废弃

* 而 `getDerivedStateFromProps` 这个 API，其设计的初衷不是试图替换掉 `componentWillMount`，而是试图替换`componentWillReceiveProps`，因此它有且仅有一个用途：`使用 props 来派生/更新 state`
* React 团队为了确保 `getDerivedStateFromProps` 这个生命周期的纯洁性，直接从命名层面约束了它的用途（`getDerivedStateFromProps` 直译过来就是“`从 Props 里派生 State`”）。所以，如果你不是出于这个目的来使用 `getDerivedStateFromProps`，原则上来说都是不符合规范的

> 值得一提的是，`getDerivedStateFromProps` 在`更新和挂载两个阶段`都会“出镜”（这点不同于仅在更新阶段出现的 `componentWillReceiveProps`）。这是因为“派生 state”这种诉求不仅在 `props` 更新时存在，在 `props` 初始化的时候也是存在的

**认识 getDerivedStateFromProps**

这个新生命周期方法的调用规则如下：`static getDerivedStateFromProps(props, state)`

在使用层面，你需要把握三个重点。

**第一个重点是最特别的一点**：`getDerivedStateFromProps` 是一个静态方法。静态方法不依赖组件实例而存在，因此你在这个方法内部是访问不到 `this` 的。若你偏要尝试这样做，必定报错，报错形式如下图所示：

![](https://s.poetries.top/images/20210428183642.png)

**第二个重点，该方法可以接收两个参数：props 和 state**，它们分别代表当前组件接收到的来自父组件的 `props` 和当前组件自身的 `state`。我们可以尝试在 Demo 中输出这两个参数看一看，输出效果如下图所示：

![](https://s.poetries.top/images/20210428183744.png)

可以看出，挂载阶段输出的 `props` 正是初始化阶段父组件传进来的 `this.props` 对象；而 `state` 是 `LifeCycle` 组件自身的 `state` 对象

**第三个重点，getDerivedStateFromProps 需要一个对象格式的返回值**。如果你没有指定这个返回值，那么大概率会被 React 警告一番，警告内容如下图所示：

![](https://s.poetries.top/images/20210428183909.png)

> `getDerivedStateFromProps` 的返回值之所以不可或缺，是因为 React 需要用这个返回值来更新（派生）组件的 `state`。因此当你确实不存在“使用 `props 派生 state` ”这个需求的时候，最好是直接省略掉这个生命周期方法的编写，否则一定记得给它 `return` 一个 `null`

注意，`getDerivedStateFromProps` 方法对 `state` 的更新动作并非“覆盖”式的更新，而是针对某个属性的定向更新。比如这里我们在 `getDerivedStateFromProps` 里返回的是这样一个对象，对象里面有一个 `fatherText` 属性用于表示“父组件赋予的文本”：

```js
{
  fatherText: props.text
}
```

该对象并不会替换掉组件原始的这个 `state`：

```js
this.state = { text: "子组件的文本" };
```

> 而是仅仅针对 `fatherText` 这个属性作更新（这里原有的 `state` 里没有 `fatherText`，因此直接新增）。更新后，原有属性与新属性是共存的，如下图所示

![](https://s.poetries.top/images/20210428184212.png)

## Updating 阶段：组件的更新

## Unmounting 阶段：组件的卸载

## 透过现象看本质：React 16 缘何两次求变

### Fiber 架构简析

### 换个角度看生命周期工作流

### 细说生命周期“废旧立新”背后的思考
