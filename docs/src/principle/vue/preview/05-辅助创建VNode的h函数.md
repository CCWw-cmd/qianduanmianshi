
> 自从有了 `VNode` ，开发页面的方式就变成了书写 `VNode`，但如果日常开发中需要手写 `VNode` ，那绝对是反人类的，在“组件的本质”一章中我们使用了 `snabbdom` 的 `h` 函数来辅助讲解一些小例子，`h` 函数作为创建 `VNode` 对象的函数封装，在一定程度上改善了这个问题，但却没有解决本质问题，这也是为什么我们需要模板或 `jsx` 的原因。但 `h` 函数依然很重要，因为无论是模板还是 `jsx` 都需要经过编译，那么是直接编译成 `VNode` 树好呢？还是编译成由 `h` 函数组成的调用集合好呢？这个其实很难说，但可以肯定的一点是，我们将可**公用、灵活、复杂的逻辑封装成函数，并交给运行时**，这能够大大降低编译器的书写难度，甚至经过编译器生成的代码也具有一定的可读性，而 `h` 函数就是众多运行时函数中的一个。

## 在VNode创建时确定其类型 - flags

一个最简单的 `h` 函数如下：

```js
function h() {
  return {
    _isVNode: true,
    flags: VNodeFlags.ELEMENT_HTML,
    tag: 'h1',
    data: null,
    children: null,
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}
```

这个 `h` 函数只能用来创建一个空的 `<h1></h1>` 标签，可以说没有任何意义。为了让 `h` 函数更加灵活，我们可以增加一些参数，问题是哪些内容应该提取到参数中呢？如果提取的参数多了，就会导致函数的使用不便，如果提取的参数少了又会导致函数的功能不足，所以这也是一个探索的过程。实际上只需要把 `tag`、`data` 和 `children` 提取为参数即可：

```js
function h(tag, data = null, children = null) {
  //...
}
```

我们来看看为什么三个参数就能满足需求，对于 `_isVNode` 属性，它的值始终都为 `true`，所以不需要提取到参数中。对于 `flags` 属性，我们可以通过检查 `tag` 属性值的特征来确定该 `VNode` 的 `flags` 属性值，如下：

```js
function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  }
}
```

如上代码所示，如果 `tag` 是字符串则可以确定该 `VNode` 是标签元素，再次通过 `tag === 'svg'` 进一步判断是否是 `SVG` 标签，从而确定了该 `VNode` 的类型。

TIP

请注意区分下文中出现的 `tag`，有时指的是 `VNode` 对象的 `tag` 属性，有时指的是 `h` 函数的第一个参数。

对于 `Fragment` 类型的 **`VNode`**，它的 `tag` 属性值为 `null`，但是纯文本类型的 `VNode` 其 `tag` 属性值也是 `null`，所以为了区分，我们可以增加一个唯一的标识，当 `h` 函数的第一个参数(`tag`)的值等于该标识的时候，则意味着创建的是 `Fragment` 类型的 `VNode`：

```js
// 唯一标识
export const Fragment = Symbol()
function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  }
}
```

这时我们可以像如下这样调用 `h` 函数创建 `Fragment`：

```js
import { h, Fragment } from 'vue'

h(Fragment, null, children)
```

类似的，对于`Portal` 类型的 **`VNode`**，它的 `tag` 属性值也可以是字符串，这就会与普通标签元素类型的 `VNode` 冲突，导致无法区分一个 `VNode` 到底是普通标签元素还是 `Portal`，所以我们参考 `Fragment` 的实现方式，增加一个 `Portal` 标识：

```js
export const Fragment = Symbol()
export const Portal = Symbol()
function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  }
}
```

这里需要注意的一点是，类型为 `Portal` 的 `VNode`，其 `tag` 属性值存储的是 `Portal` 挂载的目标，即 `target`。通常模板在经过编译后，我们把 `target` 数据存储在 `VNodeData` 中，所以我们看到如上代码中包含 `tag = data && data.target`。

如果一个 `VNode` 对象的 `tag` 属性值不满足以上全部条件，那只有一种可能了，即该 `VNode` 是组件。有的同学可能会说，也有可能是文本节点啊，没错，但是我们很少会用 `h` 函数去创建一个文本节点，而是单纯的使用字符串，然后在内部实现中检测到该字符串的寓意是文本节点的时候会为其自动创建一个纯文本的 `VNode` 对象，例如：

```js
h(
  'div',
  {
    style: { color: 'red' }
  },
  '我是文本'
)
```

如上代码所示，`h` 函数的第三个参数 `children` 的值是一段文本字符串，这时在 `h` 函数内部会为这段文本字符串创建一个与之相符的纯文本 `VNode` 对象。

