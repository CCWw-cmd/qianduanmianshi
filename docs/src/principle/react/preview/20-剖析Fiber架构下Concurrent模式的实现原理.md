
通过对整个 ReactDOM.render 所触发的渲染链路进行了分析和串联，我们已经把 Fiber 架构在实现层面的大部分要点都过了一遍。刚讲过的这部分知识，一方面相对来说复杂度比较高，需要一些耐心反复地理解和消化；另一方面，本讲接下来要讲解的内容，也和它存在着较强的依赖关系，因此对这些前置知识的把握就显得尤为重要。

下面我说几个函数，帮你检验一下自己的学习效果：

* `performSyncWorkOnRoot`
* `workLoopSync`
* `performUnitOfWork`
* `beginWork`
* `completeWork`
* `completeUnitOfWork`
* `reconcileChildFibers`

本讲我将带你去认识 Fiber 架构最迷人的那一面——`Concurrent 模式`（异步渲染）下的“时间切片”和“优先级”实现。

## current 树 与 workInProgress 树：“双缓冲”模式在 Fiber 架构下的实现

### 什么是“双缓冲”模式

“双缓冲”模式其实是一种在游戏领域由来已久的经典设计模式。为了帮助你快速理解它，这里我先举一个生活中的例子：假如你去看一场总时长只有 1 个小时的话剧，这场话剧中场不休息，需要不间断地演出。

按照剧情的需求，半个小时处需要一次转场。所谓转场，就是说话剧舞台的灯光、布景、氛围等全部要切换到另一种风格里去。在不中断演出的情况下，想要实现转场，怎么办呢？场务工作做得再快，也要十几二十分钟，这对一场时长 1 小时的话剧来说，实在太漫长了。观众也无法接受这样的剧情“卡顿”体验。

有一种解法，那就是准备两个舞台来做这场戏，当第一个舞台处于使用中时，第二个舞台的布局已经完成。这样当第一个舞台的表演结束时，只需要把第一个舞台的灯光灭掉，第二个舞台的灯光亮起，就可以做到剧情的无缝衔接了。

事实上，在真实的话剧中，我们也确实常常看到这样的画面——演员从舞台的左侧走到了右侧，灯光一切换，就从卧室（左侧舞台）走到了公园（右侧舞台）；又从公园（右侧舞台）走到了办公室（左侧舞台）。左侧舞台的布景从卧室变成了办公室，这个过程正是在演员利用右侧舞台表演时完成的。

在这个过程中，我们可以认为，左侧舞台和右侧舞台分别是两套缓冲数据，而呈现在观众眼前的连贯画面，就是不同的缓冲数据交替被读取后的结果。

在计算机图形领域，通过让图形硬件交替读取两套缓冲数据，可以实现画面的无缝切换，减少视觉效果上的抖动甚至卡顿。而在 React 中，双缓冲模式的主要利好，则是`能够帮我们较大限度地实现 Fiber 节点的复用，从而减少性能方面的开销`。

### current 树与 workInProgress 树之间是如何“相互利用”的

在 React 中，current 树与 workInProgress 树，两棵树可以对标“双缓冲”模式下的两套缓冲数据：当 current 树呈现在用户眼前时，所有的更新都会由 workInProgress 树来承接。workInProgress 树将会在用户看不到的地方（内存里）悄悄地完成所有改变，直到“灯光”打到它身上，也就是 current 指针指向它的时候，此时就意味着 commit 阶段已经执行完毕，workInProgress 树变成了那棵呈现在界面上的 current 树。

接下来我将用一个 Demo，带你切身感受一把 workInProgress 树和 current 树“相互利用”的过程。代码如下：

```js
import { useState } from 'react';
function App() {
  const [state, setState] = useState(0)
  return (
    <div className="App">
      <div onClick={() => { setState(state + 1) }} className="container">
        <p style={{ width: 128, textAlign: 'center' }}>
          {state}
        </p>
      </div>
    </div>
  );
}

export default App;
```

这个组件挂载后呈现出的界面很简单，就是一个数字 0，如下图所示：

