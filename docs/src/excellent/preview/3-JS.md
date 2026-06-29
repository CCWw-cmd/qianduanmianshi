
## 1 数据类型基础

### 1.1 JS内置类型

* `JS` 中分为七种内置类型，七种内置类型又分为两大类型：基本类型和对象（`Object`）。
* 基本类型有七种： `null`，`undefined`，`boolean`，`number`，`string`，`symbol`, `bigint`
  * `BigInt` 是 `ES10` 新增的数据类型
  * `Symbol` 代表独一无二的值，最大的用法是用来定义对象的唯一属性名。
  * `BigInt` 可以表示任意大小的整数。
* 其中 `JS` 的数字类型是浮点类型的，没有整型。并且浮点类型基于 `IEEE 754`标准实现，在使用中会遇到某些 Bug。`NaN` 也属于 `number` 类型，并且 `NaN` 不等于自身。
* 对于基本类型来说，如果使用字面量的方式，那么这个变量只是个字面量，只有在必要的时候才会转换为对应的类型。

**引用数据类型:**

* 对象`Object`（包含普通对象-`Object`，数组对象-`Array`，正则对象-`RegExp`，日期对象-`Date`，数学函数-`Math`，函数对象-`Function`）

```js
let a = 111 // 这只是字面量，不是 number 类型
a.toString() // 使用时候才会转换为对象类型
```

> 对象（`Object`）是引用类型，在使用过程中会遇到浅拷贝和深拷贝的问题。

```js
let a = { name: 'FE' }
let b = a
b.name = 'EF'
console.log(a.name) // EF
```

**说出下面运行的结果，解释原因。**

```js
function test(person) {
  person.age = 26
  person = {
    name: 'hzj',
    age: 18
  }
  return person
}
const p1 = {
  name: 'fyq',
  age: 19
}
const p2 = test(p1)
console.log(p1) // -> ?
console.log(p2) // -> ?
```

```js
// 结果:
p1：{name: “fyq”, age: 26}
p2：{name: “hzj”, age: 18}
```

> 原因: 在函数传参的时候传递的是对象在堆中的内存地址值，test函数中的实参person是p1对象的内存地址，通过调用`person.age = 26`确实改变了p1的值，但随后`person`变成了另一块内存空间的地址，并且在最后将这另外一份内存空间的地址返回，赋给了p2。

### 1.2 null和undefined区别

> `Undefined`类型只有一个值，即`undefined`。当声明的变量还未被初始化时，变量的默认值为`undefined`。用法

* 变量被声明了，但没有赋值时，就等于`undefined`。
* 调用函数时，应该提供的参数没有提供，该参数等于`undefined`。
* 对象没有赋值的属性，该属性的值为`undefined`。
* 函数没有返回值时，默认返回`undefined`

> `Null`类型也只有一个值，即`null`。`null`用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象。用法

* 作为函数的参数，表示该函数的参数不是对象。
* 作为对象原型链的终点

### 1.3 null是对象吗？为什么？

结论: `null`不是对象。

> 解释: 虽然 `typeof null` 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以将它错误的判断为 object 。

### 1.4 '1'.toString()为什么可以调用？

其实在这个语句运行的过程中做了这样几件事情：

```js
var s = new Object('1');
s.toString();
s = null;
```

* 第一步: 创建Object类实例。注意为什么不是String ？ 由于Symbol和BigInt的出现，对它们调用new都会报错，目前ES6规范也不建议用new来创建基本类型的包装类。
* 第二步: 调用实例方法。
* 第三步: 执行完方法立即销毁这个实例。

> 整个过程体现了`基本包装类型`的性质，而基本包装类型恰恰属于`基本数据类型`，包括Boolean, Number和String。

### 1.5 0.1+0.2为什么不等于0.3？如何让其相等

> `0.1`和`0.2`在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成`0.30000000000000004`

我们都知道计算机时是通过二进制来进行计算的，即 `0` 和 `1`

* 就拿 `0.1 + 0.2` 来说，`0.1`表示为`0.0001100110011001...`，而`0.2`表示为`0.0011001100110011...`
* 而在二进制中 `1 + 1 = 10`，所以 `0.1 + 0.2 = 0.0100110011001100...`
* 转成`10`进制就近似表示为 `0.30000000000000004`

> 简单来说就是，**浮点数转成二进制时丢失了精度，因此在二进制计算完再转回十进制时可能会和理论结果不同**

