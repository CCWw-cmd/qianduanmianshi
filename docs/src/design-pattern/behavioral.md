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

> 状态模式 （State Pattern）允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类，类的行为随着它的状态改变而改变。

当程序需要根据不同的外部情况来做出不同操作时，最直接的方法就是使用 switch-case 或 if-else 语句将这些可能发生的情况全部兼顾到，但是这种做法应付复杂一点的状态判断时就有点力不从心，开发者得找到合适的位置添加或修改代码，这个过程很容易出错，这时引入状态模式可以某种程度上缓解这个问题

**1\. 你曾见过的状态模式**

等红绿灯的时候，红绿灯的状态和行人汽车的通行逻辑是有关联的：

- 红灯亮：行人通行，车辆等待；
- 绿灯亮：行人等待，车辆通行；
- 黄灯亮：行人等待，车辆等待；

![](https://s.poetries.top/gitee/2020/07/108.png)

> 还有下载文件的时候，就有好几个状态，比如下载验证、下载中、暂停下载、下载完毕、失败，文件在不同状态下表现的行为也不一样，比如下载中时显示可以暂停下载和下载进度，下载失败时弹框提示并询问是否重新下载等等。类似的场景还有很多，比如电灯的开关状态、电梯的运行状态等，女生作为你的朋友、好朋友、女朋友、老婆等不同状态的时候，行为也不同 。

在这些场景中，有以下特点：

- 对象有有限多个状态，且状态间可以相互切换；
- 各个状态和对象的行为逻辑有比较强的对应关系，即在不同状态时，对应的处理逻辑不一样；

**2\. 实例的代码实现**

我们使用 JavaScript 来将上面的交通灯例子实现一下。

先用 IIFE 的方式：

```js
// 反模式，不推介
var trafficLight = (function () {
  var state = "绿灯"; // 闭包缓存状态

  return {
    /* 设置交通灯状态 */
    setState: function (target) {
      if (target === "红灯") {
        state = "红灯";
        console.log("交通灯颜色变为 红色，行人通行 & 车辆等待");
      } else if (target === "黄灯") {
        state = "黄灯";
        console.log("交通灯颜色变为 黄色，行人等待 & 车辆等待");
      } else if (target === "绿灯") {
        state = "绿灯";
        console.log("交通灯颜色变为 绿色，行人等待 & 车辆通行");
      } else {
        console.error("交通灯还有这颜色？");
      }
    },

    /* 获取交通灯状态 */
    getState: function () {
      return state;
    },
  };
})();

trafficLight.setState("红灯"); // 输出： 交通灯颜色变为 红色，行人通行 & 车辆等待
trafficLight.setState("黄灯"); // 输出： 交通灯颜色变为 黄色，行人等待 & 车辆等待
trafficLight.setState("绿灯"); // 输出： 交通灯颜色变为 绿色，行人等待 & 车辆通行

trafficLight.setState("紫灯"); // 输出： 交通灯还有这颜色？
```

- 在模块模式里面通过 `if-else` 来区分不同状态的处理逻辑，也可以使用 `switch-case`
- 但是这个实现存在有问题，这里的处理逻辑还不够复杂，如果复杂的话，在添加新的状态时，比如增加了 蓝灯、紫灯 等颜色及其处理逻辑的时候，需要到 `setState` 方法里找到对应地方修改。在实际项目中，`if-else` 伴随的业务逻辑处理通常比较复杂，找到要修改的状态就不容易，特别是如果是别人的代码，或者接手遗留项目时，需要看完这个 `if-else` 的分支处理逻辑，新增或修改分支逻辑的过程中也很容易引入 `Bug`。
- 那有没有什么方法可以方便地维护状态及其对应行为，又可以不用维护一个庞大的分支判断逻辑呢。这就引入了状态模式的理念，状态模式把每种状态和对应的处理逻辑封装在一起（后文为了统一，统称封装到状态类中），比如下面我们用一个类实例将逻辑封装起来：

```js
/* 抽象状态类 */
var AbstractState = function () {};

/* 抽象方法 */
AbstractState.prototype.employ = function () {
  throw new Error("抽象方法不能调用!");
};

/* 交通灯状态类 */
var State = function (name, desc) {
  this.color = { name, desc };
};

State.prototype = new AbstractState();
State.prototype.employ = function (trafficLight) {
  console.log("交通灯颜色变为 " + this.color.name + "，" + this.color.desc);
  trafficLight.setState(this);
};

/* 交通灯类 */
var TrafficLight = function () {
  this.state = null;
};

/* 获取交通灯状态 */
TrafficLight.prototype.getState = function () {
  return this.state;
};

/* 设置交通灯状态 */
TrafficLight.prototype.setState = function (state) {
  this.state = state;
};

// 实例化一个红绿灯
var trafficLight = new TrafficLight();

// 实例化红绿灯可能有的三种状态
var redState = new State("红色", "行人等待 & 车辆等待");
var greenState = new State("绿色", "行人等待 & 车辆通行");
var yellowState = new State("黄色", "行人等待 & 车辆等待");

redState.employ(trafficLight); // 输出： 交通灯颜色变为 红色，行人通行 & 车辆等待
yellowState.employ(trafficLight); // 输出： 交通灯颜色变为 黄色，行人等待 & 车辆等待
greenState.employ(trafficLight); // 输出： 交通灯颜色变为 绿色，行人等待 & 车辆通行
```

> 这里的不同状态是同一个类的类实例，比如 `redState` 这个类实例，就把所有红灯状态处理的逻辑封装起来，如果要把状态切换为红灯状态，那么只需要 `r`edState.employ()\` 把交通灯的状态切换为红色，并且把交通灯对应的行为逻辑也切换为红灯状态。

- 如果你看过前面的策略模式，是不是感觉到有那么一丝似曾相识，策略模式把可以相互替换的策略算法提取出来，而状态模式把事物的状态及其行为提取出来。
- 这里我们使用 `ES6` 的 `Class` 语法改造一下：

```js
/* 抽象状态类 */
class AbstractState {
  constructor() {
    if (new.target === AbstractState) {
      throw new Error("抽象类不能直接实例化!");
    }
  }

  /* 抽象方法 */
  employ() {
    throw new Error("抽象方法不能调用!");
  }
}

/* 交通灯类 */
class State extends AbstractState {
  constructor(name, desc) {
    super();
    this.color = { name, desc };
  }

  /* 覆盖抽象方法 */
  employ(trafficLight) {
    console.log("交通灯颜色变为 " + this.color.name + "，" + this.color.desc);
    trafficLight.setState(this);
  }
}

/* 交通灯类 */
class TrafficLight {
  constructor() {
    this.state = null;
  }

  /* 获取交通灯状态 */
  getState() {
    return this.state;
  }

  /* 设置交通灯状态 */
  setState(state) {
    this.state = state;
  }
}

const trafficLight = new TrafficLight();

const redState = new State("红色", "行人等待 & 车辆等待");
const greenState = new State("绿色", "行人等待 & 车辆通行");
const yellowState = new State("黄色", "行人等待 & 车辆等待");

redState.employ(trafficLight); // 输出： 交通灯颜色变为 红色，行人通行 & 车辆等待
yellowState.employ(trafficLight); // 输出： 交通灯颜色变为 黄色，行人等待 & 车辆等待
greenState.employ(trafficLight); // 输出： 交通灯颜色变为 绿色，行人等待 & 车辆通行
```

如果要新建状态，不用修改原有代码，只要加上下面的代码：

```js
// 接上面

const blueState = new State("蓝色", "行人倒立 & 车辆飞起");

blueState.employ(trafficLight); // 输出： 交通灯颜色变为 蓝色，行人倒立 & 车辆飞起
```

传统的状态区分一般是基于状态类扩展的不同状态类，如何实现实现看需求具体了，比如逻辑比较复杂，通过新建状态实例的方法已经不能满足需求，那么可以使用状态类的方式。

这里提供一个状态类的实现，同时引入状态的切换逻辑：

```js
/* 抽象状态类 */
class AbstractState {
  constructor() {
    if (new.target === AbstractState) {
      throw new Error("抽象类不能直接实例化!");
    }
  }

  /* 抽象方法 */
  employ() {
    throw new Error("抽象方法不能调用!");
  }

  changeState() {
    throw new Error("抽象方法不能调用!");
  }
}

/* 交通灯类-红灯 */
class RedState extends AbstractState {
  constructor() {
    super();
    this.colorState = "红色";
  }

  /* 覆盖抽象方法 */
  employ() {
    console.log("交通灯颜色变为 " + this.colorState + "，行人通行 & 车辆等待");
    // const redDom = document.getElementById('color-red')    // 业务相关操作
    //         // redDom.click()
  }

  changeState(trafficLight) {
    trafficLight.setState(trafficLight.yellowState);
  }
}

/* 交通灯类-绿灯 */
class GreenState extends AbstractState {
  constructor() {
    super();
    this.colorState = "绿色";
  }

  /* 覆盖抽象方法 */
  employ() {
    console.log("交通灯颜色变为 " + this.colorState + "，行人等待 & 车辆通行");
    // const greenDom = document.getElementById('color-green')
    // greenDom.click()
  }

  changeState(trafficLight) {
    trafficLight.setState(trafficLight.redState);
  }
}

/* 交通灯类-黄灯 */
class YellowState extends AbstractState {
  constructor() {
    super();
    this.colorState = "黄色";
  }

  /* 覆盖抽象方法 */
  employ() {
    console.log("交通灯颜色变为 " + this.colorState + "，行人等待 & 车辆等待");
    // const yellowDom = document.getElementById('color-yellow')
    // yellowDom.click()
  }

  changeState(trafficLight) {
    trafficLight.setState(trafficLight.greenState);
  }
}

/* 交通灯类 */
class TrafficLight {
  constructor() {
    this.redState = new RedState();
    this.greenState = new GreenState();
    this.yellowState = new YellowState();

    this.state = this.greenState;
  }

  /* 设置交通灯状态 */
  setState(state) {
    state.employ(this);
    this.state = state;
  }

  changeState() {
    this.state.changeState(this);
  }
}

const trafficLight = new TrafficLight();

trafficLight.changeState(); // 输出： 交通灯颜色变为 红色，行人通行 & 车辆等待
trafficLight.changeState(); // 输出： 交通灯颜色变为 黄色，行人等待 & 车辆等待
trafficLight.changeState(); // 输出： 交通灯颜色变为 绿色，行人等待 & 车辆通行
```

如果我们要增加新的交通灯颜色，也是很方便的：

```js
// 接上面

/* 交通灯类-蓝灯 */
class BlueState extends AbstractState {
  constructor() {
    super();
    this.colorState = "蓝色";
  }

  /* 覆盖抽象方法 */
  employ() {
    console.log("交通灯颜色变为 " + this.colorState + "，行人倒立 & 车辆飞起");
    const redDom = document.getElementById("color-blue");
    redDom.click();
  }
}

const blueState = new BlueState();

trafficLight.employ(blueState); // 输出： 交通灯颜色变为 蓝色，行人倒立 & 车辆飞起
```

对原来的代码没有修改，非常符合开闭原则了。

**3\. 状态模式的原理**

- 所谓对象的状态，通常指的就是对象实例的属性的值。行为指的就是对象的功能，行为大多可以对应到方法上。状态模式把状态和状态对应的行为从原来的大杂烩代码中分离出来，把每个状态所对应的功能处理封装起来，这样选择不同状态的时候，其实就是在选择不同的状态处理类。
- 也就是说，状态和行为是相关联的，它们的关系可以描述总结成：状态决定行为。由于状态是在运行期被改变的，因此行为也会在运行期根据状态的改变而改变，看起来，同一个对象，在不同的运行时刻，行为是不一样的，就像是类被修改了一样。
- 为了提取不同的状态类共同的外观，可以给状态类定义一个共同的状态接口或抽象类，正如之前最后的两个代码示例一样，这样可以面向统一的接口编程，无须关心具体的状态类实现。

**4\. 状态模式的优缺点** **状态模式的优点：**

- 结构相比之下清晰，避免了过多的 `switch-case` 或 `if-else` 语句的使用，避免了程序的复杂性提高系统的可维护性;
- 符合开闭原则，每个状态都是一个子类，增加状态只需增加新的状态类即可，修改状态也只需修改对应状态类就可以了；
- 封装性良好，状态的切换在类的内部实现，外部的调用无需知道类内部如何实现状态和行为的变换。

**状态模式的缺点：**

- 引入了多余的类，每个状态都有对应的类，导致系统中类的个数增加。

**5\. 状态模式的适用场景**

- 操作中含有庞大的多分支的条件语句，且这些分支依赖于该对象的状态，那么可以使用状态模式来将分支的处理分散到单独的状态类中；
- 对象的行为随着状态的改变而改变，那么可以考虑状态模式，来把状态和行为分离，虽然分离了，但是状态和行为是对应的，再通过改变状态调用状态对应的行为；

**6\. 其他相关模式** **6.1 状态模式和策略模式**

状态模式和策略模式在之前的代码就可以看出来，看起来比较类似，他们的区别：

- 状态模式： 重在强调对象内部状态的变化改变对象的行为，状态类之间是平行的，无法相互替换；
- 策略模式： 策略的选择由外部条件决定，策略可以动态的切换，策略之间是平等的，可以相互替换；
- 状态模式的状态类是平行的，意思是各个状态类封装的状态和对应的行为是相互独立、没有关联的，封装的业务逻辑可能差别很大毫无关联，相互之间不可替换。但是策略模式中的策略是平等的，是同一行为的不同描述或者实现，在同一个行为发生的时候，可以根据外部条件挑选任意一个实现来进行处理。

**6.2 状态模式和发布-订阅模式**

- 这两个模式都是在状态发生改变的时候触发行为，不过发布-订阅模式的行为是固定的，那就是通知所有的订阅者，而状态模式是根据状态来选择不同的处理逻辑。
- 状态模式： 根据状态来分离行为，当状态发生改变的时候，动态地改变行为；
- 发布-订阅模式： 发布者在消息发生时通知订阅者，具体如何处理则不在乎，或者直接丢给用户自己处理；
- 这两个模式是可以组合使用的，比如在发布-订阅模式的发布消息部分，当对象的状态发生了改变，触发通知了所有的订阅者后，可以引入状态模式，根据通知过来的状态选择相应的处理。

**6.3 状态模式和单例模式**

> 之前的示例代码中，状态类每次使用都 `new` 出来一个状态实例，实际上使用同一个实例即可，因此可以引入单例模式，不同的状态类可以返回的同一个实例。

## 模板方法模式：咖啡厅制作咖啡

> 模板方法模式（Template Method Pattern）父类中定义一组操作算法骨架，而将一些实现步骤延迟到子类中，使得子类可以不改变父类的算法结构的同时，重新定义算法中的某些实现步骤。模板方法模式的关键是算法步骤的骨架和具体实现分离。

**1\. 你曾见过的模板方法模式**

这里举个经典的咖啡厅例子，咖啡厅制作饮料的过程有一些类似的步骤：

- 先把水煮沸
- 冲泡饮料（咖啡、茶、牛奶）
- 倒进杯子中
- 最后加一些调味料（咖啡伴侣、枸杞、糖）
- 无论冲饮的是咖啡、茶、牛奶，他们的制作过程都类似，可以被总结为这几个流程。也就是说这个流程是存在着类似的流程结构的，这就给我们留下了将操作流程抽象封装出来的余地。

![](https://s.poetries.top/gitee/2020/07/109.png)

再举个栗子，做菜的过程也可以被总结为固定的几个步骤：

- 准备食材（肉、蔬菜、菌菇）
- 食材放到锅里
- 放调味料（糖、盐、油）
- 炒菜
- 倒到容器里（盘子、碗）
- 在类似的场景中，这些例子都有这些特点：

> - 有一个基本的操作流程，这个流程我们可以抽象出来，由具体实例的操作流程来实现，比如做咖啡的时候冲泡的就是咖啡，做茶的时候冲泡的就是茶；
> - 一些共用的流程，就可以使用通用的公共步骤，比如把水煮沸，比如将食材放到锅里，这样的共用流程就可以共用一个具体方法就可以了；

**2\. 实例的代码实现**

> 如果你已经看过抽象工厂模式，那么你对 JavaScript 中面向对象的方式提取公共结构应该比较熟悉了，这里再复习一下。JavaScript 中可以使用下面的方式来模拟抽象类：

```js
/* 抽象类，ES6 class 方式 */
class AbstractClass1 {
  constructor() {
    if (new.target === AbstractClass1) {
      throw new Error("抽象类不能直接实例化!");
    }
  }

  /* 抽象方法 */
  operate() {
    throw new Error("抽象方法不能调用!");
  }
}

/* 抽象类，ES5 构造函数方式 */
var AbstractClass2 = function () {
  if (new.target === AbstractClass2) {
    throw new Error("抽象类不能直接实例化!");
  }
};
/* 抽象方法，使用原型方式添加 */
AbstractClass2.prototype.operate = function () {
  throw new Error("抽象方法不能调用!");
};
```

下面实现一下咖啡厅例子。

首先我们使用原型继承的方式：

```js
/* 饮料类，父类，也是抽象类 */
var Beverage = function () {
  if (new.target === Beverage) {
    throw new Error("抽象类不能直接实例化!");
  }
};

/* 烧开水，共用方法 */
Beverage.prototype.boilWater = function () {
  console.log("水已经煮沸");
};

/* 冲泡饮料，抽象方法 */
Beverage.prototype.brewDrink = function () {
  throw new Error("抽象方法不能调用!");
};

/* 倒杯子里，共用方法 */
Beverage.prototype.pourCup = function () {
  console.log("倒进杯子里");
};

/* 加调味品，抽象方法 */
Beverage.prototype.addCondiment = function () {
  throw new Error("抽象方法不能调用!");
};

/* 制作流程，模板方法 */
Beverage.prototype.init = function () {
  this.boilWater();
  this.brewDrink();
  this.pourCup();
  this.addCondiment();
};

/* 咖啡类，子类 */
var Coffee = function () {};
Coffee.prototype = new Beverage();

/* 冲泡饮料，实现抽象方法 */
Coffee.prototype.brewDrink = function () {
  console.log("冲泡咖啡");
};

/* 加调味品，实现抽象方法 */
Coffee.prototype.addCondiment = function () {
  console.log("加点咖啡伴侣");
};

var coffee = new Coffee();
coffee.init();

// 输出：水已经煮沸
// 输出：冲泡咖啡
// 输出：倒进杯子里
// 输出：加点咖啡伴侣
```

我们用 `ES6` 的 `class` 方式来改写一下：

```js
/* 饮料类，父类 */
class Beverage {
  constructor() {
    if (new.target === Beverage) {
      throw new Error("抽象类不能直接实例化!");
    }
  }

  /* 烧开水，共用方法 */
  boilWater() {
    console.log("水已经煮沸");
  }

  /* 冲泡饮料，抽象方法 */
  brewDrink() {
    throw new Error("抽象方法不能调用!");
  }

  /* 倒杯子里，共用方法 */
  pourCup() {
    console.log("倒进杯子里");
  }

  /* 加调味品，抽象方法 */
  addCondiment() {
    throw new Error("抽象方法不能调用!");
  }

  /* 制作流程，模板方法 */
  init() {
    this.boilWater();
    this.brewDrink();
    this.pourCup();
    this.addCondiment();
  }
}

/* 咖啡类，子类 */
class Coffee extends Beverage {
  constructor() {
    super();
  }

  /* 冲泡饮料，实现抽象方法 */
  brewDrink() {
    console.log("冲泡咖啡");
  }

  /* 加调味品，实现抽象方法 */
  addCondiment() {
    console.log("加点咖啡伴侣");
  }
}

const coffee = new Coffee();
coffee.init();

// 输出：水已经煮沸
// 输出：冲泡咖啡
// 输出：倒进杯子里
// 输出：加点咖啡伴侣
```

> 如果需要创建一个新的饮料，那么增加一个新的实例类，并实现父类中的抽象方法。如果不实现就去调用 `init` 方法即报错：

```js
// 接上一段代码
/* 茶类，子类 */
class Tea extends Beverage {
  constructor() {
    super();
  }

  /* 冲泡饮料，实现抽象方法 */
  brewDrink() {
    console.log("冲泡茶");
  }

  /* 注意这里，没有实现加调味品抽象方法 */
}

const tea = new Tea();
tea.init();

// 输出：水已经煮沸
// 输出：冲泡茶
// 输出：倒进杯子里
// Error: 抽象方法不能调用!
```

> 那么这样就把冲泡饮料的流程框架抽象到了 `init` 方法中，在实例类中实现对应抽象方法，调用实例的 `init` 方法时就会调用覆盖后的实例方法，实现可变流程的扩展。

- 在灵活的 JavaScript 中，其实我们还可以使用默认参数来间接实现：

```js
/* 虚拟方法 */
const abstractFunc = function () {
  throw new Error("抽象方法不能调用!");
};

/* 饮料方法，方法体就是模板方法，即上面的 init() */
function BeverageFunc({
  boilWater = function () {
    // 烧开水，共用方法
    console.log("水已经煮沸");
  },
  brewDrink = abstractFunc, // 冲泡饮料，抽象方法
  pourCup = function () {
    // 倒杯子里，共用方法
    console.log("倒进杯子里");
  },
  addCondiment = abstractFunc, // 加调味品，抽象方法
}) {
  boilWater();
  brewDrink();
  pourCup();
  addCondiment();
}

/* 制作咖啡 */
BeverageFunc({
  /* 冲泡饮料，实现抽象方法 */
  brewDrink: function () {
    console.log("水已经煮沸");
  },

  /* 加调味品，实现抽象方法 */
  addCondiment: function () {
    console.log("加点咖啡伴侣");
  },
});

// 输出：水已经煮沸
// 输出：冲泡咖啡
// 输出：倒进杯子里
// 输出：加点咖啡伴侣
```

> 但是这样实现语义化并不太好，我们可以把默认参数用在构造函数中，这样可以使用 `new` 关键字来创建实例，语义化良好，也符合直觉：

```js
/* 虚拟方法 */
const abstractFunc = function () {
  throw new Error("抽象方法不能调用!");
};

/* 饮料方法 */
class Beverage {
  constructor({
    brewDrink = abstractFunc, // 冲泡饮料，抽象方法
    addCondiment = abstractFunc, // 加调味品，抽象方法
  }) {
    this.brewDrink = brewDrink;
    this.addCondiment = addCondiment;
  }

  /* 烧开水，共用方法 */
  boilWater() {
    console.log("水已经煮沸");
  }

  /* 倒杯子里，共用方法 */
  pourCup() {
    console.log("倒进杯子里");
  }

  /* 模板方法 */
  init() {
    this.boilWater();
    this.brewDrink();
    this.pourCup();
    this.addCondiment();
  }
}

/* 咖啡 */
const coffee = new Beverage({
  /* 冲泡饮料，覆盖抽象方法 */
  brewDrink: function () {
    console.log("水已经煮沸");
  },

  /* 加调味品，覆盖抽象方法 */
  addCondiment: function () {
    console.log("加点咖啡伴侣");
  },
});

coffee.init(); // 执行模板方法

// 输出：水已经煮沸
// 输出：冲泡咖啡
// 输出：倒进杯子里
// 输出：加点咖啡伴侣
```

这样通过构造函数默认参数来实现类似于继承的功能。

**3\. 模板方法模式的通用实现**

> 根据上面的例子，我们可以提炼一下模板方法模式。饮料类可以被认为是父类（AbstractClass），父类中实现了模板方法（templateMethod），模板方法中抽象了操作的流程，共用的操作流程是普通方法，而非共用的可变方法是抽象方法，需要被子类（ConcreteClass）实现，或者说覆盖，子类在实例化后执行模板方法，就可以按照模板方法定义好的算法一步步执行。主要有下面几个概念：

- `AbstractClass` ：抽象父类，把一些共用的方法提取出来，把可变的方法作为抽象类，最重要的是把算法骨架抽象出来为模板方法；
- `templateMethod` ：模板方法，固定了希望执行的算法骨架；
- `ConcreteClass` ：子类，实现抽象父类中定义的抽象方法，调用继承的模板方法时，将执行模板方法中定义的算法流程；

下面用通用的方法实现，这里直接用 `class` 语法：

```js
/* 抽象父类 */
class AbstractClass {
  constructor() {
    if (new.target === AbstractClass) {
      throw new Error("抽象类不能直接实例化!");
    }
  }

  /* 共用方法 */
  operate1() {
    console.log("operate1");
  }

  /* 抽象方法 */
  operate2() {
    throw new Error("抽象方法不能调用!");
  }

  /* 模板方法 */
  templateMethod() {
    this.operate1();
    this.operate2();
  }
}

/* 实例子类，继承抽象父类 */
class ConcreteClass extends AbstractClass {
  constructor() {
    super();
  }

  /* 覆盖抽象方法 operate2 */
  operate2() {
    console.log("operate2");
  }
}

const instance = new ConcreteClass();
instance.templateMethod();

// 输出：operate1
// 输出：operate2
```

使用上面介绍的默认参数的方法：

```js
/* 虚拟方法 */
const abstractFunc = function () {
  throw new Error("抽象方法不能调用!");
};

/* 饮料方法 */
class AbstractClass {
  constructor({
    operate2 = abstractFunc, // 抽象方法
  }) {
    this.operate2 = operate2;
  }

  /* 共用方法 */
  operate1() {
    console.log("operate1");
  }

  /* 模板方法 */
  init() {
    this.operate1();
    this.operate2();
  }
}

/* 实例 */
const instance = new AbstractClass({
  /* 覆盖抽象方法 */
  operate2: function () {
    console.log("operate2");
  },
});

instance.init();

// 输出：operate1
// 输出：operate2
```

> 我们也可以不用构造函数的默认参数，使用高阶函数也是可以的，毕竟 JavaScript 如此灵活。

**4\. 模板方法模式的优缺点**

**模板方法模式的优点：**

- 封装了不变部分，扩展可变部分， 把算法中不变的部分封装到父类中直接实现，而可变的部分由子类继承后再具体实现； 提取了公共代码部分，易于维护， 因为公共的方法被提取到了父类，那么如果我们需要修改算法中不变的步骤时，不需要到每- 一个子类中去修改，只要改一下对应父类即可；
- 行为被父类的模板方法固定， 子类实例只负责执行模板方法，具备可扩展性，符合开闭原则；
- 模板方法模式的缺点：增加了系统复杂度，主要是增加了的抽象类和类间联系，需要做好文档工作；

**5\. 模板方法模式的使用场景**

- 如果知道一个算法所需的关键步骤，而且很明确这些步骤的执行顺序，但是具体的实现是未知的、灵活的，那么这时候就可以使用模板方法模式来将算法步骤的框架抽象出来；
- 重要而复杂的算法，可以把核心算法逻辑设计为模板方法，周边相关细节功能由各个子类实现；
- 模板方法模式可以被用来将子类组件将自己的方法挂钩到高层组件中，也就是钩子，子类组件中的方法交出控制权，高层组件在模板方法中决定何时回调子类组件中的方法，类似的用法场景还有发布-订阅模式、回调函数；

**6\. 其他相关模式** **6.1 模板方法模式与工厂模式**

模板方法模式的实现可以使用工厂模式来获取所需的对象。

另外，模板方法模式和抽象工厂模式比较类似，都是使用抽象类来提取公共部分，不一样的是：

- 抽象工厂模式 提取的是实例的功能结构；
- 模板方法模式 提取的是算法的骨架结构；

## 迭代器模式：银行的点钞机

> 迭代器模式 （Iterator Pattern）用于顺序地访问聚合对象内部的元素，又无需知道对象内部结构。使用了迭代器之后，使用者不需要关心对象的内部构造，就可以按序访问其中的每个元素。

**1\. 什么是迭代器**

银行里的点钞机就是一个迭代器，放入点钞机的钞票里有不同版次的人民币，每张钞票的冠字号也不一样，但当一沓钞票被放入点钞机中，使用者并不关心这些差别，只关心钞票的数量，以及是否有假币。

这里我们使用 JavaScript 的方式来点一下钞：

```js
var bills = [
  "MCK013840031",
  "MCK013840032",
  "MCK013840033",
  "MCK013840034",
  "MCK013840035",
];

bills.forEach(function (bill) {
  console.log("当前钞票的冠字号为 " + bill);
});
```

是不是很简单，这是因为 JavaScript 已经内置了迭代器的实现，在某些个很老的语言中，使用者可能会为了实现迭代器而烦恼，但是在 JavaScript 中则完全不用担心。

**2\. 迭代器的简单实现**

> 前面的 `forEach` 方法是在 `IE9` 之后才原生提供的，那么在 `IE9` 之前的时代里，如何实现一个迭代器呢，我们可以使用 `for` 循环自己实现一个 `forEach`：

```js
var forEach = function (arr, cb) {
  for (var i = 0; i < arr.length; i++) {
    cb.call(arr[i], arr[i], i, arr);
  }
};

forEach(["hello", "world", "!"], function (currValue, idx, arr) {
  console.log("当前值 " + currValue + "，索引为 " + idx);
});

// 输出： 当前值 hello，索引为 0
// 输出： 当前值 world，索引为 1
// 输出： 当前值 !    ，索引为 2
```

**2.1 jQuery 源码中迭代器实现**

> `jQuery` 也提供了一个 `$.each` 的遍历方法：

```js
// jquery 源码 /src/core.js#L246-L265
each: function (obj, callback) {
  var i = 0

// obj 为数组时
if (isArrayLike(obj)) {
    for (; i < obj.length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) {
            break
        }
    }
}

// obj 为对象时
else {
    for (i in obj) {
        if (callback.call(obj[i], i, obj[i]) === false) {
            break
        }
    }
}

return obj
}

