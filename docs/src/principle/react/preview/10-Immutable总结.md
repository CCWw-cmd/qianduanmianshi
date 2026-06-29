
## 一、前言

> 从问题说起：熟悉 `React` 组件生命周期的话都知道：调用 `setState` 方法总是会触发 `render` 方法从而进行 `vdom re-render` 相关逻辑，哪怕实际上你没有更改到 `Component.state`

```js
this.state = {count: 0}
this.setState({count: 0});// 组件 state 并未被改变，但仍会触发 render 方法 
```

* 为了避免这种性能上的浪费，`React` 提供了一个 `shouldComponentUpdate` 来控制触发 `vdom re-render` 逻辑的条件。于是 `PureRenderMixin` 作为一种优化技巧被使用。它仅仅是浅比较对象，深层次的数据结构根本不管用

**js中的Immutable Data**

> 在`javascript`中我们可以通过`deep clone`来模拟`Immutable Data`，就是每次对数据进行操作，新对数据进行`deep clone`出一个新数据

* deep clone
* 当然你或许意识到了，这样非常的慢

```js
'use strict';  
var cloneDeep = require('lodash.clonedeep');

var data = {  
    id: 'data',
    author: {
        name: 'mdemo',
        github: 'https://github.com/demohi'
    }
};

var data1 = cloneDeep(data);

console.log('equal:', data1===data); //false

data1.id = 'data1';  
data1.author.name = 'demohi';

console.log(data.id);// data  
console.log(data1.id);// data1

console.log(data.author.name);//mdemo  
console.log(data1.author.name);//demohi  
```

> 这时候 immutableJS 就派得上用场了

```js
var map1 = Immutable.fromJS({a:1, b:1, c:{b:{c:{d:{e:7}}}}});
var map2 = Immutable.fromJS({a:1, b:1, c:{b:{c:{d:{e:7}}}}});
Immutable.is(map1, map2);  // true
```

* 遍历对象不再用`for-in`，可以这样:

```js
Immutable.fromJS({a:1, b:2, c:3}).map(function(value, key) { /* do some thing */});
```

## 二、什么是 Immutable Data

* `Immutable Data` 就是一旦创建，就不能再被更改的数据。对 `Immutable` 对象的任何修改或添加删除操作都会返回一个新的 `Immutable` 对象
* `Immutable` 实现的原理是 `Persistent Data Structure`（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变
* 同时为了避免 `deepCopy` 把所有节点都复制一遍带来的性能损耗，`Immutable` 使用了 `Structural Sharing····`（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

> 打印`immutableJS`看看有什么东西

![](https://s.poetries.top/images/20210427120238.png)

**一个说明不可变的例子**

```js
// 原生对象
let a1 = {
    b: 1,
    c: {
        c1: 123
    }
};

let b1 = a1;
b1.b = 2;

console.log(a1.b, b1.b); // 2, 2
console.log(a1 === b1); // true
console.log(a1.c === b1.c); // true

// immutable.js 的Map
let a2 = Immutable.fromJS({
    b: 1,
    c: {
        c1: 123
    }
});

let b2 = a2.set('b', 2);

// 对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象
console.log(a2.get('b'), b2.get('b')); // 1, 2  对象 a2 的 b 值并没有变成2。
console.log(a2 === b2); //  false

//如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。
console.log(a2.get('c') === b2.get('c')); //true
```

## 三、为什么要在React.js中使用Immutable

## 四、Immutable 的几种数据类型

## 五、几个重要的API

## 六、API

### 创建

### 判断是否是一个Map或者List

### 获取大小

### 添加元素

### List 特有的添加元素

### 删除元素

### 修改元素

### 获取某个元素值

### 查找某个元素

### List 特有查找某个元素

### 查找最大、最小元素

### 截取

### 循环遍历

### Map 特有 mapKeys() mapEntries()

### merge

### jonin() 转换为字符串

### isEmpty() 判空

### has() hasIn() 检查是否有某个key

### includes() 是否包含某些元素

### isSubset() 子集判断

### reverse() 反转

### 排序

### flatten() 平铺

### groupBy() 分组

### flip() Map 特有翻转

### 连接 concat()

### 类型转换

## 七、和React Redux 架构的结合

## 八、思维导图总结API

## 九、更多参考
