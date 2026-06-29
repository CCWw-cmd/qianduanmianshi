# 设计模式-其它模式

## MVC、MVP、MVVM

> 在下文中，如果某些内容和你看的某本书或者某个帖子上的不一样，不要惊慌，多看几本书，多打开几个帖子，你会发现每个都不一样，所以模式具体是如何表现并不重要，重要的是，了解这三个模式主要的目的和思想是什么：

- `MVC` 模式： 从大锅烩时代进化，引入了分层的概念，但是层与层之间耦合明显，维护起来不容易；
- `MVP` 模式： 在 MVC 基础上进一步解耦，视图层和模型层完全隔离，交互只能通过管理层来进行，问题是更新视图需要管理层手动来进行；
- `MVVM` 模式： 引入双向绑定机制，帮助实现一些更新视图层和模型层的工作，让开发者可以更专注于业务逻辑，相比于之前的模式，可以使用更少的代码量完成更复杂的交互； MVC、MVP、MVVM 模式是我们经常遇到的概念，其中 MVVM 是最常用到的，在实际项目中往往没有严格按照模式的定义来设计的系统，开发中也不一定要纠结自己用的到底是哪个模式，合适的才是最好的。

**1\. MVC （Model View Controller）**

> `MVC` 模式将程序分为三个部分：模型（`Model`）、视图（`View`）、控制器（`Controller`）。

- `Model` 模型层： 业务数据的处理和存储，数据更新后更新；
- `View` 视图层： 人机交互接口，一般为展示给用户的界面；
- `Controller` 控制器层 ： 负责连接 `Model` 层和 `View` 层，接受并处理 `View` 层触发的事件，并在 `Model` 层的数据状态变动时更新 `View` 层；
- `MVC` 模式的目的是通过引入 `Controller` 层来将 `Model` 层和 `View` 层分离，分层的引入是原来大锅烩方式的改进，使得系统在可维护性和可读性上有了进步。
- `MVC` 模式提出已经有四十余年，`MVC` 模式在各个书、各个教程、`WIKI` 的解释有各种版本，甚至 `MVC` 模式在不同系统中的具体表现也不同，这里只介绍典型 `MVC` 模式的思路。

> 典型思路是 `View` 层通过事件通知到 `Controller` 层，`Controller` 层经过对事件的处理完成相关业务逻辑，要求 `Model` 层改变数据状态，`Model` 层再将新数据更新到 `View`层。示意图如下：