**1\. ES6提供的Number.EPSILON方法**

```js
function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log(isEqual(0.1 + 0.2, 0.3)); // true
```

> `Number.EPSILON` 的实质是一个可以接受的最小误差范围，一般来说为 `Math.pow(2, -52)`

**2\. 乘以一个10的幂次方**

> 把需要计算的数字乘以`10`的`n`次方，让数值都变为整数，计算完后再除以`10`的`n`次方，这样就不会出现浮点数精度丢失问题

```js
(0.1*10 + 0.2*10) / 10 == 0.3 //true
```

### 1.6 如何理解BigInt

**什么是BigInt?**

> `BigInt`是一种新的数据类型，用于当整数值大于Number数据类型支持的范围时。这种数据类型允许我们安全地对大整数执行算术操作，表示高分辨率的时间戳，使用大整数id，等等，而不需要使用库。

**为什么需要BigInt?**

在JS中，所有的数字都以双精度64位浮点格式表示，那这会带来什么问题呢？

> 这导致JS中的Number无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS中的`Number`类型只能安全地表示`-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)）`，任何超出此范围的整数值都可能失去精度。

```js
console.log(999999999999999);  //=>10000000000000000
```

同时也会有一定的安全性问题:

```js
9007199254740992 === 9007199254740993;    // → true 居然是true!
```

**如何创建并使用BigInt？**

要创建`BigInt`，只需要在数字末尾追加`n`即可

```js
console.log( 9007199254740995n );    // → 9007199254740995n 
console.log( 9007199254740995 );     // → 9007199254740996
```

另一种创建`BigInt`的方法是用`BigInt()`构造函数

```js
BigInt("9007199254740995");    // → 9007199254740995n
```

简单使用如下:

```js
10n + 20n;    // → 30n 
10n - 20n;    // → -10n 
+10n;         // → TypeError: Cannot convert a BigInt value to a number 
-10n;         // → -10n 
10n * 20n;    // → 200n 
20n / 10n;    // → 2n 
23n % 10n;    // → 3n 
10n ** 3n;    // → 1000n 

const x = 10n; 
++x;          // → 11n 
--x;          // → 9n
console.log(typeof x);   //"bigint"
```

**值得警惕的点**

> `BigInt`不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 `Number` 的不变量，或者抛出异常。另外，更改 `+` 的行为也会破坏 `asm.js` 代码。

因为隐式类型转换可能丢失信息，所以不允许在`bigint`和 `Number` 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由`BigInt`或`Number`精确表示。

```js
10 + 10n;    // → TypeError
```

> 不能将`BigInt`传递给`Web api`和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报TypeError错误。

```js
Math.max(2n, 4n, 6n);    // → TypeError
```

> 当 `Boolean` 类型与 `BigInt` 类型相遇时，`BigInt` 的处理方式与`Number`类似，换句话说，只要不是`0n`，`BigInt`就被视为`truthy`的值。

```js
if(0n){//条件判断为false

}
if(3n){//条件为true

}
```

* 元素都为BigInt的数组可以进行sort。
* `BigInt`可以正常地进行位运算，如`|`、`&`、`<<`、`>>`和`^`

**浏览器兼容性**

caniuse的结果:

![](https://s.poetries.top/images/20210309092826.png)

其实现在的兼容性并不怎么好，只有chrome67、firefox、Opera这些主流实现，要正式成为规范，其实还有很长的路要走

### 1.7 JS 整数是怎么表示的

> 通过 Number 类型来表示，遵循 IEEE754 标准，通过 64 位来表示一个数字，（1 + 11 + 52），最大安全数字是 Math.pow(2, 53) - 1，对于 16 位十进制。（符号位 + 指数位 + 小数部分有效位）

### 1.8 Number() 的存储空间是多大？如果后台发送了一个超过最大自己的数字怎么办

> Math.pow(2, 53) ，53 为有效数字，会发生截断，等于 JS 能支持的最大数字。

## 2 数据类型检测

### 2.1 typeof类型判断

> 在写业务逻辑的时候，经常要用到JS数据类型的判断，面试常见的案例深浅拷贝也要用到数据类型的判断。

**typeof**

```js
console.log(typeof 2);               // number
console.log(typeof true);            // boolean
console.log(typeof 'str');           // string
console.log(typeof undefined);       // undefined
console.log(typeof function(){});    // function
console.log(typeof Symbol("foo")); // symbol
console.log(typeof 2172141653n); // bigint

// 不能判别
console.log(typeof []); // object
console.log(typeof {}); // object
console.log(typeof null); // object
```

> 优点：能够快速区分基本数据类型 缺点：不能将`Object`、`Array`和`Null`区分，都返回`object`

**instanceof**

```js
console.log(2 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false 
console.log('str' instanceof String);                // false  
console.log([] instanceof Array);                    // true
console.log(function(){} instanceof Function);       // true
console.log({} instanceof Object);                   // true
```

* 优点：能够区分`Array`、`Object`和`Function`，适合用于判断自定义的类实例对象
* 缺点：`Number`，`Boolean`，`String`基本数据类型不能判断

> 其内部运行机制是判断在其原型链中能否找到该类型的原型

```js
class People {}
class Student extends People {}

const stu = new Student();

console.log(stu instanceof People); // true
console.log(stu instanceof Student); // true
```

其实现就是顺着原型链去找，如果能找到对应的 `Xxxxx.prototype`  即为 `true` 。比如这里的 `stu`  作为实例，顺着原型链能找到 `Student.prototype`  及 `People.prototype` ，所以都为 `true`

**Object.prototype.toString.call()**

```js
var toString = Object.prototype.toString;
 
console.log(toString.call(2));                      //[object Number]
console.log(toString.call(true));                   //[object Boolean]
console.log(toString.call('str'));                  //[object String]
console.log(toString.call([]));                     //[object Array]
console.log(toString.call(function(){}));           //[object Function]
console.log(toString.call({}));                     //[object Object]
console.log(toString.call(undefined));              //[object Undefined]
console.log(toString.call(null));                   //[object Null]
```

* 优点：精准判断数据类型，所有原始数据类型都是能判断的，还有 `Error` 对象，`Date` 对象等
* 缺点：写法繁琐不容易记，推荐进行封装后使用

```js
Object.prototype.toString.call(2); // "[object Number]"
Object.prototype.toString.call(""); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(Math); // "[object Math]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(function () {}); // "[object Function]"
```

在面试中有一个经常被问的问题就是：如何判断变量是否为数组？

```js
Array.isArray(arr); // true
arr.__proto__ === Array.prototype; // true
arr instanceof Array; // true
Object.prototype.toString.call(arr); // "[object Array]"
```

**判断是否是promise对象**

```js
function isPromise (val) {
    return (
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
}
```

### 2.2 typeof 于 instanceof 区别

> `typeof` 对于基本类型，除了 `null`都可以显示正确的类型

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined
```

> `typeof` 对于对象，除了函数都会显示 `object`

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

> 对于 `null` 来说，虽然它是基本类型，但是会显示 `object`，这是一个存在很久了的 `Bug`

```js
typeof null // 'object'
```

> `instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`

```js
// 我们也可以试着实现一下 instanceof
function _instanceof(left, right) {
    // 由于instance要检测的是某对象，需要有一个前置判断条件
    //基本数据类型直接返回false
    if(typeof left !== 'object' || left === null) return false;

    // 获得类型的原型
    let prototype = right.prototype
    // 获得对象的原型
    left = left.__proto__
    // 判断对象的类型是否等于类型的原型
    while (true) {
     if (left === null)
      return false
     if (prototype === left)
      return true
     left = left.__proto__
    }
}

console.log('test', _instanceof(null, Array)) // false
console.log('test', _instanceof([], Array)) // true
console.log('test', _instanceof('', Array)) // false
console.log('test', _instanceof({}, Object)) // true
```

### 2.3 Object.is和===的区别

> `Object`在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是`+0`和`-0`，`NaN`和`NaN`。 源码如下

```js
function is(x, y) {
  if (x === y) {
    //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
    //两个都是NaN的时候返回true
    return x !== x && y !== y;
  }
}
```

### 2.4 总结

* `typeof`
  * 直接在计算机底层基于数据类型的值（二进制）进行检测
  * `typeof null`为`object` 原因是对象存在在计算机中，都是以`000`开始的二进制存储，所以检测出来的结果是对象
  * `typeof` 普通对象/数组对象/正则对象/日期对象 都是`object`
  * `typeof NaN === 'number'`
* `instanceof`
  * 检测当前实例是否属于这个类的
  * 底层机制：只要当前类出现在实例的原型上，结果都是true
  * 不能检测基本数据类型
* `constructor`
  * 支持基本类型
  * `constructor`可以随便改，也不准
* `Object.prototype.toString.call([val])`
  * 返回当前实例所属类信息

> 判断 `Target` 的类型，单单用 `typeof` 并无法完全满足，这其实并不是 `bug`，本质原因是 `JS` 的万物皆对象的理论。因此要真正完美判断时，我们需要区分对待:

* 基本类型(`null`): 使用 `String(null)`
* 基本类型(`string / number / boolean / undefined`) + `function`: - 直接使用 `typeof`即可
* 其余引用类型(`Array / Date / RegExp Error`): 调用`toString`后根据`[object XXX]`进行判断

很稳的判断封装:

```js
let class2type = {}
'Array Date RegExp Object Error'.split(' ').forEach(e => class2type[ '[object ' + e + ']' ] = e.toLowerCase()) 

function type(obj) {
  if (obj == null) return String(obj)
  return typeof obj === 'object' ? class2type[ Object.prototype.toString.call(obj) ] || 'object' : typeof obj
}
```

## 3 数据类型转换

### 3.1 转化规则

### 3.2 转Boolean

### 3.3 对象转原始类型是根据什么流程运行的

### 3.4 如何让if(a == 1 && a == 2)条件成立

### 3.5 四则运算符

### 3.6 比较运算符

### 3.7 \[\] == !\[\]结果是什么？为什么？

### 3.8 == 和 ===有什么区别

## 4 闭包

### 4.1 闭包产生的原因

### 4.2 闭包有哪些表现形式

### 4.3 如何解决下面的循环输出问题

### 4.4 闭包的几种使用场景

## 5 原型和原型链链

### 5.1 原型/构造函数/实例

### 5.2 原型对象和构造函数有何关系

### 5.3 能不能描述一下原型链

## 6 继承

### 6.1 方式1: 借助call

### 6.2 方式2: 借助原型链

### 6.3 方式3：将前两种组合

### 6.4 方式4: 组合继承的优化1

### 6.5 方式5(最推荐使用): 组合继承的优化2

### 6.6 ES6的extends被编译后的JavaScript代码

### 6.7 从设计思想上谈谈继承本身的问题

### 6.8 继承-简版

## 7 this

## 8 内存机制

## 9 执行上下文

## 10 变量提升

## 11 模块化

## 12 异步编程

### 12.1 浏览器中的Event loop

### 12.2 Node 中的 Event loop

### 12.3 实现一个Promise A+ 规范

### 12.4 setTimeout、Promise、Async / Await 的区别

### 12.5 setTimeout(fn, 0)多久才执行，Event Loop

### 12.6 async原理

## 13 内存泄露

### 13.1 Chrome devTools查看内存情况

### 13.2 内存泄漏的场景

## 14 垃圾回收机制

## 15 深浅拷贝

## 16 对象的几种创建方式

### 16.1 工厂模式,创建方式

### 16.2 构造函数模式

### 16.3 使用原型模式

### 16.4 组合使用构造函数模式和原型模式

### 16.5 动态原型模式

## 17 数组相关

### 17.1 数组常用方法

### 17.2 Array(3)和Array(3, 4)的区别？

### 17.3 请创建一个长度为100，值都为1的数组

### 17.4 请创建一个长度为100，值为对应下标的数组

### 17.5 如何转化类数组成数组

### 17.6 forEach中return有效果吗？如何中断forEach循环？

### 17.7 JS判断数组中是否包含某个值

### 17.8 JS中flat---数组扁平化

## 18 操作DOM

### 18.1 说说有几种类型的DOM节点

### 18.2 操作DOM节点方法

## 19 Ajax总结

### 19.1 Ajax 有那些优缺点

### 19.2 关于http,XMLHttpRequest,Ajax的关系

### 19.3 XMLHttpRequest的发展历程是怎样的？

### 19.4 使用XMLHttpRequest封装一个get和post请求

## 20 定时器

### 20.1 setInterval存在哪些问题？

### 20.2 链式调用setTimeout对比setInterval

### 20.3 实现比 setTimeout 快 80 倍的定时器

### 22.4 说一下requestAnimationFrame

### 22.5 requestAnimationFrame对比setTimeout

## 21 谈谈你对for in/for of的理解

## 22 JavaScript 实现对上传图片的压缩？
