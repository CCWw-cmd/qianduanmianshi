
## 从一道面试题说起

这是一道变体繁多的面试题，在 BAT 等一线大厂的面试中考察频率非常高。首先题目会给出一个这样的 App 组件，在它的内部会有如下代码所示的几个不同的 setState 操作：

```js
import React from "react";
import "./styles.css";
export default class App extends React.Component{
  state = {
    count: 0
  }
  increment = () => {
    console.log('increment setState前的count', this.state.count)
    this.setState({
      count: this.state.count + 1
    });
    console.log('increment setState后的count', this.state.count)
  }
  triple = () => {
    console.log('triple setState前的count', this.state.count)
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
    this.setState({
      count: this.state.count + 1
    });
    console.log('triple setState后的count', this.state.count)
  }
  reduce = () => {
    setTimeout(() => {
      console.log('reduce setState前的count', this.state.count)
      this.setState({
        count: this.state.count - 1
      });
      console.log('reduce setState后的count', this.state.count)
    },0);
  }
  render(){
    return <div>
      <button onClick={this.increment}>点我增加</button>
      <button onClick={this.triple}>点我增加三倍</button>
      <button onClick={this.reduce}>点我减少</button>
    </div>
  }
}
```

接着我把组件挂载到 DOM 上：

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
```

此时浏览器里渲染出来的是如下图所示的三个按钮：

![](https://s.poetries.top/images/20210501172748.png)

此时有个问题，若从左到右依次点击每个按钮，控制台的输出会是什么样的？读到这里，建议你先暂停 1 分钟在脑子里跑一下代码，看看和下图实际运行出来的结果是否有出入。

![](https://s.poetries.top/images/20210501172802.png)

如果你是一个熟手 React 开发，那么 `increment` 这个方法的输出结果想必难不倒你——正如许许多多的 React 入门教学所声称的那样，“setState 是一个异步的方法”，这意味着当我们执行完 `setState` 后，`state` 本身并不会立刻发生改变。 因此紧跟在 `setState` 后面输出的 `state` 值，仍然会维持在它的初始状态（0）。在同步代码执行完毕后的某个“神奇时刻”，`state` 才会“恰恰好”地增加到 1。

但这个“神奇时刻”到底何时发生，所谓的“恰恰好”又如何界定呢？如果你对这个问题搞不太清楚，那么 triple 方法的输出对你来说就会有一定的迷惑性——setState 一次不好使， setState 三次也没用，state 到底是在哪个环节发生了变化呢？

带着这样的困惑，你决定先抛开一切去看看 reduce 方法里是什么光景，结果更令人大跌眼镜，reduce 方法里的 setState 竟然是同步更新的！这......到底是我们初学 React 时拿到了错误的基础教程，还是电脑坏了？

要想理解眼前发生的这魔幻的一切，我们还得从 setState 的工作机制里去找线索。

## 异步的动机和原理——批量更新的艺术

我们首先要认知的一个问题：在 setState 调用之后，都发生了哪些事情？你可能会更倾向于站在生命周期的角度去思考这个问题，得出一个如下图所示的结论：

![](https://s.poetries.top/images/20210501173103.png)

从图上我们可以看出，一个完整的更新流程，涉及了包括 re-render（重渲染） 在内的多个步骤。re-render 本身涉及对 DOM 的操作，它会带来较大的性能开销。假如说“一次 setState 就触发一个完整的更新流程”这个结论成立，那么每一次 setState 的调用都会触发一次 re-render，我们的视图很可能没刷新几次就卡死了。这个过程如我们下面代码中的箭头流程图所示：

```js
this.setState({
  count: this.state.count + 1    ===>    shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate
});
this.setState({
  count: this.state.count + 1    ===>    shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate
});
this.setState({
  count: this.state.count + 1    ===>    shouldComponentUpdate->componentWillUpdate->render->componentDidUpdate
});
```

事实上，`这正是 setState 异步的一个重要的动机——避免频繁的 re-render`。

在实际的 React 运行时中，setState 异步的实现方式有点类似于 Vue 的 `$nextTick` 和浏览器里的 `Event-Loop`：`每来一个 setState，就把它塞进一个队列里“攒起来”`。等时机成熟，再把“攒起来”的 `state` 结果做合并，最后`只针对最新的 state 值走一次更新流程`。这个过程，叫作“`批量更新`”，批量更新的过程正如下面代码中的箭头流程图所示：

```js
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务，count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队, [count+1的任务，count+1的任务, count+1的任务]
});
                                          ↓
                                         合并 state，[count+1的任务]
                                          ↓
                                         执行 count+1的任务
```

> 值得注意的是，只要我们的同步代码还在执行，“攒起来”这个动作就不会停止。（注：这里之所以多次 `+1` 最终只有一次生效，是因为在同一个方法中多次 setState 的合并动作不是单纯地将更新累加。比如这里对于相同属性的设置，React 只会为其保留最后一次的更新）。因此就算我们在 React 中写了这样一个 100 次的 setState 循环：

```js
test = () => {
  console.log('循环100次 setState前的count', this.state.count)
  for(let i=0;i<100;i++) {
    this.setState({
      count: this.state.count + 1
    })
  }
  console.log('循环100次 setState后的count', this.state.count)
}

```

> 也只是会增加 state 任务入队的次数，并不会带来频繁的 re-render。当 100 次调用结束后，仅仅是 `state` 的任务队列内容发生了变化， `state` 本身并不会立刻改变：

![](https://s.poetries.top/images/20210501173710.png)

## “同步现象”背后的故事：从源码角度看 setState 工作流

## 解读 setState 工作流

## 理解 React 中的 Transaction（事务） 机制

## “同步现象”的本质

## 总结
