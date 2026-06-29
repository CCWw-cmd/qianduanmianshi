
> 入门uniapp

## 1 基础部分总结

### 什么是UniApp？它有哪些特点和优势？

> `uni-app` 是一个使用 [Vue.js (opens new window)](https://vuejs.org/) 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台

uni-app简单来说是 `vue的语法` + `小程序的api`，它遵循Vue.js语法规范，组件和API遵循微信小程序命名，这些都属于通用技术栈，学习它们是前端必备技能，uni-app没有太多额外学习成本

**uni-app 支持的手机版本最低到多少**

* Web端：uni-app没有限制，同vue2和vue3自身能支持的浏览器版本
* 小程序端：uni-app没有限制，同该小程序自身能支持的最低平台
* App端：
  * Vue2: Android4.4+、iOS9+。Android4.4已经是2013年发布的手机了。
  * Vue3: 支持的范围是：Android >=5 （使用nvue和vue有区别。某些老国产Android5的rom无法动态升级Android system webview，此时如果使用vue页面需搭配x5内核） , iOS >= 10

**uniapp特点**

* 跨平台更多
  * 真正做到一套代码、多端发行
  * 条件编译：优雅的在一个项目里调用不同平台的特色功能
* 运行体验更好
  * 组件、`api`与微信小程序一致
  * 兼容`weex`原生渲染
* 通用技术栈，学习成本更低
  * `vue`的语法、微信小程序的`api`
  * 内嵌`mpvue`
* 开发生态，拥抱社区
  * 支持通过`npm`安装第三方包
  * 支持微信小程序自定义组件及`SDK`
  * 兼容`mpvue`组件及项目
  * `app`端支持和原生混合编码
  * `dcloud`插件市场

**uniapp平台功能示意图**

![](https://s.poetries.top/uploads/2023/02/4c2049088d61180e.png)

### Uniapp的目录结构组成

一个 uni-app 工程，就是一个 Vue 项目，你可以通过 HBuilderX 或 cli 方式快速创建 uni-app 工程

一个uni-app工程，默认包含如下目录及文件

```js
┌─uniCloud              云空间目录，阿里云为uniCloud-aliyun,腾讯云为uniCloud-tcb（详见uniCloud）
│─components            符合vue组件规范的uni-app组件目录
│  └─comp-a.vue         可复用的a组件
├─utssdk                存放uts文件
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─uni_modules           存放[uni_module](/uni_modules)。
├─platforms             存放各平台专用页面的目录，详见
├─nativeplugins         App原生语言插件 详见
├─nativeResources       App端原生资源目录
│  └─android            Android原生资源目录 详见
├─hybrid                App端存放本地html文件的目录，详见
├─wxcomponents          存放小程序组件的目录，详见
├─unpackage             非工程代码，一般存放运行或发行的编译结果
├─AndroidManifest.xml   Android原生应用清单文件 详见
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息，详见
├─pages.json            配置页面路由、导航条、选项卡等页面类信息，详见
└─uni.scss              这里是uni-app内置的常用样式变量
```

**static目录 使用注意**

* 编译到任意平台时，static 目录下除不满足条件编译的文件，会直接复制到最终的打包目录，不会打包编译。非 static 目录下的文件（vue、js、css 等）只有被引用时，才会被打包编译。
* css、`less/scss` 等资源不要放在 `static` 目录下，建议这些公用的资源放在自建的 `common` 目录下

### Vue.js和UniApp有什么关系？它们之间有什么区别？

> Vue.js是一种用于构建用户界面的渐进式JavaScript框架，而UniApp是基于Vue.js的跨平台应用开发框架。UniApp在Vue.js的基础上进行了扩展，使得开发者可以使用Vue.js的开发方式和语法来编写跨平台应用。与Vue.js相比，UniApp具有以下区别：

* **平台适配性**：Vue.js主要用于构建Web应用，而UniApp能够生成多个平台的应用，包括小程序、H5和App等。
* **原生能力访问**：UniApp提供了对原生平台的API和能力的访问，使得开发者可以更方便地使用平台的特性和功能。
* **组件库和UI样式**：UniApp提供了一套基于Vue.js的组件库和UI样式，方便开发者快速构建应用的界面和交互。

### 如何在UniApp中进行网络请求？

`UniApp`中可以使用`uni.request`方法进行网络请求。以下是一个基本的网络请求示例：

```js
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    // 请求参数
  },
  success: function(res) {
    // 请求成功回调
    console.log(res.data);
  },
  fail: function(err) {
    // 请求失败回调
    console.log(err);
  }
});
```

做个简单封装

```js
import store from '@/store'
import config from '@/config'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { toast, showConfirm, tansParams } from '@/utils/common'

let timeout = 10000
const baseUrl = config.baseUrl

const request = config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
  // get请求映射params参数
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  return new Promise((resolve, reject) => {
    uni.request({
        method: config.method || 'get',
        timeout: config.timeout ||  timeout,
        url: config.baseUrl || baseUrl + config.url,
        data: config.data,
        header: config.header,
        dataType: 'json'
      }).then(response => {
        let [error, res] = response
        if (error) {
          toast('后端接口连接异常')
          reject('后端接口连接异常')
          return
        }
        const code = res.data.code || 200
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        if (code === 401) {
          showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
            if (res.confirm) {
              store.dispatch('LogOut').then(res => {
                uni.reLaunch({ url: '/pages/login' })
              })
            }
          })
          reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
          toast(msg)
          reject('500')
        } else if (code !== 200) {
          toast(msg)
          reject(code)
        }
        resolve(res.data)
      })
      .catch(error => {
        let { message } = error
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      })
  })
}

export default request
```

### css 的引用

如果我们创建自定义的样式文件，例如创建一个`/static/scss/test.css`，想要使其在全局引用。

1、在`App.vue`中全局引用，每个页面都可以使用该样式。

```css
<style lang="scss">
  @import '@/static/scss/test.css';
</style>
```

2、在`index.scss`中导入，每个页面都可以使用该样式。

```css
@import '@/static/scss/test.css';
```

推荐第二种方式，方便所有的样式文件在`index.scss`统一管理和维护。

### css 的变量

css 变量

描述

\--status-bar-height

系统状态栏高度

\--window-top

内容区域距离顶部的距离

\--window-bottom

内容区域距离底部的距离

注意：

* `var(--status-bar-height)`此变量在微信小程序环境为固定`25px`，在`App`里为手机实际状态栏高度。
* 当设置`"navigationStyle":"custom"`取消原生导航栏后，由于窗体为沉浸式，占据了状态栏位置。此时可以使用一个高度为`var(--status-bar-height)`的 view 放在页面顶部，避免页面内容出现在状态栏。
* 由于在 H5 端，不存在原生导航栏和 tabbar，也是前端 div 模拟。如果设置了一个固定位置的居底 view，在小程序和 App 端是在 tabbar 上方，但在 H5 端会与 tabbar 重叠。此时可使用`--window-bottom`，不管在哪个端，都是固定在 tabbar 上方。
* 目前 nvue 在 App 端，还不支持`--status-bar-height`变量，替代方案是在页面 onLoad 时通过`uni.getSystemInfoSync().statusBarHeight`获取状态栏高度，然后通过 style 绑定方式给占位 view 设定高度。下方提供了示例代码

```html
<template>
  <page-meta>
    <navigation-bar />
  </page-meta>
  <view>
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view>状态栏下的文字</view>
  </view>
</template>
<style>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
</style>
```

nvue 页面获取状态栏高度

```html
<template>
  <view class="content">
    <view :style="{ height: iStatusBarHeight + 'px'}"></view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        iStatusBarHeight: 0,
      };
    },
    onLoad() {
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
    },
  };
</script>
```

### 全局变量机制

全局变量机制`globalData`，支持全端通用。

**以下是 App.vue 中定义globalData的相关配置：**

```js
<script>  
  export default {  
    globalData: {  
      text: 'text'  
    }
  }  
</script>  
```

**其他页面获取方式**

```js
console.info(getApp().globalData.text);
```

修改`globalData`变量的方式如下：`getApp().globalData.text = 'test'`

**注意**

globalData是简单的全局变量，如果使用状态管理，请使用vuex（main.js中定义）

> globalData是简单的全局变量，如果使用状态管理，请使用vuex（main.js中定义）

### 屏幕尺寸单位

```js
uni-app`支持的通用`css`单位包括`px`、`rpx
```

* `px`即屏幕像素
* `rpx`即响应式`px`，一种根据屏幕宽度自适应的动态单位。以750宽的屏幕为基准，750rpx恰好为屏幕宽度。屏幕变宽，rpx实际显示效果会等比放大 。

`vue`页面支持下面这些普通`H5`单位，但在`nvue`里不支持

* `rem`根字体大小可以通过`page-meta`配置
* `vh viewpoint height`，视窗高度，`1vh`等于视窗高度的`1%`
* `vw viewpoint width`，视窗宽度，`1vw`等于视窗宽度的`1%`

### 生命周期

**应用生命周期**

`uni-app`支持如下应用生命周期函数

函数名

说明

onLaunch

当uni-app初始化完成时触发（全局只触发一次）

onShow

当uni-app启动，或从后台进入前台显示

onHide

当uni-app从前台进入后台

onError

当uni-app报错时触发

onUniNViewMessage

对nvue页面发送的数据进行监听

onUnhandledRejection

对未处理的 Promise 拒绝事件监听函数

onPageNotFound

页面不存在监听函数

onThemeChange

监听系统主题变化

> 应用生命周期仅可在`App.vue`中监听，在其它页面监听无效

**页面生命周期**

`uni-app`支持如下页面生命周期函数

函数名

说明

onInit

监听页面初始化

onLoad

监听页面加载

onShow

监听页面显示

onReady

监听页面初次渲染完成

onHide

监听页面隐藏

onUnload

监听页面卸载

onResize

监听窗口尺寸变化

onPullDownRefresh

监听用户下拉动作，一般用于下拉刷新

onReachBottom

页面上拉触底事件的处理函数

onTabItemTap

点击 tab 时触发

onShareAppMessage

用户点击右上角分享

onPageScroll

监听页面滚动

onNavigationBarButtonTap

监听原生标题栏按钮点击事件

onBackPress

监听页面返回

onNavigationBarSearchInputChanged

监听原生标题栏搜索输入框输入内容变化事件

onNavigationBarSearchInputConfirmed

监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发

onNavigationBarSearchInputClicked

监听原生标题栏搜索输入框点击事件

onShareTimeline

监听用户点击右上角转发到朋友圈

onAddToFavorites

监听用户点击右上角收藏

`onInit`使用注意

* 仅百度小程序基础库 3.260 以上支持 onInit 生命周期
* 其他版本或平台可以同时使用 onLoad 生命周期进行兼容，注意避免重复执行相同逻辑
* 不依赖页面传参的逻辑可以直接使用 created 生命周期替代

`onReachBottom`使用注意，可在`pages.json`里定义具体页面底部的触发距离`onReachBottomDistance`，比如设为`50`，那么滚动页面到距离底部`50px`时，就会触发`onReachBottom`事件。

如使用`scroll-view`导致页面没有滚动，则触底事件不会被触发。`scroll-view`滚动到底部的事件请参考`scroll-view`的文档

`onPageScroll`（监听滚动、滚动监听、滚动事件）参数说明：

属性

类型

说明

scrollTop

Number

页面在垂直方向已滚动的距离（单位px）

* onPageScroll里不要写交互复杂的js，比如频繁修改页面。因为这个生命周期是在渲染层触发的，在非h5端，js是在逻辑层执行的，两层之间通信是有损耗的。如果在滚动过程中，频发触发两层之间的数据交换，可能会造成卡顿。

```js
onPageScroll : function(e) { //nvue暂不支持滚动监听，可用bindingx代替
 console.log("滚动距离为：" + e.scrollTop);
},
```

`onTabItemTap`返回的json对象说明：

属性

类型

说明

index

String

被点击tabItem的序号，从0开始

pagePath

String

被点击tabItem的页面路径

text

String

被点击tabItem的按钮文字

* onTabItemTap常用于点击当前tabitem，滚动或刷新当前页面。如果是点击不同的tabitem，一定会触发页面切换。
* 如果想在App端实现点击某个tabitem不跳转页面，不能使用onTabItemTap，可以使用plus.nativeObj放一个区块盖住原先的tabitem，并拦截点击事件。
* 支付宝小程序平台onTabItemTap表现为点击非当前tabitem后触发，因此不能用于实现点击返回顶部这种操作

```js
onTabItemTap : function(e) {
  console.log(e);
  // e的返回格式为json对象： {"index":0,"text":"首页","pagePath":"pages/index/index"}
},
```

`onNavigationBarButtonTap`参数说明：

属性

类型

说明

index

Number

原生标题栏按钮数组的下标

```js
onNavigationBarButtonTap : function (e) {
  console.log(e);
  // e的返回格式为json对象：{"text":"测试","index":0}
}
```

`onBackPress`回调参数对象说明：

属性

类型

说明

from

String

触发返回行为的来源：'backbutton'——左上角导航栏按钮及安卓返回键；'navigateBack'——uni.navigateBack() 方法。支付宝小程序端不支持返回此字段

```js
export default {
  data() {
    return {};
  },
  onBackPress(options) {
    console.log('from:' + options.from)
  }
}
```

**组件生命周期**

`uni-app`组件支持的生命周期，与vue标准组件的生命周期相同。这里没有页面级的onLoad等生命周期：

函数名

说明

beforeCreate

在实例初始化之前被调用

created

在实例创建完成后被立即调用

beforeMount

在挂载开始之前被调用

mounted

挂载到实例上去之后调用

beforeUpdate

数据更新时调用

updated

由于数据更改时调用

beforeDestroy

实例销毁之前调用

destroyed

实例销毁后调用

### 组件定义

**注册**

通过`uni-app`的`easycom`将组件引入精简为一步。只要组件安装在项目的`components`目录下，并符合`components/组件名称/组件名称.vue`目录结构。就可以不用引用、注册，直接在页面中使用。

```js
<template>
  <view>
 <uni-badge text="1"></uni-badge>
  </view>
</template>
<script>
  // 这里不用import引入，也不需要在components内注册uni-badge组件。template里就可以直接用
  export default {
 data() {
   return {}
 }
  }
</script>
```

* `easycom`是自动开启的，不需要手动开启，有需求时可以在`pages.json`的`easycom`节点进行个性化设置
* 不管`components`目录下安装了多少组件，`easycom`打包后会自动剔除没有使用的组件，对组件库的使用尤为友好。

**props**

`props`可以是数组或对象，用于接收来自父组件的数据。`props`可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义验证和设置默认值。

选项

类型

说明

type

String、Number、Boolean、Array、Object、Date、Function、Symbol，任何自定义构造函数、或上述内容组成的数组

会检查一个 prop 是否是给定的类型，否则抛出警告

default

any

为该 prop 指定一个默认值。如果该 prop 没有被传入，则换做用这个值。对象或数组的默认值必须从一个工厂函数返回

required

Boolean

定义该 prop 是否是必填项

validator

Function

自定义验证函数会将该 prop 的值作为唯一的参数代入。在非生产环境下，如果该函数返回一个 false 的值 (也就是验证失败)，一个控制台警告将会被抛出

示例：子组件定义

```js
<template>
  <view>
 <view>{{age}}</view>
  </view>
</template>
<script>
  export default {
 props: {
   // 检测类型 + 其他验证
   age: {
  type: Number,
  default: 0,
  required: true,
  validator: function(value) {
    return value >= 0
  }
   }
 }
  }
</script>
```

**sync 修饰符**

当一个子组件改变了一个`prop`的值时，这个变化也会同步到父组件中所绑定。`.sync`它会被扩展为一个自动更新父组件属性的`v-on`监听器。

```js
<!-- 父组件 -->
<template>
  <view>
    <syncA :title.sync="title"></syncA>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        title: "hello vue.js"
      }
    }
  }
</script>
```

```js
<!-- 子组件 -->
<template>
  <view>
    <view @click="changeTitle">{{title}}</view>
  </view>
</template>
<script>
  export default {
    props: {
      title: {
        default: "hello"
      },
    },
    methods: {
      changeTitle() {
        // 触发一个更新事件
        this.$emit('update:title', "test-app")
      }
    }
  }
</script>
```

**命名限制**

在`uni-app`中以下这些作为保留关键字，不可作为组件名。

a、canvas、cell、content、countdown、datepicker、div、element、embed、header、image、img、indicator、input、link、list、loading-indicator、loading、marquee、meta、refresh、richtext、script、scrollable、scroller、select、slider-neighbor、slider、slot、span、spinner、style、svg、switch、tabbar、tabheader、template、text、textarea、timepicker、transition-group、transition、video、view、web

### 条件编译

条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将注释里面的代码编译到不同平台。

写法以`#ifdef`或`#ifndef`加`%PLATFORM%`开头，以`#endif`结尾。

* `#ifdef`：if defined 仅在某平台存在
* `#ifndef`：if not defined 除了某平台均存在
* `%PLATFORM%`：平台名称

仅出现在`App平台`下的代码

```js
#ifdef APP-PLUS
需条件编译的代码
#endif
```

除了`H5平台`，其它平台均存在的代码

```js
#ifndef H5
需条件编译的代码
#endif
```

在`H5平台`或`微信小程序平台`存在的代码

```js
#ifdef H5 || MP-WEIXIN
需条件编译的代码
#endif
```

**注意**

多个这里只有`||`，不可能出现`&&`，因为没有交集

**平台名称参数**

`%PLATFORM%`可取值如下：

值

生效条件

VUE3

Vue3

APP-PLUS

App

APP-PLUS-NVUE或APP-NVUE

App nvue

H5

H5

MP-WEIXIN

微信小程序

MP-ALIPAY

支付宝小程序

MP-BAIDU

百度小程序

MP-TOUTIAO

字节跳动小程序

MP-LARK

飞书小程序

MP-QQ

QQ小程序

MP-KUAISHOU

快手小程序

MP-JD

京东小程序

MP-360

360小程序

MP

所有小程序

QUICKAPP-WEBVIEW

所有快应用

QUICKAPP-WEBVIEW-UNION

快应用联盟

QUICKAPP-WEBVIEW-HUAWEI

快应用华为

**注意**

`Vue3`需要在项目的`manifest.json`文件根节点配置`"vueVersion" : "3"`

**API 的条件编译**

```js
// #ifdef  %PLATFORM%
平台特有的API实现
// #endif
```

示例，如下代码仅在`App`下出现:

![](https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/07834e90-4f3c-11eb-b680-7980c8a877b8.png)

示例，如下代码不会在`H5`平台上出现:

![](https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/06a79490-4f3c-11eb-b680-7980c8a877b8.png)

除了支持单个平台的条件编译外，还支持`多平台`同时编译，使用`||`来分隔平台名称。

示例，如下代码会在`App`和`H5`平台上出现:

![](https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/05c1ef80-4f3c-11eb-b680-7980c8a877b8.png)

**组件的条件编译**

```js
<!--  #ifdef  %PLATFORM% -->
平台特有的组件
<!--  #endif -->
```

示例，如下公众号关注组件仅会在微信小程序中出现:

```js
<view>
  <view>微信公众号关注组件</view>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <official-account></official-account>
    <!-- #endif -->
  </view>
</view>
```

**样式的条件编译**

```js
/*  #ifdef  %PLATFORM%  */
平台特有样式
/*  #endif  */
```

**注意：** 样式的条件编译，无论是 css 还是 `sass/scss/less/stylus` 等预编译语言中，必须使用 `/*注释*/` 的写法。

正确写法

![](https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/0bd78d80-4f3c-11eb-a16f-5b3e54966275.png)

错误写法

![](https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/0c9c8b30-4f3c-11eb-8a36-ebb87efcf8c0.png)

**pages.json 的条件编译**

下面的页面，只有运行至`App`时才会编译进去。

![](https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/04ecec40-4f3c-11eb-97b7-0dc4655d6e68.png)

不同平台下的特有功能，以及小程序平台的分包，都可以通过 pages.json 的条件编译来更好地实现。这样，就不会在其它平台产生多余的资源，进而减小包体积。

json的条件编译，如不同平台的key名称相同，cli项目下开发者自己安装的校验器会报错，需自行关闭这些校验器对json相同key的校验规则。如果使用HBuilderX的校验器，无需在意此问题，HBuilderX的语法校验器为此优化过

**static 目录的条件编译**

在不同平台，引用的静态资源可能也存在差异，通过 static 的的条件编译可以解决此问题，static 目录下新建不同平台的专有目录（目录名称同`%PLATFORM%`值域,但字母均为小写），专有目录下的静态资源只有在特定平台才会编译进去。

如以下目录结构，`a.png`只有在微信小程序平台才会编译进去，`b.png`在所有平台都会被编译。

```js
┌─static                
│  ├─mp-weixin
│  │  └─a.png     
│  └─b.png
├─main.js        
├─App.vue      
├─manifest.json 
└─pages.json 
```

**整体目录条件编译**

如果想把各平台的页面文件更彻底的分开，也可以在test-app项目根目录创建`platforms`目录，然后在下面进一步创建`app-plus`、`mp-weixin`等子目录，存放不同平台的文件。

`platforms`目录下只支持放置页面文件（即页面vue文件），如果需要对其他资源条件编译建议使用`static 目录的条件编译`。

### 下拉刷新

`pages.json`设置对应页面`enablePullDownRefresh`属性，激活下拉。

```js
{
 "path": "pages/pull_down/index",
 "style": {
  "navigationBarTitleText": "下拉测试",
  "enablePullDownRefresh":true
 }
}
```

```html
<template>
  <view>
    {{ text }}
  </view>
</template>

<script>
  // 仅做示例，实际开发中延时根据需求来使用。
  export default {
    data() {
      return {
        text: 'test-app'
      }
    },
    onLoad: function(options) {
      setTimeout(function() {
        console.log('start pulldown');
      }, 1000);
      uni.startPullDownRefresh();
    },
    onPullDownRefresh() {
      console.log('refresh');
      setTimeout(function() {
        uni.stopPullDownRefresh();
      }, 1000);
    }
  }
</script>
```

**onPullDownRefresh**

在 js 中定义`onPullDownRefresh`处理函数（和onLoad等生命周期函数同级），监听该页面用户下拉刷新事件。

* 需要在`pages.json`里，找到的当前页面的`pages`节点，并在`style`选项中开启`enablePullDownRefresh`
* 当处理完数据刷新后，`uni.stopPullDownRefresh`可以停止当前页面的下拉刷新

**uni.startPullDownRefresh(OBJECT)**

开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。

**OBJECT 参数说明**

参数名

类型

必填

说明

success

Function

否

接口调用成功的回调

fail

Function

否

接口调用失败的回调函数

complete

Function

否

接口调用结束的回调函数（调用成功、失败都会执行）

**success 返回参数说明**

属性

类型

描述

errMsg

String

接口调用结果

**uni.stopPullDownRefresh()**

停止当前页面下拉刷新。

### 数据缓存

**uni.setStorage(OBJECT)**

将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。

**OBJECT 参数说明**

参数名

类型

必填

说明

key

String

是

本地缓存中的指定的 key

data

Any

是

需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象

success

Function

否

接口调用成功的回调函数

fail

Function

否

接口调用失败的回调函数

complete

Function

否

接口调用结束的回调函数（调用成功、失败都会执行）

**代码示例**

```js
uni.setStorage({
 key: 'storage_key',
 data: 'hello',
 success: function () {
  console.log('success');
 }
});
```

> `uni-`、`uni_`、`dcloud-`、`dcloud_`为前缀的`key`，为系统保留关键前缀。如`uni_deviceId`、`uni_id_token`，请开发者为key命名时避开这些前缀。

**uni.setStorageSync(KEY,DATA)**

将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

**参数说明**

参数名

类型

必填

说明

key

String

是

本地缓存中的指定的 key

data

Any

是

需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象

**代码示例**

```js
try {
 uni.setStorageSync('storage_key', 'hello');
} catch (e) {
 // error
}
```

**uni.getStorage(OBJECT)**

从本地缓存中异步获取指定 key 对应的内容。

**OBJECT 参数说明**

参数名

类型

必填

说明

key

String

是

本地缓存中的指定的 key

success

Function

是

接口调用的回调函数，res = {data: key对应的内容}

fail

Function

否

接口调用失败的回调函数

complete

Function

否

接口调用结束的回调函数（调用成功、失败都会执行）

**代码示例**

```js
uni.getStorage({
 key: 'storage_key',
 success: function (res) {
  console.log(res.data);
 }
});
```

**uni.getStorageSync(KEY)**

从本地缓存中同步获取指定 key 对应的内容。

**参数说明**

参数名

类型

必填

说明

key

String

是

本地缓存中的指定的 key

**代码示例**

```js
try {
 const value = uni.getStorageSync('storage_key');
 if (value) {
  console.log(value);
 }
} catch (e) {
 // error
}
```

**uni.getStorageInfo(OBJECT)**

异步获取当前 storage 的相关信息。

**OBJECT 参数说明**

参数名

类型

必填

说明

success

Function

是

接口调用的回调函数，详见返回参数说明

fail

Function

否

接口调用失败的回调函数

complete

Function

否

接口调用结束的回调函数（调用成功、失败都会执行）

**success 返回参数说明**

参数名

类型

说明

keys

Array＜String＞

当前 storage 中所有的 key

currentSize

Number

当前占用的空间大小, 单位：kb

limitSize

Number

限制的空间大小, 单位：kb

**代码示例**

```js
uni.getStorageInfo({
 success: function (res) {
  console.log(res.keys);
  console.log(res.currentSize);
  console.log(res.limitSize);
 }
});
```

**uni.getStorageInfoSync()**

同步获取当前 storage 的相关信息。

**代码示例**

```js
try {
 const res = uni.getStorageInfoSync();
 console.log(res.keys);
 console.log(res.currentSize);
 console.log(res.limitSize);
} catch (e) {
 // error
}
```

**uni.removeStorage(OBJECT)**

从本地缓存中异步移除指定 key。

**OBJECT 参数说明**

参数名

类型

必填

说明

key

String

是

本地缓存中的指定的 key

success

Function

是

接口调用的回调函数

fail

Function

否

接口调用失败的回调函数

complete

Function

否

接口调用结束的回调函数（调用成功、失败都会执行）

**代码示例**

```js
uni.removeStorage({
 key: 'storage_key',
 success: function (res) {
  console.log('success');
 }
});
```

**uni.removeStorageSync(KEY)**

从本地缓存中同步移除指定 key。

**参数说明**

参数名

类型

必填

说明

key

String

是

本地缓存中的指定的 key

**代码示例**

```js
try {
 uni.removeStorageSync('storage_key');
} catch (e) {
 // error
}
```

**uni.clearStorage()**

清理本地数据缓存。

**代码示例**

```js
uni.clearStorage();
```

**uni.clearStorageSync()**

同步清理本地数据缓存。

**代码示例**

```js
try {
 uni.clearStorageSync();
} catch (e) {
 // error
}
```

### 自定义头部

**pages.json 中设置去掉原生头部**

当`navigationStyle`设为`custom`或`titleNView`设为`false`时，原生导航栏不显示。

```js
{
  "pages": [{
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        // 单个页面设置
        "navigationStyle": "custom"
        /* "app-plus": {
         "titleNView": false
        } */
      }
    },
    {
      "path": "pages/index/list-news",
      "style": {
        "navigationBarTitleText": "新闻"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8",
    // 全局设置
    "navigationStyle": "custom"
    /* "app-plus":{
     "titleNView":false
    } */
  }
}
```

**状态栏 占位div**

非H5端，手机顶部状态栏区域会被页面内容覆盖。这是因为窗体是沉浸式的原因，即全屏可写内容。`uni-app`提供了状态栏高度的css变量`--status-bar-height`，如果需要把状态栏的位置从前景部分让出来，可写一个占位div，高度设为css变量。

**使用css方式进行控制**

```html
<template>
  <view>
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view> 状态栏下的文字 </view>
  </view>
</template>
<style>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
</style>
```

**使用js方式进行控制**

```html
<template>
  <view>
    <view :style="'height:'+statusHeight+'px'">
      <!-- 这里是状态栏 -->
    </view>
    <text> 状态栏下的文字 </text>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        statusHeight: 0
      }
    },
    onLoad() {
      this.statusHeight = plus.navigator.getStatusbarHeight();
    }
  }
</script>
```

### 事件监听注册

uniapp 提供了事件的监听注册以及触发，注册的事件都是 App 全局级别的，可以很方便的跨任意组件，页面，nvue，vue 等。

**相关注册或触发函数**

**uni.$emit(eventName,OBJECT)**

触发全局的自定义事件，附加参数都会传给监听器回调函数。

属性

类型

描述

eventName

String

事件名

OBJECT

Object

触发事件携带的附加参数

**代码示例**

```js
uni.$emit('update',{msg:'页面更新'})
```

**uni.$on(eventName,callback)**

监听全局的自定义事件，事件由`uni.$emit`触发，回调函数会接收事件触发函数的传入参数。

属性

类型

描述

eventName

String

事件名

callback

Function

事件的回调函数

**代码示例**

```js
uni.$on('update',function(data){
  console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
})
```

**uni.$once(eventName,callback)**

监听全局的自定义事件，事件由`uni.$emit`触发，但仅触发一次，在第一次触发之后移除该监听器。

属性

类型

描述

eventName

String

事件名

callback

Function

事件的回调函数

**代码示例**

```js
uni.$once('update',function(data){
  console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
})
```

**uni.$off(\[eventName, callback\])**

移除全局自定义事件监听器。

属性

类型

描述

eventName

Array＜String＞

事件名

callback

Function

事件的回调函数

* 如果uni.$off没有传入参数，则移除App级别的所有事件监听器；
* 如果只提供了事件名（eventName），则移除该事件名对应的所有监听器；
* 如果同时提供了事件与回调，则只移除这个事件回调的监听器；
* 提供的回调必须跟$on的回调为同一个才能移除这个回调的监听器

**代码示例**

`$emit`、`$on`、`$off`常用于跨页面、跨组件通讯，这里为了方便演示放在同一个页面

```js
<template>
  <view class="content">
    <view class="data">
      <text>{{val}}</text>
    </view>
    <button type="primary" @click="comunicationOff">结束监听</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        val: 0
      }
    },
    onLoad() {
      setInterval(() => {
        uni.$emit('add', {
          data: 2
        })
      }, 1000)
      uni.$on('add', this.add)
    },
    methods: {
      comunicationOff() {
        uni.$off('add', this.add)
      },
      add(e) {
        this.val += e.data
      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .data {
    text-align: center;
    line-height: 40px;
    margin-top: 40px;
  }

  button {
    width: 200px;
    margin: 20px 0;
  }
</style>
```

* uni.$emit、 uni.$on 、 uni.$once 、uni.$off 触发的事件都是 App 全局级别的，跨任意组件，页面，nvue，vue 等
* 使用时，注意及时销毁事件监听，比如，页面 onLoad 里边 uni.$on 注册监听，onUnload 里边 uni.$off 移除，或者一次性的事件，直接使用 uni.$once 监听
* 注意 uni.$on 定义完成后才能接收到 uni.$emit 传递的数据

**场景案例**

我们假设一个场景，进入app,是未登陆状态，需要在我的页面点击登陆，进入登陆页面进行登陆。登陆成功之后，返回到我的页面，实时显示登陆后的用户信息。

**监听事件**

在用户中心页面 监听事件。因为事件监听是全局的，所以使用`uni.$on`，需要使用`uni.$off`移除全局的事件监听，避免重复监听。

```js
<template>
  <view class="content">
    <navigator url="/pages/login/index" hover-class="navigator-hover">
      <button type="default">点我登录</button>
    </navigator>
    <view v-if="usnerInfo !== null">
      <view>
        用户token:{{usnerInfo.token}},用户昵称：{{usnerInfo.nickName}}
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        usnerInfo: null
      }
    },
    onLoad() {
      // 监听事件
      console.log('on login....');
      uni.$on('login', (uinfo) => {
        this.usnerInfo = uinfo;
      })
    },
    onUnload() {
      // 移除监听事件
      console.log('off login....');
      uni.$off('login');
    },
    methods: {

    }
  }
</script>
```

**触发事件**

进入登陆页面，触发事件。使用`uni.$emit`触发事件后，对应的`uni.$on`就会监听到事件触发，在回调中去执行相关的逻辑。

```js
<template>
  <view>
    <button type="default" @click="login">登录</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      login() {
        // 假设用户登录成功，此时调用emit方法触发监听事件，刷新用户登录信息
        uni.$emit('login', {
          token: 'user123456',
          nickName: 'wk123',
        });
      }
    }
  }
</script>
```

基本上述场景均可以实现，本质上就是一个页面通知另一个面我发生了变化，你需要处理一下。绝大部分页面的通讯都可以使用`uni.$emit`、`uni.$on`、`uni.$once`、`uni.$off`四个事件完成

## 2 Uniapp页面组成

### 页面简介

`uni-app`项目中，一个页面就是一个符合`Vue SFC`规范的`.vue`文件或`.nvue`文件。

`.vue`页面和`.nvue`页面，均全平台支持，差异在于当uni-app发行到App平台时，`.vue`文件会使用`webview`进行渲染，`.nvue`会使用原生进行渲染

### 新建页面

uni-app中的页面，通常会保存在工程根目录下的pages目录下。

每次新建页面，均需在pages.json中配置pages列表；未在pages.json -> pages 中配置的页面，uni-app会在编译阶段进行忽略

通过HBuilderX开发 uni-app 项目时，在 uni-app 项目上右键“新建页面”，HBuilderX会自动在pages.json中完成页面注册，开发更方便。

同时，HBuilderX 还内置了常用的页面模板（如图文列表、商品列表等），选择这些模板，可以大幅提升你的开发效率。

### 删除页面

删除页面时，需做两件工作：

* 删除`.vue`文件或.nvue文件
* 删除`pages.json` -> pages列表项中的配置

### 应用首页

uni-app会将pages.json -> pages配置项中的第一个页面，作为当前工程的首页（启动页）

### 页面生命周期

函数名

说明

平台差异说明

最低版本

onInit

监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad

百度小程序

3.1.0+

onLoad

监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参），参考[示例 (opens new window)](https://uniapp.dcloud.net.cn/api/router#navigateto)

onShow

监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面

onReady

监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发

onHide

监听页面隐藏

onUnload

监听页面卸载

onResize

监听窗口尺寸变化

App、微信小程序、快手小程序

onPullDownRefresh

监听用户下拉动作，一般用于下拉刷新，参考[示例 (opens new window)](https://uniapp.dcloud.net.cn/api/ui/pulldown)

onReachBottom

页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。具体见下方注意事项

onTabItemTap

点击 tab 时触发，参数为Object，具体见下方注意事项

微信小程序、QQ小程序、支付宝小程序、百度小程序、H5、App、快手小程序、京东小程序

onShareAppMessage

用户点击右上角分享

微信小程序、QQ小程序、支付宝小程序、字节小程序、飞书小程序、快手小程序、京东小程序

onPageScroll

监听页面滚动，参数为Object

nvue暂不支持

onNavigationBarButtonTap

监听原生标题栏按钮点击事件，参数为Object

App、H5

onBackPress

监听页面返回，返回 event = {from:backbutton、 navigateBack} ，backbutton 表示来源是左上角返回按钮或 android 返回键；navigateBack表示来源是 uni.navigateBack ；详细说明及使用：[onBackPress 详解 (opens new window)](http://ask.dcloud.net.cn/article/35120)。支付宝小程序只有真机能触发，只能监听非navigateBack引起的返回，不可阻止默认行为。

app、H5、支付宝小程序

onNavigationBarSearchInputChanged

监听原生标题栏搜索输入框输入内容变化事件

App、H5

1.6.0

onNavigationBarSearchInputConfirmed

监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发。

App、H5

1.6.0

onNavigationBarSearchInputClicked

监听原生标题栏搜索输入框点击事件（pages.json 中的 searchInput 配置 disabled 为 true 时才会触发）

App、H5

1.6.0

onShareTimeline

监听用户点击右上角转发到朋友圈

微信小程序

2.8.1+

onAddToFavorites

监听用户点击右上角收藏

微信小程序、QQ小程序

2.8.1+

`onInit`使用注意

* 仅百度小程序基础库 3.260 以上支持 onInit 生命周期
* 其他版本或平台可以同时使用 onLoad 生命周期进行兼容，注意避免重复执行相同逻辑
* 不依赖页面传参的逻辑可以直接使用 created 生命周期替代

`onInit`使用注意

* 仅百度小程序基础库 3.260 以上支持 onInit 生命周期
* 其他版本或平台可以同时使用 onLoad 生命周期进行兼容，注意避免重复执行相同逻辑
* 不依赖页面传参的逻辑可以直接使用 created 生命周期替代

`onReachBottom`使用注意 可在pages.json里定义具体页面底部的触发距离[onReachBottomDistance (opens new window)](https://uniapp.dcloud.net.cn/collocation/pages#globalstyle)，比如设为50，那么滚动页面到距离底部50px时，就会触发onReachBottom事件。

如使用scroll-view导致页面没有滚动，则触底事件不会被触发。scroll-view滚动到底部的事件请参考scroll-view的文档

`onPageScroll` （监听滚动、滚动监听、滚动事件）参数说明：

属性

类型

说明

scrollTop

Number

页面在垂直方向已滚动的距离（单位px）

**注意**

* `onPageScroll`里不要写交互复杂的js，比如频繁修改页面。因为这个生命周期是在渲染层触发的，在非h5端，js是在逻辑层执行的，两层之间通信是有损耗的。如果在滚动过程中，频发触发两层之间的数据交换，可能会造成卡顿。
* 如果想实现滚动时标题栏透明渐变，在App和H5下，可在pages.json中配置titleNView下的type为transparent，[参考 (opens new window)](https://uniapp.dcloud.io/collocation/pages?id=app-titlenview)。
* 如果需要滚动吸顶固定某些元素，推荐使用css的粘性布局，参考[插件市场 (opens new window)](https://ext.dcloud.net.cn/plugin?id=715)。插件市场也有其他js实现的吸顶插件，但性能不佳，需要时可自行搜索。
* 在App、微信小程序、H5中，也可以使用wxs监听滚动，[参考 (opens new window)](https://uniapp.dcloud.io/tutorial/miniprogram-subject#wxs)；在app-nvue中，可以使用bindingx监听滚动，[参考 (opens new window)](https://uniapp.dcloud.io/tutorial/nvue-api#nvue-%E9%87%8C%E4%BD%BF%E7%94%A8-bindingx)。
* `onBackPress`上不可使用`async`，会导致无法阻止默认返回

```js
onPageScroll : function(e) { //nvue暂不支持滚动监听，可用bindingx代替
 console.log("滚动距离为：" + e.scrollTop);
},
```

`onTabItemTap` 返回的json对象说明：

属性

类型

说明

index

Number

被点击tabItem的序号，从0开始

pagePath

String

被点击tabItem的页面路径

text

String

被点击tabItem的按钮文字

**注意**

* onTabItemTap常用于点击当前tabitem，滚动或刷新当前页面。如果是点击不同的tabitem，一定会触发页面切换。
* 如果想在App端实现点击某个tabitem不跳转页面，不能使用onTabItemTap，可以使用[plus.nativeObj.view (opens new window)](http://www.html5plus.org/doc/zh_cn/nativeobj.html)放一个区块盖住原先的tabitem，并拦截点击事件。

```js
onTabItemTap : function(e) {
 console.log(e);
 // e的返回格式为json对象： {"index":0,"text":"首页","pagePath":"pages/index/index"}
},
```

`onNavigationBarButtonTap` 参数说明：

属性

类型

说明

index

Number

原生标题栏按钮数组的下标

```js
onNavigationBarButtonTap : function (e) {
 console.log(e);
 // e的返回格式为json对象：{"text":"测试","index":0}
}
```

`onBackPress` 回调参数对象说明：

属性

类型

说明

from

String

触发返回行为的来源：'backbutton'——左上角导航栏按钮及安卓返回键；'navigateBack'——uni.navigateBack() 方法。**支付宝小程序端不支持返回此字段**

```js
export default {
 data() {
  return {};
 },
 onBackPress(options) {
  console.log('from:' + options.from)
 }
}
```

**注意**

* nvue 页面weex编译模式支持的生命周期同weex，具体参考：[weex生命周期介绍 (opens new window)](https://uniapp.dcloud.io/tutorial/nvue-outline?id=%E7%BC%96%E8%AF%91%E6%A8%A1%E5%BC%8F)。
* 支付宝小程序真机可以监听到非`navigateBack`引发的返回事件（使用小程序开发工具时不会触发`onBackPress`），不可以阻止默认返回行为

### 组件生命周期

`uni-app` 组件支持的生命周期，与vue标准组件的生命周期相同。这里没有页面级的onLoad等生命周期：

函数名

说明

平台差异说明

最低版本

beforeCreate

在实例初始化之前被调用。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeCreate)

created

在实例创建完成后被立即调用。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#created)

beforeMount

在挂载开始之前被调用。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeMount)

mounted

挂载到实例上去之后调用。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#mounted) 注意：此处并不能确定子组件被全部挂载，如果需要子组件完全挂载之后在执行操作可以使用`$nextTick`[Vue官方文档 (opens new window)](https://v2.cn.vuejs.org/v2/api/#vm-nextTick)

beforeUpdate

数据更新时调用，发生在虚拟 DOM 打补丁之前。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeUpdate)

仅H5平台支持

updated

由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#updated)

仅H5平台支持

beforeDestroy

实例销毁之前调用。在这一步，实例仍然完全可用。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#beforeDestroy)

destroyed

Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。[详见 (opens new window)](https://v2.cn.vuejs.org/v2/api/#destroyed)

### 页面调用接口

#### getApp()

`getApp()` 函数用于获取当前应用实例，一般用于获取globalData 。

**实例**

```js
const app = getApp()
console.log(app.globalData)
```

**注意：**

* 不要在定义于 `App()` 内的函数中，或调用 `App` 前调用 `getApp()` ，可以通过 `this.$scope` 获取对应的app实例
* 通过 `getApp()` 获取实例之后，不要私自调用生命周期函数。
* 当在首页`nvue`中使用`getApp()`不一定可以获取真正的`App`对象。对此提供了`const app = getApp({allowDefault: true})`用来获取原始的`App`对象，可以用来在首页对`globalData`等初始化

#### getCurrentPages()

`getCurrentPages()` 函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。

**注意：** `getCurrentPages()`仅用于展示页面栈的情况，请勿修改页面栈，以免造成页面状态错误。

每个页面实例的方法属性列表：

方法

描述

平台说明

page.$getAppWebview()

获取当前页面的webview对象实例

App

page.route

获取当前页面的路由

Tips：

* `navigateTo`, `redirectTo` 只能打开非 tabBar 页面。
* `switchTab` 只能打开 `tabBar` 页面。
* `reLaunch` 可以打开任意页面。
* 页面底部的 `tabBar` 由页面决定，即只要是定义为 `tabBar` 的页面，底部都有 `tabBar`。
* 不能在 `App.vue` 里面进行页面跳转。

#### $getAppWebview()

`uni-app` 在 `getCurrentPages()`获得的页面里内置了一个方法 `$getAppWebview()` 可以得到当前webview的对象实例，从而实现对 webview 更强大的控制。在 html5Plus 中，plus.webview具有强大的控制能力，可参考：[WebviewObject (opens new window)](http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject)。

但`uni-app`框架有自己的窗口管理机制，请不要自己创建和销毁webview，如有需求覆盖子窗体上去，请使用[原生子窗体subNvue (opens new window)](https://uniapp.dcloud.net.cn/api/window/subNVues)。

**注意：此方法仅 App 支持**

**示例：**

获取当前页面 webview 的对象实例

```js
export default {
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    const currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
    currentWebview.setBounce({position:{top:'100px'},changeoffset:{top:'0px'}}); //动态重设bounce效果
    // #endif
  }
}
```

获取指定页面 webview 的对象实例

`getCurrentPages()`可以得到所有页面对象，然后根据数组，可以取指定的页面webview对象

```js
var pages = getCurrentPages();
var page = pages[pages.length - 1];
// #ifdef APP-PLUS
var currentWebview = page.$getAppWebview();
console.log(currentWebview.id);//获得当前webview的id
console.log(currentWebview.isVisible());//查询当前webview是否可见
);
// #endif
```

uni-app自带的web-view组件，是页面中新插入的一个子webview

### 页面通讯

#### uni.$emit(eventName,OBJECT)

触发全局的自定义事件。附加参数都会传给监听器回调。

属性

类型

描述

eventName

String

事件名

OBJECT

Object

触发事件携带的附加参数

**代码示例**

```js
 uni.$emit('update',{msg:'页面更新'})
```

#### uni.$on(eventName,callback)

监听全局的自定义事件。事件可以由 uni.$emit 触发，回调函数会接收所有传入事件触发函数的额外参数。

属性

类型

描述

eventName

String

事件名

callback

Function

事件的回调函数

**代码示例**

```js
 uni.$on('update',function(data){
  console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
 })
```

#### uni.$once(eventName,callback)

监听全局的自定义事件。事件可以由 uni.$emit 触发，但是只触发一次，在第一次触发之后移除监听器。

属性

类型

描述

eventName

String

事件名

callback

Function

事件的回调函数

**代码示例**

```js
 uni.$once('update',function(data){
  console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
 })
```

#### uni.$off(\[eventName, callback\])

移除全局自定义事件监听器。

属性

类型

描述

eventName

Array＜String＞

事件名

callback

Function

事件的回调函数

**Tips**

* 如果没有提供参数，则移除所有的事件监听器；
* 如果只提供了事件，则移除该事件所有的监听器；
* 如果同时提供了事件与回调，则只移除这个回调的监听器；
* 提供的回调必须跟$on的回调为同一个才能移除这个回调的监听器；

**代码示例**

`$emit`、`$on`、`$off`常用于跨页面、跨组件通讯，这里为了方便演示放在同一个页面

```js
<template>
  <view class="content">
   <view class="data">
    <text>{{val}}</text>
   </view>
   <button type="primary" @click="comunicationOff">结束监听</button>
  </view>
 </template>

 <script>
  export default {
   data() {
    return {
     val: 0
    }
   },
   onLoad() {
    setInterval(()=>{
     uni.$emit('add', {
      data: 2
     })
    },1000)
    uni.$on('add', this.add)
   },
   methods: {
    comunicationOff() {
     uni.$off('add', this.add)
    },
    add(e) {
     this.val += e.data
    }
   }
  }
 </script>

 <style>
  .content {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
  }

  .data {
   text-align: center;
   line-height: 40px;
   margin-top: 40px;
  }

  button {
   width: 200px;
   margin: 20px 0;
  }
 </style>
```

**注意事项**

* uni.$emit、 uni.$on 、 uni.$once 、uni.$off 触发的事件都是 App 全局级别的，跨任意组件，页面，nvue，vue 等
* 使用时，注意及时销毁事件监听，比如，页面 onLoad 里边 uni.$on 注册监听，onUnload 里边 uni.$off 移除，或者一次性的事件，直接使用 uni.$once 监听

### 路由

`uni-app`页面路由为框架统一管理，开发者需要在[pages.json (opens new window)](https://uniapp.dcloud.net.cn/collocation/pages#pages)里配置每个路由页面的路径及页面样式。类似小程序在 app.json 中配置页面路由一样。所以 `uni-app` 的路由用法与 `Vue Router` 不同，如仍希望采用 `Vue Router` 方式管理路由，可在插件市场搜索 [Vue-Router (opens new window)](https://ext.dcloud.net.cn/search?q=vue-router)

`uni-app` 有两种页面路由跳转方式：使用[navigator (opens new window)](https://uniapp.dcloud.net.cn/component/navigator)组件跳转、调用[API (opens new window)](https://uniapp.dcloud.net.cn/api/router)跳转

```js
<template>
 <view>
  <view class="page-body">
   <view class="btn-area">
    <navigator url="navigate/navigate?title=navigate" hover-class="navigator-hover">
     <button type="default">跳转到新页面</button>
    </navigator>
    <navigator url="redirect/redirect?title=redirect" open-type="redirect" hover-class="other-navigator-hover">
     <button type="default">在当前页打开</button>
    </navigator>
    <navigator url="/pages/tabBar/extUI/extUI" open-type="switchTab" hover-class="other-navigator-hover">
     <button type="default">跳转tab页面</button>
    </navigator>
   </view>
  </view>
 </view>
</template>
<script>
// navigate.vue页面接受参数
export default {
 onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
  console.log(option.id); //打印出上个页面传递的参数。
  console.log(option.name); //打印出上个页面传递的参数。
 }
}
</script>
```

**uni.navigateTo(OBJECT)**

```js
//在起始页面跳转到test.vue页面并传递参数
uni.navigateTo({
 url: 'test?id=1&name=uniapp'
});
```

```js
// 在test.vue页面接受参数
export default {
 onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
  console.log(option.id); //打印出上个页面传递的参数。
  console.log(option.name); //打印出上个页面传递的参数。
 }
}
```

### 页面栈

框架以栈的形式管理当前所有页面， 当发生路由切换的时候，页面栈的表现如下

框架以栈的形式管理当前所有页面， 当发生路由切换的时候，页面栈的表现如下：

路由方式

页面栈表现

触发时机

初始化

新页面入栈

uni-app 打开的第一个页面

打开新页面

新页面入栈

调用 API [uni.navigateTo (opens new window)](https://uniapp.dcloud.net.cn/api/router#navigateto) 、使用组件 `<navigator open-type="navigate"/>`

页面重定向

当前页面出栈，新页面入栈

调用 API [uni.redirectTo (opens new window)](https://uniapp.dcloud.net.cn/api/router#redirectto) 、使用组件 `<navigator open-type="redirectTo"/>`

页面返回

页面不断出栈，直到目标返回页

调用 API [uni.navigateBack (opens new window)](https://uniapp.dcloud.net.cn/api/router#navigateback) 、使用组件 `<navigator open-type="navigateBack"/>` 、用户按左上角返回按钮、安卓用户点击物理back按键

Tab 切换

页面全部出栈，只留下新的 Tab 页面

调用 API [uni.switchTab (opens new window)](https://uniapp.dcloud.net.cn/api/router#switchtab) 、使用组件 `<navigator open-type="switchTab"/>` 、用户切换 Tab

重加载

页面全部出栈，只留下新的页面

调用 API [uni.reLaunch (opens new window)](https://uniapp.dcloud.net.cn/api/router#relaunch) 、使用组件 `<navigator open-type="reLaunch"/>`

### 页面代码规范介绍

`uni-app` 支持在 template 模板中嵌套 `<template/>` 和 `<block/>`，用来进行 [列表渲染 (opens new window)](https://uniapp.dcloud.net.cn/tutorial/vue-basics#listrendering) 和 [条件渲染 (opens new window)](https://uniapp.dcloud.net.cn/tutorial/vue-basics#condition)。

`<template/>` 和 `<block/>` 并不是一个组件，它们仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性。

`<block/>` 在不同的平台表现存在一定差异，推荐统一使用 `<template/>`。

```js
<template>
 <view>
  <template v-if="test">
   <view>test 为 true 时显示</view>
  </template>
  <template v-else>
   <view>test 为 false 时显示</view>
  </template>
 </view>
</template>
```

```js
<template>
 <view>
  <block v-for="(item,index) in list" :key="index">
   <view>{{item}} - {{index}}</view>
  </block>
 </view>
</template>
```

### nvue 开发与 vue 开发的常见区别

nvue是什么？native vue的缩写

> Nvue是一个基于weex改进的原生渲染引擎,它在某些方面要比vue更高性能,在app上使用更加流畅,但是缺点也很明显,没有足够的api能力,语法限制太大,所以nvue适用于特定场景

* nvue 是 uni-app 的一种渲染方式，如果使用vue页面，则使用webview渲染；如果使用nvue页面(native vue的缩写)，则使用原生渲染
* nvue 页面控制显隐只可以使用`v-if`不可以使用`v-show`
* nvue 页面只能使用`flex`布局，不支持其他布局方式。页面开发前，首先想清楚这个页面的纵向内容有什么，哪些是要滚动的，然后每个纵向内容的横轴排布有什么，按 flex 布局设计好界面
* nvue 页面的布局排列方向默认为竖排（`column`），如需改变布局方向，可以在 `manifest.json` -> `app-plus` -> `nvue` -> `flex-direction` 节点下修改，仅在 uni-app 模式下生效
* nvue 页面编译为 H5、小程序时，会做一件 css 默认值对齐的工作。因为 weex 渲染引擎只支持 flex，并且默认 flex 方向是垂直。而 H5 和小程序端，使用 web 渲染，默认不是 flex，并且设置`display:flex`后，它的 flex 方向默认是水平而不是垂直的。所以 nvue 编译为 H5、小程序时，会自动把页面默认布局设为 flex、方向为垂直。当然开发者手动设置后会覆盖默认设置
* 文字内容，必须、只能在`<text>`组件下。不能在`<div>`、`<view>`的`text`区域里直接写文字。否则即使渲染了，也无法绑定 js 里的变量
* 只有`text`标签可以设置字体大小，字体颜色
* 布局不能使用百分比、没有媒体查询
* nvue 切换横竖屏时可能导致样式出现问题，建议有 nvue 的页面锁定手机方向
* 支持的 css 有限，不过并不影响布局出你需要的界面，`flex`还是非常强大的
* 不支持背景图。但可以使用`image`组件和层级来实现类似 web 中的背景效果。因为原生开发本身也没有 web 这种背景图概念
* css 选择器支持的比较少，只能使用 class 选择器
* nvue 的各组件在安卓端默认是透明的，如果不设置`background-color`，可能会导致出现重影的问题
* `class` 进行绑定时只支持数组语法
* `Android` 端在一个页面内使用大量圆角边框会造成性能问题，尤其是多个角的样式还不一样的话更耗费性能。应避免这类使用
* `nvue` 页面没有`bounce`回弹效果，只有几个列表组件有`bounce`效果，包括 `list`、`recycle-list`、`waterfall`
* 原生开发没有页面滚动的概念，页面内容高过屏幕高度并不会自动滚动，只有部分组件可滚动（`list`、`waterfall`、`scroll-view/scroller`），要滚得内容需要套在可滚动组件下。这不符合前端开发的习惯，所以在 nvue 编译为 uni-app 模式时，给页面外层自动套了一个 `scroller`，页面内容过高会自动滚动。（组件不会套，页面有`recycle-list`时也不会套）。后续会提供配置，可以设置不自动套
* 在 `App.vue` 中定义的全局 js 变量不会在 `nvue` 页面生效。`globalData`和`vuex`是生效的
* App.vue 中定义的全局 css，对 nvue 和 vue 页面同时生效。如果全局 css 中有些 css 在 nvue 下不支持，编译时控制台会报警，建议把这些不支持的 css 包裹在[条件编译 (opens new window)](https://uniapp.dcloud.io/tutorial/platform)里，`APP-PLUS-NVUE`
* 不能在 `style` 中引入字体文件，nvue 中字体图标的使用参考：[加载自定义字体 (opens new window)](https://uniapp.dcloud.net.cn/tutorial/nvue-api#addrule)。如果是本地字体，可以用`plus.io`的 API 转换路径
* 目前不支持在 nvue 页面使用 `typescript/ts`

## 3 资源互相引用

### NPM支持

### 模板内引入静态资源

### css 引入静态资源

### 引入原生插件

## 4 JS语法

### 标准js和浏览器js的区别

### ES6 支持

## 5 CSS语法

### 尺寸单位

### 选择器

### 全局样式与局部样式

### CSS 变量

### 固定值

### Flex 布局

### 背景图片

### 字体图标

## 6 uniapp中使用Vue2语法注意

### 基础

### 组件

### API

## 7 uniapp中使用Vue3语法注意

### 基础

### 组件

### API

## 8 Vue2升级Vue3

### main.js

### 环境变量

### 全局属性

### 插件使用

### 项目根目录必需创建 index.html 文件

### 只支持使用 ES6 模块规范

### vuex 用法

### 生命周期的适配

### 事件的适配

### Vue3 项目部分小程序端事件延迟或调用失败

### v-model 的适配

### 插槽的适配

### 不再支持过滤器

### API `Promise 化` 调用结果的方式

### 生命周期钩子的组合式 API 使用方式

### $mp调整为 $scope

### 在 nvue 使用 Vuex

### 需主动开启 sourcemap

### 小程序平台中监听原生的点击事

### vue3 支持的手机版本最低到多少

### vue3 nvue 暂不支持 recycle-list 组件

### h5 平台发行时，会默认启动摇树

### 通过 props 来获取页面参数

## 9 跨平台兼容

### H5正常但App异常的可能性

### H5正常但小程序异常的可能性

### 小程序正常但App异常的可能性

### 小程序或App正常，但H5异常的可能性

### App正常，小程序、H5异常的可能性

### 区别于传统 web 开发的注意

### H5 开发注意

### 小程序开发注意

## 10 uni-app存储

## 11 判断平台

## 12 条件编译

### 什么是编译器

### 条件编译

### 环境变量

### 编译器配置

## 13 web专题

### 宽屏适配指南

## 14 App相关

### nvue原生渲染

### HTML5 Plus

### Native.js

### renderjs

## 15 小程序相关

### 小程序自定义组件支持

## 16 项目结构

### App.vue

### Main.js

### vue.config.js

### uni.scss

### uni\_modules

## 17 运行

### 运行到App

### 运行到小程序

### 支付宝小程序

## 18 发布

### 小程序打包

### 发布为Web网站

### App打包

## 19 uni-app组成和跨端原理

### 基本语言和开发规范

### 编译器

### 运行时（runtime）

### 逻辑层和渲染层分离

## 20 需要注意

### easycom组件规范

### scroll-view
