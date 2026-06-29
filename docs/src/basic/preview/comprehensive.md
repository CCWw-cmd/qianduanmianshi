
# 综合题型

> 本篇对一些知识点查漏补缺

## 一、创建对象和原型链

### 1 面向对象的三大特性

* 封装
* 继承
* 多态

#### 1.1 原型链的知识

> 原型链是面向对象的基础，是非常重要的部分。有以下几种知识：

* 创建对象有几种方法
* 原型、构造函数、实例、原型链
* `instanceof`的原理
* `new` 运算符

### 2 创建对象有几种方法

#### 2.1 方式一：字面量

```js
    var obj11 = {name: 'smyh'};
    var obj12 = new Object(name: `smyh`); //内置对象（内置的构造函数）
```

> 上面的两种写法，效果是一样的。因为，第一种写法，`obj11`会指向`Object`。

* 第一种写法是：字面量的方式。
* 第二种写法是：内置的构造函数

#### 2.2 方式二：通过构造函数

```js
    var M = function (name) {
        this.name = name;
    }
    var obj3 = new M('smyhvae');
```

#### 2.3 方法三：Object.create

```js
    var p = {name:'poetry'};
    var obj3 = Object.create(p);  //此方法创建的对象，是用原型链连接的
```

> 第三种方法，很少有人能说出来。这种方式里，`obj3`是实例，`p`是`obj3的`原型（`name`是p原型里的属性），构造函数是`Object` 。