// 使用 $.each(\['hello', 'world', '!'\], function(idx, currValue){ console.log('当前值 ' + currValue + '，索引为 ' + idx) })
```

> 这里的源码分为两个部分，前一个部分是形参 `obj` 为数组情况下的处理，使用 `for` 循环，以数组下标依次使用 `call/apply` 传入回调中执行，第二部分是形参 obj 为对象情况下的处理，是使用 `for-in` 循环来获取对象上的属性。另外可以看到如果 `callback.call` 返回的结果是 `false` 的话，这个循环会被 `break`。

> 源码位于： `jquery/src/core.js#L246-L265`

由于处理对象时使用的是 `for-in`，所以原型上的变量也会被遍历出来：

```js
var foo = { paramProto: "原型上的变量" };
var bar = Object.create(foo, {
  paramPrivate: {
    configurable: true,
    enumerable: true,
    value: "自有属性",
    writable: true,
  },
});

$.each(bar, function (key, currValue) {
  console.log("当前值为 「" + currValue + "」，键为 " + key);
});

// 输出： 当前值为 「自有属性」   ，键为 paramPrivate
// 输出： 当前值为 「原型上的属性」，键为 paramProto
```

- 因此可以使用 `hasOwnProperty` 来判断键是否是在原型链上还是对象的自有属性。
- 我们还可以利用如果 `callback.call` 返回的结果是 `false` 则 `break` 的特点，来进行一些操作：

