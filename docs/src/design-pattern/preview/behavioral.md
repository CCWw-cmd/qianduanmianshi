
# 设计模式-行为型模式

## 发布-订阅模式

> 在众多设计模式中，可能最常见、最有名的就是发布-订阅模式了，本篇我们一起来学习这个模式。

- 发布-订阅模式 （`Publish-Subscribe Pattern, pub-sub`）又叫观察者模式（`Observer Pattern`），它定义了一种一对多的关系，让多个订阅者对象同时监听某一个发布者，或者叫主题对象，这个主题对象的状态发生变化时就会通知所有订阅自己的订阅者对象，使得它们能够自动更新自己。
- 当然有人提出发布-订阅模式和观察者模式之间是有一些区别的，但是大部分情况下你可以将他们当成是一个模式，本文将不对它们之间进行区分，文末会简单讨论一下他们之间的微妙区别，了解即可

**1\. 你曾遇见过的发布-订阅模式**

在现实生活中其实我们会经常碰到发布-订阅模式的例子。

- 比如当我们进入一个聊天室/群，如果有人在聊天室发言，那么这个聊天室里的所有人都会收到这个人的发言。这是一个典型的发布-订阅模式，当我们加入了这个群，相当于订阅了在这个聊天室发送的消息，当有新的消息产生，聊天室会负责将消息发布给所有聊天室的订阅者。
- 再举个栗子，当我们去 adadis 买鞋，发现看中的款式已经售罄了，售货员告诉你不久后这个款式会进货，到时候打电话通知你。于是你留了个电话，离开了商场，当下周某个时候 adadis 进货了，售货员拿出小本本，给所有关注这个款式的人打电话。
- 这也是一个日常生活中的一个发布-订阅模式的实例，虽然不知道什么时候进货，但是我们可以登记号码之后等待售货员的电话，不用每天都打电话问鞋子的信息。
- 上面两个小栗子，都属于发布-订阅模式的实例，群成员/买家属于消息的订阅者，订阅消息的变化，聊天室/售货员属于消息的发布者，在合适的时机向群成员/小本本上的订阅者发布消息。

adadis 售货员这个例子的各方关系大概如下图：

