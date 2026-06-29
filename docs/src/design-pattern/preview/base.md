
# 设计模式-基础篇

## this、new、bind、call、apply

**1. this 指向的类型**

> 刚开始学习 JavaScript 的时候，`this` 总是最能让人迷惑，下面我们一起看一下在 JavaScript 中应该如何确定 this 的指向。`this` 是在函数被调用时确定的，它的指向完全取决于函数调用的地方，而不是它被声明的地方（除箭头函数外）。当一个函数被调用时，会创建一个执行上下文，它包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息，this 就是这个记录的一个属性，它会在函数执行的过程中被用到。

**this 在函数的指向有以下几种场景：**

- 作为构造函数被 new 调用；
- 作为对象的方法使用；
- 作为函数直接调用；
- 被 `call`、`apply`、`bind` 调用；
- 箭头函数中的 `this`；

**1.1 new 绑定**

> 函数如果作为构造函数使用 `new` 调用时， `this` 绑定的是新创建的构造函数的实例。

```js
function Foo() {
  console.log(this);
}

var bar = new Foo(); // 输出: Foo 实例，this 就是 bar
```

> 实际上使用 `new` 调用构造函数时，会依次执行下面的操作：

- 创建一个新对象；
- 构造函数的 `prototype` 被赋值给这个新对象的 `__proto__`；
- 将新对象赋给当前的 `this`；
- 执行构造函数；
- 如果函数没有返回其他对象，那么 `new` 表达式中的函数调用会自动返回这个新对象，如果返回的不是对象将被忽略；

**1.2 显式绑定**

> 通过 `call`、`apply`、`bind` 我们可以修改函数绑定的 `this`，使其成为我们指定的对象。通过这些方法的第一个参数我们可以显式地绑定 `this`。

```js
function foo(name, price) {
    this.name = name
    this.price = price
}

function Food(category, name, price) {
    foo.call(this, name, price)       // call 方式调用
    // foo.apply(this, [name, price])    // apply 方式调用
    this.category = category
}

new Food('食品', '汉堡', '5块钱')

// 浏览器中输出: {name: "汉堡", price: "5块钱", category: "食品"}
call 和 apply 的区别是 call 方法接受的是参数列表，而 apply 方法接受的是一个参数数组。

func.call(thisArg, arg1, arg2, ...)        // call 用法
func.apply(thisArg, [arg1, arg2, ...])     // apply 用法
```

> 而 `bind` 方法是设置 `this` 为给定的值，并返回一个新的函数，且在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

```js
func.bind(thisArg[, arg1[, arg2[, ...]]])    // bind 用法
```

举个例子：

```js
var food = {
    name: '汉堡',
    price: '5块钱',
    getPrice: function(place) {
        console.log(place + this.price)
    }
}

food.getPrice('KFC ')   // 浏览器中输出: "KFC 5块钱"

var getPrice1 = food.getPrice.bind({ name: '鸡腿', price: '7块钱' }, '肯打鸡 ')
getPrice1()       // 浏览器中输出: "肯打鸡 7块钱"
关于 bind 的原理，我们可以使用 apply 方法自己实现一个 bind 看一下：

// ES5 方式
Function.prototype.bind = Function.prototype.bind || function() {
    var self = this
    var rest1 = Array.prototype.slice.call(arguments)
    var context = rest1.shift()
    return function() {
        var rest2 = Array.prototype.slice.call(arguments)
        return self.apply(context, rest1.concat(rest2))
    }
}

// ES6 方式
Function.prototype.bind = Function.prototype.bind || function(...rest1) {
    const self = this
    const context = rest1.shift()
    return function(...rest2) {
        return self.apply(context, [...rest1, ...rest2])
    }
}
```

> `ES6` 方式用了一些 `ES6` 的知识比如 `rest` 参数、数组解构

**注意：** 如果你把 `null` 或 `undefined` 作为 `this` 的绑定对象传入 `call`、`apply`、`bind`，这些值在调用时会被忽略，实际应用的是默认绑定规则。

```js
var a = "hello";

function foo() {
  console.log(this.a);
}

foo.call(null); // 浏览器中输出: "hello"
```

**1.3 隐式绑定**

> 函数是否在某个上下文对象中调用，如果是的话 `this` 绑定的是那个上下文对象。

```js
var a = "hello";

var obj = {
  a: "world",
  foo: function () {
    console.log(this.a);
  },
};

obj.foo(); // 浏览器中输出: "world"
```