```js
$.each([1, 2, 3, 4, 5], function(idx, currValue) {
    if (currValue > 3)
      return false
    console.log('当前值为 ' + currValue)
})

// 输出：  当前值为 1
// 输出：  当前值为 2
// 输出：  当前值为 3
2.2 underscore 源码中的迭代器实现
underscore 作为兼容到 IE6 的古董级工具库，自然也是有迭代器的实现：

// underscore 源码
_.each = function(obj, iteratee) {
    var i, length

    // obj 为数组时
    if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
            iteratee(obj[i], i, obj)
        }
    }

    // obj 为对象时
    else {
        var keys = _.keys(obj)
        for (i = 0, length = keys.length; i < length; i++) {
            iteratee(obj[keys[i]], keys[i], obj)
        }
    }
    return obj
}

// 使用
_.each(['hello', 'world', '!'], function(currValue, idx, arr) {
    console.log('当前值 ' + currValue + '，索引为 ' + idx)
})
```

- `underscore` 迭代器部分的实现跟 `jQuery` 的差不多，只是回调 `iteratee` 的执行是直接调用，而不是像 jQuery 是使用 `call`，也不像 jQuery 那样提供了迭代终止 `break` 的支持，所以总的来说还是 jQuery 的实现更优。
- 另外，这里 iteratee 变量的命名也可以看出来迭代器的含义。
- 源码位于： `underscore.js#L181-L195`

