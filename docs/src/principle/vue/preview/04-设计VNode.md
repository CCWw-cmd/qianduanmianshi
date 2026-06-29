
上一章讲述了组件的本质，知道了一个组件的产出是 `VNode`，渲染器(`Renderer`)的渲染目标也是 `VNode`。可见 `VNode` 在框架设计的整个环节中都非常重要，甚至**设计 `VNode` 本身就是在设计框架**，`VNode` 的设计还会对后续算法的性能产生影响。本章我们就着手对 `VNode` 进行一定的设计，尝试用 `VNode` 描述各类渲染内容。

## 用 VNode 描述真实 DOM

一个 `html` 标签有它的名字、属性、事件、样式、子节点等诸多信息，这些内容都需要在 `VNode` 中体现，我们可以用如下对象来描述一个红色背景的正方形 `div` 元素：

```js
const elementVNode = {
  tag: 'div',
  data: {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  }
}
```

我们使用 `tag` 属性来存储标签的名字，用 `data` 属性来存储该标签的附加信息，比如 `style`、`class`、事件等，通常我们把一个 `VNode` 对象的 `data` 属性称为 `VNodeData`。

为了描述子节点，我们需要给 `VNode` 对象添加 `children` 属性，如下 `VNode` 对象用来描述一个有子节点的 `div` 元素：

```js
const elementVNode = {
  tag: 'div',
  data: null,
  children: {
    tag: 'span',
    data: null
  }
}
```

若有多个子节点，则可以把 `children` 属性设计为一个数组：

```js
const elementVNode = {
  tag: 'div',
  data: null,
  children: [
    {
      tag: 'h1',
      data: null
    },
    {
      tag: 'p',
      data: null
    }
  ]
}
```

除了标签元素之外，DOM 中还有文本节点，我们可以用如下 `VNode` 对象来描述一个文本节点：

```js
const textVNode = {
  tag: null,
  data: null,
  children: '文本内容'
}
```

如上，由于文本节点没有标签名字，所以它的 `tag` 属性值为 `null`。由于文本节点也无需用额外的 `VNodeData` 来描述附加属性，所以其 `data` 属性值也是 `null`。

唯一需要注意的是我们使用 `children` 属性来存储一个文本节点的文本内容。有的同学可能会问：“可不可以新建一个属性 `text` 来存储文本内容呢？”

```js
const textVNode = {
  tag: null,
  data: null,
  children: null,
  text: '文本内容'
}
```

这完全没有问题，这取决于你如何设计，但是**尽可能的在保证语义能够说得通的情况下复用属性，会使 `VNode` 对象更加轻量**，所以我们采取使用 `children` 属性来存储文本内容的方案。

如下是一个以文本节点作为子节点的 `div` 标签的 `VNode` 对象：

```js
const elementVNode = {
  tag: 'div',
  data: null,
  children: {
    tag: null,
    data: null,
    children: '文本内容'
  }
}
```

## 用 VNode 描述抽象内容

什么是抽象内容呢？组件就属于抽象内容，比如你在 模板 或 `jsx` 中使用了一个组件，如下：

```js
<div>
  <MyComponent />
</div>
```

你的意图并不是要在页面中渲染一个名为 `MyComponent` 的标签元素，而是要渲染 `MyComponent` 组件所产出的内容。

但我们仍然需要使用 `VNode` 来描述 `<MyComponent/>`，并给此类用来描述组件的 `VNode` 添加一个标识，以便在挂载的时候有办法区分一个 `VNode` 到底是普通的 `html` 标签还是组件。

我们可以使用如下 `VNode` 对象来描述上面的模板：

```js
const elementVNode = {
  tag: 'div',
  data: null,
  children: {
    tag: MyComponent,
    data: null
  }
}
```

如上，用来描述组件的 `VNode` 其 `tag` 属性值引用的就是组件类(或函数)本身，而不是标签名称字符串。所以理论上：**我们可以通过检查 `tag` 属性值是否是字符串来确定一个 `VNode` 是否是普通标签**。