![](https://s.poetries.top/gitee/2020/07/18.png)

### 3 原型、构造函数、实例，以及原型链

![](https://s.poetries.top/gitee/2020/07/19.png)

> PS：任何一个函数，如果在前面加了`new`，那就是构造函数。

#### 3.1 原型、构造函数、实例三者之间的关系

![](https://s.poetries.top/gitee/2020/07/20.png)

1. 构造函数通过 `new` 生成实例
2. 构造函数也是函数，构造函数的`prototype`指向原型。（所有的函数有`prototype`属性，但实例没有 `prototype`属性）
3. 原型对象中有 `constructor`，指向该原型的构造函数。

> 上面的三行，代码演示：

```js
  var Foo = function (name) {
      this.name = name;
  }

  var fn = new Foo('smyhvae');
```

> 上面的代码中，`Foo.prototype.constructor === Foo`的结果是`true`：

![](https://s.poetries.top/gitee/2020/07/21.png)

4. 实例的`__proto__`指向原型。也就是说，`Foo.__proto__ === M.prototype`。

> 声明：所有的**引用类型**（数组、对象、函数）都有`__proto__`这个属性。

`Foo.__proto__ === Function.prototype`的结果为true，说明`Foo`这个普通的函数，是`Function`构造函数的一个实例。

#### 3.2 原型链

**原型链的基本原理**：任何一个**实例**，通过原型链，找到它上面的**原型**，该原型对象中的方法和属性，可以被所有的原型实例共享。

> `Object`是原型链的顶端。

* 原型可以起到继承的作用。原型里的方法都可以被不同的实例共享：

```js
  //给Foo的原型添加 say 函数
  Foo.prototype.say = function () {
      console.log('');
  }
```

**原型链的关键**：在访问一个实例的时候，如果实例本身没找到此方法或属性，就往原型上找。如果还是找不到，继续往上一级的原型上找。

#### 3.3 `instanceof`的原理

![](https://s.poetries.top/gitee/2020/07/22.png)

* `instanceof`的**作用**：用于判断**实例**属于哪个**构造函数**。
* `instanceof`的**原理**：判断实例对象的`__proto__`属性，和构造函数的`prototype`属性，是否为同一个引用（是否指向同一个地址）。

> * **注意1**：虽然说，实例是由构造函数 new 出来的，但是实例的`__proto__`属性引用的是构造函数的`prototype`。也就是说，实例的`__proto__`属性与构造函数本身无关。
> * **注意2**：在原型链上，原型的上面可能还会有原型，以此类推往上走，继续找`__proto__`属性。这条链上如果能找到， instanceof 的返回结果也是 true。

比如说：

* `foo instance of Foo`的结果为true，因为`foo.__proto__ === M.prototype`为`true`。
* **`foo instance of Objecet`的结果也为true**，为`Foo.prototype.__proto__ === Object.prototype`为`true`。

> 但我们不能轻易的说：`foo` 一定是 由`Object`创建的实例\`。这句话是错误的。我们来看下一个问题就明白了。

#### 3.4 分析一个问题

**问题：**已知A继承了B，B继承了C。怎么判断 a 是由A**直接生成**的实例，还是B直接生成的实例呢？还是C直接生成的实例呢？

> 分析：这就要用到原型的`constructor`属性了。

* `foo.__proto__.constructor === M`的结果为`true`，但是 `foo.__proto__.constructor === Object`的结果为`false`。
* 所以，用 `consturctor`判断就比用 `instanceof`判断，更为严谨。

### 4 new 运算符

> 当`new Foo()`时发生了什么：

* 创建一个**新的空对象实例**。
* 将此空对象的隐式原型指向其构造函数的显示原型。
* 执行构造函数（传入相应的参数，如果没有参数就不用传），同时 `this` 指向这个新实例。
* 如果返回值是一个新对象，那么直接返回该对象；如果无返回值或者返回一个非对象值，那么就将步骤（1）创建的对象返回。

## 二、面向对象

### 1 前言

> 类与实例：

* 类的声明
* 生成实例

**类与继承：**

* 如何实现继承：继承的本质就是原型链
* 继承的几种方式

### 2 类的定义、实例化

#### 2.1 类的定义/类的声明

**方式一**：用构造函数模拟类（传统写法）

```js
function Animal1() {
    this.name = 'smyhvae'; //通过this，表明这是一个构造函数
}
```

**方式二**：用 `class` 声明（`ES6`的写法）

```js
class Animal2 {
    constructor() {  //可以在构造函数里写属性
        this.name = name;
    }
}
```

控制台的效果：

![](https://s.poetries.top/gitee/2020/07/41.png)

#### 2.2 实例化

类的实例化很简单，直接 `new` 出来即可。

```js
console.log(new Animal1(),new Animal2()); //实例化。如果括号里没有参数，则括号可以省略
```

![](https://s.poetries.top/gitee/2020/07/41.png)

### 3 继承的几种方式

> 继承的本质就是原型链。

**继承的方式有几种？每种形式的优缺点是**？这些问题必问的。其实就是考察你对原型链的掌握程度。

#### 3.1 方式一：借助构造函数

```js
    function Parent1() {
        this.name = 'parent1 的属性';
    }

    function Child1() {
        Parent1.call(this);         //【重要】此处用 call 或 apply 都行：改变 this 的指向
        this.type = 'child1 的属性';
    }

    console.log(new Child1);
```

> 【重要】上方代码中，最重要的那行代码：在子类的构造函数里写了`Parent1.call(this);`，意思是：**让Parent的构造函数在child的构造函数中执行**。发生的变化是：**改变this的指向**，parent的实例 --> 改为指向child的实例。导致 parent的实例的属性挂在到了child的实例上，这就实现了继承。

打印结果：

![](https://s.poetries.top/gitee/2020/07/43.png)

> 上方结果表明：`child`先有了 `parent` 实例的属性（继承得以实现），再有了`child` 实例的属性。

**分析**：

> 这种方式，虽然改变了 `this` 的指向，但是，**Child1 无法继承 `Parent1` 的原型**。也就是说，如果我给 `Parent1` 的原型增加一个方法：

```js
    Parent1.prototype.say = function () {
    };
```

> 上面这个方法是无法被 `Child1` 继承的。如下：

![](https://s.poetries.top/gitee/2020/07/44.png)

#### 3.2 方法二：通过原型链实现继承

```js
    /*
    通过原型链实现继承
     */
    function Parent() {
        this.name = 'Parent 的属性';
    }

    function Child() {
        this.type = 'Child 的属性';
    }

    Child.prototype = new Parent(); //【重要】

    console.log(new Child());
```

打印结果：

![](https://s.poetries.top/gitee/2020/07/45.png)

> 【重要】上方代码中，最重要的那行：每个函数都有`prototype`属性，于是，构造函数也有这个属性，这个属性是一个对象。现在，**我们把`Parent`的实例赋值给了`Child`的`prototye`**，从而实现**继承**。此时，`Child`构造函数、`Parent`的实例、`Child`的实例构成一个三角关系。于是：

* `new Child.__proto__ === new Parent()`的结果为`true`

**分析：**

* 这种继承方式，**Child 可以继承 Parent 的原型**，但有个缺点：

> 缺点是：**如果修改 child1实例的name属性，child2实例中的name属性也会跟着改变**。

如下：

![](https://s.poetries.top/gitee/2020/07/46.png)

> 上面的代码中， `child1`修改了`arr`属性，却发现，`child2`的`arr`属性也跟着改变了。这显然不太好，在业务中，两个子模块应该隔离才对。如果改了一个对象，另一个对象却发生了改变，就不太好。

> 造成这种缺点的原因是：`child1`和`child2`共用原型。即：`chi1d1.__proto__ === child2__proto__`是严格相同。而 arr方法是在 Parent 的实例上（即 Child实例的原型）的。

#### 3.3 方式三：组合的方式：构造函数 + 原型链

就是把上面的两种方式组合起来：

```js
/*
组合方式实现继承：构造函数、原型链
  */
function Parent3() {
    this.name = 'Parent 的属性';
    this.arr = [1, 2, 3];
}

function Child3() {
    Parent3.call(this); //【重要1】执行 parent方法
    this.type = 'Child 的属性';
}
Child3.prototype = new Parent3(); //【重要2】第二次执行parent方法

var child = new Child3();
```

* 这种方式，能解决之前两种方式的问题：既可以继承父类原型的内容，也不会造成原型里属性的修改。
* 这种方式的缺点是：让父亲`Parent`的构造方法执行了两次。
* `ES6`中的继承方式，一带而过即可，重点是要掌握`ES5`中的继承。

## 三、DOM事件总结

## 四、Event Loop详细版

### 为什么 GUI 渲染线程为什么与 JS 引擎线程互斥

### 从 Event Loop 看 JS 的运行机制

### 什么是宏任务

### 什么是微任务

### 总结

## 五、CSS盒模型及BFC

## 六、页面布局

## 七、安全问题：CSRF和XSS

### 1 前言

### 2 CSRF

### 3 XSS

### 4 CSRF 和 XSS 的区别

## 八、跨域通信类

### 1 前言

### 2 同源策略的概念和具体限制

### 3 前后端如何通信

### 4 如何创建Ajax

### 5 跨域通信的几种方式

## 九、前端错误监控

### 1 前言

### 2 前端错误的分类

### 3 每种错误的捕获方式

### 4 错误上报的两种方式

## 十、HTTP协议

### 1 前言

### 2 HTTP协议的主要特点

### 3 HTTP报文的组成部分

### 4 HTTP方法

### 5 get 和 post的区别

### 6 http状态码

### 7 持久链接/http长连接

### 8 长连接中的管线化