> 上面代码中，`foo` 方法是作为对象的属性调用的，那么此时 `foo` 方法执行时，`this` 指向 `obj` 对象。也就是说，此时 `this` 指向调用这个方法的对象，如果嵌套了多个对象，那么指向最后一个调用这个方法的对象：

```js
var a = "hello";

var obj = {
  a: "world",
  b: {
    a: "China",
    foo: function () {
      console.log(this.a);
    },
  },
};

obj.b.foo(); // 浏览器中输出: "China"
```

> 最后一个对象是 `obj` 上的 `b`，那么此时 `foo` 方法执行时，其中的 `this` 指向的就是 `b` 对象。

**1.4 默认绑定**

> 函数独立调用，直接使用不带任何修饰的函数引用进行调用，也是上面几种绑定途径之外的方式。非严格模式下 this 绑定到全局对象（浏览器下是 `winodw`，`node` 环境是 `global`），严格模式下 `this` 绑定到 `undefined` （因为严格模式不允许 `this` 指向全局对象）。

```js
var a = "hello";

function foo() {
  var a = "world";
  console.log(this.a);
  console.log(this);
}

foo(); // 相当于执行 window.foo()

// 浏览器中输出: "hello"
// 浏览器中输出: Window 对象
```

> 上面代码中，变量 `a` 被声明在全局作用域，成为全局对象 `window` 的一个同名属性。函数 `foo` 被执行时，`this` 此时指向的是全局对象，因此打印出来的 `a` 是全局对象的属性。

注意有一种情况：

```js
var a = "hello";

var obj = {
  a: "world",
  foo: function () {
    console.log(this.a);
  },
};

var bar = obj.foo;

bar(); // 浏览器中输出: "hello"
```

> 此时 `bar` 函数，也就是 `obj` 上的 `foo` 方法为什么又指向了全局对象呢，是因为 `bar` 方法此时是作为函数独立调用的，所以此时的场景属于默认绑定，而不是隐式绑定。这种情况和把方法作为回调函数的场景类似：

```js
var a = "hello";

var obj = {
  a: "world",
  foo: function () {
    console.log(this.a);
  },
};

function func(fn) {
  fn();
}

func(obj.foo); // 浏览器中输出: "hello"
```

- 参数传递实际上也是一种隐式的赋值，只不过这里 `obj.foo` 方法是被隐式赋值给了函数 `func` 的形参 `fn`，而之前的情景是自己赋值，两种情景实际上类似。这种场景我们遇到的比较多的是 `setTimeout` 和 `setInterval`，如果回调函数不是箭头函数，那么其中的 `this` 指向的就是全局对象.
- 其实我们可以把默认绑定当作是隐式绑定的特殊情况，比如上面的 `bar()`，我们可以当作是使用 `window.bar()` 的方式调用的，此时 bar 中的 `this` 根据隐式绑定的情景指向的就是 `window`。

**2\. this 绑定的优先级**

> `this` 存在多个使用场景，那么多个场景同时出现的时候，`this` 到底应该如何指向呢。这里存在一个优先级的概念，`this` 根据优先级来确定指向。**优先级：new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定**

**所以 this 的判断顺序：**

- `new` 绑定： 函数是否在 `new` 中调用？如果是的话 `this` 绑定的是新创建的对象；
- 显式绑定： 函数是否是通过 `bind`、`call`、`apply` 调用？如果是的话，`this` 绑定的是指定的对象；
- 隐式绑定： 函数是否在某个上下文对象中调用？如果是的话，`this` 绑定的是那个上下文对象；
- 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 `undefined`，否则绑定到全局对象；

**3\. 箭头函数中的 this**

- 箭头函数 是根据其声明的地方来决定 `this` 的
- 箭头函数的 `this` 绑定是无法通过 `call`、`apply`、`bind` 被修改的，且因为箭头函数没有构造函数 `constructor`，所以也不可以使用 new 调用，即不能作为构造函数，否则会报错。

```js
var a = "hello";

var obj = {
  a: "world",
  foo: () => {
    console.log(this.a);
  },
};

obj.foo(); // 浏览器中输出: "hello"
```

**4\. 一个 this 的小练习**

用一个小练习来实战一下：

```js
var a = 20;

var obj = {
  a: 40,
  foo: () => {
    console.log(this.a);

    function func() {
      this.a = 60;
      console.log(this.a);
    }

    func.prototype.a = 50;
    return func;
  },
};

var bar = obj.foo(); // 浏览器中输出: 20
bar(); // 浏览器中输出: 60
new bar(); // 浏览器中输出: 60
```

稍微解释一下：