除了组件之外，还有两种抽象的内容需要描述，即 `Fragment` 和 `Portal`。我们先来了解一下什么是 `Fragment` 以及它所解决的问题。

`Fragment` 的寓意是要渲染一个片段，假设我们有如下模板：

```js
<template>
  <table>
    <tr>
      <Columns />
    </tr>
  </table>
</template>
```

组件 `Columns` 会返回多个 `<td>` 元素：

```js
<template>
  <td></td>
  <td></td>
  <td></td>
</template>
```

大家思考一个问题，如上模板的 `VNode` 如何表示？如果模板中只有一个 `td` 标签，即只有一个根元素，这很容易表示：

```js
const elementVNode = {
  tag: 'td',
  data: null
}
```

但是模板中不仅仅只有一个 `td` 标签，而是有多个 `td` 标签，即多个根元素，这如何表示？此时我们就需要引入一个抽象元素，也就是我们要介绍的 `Fragment`。

```js
const Fragment = Symbol()
const fragmentVNode = {
  // tag 属性值是一个唯一标识
  tag: Fragment,
  data: null,
  children: [
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    }
  ]
}
```

如上，我们把所有 `td` 标签都作为 `fragmentVNode` 的子节点，根元素并不是一个实实在在的真实 DOM，而是一个抽象的标识，即 `Fragment`。

当渲染器在渲染 `VNode` 时，如果发现该 `VNode` 的类型是 `Fragment`，就只需要把该 `VNode` 的子节点渲染到页面。

TIP

在上面的代码中 `fragmentVNode.tag` 属性的值是一个通过 `Symbol` 创建的唯一标识，但实际上我们更倾向于给 `VNode` 对象添加一个 `flags` 属性，用来代表该 `VNode` 的类型，这在本章的后面会详细说明。

再来看看 `Portal`，什么是 `Portal` 呢？

一句话：它允许你把内容渲染到任何地方。其应用场景是，假设你要实现一个蒙层组件 `<Overlay/>`，要求是该组件的 `z-index` 的层级最高，这样无论在哪里使用都希望它能够遮住全部内容，你可能会将其用在任何你需要蒙层的地方。

```js
<template>
  <div id="box" style="z-index: -1;">
    <Overlay />
  </div>
</template>
```

如上，不幸的事情发生了，在没有 `Portal` 的情况下，上面的 `<Overlay/>` 组件的内容只能渲染到 `id="box"` 的 `div` 标签下，这就会导致蒙层的层级失效甚至布局都可能会受到影响。

其实解决办法也很简单，假如 `<Overlay/>` 组件要渲染的内容不受 DOM 层级关系限制，即可以渲染到任何位置，该问题将迎刃而解。

使用 `Portal` 可以这样编写 `<Overlay/>` 组件的模板：

```js
<template>
  <Portal target="#app-root">
    <div class="overlay"></div>
  </Portal>
</template>
```

其最终效果是，无论你在何处使用 `<Overlay/>` 组件，它都会把内容渲染到 `id="app-root"` 的元素下。由此可知，所谓 `Portal` 就是把子节点渲染到给定的目标，我们可以使用如下 `VNode` 对象来描述上面这段模板：

```js
const Portal = Symbol()
const portalVNode = {
  tag: Portal,
  data: {
    target: '#app-root'
  },
  children: {
    tag: 'div',
    data: {
      class: 'overlay'
    }
  }
}
```

`Portal` 类型的 `VNode` 与 `Fragment` 类型的 `VNode` 类似，都需要一个唯一的标识，来区分其类型，目的是告诉渲染器如何渲染该 `VNode`。

## VNode 的种类

## 使用 flags 作为 VNode 的标识

## 枚举值 VNodeFlags

## children 和 ChildrenFlags

## VNodeData
