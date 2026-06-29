
* 使用 `shouldComponentUpdate` 规避冗余的更新逻辑
* `PureComponent + Immutable.js`
* `React.memo` 与 `useMemo`

> 注：这 3 个思路同时也是 React 面试中“性能优化”这一环的核心所在

## 善用 shouldComponentUpdate

`shouldComponentUpdate` 的调用形式如下：

```js
shouldComponentUpdate(nextProps, nextState)
```

> * `render` 方法由于伴随着对虚拟 `DOM` 的构建和对比，过程可以说相当耗时。而在 `React` 当中，很多时候我们会不经意间就频繁地调用了 `render`。为了避免不必要的 `render` 操作带来的性能开销，React 提供了 `shouldComponentUpdate` 这个口子。React 组件会根据 `shouldComponentUpdate` 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行 `re-render`（重渲染）。
> * `shouldComponentUpdate` 的默认值为 `true`，也就是说 “无条件 re-render”。在实际的开发中，我们往往通过手动往 `shouldComponentUpdate` 中填充判定逻辑，来实现“有条件的 re-render”。

首先我们来看两个子组件的代码，这里为了尽量简化与数据变更无关的逻辑，ChildA 和 ChildB 都只负责从父组件处读取数据并渲染，它们的编码分别如下所示。

```js
// ChildA.js：

import React from "react";
export default class ChildA extends React.Component {
  render() {
    console.log("ChildA 的render方法执行了");
    return (
      <div className="childA">
        子组件A的内容：
        {this.props.text}
      </div>
    );
  }
}
```

```js
// ChildB.js：

import React from "react";
export default class ChildB extends React.Component {
  render() {
    console.log("ChildB 的render方法执行了");
    return (
      <div className="childB">
        子组件B的内容：
        {this.props.text}
      </div>
    );
  }
}
```

```js
// 在共同的父组件 App.js 中，会将 ChildA 和 ChildB 组合起来，并分别向其中注入数据：

import React from "react";
import ChildA from './ChildA'
import ChildB from './ChildB'
class App extends React.Component {
  state = {
    textA: '我是A的文本',
    textB: '我是B的文本'
  }
  changeA = () => {
    this.setState({
      textA: 'A的文本被修改了'
    })
  }
  changeB = () => {
    this.setState({
      textB: 'B的文本被修改了'
    })
  }
  render() {
    return (
    <div className="App">
      <div className="container">
        <button onClick={this.changeA}>点击修改A处的文本</button>
        <button onClick={this.changeB}>点击修改B处的文本</button>
        <ul>
          <li>
            <ChildA text={this.state.textA}/>
          </li>
        <li>
          <ChildB text={this.state.textB}/>
        </li>
        </ul>
      </div>
    </div>
  );
  }
}
export default App;
```

App 组件最终渲染到界面上的效果如下图所示，两个子组件在图中分别被不同颜色的标注圈出：

