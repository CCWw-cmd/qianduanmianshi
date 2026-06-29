
## 数据驱动

* 数据响应式、双向绑定、数据驱动
* 数据响应式
  * 数据模型仅仅是普通的 `JavaScript` 对象，而当我们修改数据时，视图会进行更新，避免了繁琐的 `DOM` 操作提高开发效率
* 双向绑定
  * 数据改变，视图改变;视图改变，数据也随之改变
  * 我们可以使用 `v-model` 在表单元素上创建双向数据绑定
* 数据驱动是 `Vue` 最独特的特性之一
  * 开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图

## 数据响应式的核心原理

### Vue 2.x

* [Vue 2.x深入响应式原理 (opens new window)](https://cn.vuejs.org/v2/guide/reactivity.html)
* [MDN - Object.defineProperty (opens new window)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
* 浏览器兼容 IE8 以上(不兼容 IE8)

```js
// 模拟 Vue 中的 data 选项 
let data = {
    msg: 'hello'
}
// 模拟 Vue 的实例 
let vm = {}
// 数据劫持:当访问或者设置 vm 中的成员的时候，做一些干预操作
Object.defineProperty(vm, 'msg', {
  // 可枚举(可遍历)
  enumerable: true,
  // 可配置(可以使用 delete 删除，可以通过 defineProperty 重新定义) 
  configurable: true,
  // 当获取值的时候执行 
  get () {
    console.log('get: ', data.msg)
    return data.msg 
  },
  // 当设置值的时候执行 
  set (newValue) {
    console.log('set: ', newValue) 
    if (newValue === data.msg) {
      return
    }
    data.msg = newValue
    // 数据更改，更新 DOM 的值 
    document.querySelector('#app').textContent = data.msg
  } 
})

// 测试
vm.msg = 'Hello World' 
console.log(vm.msg)
```

> 如果有一个对象中多个属性需要转换 `getter/setter` 如何处理?

### Vue 3.x

* [MDN - Proxy (opens new window)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
* 直接监听对象，而非属性
* `ES 6`中新增，`IE` 不支持，性能由浏览器优化

```js
// 模拟 Vue 中的 data 选项 
let data = {
  msg: 'hello',
  count: 0 
}
// 模拟 Vue 实例
let vm = new Proxy(data, {
  // 当访问 vm 的成员会执行
  get (target, key) {
    console.log('get, key: ', key, target[key])
    return target[key]
  },
  // 当设置 vm 的成员会执行
  set (target, key, newValue) {
    console.log('set, key: ', key, newValue)
    if (target[key] === newValue) {
      return
    }
    target[key] = newValue
    document.querySelector('#app').textContent = target[key]
  }
})

// 测试
vm.msg = 'Hello World'
console.log(vm.msg)
```

## 发布订阅模式和观察者模式

### 发布/订阅模式

### 观察者模式

### 总结

## Vue 响应式原理模拟

### 整体分析

### Vue

### Observer

### Compiler

###

### Watcher

### 视图变化更新数据

### 总结