**3\. JavaScript 原生支持**

- 随着 `JavaScript` 的 `ECMAScript` 标准每年的发展，给越来越多好用的 `API` 提供了支持，比如 `Array` 上的 `filter`、`forEach`、`reduce`、`flat` 等，还有 `Map`、`Set`、`String` 等数据结构，也提供了原生的迭代器支持，给我们的开发提供了很多便利，也让 underscore 这些工具库渐渐淡出历史舞台。

另外，JavaScript 中还有很多类数组结构，比如：

- `arguments`：函数接受的所有参数构成的类数组对象；
- `NodeList`：是 `querySelector` 接口族返回的数据结构；
- `HTMLCollection`：是 `getElementsBy` 接口族返回的数据结构；

> 对于这些类数组结构，我们可以通过一些方式来转换成普通数组结构，以 arguments 为例：

```js
// 方法一
var args = Array.prototype.slice.call(arguments);

// 方法二
var args = [].slice.call(arguments);

// 方法三 ES6提供
const args = Array.from(arguments);

// 方法四 ES6提供
const args = [...arguments];
```

> 转换成数组之后，就可以快乐使用 `JavaScript` 在 `Array` 上提供的各种方法了。

**4\. ES6 中的迭代器**

- `ES6` 规定，默认的迭代器部署在对应数据结构的 `Symbol.iterator` 属性上，如果一个数据结构具有 `Symbol.iterator` 属性，就被视为可遍历的，就可以用 `for...of` 循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的`Symbol.iterator` 方法。
- `for-of` 循环可以使用的范围包括 `Array`、`Set`、`Map` 结构、上文提到的类数组结构、`Generator` 对象，以及字符串。

> 注意： `ES6` 的 `Iterator` 相关内容与本节主题无关，所以不做更详细的介绍，如果读者希望更深入，推介先阅读阮一峰的 `<Iterator 和 for...of 循环>` 相关内容。

- 通过 `for-of` 可以使用 `Symbol.iterator` 这个属性提供的迭代器可以遍历对应数据结构，如果对没有提供 `Symbol.iterator` 的目标使用 `for-of` 则会抛错：

```js
var foo = { a: 1 };

for (var key of foo) {
  console.log(key);
}

// 输出： Uncaught TypeError: foo is not iterable
```

> 我们可以给一个对象设置一个迭代器，让一个对象也可以使用 `for-of` 循环：

```js
var bar = {
  a: 1,
  [Symbol.iterator]: function () {
    var valArr = [
      { value: "hello", done: false },
      { value: "world", done: false },
      { value: "!", done: false },
      { value: undefined, done: true },
    ];
    return {
      next: function () {
        return valArr.shift();
      },
    };
  },
};

for (var key of bar) {
  console.log(key);
}

// 输出： hello
// 输出： world
// 输出： !
```

> 可以看到 `for-of` 循环连 `bar` 对象自己的属性都不遍历了，遍历获取的值只和 `Symbol.iterator` 方法实现有关。

**5\. 迭代器模式总结**

- 迭代器模式早已融入我们的日常开发中，在使用 `filter`、`reduce`、`map` 等方法的时候，不要忘记这些便捷的方法就是迭代器模式的应用。当我们使用迭代器方法处理一个对象时，我们可以关注与处理的逻辑，而不必关心对象的内部结构，侧面将对象内部结构和使用者之间解耦，也使得代码中的循环结构变得紧凑而优美

## 命令模式：江湖通缉令

**行为型模式：命令模式**

- 命令模式 （Command Pattern）又称事务模式，将请求封装成对象，将命令的发送者和接受者解耦。本质上是对方法调用的封装。
- 通过封装方法调用，也可以做一些有意思的事，例如记录日志，或者重复使用这些封装来实现撤销（undo）、重做（redo）操作。

**1\. 你曾见过的命令模式**

某日，著名门派蛋黄派于江湖互联网发布江湖通缉令一张「通缉偷电瓶车贼窃格瓦拉，抓捕归案奖鸭蛋 10 个」。对于通缉令发送者蛋黄派来说，不需向某个特定单位通知通缉令，而通缉令发布之后，蛋黄派也不用管是谁来完成这个通缉令，也就是说，通缉令的发送者和接受者之间被解耦了。

大学宿舍的时候，室友们都上床了，没人起来关灯，不知道有谁提了一句「谁起来把灯关一下」，此时比的是谁装睡装得像，如果沉不住气，就要做命令的执行者，去关灯了。

比较经典的例子是餐馆订餐，客人需要向厨师发送请求，但是不知道这些厨师的联系方式，也不知道厨师炒菜的流程和步骤，一般是将客人订餐的请求封装成命令对象，也就是订单。这个订单对象可以在程序中被四处传递，就像订单可以被服务员传递到某个厨师手中，客人不需要知道是哪个厨师完成自己的订单，厨师也不需要知道是哪个客户的订单。

在类似场景中，这些例子有以下特点：

- 命令的发送者和接收者解耦，发送者与接收者之间没有直接引用关系，发送请求的对象只需要知道如何发送请求，而不必知道如何完成请求；
- 对命令还可以进行撤销、排队等操作，比如用户等太久不想等了撤销订单，厨师不够了将订单进行排队，等等操作；

**2\. 实例的代码实现**

为了方便演示命令的撤销和重做，下面使用 JavaScript 来实现对超级玛丽的操控 🤣。

**2.1 马里奥的操控实现**

首先我们新建一个移动对象类，在以后的代码中是通用的：

```js
var canvas = document.getElementById('my-canvas')
var CanvasWidth = 400    // 画布宽度
var CanvasHeight = 400   // 画布高度
var CanvasStep = 40      // 动作步长
canvas.width = CanvasWidth
canvas.height = CanvasHeight

// 移动对象类
var Role = function(x, y, imgSrc) {
    this.position = { x, y }
    this.canvas = document.getElementById('my-canvas')

    this.ctx = this.canvas.getContext('2d')
    this.img = new Image()
    this.img.style.width = CanvasStep
    this.img.style.height = CanvasStep
    this.img.src = imgSrc
    this.img.onload = () => {
        this.ctx.drawImage(this.img, x, y, CanvasStep, CanvasStep)
        this.move(0, 0)
    }
}

Role.prototype.move = function(x, y) {
    var pos = this.position
    this.ctx.clearRect(pos.x, pos.y, CanvasStep, CanvasStep)
    pos.x += x
    pos.y += y
    this.ctx.drawImage(this.img, pos.x, pos.y, CanvasStep, CanvasStep)
}
下面如果要实现操控超级玛丽，可以直接：

var mario = new Role(200, 200, 'https://i.loli.net/2019/08/09/sqnjmxSZBdPfNtb.jpg')

// 设置按钮回调
var elementUp = document.getElementById('up-btn')
elementUp.onclick = function() {
    mario.move(0, -CanvasStep)
}

var elementDown = document.getElementById('down-btn')
elementDown.onclick = function() {
    mario.move(0, CanvasStep)
}

var elementLeft = document.getElementById('left-btn')
elementLeft.onclick = function() {
    mario.move(-CanvasStep, 0)
}

var elementRight = document.getElementById('right-btn')
elementRight.onclick = function() {
    mario.move(CanvasStep, 0)
}
```

如果要新建一个小怪兽角色，可以：

```js
var monster = new Role(
  160,
  160,
  "https://i.loli.net/2019/08/12/XCTzcdbhriLlskv.png"
);
```

**2.2 引入命令模式**

- 面的实现逻辑上没有问题，但当我们在页面上点击按钮发送操作请求时，需要向具体负责实现行为的对象发送请求操作，对应上面的例子中的 mario、monster，这些对象就是操作的接受者。也就是说，操作的发送者直接持有操作的接受者，逻辑直接暴露在页面 DOM 的事件回调中，耦合较强。如果要增加新的角色，需要对 DOM 的回调函数进行改动，如果对操作行为进行修改，对应地，也需修改 DOM 回调函数。
- 此时，我们可以引入命令模式，以便将操作的发送者和操作的接受者解耦。在这个例子中，我们将操作马里奥的行为包装成命令类，操作的发送者只需要持有对应的命令实例并执行，命令的内容是具体的行为逻辑。
- 多说无益，直接看代码（从这里之后就直接用 ES6）：

