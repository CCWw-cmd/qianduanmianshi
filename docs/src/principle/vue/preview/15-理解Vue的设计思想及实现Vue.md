
## 理解Vue的设计思想

![](https://s.poetries.top/images/20210313152225.png)

* MVVM框架的三要素:数据响应式、模板引擎及其渲染

* 数据响应式:监听数据变化并在视图中更新

  * Object.defineProperty()
  * Proxy
* 模版引擎:提供描述视图的模版语法

  * 插值:`{{}}`
  * 指令:`v-bind，v-on，v-model，v-for，v-if`
* 渲染:如何将模板转换为html

  * `模板 => vdom => dom`

## 数据响应式原理

> 数据变更能够响应在视图中，就是数据响应式。vue2中利用 `Object.defineProperty()` 实现变更检 测。

![](https://s.poetries.top/images/20210313152449.png)

简单实现

```js
// 数据响应式：
// Object.defineProperty()


function defineReactive(obj, key, val) {

  // val可能还是对象，此时我们需要递归
  observe(val)

  // 参数3是描述对象
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key);
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set', key);
        // 防止newVal是对象，提前做一次observe
        observe(newVal)
        val = newVal
      }
    }
  })
}

function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return
  }

  // 遍历
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

// 对于新加入属性，需要单独处理他的响应式
function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = { foo: 'foo', bar: 'bar', baz: { a: 1 } }
observe(obj)
// defineReactive(obj, 'foo', 'foo')
// obj.foo
// obj.foo = 'fooooooooo'
// obj.bar
// obj.bar = 'barrrrrrrr'

// obj.baz.a = '10'

// obj.baz = {a: 10}
// obj.baz.a = 100

// 新添加一些属性
// obj.dong = 'dong' // no ok
set(obj, 'dong', 'dong')
obj.dong

// 前面的方法对于数组是不支持
// 思路：拦截数组7个变更方法push、pop。。。，扩展他们，使他们在变更数据的同时
// 额外的执行一个通知更新的任务
```

> `defineProperty()` 不支持数组

**解决数组数据的响应化**

## Vue中的数据响应化

### 原理分析

### 涉及类型介绍

## 实现Vue

### 框架构造函数:执行初始化

### 编译 Compile

### 依赖收集

### 完整代码
