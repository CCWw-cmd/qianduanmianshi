
> 在上一章中我们讲解并实现了渲染器的挂载逻辑，本质上就是将各种类型的 `VNode` 渲染成真实DOM的过程。渲染器除了将全新的 `VNode` 挂载成真实DOM之外，它的另外一个职责是负责对新旧 `VNode` 进行比对，并以合适的方式更新DOM，也就是我们常说的 `patch`。本章内容除了让你了解基本的比对逻辑之外，还讲述了在新旧 `VNode` 比对的过程中应该遵守怎样的原则，让我们开始吧！

## 基本原则

通常重渲染(`re-render`)是由组件的更新开始的，因为在框架的使用层面开发者通过变更数据状态从而引起框架内部对UI的自动更新，但是组件的更新本质上还是对真实DOM的更新，或者说是对标签元素的更新，所以我们就优先来看一下如何更新一个标签元素。

我们首先回顾一下渲染器的代码，如下：

```js
function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}
```

如上高亮的两句代码所示，当使用 `render` 渲染器渲染一个全新的 `VNode` 时，会调用 `mount` 函数挂载该 `VNode`，同时让容器元素存储对该 `VNode` 对象的引用，这样当再次调用渲染器渲染新的 `VNode` 对象到相同的容器元素时，由于旧的 `VNode` 已经存在，所以会调用 `patch` 函数以合适的方式进行更新，如下代码所示：

```js
// 旧的 VNode
const prevVNode = h('div')

// 新的 VNode
const nextVNode = h('span')

// 第一次渲染 VNode 到 #app，此时会调用 mount 函数
render(prevVNode, document.getElementById('app'))

// 第二次渲染新的 VNode 到相同的 #app 元素，此时会调用 patch 函数
render(nextVNode, document.getElementById('app'))
```

`patch` 函数会对新旧 `VNode` 进行比对，也就是我们所说的 `diff`，那么不同的两个 `VNode` 之间应该遵守怎样的比对规则呢？其实这个问题很容易回答，我们知道 `VNode` 有类型之分，不同类型的 `VNode` 之间存在一定的差异，所以不同的 `VNode` 之间第一个比对原则就是：**只有相同类型的 `VNode` 才有比对的意义**，例如我们有两个 `VNode`，其中一个 `VNode` 的类型是标签元素，而另一个 `VNode` 的类型是组件，当这两个 `VNode` 进行比对时，最优的做法是**使用新的 `VNode` 完全替换旧的 `VNode`**，换句话说我们根本就没有做任何比对的操作，因为这完全没有意义，所以根据这个思想我们实现的 `patch` 函数如下：

```js
function patch(prevVNode, nextVNode, container) {
  // 分别拿到新旧 VNode 的类型，即 flags
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
  // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}
```

如上代码所示，既然 `patch` 函数的作用是用来比对新旧 `VNode`，那么 `patch` 函数必然需要接收新旧 `VNode` 作为参数，我们使用 `prevVNode` 形参代表旧的 `VNode`，使用 `nextVNode` 形参代表新的 `VNode`，如上是很清晰的一段比对逻辑，首先我们需要拿到新旧 `VNode` 的类型(`flags`)，接着是一连串的 `if...else if` 语句，其核心原则是：**如果类型不同，则直接调用 `replaceVNode` 函数使用新的 `VNode` 替换旧的 `VNode`，否则根据不同的类型调用与之相符的比对函数**，如下图所示：

![](https://s.poetries.top/uploads/2024/02/0fb891a8c939750a.png)

## 替换 VNode

我们首先来研究一下如何替换 `VNode`，即 `replaceVNode` 函数应该做什么，我们先来复现需要替换 `VNode` 的场景，如下代码所示：

```js
// 旧的 VNode 是一个 div 标签
const prevVNode = h('div', null, '旧的 VNode')

class MyComponent {
  render () {
    return h('h1', null, '新的 VNode')
  }
}
// 新的 VNode 是一个组件
const nextVNode = h(MyComponent)

// 先后渲染新旧 VNode 到 #app
render(prevVNode, document.getElementById('app'))
render(nextVNode, document.getElementById('app'))
```

在如上代码中，我们先后渲染了新旧 `VNode` 到 `#app` 元素，由于新旧 `VNode` 具有不同的类型，所以此时会触发 `VNode` 的替换操作，替换操作并不复杂，本质就是**把旧的 `VNode` 所渲染的DOM移除，再挂载新的 `VNode`**，如下是 `replaceVNode` 函数的实现：

```js
function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el)
  // 再把新的 VNode 挂载到容器中
  mount(nextVNode, container)
}
```

TIP

完整代码&在线体验地址：[https://codesandbox.io/s/jlxjk18vm5 (opens new window)](https://codesandbox.io/s/jlxjk18vm5)

看上去很简单，但实际上仅有这两行代码的话，是存在缺陷的。至于有何缺陷我们会在本章的后面讲解，因为目前我们的背景铺垫还不够。

## 更新标签元素

### 更新标签元素的基本原则

### 更新 VNodeData

### 更新子节点

## 更新文本节点

## 更新 Fragment

## 更新 Portal

## 有状态组件的更新

### 主动更新

### 初步了解组件的外部状态 props

### 被动更新

### 我们需要 shouldUpdateComponent

## 函数式组件的更新