```js
const canvas = document.getElementById("my-canvas");
const CanvasWidth = 400; // 画布宽度
const CanvasHeight = 400; // 画布高度
const CanvasStep = 40; // 动作步长
canvas.width = CanvasWidth;
canvas.height = CanvasHeight;

const btnUp = document.getElementById("up-btn");
const btnDown = document.getElementById("down-btn");
const btnLeft = document.getElementById("left-btn");
const btnRight = document.getElementById("right-btn");

// 移动对象类
class Role {
  constructor(x, y, imgSrc) {
    this.x = x;
    this.y = y;
    this.canvas = document.getElementById("my-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.img = new Image();
    this.img.style.width = CanvasStep;
    this.img.style.height = CanvasStep;
    this.img.src = imgSrc;
    this.img.onload = () => {
      this.ctx.drawImage(this.img, x, y, CanvasStep, CanvasStep);
      this.move(0, 0);
    };
  }

  move(x, y) {
    this.ctx.clearRect(this.x, this.y, CanvasStep, CanvasStep);
    this.x += x;
    this.y += y;
    this.ctx.drawImage(this.img, this.x, this.y, CanvasStep, CanvasStep);
  }
}

// 向上移动命令类
class MoveUpCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }

  execute(role) {
    this.receiver.move(0, -CanvasStep);
  }
}

// 向下移动命令类
class MoveDownCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }

  execute(role) {
    this.receiver.move(0, CanvasStep);
  }
}

// 向左移动命令类
class MoveLeftCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }

  execute(role) {
    this.receiver.move(-CanvasStep, 0);
  }
}

// 向右移动命令类
class MoveRightCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }

  execute(role) {
    this.receiver.move(CanvasStep, 0);
  }
}

// 设置按钮命令
const setCommand = function (element, command) {
  element.onclick = function () {
    command.execute();
  };
};

/* ----- 客户端 ----- */
const mario = new Role(
  200,
  200,
  "https://i.loli.net/2019/08/09/sqnjmxSZBdPfNtb.jpg"
);
const moveUpCommand = new MoveUpCommand(mario);
const moveDownCommand = new MoveDownCommand(mario);
const moveLeftCommand = new MoveLeftCommand(mario);
const moveRightCommand = new MoveRightCommand(mario);

setCommand(btnUp, moveUpCommand);
setCommand(btnDown, moveDownCommand);
setCommand(btnLeft, moveLeftCommand);
setCommand(btnRight, moveRightCommand);
```

- 我们把操作的逻辑分别提取到对应的 `Command` 类中，并约定 `Command` 类的 `execute` 方法存放命令接收者需要执行的逻辑，也就是前面例子中的 `onclick` 回调方法部分。
- 按下操作按钮之后会发生事情这个逻辑是不变的，而具体发生什么事情的逻辑是可变的，这里我们可以提取出公共逻辑，把一定发生事情这个逻辑提取到 `setCommand 方法中，在这里调用命令类实例的`execute`方法，而不同事情具体逻辑的不同体现在各个`execute\` 方法的不同实现中。
- 至此，命令的发送者已经知道自己将会执行一个 `Command` 类实例的 `execute` 实例方法，但是具体是哪个操作类的类实例来执行，还不得而知，这时候需要调用 `setCommand` 方法来告诉命令的发送者，执行的是哪个命令。

> 综上，一个命令模式改造后的实例就完成了，但是在 `JavaScript` 中，命令不一定要使用类的形式：

```js
// 前面代码一致

// 向上移动命令对象
const MoveUpCommand = {
  execute(role) {
    role.move(0, -CanvasStep);
  },
};

// 向下移动命令对象
const MoveDownCommand = {
  execute(role) {
    role.move(0, CanvasStep);
  },
};

// 向左移动命令对象
const MoveLeftCommand = {
  execute(role) {
    role.move(-CanvasStep, 0);
  },
};

// 向右移动命令对象
const MoveRightCommand = {
  execute(role) {
    role.move(CanvasStep, 0);
  },
};

// 设置按钮命令
const setCommand = function (element, role, command) {
  element.onclick = function () {
    command.execute(role);
  };
};

/* ----- 客户端 ----- */
const mario = new Role(
  200,
  200,
  "https://i.loli.net/2019/08/09/sqnjmxSZBdPfNtb.jpg"
);

setCommand(btnUp, mario, MoveUpCommand);
setCommand(btnDown, mario, MoveDownCommand);
setCommand(btnLeft, mario, MoveLeftCommand);
setCommand(btnRight, mario, MoveRightCommand);
```

**2.3 命令模式升级**

- 可以对这个项目进行升级，记录这个角色的行动历史，并且提供一个 redo、undo 按钮，撤销和重做角色的操作，可以想象一下如果不使用命令模式，记录的 Log 将比较乱，也不容易进行操作撤销和重做。

> 下面我们可以使用命令模式来对上面马里奥的例子进行重构，有下面几个要点：

- 命令对象包含有 execute 方法和 undo 方法，前者是执行和重做时执行的方法，后者是撤销时执行的反方法；
- 每次执行操作时将当前操作命令推入撤销命令栈，并将当前重做命令栈清空；
- 撤销操作时，将撤销命令栈中最后推入的命令取出并执行其 undo 方法，且将该命令推入重做命令栈；
- 重做命令时，将重做命令栈中最后推入的命令取出并执行其 execute 方法，且将其推入撤销命令栈；

```js
// 向上移动命令对象
const MoveUpCommand = {
  execute(role) {
    role.move(0, -CanvasStep);
  },
  undo(role) {
    role.move(0, CanvasStep);
  },
};

// 向下移动命令对象
const MoveDownCommand = {
  execute(role) {
    role.move(0, CanvasStep);
  },
  undo(role) {
    role.move(0, -CanvasStep);
  },
};

// 向左移动命令对象
const MoveLeftCommand = {
  execute(role) {
    role.move(-CanvasStep, 0);
  },
  undo(role) {
    role.move(CanvasStep, 0);
  },
};

// 向右移动命令对象
const MoveRightCommand = {
  execute(role) {
    role.move(CanvasStep, 0);
  },
  undo(role) {
    role.move(-CanvasStep, 0);
  },
};

// 命令管理者
const CommandManager = {
  undoStack: [], // 撤销命令栈
  redoStack: [], // 重做命令栈

  executeCommand(role, command) {
    this.redoStack.length = 0; // 每次执行清空重做命令栈
    this.undoStack.push(command); // 推入撤销命令栈
    command.execute(role);
  },

  /* 撤销 */
  undo(role) {
    if (this.undoStack.length === 0) return;
    const lastCommand = this.undoStack.pop();
    lastCommand.undo(role);
    this.redoStack.push(lastCommand); // 放入redo栈中
  },

  /* 重做 */
  redo(role) {
    if (this.redoStack.length === 0) return;
    const lastCommand = this.redoStack.pop();
    lastCommand.execute(role);
    this.undoStack.push(lastCommand); // 放入undo栈中
  },
};

// 设置按钮命令
const setCommand = function (element, role, command) {
  if (typeof command === "object") {
    element.onclick = function () {
      CommandManager.executeCommand(role, command);
    };
  } else {
    element.onclick = function () {
      command.call(CommandManager, role);
    };
  }
};

/* ----- 客户端 ----- */
const mario = new Role(
  200,
  200,
  "https://i.loli.net/2019/08/09/sqnjmxSZBdPfNtb.jpg"
);

setCommand(btnUp, mario, MoveUpCommand);
setCommand(btnDown, mario, MoveDownCommand);
setCommand(btnLeft, mario, MoveLeftCommand);
setCommand(btnRight, mario, MoveRightCommand);

setCommand(btnUndo, mario, CommandManager.undo);
setCommand(btnRedo, mario, CommandManager.redo);
```

我们可以给马里奥画一个蘑菇 ，当马里奥走到蘑菇上面的时候提示「挑战成功！

有了撤销和重做命令之后，做一些小游戏比如围棋、象棋，会很容易就实现悔棋、复盘等功能。

**3\. 命令模式的优缺点**

**命令模式的优点：**

- 命令模式将调用命令的请求对象与执行该命令的接收对象解耦，因此系统的可扩展性良好，加入新的命令不影响原有逻辑，所以增加新的命令也很容易；
- 命令对象可以被不同的请求者角色重用，方便复用；
- 可以将命令记入日志，根据日志可以容易地实现对命令的撤销和重做；
- 命令模式的缺点：命令类或者命令对象随着命令的变多而膨胀，如果命令对象很多，那么使用者需要谨慎使用，以免带来不必要的系统复杂度。

**4\. 命令模式的使用场景**

- 需要将请求调用者和请求的接收者解耦的时候；
- 需要将请求排队、记录请求日志、撤销或重做操作时；

**5\. 其他相关模式** **5.1 命令模式与职责链模式**

> 命令模式和职责链模式可以结合使用，比如具体命令的执行，就可以引入职责链模式，让命令由职责链中合适的处理者执行。

**5.2 命令模式与组合模式**

> 命令模式和组合模式可以结合使用，比如不同的命令可以使用组合模式的方法形成一个宏命令，执行完一个命令之后，再继续执行其子命令。

**5.3 命令模式与工厂模式**

命令模式与工厂模式可以结合使用，比如命令模式中的命令可以由工厂模式来提供

## 职责链模式：领导，我想请个假

**1\. 你曾经见过的职责链模式**

小伙伴来你的城市找你玩耍，因此你需要请两天假。首先跟你的小组领导提了一句，小领导说不行呐我只能批半天假，建议找部门经理。于是你来到了部门经理办公室，部门经理说不行呐我只能批一天假，建议找总经理。来到总经理办公室，总经理勉为其难的说，好叭，不过要扣你四天工资。于是你请到了两天假，和小伙伴快乐（并不 ）玩耍了。

当你作为请求者提出请假申请时，这个申请会由小组领导、部门经理、总经理之中的某一位领导来进行处理，但一开始提出申请的时候，并不知道这个申请之后由哪个领导来处理，也许是部门经理，或者是总经理，请求者事先不知道这个申请最后到底应该由哪个领导处理。

再比如，某个快乐的下午正在快乐次冰棍，你的胃突然有点不舒服，于是决定看看什么情况。首先你去了社区医院，社区医生看了看说可能很严重但也不能确定，你大吃一惊，去了县城的医院。县城的医院做了简单的检查，跟你说可能是胃炎但不确定，建议去更大的医院。然后你来到了省城的医院，医生看了看说，没啥，这就是消化不良（来自在下的亲身经历 ）。

和上面请假的例子类似，看病的医院会告诉看病者是否可以治疗，社区医院不成就转院到县城医院，再不行就转院到更大的医院，而看病者一开始在社区医院看病的时候，并不知道这个病最后哪个医院可以治疗，也许是县城医院，也许是省城医院。

在类似的场景中，这些例子有以下特点：

- 请求在一系列对象中传递，形成一条链；
- 链中的请求接受者对请求进行分析，要么处理这个请求，要么把这个请求传递给链的下一个接受者；

**2\. 实例的代码实现** **2.1 代码实现**

我们可以使用 JavaScript 来将之前的请假例子实现一下。

```js
var askLeave = function (duration) {
  if (duration <= 0.5) {
    console.log("小组领导经过一番心理斗争：批准了");
  } else if (duration <= 1) {
    console.log("部门领导经过一番心理斗争：批准了");
  } else if (duration <= 2) {
    console.log("总经理经过一番心理斗争：批准了");
  } else {
    console.log("总经理：不准请这么长的假");
  }
};