- `var a = 20` 这句在全局变量 `window` 上创建了个属性 `a` 并赋值为 `20`；
- 首先执行的是 `obj.foo()`，这是一个箭头函数，箭头函数不创建新的函数作用域直接沿用语句外部的作用域，因此 `obj.foo()` 执行时箭头函数中 `this` 是全局 `window`，首先打印出 window 上的属性 a 的值 20，箭头函数返回了一个原型上有个值为 `50` 的属性 `a` 的函数对象 `func` 给 `bar`；
- 继续执行的是 `bar()`，这里执行的是刚刚箭头函数返回的闭包 `func`，其内部的 `this` 指向 `window`，因此 `this.a` 修改了 `window.a` 的值为 `60` 并打印出来；
- 然后执行的是 `new bar()`，根据之前的表述，`new` 操作符会在 `func` 函数中创建一个继承了 `func` 原型的实例对象并用 `this` 指向它，随后 `this.a = 60` 又在实例对象上创建了一个属性 `a`，在之后的打印中已经在实例上找到了属性 `a`，因此就不继续往对象原型上查找了，所以打印出第三个 `60`；
- 如果把上面例子的箭头函数换成普通函数呢，结果会是什么样？

```js
var a = 20;

var obj = {
  a: 40,
  foo: function () {
    console.log(this.a);

    function func() {
      this.a = 60;
      console.log(this.a);
    }

    func.prototype.a = 50;
    return func;
  },
};

var bar = obj.foo(); // 浏览器中输出: 40
bar(); // 浏览器中输出: 60
new bar(); // 浏览器中输出: 60
```

## 闭包与高阶函数

**1\. 闭包**

**1.1 什么是闭包**

> 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

我们首先来看一个闭包的例子：

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 输出: 2
```

- `foo` 函数传递出了一个函数 `bar`，传递出来的 `bar` 被赋值给 `baz` 并调用，虽然这时 `baz` 是在 `foo` 作用域外执行的，但 `baz` 在调用的时候可以访问到前面的 `bar` 函数所在的 `foo` 的内部作用域。
- 由于 `bar` 声明在 `foo` 函数内部，`bar` 拥有涵盖 `foo` 内部作用域的闭包，使得 `foo` 的内部作用域一直存活不被回收。一般来说，函数在执行完后其整个内部作用域都会被销毁，因为 `JavaScript` 的 `GC`（Garbage Collection）垃圾回收机制会自动回收不再使用的内存空间。但是闭包会阻止某些 `GC`，比如本例中 `foo()` 执行完，因为返回的 `bar` 函数依然持有其所在作用域的引用，所以其内部作用域不会被回收。
- 注意： 如果不是必须使用闭包，那么尽量避免创建它，因为闭包在处理速度和内存消耗方面对性能具有负面影响。

**1.2 利用闭包实现结果缓存（备忘模式）**

> 备忘模式就是应用闭包的特点的一个典型应用。比如有个函数：

```js
function add(a) {
  return a + 1;
}
```

- 多次运行 `add()` 时，每次得到的结果都是重新计算得到的，如果是开销很大的计算操作的话就比较消耗性能了，这里可以对已经计算过的输入做一个缓存。
- 所以这里可以利用闭包的特点来实现一个简单的缓存，在函数内部用一个对象存储输入的参数，如果下次再输入相同的参数，那就比较一下对象的属性，如果有缓存，就直接把值从这个对象里面取出来。

```js
/* 备忘函数 */
function memorize(fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var key = JSON.stringify(args);
    return cache[key] || (cache[key] = fn.apply(fn, args));
  };
}

/* 复杂计算函数 */
function add(a) {
  return a + 1;
}

var adder = memorize(add);

adder(1); // 输出: 2    当前: cache: { '[1]': 2 }
adder(1); // 输出: 2    当前: cache: { '[1]': 2 }
adder(2); // 输出: 3    当前: cache: { '[1]': 2, '[2]': 3 }
```

> 使用 `ES6` 的方式会更优雅一些：

```js
/* 备忘函数 */
function memorize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    return cache[key] || (cache[key] = fn.apply(fn, args));
  };
}

/* 复杂计算函数 */
function add(a) {
  return a + 1;
}

const adder = memorize(add);