![](https://s.poetries.top/images/20210428213034.png)

通过点击左右两个按钮，我们可以分别对 ChildA 和 ChildB 中的文案进行修改。

由于初次渲染时，两个组件的 render 函数都必然会被触发，因此控制台在挂载完成后的输出内容如下图所示：

![](https://s.poetries.top/images/20210428213053.png)

接下来我点击左侧的按钮，尝试对 A 处的文本进行修改。我们可以看到界面上只有 A 处的渲染效果发生了改变，如下图箭头处所示：

![](https://s.poetries.top/images/20210428213110.png)

但是如果我们打开控制台，会发现输出的内容如下图所示：

![](https://s.poetries.top/images/20210428213135.png)

这样的输出结果告诉我们，在刚刚的点击动作后，不仅 ChildA 的 re-render 被触发了，ChildB 的 re-render 也被触发了。

> 在 React 中，`只要父组件发生了更新，那么所有的子组件都会被无条件更新`。这就导致了 ChildB 的 props 尽管没有发生任何变化，它本身也没有任何需要被更新的点，却还是会走一遍更新流程。

**注：** `同样的情况也适用于组件自身的更新：当组件自身调用了 setState 后，那么不管 setState 前后的状态内容是否真正发生了变化，它都会去走一遍更新流程`。

而在刚刚这个更新流程中，`shouldComponentUpdate` 函数没有被手动定义，因此它将返回“true”这个默认值。“true”则意味着对更新流程不作任何制止，也即所谓的“无条件 re-render”。在这种情况下，我们就可以考虑使用 `shouldComponentUpdate` 来对更新过程进行管控，避免没有意义的 re-render 发生。

现在我们就可以为 ChildB 加装这样一段 `shouldComponentUpdate` 逻辑：

```js
shouldComponentUpdate(nextProps, nextState) {
  // 判断 text 属性在父组件更新前后有没有发生变化，若没有发生变化，则返回 false
  if(nextProps.text === this.props.text) {
    return false
  }
  // 只有在 text 属性值确实发生变化时，才允许更新进行下去
  return true
}
```

在这段逻辑中，我们对 ChildB 中的可变数据，也就是 this.props.text 这个属性进行了判断。

这样，当父组件 App 组件发生更新、进而试图触发 ChildB 的更新流程时，shouldComponentUpdate 就会充当一个“守门员”的角色：它会检查新下发的 `props.text` 是否和之前的值一致，如果一致，那么就没有更新的必要，直接返回“false”将整个 ChildB 的更新生命周期中断掉即可。只有当 props.text 确实发生变化时，它才会“准许” re-render 的发生。

在 `shouldComponentUpdate` 的加持下，当我们再次点击左侧按钮，试图修改 ChildA 的渲染内容时，控制台的输出就会变成下图这样：

![](https://s.poetries.top/images/20210428213705.png)

我们看到，控制台中现在只有 ChildA 的 re-render 提示。ChildB “稳如泰山”，成功躲开了一次多余的渲染。

使用 `shouldComponentUpdate` 来调停不必要的更新，避免无意义的 re-render 发生，这是 React 组件中最基本的性能优化手段，也是最重要的手段。许多看似高级的玩法，都是基于 `shouldComponentUpdate` 衍生出来的。我们接下来要讲的 `PureComponent`，就是这类玩法中的典型。

## 进阶玩法：PureComponent  + Immutable.js

**PureComponent：提前帮你安排好更新判定逻辑**

> `shouldComponentUpdate` 虽然一定程度上帮我们解决了性能方面的问题，但每次避免 re-render，都要手动实现一次 `shouldComponentUpdate`，未免太累了。作为一个不喜欢重复劳动的前端开发者来说，在写了不计其数个 `shouldComponentUpdate` 逻辑之后，难免会怀疑人生

`React 15.3` 很明显听到了开发者的声音，它新增了一个叫 `PureComponent` 的类，恰到好处地解决了“程序员写 `shouldComponentUpdate` 写出腱鞘炎”这个问题。

> `PureComponent 与 Component 的区别点`，就在于它内置了对 `shouldComponentUpdate` 的实现：`PureComponent` 将会在 `shouldComponentUpdate` 中对组件更新前后的 `props 和 state 进行浅比较`，并根据浅比较的结果，决定是否需要继续更新流程。

```js
import React from "react";
export default class ChildB extends React.PureComponent {
  render() {
    console.log("ChildB 的render方法执行了");
    return (
      <div className="childB">
        子组件B的内容：
        {this.props.text}
      </div>
    );
  }
}
```

此时再去修改 ChildA 中的文本，我们会发现 ChildB 同样不受影响

> 在值类型数据这种场景下，`PureComponent` 可以说是战无不胜。但是如果数据类型为引用类型，那么这种基于浅比较的判断逻辑就会带来这样两个风险：

* 若数据内容没变，但是引用变了，那么浅比较仍然会认为“数据发生了变化”，进而触发一次不必要的更新，导致过度渲染；
* 若数据内容变了，但是引用没变，那么浅比较则会认为“数据没有发生变化”，进而阻断一次更新，导致不渲染。

怎么办呢？`Immutable.js` 来帮忙！

**Immutable：“不可变值”让“变化”无处遁形**

> `PureComponent 浅比较带来的问题，本质上是对“变化”的判断不够精准导致的`。那有没有一种办法，能够让引用的变化和内容的变化之间，建立一种必然的联系呢？

这就是 `Immutable.js` 所做的事情。

Immutable 直译过来是“不可变的”，顾名思义，Immutable.js 是对“不可变值”这一思想的贯彻实践。它在 2014 年被 Facebook 团队推出，Facebook 给它的定位是“实现持久性数据结构的库”。所谓“持久性数据”，指的是这个数据只要被创建出来了，就不能被更改。我们对当前数据的任何修改动作，都会导致一个新的对象的返回。这就将数据内容的变化和数据的引用严格地关联了起来，使得“变化”无处遁形。

这里我用一个简单的例子，来演示一下 Immutable.js 的效果。请看下面代码：

```js
// 引入 immutable 库里的 Map 对象，它用于创建对象
import { Map } from 'immutable'
// 初始化一个对象 baseMap
const baseMap = Map({
  name: 'po',
  career: 'fe',
  age: 99
})
// 使用 immutable 暴露的 Api 来修改 baseMap 的内容
const changedMap = baseMap.set({
  age: 100
})
// 我们会发现修改 baseMap 后将会返回一个新的对象，这个对象的引用和 baseMap 是不同的
console.log('baseMap === changedMap', baseMap === changedMap)
```

由此可见，`PureComonent 和 Immutable.js` 真是一对好基友！在实际的开发中，我们也确实经常左手 PureComonent，右手 Immutable.js，研发质量大大地提升呀！

> 值得注意的是，由于 `Immutable.js` 存在一定的学习成本，并不是所有场景下都可以作为最优解被团队采纳。因此，一些团队也会基于 `PureComonent` 和 `Immutable.js` 去打造将两者结合的公共类，通过改写 setState 来提升研发体验，这也是不错的思路。

## 函数组件的性能优化：React.memo 和 useMemo