![](https://s.poetries.top/gitee/2020/07/101.png)

在这样的逻辑中，有以下几个特点：

- 买家（订阅者）只要声明对消息的一次订阅，就可以在未来的某个时候接受来自售货员（发布者）的消息，不用一直轮询消息的变化；
- 售货员（发布者）持有一个小本本（订阅者列表），对这个本本上记录的订阅者的情况并不关心，只需要在消息发生时挨个去通知小本本上的订阅者，当订阅者增加或减少时，只需要在小本本上增删记录即可；
- 将上面的逻辑升级一下，一个人可以加多个群，售货员也可以有多个小本本，当不同的群产生消息或者不款式的鞋进货了，发布者可以按照不同的名单/小本本分别去通知订阅了不同类型消息的订阅者，这里有个消息类型的概念；

**2\. 实例的代码实现**

- 如果你在 `DOM` 上绑定过事件处理函数 `addEventListener`，那么你已经使用过发布-订阅模式了。
- 我们经常将一些操作挂载在 `onload` 事件上执行，当页面元素加载完毕，就会触发你注册在 `onload` 事件上的回调。我们无法预知页面元素何时加载完毕，但是通过订阅 `window` 的 `onload` 事件，`window` 会在加载完毕时向订阅者发布消息，也就是执行回调函数。

```js
window.addEventListener("load", function () {
  console.log("loaded!");
});
```

这与买鞋的例子类似，我们不知道什么时候进货，但只需订阅鞋子的消息，进货的时候售货员会打电话通知我们。

在现实中和编程中我们还会遇到很多这样类似的问题，我们可以将 adadis 的例子提炼一下，用 JavaScript 来实现：

```js
const adadisPub = {
  adadisBook: [], // adadis售货员的小本本
  subShoe(phoneNumber) {
    // 买家在小本本是登记号码
    this.adadisBook.push(phoneNumber);
  },
  notify() {
    // 售货员打电话通知小本本上的买家
    for (const customer of this.adadisBook) {
      customer.update();
    }
  },
};

const customer1 = {
  phoneNumber: "152xxx",
  update() {
    console.log(this.phoneNumber + ": 去商场看看");
  },
};

const customer2 = {
  phoneNumber: "138yyy",
  update() {
    console.log(this.phoneNumber + ": 给表弟买双");
  },
};

adadisPub.subShoe(customer1); // 在小本本上留下号码
adadisPub.subShoe(customer2);

adadisPub.notify(); // 打电话通知买家到货了

// 152xxx: 去商场看看
// 138yyy: 给表弟买双
```

这样我们就实现了在有新消息时对买家的通知。

当然还可以对功能进行完善，比如：

在登记号码的时候进行一下判重操作，重复号码就不登记了； 买家登记之后想了一下又不感兴趣了，那么以后也就不需要通知了，增加取消订阅的操作；

```js
const adadisPub = {
  adadisBook: [], // adadis售货员的小本本
  subShoe(customer) {
    // 买家在小本本是登记号码
    if (!this.adadisBook.includes(customer))
      // 判重
      this.adadisBook.push(customer);
  },
  unSubShoe(customer) {
    // 取消订阅
    if (!this.adadisBook.includes(customer)) return;
    const idx = this.adadisBook.indexOf(customer);
    this.adadisBook.splice(idx, 1);
  },
  notify() {
    // 售货员打电话通知小本本上的买家
    for (const customer of this.adadisBook) {
      customer.update();
    }
  },
};

const customer1 = {
  phoneNumber: "152xxx",
  update() {
    console.log(this.phoneNumber + ": 去商场看看");
  },
};

const customer2 = {
  phoneNumber: "138yyy",
  update() {
    console.log(this.phoneNumber + ": 给表弟买双");
  },
};

adadisPub.subShoe(customer1); // 在小本本上留下号码
adadisPub.subShoe(customer1);
adadisPub.subShoe(customer2);
adadisPub.unSubShoe(customer1);

adadisPub.notify(); // 打电话通知买家到货了

// 138yyy: 给表弟买双
```

到现在我们已经简单完成了一个发布-订阅模式。

但是还可以继续改进，比如买家可以关注不同的鞋型，那么当某个鞋型进货了，只通知关注了这个鞋型的买家，总不能通知所有买家吧。改写后的代码：

```js
const adadisPub = {
  adadisBook: {}, // adadis售货员的小本本
  subShoe(type, customer) {
    // 买家在小本本是登记号码
    if (this.adadisBook[type]) {
      // 如果小本本上已经有这个type
      if (!this.adadisBook[type].includes(customer))
        // 判重
        this.adadisBook[type].push(customer);
    } else this.adadisBook[type] = [customer];
  },
  unSubShoe(type, customer) {
    // 取消订阅
    if (!this.adadisBook[type] || !this.adadisBook[type].includes(customer))
      return;
    const idx = this.adadisBook[type].indexOf(customer);
    this.adadisBook[type].splice(idx, 1);
  },
  notify(type) {
    // 售货员打电话通知小本本上的买家
    if (!this.adadisBook[type]) return;
    this.adadisBook[type].forEach((customer) => customer.update(type));
  },
};

const customer1 = {
  phoneNumber: "152xxx",
  update(type) {
    console.log(this.phoneNumber + ": 去商场看看" + type);
  },
};

const customer2 = {
  phoneNumber: "138yyy",
  update(type) {
    console.log(this.phoneNumber + ": 给表弟买双" + type);
  },
};

adadisPub.subShoe("运动鞋", customer1); // 订阅运动鞋
adadisPub.subShoe("运动鞋", customer1);
adadisPub.subShoe("运动鞋", customer2);
adadisPub.subShoe("帆布鞋", customer1); // 订阅帆布鞋

adadisPub.notify("运动鞋"); // 打电话通知买家运动鞋到货了

// 152xxx: 去商场看看运动鞋
// 138yyy: 给表弟买双运动鞋
```

这样买家就可以订阅不同类型的鞋子，售货员也可以只通知关注某特定鞋型的买家了。

**3\. 发布-订阅模式的通用实现**

我们可以把上面例子的几个核心概念提取一下，买家可以被认为是订阅者（Subscriber），售货员可以被认为是发布者（Publisher），售货员持有小本本（SubscriberMap），小本本上记录有买家订阅（subscribe）的不同鞋型（Type）的信息，当然也可以退订（unSubscribe），当鞋型有消息时售货员会给订阅了当前类型消息的订阅者发布（notify）消息。

**主要有下面几个概念：**

- `Publisher` ：发布者，当消息发生时负责通知对应订阅者
- `Subscriber` ：订阅者，当消息发生时被通知的对象
- `SubscriberMap` ：持有不同 `type` 的数组，存储有所有订阅者的数组
- `type` ：消息类型，订阅者可以订阅的不同消息类型
- `subscribe` ：该方法为将订阅者添加到 `SubscriberMap` 中对应的数组中
- `unSubscribe` ：该方法为在 `SubscriberMap` 中删除订阅者
- `notify` ：该方法遍历通知 `SubscriberMap` 中对应 `type` 的每个订阅者

现在的结构如下图

![](https://s.poetries.top/gitee/2020/07/102.png)

下面使用通用化的方法实现一下。

> 首先我们使用立即调用函数 `IIFE`（Immediately Invoked Function Expression） 方式来将不希望公开的 SubscriberMap 隐藏，然后可以将注册的订阅行为换为回调函数的形式，这样我们可以在消息通知时附带参数信息，在处理通知的时候也更灵活：

```js
const Publisher = (function () {
  const _subsMap = {}; // 存储订阅者
  return {
    /* 消息订阅 */
    subscribe(type, cb) {
      if (_subsMap[type]) {
        if (!_subsMap[type].includes(cb)) _subsMap[type].push(cb);
      } else _subsMap[type] = [cb];
    },
    /* 消息退订 */
    unsubscribe(type, cb) {
      if (!_subsMap[type] || !_subsMap[type].includes(cb)) return;
      const idx = _subsMap[type].indexOf(cb);
      _subsMap[type].splice(idx, 1);
    },
    /* 消息发布 */
    notify(type, ...payload) {
      if (!_subsMap[type]) return;
      _subsMap[type].forEach((cb) => cb(...payload));
    },
  };
})();

Publisher.subscribe("运动鞋", (message) => console.log("152xxx" + message)); // 订阅运动鞋
Publisher.subscribe("运动鞋", (message) => console.log("138yyy" + message));
Publisher.subscribe("帆布鞋", (message) => console.log("139zzz" + message)); // 订阅帆布鞋

Publisher.notify("运动鞋", " 运动鞋到货了 ~"); // 打电话通知买家运动鞋消息
Publisher.notify("帆布鞋", " 帆布鞋售罄了 T.T"); // 打电话通知买家帆布鞋消息

// 输出:  152xxx 运动鞋到货了 ~
// 输出:  138yyy 运动鞋到货了 ~
// 输出:  139zzz 帆布鞋售罄了 T.T
```

> 上面是使用 `IIFE` 实现的，现在 `ES6` 如此流行，也可以使用 `class` 语法来改写一下：

```js
class Publisher {
  constructor() {
    this._subsMap = {};
  }

  /* 消息订阅 */
  subscribe(type, cb) {
    if (this._subsMap[type]) {
      if (!this._subsMap[type].includes(cb)) this._subsMap[type].push(cb);
    } else this._subsMap[type] = [cb];
  }

  /* 消息退订 */
  unsubscribe(type, cb) {
    if (!this._subsMap[type] || !this._subsMap[type].includes(cb)) return;
    const idx = this._subsMap[type].indexOf(cb);
    this._subsMap[type].splice(idx, 1);
  }

  /* 消息发布 */
  notify(type, ...payload) {
    if (!this._subsMap[type]) return;
    this._subsMap[type].forEach((cb) => cb(...payload));
  }
}

const adadis = new Publisher();

adadis.subscribe("运动鞋", (message) => console.log("152xxx" + message)); // 订阅运动鞋
adadis.subscribe("运动鞋", (message) => console.log("138yyy" + message));
adadis.subscribe("帆布鞋", (message) => console.log("139zzz" + message)); // 订阅帆布鞋

adadis.notify("运动鞋", " 运动鞋到货了 ~"); // 打电话通知买家运动鞋消息
adadis.notify("帆布鞋", " 帆布鞋售罄了 T.T"); // 打电话通知买家帆布鞋消息

// 输出:  152xxx 运动鞋到货了 ~
// 输出:  138yyy 运动鞋到货了 ~
// 输出:  139zzz 帆布鞋售罄了 T.T
```

**4\. 实战中的发布-订阅模式** **4.1 使用 jQuery 的方式**

> 我们使用 `jQuery` 的时候可以通过其自带的 `API` 比如 `on`、`trigger`、`off` 来轻松实现事件的订阅、发布、取消订阅等操作：

```js
function eventHandler() {
  console.log("自定义方法");
}

/* ---- 事件订阅 ---- */
$("#app").on("myevent", eventHandler);
// 发布
$("#app").trigger("myevent");

// 输出：自定义方法

/* ---- 取消订阅 ---- */
$("#app").off("myevent");
$("#app").trigger("myevent");

// 没有输出
```

> 甚至我们可以使用原生的 `addEventListener`、`dispatchEvent`、`removeEventListener` 来实现发布订阅：

```js
// 输出：自定义方法
function eventHandler(dom) {
  console.log("自定义方法", dom);
}

var app = document.getElementById("app");

/* ---- 事件订阅 ---- */
app.addEventListener("myevent", eventHandler);
// 发布
app.dispatchEvent(new Event("myevent"));

// 输出：自定义方法+DOM

/* ---- 取消订阅 ---- */
app.removeEventListener("myevent", eventHandler);
app.dispatchEvent(new Event("myevent"));

// 没有输出
```

**4.2 使用 Vue 的 EventBus**

> 和 `jQuery` 一样，Vue 也是实现有一套事件机制，其中一个我们熟知的用法是 `EventBus`。在多层组件的事件处理中，如果你觉得一层层 `$on`、`$emit` 比较麻烦，而你又不愿意引入 `Vuex`，那么这时候推介使用 `EventBus` 来解决组件间的数据通信：

```js
// event-bus.js

import Vue from 'vue'
export const EventBus = new Vue()
使用时：

// 组件A
import { EventBus } from "./event-bus.js";

EventBus.$on("myevent", args => {
  console.log(args)
})
// 组件B
import { EventBus } from "./event-bus.js";

EventBus.$emit("myevent", 'some args')
```

> 实现组件间的消息传递，不过在中大型项目中，还是推介使用 `Vuex`，因为如果 `Bus` 上的事件挂载过多，事件满天飞，就分不清消息的来源和先后顺序，对可维护性是一种破坏。

**5\. 源码中的发布-订阅模式**

> 发布-订阅模式在源码中应用很多，特别是现在很多前端框架都会有的双向绑定机制的场景，这里以现在很火的 `Vue` 为例，来分析一下 `Vue` 是如何利用发布-订阅模式来实现视图层和数据层的双向绑定。先借用官网的双向绑定原理图：

![](https://s.poetries.top/gitee/2020/07/103.png)

下面稍微解释一下这个图（框架源码整个过程比较复杂，如果现在看不懂下面几段也没关系，大致了解一下即可）。

> 组件渲染函数（Component Render Function）被执行前，会对数据层的数据进行响应式化。响应式化大致就是使用 `Object.defineProperty` 把数据转为 `getter/setter`，并为每个数据添加一个订阅者列表的过程。这个列表是 `getter` 闭包中的属性，将会记录所有依赖这个数据的组件。

- 也就是说，响应式化后的数据相当于发布者。
- 每个组件都对应一个 `Watcher` 订阅者。当每个组件的渲染函数被执行时，都会将本组件的 `Watcher` 放到自己所依赖的响应式数据的订阅者列表里，这就相当于完成了订阅，一般这个过程被称为依赖收集（`Dependency Collect`）。
- 组件渲染函数执行的结果是生成虚拟 `DOM` 树（`Virtual DOM Tree`），这个树生成后将被映射为浏览器上的真实的 DOM 树，也就是用户所看到的页面视图。
- 当响应式数据发生变化的时候，也就是触发了 `setter` 时，`setter` 会负责通知（`Notify`）该数据的订阅者列表里的 `Watcher`，`Watcher` 会触发组件重渲染（`Trigger re-render`）来更新（`update`）视图。

我们可以看看 Vue 的源码：

```js
// src/core/observer/index.js 响应式化过程

Object.defineProperty(obj, key, {
  enumerable: true,
  configurable: true,
  get: function reactiveGetter() {
    // ...
    const value = getter ? getter.call(obj) : val; // 如果原本对象拥有getter方法则执行
    dep.depend(); // 进行依赖收集，dep.addSub
    return value;
  },
  set: function reactiveSetter(newVal) {
    // ...
    if (setter) {
      setter.call(obj, newVal);
    } // 如果原本对象拥有setter方法则执行
    dep.notify(); // 如果发生变更，则通知更新
  },
});
```

> 而这个 `dep` 上的 `depend` 和 `notify` 就是订阅和发布通知的具体方法。

- 简单来说，响应式数据是消息的发布者，而视图层是消息的订阅者，如果数据更新了，那么发布者会发布数据更新的消息来通知视图更新，从而实现数据层和视图层的双向绑定。

**6\. 发布-订阅模式的优缺点**

发布-订阅模式最大的优点就是解耦：

- 时间上的解耦 ：注册的订阅行为由消息的发布方来决定何时调用，订阅者不用持续关注，当消息发生时发布者会负责通知；
- 对象上的解耦 ：发布者不用提前知道消息的接受者是谁，发布者只需要遍历处理所有订阅该消息类型的订阅者发送消息即可（迭代器模式），由此解耦了发布者和订阅者之间的联系，互不持有，都依赖于抽象，不再依赖于具体；
- 由于它的解耦特性，发布-订阅模式的使用场景一般是：当一个对象的改变需要同时改变其它对象，并且它不知道具体有多少对象需要改变。发布-订阅模式还可以帮助实现一些其他的模式，比如中介者模式。

**发布-订阅模式也有缺点：**

- 增加消耗 ：创建结构和缓存订阅者这两个过程需要消耗计算和内存资源，即使订阅后始终没有触发，订阅者也会始终存在于内存；
- 增加复杂度 ：订阅者被缓存在一起，如果多个订阅者和发布者层层嵌套，那么程序将变得难以追踪和调试，参考一下 Vue 调试的时候你点开原型链时看到的那堆 deps/subs/watchers 们…
- 缺点主要在于理解成本、运行效率、资源消耗，特别是在多级发布-订阅时，情况会变得更复杂。

**7\. 其他相关模式** **7.1 发布-订阅模式和观察者模式**

观察者模式与发布-订阅者模式，在平时你可以认为他们是一个东西，但是某些场合（比如面试）下可能需要稍加注意，借用网上一张流行的图：

![](https://s.poetries.top/gitee/2020/07/104.png)

区别主要在发布-订阅模式中间的这个 Event Channel：

- 观察者模式 中的观察者和被观察者之间还存在耦合，被观察者还是知道观察者的；
- 发布-订阅模式 中的发布者和订阅者不需要知道对方的存在，他们通过消息代理来进行通信，解耦更加彻底；

**7.2 发布-订阅模式和责任链模式**

发布-订阅模式和责任链模式也有点类似，主要区别在于：

- 发布-订阅模式 传播的消息是根据需要随时发生变化，是发布者和订阅者之间约定的结构，在多级发布-订阅的场景下，消息可能完全不一样；
- 责任链模式 传播的消息是不变化的，即使变化也是在原来的消息上稍加修正，不会大幅改变结构；

## 策略模式

> 略模式 （Strategy Pattern）又称政策模式，其定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换。封装的策略算法一般是独立的，策略模式根据输入来调整采用哪个算法。关键是策略的实现和使用分离

**1\. 你曾见过的策略模式**

- 现在电子产品种类繁多，尺寸多种多样，有时候你会忍不住想拆开看看里面啥样（想想小时候拆的玩具车还有遥控器），但是螺丝规格很多，螺丝刀尺寸也不少，如果每碰到一种规格就买一个螺丝刀，家里就得堆满螺丝刀了。所以现在人们都用多功能的螺丝刀套装，螺丝刀把只需要一个，碰到不同规格的螺丝只要换螺丝刀头就行了，很方便，体积也变小很多。
- 再举个栗子，一辆车的轮胎有很多规格，在泥泞路段开的多的时候可以用泥地胎，在雪地开得多可以用雪地胎，高速公路上开的多的时候使用高性能轮胎，针对不同使用场景更换不同的轮胎即可，不需更换整个车。
- 这些都是策略模式的实例，螺丝刀/车属于封装上下文，封装和使用不同的螺丝刀头/轮胎，螺丝刀头/轮胎这里就相当于策略，可以根据需求不同来更换不同的使用策略。

在这些场景中，有以下特点：

- 螺丝刀头/轮胎（策略）之间相互独立，但又可以相互替换；
- 螺丝刀/车（封装上下文）可以根据需要的不同选用不同的策略；

**2\. 实例的代码实现**

具体的例子我们用编程上的例子来演示，比较好量化。

> 场景是这样的，某个电商网站希望举办一个活动，通过打折促销来销售库存物品，有的商品满 100 减 30，有的商品满 200 减 80，有的商品直接 8 折出售（想起被双十一支配的恐惧），这样的逻辑交给我们，我们要怎样去实现呢。

```js
function priceCalculate(discountType, price) {
  if (discountType === "minus100_30") {
    // 满100减30
    return price - Math.floor(price / 100) * 30;
  } else if (discountType === "minus200_80") {
    // 满200减80
    return price - Math.floor(price / 200) * 80;
  } else if (discountType === "percent80") {
    // 8折
    return price * 0.8;
  }
}

priceCalculate("minus100_30", 270); // 输出: 210
priceCalculate("percent80", 250); // 输出: 200
```

> 通过判断输入的折扣类型来计算商品总价的方式，几个 `if-else` 就满足了需求，但是这样的做法的缺点也很明显：

- `priceCalculate` 函数随着折扣类型的增多，`if-else` 判断语句会变得越来越臃肿；
- 如果增加了新的折扣类型或者折扣类型的算法有所改变，那么需要更改 `priceCalculate` 函数的实现，这是违反开放封闭原则的；
- 可复用性差，如果在其他的地方也有类似这样的算法，但规则不一样，上述代码不能复用；
- 我们可以改造一下，将计算折扣的算法部分提取出来保存为一个对象，折扣的类型作为 `key`，这样索引的时候通过对象的键值索引调用具体的算法：

```js
const DiscountMap = {
  minus100_30: function (price) {
    return price - Math.floor(price / 100) * 30;
  },
  minus200_80: function (price) {
    return price - Math.floor(price / 200) * 80;
  },
  percent80: function (price) {
    return price * 0.8;
  },
};

/* 计算总售价*/
function priceCalculate(discountType, price) {
  return DiscountMap[discountType] && DiscountMap[discountType](price);
}

priceCalculate("minus100_30", 270);
priceCalculate("percent80", 250);

// 输出: 210
// 输出: 200
```

这样算法的实现和算法的使用就被分开了，想添加新的算法也变得十分简单：

```js
DiscountMap.minus150_40 = function (price) {
  return price - Math.floor(price / 150) * 40;
};
```

如果你希望计算算法隐藏起来，那么可以借助 IIFE 使用闭包的方式，这时需要添加增加策略的入口，以方便扩展：

```js
const PriceCalculate = (function () {
  /* 售价计算方式 */
  const DiscountMap = {
    minus100_30: function (price) {
      // 满100减30
      return price - Math.floor(price / 100) * 30;
    },
    minus200_80: function (price) {
      // 满200减80
      return price - Math.floor(price / 200) * 80;
    },
    percent80: function (price) {
      // 8折
      return price * 0.8;
    },
  };

  return {
    priceClac: function (discountType, price) {
      return DiscountMap[discountType] && DiscountMap[discountType](price);
    },
    addStrategy: function (discountType, fn) {
      // 注册新计算方式
      if (DiscountMap[discountType]) return;
      DiscountMap[discountType] = fn;
    },
  };
})();

PriceCalculate.priceClac("minus100_30", 270); // 输出: 210

PriceCalculate.addStrategy("minus150_40", function (price) {
  return price - Math.floor(price / 150) * 40;
});
PriceCalculate.priceClac("minus150_40", 270); // 输出: 230
```

这样算法就被隐藏起来，并且预留了增加策略的入口，便于扩展。

**3\. 策略模式的通用实现**

- 根据上面的例子提炼一下策略模式，折扣计算方式可以被认为是策略（Strategy），这些策略之间可以相互替代，而具体折扣的计算过程可以被认为是封装上下文（Context），封装上下文可以根据需要选择不同的策略。

主要有下面几个概念：

- Context ：封装上下文，根据需要调用需要的策略，屏蔽外界对策略的直接调用，只对外提供一个接口，根据需要调用对应的策略；
- Strategy ：策略，含有具体的算法，其方法的外观相同，因此可以互相代替；
- StrategyMap ：所有策略的合集，供封装上下文调用；

结构图如下：

![](https://s.poetries.top/gitee/2020/07/105.png)

下面使用通用化的方法实现一下。

```js
const StrategyMap = {};

function context(type, ...rest) {
  return StrategyMap[type] && StrategyMap[type](...rest);
}

StrategyMap.minus100_30 = function (price) {
  return price - Math.floor(price / 100) * 30;
};

context("minus100_30", 270); // 输出: 210
```

通用实现看起来似乎比较简单，这里分享一下项目实战。

**4\. 实战中的策略模式** **4.1 表格 formatter**

> 这里举一个 `Vue + ElementUI` 项目中用到的例子，其他框架的项目原理也类似，和大家分享一下。

- `Element` 的表格控件的 `Column` 接受一个 `formatter` 参数，用来格式化内容，其类型为函数，并且还可以接受几个特定参数，像这样： `Function(row, column, cellValue, index)`。
- 以文件大小转化为例，后端经常会直接传 `bit` 单位的文件大小，那么前端需要根据后端的数据，根据需求转化为自己需要的单位的文件大小，比如 `KB/MB`。

首先实现文件计算的算法：

```js
export const StrategyMap = {
  /* Strategy 1: 将文件大小（bit）转化为 KB */
  bitToKB: (val) => {
    const num = Number(val);
    return isNaN(num) ? val : (num / 1024).toFixed(0) + "KB";
  },
  /* Strategy 2: 将文件大小（bit）转化为 MB */
  bitToMB: (val) => {
    const num = Number(val);
    return isNaN(num) ? val : (num / 1024 / 1024).toFixed(1) + "MB";
  },
};

/* Context: 生成el表单 formatter */
const strategyContext = function (type, rowKey) {
  return function (row, column, cellValue, index) {
    StrategyMap[type](row[rowKey]);
  };
};

export default strategyContext;
```

那么在组件中我们可以直接：

```js
<template>
    <el-table :data="tableData">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="name" label="文件名"></el-table-column>
        <!-- 直接调用 strategyContext -->
        <el-table-column prop="sizeKb" label="文件大小(KB)"
                         :formatter='strategyContext("bitToKB", "sizeKb")'>
        </el-table-column>
        <el-table-column prop="sizeMb" label="附件大小(MB)"
                         :formatter='strategyContext("bitToMB", "sizeMb")'>
        </el-table-column>
    </el-table>
</template>

<script type='text/javascript'>
    import strategyContext from './strategyContext.js'

    export default {
        name: 'ElTableDemo',
        data() {
            return {
                strategyContext,
                tableData: [
                    { date: '2019-05-02', name: '文件1', sizeKb: 1234, sizeMb: 1234426 },
                    { date: '2019-05-04', name: '文件2', sizeKb: 4213, sizeMb: 8636152 }]
            }
        }
    }
</script>

<style scoped></style>
```

运行结果如下图：

![](https://s.poetries.top/gitee/2020/07/106.png)

**4.2 表单验证**

- 除了表格中的 `formatter` 之外，策略模式也经常用在表单验证的场景，这里举一个 `Vue + ElementUI` 项目的例子，其他框架同理。
- `ElementUI` 的 `Form` 表单 具有表单验证功能，用来校验用户输入的表单内容。实际需求中表单验证项一般会比较复杂，所以需要给每个表单项增加 `validator` 自定义校验方法。
- 我们可以像官网示例一样把表单验证都写在组件的状态 data 函数中，但是这样就不好复用使用频率比较高的表单验证方法了，这时我们可以结合策略模式和函数柯里化的知识来重构一下。首先我们在项目的工具模块（一般是 utils 文件夹）实现通用的表单验证方法：

```js
// src/utils/validates.js

/* 姓名校验 由2-10位汉字组成 */
export function validateUsername(str) {
    const reg = /^[\u4e00-\u9fa5]{2,10}$/
    return reg.test(str)
}

/* 手机号校验 由以1开头的11位数字组成  */
export function validateMobile(str) {
    const reg = /^1\d{10}$/
    return reg.test(str)
}

/* 邮箱校验 */
export function validateEmail(str) {
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    return reg.test(str)
}
然后在 utils/index.js 中增加一个柯里化方法，用来生成表单验证函数：

// src/utils/index.js

import * as Validates from './validates.js'

/* 生成表格自定义校验函数 */
export const formValidateGene = (key, msg) => (rule, value, cb) => {
    if (Validates[key](value)) {
        cb()
    } else {
        cb(new Error(msg))
    }
}
```

> 上面的 `formValidateGene` 函数接受两个参数，第一个是验证规则，也就是 `src/utils/validates.js` 文件中提取出来的通用验证规则的方法名，第二个参数是报错的话表单验证的提示信息。

```js
<template>
    <el-form ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm"
             :rules="rules"
             :model="ruleForm">

        <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
    </el-form>
</template>

<script type='text/javascript'>
    import * as Utils from '../utils'

    export default {
        name: 'ElTableDemo',
        data() {
            return {
                ruleForm: { pass: '', checkPass: '', age: '' },
                rules: {
                    username: [{
                        validator: Utils.formValidateGene('validateUsername', '姓名由2-10位汉字组成'),
                        trigger: 'blur'
                    }],
                    mobile: [{
                        validator: Utils.formValidateGene('validateMobile', '手机号由以1开头的11位数字组成'),
                        trigger: 'blur'
                    }],
                    email: [{
                        validator: Utils.formValidateGene('validateEmail', '不是正确的邮箱格式'),
                        trigger: 'blur'
                    }]
                }
            }
        }
    }
</script>
```

可以看见在使用的时候非常方便，把表单验证方法提取出来作为策略，使用柯里化方法动态选择表单验证方法，从而对策略灵活运用，大大加快开发效率。

运行结果：

![](https://s.poetries.top/gitee/2020/07/107.png)

**5\. 策略模式的优缺点**

**策略模式将算法的实现和使用拆分，这个特点带来了很多优点：**

- 策略之间相互独立，但策略可以自由切换，这个策略模式的特点给策略模式带来很多灵活性，也提高了策略的复用率；
- 如果不采用策略模式，那么在选策略时一般会采用多重的条件判断，采用策略模式可以避免多重条件判断，增加可维护性；
- 可扩展性好，策略可以很方便的进行扩展；

**策略模式的缺点：**

- 策略相互独立，因此一些复杂的算法逻辑无法共享，造成一些资源浪费；
- 如果用户想采用什么策略，必须了解策略的实现，因此所有策略都需向外暴露，这是违背迪米特法则/最少知识原则的，也增加了用户对策略对象的使用成本。

**6\. 策略模式的适用场景** 那么应该在什么场景下使用策略模式呢：

- 多个算法只在行为上稍有不同的场景，这时可以使用策略模式来动态选择算法；
- 算法需要自由切换的场景；
- 有时需要多重条件判断，那么可以使用策略模式来规避多重条件判断的情况；

**7\. 其他相关模式** **7.1 策略模式和模板方法模式**

策略模式和模板方法模式的作用比较类似，但是结构和实现方式有点不一样。

- 策略模式 让我们在程序运行的时候动态地指定要使用的算法；
- 模板方法模式 是在子类定义的时候就已经确定了使用的算法；

**7.2 策略模式和享元模式**

见享元模式中的介绍

## 状态模式

## 模板方法模式：咖啡厅制作咖啡

## 迭代器模式：银行的点钞机

## 命令模式：江湖通缉令

## 职责链模式：领导，我想请个假

## 中介者模式：找媒人介绍对象
