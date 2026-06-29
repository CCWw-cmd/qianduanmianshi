
# 设计模式-创建型模式

## 单例模式

- 单例模式可能是设计模式里面最简单的模式了，虽然简单，但在我们日常生活和编程中却经常接触到，本节我们一起来学习一下。
- 单例模式 （Singleton Pattern）又称为单体模式，保证一个类只有一个实例，并提供一个访问它的全局访问点。也就是说，第二次使用同一个类创建新对象的时候，应该得到与第一次创建的对象完全相同的对象。

**1\. 你曾经遇见过的单例模式**

- 当我们在电脑上玩经营类的游戏，经过一番眼花缭乱的骚操作好不容易走上正轨，夜深了我们去休息，第二天打开电脑，发现要从头玩，立马就把电脑扔窗外了，所以一般希望从前一天的进度接着打，这里就用到了存档。每次玩这游戏的时候，我们都希望拿到同一个存档接着玩，这就是属于单例模式的一个实例。
- 编程中也有很多对象我们只需要唯一一个，比如数据库连接、线程池、配置文件缓存、浏览器中的 window/document 等，如果创建多个实例，会带来资源耗费严重，或访问行为不一致等情况。
- 类似于数据库连接实例，我们可能频繁使用，但是创建它所需要的开销又比较大，这时只使用一个数据库连接就可以节约很多开销。一些文件的读取场景也类似，如果文件比较大，那么文件读取就是一个比较重的操作。比如这个文件是一个配置文件，那么完全可以将读取到的文件内容缓存一份，每次来读取的时候访问缓存即可，这样也可以达到节约开销的目的。

**在类似场景中，这些例子有以下特点：**

- 每次访问者来访问，返回的都是同一个实例；
- 如果一开始实例没有创建，那么这个特定类需要自行创建这个实例；

**2\. 实例的代码实现**

- 如果你是一个前端 er，那么你肯定知道浏览器中的 `window` 和 `document` 全局变量，这两个对象都是单例，任何时候访问他们都是一样的对象，`window` 表示包含 `DOM` 文档的窗口，`document` 是窗口中载入的 `DOM` 文档，分别提供了各自相关的方法。
- 在 ES6 新增语法的 `Module` 模块特性，通过 `import/export` 导出模块中的变量是单例的，也就是说，如果在某个地方改变了模块内部变量的值，别的地方再引用的这个值是改变之后的。除此之外，项目中的全局状态管理模式 Vuex、Redux、MobX 等维护的全局状态，`vue-router`、`react-router` 等维护的路由实例，在单页应用的单页面中都属于单例的应用（但不属于单例模式的应用）。
- 在 JavaScript 中使用字面量方式创建一个新对象时，实际上没有其他对象与其类似，因为新对象已经是单例了：

```js
{ a: 1 } === { a: 1 }   // false
```

- 那么问题来了，如何对构造函数使用 new 操作符创建多个对象时，仅获取同一个单例对象呢。
- 对于刚刚打经营游戏的例子，我们可以用 JavaScript 来实现一下：

```js
function ManageGame() {
  if (ManageGame._schedule) {
    // 判断是否已经有单例了
    return ManageGame._schedule;
  }
  ManageGame._schedule = this;
}

ManageGame.getInstance = function () {
  if (ManageGame._schedule) {
    // 判断是否已经有单例了
    return ManageGame._schedule;
  }
  return (ManageGame._schedule = new ManageGame());
};

const schedule1 = new ManageGame();
const schedule2 = ManageGame.getInstance();

console.log(schedule1 === schedule2);
```

> 稍微解释一下，这个构造函数在内部维护（或者直接挂载自己身上）一个实例，第一次执行 new 的时候判断这个实例有没有创建过，创建过就直接返回，否则走创建流程。我们可以用 `ES6` 的 `class` 语法改造一下：