我们回过头来，继续讨论当一个 `VNode` 是组件时，如何根据 `tag` 属性确定该 `VNode` 对象的 `flags` 值，很简单如下：

```js
// 省略...
function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    // 兼容 Vue2 的对象式组件
    if (tag !== null && typeof tag === 'object') {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
    } else if (typeof tag === 'function') {
      // Vue3 的类组件
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
        : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
    }
  }
}
```

在 `Vue2` 中用一个对象作为组件的描述，而在 `Vue3` 中，有状态组件是一个继承了基类的类。所以如果是 `Vue2` 的对象式组件，我们通过检查该对象的 `functional` 属性的真假来判断该组件是否是函数式组件。在 `Vue3` 中，因为有状态组件会继承基类，所以通过原型链判断其原型中是否有 `render` 函数的定义来确定该组件是否是有状态组件。

一旦确定了一个 `VNode` 的类型，那么 `h` 函数就可返回带有正确类型的 `VNode`：

```js
function h(tag, data = null, children = null) {
  let flags = null
  // 省略用来确定 flags 的代码

  return {
    flags,
    // 其他属性...
  }
}
```

## 在VNode创建时确定其children的类型

上文通过 **检测 `tag` 属性值** 来确定一个 `VNode` 对象的 `flags` 属性值。类似地，可以通过 **检测 `children`** 来确定 `childFlags` 的值。根据 `h` 函数的调用方式可以很容易地确定参数 `children` 包含哪些值：

* 1、`children` 是一个数组：

```js
h('ul', null, [
  h('li'),
  h('li')
])
```

* 2、`children` 是一个 `VNode` 对象：

```js
h('div', null, h('span'))
```

* 3、没有 `children`：

```js
h('div')
```

* 4、`children` 是一个普通文本字符串：

```js
h('div', null, '我是文本')
```

以上是四种常见的 `h` 函数的调用方式，根据这四种调用方式中 `children` 的不同形式即可确定一个 `VNode` 对象的 `childFlags`：

```js
function h(tag, data = null, children = null) {
  // 省略用于确定 flags 相关的代码

  let childFlags = null
  if (Array.isArray(children)) {
    const { length } = children
    if (length === 0) {
      // 没有 children
      childFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      // 单个子节点
      childFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    } else {
      // 多个子节点，且子节点使用key
      childFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  } else if (children == null) {
    // 没有子节点
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    // 单个子节点
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }
}
```

首先，如果 `children` 是数组，则根据数组的长度来判断 `children` 的类型到底是 `ChildrenFlags.NO_CHILDREN`、`ChildrenFlags.SINGLE_VNODE` 还是 `ChildrenFlags.KEYED_VNODES`。这里大家可能会有疑问：“为什么多个子节点时会直接被当做使用了 `key` 的子节点？”，这是因为 `key` 是可以人为创造的，如下是 `normalizeVNodes` 函数的简化：

```js
function normalizeVNodes(children) {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}
```

如上， `normalizeVNodes` 函数接收 `children` 数组作为参数，并遍历该数组，对于数组中没有 `key` 的 `VNode` 对象，为其添加一个由竖线(`|`)与该 `VNode` 在数组中的索引拼接而成的字符串作为该 `VNode` 的 `key`。

如果 `children` 不是数组，则判断 `children` 是否为 `null/undefined`，条件为真则说明没有子节点，所以 `childFlags` 的值为 `ChildrenFlags.NO_CHILDREN`。如果 `children` 不为 `null/undefined`，并且 `children._isVNode` 为真，则说明 `children` 就是单个 `VNode` 对象，即单个子节点 `ChildrenFlags.SINGLE_VNODE`。

最后，如果 `children` 不满足以上任何条件，则会把 `children` 作为纯文本节点的文本内容处理，这时会使用 `createTextVNode` 函数创建一个纯文本类型的 `VNode`，`createTextVNode` 函数接收一个字符串作为参数，创建一个与之相符的纯文本类型的 `VNode`，如下：

```js
function createTextVNode(text) {
  return {
    _isVNode: true,
    // flags 是 VNodeFlags.TEXT
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
    children: text,
    // 文本节点没有子节点
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}
```

**这里再次强调！！！** ，以上用于确定 `childFlags` 的代码仅限于非组件类型的 `VNode`，因为对于组件类型的 `VNode` 来说，它并没有子节点，所有子节点都应该作为 `slots` 存在，所以如果使用 `h` 函数创建一个组件类型的 `VNode`，那么我们应该把 `children` 的内容转化为 `slots`，然后再把 `children` 置为 `null`，这些内容我们会在合适的章节讲解。

## 使用 h 函数创建 VNode