askLeave(0.5); // 小组领导经过一番心理斗争：批准了
askLeave(1); // 部门领导经过一番心理斗争：批准了
askLeave(2); // 总经理经过一番心理斗争：批准了
askLeave(3); // 总经理：不准请这么长的假
```

**2.2 初步优化**

上面的实现没有问题，也可以正常运行，但正常情况下，处理逻辑可能就不仅仅是一个 console.log 这么简单，而是包含一些年假、调休、项目忙碌情况的复杂判断，此时这个 askLeave 方法就变得庞大而臃肿，如果中间增加一个新的领导层，可以批准 1.5 天的假期，那么你就要修改这个庞大的 askLeave 方法，维护工作变得复杂。

这里我们可以将不同领导的处理逻辑（也就是职责节点）提取出来，让不同节点的职责逻辑界限变得明显，代码结构更明显。请假的时候直接找小组领导，如果小组领导处理不好，直接把请求传递给部门领导，部门领导处理不了则传递给总经理。

```js
/* 小组领导处理逻辑 */
var askLeaveGroupLeader = function (duration) {
  if (duration <= 0.5) {
    console.log("小组领导经过一番心理斗争：批准了");
  } else askLeaveDepartmentLeader(duration);
};

/* 部门领导处理逻辑 */
var askLeaveDepartmentLeader = function (duration) {
  if (duration <= 1) {
    console.log("部门领导经过一番心理斗争：批准了");
  } else askLeaveGeneralLeader(duration);
};

/* 总经理处理逻辑 */
var askLeaveGeneralLeader = function (duration) {
  if (duration <= 2) {
    console.log("总经理经过一番心理斗争：批准了");
  } else console.log("总经理：不准请这么长的假");
};

askLeaveGroupLeader(0.5); // 小组领导经过一番心理斗争：批准了
askLeaveGroupLeader(1); // 部门领导经过一番心理斗争：批准了
askLeaveGroupLeader(2); // 总经理经过一番心理斗争：批准了
askLeaveGroupLeader(3); // 总经理：不准请这么长的假
```

**2.3 使用职责链模式重构**

上面的实现，逻辑倒是清晰了，也不会有个超大的函数一把梭，但是还有个问题，比如 askLeaveGroupLeader 这个函数里就直接耦合了 askLeaveDepartmentLeader 这个函数，其他函数也是各自耦合在一起，如果要在其中两个职责节点中间增加一个节点，或者去掉一个节点，那么就要同时改动相邻的职责节点函数，这就违反了开闭原则，我们希望增加新的职责节点的时候，对原来的代码没有影响。

这时我们可以引入职责链模式，将职责节点的下一个节点使用拼接的方式，而不是在声明的时候就固定。这里我们：

```js
/* 小组领导 */
var GroupLeader = {
    nextLeader: null,
    setNext: function(next) {
        this.nextLeader = next
    },
    handle: function(duration) {
        if (duration <= 0.5) {
            console.log('小组领导经过一番心理斗争：批准了')
        } else
            this.nextLeader.handle(duration)
    }
}

/* 部门领导 */
var DepartmentLeader = {
    nextLeader: null,
    setNext: function(next) {
        this.nextLeader = next
    },
    handle: function(duration) {
        if (duration <= 1) {
            console.log('部门领导经过一番心理斗争：批准了')
        } else
            this.nextLeader.handle(duration)
    }
}

/* 总经理 */
var GeneralLeader = {
    nextLeader: null,
    setNext: function(next) {
        this.nextLeader = next
    },
    handle: function(duration) {
        if (duration <= 2) {
            console.log('总经理经过一番心理斗争：批准了')
        } else
            console.log('总经理：不准请这么长的假')
    }
}

GroupLeader.setNext(DepartmentLeader)     // 设置小组领导的下一个职责节点为部门领导
DepartmentLeader.setNext(GeneralLeader)   // 设置部门领导的下一个职责节点为总经理

GroupLeader.handle(0.5)   // 小组领导经过一番心理斗争：批准了
GroupLeader.handle(1)     // 部门领导经过一番心理斗争：批准了
GroupLeader.handle(2)     // 总经理经过一番心理斗争：批准了
GroupLeader.handle(3)     // 总经理：不准请这么长的假
这样，将职责的链在使用的时候再拼起来，灵活性好，比如如果要在部门领导和总经理中间增加一个新的职责节点，那么在使用时：

/* 新领导 */
var MewLeader = {
    nextLeader: null,
    setNext: function(next) {
        this.nextLeader = next
    },
    handle: function(duration) { ... }
}

GroupLeader.setNext(DepartmentLeader)     // 设置小组领导的下一个职责节点为部门领导
DepartmentLeader.setNext(MewLeader)       // 设置部门领导的下一个职责节点为新领导
MewLeader.setNext(GeneralLeader)          // 设置新领导的下一个职责节点为总经理
```

- 删除节点也是类似操作，非常符合开闭原则了，给维护带来很大方便。
- 但是我们看到之前的内容有很多重复代码，比如 `Leader` 对象里的 `nextLeader`、`setNext` 里的逻辑就是一样的，可以用继承来避免这部分重复。

首先使用 ES5 的方式：

```js
/* 领导基类 */
var Leader = function () {
  this.nextLeader = null;
};

Leader.prototype.setNext = function (next) {
  this.nextLeader = next;
};

/* 小组领导 */
var GroupLeader = new Leader();
GroupLeader.handle = function (duration) {
  if (duration <= 0.5) {
    console.log("小组领导经过一番心理斗争：批准了");
  } else this.nextLeader.handle(duration);
};

/* 部门领导 */
var DepartmentLeader = new Leader();
DepartmentLeader.handle = function (duration) {
  if (duration <= 1) {
    console.log("部门领导经过一番心理斗争：批准了");
  } else this.nextLeader.handle(duration);
};

/* 总经理 */
var GeneralLeader = new Leader();
GeneralLeader.handle = function (duration) {
  if (duration <= 2) {
    console.log("总经理经过一番心理斗争：批准了");
  } else console.log("总经理：不准请这么长的假");
};

GroupLeader.setNext(DepartmentLeader); // 设置小组领导的下一个职责节点为部门领导
DepartmentLeader.setNext(GeneralLeader); // 设置部门领导的下一个职责节点为总经理

GroupLeader.handle(0.5); // 小组领导经过一番心理斗争：批准了
GroupLeader.handle(1); // 部门领导经过一番心理斗争：批准了
GroupLeader.handle(2); // 总经理经过一番心理斗争：批准了
GroupLeader.handle(3); // 总经理：不准请这么长的假
```

> 我们使用 ES6 的 Class 语法改造一下：

```js
/* 领导基类 */
class Leader {
  constructor() {
    this.nextLeader = null;
  }

  setNext(next) {
    this.nextLeader = next;
  }
}

/* 小组领导 */
class GroupLeader extends Leader {
  handle(duration) {
    if (duration <= 0.5) {
      console.log("小组领导经过一番心理斗争：批准了");
    } else this.nextLeader.handle(duration);
  }
}

/* 部门领导 */
class DepartmentLeader extends Leader {
  handle(duration) {
    if (duration <= 1) {
      console.log("部门领导经过一番心理斗争：批准了");
    } else this.nextLeader.handle(duration);
  }
}

/* 总经理 */
class GeneralLeader extends Leader {
  handle(duration) {
    if (duration <= 2) {
      console.log("总经理经过一番心理斗争：批准了");
    } else console.log("总经理：不准请这么长的假");
  }
}

const zhangSan = new GroupLeader();
const liSi = new DepartmentLeader();
const wangWu = new GeneralLeader();

zhangSan.setNext(liSi); // 设置小组领导的下一个职责节点为部门领导
liSi.setNext(wangWu); // 设置部门领导的下一个职责节点为总经理

zhangSan.handle(0.5); // 小组领导经过一番心理斗争：批准了
zhangSan.handle(1); // 部门领导经过一番心理斗争：批准了
zhangSan.handle(2); // 总经理经过一番心理斗争：批准了
zhangSan.handle(3); // 总经理：不准请这么长的假
```

**2.4 使用链模式重构**

之前的代码实现，我们可以使用链模式稍加重构，在设置下一个职责节点的方法 setNext 中返回下一个节点实例，使得在职责链的组装过程是一个链的形式，代码结构更加简洁。

首先是 ES5 方式：

```js
/* 领导基类 */
var Leader = function() {
    this.nextLeader = null
}

Leader.prototype.setNext = function(next) {
    this.nextLeader = next
    return next
}

/* 小组领导 */
var GroupLeader = new Leader()
GroupLeader.handle = function(duration) { ... }

/* 部门领导 */
var DepartmentLeader = new Leader()
DepartmentLeader.handle = function(duration) { ... }

/* 总经理 */
var GeneralLeader = new Leader()
GeneralLeader.handle = function(duration) { ... }

/* 组装职责链 */
GroupLeader
  .setNext(DepartmentLeader)   // 设置小组领导的下一个职责节点为部门领导
  .setNext(GeneralLeader)      // 设置部门领导的下一个职责节点为总经理
ES6 方式同理：

/* 领导基类 */
class Leader {
    constructor() {
        this.nextLeader = null
    }

    setNext(next) {
        this.nextLeader = next
        return next
    }
}

/* 小组领导 */
class GroupLeader extends Leader {
    handle(duration) { ... }
}

/* 部门领导 */
class DepartmentLeader extends Leader {
    handle(duration) { ... }
}

/* 总经理 */
class GeneralLeader extends Leader {
    handle(duration) { ... }
}

const zhangSan = new GroupLeader()
const liSi = new DepartmentLeader()
const wangWu = new GeneralLeader()

/* 组装职责链 */
zhangSan
  .setNext(liSi)     // 设置小组领导的下一个职责节点为部门领导
  .setNext(wangWu)   // 设置部门领导的下一个职责节点为总经理