![](https://s.poetries.top/images/20210502092851.png)

### 挂载后的 Fiber  树

关于 Fiber 树的构建过程，前面已经详细讲解过，这里不再重复。下面我直接为你展示挂载时的 render 阶段结束后，commit 执行前，两棵 Fiber 树的形态，如下图所示：

![](https://s.poetries.top/images/20210502092910.png)

待 commit 阶段完成后，右侧的 workInProgress 树对应的 DOM 树就被真正渲染到了页面上，此时 current 指针会指向 workInProgress 树：

![](https://s.poetries.top/images/20210502092926.png)

由于挂载是一个从无到有的过程，在这个过程中我们是在不断地创建新节点，因此还谈不上什么“节点复用”。节点复用要到更新过程中去看。

**第一次更新**

现在我点击数字 0，触发一次更新。这次更新中，下图高亮的 rootFiber 节点就会被复用：

![](https://s.poetries.top/images/20210502092947.png)

这段复用的逻辑在 beginWork 调用链路中的 createWorkInProgress 方法里。这里我为你截取了 createWorkInProgress 方法里面一段非常关键的逻辑，请看下图：

![](https://s.poetries.top/images/20210502093001.png)

在 createWorkInProgress 方法中，会先取当前节点的 alternate 属性，将其记为 workInProgress 节点。对于 rootFiber 节点来说，它的 alternate 属性，其实就是上一棵 current 树的 rootFiber，如下图高亮部分所示：

![](https://s.poetries.top/images/20210502093019.png)

当检查到上一棵 current 树的 rootFiber 存在时，React 会直接复用这个节点，让它作为下一棵 workInProgress 的节点存在下去，也就是说会走进 createWorkInProgress 的 else 逻辑里去。如果它和目标的 workInProgress 节点之间存在差异，直接在该节点上修改属性、使其与目标节点一致即可，而不必再创建新的 Fiber 节点。

至于剩下的 App、div、p 等节点，由于没有对应的 alternate 节点存在，因此它们的 createWorkInProgress 调用会走进下图高亮处的逻辑中：

![](https://s.poetries.top/images/20210502093033.png)

在这段逻辑里，将调用 createFiber 来新建一个 FiberNode。

第一次更新结束后，我们会得到一棵新的 workInProgress Fiber 树，current 指针最后将会指向这棵新的 workInProgress Fiber 树，如下图所示：

![](https://s.poetries.top/images/20210502093050.png)

**第二次更新**

接下来我们再次点击数字 1，触发 state 的第二次更新。

在这次更新中，current 树中的每一个 alternate 属性都不为空（如上图所示）。因此每次通过 beginWork 触发 createWorkInProgress 调用时，都会一致地走入 else 里面的逻辑，也就是直接复用现成的节点。

以上便是 current 树和 work 树相互“打配合”，实现节点复用的过程。

### 更新链路要素拆解

在上一讲，我们已经学习了挂载阶段的渲染链路。同步模式下的更新链路与挂载链路的 render 阶段基本是一致的，都是通过 performSyncWorkOnRoot 来触发包括 beginWork、completeWork 在内的深度优先搜索过程。这里我为你展示一个更新过程的调用栈，请看下图：

![](https://s.poetries.top/images/20210502093120.png)

你会发现还是熟悉的配方，还是原来的味道。其实，挂载可以理解为一种特殊的更新，ReactDOM.render 和 setState 一样，也是一种触发更新的姿势。在 React 中，ReactDOM.render、setState、useState 等方法都是可以触发更新的，这些方法发起的调用链路很相似，是因为它们最后“殊途同归”，都会通过创建 update 对象来进入同一套更新工作流。

## update 的创建

接下来我继续以开篇的 Demo 为例，为你拆解更新链路中的要素。在点击数字后，点击相关的回调被执行，它首先触发的是 dispatchAction 这个方法，如下图所示：

![](https://s.poetries.top/images/20210502093141.png)

请你关注图中两处标红的函数调用，你会看到 dispatchAction 方法在 performSyncWorkOnRoot 的左边。也就是说整体的更新链路应该是这样的：

![](https://s.poetries.top/images/20210502093156.png)

`dispatchAction` 中，会完成 update 对象的创建，如下图标红处所示：

![](https://s.poetries.top/images/20210502093208.png)

### 从 update 对象到 scheduleUpdateOnFiber

等等，这段逻辑你是否觉得似曾相识？如果你对 ReactDOM.render 系列的第一课时还有印象的话，我希望你能回忆起 updateContainer 这个方法。在 updateContainer 中，React 曾经有过性质一模一样的行为，这里我为你截取了 updateContainer 函数中的相关逻辑：

![](https://s.poetries.top/images/20210502093233.png)

图中这一段代码的逻辑是非常清晰的，以 enqueueUpdate 为界，它一共做了以下三件事。

* enqueueUpdate 之前：创建 update。
* enqueueUpdate 调用：将 update 入队。这里简单说下，每一个 Fiber 节点都会有一个属于它自己的 updateQueue，用于存储多个更新，这个 updateQueue 是以链表的形式存在的。在 render 阶段，updateQueue 的内容会成为 render 阶段计算 Fiber 节点的新 state 的依据。
* scheduleUpdateOnFiber：调度 update。如果你对之前学过的知识还有印象，会记得同步挂载链路中，这个方法后面紧跟的就是 performSyncWorkOnRoot 所触发的 render 阶段，如下图所示：

![](https://s.poetries.top/images/20210502093304.png)

现在我们再回过头来看 dispatchAction 的逻辑，你会发现 dispatchAction 里面同样有对这三个动作的处理。上面我对 dispatchAction 的局部截图，包含了对 update 对象的创建和入队处理。dispatchAction 的更新调度动作，在函数的末尾，如下图所示：

![](https://s.poetries.top/images/20210502093315.png)

这里有一个点需要提示一下：dispatchAction 中，调度的是当前触发更新的节点，这一点和挂载过程需要区分开来。在挂载过程中，updateContainer 会直接调度根节点。其实，对于更新这种场景来说，大部分的更新动作确实都不是由根节点触发的，而 render 阶段的起点则是根节点。因此在 scheduleUpdateOnFiber 中，有这样一个方法，见下图标红处：

![](https://s.poetries.top/images/20210502093328.png)

markUpdateLaneFromFiberToRoot 将会从当前 Fiber 节点开始，向上遍历直至根节点，并将根节点返回。

### scheduleUpdateOnFiber 如何区分同步还是异步？

如果你对之前学过的同步渲染链路分析还有印象，相信你对下面这段逻辑不会陌生：

![](https://s.poetries.top/images/20210502093359.png)

这是 scheduleUpdateOnFiber 中的一段逻辑。在同步的渲染链路中，lane === SyncLane 这个条件是成立的，因此会直接进入 performSyncWorkOnRoot 的逻辑，开启同步的 render 流程；而在异步渲染模式下，则将进入 else 的逻辑。

在 else 中，需要引起你注意的是 ensureRootIsScheduled 这个方法，该方法很关键，它将决定如何开启当前更新所对应的 render 阶段。在 ensureRootIsScheduled 中，有这样一段核心逻辑（解析在注释里）：

```js
if (newCallbackPriority === SyncLanePriority) {
    // 同步更新的 render 入口
    newCallbackNode = scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
  } else {
    // 将当前任务的 lane 优先级转换为 scheduler 可理解的优先级
    var schedulerPriorityLevel = lanePriorityToSchedulerPriority(newCallbackPriority);
    // 异步更新的 render 入口
    newCallbackNode = scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
  }
```

请你关注performSyncWorkOnRoot 和 performConcurrentWorkOnRoot 这两个方法：前者是同步更新模式下的 render 阶段入口；而后者是异步模式下的 render 阶段入口。

从这段逻辑中我们可以看出，React 会以当前更新任务的优先级类型为依据，决定接下来是调度 performSyncWorkOnRoot 还是 performConcurrentWorkOnRoot。这里调度任务用到的函数分别是 scheduleSyncCallback 和 scheduleCallback，这两个函数在内部都是通过调用 unstable\_scheduleCallback 方法来执行任务调度的。而 unstable\_scheduleCallback 正是 Scheduler（调度器）中导出的一个核心方法，也是本讲的一个重点。

在解读 unstable\_scheduleCallback 的工作原理之前，我们先来一起认识一下 Scheduler。

## Scheduler——“时间切片”与“优先级”的幕后推手

### 结合 React 调用栈，理解时间切片现象

### 时间切片是如何实现的？

### 优先级调度是如何实现的

## 总结
