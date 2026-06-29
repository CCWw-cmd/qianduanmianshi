
## 1 谈谈你对MVVM的理解

为什么要有这些模式，目的：职责划分、分层（将`Model`层、`View`层进行分类）借鉴后端思想，对于前端而已，就是如何将数据同步到页面上

**MVC模式** 代表：`Backbone` + `underscore` + `jquery`

![](https://s.poetries.top/uploads/2022/08/bf9b97960412f53f.png)

* 传统的 `MVC` 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理，控制器会获取数据。将结果返回给前端,页面重新渲染
* `MVVM`：传统的前端会将数据手动渲染到页面上, `MVVM` 模式不需要用户收到操作 `dom` 元素,将数据绑定到 `viewModel` 层上，会自动将数据渲染到页面中，视图变化会通知 `viewModel`层 更新数据。`ViewModel` 就是我们 `MVVM` 模式中的桥梁

**MVVM模式** 映射关系的简化，隐藏了`controller`

![](https://s.poetries.top/uploads/2022/08/41f439971593ef61.png)

> `MVVM`是`Model-View-ViewModel`缩写，也就是把`MVC`中的`Controller`演变成`ViewModel`。`Model`层代表数据模型，`View`代表UI组件，`ViewModel`是`View`和`Model`层的桥梁，数据会绑定到`viewModel`层并自动将数据渲染到页面中，视图变化的时候会通知`viewModel`层更新数据。

* `Model`: 代表数据模型，也可以在`Model`中定义数据修改和操作的业务逻辑。我们可以把`Model`称为数据层，因为它仅仅关注数据本身，不关心任何行为
* `View`: 用户操作界面。当`ViewModel`对`Model`进行更新的时候，会通过数据绑定更新到`View`
* `ViewModel`： 业务逻辑层，`View`需要什么数据，`ViewModel`要提供这个数据；`View`有某些操作，`ViewModel`就要响应这些操作，所以可以说它是`Model for View`.

**总结**： `MVVM`模式简化了界面与业务的依赖，解决了数据频繁更新。`MVVM` 在使用当中，利用双向绑定技术，使得 `Model` 变化时，`ViewModel` 会自动更新，而 `ViewModel` 变化时，`View` 也会自动变化。

我们以下通过一个 `Vue` 实例来说明 `MVVM` 的具体实现

```js
<!-- View 层 -->

<div id="app">
  <p>{{message}}</p>
  <button v-on:click="showMessage()">Click me</button>
</div>
```

```js
var app = new Vue({
  el: '#app',
  data: {  // 用于描述视图状态  
    message: 'Hello Vue!', // Model 层
  },
  // ViewModel 层：通过事件修改model层数据
  methods: {  // 用于描述视图行为  
    showMessage(){
      let vm = this;
      alert(vm.message);
    }
  },
  created(){
    let vm = this;
    // Ajax 获取 Model 层的数据
    ajax({
      url: '/your/server/data/api',
      success(res){
        vm.message = res;
      }
    });
  }
})
```

## 2 谈谈你对SPA单页面的理解

> `SPA`（ single-page application ）仅在 `Web` 页面初始化时加载相应的 `HTML`、`JavaScript` 和 `CSS`。一旦页面加载完成，`SPA` 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 `HTML` 内容的变换，`UI` 与用户的交互，避免页面的重新加载

**优点：**

* 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
* 基于上面一点，`SPA` 相对对服务器压力小；
* 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理

**缺点：**

* 初次加载耗时多：为实现单页 `Web` 应用功能及显示效果，需要在加载页面的时候将 `JavaScript`、`CSS` 统一加载，部分页面按需加载；
* 前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
* `SEO` 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 `SEO` 上其有着天然的弱势

**单页应用与多页应用的区别**

单页面应用（SPA）

多页面应用（MPA）

组成

一个主页面和多个页面片段

多个主页面

刷新方式

局部刷新

整页刷新

`url`模式

哈希模式

历史模式

`SEO`搜索引擎优化

难实现，可使用SSR方式改善

容易实现

数据传递

容易

通过`url`、`cookie`、`localStorage`等传递

页面切换

速度快，用户体验良好

切换加载资源，速度慢，用户体验差

维护成本

相对容易

相对复杂

**实现一个SPA**

* 监听地址栏中`hash`变化驱动界面变化
* 用`pushsate`记录浏览器的历史，驱动界面发送变化

![](https://s.poetries.top/uploads/2022/09/e2b412462d9e1bbf.png)

1. **hash 模式**：核心通过监听`url`中的`hash`来进行路由跳转

```js
// 定义 Router  
class Router {  
    constructor () {  
        this.routes = {}; // 存放路由path及callback  
        this.currentUrl = '';  
          
        // 监听路由change调用相对应的路由回调  
        window.addEventListener('load', this.refresh, false);  
        window.addEventListener('hashchange', this.refresh, false);  
    }  
      
    route(path, callback){  
        this.routes[path] = callback;  
    }  
      
    push(path) {  
        this.routes[path] && this.routes[path]()  
    }  
}  
  
// 使用 router  
window.miniRouter = new Router();  
miniRouter.route('/', () => console.log('page1'))  
miniRouter.route('/page2', () => console.log('page2'))  
  
miniRouter.push('/') // page1  
miniRouter.push('/page2') // page2  
```

2. **history模式**：`history` 模式核心借用 `HTML5 history api`，`api` 提供了丰富的 `router` 相关属性先了解一个几个相关的api

* `history.pushState` 浏览器历史纪录添加记录
* `history.replaceState`修改浏览器历史纪录中当前纪录
* `history.popState` 当 `history` 发生变化时触发

```js
// 定义 Router  
class Router {  
    constructor () {  
        this.routes = {};  
        this.listerPopState()  
    }  
      
    init(path) {  
        history.replaceState({path: path}, null, path);  
        this.routes[path] && this.routes[path]();  
    }  
      
    route(path, callback){  
        this.routes[path] = callback;  
    }  
      
    push(path) {  
        history.pushState({path: path}, null, path);  
        this.routes[path] && this.routes[path]();  
    }  
      
    listerPopState () {  
        window.addEventListener('popstate' , e => {  
            const path = e.state && e.state.path;  
            this.routers[path] && this.routers[path]()  
        })  
    }  
}  
  
// 使用 Router  
  
window.miniRouter = new Router();  
miniRouter.route('/', ()=> console.log('page1'))  
miniRouter.route('/page2', ()=> console.log('page2'))  
  
// 跳转  
miniRouter.push('/page2')  // page2  
```

**题外话：如何给SPA做SEO**

1. SSR服务端渲染

将组件或页面通过服务器生成`html`，再返回给浏览器，如`nuxt.js`

2. 静态化

目前主流的静态化主要有两种：

* 一种是通过程序将动态页面抓取并保存为静态页面，这样的页面的实际存在于服务器的硬盘中
* 另外一种是通过WEB服务器的 `URL Rewrite`的方式，它的原理是通过web服务器内部模块按一定规则将外部的URL请求转化为内部的文件地址，一句话来说就是把外部请求的静态地址转化为实际的动态页面地址，而静态页面实际是不存在的。这两种方法都达到了实现URL静态化的效果

3. 使用`Phantomjs`针对爬虫处理

原理是通过`Nginx`配置，判断访问来源是否为爬虫，如果是则搜索引擎的爬虫请求会转发到一个`node server`，再通过`PhantomJS`来解析完整的`HTML`，返回给爬虫。下面是大致流程图

![](https://s.poetries.top/uploads/2022/09/d0b4e716fda54d7f.png)

## 3 Vue2.x 响应式数据原理

## 4 Vue3.x 响应式数据原理

### proxy基本用法

### 说说你对 proxy 的理解，Proxy 相比于 defineProperty 的优势

## 5 Vue中如何检测数组变化

## 6 Vue中如何进行依赖收集？

## 7 Vue实例挂载的过程中发生了什么

### 简单

### vue2.x详细

## 8 理解Vue运行机制全局概览

### 全局概览

### 初始化及挂载

### 编译

### 响应式

### Virtual DOM

### 更新视图

### 再看全局

## 9 如何理解Vue中模板编译原理

### Vue complier 实现

## 10 Vue生命周期相关

### Vue的生命周期方法有哪些

### 父组件可以监听到子组件的生命周期吗

### Vue生命周期钩子是如何实现的

### Vue 的父子组件生命周期钩子函数执行顺序

## 11 Vue.mixin的使用场景和原理

## 12 Vue组件data为什么必须是个函数？

## 13 nextTick在哪里使用？原理是？

## 14 computed和watch相关

### computed和watch区别

### vue3中 watch、watchEffect区别

### Watch中的deep:true是如何实现的

### Vue computed 实现

### watch 原理

## 15 Vue.set的实现原理

## 16 Vue diff算法相关问题

### Vue为什么需要虚拟DOM？优缺点有哪些

### Vue中diff算法原理

### Vue的diff算法详细分析

### Vue2和Vue3和React三者的diff算法有什么区别

### 既然Vue通过数据劫持可以精准探测数据变化，为什么还需要虚拟DOM进行diff检测差异

### 请说明Vue中key的作用和原理，谈谈你对它的理解

## 17 Vue组件相关

### Vue组件为什么只能有一个根元素

### 谈一谈对Vue组件化的理解

### Vue组件渲染和更新过程

### 异步组件是什么？使用场景有哪些？

### 为什么要使用异步组件

### 函数式组件优势和原理

### Vue组件之间通信方式有哪些

### 组件中写name属性的好处

### Vue.extend 作用和原理

### Vue中如何扩展一个组件

### 子组件可以直接改变父组件的数据么，说明原因

### 什么是递归组件？举个例子说明下？

### Vue中组件和插件有什么区别

## 18 为什么Vue采用异步渲染

## 19 v-if和v-show区别

## 20 v-if和v-for哪个优先级更高

## 21 Vue的事件绑定原理

## 22 Vue 是如何实现数据双向绑定的

### 双向绑定的原理是什么

### 实现双向绑定

## 23 v-model双向绑定原理

### v-model实现原理

### Vue中修饰符.sync与v-model的区别

## 24 什么是作用域插槽

## 25 keep-alive原理

### keep-alive 使用场景和原理

### 怎么缓存当前的组件？缓存后怎么更新

## 26 Vue路由相关

### Vue-router基本使用

### vue-router 动态路由是什么

### router-link和router-view是如何起作用的

### Vue-router 除了 router-link 怎么实现跳转

### Vue-router 路由模式有几种

### Vue路由hash模式和history模式

### 了解history有哪些方法吗？说下它们的区别

### 如何监听 pushState 和 replaceState 的变化呢？

### Vue路由的钩子函数

### `$route`和`$router`的区别

### vue-router 路由钩子函数是什么 执行顺序是什么

### vue-router 有哪几种导航守卫

### vue-router守卫

### vue-router中如何保护路由

### 怎么实现路由懒加载呢

### Vue要做权限管理该怎么做？控制到按钮级别的权限怎么做？

### 如果让你从零开始写一个vue路由，说说你的思路

## 27 Vuex相关

### vuex是什么？怎么使用？哪种功能场景使用它？

### Vuex中actions和mutations有什么区别

### 怎么监听vuex数据的变化

### Vuex 页面刷新数据丢失怎么解决

### Vuex 为什么要分模块并且加命名空间

### 你有使用过vuex的module吗？

### 你觉得vuex有什么缺点

### 用过pinia吗？有什么优点？

## 28 对Vue SSR的理解

## 29 Vue 修饰符有哪些

### vue中修饰符分为以下五种

### 应用场景

## 30 说说 vue 内置指令

## 31 怎样理解 Vue 的单向数据流

## 32 写过自定义指令吗？原理是什么

### 基本使用

### 原理

### vue3.2 自定义全局指令、局部指令

## 33 Vue3相关

### Vue3 对 Vue2 有什么优势

### Vue3 和 Vue2 的生命周期有什么区别

### Vue3如何实现响应式

### 如何理解Composition API和Options API

### Composition API 如何实现逻辑复用

### Composition API 和 React Hooks 的对比

### Vue3的设计目标是什么？做了哪些优化

### Vue3有了解过吗？能说说跟vue2的区别吗？

### 你知道哪些Vue3新特性?

### Vue3速度快的原因

### Composition API 与 Options API 有什么不同

### ref如何使用

### toRef和toRefs如何使用和最佳方式

### 深入理解为什么需要ref、toRef、toRefs

### ref和reactive异同

### vue3升级了哪些重要功能

### Vue3.2 setup 语法糖汇总

### v-model参数的用法

### watch和watchEffect的区别

### setup中如何获取组件实例

### Vite 为什么启动非常快

### 说说Vue 3.0中Tree shaking特性？举例说明一下？

### 用Vue3.0 写过组件吗？如果想实现一个 Modal你会怎么设计？

## 34 Vue中v-html会导致哪些问题

## 35 说下$attrs和$listeners的使用场景

## 36 在Vue中使用插件的步骤

## 37 vue-cli 工程技术集合介绍

### 构建的 vue-cli 工程都到了哪些技术，它们的作用分别是什么

### vue-cli 工程常用的 npm 命令有哪些

### 请说出vue cli项目中src目录每个文件夹和文件的用法

## 38 delete和Vue.delete删除数组的区别？

## 39 v-on可以监听多个方法吗？

## 40 v-once的使用场景有哪些

## 41 Vue Ref的作用

## 42 scoped样式穿透

## 43 Class 与 Style 如何动态绑定

## 44 Vue为什么没有类似于React中shouldComponentUpdate的生命周期

## 45 SPA、SSR的区别是什么

## 46 vue-loader是什么？它有什么作用？

## 47 说说你对slot的理解？slot使用场景有哪些

### slot是什么

### slot使用场景

### slot分类

### slot原理分析

## 48 Vue.observable你有了解过吗？说说看

### Observable 是什么

### 使用场景

### 原理分析

## 49 Vue中的过滤器了解吗？过滤器的应用场景有哪些？

### 如何用

### 定义filter

### 应用场景

### 原理分析

## 50 Vue项目中有封装过axios吗？主要是封装哪方面的？

### axios是什么

### 为什么要封装

### 如何封装

## 51 说下你的vue项目的目录结构，如果是大型项目你该怎么划分结构和划分组件呢

### 为什么要划分

### 目录结构

## 52 从0到1自己构架一个vue项目，说说有哪些步骤、哪些重要插件、目录结构你会怎么组织

## 53 vue要做权限管理该怎么做？如果控制到按钮级别的权限怎么做

### 是什么

### 如何做

## 54 Vue项目中你是如何解决跨域的呢

### 跨域是什么

### 如何解决

## 55 Vue项目本地开发完成后部署到服务器后报404是什么原因呢

### 如何部署

### 404问题

### 解决方案

## 56 实际工作中，你总结的vue最佳实践有哪些

## 57 vue 中使用了哪些设计模式

## 58 如果让你从零开始写一个vuex，说说你的思路

## 59 使用vue渲染大量数据时应该怎么优化？说下你的思路

## 60 动态给vue的data添加一个新的属性时会发生什么？怎样解决？

### Vue.set()

### Object.assign()

### $forceUpdate

### 小结

## 61 你是怎么处理vue项目中的错误的？

## 62 SPA首屏加载速度慢的怎么解决

### 什么是首屏加载

### 加载慢的原因

### 解决方案

### 小结

## 63 Vue中常见性能优化

## 64 Vue项目性能优化-详细

### 代码层面的优化

### Webpack 层面的优化

### 基础的 Web 技术优化

## 65 Vue与Angular以及React的区别？

### Vue与AngularJS的区别

### Vue与React的区别

## 66 Vue2高级用法

### 自定义组件model

### vue3自定义组件model

### vue2 slot

### vue2动态组件

### vue2异步组件

## 67 Vue面试考察的高频原理

### 响应式原理

### vdom和diff算法

### 模板编译

### 组件渲染更新过程（重点掌握）

### 前端路由原理

## 68 Vue面试考点答题分析

### 请说一下响应式数据的理解

### Vue如何检测数组变化

### Vue中模板编译原理

### 生命周期钩子是如何实现的

### Vue.mixin的使用场景和原理

### nextTick在哪里使用?原理是

### Vue为什么需要虚拟DOM

### Vue中的diff原理

### Vue中computed和watch的区别

### Vue.set方法是如何实现的

### Vue.use是干什么的?原理是什么

### vue-router有几种钩子函数?具体是什么及执行流程是怎样的