```js
class ManageGame {
  static _schedule = null;

  static getInstance() {
    if (ManageGame._schedule) {
      // 判断是否已经有单例了
      return ManageGame._schedule;
    }
    return (ManageGame._schedule = new ManageGame());
  }

  constructor() {
    if (ManageGame._schedule) {
      // 判断是否已经有单例了
      return ManageGame._schedule;
    }
    ManageGame._schedule = this;
  }
}

const schedule1 = new ManageGame();
const schedule2 = ManageGame.getInstance();

console.log(schedule1 === schedule2); // true
```

上面方法的缺点在于维护的实例作为静态属性直接暴露，外部可以直接修改。

**3\. 单例模式的通用实现**

> 根据上面的例子提炼一下单例模式，游戏可以被认为是一个特定的类（Singleton），而存档是单例（instance），每次访问特定类的时候，都会拿到同一个实例。主要有下面几个概念：

- `Singleton` ：特定类，这是我们需要访问的类，访问者要拿到的是它的实例；
- `instance` ：单例，是特定类的实例，特定类一般会提供 getInstance 方法来获取该单例；
- `getInstance` ：获取单例的方法，或者直接由 new 操作符获取；

**这里有几个实现点要关注一下：**

- 访问时始终返回的是同一个实例；
- 自行实例化，无论是一开始加载的时候就创建好，还是在第一次被访问时；
- 一般还会提供一个 getInstance 方法用来获取它的实例；

结构大概如下图：