adder(1); // 输出: 2    当前: cache: { '[1]': 2 }
adder(1); // 输出: 2    当前: cache: { '[1]': 2 }
adder(2); // 输出: 3    当前: cache: { '[1]': 2, '[2]': 3 }
```

稍微解释一下：

- 备忘函数中用 `JSON.stringify` 把传给 `adder` 函数的参数序列化成字符串，把它当做 `cache` 的索引，将 `add` 函数运行的结果当做索引的值传递给 `cache`，这样 `adder` 运行的时候如果传递的参数之前传递过，那么就返回缓存好的计算结果，不用再计算了，如果传递的参数没计算过，则计算并缓存 `fn.apply(fn, args)`，再返回计算的结果。
- 当然这里的实现如果要实际应用的话，还需要继续改进一下，比如：
- 缓存不可以永远扩张下去，这样太耗费内存资源，我们可以只缓存最新传入的 `n` 个；
- 在浏览器中使用的时候，我们可以借助浏览器的持久化手段，来进行缓存的持久化，比如 `cookie`、`localStorage` 等；
- 这里的复杂计算函数可以是过去的某个状态，比如对某个目标的操作，这样把过去的状态缓存起来，方便地进行状态回退。
- 复杂计算函数也可以是一个返回时间比较慢的异步操作，这样如果把结果缓存起来，下次就可以直接从本地获取，而不是重新进行异步请求。

> 注意： `cache` 不可以是 `Map`，因为 `Map` 的键是使用 `===` 比较的，因此当传入引用类型值作为键时，虽然它们看上去是相等的，但实际并不是，比如 `[1]!==[1]`，所以还是被存为不同的键。

```js
//  X 错误示范
function memorize(fn) {
  const cache = new Map();
  return function (...args) {
    return cache.get(args) || cache.set(args, fn.apply(fn, args)).get(args);
  };
}

function add(a) {
  return a + 1;
}

const adder = memorize(add);

adder(1); // 2    cache: { [ 1 ] => 2 }
adder(1); // 2    cache: { [ 1 ] => 2, [ 1 ] => 2 }
adder(2); // 3    cache: { [ 1 ] => 2, [ 1 ] => 2, [ 2 ] => 3 }
```

**2\. 高阶函数**

> 高阶函数就是输入参数里有函数，或者输出是函数的函数。

**2.1 函数作为参数**

> 如果你用过 `setTimeout`、`setInterval`、`ajax` 请求，那么你已经用过高阶函数了，这是我们最常看到的场景：回调函数，因为它将函数作为参数传递给另一个函数。

> 比如 `ajax` 请求中，我们通常使用回调函数来定义请求成功或者失败时的操作逻辑：

```js
$.ajax("/request/url", function (result) {
  console.log("请求成功！");
});
```

> 在 `Array`、`Object`、`String` 等等基本对象的原型上有很多操作方法，可以接受回调函数来方便地进行对象操作。这里举一个很常用的 `Array.prototype.filter()` 方法，这个方法返回一个新创建的数组，包含所有回调函数执行后返回 `true` 或真值的数组元素。

```js
var words = ["spray", "limit", "elite", "exuberant", "destruction", "present"];

var result = words.filter(function (word) {
  return word.length > 6;
}); // 输出: ["exuberant", "destruction", "present"]
```

> 回调函数还有一个应用就是钩子，如果你用过 Vue 或者 React 等框架，那么你应该对钩子很熟悉了，它的形式是这样的：

```js
function foo(callback) {
  // ... 一些操作
  callback();
}
```

**2.2 函数作为返回值**

> 另一个经常看到的高阶函数的场景是在一个函数内部输出另一个函数，比如：

```js
function foo() {
  return function bar() {};
}
```

> 主要是利用闭包来保持着作用域：

```js
function add() {
  var num = 0;
  return function (a) {
    return (num = num + a);
  };
}
var adder = add();

adder(1); // 输出: 1
adder(2); // 输出: 3
```

**1\. 柯里化**

- 柯里化（Currying），又称部分求值（Partial Evaluation），是把接受多个参数的原函数变换成接受一个单一参数（原函数的第一个参数）的函数，并且返回一个新函数，新函数能够接受余下的参数，最后返回同原函数一样的结果。
- 核心思想是把多参数传入的函数拆成单（或部分）参数函数，内部再返回调用下一个单（或部分）参数函数，依次处理剩余的参数。

**柯里化有 3 个常见作用：**

- 参数复用
- 提前返回
- 延迟计算/运行
- 先来看看柯里化的通用实现：

```js
// ES5 方式
function currying(fn) {
  var rest1 = Array.prototype.slice.call(arguments);
  rest1.shift();
  return function () {
    var rest2 = Array.prototype.slice.call(arguments);
    return fn.apply(null, rest1.concat(rest2));
  };
}