```

**3\. 职责链模式的原理**

> 职责链模式可能在真实的业务代码中见的不多，但是作用域链、原型链、DOM 事件流的事件冒泡，都有职责链模式的影子:

- 作用域链： 查找变量时，先从当前上下文的变量对象中查找，如果没有找到，就会从父级执行上下文的变量对象中查找，一直找到全局上下文的变量对象。
- 原型链： 当读取实例的属性时，如果找不到，就会查找当前对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止。
- 事件冒泡： 事件在 DOM 元素上触发后，会从最内层的元素开始发生，一直向外层元素传播，直到全局 document 对象。

> 以事件冒泡为例，事件在某元素上触发后，会一级级往外层元素传递事件，如果当前元素没有处理这个事件并阻止冒泡，那么这个事件就会往外层节点传递，就像请求在职责链中的职责节点上传递一样，直到某个元素处理了事件并阻止冒泡。

事件冒泡示意图如下：

![](https://s.poetries.top/gitee/2020/07/112.png)

可见虽然某些设计模式我们用的不多，但其实已经默默渗入到我们的日常开发中了。

**4\. 职责链模式的优缺点**

**职责链模式的优点：**

- 和命令模式类似，由于处理请求的职责节点可能是职责链上的任一节点，所以请求的发送者和接受者是解耦的；
- 通过改变链内的节点或调整节点次序，可以动态地修改责任链，符合开闭原则；

**职责链模式的缺点：**

- 并不能保证请求一定会被处理，有可能到最后一个节点还不能处理；
- 调试不便，调用层次会比较深，也有可能会导致循环引用；

**5\. 职责链模式的适用场景**

- 需要多个对象可以处理同一个请求，具体该请求由哪个对象处理在运行时才确定；
- 在不明确指定接收者的情况下，向多个对象中的其中一个提交请求的话，可以使用职责链模式；
- 如果想要动态指定处理一个请求的对象集合，可以使用职责链模式；

**6\. 其他相关模式** **6.1 职责链模式与组合模式**

- 职责链模式可以和组合模式一起使用，比如把职责节点通过组合模式来组合，从而形成组合起来的树状职责链。

**6.2 职责链模式与装饰模式**

- 这两个模式都是在运行期间动态组合，装饰模式是动态组合装饰器，可以有任意多个对象来装饰功能，而职责链是动态组合职责节点，有一个职责节点处理的话就结束。
- 另外他们的目的也不同，装饰模式为对象添加功能，而职责链模式是要实现发送者和接收者解耦。

## 中介者模式：找媒人介绍对象

- 中介者模式 （Mediator Pattern）又称调停模式，使得各对象不用显式地相互引用，将对象与对象之间紧密的耦合关系变得松散，从而可以独立地改变他们。核心是多个对象之间复杂交互的封装。
- 根据最少知识原则，一个对象应该尽量少地了解其他对象。如果对象之间耦合性太高，改动一个对象则会影响到很多其他对象，可维护性差。复杂的系统，对象之间的耦合关系会得更加复杂，中介者模式就是为了解决这个问题而诞生的。

**1\. 你曾见过的中介者模式**

举一个有点意思的例子。相亲是一个多方博弈、互相选择（嫌弃）的场景，男生和女生相亲，不仅仅是男生和女生两方关系，还有：

男方的角度：

- 男生会考虑女生的长相、身高、性格、三观、家境、和自己父母能不能合得来、对方家长是否好相处等等；
- 男生的家长会考虑女生的条件、和自己儿子搭不搭、对方家长的性格等等；

女方的角度：

- 女生会考虑男生的性格、上进心、是不是高富帅、能不能通过自己父母的法眼、对方家长是否好相处等等；
- 女生的家长也会考虑男生的条件、是不是配得上自己女儿、对方家长的性格等等；
- 双方的家长可能还有博弈和交换，比如你家是公务员，那么可以稍微穷一点；我家比较帅，那么矮一点对方也可以接受…总之，男生、女生、男方家长、女方家长各方的关系交错复杂，每个人都有自己的考量，如果某一方有什么想法，要和其他三方进行沟通，牵一发动全身。这时候我们可以引入媒人，无论哪一方有什么要求或者什么想法，都可以直接告诉媒人，这样就不用各方自己互相沟通了。

再看另一个例子。比如买房子的时候，我们不必自己去跑到每个卖家那里了解情况，而一般选择从中介那里获取房源信息。卖家们把各自的房源信息提供给中介，包括房源的大小、楼层、朝向等，有的卖家说价格还可以谈，有的卖家说我的房子带阁楼，有的卖家说要跟车库一起卖，等等。买家从中介处就可以获取自己所需的房源信息，比如你不需要车库，也不住一楼和顶楼，只考虑一百平米以上的屋子，中介就会给你筛选出满足你需要的所有房源供你查看，而不需买家一个个的找卖家们了解信息，当你正关注的卖家房子卖出去了中介也会及时告诉你，这就是中介的作用。

类似的例子还有很多，比如电商平台之于买家与店家，聊天平台之于每个聊天者，澳门大型线上赌场之于每个参与赌博的人

在类似的场景中，有以下特点：

- 相亲各方/房源买家卖家（目标对象）之间的关系复杂，引入媒人/中介（中介者）会极大方便各方之间的沟通；
- 相亲各方/房源买家卖家（目标对象）之间如果有什么想法和要求上的变动，通过媒人/中介（中介者）就可以及时通知到相关各方，而目标对象之间相互不通信；

**2\. 实例的代码实现**

我们使用 JavaScript 将刚刚的相亲例子实现一下。

首先我们考虑一个场景，男方和女方都有一定的条件，双方之间有要求，双方家长对对方孩子也有要求，如果达不到要求则不同意这门婚事。（也就是说暂时不考虑男女双方对于对方家长，和双方家长之间的要求，因为这样代码就太长了）

```js
class Person {
  /* 个人信息 */
  constructor(name, info, target) {
    this.name = name;
    this.info = info; // 是一个对象，每一项为数字，比如身高、工资..
    this.target = target; // 也是对象，每一项为两个数字的数组，表示可接受的最低和最高值
    this.enemyList = []; // 考虑列表
  }

  /* 注册相亲对象及家长 */
  registEnemy(...enemy) {
    this.enemyList.push(...enemy);
  }

  /* 检查所有相亲对象及其家长的条件 */
  checkAllPurpose() {
    this.enemyList.forEach((enemy) => enemy.info && this.checkPurpose(enemy));
  }

  /* 检查对方是否满足自己的要求，并发信息 */
  checkPurpose(enemy) {
    const result = Object.keys(this.target) // 是否满足自己的要求
      .every((key) => {
        const [low, high] = this.target[key];
        return low <= enemy.info[key] && enemy.info[key] <= high;
      });
    enemy.receiveResult(result, this, enemy); // 通知对方
  }

  /* 接受到对方的信息 */
  receiveResult(result, they, me) {
    result
      ? console.log(
          `${they.name}：我觉得合适~ \t（我的要求 ${me.name} 已经满足）`
        )
      : console.log(
          `${they.name}：你是个好人! \t（我的要求 ${me.name} 不能满足！）`
        );
  }
}

/* 男方 */
const ZhangXiaoShuai = new Person(
  "张小帅",
  { age: 25, height: 171, salary: 5000 },
  { age: [23, 27] }
);

/* 男方家长 */
const ZhangXiaoShuaiParent = new Person("张小帅家长", null, {
  height: [160, 167],
});

/* 女方 */
const LiXiaoMei = new Person(
  "李小美",
  { age: 23, height: 160 },
  { age: [25, 27] }
);

/* 女方家长 */
const LiXiaoMeiParent = new Person("李小美家长", null, {
  salary: [10000, 20000],
});

/* 注册，每一个 person 实例都需要注册对方家庭成员的信息 */
ZhangXiaoShuai.registEnemy(LiXiaoMei, LiXiaoMeiParent);
LiXiaoMei.registEnemy(ZhangXiaoShuai, ZhangXiaoShuaiParent);
ZhangXiaoShuaiParent.registEnemy(LiXiaoMei, LiXiaoMeiParent);
LiXiaoMeiParent.registEnemy(ZhangXiaoShuai, ZhangXiaoShuaiParent);

/* 检查对方是否符合要求，同样，每一个 person 实例都需要执行检查 */
ZhangXiaoShuai.checkAllPurpose();
LiXiaoMei.checkAllPurpose();
ZhangXiaoShuaiParent.checkAllPurpose();
LiXiaoMeiParent.checkAllPurpose();

// 张小帅：我觉得合适~  （我的要求 李小美 已经满足）
// 李小美：我觉得合适~  （我的要求 张小帅 已经满足）
// 张小帅家长：我觉得合适~  （我的要求 李小美 已经满足）
// 李小美家长：你是个好人!  （我的要求 张小帅 不能满足！）
```

当然作为灵活的 JavaScript，并不一定需要使用类，使用对象的形式也是可以的：

```js
const PersonFunc = {
  /* 注册相亲对象及家长 */
  registEnemy(...enemy) {
    this.enemyList.push(...enemy);
  },

  /* 检查所有相亲对象及其家长的条件 */
  checkAllPurpose() {
    this.enemyList.forEach((enemy) => enemy.info && this.checkPurpose(enemy));
  },

  /* 检查对方是否满足自己的要求，并发信息 */
  checkPurpose(enemy) {
    const result = Object.keys(this.target) // 是否满足自己的要求
      .every((key) => {
        const [low, high] = this.target[key];
        return low <= enemy.info[key] && enemy.info[key] <= high;
      });
    enemy.receiveResult(result, this, enemy); // 通知对方
  },

  /* 接受到对方的信息 */
  receiveResult(result, they, me) {
    result
      ? console.log(
          `${they.name}：我觉得合适~ \t（我的要求 ${me.name} 已经满足）`
        )
      : console.log(
          `${they.name}：你是个好人! \t（我的要求 ${me.name} 不能满足！）`
        );
  },
};

/* 男方 */
const ZhangXiaoShuai = {
  ...PersonFunc,
  name: "张小帅",
  info: { age: 25, height: 171, salary: 5000 },
  target: { age: [23, 27] },
  enemyList: [],
};

/* 男方家长 */
const ZhangXiaoShuaiParent = {
  ...PersonFunc,
  name: "张小帅家长",
  info: null,
  target: { height: [160, 167] },
  enemyList: [],
};

/* 女方 */
const LiXiaoMei = {
  ...PersonFunc,
  name: "李小美",
  info: { age: 23, height: 160 },
  target: { age: [25, 27] },
  enemyList: [],
};

/* 女方家长 */
const LiXiaoMeiParent = {
  ...PersonFunc,
  name: "李小美家长",
  info: null,
  target: { salary: [10000, 20000] },
  enemyList: [],
};