![](https://s.poetries.top/gitee/2020/07/82.png)

下面使用通用的方法来实现一下。

**3.1 IIFE 方式创建单例模式**

- 简单实现中，我们提到了缺点是实例会暴露，那么这里我们首先使用立即调用函数 IIFE 将不希望公开的单例实例 instance 隐藏。
- 当然也可以使用构造函数复写将闭包进行的更彻底，具体代码参看 Github 仓库，这里就不贴了。

```js
const Singleton = (function () {
  let _instance = null; // 存储单例

  const Singleton = function () {
    if (_instance) return _instance; // 判断是否已有单例
    _instance = this;
    this.init(); // 初始化操作
    return _instance;
  };

  Singleton.prototype.init = function () {
    this.foo = "Singleton Pattern";
  };

  return Singleton;
})();

const visitor1 = new Singleton();
const visitor2 = new Singleton();

console.log(visitor1 === visitor2); // true
```

- 这样一来，虽然仍使用一个变量 `_instance` 来保存单例，但是由于在闭包的内部，所以外部代码无法直接修改。
- 在这个基础上，我们可以继续改进，增加 `getInstance` 静态方法：

```js
const Singleton = (function () {
  let _instance = null; // 存储单例

  const Singleton = function () {
    if (_instance) return _instance; // 判断是否已有单例
    _instance = this;
    this.init(); // 初始化操作
    return _instance;
  };

  Singleton.prototype.init = function () {
    this.foo = "Singleton Pattern";
  };

  Singleton.getInstance = function () {
    if (_instance) return _instance;
    _instance = new Singleton();
    return _instance;
  };

  return Singleton;
})();

const visitor1 = new Singleton();
const visitor2 = new Singleton(); // 既可以 new 获取单例
const visitor3 = Singleton.getInstance(); // 也可以 getInstance 获取单例

console.log(visitor1 === visitor2); // true
console.log(visitor1 === visitor3); // true
```

- 代价和上例一样是闭包开销，并且因为 IIFE 操作带来了额外的复杂度，让可读性变差。
- IIFE 内部返回的 Singleton 才是我们真正需要的单例的构造函数，外部的 Singleton 把它和一些单例模式的创建逻辑进行了一些封装。
- IIFE 方式除了直接返回一个方法/类实例之外，还可以通过模块模式的方式来进行，就不贴代码了，代码实现在 Github 仓库中，读者可以自己瞅瞅。

**3.2 块级作用域方式创建单例**

> IIFE 方式本质还是通过函数作用域的方式来隐藏内部作用域的变量，有了 ES6 的 `let/const` 之后，可以通过 `{ }` 块级作用域的方式来隐藏内部变量：

```js
let getInstance;

{
  let _instance = null; // 存储单例

  const Singleton = function () {
    if (_instance) return _instance; // 判断是否已有单例
    _instance = this;
    this.init(); // 初始化操作
    return _instance;
  };

  Singleton.prototype.init = function () {
    this.foo = "Singleton Pattern";
  };

  getInstance = function () {
    if (_instance) return _instance;
    _instance = new Singleton();
    return _instance;
  };
}

const visitor1 = getInstance();
const visitor2 = getInstance();

console.log(visitor1 === visitor2);
```

输出: `true` 怎么样，是不是对块级作用域的理解更深了呢～

**3.3 单例模式赋能**

> 之前的例子中，单例模式的创建逻辑和原先这个类的一些功能逻辑（比如 `init` 等操作）混杂在一起，根据单一职责原则，这个例子我们还可以继续改进一下，将单例模式的创建逻辑和特定类的功能逻辑拆开，这样功能逻辑就可以和正常的类一样。

```js
/* 功能类 */
class FuncClass {
  constructor(bar) {
    this.bar = bar;
    this.init();
  }

  init() {
    this.foo = "Singleton Pattern";
  }
}

/* 单例模式的赋能类 */
const Singleton = (function () {
  let _instance = null; // 存储单例

  const ProxySingleton = function (bar) {
    if (_instance) return _instance; // 判断是否已有单例
    _instance = new FuncClass(bar);
    return _instance;
  };

  ProxySingleton.getInstance = function (bar) {
    if (_instance) return _instance;
    _instance = new Singleton(bar);
    return _instance;
  };

  return ProxySingleton;
})();

const visitor1 = new Singleton("单例1");
const visitor2 = new Singleton("单例2");
const visitor3 = Singleton.getInstance();

console.log(visitor1 === visitor2); // true
console.log(visitor1 === visitor3); // true
```

- 这样的单例模式赋能类也可被称为代理类，将业务类和单例模式的逻辑解耦，把单例的创建逻辑抽象封装出来，有利于业务类的扩展和维护。代理的概念我们将在后面代理模式的章节中更加详细地探讨。
- 使用类似的概念，配合 `ES6` 引入的 `Proxy` 来拦截默认的 `new` 方式，我们可以写出更简化的单例模式赋能方法：

```js
/* Person 类 */
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

/* 单例模式的赋能方法 */
function Singleton(FuncClass) {
  let _instance;
  return new Proxy(FuncClass, {
    construct(target, args) {
      return _instance || (_instance = Reflect.construct(FuncClass, args)); // 使用 new FuncClass(...args) 也可以
    },
  });
}

const PersonInstance = Singleton(Person);

const person1 = new PersonInstance("张小帅", 25);
const person2 = new PersonInstance("李小美", 23);

console.log(person1 === person2); // true
```

**4\. 惰性单例、懒汉式-饿汉式**

- 有时候一个实例化过程比较耗费性能的类，但是却一直用不到，如果一开始就对这个类进行实例化就显得有些浪费，那么这时我们就可以使用惰性创建，即延迟创建该类的单例。之前的例子都属于惰性单例，实例的创建都是 `new` 的时候才进行。

**惰性单例又被成为懒汉式，相对应的概念是饿汉式：**

- 懒汉式单例是在使用时才实例化
- 饿汉式是当程序启动时或单例模式类一加载的时候就被创建。
- 我们可以举一个简单的例子比较一下：

```js
class FuncClass {
  constructor() {
    this.bar = "bar";
  }
}

// 饿汉式
const HungrySingleton = (function () {
  const _instance = new FuncClass();

  return function () {
    return _instance;
  };
})();

// 懒汉式
const LazySingleton = (function () {
  let _instance = null;

  return function () {
    return _instance || (_instance = new FuncClass());
  };
})();

const visitor1 = new HungrySingleton();
const visitor2 = new HungrySingleton();
const visitor3 = new LazySingleton();
const visitor4 = new LazySingleton();

console.log(visitor1 === visitor2); // true
console.log(visitor3 === visitor4); // true
```

> 可以打上 `debugger` 在控制台中看一下，饿汉式在 HungrySingleton 这个 IIFE 执行的时候就进入到 FuncClass 的实例化流程了，而懒汉式的 LazySingleton 中 FuncClass 的实例化过程是在第一次 new 的时候才进行的。

惰性创建在实际开发中使用很普遍，了解一下对以后的开发工作很有帮助。

**5\. 源码中的单例模式**

> 以 `ElementUI` 为例，`ElementUI` 中的全屏 `Loading` 蒙层调用有两种形式：

```js
// 1. 指令形式
Vue.use(Loading.directive);
// 2. 服务形式
Vue.prototype.$loading = service;
```

- 上面的是指令形式注册，使用的方式 `<div :v-loading.fullscreen="true">...</div>`；
- 下面的是服务形式注册，使用的方式 `this.$loading({ fullscreen: true })`；

> 用服务方式使用全屏 `Loading` 是单例的，即在前一个全屏 `Loading` 关闭前再次调用全屏 `Loading`，并不会创建一个新的 `Loading` 实例，而是返回现有全屏 `Loading` 的实例。

下面我们可以看看 `ElementUI 2.9.2` 的源码是如何实现的，为了观看方便，省略了部分代码：

```js
import Vue from "vue";
import loadingVue from "./loading.vue";

const LoadingConstructor = Vue.extend(loadingVue);

let fullscreenLoading;

const Loading = (options = {}) => {
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }

  let instance = new LoadingConstructor({
    el: document.createElement("div"),
    data: options,
  });

  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  return instance;
};

export default Loading;
```

- 这里的单例是 `fullscreenLoading`，是存放在闭包中的，如果用户传的 `options` 的 `fullscreen` 为 `true` 且已经创建了单例的情况下则回直接返回之前创建的单例，如果之前没有创建过，则创建单例并赋值给闭包中的 `fullscreenLoading` 后返回新创建的单例实例。
- 这是一个典型的单例模式的应用，通过复用之前创建的全屏蒙层单例，不仅减少了实例化过程，而且避免了蒙层叠加蒙层出现的底色变深的情况。

**6\. 单例模式的优缺点**

单例模式主要解决的问题就是节约资源，保持访问一致性。

**简单分析一下它的优点：**

- 单例模式在创建后在内存中只存在一个实例，节约了内存开支和实例化时的性能开支，特别是需要重复使用一个创建开销比较大的类时，比起实例不断地销毁和重新实例化，单例能节约更多资源，比如数据库连接；
- 单例模式可以解决对资源的多重占用，比如写文件操作时，因为只有一个实例，可以避免对一个文件进行同时操作；
- 只使用一个实例，也可以减小垃圾回收机制 GC（Garbage Collecation） 的压力，表现在浏览器中就是系统卡顿减少，操作更流畅，CPU 资源占用更少；

**单例模式也是有缺点的**

- 单例模式对扩展不友好，一般不容易扩展，因为单例模式一般自行实例化，没有接口；
- 与单一职责原则冲突，一个类应该只关心内部逻辑，而不关心外面怎么样来实例化；

**. 单例模式的使用场景**

那我们应该在什么场景下使用单例模式呢：

- 当一个类的实例化过程消耗的资源过多，可以使用单例模式来避免性能浪费；
- 当项目中需要一个公共的状态，那么需要使用单例模式来保证访问一致性；

## 工厂模式

> 工厂模式 （Factory Pattern），根据不同的输入返回不同类的实例，一般用来创建同一类对象。工厂方式的主要思想是将对象的创建与对象的实现分离。

**1\. 你曾见过的工厂模式**

> 今天你的老同学找你来玩，你决定下个馆子（因为不会做饭），于是你来到了小区门口的饭店，跟老板说，来一份鱼香肉丝，一份宫保鸡丁。等会儿菜就烧好端到你的面前，不用管菜烧出来的过程，你只要负责吃就行了。

上面这两个例子都是工厂模式的实例，老板相当于工厂，负责生产产品，访问者通过老板就可以拿到想要的产品。

在类似场景中，这些例子有以下特点：

- 访问者只需要知道产品名，就可以从工厂获得对应实例；
- 访问者不关心实例创建过程；

**2\. 实例的代码实现**

> 如果你使用过 `document.createElement` 方法创建过 `DOM` 元素，那么你已经使用过工厂方法了，虽然这个方法实际上很复杂，但其使用的就是工厂方法的思想：访问者只需提供标签名（如 `div`、`img`），那么这个方法就会返回对应的 DOM 元素。

我们可以使用 JavaScript 将上面饭馆例子实现一下：

```js
/* 饭店方法 */
function restaurant(menu) {
  switch (menu) {
    case "鱼香肉丝":
      return new YuXiangRouSi();
    case "宫保鸡丁":
      return new GongBaoJiDin();
    default:
      throw new Error("这个菜本店没有 -。-");
  }
}

/* 鱼香肉丝类 */
function YuXiangRouSi() {
  this.type = "鱼香肉丝";
}

YuXiangRouSi.prototype.eat = function () {
  console.log(this.type + " 真香~");
};

/* 宫保鸡丁类 */
function GongBaoJiDin() {
  this.type = "宫保鸡丁";
}

GongBaoJiDin.prototype.eat = function () {
  console.log(this.type + " 让我想起了外婆做的菜~");
};

const dish1 = restaurant("鱼香肉丝");
dish1.eat(); // 输出: 鱼香肉丝 真香~
const dish2 = restaurant("红烧排骨"); // 输出: Error 这个菜本店没有 -。-
```

> 工厂方法中这里使用 `switch-case` 语法，你也可以用 `if-else`，都可以。

下面使用 ES6 的 class 语法改写一下：

```js
/* 饭店方法 */
class Restaurant {
  static getMenu(menu) {
    switch (menu) {
      case "鱼香肉丝":
        return new YuXiangRouSi();
      case "宫保鸡丁":
        return new GongBaoJiDin();
      default:
        throw new Error("这个菜本店没有 -。-");
    }
  }
}

/* 鱼香肉丝类 */
class YuXiangRouSi {
  constructor() {
    this.type = "鱼香肉丝";
  }

  eat() {
    console.log(this.type + " 真香~");
  }
}

/* 宫保鸡丁类 */
class GongBaoJiDin {
  constructor() {
    this.type = "宫保鸡丁";
  }

  eat() {
    console.log(this.type + " 让我想起了外婆做的菜~");
  }
}

const dish1 = Restaurant.getMenu("鱼香肉丝");
dish1.eat(); // 输出: 鱼香肉丝 真香~
const dish2 = Restaurant.getMenu("红烧排骨"); // 输出: Error 这个菜本店没有 -。-
```

- 这样就完成了一个工厂模式，但是这个实现有一个问题：工厂方法中包含了很多与创建产品相关的过程，如果产品种类很多的话，这个工厂方法中就会罗列很多产品的创建逻辑，每次新增或删除产品种类，不仅要增加产品类，还需要对应修改在工厂方法，违反了开闭原则，也导致这个工厂方法变得臃肿、高耦合。
- 严格上这种实现在面向对象语言中叫做简单工厂模式。适用于产品种类比较少，创建逻辑不复杂的时候使用。
- 工厂模式的本意是将实际创建对象的过程推迟到子类中，一般用抽象类来作为父类，创建过程由抽象类的子类来具体实现。JavaScript 中没有抽象类，所以我们可以简单地将工厂模式看做是一个实例化对象的工厂类即可。关于抽象类的有关内容，可以参看抽象工厂模式。
- 然而作为灵活的 JavaScript，我们不必如此较真，可以把易变的参数提取出来：

```js
/* 饭店方法 */
class Restaurant {
  constructor() {
    this.menuData = {};
  }

  /* 创建菜品 */
  getMenu(menu) {
    if (!this.menuData[menu]) throw new Error("这个菜本店没有 -。-");
    const { type, message } = this.menuData[menu];
    return new Menu(type, message);
  }

  /* 增加菜品种类 */
  addMenu(menu, type, message) {
    if (this.menuData[menu]) {
      console.Info("已经有这个菜了!");
      return;
    }
    this.menuData[menu] = { type, message };
  }

  /* 移除菜品 */
  removeMenu(menu) {
    if (!this.menuData[menu]) return;
    delete this.menuData[menu];
  }
}

/* 菜品类 */
class Menu {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  eat() {
    console.log(this.type + this.message);
  }
}

const restaurant = new Restaurant();
restaurant.addMenu("YuXiangRouSi", "鱼香肉丝", " 真香~"); // 注册菜品
restaurant.addMenu("GongBaoJiDin", "宫保鸡丁", " 让我想起了外婆做的菜~");

const dish1 = restaurant.getMenu("YuXiangRouSi");
dish1.eat(); // 输出: 鱼香肉丝 真香~
const dish2 = restaurant.getMenu("HongSaoPaiGu"); // 输出: Error 这个菜本店没有 -。-
```

- 我们还给 Restaurant 类增加了 `addMenu/removeMenu` 私有方法，以便于扩展。
- 当然这里如果菜品参数不太一致，可以在 `addMenu` 时候注册构造函数或者类，创建的时候返回 `new` 出的对应类实例，灵活变通即可。

**3\. 工厂模式的通用实现**

> 根据上面的例子我们可以提炼一下工厂模式，饭店可以被认为是工厂类（Factory），菜品是产品（Product），如果我们希望获得菜品实例，通过工厂类就可以拿到产品实例，不用关注产品实例创建流程。主要有下面几个概念：

- Factory ：工厂，负责返回产品实例；
- Product ：产品，访问者从工厂拿到产品实例；

结构大概如下：

![](https://s.poetries.top/gitee/2020/07/83.png)

下面用通用的方法实现，这里直接用 class 语法：

```js
/* 工厂类 */
class Factory {
  static getInstance(type) {
    switch (type) {
      case "Product1":
        return new Product1();
      case "Product2":
        return new Product2();
      default:
        throw new Error("当前没有这个产品");
    }
  }
}

/* 产品类1 */
class Product1 {
  constructor() {
    this.type = "Product1";
  }

  operate() {
    console.log(this.type);
  }
}

/* 产品类2 */
class Product2 {
  constructor() {
    this.type = "Product2";
  }

  operate() {
    console.log(this.type);
  }
}

const prod1 = Factory.getInstance("Product1");
prod1.operate(); // 输出: Product1
const prod2 = Factory.getInstance("Product3"); // 输出: Error 当前没有这个产品
```

> 注意，由于 JavaScript 的灵活，简单工厂模式返回的产品对象不一定非要是类实例，也可以是字面量形式的对象，所以读者可以根据场景灵活选择返回的产品对象形式。

**4\. 源码中的工厂模式**

**4.1 Vue/React 源码中的工厂模式**

> 和原生的 `document.createElement` 类似，Vue 和 `React` 这种具有虚拟 `DOM`树（Virtual Dom Tree）机制的框架在生成虚拟 `DOM` 的时候，都提供了 `createElement` 方法用来生成 `VNode`，用来作为真实 DOM 节点的映射：

```js
// Vue
createElement("h3", { class: "main-title" }, [
  createElement("img", { class: "avatar", attrs: { src: "../avatar.jpg" } }),
  createElement("p", { class: "user-desc" }, "长得帅老的快，长得丑活得久"),
]);

// React
React.createElement(
  "h3",
  { className: "user-info" },
  React.createElement("img", { src: "../avatar.jpg", className: "avatar" }),
  React.createElement(
    "p",
    { className: "user-desc" },
    "长得帅老的快，长得丑活得久"
  )
);
```

**`createElemen`t 函数结构大概如下：**

```js
class Vnode (tag, data, children) { ... }

function createElement(tag, data, children) {
   return new Vnode(tag, data, children)
}
```

> 可以看到 `createElement` 函数内会进行 `VNode` 的具体创建，创建的过程是很复杂的，而框架提供的 `createElement` 工厂方法封装了复杂的创建与验证过程，对于使用者来说就很方便了。

**4.2 vue-router 源码中的工厂模式**

> 工厂模式在源码中应用频繁，以 `vue-router` 中的源码为例，代码位置：`vue-router/src/index.js`

```js
// src/index.js
export default class VueRouter {
  constructor(options) {
    this.mode = mode; // 路由模式

    switch (
      mode // 简单工厂
    ) {
      case "history": // history 方式
        this.history = new HTML5History(this, options.base);
        break;
      case "hash": // hash 方式
        this.history = new HashHistory(this, options.base, this.fallback);
        break;
      case "abstract": // abstract 方式
        this.history = new AbstractHistory(this, options.base);
        break;
      default:
      // ... 初始化失败报错
    }
  }
}
```

> 稍微解释一下这里的源码。mode 是路由创建的模式，这里有三种 `History`、`Hash`、`Abstract`，前两种我们已经很熟悉了，`History` 是 `H5` 的路由方式，`Hash` 是路由中带 # 的路由方式，`Abstract` 代表非浏览器环境中路由方式，比如 `Node`、`weex` 等；`this.history` 用来保存路由实例，`vue-router` 中使用了工厂模式的思想来获得响应路由控制类的实例。

- 源码里没有把工厂方法的产品创建流程封装出来，而是直接将产品实例的创建流程暴露在 `VueRouter` 的构造函数中，在被 new 的时候创建对应产品实例，相当于 `VueRouter` 的构造函数就是一个工厂方法。
- 如果一个系统不是 `SPA` （Single Page Application，单页应用），而是是 `MPA`（Multi Page Application，多页应用），那么就需要创建多个 `VueRouter` 的实例，此时 `VueRouter` 的构造函数也就是工厂方法将会被多次执行，以分别获得不同实例。

**5\. 工厂模式的优缺点**

工厂模式将对象的创建和实现分离，这带来了优点：

- 良好的封装，代码结构清晰，访问者无需知道对象的创建流程，特别是创建比较复杂的情况下；
- 扩展性优良，通过工厂方法隔离了用户和创建流程隔离，符合开放封闭原则；
- 解耦了高层逻辑和底层产品类，符合最少知识原则，不需要的就不要去交流；
- 工厂模式的缺点：带来了额外的系统复杂度，增加了抽象性；

**6\. 工厂模式的使用场景**

那么什么时候使用工厂模式呢：

- 对象的创建比较复杂，而访问者无需知道创建的具体流程；
- 处理大量具有相同属性的小对象；

什么时候不该用工厂模式：滥用只是增加了不必要的系统复杂度，过犹不及。

**7\. 其他相关模式**

**7.1 工厂模式与抽象工厂模式**

这两个方式可以组合使用，具体联系与区别在抽象工厂模式中讨论。

**7.2 工厂模式与模板方法模式**

这两个模式看起来比较类似，不过主要区别是：

- 工厂模式 主要关注产品实例的创建，对创建流程封闭起来；
- 模板方法模式 主要专注的是为固定的算法骨架提供某些步骤的实现；
- 这两个模式也可以组合一起来使用，比如在模板方法模式里面，使用工厂方法来创建模板方法需要的对象。

## 抽象工厂模式

## 建造者模式