![](https://s.poetries.top/gitee/2020/07/115.png)

> 在实际操作时，用户可以直接对 `View` 层的 `UI` 进行操作，以通过事件通知 `Controller` 层，经过处理后修改 `Model` 层的数据，`Model` 层使用最新数据更新 `View`。示意图如下：

![](https://s.poetries.top/gitee/2020/07/116.png)

用户也可以直接触发 `Controller` 去更新 `Model` 层状态，再更新 View 层：

![](https://s.poetries.top/gitee/2020/07/117.png)

> 某些场景下，`View` 层直接采用观察者/发布订阅模式监听 `Model` 层的变化，这样 `View`层和 `Model` 层相互持有、相互操作，导致紧密耦合，在可维护性上有待提升。由此，`MVP` 模式应运而生 。

**2\. MVP （Model View Presenter）**

> `MVP` 模式将程序分为三个部分：模型（`Model`）、视图（`View`）、管理层（`Presenter`）。

- `Model` 模型层： 只负责存储数据，与 `View` 呈现无关，也与 `UI` 处理逻辑无关，发生更新也不用主动通知 `View`；
- `View` 视图层： 人机交互接口，一般为展示给用户的界面；
- `Presenter` 管理层 ： 负责连接 `Model` 层和 `View` 层，处理 `View` 层的事件，负责获取数据并将获取的数据经过处理后更新 `View`；
- `MVC` 模式的 `View` 层和 `Model` 层存在耦合，为了解决这个问题，`MVP` 模式将 `View` 层和 `Model` 层解耦，之间的交互只能通过 `Presenter` 层，实际上，`MVP` 模式的目的就是将 `View` 层和 Model 层完全解耦，使得对 `View` 层的修改不会影响到 `Model` 层，而对 `Model` 层的数据改动也不会影响到`View` 层。

> 典型流程是 `View` 层触发的事件传递到 `Presenter` 层中处理，`Presenter` 层去操作 `Model` 层，并且将数据返回给 `View`层，这个过程中，`View` 层和 `Model` 层没有直接联系。而 `View` 层不部署业务逻辑，除了展示数据和触发事件之外，其它时间都在等着 `Presenter` 层来更新自己，被称为「被动视图」。

示意图如下：

![](https://s.poetries.top/gitee/2020/07/118.png)

> 在实际操作时，用户可以直接对 `View` 层的 `UI` 进行操作，`View` 层通知 `Presenter` 层，`Presenter` 层操作 `Model` 层的数据，`Presenter` 层获取到数据之后更新 `View`。示意图如下：

![](https://s.poetries.top/gitee/2020/07/119.png)

- 由于 `Presenter` 层负责了数据获取、数据处理、交互逻辑、`UI` 效果等等功能，所以 `Presenter` 层就变得强大起来，相应的，`Model` 层只负责数据存储，而 `View` 层只负责视图，`Model` 和 `View` 层的责任纯粹而单一，如果我们需要添加或修改功能模块，只需要修改 `Presenter` 层就够了。由于 `Presenter` 层需要调用 `View` 层的方法更新视图，`Presenter` 层直接持有 `View` 层导致了 `Presenter` 对 `View` 的依赖。

> 正如上所说，更新视图需要 `Presenter` 层直接持有 `View` 层，并通过调用 `View` 层中的方法来实现，还是需要一系列复杂操作，有没有什么机制自动去更新视图而不用我们手动去更新呢，所以，`MVVM` 模式应运而生。

**3\. MVVM （Model View ViewModel）**

> `MVVM` 模式将程序分为三个部分：模型（`Model`）、视图（`View`）、视图模型（`View-Model`）。

和 `MVP` 模式类似，`Model` 层和 `View` 层也被隔离开，彻底解耦，`ViewModel` 层相当于 `Presenter` 层，负责绑定 `Model` 层和 `View` 层，相比于 `MVP` 增加了双向绑定机制。

结构图如下：

![](https://s.poetries.top/gitee/2020/07/120.png)

> `MVVM` 模式的特征是 `ViewModel` 层和 `View` 层采用双向绑定的形式（Binding），`View` 层的变动，将自动反映在 `ViewModel` 层，反之亦然。

- 但是双向绑定给调试和错误定位带来困难，`View` 层的异常可能是 `View` 的代码有问题，也有可能是 `Model` 层的问题。数据绑定使得一个位置的 `Bug` 被传递到别的位置，要定位原始出问题的地方就变得不那么容易了。
- 对简单`UI` 来说，实现 `MVVM` 模式的开销是不必要的，而对于大型应用来说，引入 MVVM 模式则会节约大量手动更新视图的复杂过程，是否使用，还是看使用场景。
- `Vue` 的双向绑定机制应该算是比较有 `MVVM` 模式的影子，但 `Vue` 文档 里面是这么描述：

![](https://s.poetries.top/gitee/2020/07/121.png)

> 这是为什么呢，因为 `MVVM` 模式要求 `Model` 层和 `View` 层完全解耦，但是由于 `Vue` 还提供了 `ref` 这样的 `API`，使得 `Model` 也可以直接持有 `View`：

![](https://s.poetries.top/gitee/2020/07/122.png)

但是大多数帖子都说直接称呼 `Vue` 为 `MVVM` 框架，可见这些模式的划分也不是那么严格。

## 模块模式

> 模块是任何健壮的应用程序体系结构不可或缺的一部分，特点是有助于保持应用项目的代码单元既能清晰地分离又有组织，下面我们来看看各种不同的模块模式解决方案。

**1\. 模块模式** **1.1 命名空间模式**

> 命名空间模式是一个简单的模拟模块的方法，即创建一个全局对象，然后将变量和方法添加到这个全局对象中，这个全局对象是作为命名空间一样的角色。

```js
var MYNS = {}

MYNS.param1 = 'hello'
MYNS.param2 = 'world'
MYNS.param3 = { prop: 'name' }

MYNS.method1 = function() {
    //...
}
```

这种方式可以隐藏系统中的变量冲突，但是也有一些缺点，比如：

- 命名空间如果比较复杂，调用可能就会变成 MYNS.param.prop.data... 长长一溜，使用不便且增加代码量；
- 变量嵌套关系越多，属性解析的性能消耗就越多；
- 安全性不佳，所有的成员都可以被访问到；

**1.2 模块模式**

> 除了命名空间模式，也可以使用闭包的特性来模拟实现私有成员的功能来提升安全性，这里可以通过 IIFE 快速创建一个闭包，将要隐藏的变量和方法放在闭包中，这就是模块模式。

```js
var myModule = (function() {
    var privateProp = ''       // 私有变量
    var privateMethod = function() { // 私有方法
        console.log(privateProp)
    }

    return {
        publicProp: 'foo',              // 公有变量
        publicMethod: function(prop) {  // 共有方法
            privateProp = prop
            privateMethod()
        }
    }
})()

myModule.publicMethod('new prop') // 输出：new prop
myModule.privateProp              // Uncaught TypeError: myModule.privateMethod is not a function
myModule.privateProp              // undefined
```

- 这里的私有变量和私有方法，在闭包外面无法访问到，称为私有成员。而闭包返回的方法因为作用域的原因可以访问到私有成员，所以称为特权方法。
- 值得一提的是，在模块模式创建时，可以将参数传递到闭包中，以更自由地创建模块，也可以方便地将全局变量传入模块中，导入全局变量有助于加速即时函数中的全局符号解析的速度，因为导入的变量成了该函数的局部变量。

```js
var myModule = (function(opt, global) {
    // ...
})(options, this)
```

**1.3 揭示模块模式**

> 在上面的模块模式例子上稍加改动，可以得到揭示模块模式（Reveal Module Pattern），又叫暴露模块模式，在私有域中定义我们所有的函数和变量，并且返回一个匿名对象，把想要暴露出来的私有成员赋值给这个对象，使这些私有成员公开化。

```js
var myModule = (function() {
    var privateProp = ''
    var printProp = function() {
        console.log(privateProp)
    }

    function setProp(prop) {
        privateProp = prop
        printProp()
    }

    return {
        print: printProp,
        set: setProp
    }
})()

myModule.set('new prop')          // 输出：new prop
myModule.setProp()                // Uncaught TypeError: myModule.setProp is not a function
myModule.privateProp              // undefined
```

揭示模块暴露出来的私有成员可以在被重命名后公开访问，也增强了可读性。

**2\. ES6 module**

> 继社区提出的 `CommonJS` 和 `AMD` 之类的方案之后，从 `ES6` 开始，J`avaScript` 就支持原生模块（`module`）了，下面我们一起来简单看一下 `ES6` 的 `module`

`ES6` 的 `module` 功能主要由两个命令组成 `export`、`import`，`export` 用于规定模块对外暴露的接口，`import` 用于输入其他模块提供的接口，简单来说就是一个作为输出、一个作为输入。

```js
// 1.js

// 写法一
export var a = 'a'

// 写法二
var b = 'b'
export { b }

// 写法三
var c = 'c'
export { c as e }
```

引入时：

```js
// 2.js

import { a } from './1.js'       // 写法一
import { b as f } from './1.js'  // 写法二
import { e } from './1.js'       // 写法二
```

> 从前面的例子可以看出，使用 `import` 时，用户需要知道所要加载的变量名或函数名，否则无法加载，`export default` 方式提供了模块默认输出的形式，给用户提供了方便：

```js
// 3.js

// 写法一
export default function () {
  console.log('foo')
}

// 写法二
function foo() {
  console.log('foo')
}
export default foo

// 写法三
function foo(x, y) {
  console.log('foo')
}
export {add as default}

// 写法四
export default 42
```

引入时：

```js
// 4.js

import bar from './3.js'                   // 写法一
bar()
// 输出：foo

import { default as bar } from './3.js'    // 写法二
bar()
// 输出：foo
```

> 值得一提的是 `export`、`import` 都必须写在模块顶层，如果处于块级作用域内，就会报错，因为处于条件代码块之中，就没法做静态优化了，违背了 `ES6` 模块的设计初衷。

```js
function foo() {
  export default 'bar'    // SyntaxError
}
foo()
}
```

## 链模式

> 通常情况下，通过对构造函数使用 `new` 会返回一个绑定到 `this` 上的新实例，所以我们可以在 `new` 出来的对象上直接用 . 访问其属性和方法。如果在普通函数中也返回当前实例，那么我们就可以使用 . 在单行代码中一次性连续调用多个方法，就好像它们被链接在一起一样，这就是链式调用，又称链模式。

> 之前建造者模式、组合模式等文章已经用到了链模式，日常使用的 jQuery、Promise 等也使用了链模式，我们对使用形式已经很熟悉了，下面一起来看看链模式的原理。

**1\. 什么是链模式** **1.1 链模式的实现**

在 jQuery 时代，下面这样的用法我们很熟悉了：

```js
// 使用链模式
$('div')
  .show()
  .addClass('active')
  .height('100px')
  .css('color', 'red')
  .on('click', function(e) {
      // ...
  })
```

> 这就是很典型的链模式，对 jQuery 选择器选择的元素从上到下依次进行一系列操作，如果不使用链模式，则代码如下：

```js
// 不使用链模式
var divEls = $('div')
divEls.show()
divEls.addClass('active')
divEls.height('100px')
divEls.css('color', 'red')
divEls.on('click', function(e) {
      // ...
})
```

- 可以看到不使用链模式，代码量多了，代码结构也复杂了不少。链模式是 jQuery 的一个重要特性，也是 jQuery 深受大家喜爱，并且经久不衰的原因之一。
- 链模式和一般的函数调用的区别在于：链模式一般会在调用完方法之后返回一个对象，有时则直接返回 this ，因此又可以继续调用这个对象上的其他方法，这样可以对同一个对象连续执行多个方法。

比如这里我们可以自己实现一个链模式：

```js
/* 四边形 */
var rectangle = {
    length: null,  // 长
    width: null,   // 宽
    color: null,   // 颜色

    getSize: function() {
        console.log(`length: ${ this.length }, width: ${ this.width }, color: ${ this.color }`)
    },

    /* 设置长度 */
    setLength: function(length) {
        this.length = length
        return this
    },

    /* 设置宽度 */
    setWidth: function(width) {
        this.width = width
        return this
    },

    /* 设置颜色 */
    setColor: function(color) {
        this.color = color
        return this
    }
}

var rect = rectangle
  .setLength('100px')
  .setWidth('80px')
  .setColor('blue')
  .getSize()

// 输出：length: 100px, width: 80px, color: blue
```

> 由于所有对象都会继承其原型对象的属性和方法，所以我们可以让原型方法都返回该原型的实例对象，这样就可以对那些方法进行链式调用了：

```js
/* 四边形 */
function Rectangle() {
    this.length = null   // 长
    this.width = null    // 宽
    this.color = null    // 颜色
}

/* 设置长度 */
Rectangle.prototype.setLength = function(length) {
    this.length = length
    return this
}

/* 设置宽度 */
Rectangle.prototype.setWidth = function(width) {
    this.width = width
    return this
}

/* 设置颜色 */
Rectangle.prototype.setColor = function(color) {
    this.color = color
    return this
}

var rect = new Rectangle()
  .setLength('100px')
  .setWidth('80px')
  .setColor('blue')

console.log(rect)

// 输出：{length: "100px", width: "80px", color: "blue"}
使用 Class 语法改造一下：

/* 四边形 */
class Rectangle {
    constructor() {
        this.length = null   // 长
        this.width = null    // 宽
        this.color = null    // 颜色
    }

    /* 设置长度 */
    setLength(length) {
        this.length = length
        return this
    }

    /* 设置宽度 */
    setWidth(width) {
        this.width = width
        return this
    }

    /* 设置颜色 */
    setColor(color) {
        this.color = color
        return this
    }
}

const rect = new Rectangle()
  .setLength('100px')
  .setWidth('80px')
  .setColor('blue')

console.log(rect)

// 输出：{length: "100px", width: "80px", color: "blue"}
```

**1.2 链模式不一定必须返回 this**

> 不一定在方法中 `return this`，也可以返回其他对象，这样后面的方法可以对这个新对象进行其他操作。比如在 `Promise` 的实现中，每次 `then` 方法返回的就不是 `this`，而是一个新的 `Promise`，只不过其外观一样，所以我们可以不断 `then` 下去。后面的每一个 `then` 都不是从最初的 `Promise`实例点出来的，而是从前一个 `then` 返回的新的 `Promise` 实例点出来的。

```js
const prom1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Promise 1 resolved')
        resolve()
    }, 500)
})

const prom2 = prom1.then(() => {
    console.log('Then method')
})

console.log(prom1 === prom2)

// 输出： false
```

> jQuery 中有一个有意思的方法 `end()` ，是将匹配的元素还原为之前一次的状态，此时返回的也不是 `this`，然后可以在返回的之前一次匹配的状态后继续进行链模式：

```js
// html: <p><span>Hello</span>,how are you?</p>

$("p")            // 选择所有 p 标签
  .find("span")         // 选择了 p 标签下的 span 标签
  .css('color', 'red')
  .end()                // 返回之前匹配的 p 标签
  .css('color', 'blue')
```

> 事实上，某些原生的方法就可以使用链模式，以数组操作为例，比如我们想查看一个数组中奇数的平方和：

```js
[1, 2, 3, 4, 5, 6]
  .filter(num => num % 2)
  .map(num => num * num)
  .reduce((pre, curr) => pre + curr, 0)

// 输出 35
```

> 那么这里为什么可以使用链模式呢，是因为 `filter`、`map`、r`educe` 这些数组方法返回的仍然是数组，因此可以继续在后面调用数组的方法。

注意，并不是所有数组方法都返回数组，比如 `push` 的时候返回的是新数组的 `length` 属性。

**2\. 实战使用链模式**

> 有时候 JavaScript 原生提供的方法不太好用，比如我们希望创建下面这样一个 DOM 树结构：

```js
<ul id='data-list'>
    <li class='data-item'>li-item 1</li>
    <li class='data-item'>li-item 2</li>
    <li class='data-item'>li-item 3</li>
</ul>
```

> 如果使用原生方法，由于 `setAttribute` 等方法并没有返回原对象，而 `appendChild` 方法返回的却是，我们需要：

```js
const ul = document.createElement('ul')
ul.setAttribute('id', 'data-list')

const li1 = document.createElement('li')
const li2 = document.createElement('li')
const li3 = document.createElement('li')

li1.setAttribute('id', 'data-item')
li2.setAttribute('id', 'data-item')
li3.setAttribute('id', 'data-item')

const text1 = document.createTextNode('li-item 1')
const text2 = document.createTextNode('li-item 2')
const text3 = document.createTextNode('li-item 3')

li1.appendChild(text1)
li2.appendChild(text2)
li3.appendChild(text3)

ul.appendChild(li1)
ul.appendChild(li2)
ul.appendChild(li3)
```

太不直观了，步骤零散且可维护性差。

这里我们可以彻底使用链模式来改造一下原生方法：

```js
const createElement = function(tag) {
    return tag === 'text'
      ? document.createTextNode(tag)
      : document.createElement(tag)
}

HTMLElement.prototype._setAttribute = function(key, value) {
    this.setAttribute(key, value)
    return this
}

HTMLElement.prototype._appendChild = function(child) {
    this.appendChild(child)
    return this
}

createElement('ul')
  ._setAttribute('id', 'data-list')
  ._appendChild(
    createElement('li')
      ._setAttribute('class', 'data-item')
      ._appendChild('text', 'li-item 1'))
  ._appendChild(
    createElement('li')
      ._setAttribute('class', 'data-item')
      ._appendChild('text', 'li-item 2'))
  ._appendChild(
    createElement('li')
      ._setAttribute('class', 'data-item')
      ._appendChild('text', 'li-item 3'))
```

> 这样就比较彻底地使用了链模式来生成 `DOM` 结构树了，你可能感觉有点奇怪，但是如果你使用过 `vue-cli3`，那么你可能对这个配置方式很熟悉。

**3\. 源码中的链模式** **3.1 jQuery 中的链模式** **1\. jQuery 构造函数**

jQuery 方法看似复杂，可以简写如下：

```js
var jQuery = function(selector, context) {
    // jQuery 方法返回的是 jQuery.fn.init 所 new 出来的对象
    return new jQuery.fn.init(selector, context, rootjQuery)
}

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    // jQuery 对象的构造函数
    init: function(selector, context, rootjQuery) {
        // ... 一顿匹配操作，返回一个拼装好的伪数组的自身实例
        // 是 jQuery.fn.init 的实例，也就是我们常用的 jQuery 对象
        return this
    },
    selector: '',
    eq: function() { ... },
    end: function() { ... },
    map: function() { ... },
    last: function() { ... },
    first: function() { ... },
    // ... 其他方法
}

// jQuery.fn.init 的实例都拥有 jQuery.fn 相应的方法
jQuery.fn.init.prototype = jQuery.fn
// 此处源码位于 src/core.js
```

> `return new jQuery.fn.init(...)` 这句看似复杂，其实也就是下面的这个 `init` 方法，这个方法最后返回的是我们常用的 `jQuery` 对象，下面还有一句 `jQuery.fn.init.prototype = jQuery.fn`，因此最上面的 `jQuery` 方法返回的 `new` 出来的 `jQuery.fn.init` 实例将继承 `j`Query.fn\` 上的方法：

```js
const p = $("<p/>")
$.fn === p.__proto__   // true
```

> 因此返回出来的实例也将继承 `eq`、`end`、`map`、`last` 等 `jQuery.fn` 上的方法。

**2\. jQuery 实例方法**

> 下面我们一起看看，`show`、`hide`、`toggle` 这些方法是如何实现链模式的呢 ：

```js
jQuery.fn.extend({
    show: function() {
        var elem

        for (i = 0; i < this.length; i++) {
            // ...
            elem = this[i]

            if (elem.style.display === 'none') {
                elem.style.display = 'block'
            }
        }

        return this
    },
    hide: function() { ... },
    toggle: function() { ... }
})
```

> 这里首先使用了一个方法 `jQuery.fn.extend()`，简单看一下这个方法做啥的：

```js
jQuery.extend = jQuery.fn.extend = function(options) {
    // ... 一系列啰啰嗦嗦的判断

    for (name in options) {
        this[name] = options[ name ]  // 此处 this === jQuery.fn
    }
}

// 此处源码位于 src/core.js
```

- 这个方法就是把传参的对象的值赋值给 `jQuery.fn`，因为这时候这个方法是通过上下文对象 `jQuery.fn.extend()` 方式来调用，属于隐式绑定。（对 `this` 绑定规则的同学参看本专栏第 2 篇文章）
- 以 `show` 方法为例，此时这个方法被赋到 `jQuery.fn` 对象上，而通过上文我们知道，`jQuery.fn.init.prototype = jQuery.fn`，而 `jQuery.fn.init` 这个方法是作为构造函数被 `jQuery` 函数 `new` 出来并返回，因此 show 方法此时可以被 `jQuery.fn.init` 实例访问到，也就可以被 `$('selector')` 访问到，因此此时我们已经可以： `$('p').show()` 了。
- 那么我们再回头来看看 `show` 方法的实现，`show` 方法将匹配的元素的 `display` 置为 `block`之后返回了 `this`。注意了，此时的 `this` 也是隐式绑定，而且是通过 `$('p')` 点出来的，因此返回的值就是 `$('p')` 的引用。
- 经过以上步骤，我们知道 `show` 方法返回的仍然是 `$('p')` 的引用，我们可以继续在之后点出来其他 `jQuery.fn` 对象上的方法，`css`、`hide`、`toggle`、`addClass`on`等等方法同理，至此，`jQuery\` 的链模式就形成了。

**3.2 Underscore 中的链模式**

- 如果你用过 `Underscore`，那么你可能知道 `Underscore` 提供的一个链模式实现 `_.chain`。通过这个方法，可以方便地使用 `Underscore` 提供的一些方法链模式地对数据进行处理。另外，`Lodash` 的 `chain` 实现和 `Underscore` 的基本一样，可以自行去 `Lodash` 的 GitHub 仓库阅读。
- 比如这里我们需要对一个用户对象数组进行一系列操作，首先按年龄排序，去掉年龄为奇数的人，再将这些用户的名字列成数组：

```js
var users = [
    { 'name': 'barney', 'age': 26 },
    { 'name': 'fred', 'age': 21 },
    { 'name': 'pebbles', 'age': 28 },
    { 'name': 'negolas', 'age': 23 }
]

_.chain(users)
  .sortBy('age')
  .reject(user => user.age % 2)
  .map(user => user.name)
  .value()

// 输出： ["barney", "pebbles"]
```

> 经过 `_.chain` 方法处理后，就可以使用 `Underscore` 提供的其他方法对这个数据进行操作，下面一起来看看源码是如何实现链模式。

> 首先是 `_.chain` 方法：

```js
_.chain = function(obj) {
    var instance = _(obj)  // 获得一个经 underscore 包裹后的实例
    instance._chain = true // 标记是否使用链式操作
    return instance
}
```

> 此处源码位于 `underscore.js#L1615-L1619`

> 这里通过`_(obj)` 的方式把数据进行了包装，并返回了一个对象，结构如下：

```js
{
    _chain: true,
    _wrapped: [...],
    __proto__:  ...
}
```

> 返回的对象的隐式原型可以访问到 `Undersocre` 提供的很多方法，如下图：

![](https://s.poetries.top/gitee/2020/07/125.png)

> 这个 `chain` 方法的作用就是创建一个包裹了 `obj` 的 `Underscore` 实例对象，并标记该实例是使用链模式，最后返回这个包装好的链式化实例（叫链式化是因为可以继续调用 `underscore` 上的方法）。

我们一起看看 `sort` 方法是如何实现的：

```js
var chainResult = function (instance, obj) {
    return instance._chain ? _(obj).chain() : obj;  // 这里 _chain 为 true
};

_.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = Array.prototype[name];
    _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);   // 执行方法

        return chainResult(this, obj);
    };
});
```

> 此处源码位于 `underscore.js#L1649-L1657`

- `sort` 方法执行之后，把结果重新放在 `_wrapped` 里，并执行 `chainResult` 方法，这个方法里由于 `_chain` 之前已经置为 `true`，因此会继续对结果调用 `chain()` 方法，包装成链式化实例并返回。
- 最后的这个`_.value` 方法比较简单，就是返回链式化实例的`_wrapped` 值：

```js
_.prototype.value = function() {
   return this._wrapped;
};
```

> 此处源码位于 `underscore.js#L1668-L1670`

> 总结一下，只要一开始调用了 `chain` 方法， `_chain` 这个标志位就会被置为 `true`，在类似的方法中，返回的值都用 `chainResult` 包裹一遍，并判断这个 `_chain` 这个标志位，为 `true` 则返回链式化实例，供给下一次方法调用，由此形成了链式化调用

## 中间件

> 中间件 （Middleware），又称中介层，是提供系统软件和应用软件之间连接的软件，以便于软件各部件之间的沟通，特别是应用软件对于系统软件的集中的逻辑。中间件在企业架构中表示各种软件套件，有助于抽象底层机制，比如操作系统 API、网络通信、内存管理等，开发者只需要关注应用中的业务模块。

从更广义的角度来看，中间件也可以定义为链接底层服务和应用的软件层。后文我们主要使用 Node.js 里最近很热门的框架 Koa2 里的中间件概念为例，并且自己实现一个中间件来加深理解。

**1\. 什么是中间件**

- 在 `Express`、`Koa2` 中，中间件代表一系列以管道形式被连接起来，以处理 `HTTP` 请求和响应的函数。换句话说，中间件其实就是一个函数，一个执行特定逻辑的函数。前端中类似的概念还有拦截器、`Vue` 中的过滤器、`vue-router` 中的路由守卫等。
- 工作原理就是进入具体业务之前，先对其进行预处理（在这一点上有点类似于装饰器模式），或者在进行业务之后，对其进行后处理。

示意图如下：

![](https://s.poetries.top/gitee/2020/07/126.png)

> 当接受到一个请求，对这个请求的处理过程可以看作是一个串联的管道，比如对于每个请求，我们都想插入一些相同的逻辑比如权限验证、数据过滤、日志统计、参数验证、异常处理等功能。对于开发者而言，自然不希望对于每个请求都特殊处理，因此引入中间件来简化和隔离这些基础设施与业务逻辑之间的细节，让开发者能够关注在业务的开发上，以达到提升开发效率的目的。

**2\. Koa 里的中间件** **2.1 Koa2 里的中间件使用**

`Koa2` 中的中间件形式为：

```js
app.use(async function middleware(context, next){
    // ... 前处理
    await next()     // 下一个中间件
    // ... 后处理
})
```

- 其中第一个参数 `context` 作为上下文封装了 `request` 和 `response` 信息，我们可以通过它来访问 `request` 和 `response`；`next` 是下一个中间件，当一个中间件处理完毕，调用 next() 就可以执行下一个中间件，下一个中间件处理完- 再使用 `next()`，从而实现中间件的管道化，对消息的依次处理。

> 一般中间件模式都约定有个 `use` 方法来注册中间件，`Koa2` 也是如此。千言万语不及一行代码，这里写一个简单的中间件：

```js
const koa = require('koa')
const app = new koa()

app.use((ctx, next) => {      // 没错，这就是中间件
    console.log('in 中间件1')
})

app.listen(10001)

// 输出： in 中间件1
```

**Koa2 中的中间件有多种类型：**

- 应用级中间件；
- 路由级中间件；
- 错误处理中间件；
- 第三方中间件；

> 除了使用第三方中间件比如 `koa-router`、`koa-bodyparser`、`koa-static`、`koa-logger` 等提供一些通用的路由、序列化、反序列化、日志记录等功能外，我们还可以编写自己的应用级中间件，来完成业务相关的逻辑。

**通过引入各种功能各异的中间件，可以完成很多业务相关的功能：**

- `equest` 和 `response` 的解析和处理；
- 生成访问日志；
- 管理 `session`、`cookie` 等；
- 提供网络安全防护；

**2.2 洋葱模型**

在使用多个中间件时，引用一张著名的洋葱模型图：

![](https://s.poetries.top/gitee/2020/07/127.png)

正如上面的洋葱图所示，请求在进入业务逻辑时，会依次经过一系列中间件，对数据进行有序处理，业务逻辑之后，又像栈的先入后出一样，倒序经过之前的中间件。洋葱模型允许当应用执行完主要逻辑之后进行一些后处理，再将响应返回给用户。

使用如下：

```js
const Koa = require('koa')
const app = new Koa()

// 中间件1
app.use(async (ctx, next) => {
    console.log('in 中间件1')
    await next()
    console.log('out 中间件1')
})

// 中间件2
app.use(async (ctx, next) => {
    console.log('in 中间件2')
    await next()
    console.log('out 中间件2')
})

// response
app.use(async ctx => { ctx.body = 'Hello World' })

app.listen(10001)
console.log('app started at port http://localhost:10001')

// 输出：  in  中间件1
// 输出：  in  中间件2
// 输出：  out 中间件2
// 输出：  out 中间件1
```

> 我们可以引入 `setTimeout` 来模拟异步请求的过程：

```js
const Koa = require('koa')
const app = new Koa()

// 中间件1
app.use(async (ctx, next) => {
    console.log('in 中间件1')
    await next()
    console.log('out 中间件1')
})

// 中间件2
app.use(async (ctx, next) => {
    console.log('in 中间件2')
    await new Promise((resolve, reject) => {
          ctx.zjj_start2 = Date.now()
          setTimeout(() => resolve(), 1000 + Math.random() * 1000)
      }
    )
    await next()
    const duration = Date.now() - ctx.zjj_start2
    console.log('out 中间件2 耗时：' + duration + 'ms')
})

// 中间件3
app.use(async (ctx, next) => {
    console.log('in 中间件3')
    await new Promise((resolve, reject) => {
          ctx.zjj_start3 = Date.now()
          setTimeout(() => resolve(), 1000 + Math.random() * 1000)
      }
    )
    await next()
    const duration = Date.now() - ctx.zjj_start3
    console.log('out 中间件3 耗时：' + duration + 'ms')
})

// response
app.use(async ctx => {
    console.log(' ... 业务逻辑处理过程 ... ')
})

app.listen(10001)
console.log('app started at port http://localhost:10001')
```

> 在使用多个中间件时，特别是存在异步的场景，一般要 `await` 来调用 `next` 来保证在异步场景中，中间件仍按照洋葱模型的顺序来执行，因此别忘了 `next` 也要通过 `await` 调用。