// ES6 方式
function currying(fn, ...rest1) {
  return function (...rest2) {
    return fn.apply(null, rest1.concat(rest2));
  };
}
```

> 用它将一个 `sayHello` 函数柯里化试试：

```js
// 接上面
function sayHello(name, age, fruit) {
  console.log(console.log(`我叫 ${name},我 ${age} 岁了, 我喜欢吃 ${fruit}`));
}

var curryingShowMsg1 = currying(sayHello, "小明");
curryingShowMsg1(22, "苹果"); // 输出: 我叫 小明,我 22 岁了, 我喜欢吃 苹果

var curryingShowMsg2 = currying(sayHello, "小衰", 20);
curryingShowMsg2("西瓜"); // 输出: 我叫 小衰,我 20 岁了, 我喜欢吃 西瓜
```

> 更高阶的用法参见：JavaScript 函数式编程技巧 - 柯里化

**2\. 反柯里化**

- 柯里化是固定部分参数，返回一个接受剩余参数的函数，也称为部分计算函数，目的是为了缩小适用范围，创建一个针对性更强的函数。核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数。
- 而反柯里化，从字面讲，意义和用法跟函数柯里化相比正好相反，扩大适用范围，创建一个应用范围更广的函数。使本来只有特定对象才适用的方法，扩展到更多的对象。

先来看看反柯里化的通用实现吧~

```js
// ES5 方式
Function.prototype.unCurrying = function() {
  var self = this
  return function() {
    var rest = Array.prototype.slice.call(arguments)
    return Function.prototype.call.apply(self, rest)
  }
}

// ES6 方式
Function.prototype.unCurrying = function() {
  const self = this
  return function(...rest) {
    return Function.prototype.call.apply(self, rest)
  }
}
如果你觉得把函数放在 Function 的原型上不太好，也可以这样：

// ES5 方式
function unCurrying(fn) {
  return function (tar) {
    var rest = Array.prototype.slice.call(arguments)
    rest.shift()
    return fn.apply(tar, rest)
  }
}

// ES6 方式
function unCurrying(fn) {
  return function(tar, ...argu) {
    return fn.apply(tar, argu)
  }
}
```

> 下面简单试用一下反柯里化通用实现，我们将 `Array` 上的 `push` 方法借出来给 `arguments`这样的类数组增加一个元素：

```js
// 接上面
var push = unCurrying(Array.prototype.push);

function execPush() {
  push(arguments, 4);
  console.log(arguments);
}

execPush(1, 2, 3); // 输出: [1, 2, 3, 4]
```

> 简单说，函数柯里化就是对高阶函数的降阶处理，缩小适用范围，创建一个针对性更强的函数。

```js
function(arg1, arg2)              // => function(arg1)(arg2)
function(arg1, arg2, arg3)        // => function(arg1)(arg2)(arg3)
function(arg1, arg2, arg3, arg4)  // => function(arg1)(arg2)(arg3)(arg4)
function(arg1, arg2, ..., argn)   // => function(arg1)(arg2)…(argn)
```

> 而反柯里化就是反过来，增加适用范围，让方法使用场景更大。使用反柯里化, 可以把原生方法借出来，让任何对象拥有原生对象的方法。

```js
obj.func(arg1, arg2); // => func(obj, arg1, arg2)
```

**可以这样理解柯里化和反柯里化的区别：**

- 柯里化是在运算前提前传参，可以传递多个参数；
- 反柯里化是延迟传参，在运算时把原来已经固定的参数或者 this 上下文等当作参数延迟到未来传递。
- 更高阶的用法参见：JavaScript 函数式编程技巧 - 反柯里化

**3\. 偏函数**

> 偏函数是创建一个调用另外一个部分（参数或变量已预制的函数）的函数，函数可以根据传入的参数来生成一个真正执行的函数。其本身不包括我们真正需要的逻辑代码，只是根据传入的参数返回其他的函数，返回的函数中才有真正的处理逻辑比如：

```js
var isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };
};

var isString = isType("String");
var isFunction = isType("Function");
```

> 这样就用偏函数快速创建了一组判断对象类型的方法~

**偏函数和柯里化的区别：**

- 柯里化是把一个接受 `n` 个参数的函数，由原本的一次性传递所有参数并执行变成了可以分多次接受参数再执行，例如：`add = (x, y, z) => x + y + z→curryAdd = x => y => z => x + y + z；`
- 偏函数固定了函数的某个部分，通过传入的参数或者方法返回一个新的函数来接受剩余的参数，数量可能是一个也可能是多个；
- 当一个柯里化函数只接受两次参数时，比如 `curry()()`，这时的柯里化函数和偏函数概念类似，可以认为偏函数是柯里化函数的退化版

## ES6

## 继承与原型链

## 设计原则