/* 注册 */
ZhangXiaoShuai.registEnemy(LiXiaoMei, LiXiaoMeiParent);
LiXiaoMei.registEnemy(ZhangXiaoShuai, ZhangXiaoShuaiParent);
ZhangXiaoShuaiParent.registEnemy(LiXiaoMei, LiXiaoMeiParent);
LiXiaoMeiParent.registEnemy(ZhangXiaoShuai, ZhangXiaoShuaiParent);

/* 检查对方是否符合要求 */
ZhangXiaoShuai.checkAllPurpose();
LiXiaoMei.checkAllPurpose();
ZhangXiaoShuaiParent.checkAllPurpose();
LiXiaoMeiParent.checkAllPurpose();

// 张小帅：我觉得合适~  （我的要求 李小美 已经满足）
// 李小美：我觉得合适~  （我的要求 张小帅 已经满足）
// 张小帅家长：我觉得合适~  （我的要求 李小美 已经满足）
// 李小美家长：你是个好人!  （我的要求 张小帅 不能满足！）
```

> 我们还可以使用 `Object.create()` 赋值原型的方式将方法放在原型上，也可以使用原型继承的方式，JavaScript 的灵活性让你可以自由选择习惯的方式。

单就结果而言，上面的代码可以实现整个逻辑。但是这几个对象之间相互引用、相互持有，并紧密耦合。如果继续引入关系，比如张小帅的七大姑、李小美的八大姨，或者考虑的情况更多一些，那么就要改动很多代码，上面的写法就满足不了要求了。

这时我们可以引入媒人（中介者），专门处理对象之间的耦合关系，所有对象间相互不了解，只与媒人交互，如果引入了新的相关方，也只需要通知媒人即可。看一下实现：

\`\`js /\* 男方 \*/ const ZhangXiaoShuai = { name: '张小帅', family: '张小帅家', info: { age: 25, height: 171, salary: 5000 }, target: { age: \[23, 27\] } }

/\* 男方家长 \*/ const ZhangXiaoShuaiParent = { name: '张小帅家长', family: '张小帅家', info: null, target: { height: \[160, 167\] } }

/\* 女方 \*/ const LiXiaoMei = { name: '李小美', family: '李小美家', info: { age: 23, height: 160 }, target: { age: \[25, 27\] } }

/\* 女方家长 \*/ const LiXiaoMeiParent = { name: '李小美家长', family: '李小美家', info: null, target: { salary: \[10000, 20000\] } }

/\* 媒人 \*/ const MatchMaker = { matchBook: {}, // 媒人的花名册

```js
/* 注册各方 */
registPersons(...personList) {
    personList.forEach(person => {
        if (this.matchBook[person.family]) {
            this.matchBook[person.family].push(person)
        } else this.matchBook[person.family] = [person]
    })
},

/* 检查对方家庭的孩子对象是否满足要求 */
checkAllPurpose() {
    Object.keys(this.matchBook)    // 遍历名册中所有家庭
      .forEach((familyName, idx, matchList) =>
        matchList
          .filter(match => match !== familyName)  // 对于其中一个家庭，过滤出名册中其他的家庭
          .forEach(enemyFamily => this.matchBook[enemyFamily]  // 遍历该家庭中注册到名册上的所有成员
            .forEach(enemy => this.matchBook[familyName]
              .forEach(person =>             // 逐项比较自己的条件和他们的要求
                enemy.info && this.checkPurpose(person, enemy)
              )
            ))
      )
},

/* 检查对方是否满足自己的要求，并发信息 */
checkPurpose(person, enemy) {
    const result = Object.keys(person.target)    // 是否满足自己的要求
      .every(key => {
          const [low, high] = person.target[key]
          return low <= enemy.info[key] && enemy.info[key] <= high
      })
    this.receiveResult(result, person, enemy)    // 通知对方
},

/* 通知对方信息 */
receiveResult(result, person, enemy) {
    result
      ? console.log(`${ person.name } 觉得合适~ \t（${ enemy.name } 已经满足要求）`)
      : console.log(`${ person.name } 觉得不合适! \t（${ enemy.name } 不能满足要求！）`)
}
```

}

/\* 注册 \*/ MatchMaker.registPersons(ZhangXiaoShuai, ZhangXiaoShuaiParent, LiXiaoMei, LiXiaoMeiParent)

MatchMaker.checkAllPurpose()

// 输出: 小帅 觉得合适~ （李小美 已经满足要求） // 输出: 张小帅家长 觉得合适~ （李小美 已经满足要求） // 输出: 李小美 觉得合适~ （张小帅 已经满足要求） // 输出: 李小美家长 觉得不合适! （张小帅 不能满足要求！）

> 可以看到，除了媒人之外，其他各个角色都是独立的，相互不知道对方的存在，对象间关系被解耦，我们甚至可以方便地添加新的对象。比如赵小美家同时还在考虑着孙小拽（emmm…）：

```js
// 重写上面「注册」之后的代码

/* 引入孙小拽 */
const SunXiaoZhuai = {
    name: '孙小拽',
    familyType: '男方',
    info: { age: 27, height: 173, salary: 20000 },
    target: { age: [23, 27] }
}

/* 孙小拽家长 */
const SunXiaoZhuaiParent = {
    name: '孙小拽家长',
    familyType: '男方',
    info: null,
    target: { height: [160, 170] }
}

/* 注册，这里只需要注册一次 */
MatchMaker.registPersons(ZhangXiaoShuai,
                         ZhangXiaoShuaiParent,
                         LiXiaoMei,
                         LiXiaoMeiParent,
                         SunXiaoZhuai,
                         SunXiaoZhuaiParent)

/* 检查对方是否符合要求，也只需要检查一次 */
MatchMaker.checkAllPurpose()

// 输出: 张小帅 觉得合适~      （李小美 已经满足要求）
// 输出: 张小帅家长 觉得合适~  （李小美 已经满足要求）
// 输出: 孙小拽 觉得合适~      （李小美 已经满足要求）
// 输出: 孙小拽家长 觉得合适~  （李小美 已经满足要求）
// 输出: 李小美 觉得合适~      （张小帅 已经满足要求）
// 输出: 李小美家长 觉得不合适!  （张小帅 不能满足要求！）
// 输出: 李小美 觉得合适~      （孙小拽 已经满足要求）
// 输出: 李小美家长 觉得合适~  （孙小拽 已经满足要求）
```

从这个例子就已经可以看出中介者模式的优点了，因为各对象之间的相互引用关系被解耦，从而令系统的可扩展性、可维护性更好。

**3\. 中介者模式的通用实现**

对于上面的例子，张小帅、李小美、孙小拽和他们的家长们相当于容易产生耦合的对象（最早的一本设计模式书上将这些对象称为同事，这里也借用一下这个称呼，Colleague），而媒人就相当于中介者（Mediator）。在中介者模式中，同事对象之间互相不通信，而只与中介者通信，同事对象只需知道中介者即可。主要有以下几个概念：

- Colleague： 同事对象，只知道中介者而不知道其他同事对象，通过中介者来与其他同事对象通信；
- Mediator： 中介者，负责与各同事对象的通信；

结构图如下：

![](https://s.poetries.top/gitee/2020/07/113.png) ![](https://s.poetries.top/gitee/2020/07/114.png)

> 可以看到上图，使用中介者模式之后同事对象间的网状结构变成了星型结构，同事对象之间不需要知道彼此，符合最少知识原则。如果同事对象之间需要相互通信，只能通过中介者的方式，这样让同事对象之间原本的强耦合变成弱耦合，强相互依赖变成弱相互依赖，从而让这些同事对象可以独立地改变和复用。原本同事对象间的交互逻辑被中介者封装起来，各个同事对象只需关心自身即可。

**4\. 中介者模式的优缺点**

**中介者模式的主要优点有：**

- 松散耦合，降低了同事对象之间的相互依赖和耦合，不会像之前那样牵一发动全身；
- 将同事对象间的一对多关联转变为一对一的关联，符合最少知识原则，提高系统的灵活性，使得系统易于维护和扩展；
- 中介者在同事对象间起到了控制和协调的作用，因此可以结合代理模式那样，进行同事对象间的访问控制、功能扩展；
- 因为同事对象间不需要相互引用，因此也可以简化同事对象的设计和实现；

**主要缺点是：**

- 逻辑过度集中化，当同事对象太多时，中介者的职责将很重，逻辑变得复杂而庞大，以至于难以维护。

> 当出现中介者可维护性变差的情况时，考虑是否在系统设计上不合理，从而简化系统设计，优化并重构，避免中介者出现职责过重的情况。

**5\. 中介者模式的适用场景**

- 中介者模式适用多个对象间的关系确实已经紧密耦合，且导致扩展、维护产生了困难的场景，也就是当多个对象之间的引用关系变成了网状结构的时候，此时可以考虑使用引入中介者来把网状结构转化为星型结构。
- 但是，如果对象之间的关系耦合并不紧密，或者之间的关系本就一目了然，那么引入中介者模式就是多此一举、画蛇添足。
- 实际上，我们通常使用的 `MVC/MVVM` 框架，就含有中介者模式的思想，`Controller/ViewModel` 层作为中介者协调 `View/Model` 进行工作，减少 `View/Model` 之间的直接耦合依赖，从而做到视图层和数据层的最大分离。可以关注后面有单独一章分析 `MVC/MVVM` 模式，深入了解。

**6\. 其他相关模式** **6.1 中介者模式和外观模式**

外观模式和中介者模式思想上有一些相似的地方，但也有不同：

- 中介者模式 将多个平等对象之间内部的复杂交互关系封装起来，主要目的是为了多个对象之间的解耦；
- 外观模式 封装一个子系统内部的模块，是为了向系统外部提供方便的调用；

**6.2 中介者模式与发布-订阅模式**

- 中介者模式和发布-订阅模式都可以用来进行对象间的解耦，比如发布-订阅模式的发布者/订阅者和中介者模式里面的中介者/同事对象功能上就比较类似。
- 这两个模式也可以组合使用，比如中介者模式就可以使用发布-订阅模式，对相关同事对象进行消息的广播通知。
- 比如上面相亲的例子中，注册各方和通知信息就使用了发布-订阅模式。

**6.3 中介者模式与代理模式**

> 同事对象之间需要通信的时候，需要经由中介者，这时中介者就相当于同事对象间的代理。所以这时就可以引入代理模式的概念，对同事对象相互访问的时候，起到访问控制、功能扩展等等功能。
