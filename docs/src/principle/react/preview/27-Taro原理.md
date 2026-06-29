
## 一、Taro 的安装与使用

### 1.1 安装

```js
npm install -g @tarojs/cli
```

```js
taro -V
```

### 1.2 使用

使用命令创建模板项目

```js
taro init myApp
```

![](https://s.poetries.top/gitee/2020/09/92.png)

#### 1.2.1 微信小程序

> 选择微信小程序模式，需要自行下载并打开微信开发者工具，然后选择项目根目录进行预览

微信小程序编译预览及打包

```js
# npm script
$ npm run dev:weapp
$ npm run build:weapp
```

#### 1.2.2 百度小程序

> 选择百度小程序模式，需要自行下载并打开[百度开发者工具 (opens new window)](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/)，然后在项目编译完后选择项目根目录下 dist 目录进行预览

百度小程序编译预览及打包

```js
# npm script
$ npm run dev:swan
$ npm run build:swan
```

#### 1.2.3 支付宝小程序

> 选择支付宝小程序模式，需要自行下载并打开[支付宝小程序开发者工具 (opens new window)](https://docs.alipay.com/mini/developer/getting-started/)，然后在项目编译完后选择项目根目录下 dist 目录进行预览

支付宝小程序编译预览及打包：

```js
# npm script
$ npm run dev:alipay
$ npm run build:alipay
```

#### 1.2.4 H5

H5 编译预览及打包：

```js
# npm script
$ npm run dev:h5

# 仅限全局安装
$ taro build --type h5 --watch
```

#### 1.2.5 React Native

> `React Native` 端运行需执行如下命令，`React Native` 端相关的运行说明请参见 `React Native` [教程 (opens new window)](https://nervjs.github.io/taro/docs/react-native.html)

```js
# npm script
$ npm run dev:rn
```

### 1.3 更新 Taro

> `Taro` 提供了更新命令来更新 `CLI`工具自身和项目中 `Taro` 相关的依赖。

更新 `taro-cli` 工具

```js
# taro
$ taro update self
# npm 
```

> 更新项目中 `Taro` 相关的依赖，这个需要在你的项目下执行

```js
taro update project
```

## 二、Taro 开发说明与注意事项

### 2.1 微信小程序开发工具的配置

> 由于 `Taro` 编译后的代码已经经过了转义和压缩，因此还需要注意微信开发者工具的项目设置

* 设置关闭 `ES6` 转 `ES5` 功能
* 设置关闭上传代码时样式自动补全
* 设置关闭代码压缩上传

![](https://s.poetries.top/gitee/2020/09/239.png)

### 2.2 Taro 与 React 的差异

> 由于微信小程序的限制，`React` 中某些写法和特性在 `Taro` 中还未能实现，后续将会逐渐完善。 截止到本小册发布前，`Taro` 的最新版本为 `1.1`，因此以下讲解默认版本为 `1.1`

#### 2.2.1 暂不支持在 render() 之外的方法定义 JSX

> 由于微信小程序的 `template` 不能动态传值和传入函数，`Taro` 暂时也没办法支持在类方法中定义 `JSX`

无效情况

```js
class App extends Component {
  _render() {
    return <View />
  }
}

class App extends Component {
  renderHeader(showHeader) {
    return showHeader && <Header />
  }
}

class App extends Component {
  renderHeader = (showHeader) => {
    return showHeader& & <Header />
  }
}...
```

**解决方案**

在 `render` 方法中定义

```js
class App extends Component {

  render () {
    const { showHeader, showMain } = this.state
    const header = showHeader && <Header />
    const main = showMain && <Main />
    return (
      <View>
        {header}
        {main}
      </View>
    )
  }
}...
```

#### 2.2.2 不能在包含 JSX 元素的 map 循环中使用 if 表达式

无效情况

```js
numbers.map((number) => {
  let element = null
  const isOdd = number % 2
  if (isOdd) {
    element = <Custom />
  }
  return element
})

numbers.map((number) => {
  let isOdd = false
  if (number % 2) {
    isOdd = true
  }
  return isOdd && <Custom />
})...
```

**解决方案**

尽量在 `map` 循环中使用条件表达式或逻辑表达式。

```js
numbers.map((number) => {
  const isOdd = number % 2
  return isOdd ? <Custom /> : null
})

numbers.map((number) => {
  const isOdd = number % 2
  return isOdd && <Custom />
})...
```

#### 2.2.3 不能使用 Array.map 之外的方法操作 JSX 数组

> Taro 在小程序端实际上把 JSX 转换成了字符串模板，而一个原生 `JSX` 表达式实际上是一个 `React/Nerv` 元素(react - element)的构造器，因此在原生 JSX 中你可以对任何一组 React 元素进行操作。但在 Taro 中你只能使用 map 方法，Taro 转换成小程序中 `wx:for`...

无效情况

```js
test.push(<View />)

numbers.forEach(numbers => {
  if (someCase) {
    a = <View />
  }
})

test.shift(<View />)

components.find(component => {
  return component === <View />
})

components.some(component => component.constructor.__proto__ === <View />.constructor)

numbers.filter(Boolean).map((number) => {
  const element = <View />
  return <View />
})...
```

**解决方案**

先处理好需要遍历的数组，然后再用处理好的数组调用 map 方法。

```js
numbers.filter(isOdd).map((number) => <View />)

for (let index = 0; index < array.length; index++) {
  // do you thing with array
}

const element = array.map(item => {
  return <View />
})...

```

#### 2.2.4 不能在 JSX 参数中使用匿名函数

无效情况

```js
<View onClick={() => this.handleClick()} />

<View onClick={(e) => this.handleClick(e)} />

<View onClick={() => ({})} />

<View onClick={function () {}} />

<View onClick={function (e) {this.handleClick(e)}} />...
```

**解决方案**

使用 `bind` 或 类参数绑定函数。

```js
<View onClick={this.props.hanldeClick.bind(this)} />
```

#### 2.2.5 不能在 JSX 参数中使用对象展开符

> 微信小程序组件要求每一个传入组件的参数都必须预先设定好，而对象展开符则是动态传入不固定数量的参数。所以 `Taro` 没有办法支持该功能

无效情况

```js
<View {...this.props} />

<View {...props} />

<Custom {...props} />
```

**解决方案**

开发者自行赋值：

```js
render () {
    const { id, title } = obj
    return <View id={id} title={title} />
}...
```

#### 2.2.6 不允许在 JSX 参数（props）中传入 JSX 元素

> 由于微信小程序内置的组件化的系统不能通过属性（props） 传函数，而 props 传递函数可以说是 React 体系的根基之一，我们只能自己实现一套组件化系统。而自制的组件化系统不能使用内置组件化的 slot 功能。两权相害取其轻，我们暂时只能不支持该功能...

无效情况

```js
<Custom child={<View />} />

<Custom child={() => <View />} />

<Custom child={function () { <View /> }} />

<Custom child={ary.map(a => <View />)} />...
```

**解决方案**

> 通过 `props` 传值在 `JSX` 模板中预先判定显示内容，或通过 `props.children` 来嵌套子组件

#### 2.2.7 不支持无状态组件（Stateless Component)

> 由于微信的 `template` 能力有限，不支持动态传值和函数，`Taro` 暂时只支持一个文件自定义一个组件。为了避免开发者疑惑，暂时不支持定义 `Stateless Component`

无效情况

```js
function Test () {
  return <View />
}

function Test (ary) {
  return ary.map(() => <View />)
}

const Test = () => {
  return <View />
}

const Test = function () {
  return <View />
}...
```

**解决方案**

使用 `class` 定义组件。

```js
class App extends Component {
  render () {
    return (
      <View />
    )
  }
}
```

### 2.3 命名规范

> Taro 函数命名使用驼峰命名法，如`onClick`，由于微信小程序的 WXML 不支持传递函数，函数名编译后会以字符串的形式绑定在 WXML 上，囿于 WXML 的限制，函数名有三项限制

* 方法名不能含有数字
* 方法名不能以下划线开头或结尾
* 方法名的长度不能大于 `20`

请遵守以上规则，否则编译后的代码在微信小程序中会报以下错误

![](https://s.poetries.top/gitee/2020/09/240.png)

### 2.4 推荐安装 ESLint 编辑器插件

> Taro 有些写法跟 React 有些差异，可以通过安装 ESLint 相关的编辑器插件来获得人性化的提示。由于不同编辑器安装的插件有所不同，具体安装方法请自行搜索，这里不再赘述。 如下图，就是安装插件后获得的提示

![](https://s.poetries.top/gitee/2020/09/241.png) ![](https://s.poetries.top/gitee/2020/09/242.png)

### 2.5 最佳编码方式

**组件传递函数属性名以 on 开头**

> 在 `Taro` 中，父组件要往子组件传递函数，属性名必须以`on` 开头

```js
// 调用 Custom 组件，传入 handleEvent 函数，属性名为 `onTrigger`
class Parent extends Component {

  handleEvent () {

  }

  render () {
    return (
      <Custom onTrigger={this.handleEvent}></Custom>
    )
  }
}...
```

> 这是因为，微信小程序端组件化是不能直接传递函数类型给子组件的，在 Taro 中是借助组件的事件机制来实现这一特性，而小程序中传入事件的时候属性名写法为 `bindmyevent` 或者 `bind:myevent`

```js
<!-- 当自定义组件触发“myevent”事件时，调用“onMyEvent”方法 -->
<component-tag-name bindmyevent="onMyEvent" />
<!-- 或者可以写成 -->
<component-tag-name bind:myevent="onMyEvent" />
```

> 所以 `Taro`中约定组件传递函数属性名以 `on` 开头，同时这也和内置组件的事件绑定写法保持一致了...

**小程序端不要在组件中打印传入的函数**

> 前面已经提到小程序端的组件传入函数的原理，所以在小程序端不要在组件中打印传入的函数，因为拿不到结果，但是 `this.props.onXxx && this.props.onXxx()` 这种判断函数是否传入来进行调用的写法是完全支持的...

**小程序端不要将在模板中用到的数据设置为 undefined**

* 由于小程序不支持将 `data` 中任何一项的 `value` 设为 `undefined` ，在 `setState` 的时候也请避免这么用。你可以使用 `null` 来替代。
* 小程序端不要在组件中打印 `this.props.children` 在微信小程序端是通过`<slot />` 来实现往自定义组件中传入元素的，而 `Taro` 利用 `this.props.children` 在编译时实现了这一功能， `this.props.children` 会直接被编译成 `<slot />` 标签，所以它在小程序端属于语法糖的存在，请不要在组件中打印它...

**组件 state 与 props 里字段重名的问题**

> 不要在 `state`与 `props` 上用同名的字段，因为这些被字段在微信小程序中都会挂在 `data` 上

**小程序中页面生命周期 componentWillMount 不一致问题**

> 由于微信小程序里页面在 `onLoad` 时才能拿到页面的路由参数，而页面 `onLoad` 前组件都已经 `attached` 了。因此页面的 `componentWillMount` 可能会与预期不太一致。例如：

```js
// 错误写法
render () {
  // 在 willMount 之前无法拿到路由参数
  const abc = this.$router.params.abc
  return <Custom adc={abc} />
}

// 正确写法
componentWillMount () {
  const abc = this.$router.params.abc
  this.setState({
    abc
  })
}
render () {
  // 增加一个兼容判断
  return this.state.abc && <Custom adc={abc} />
}
```

对于不需要等到页面 `willMount` 之后取路由参数的页面则没有任何影响...

**JS 编码必须用单引号**

> 在 `Taro` 中，`JS` 代码里必须书写单引号，特别是 `JSX` 中，如果出现双引号，可能会导致编译错误

**process.env 的使用**

> 不要以解构的方式来获取通过 `env`配置的 `process.env` 环境变量，请直接以完整书写的方式 `process.env.NODE_ENV`来进行使用

```js
// 错误写法，不支持
const { NODE_ENV = 'development' } = process.env
if (NODE_ENV === 'development') {
  ...
}

// 正确写法
if (process.env.NODE_ENV === 'development') {

}...
```

**预加载**

> 在微信小程序中，从调用 `Taro.navigateTo`、`Taro.redirectTo` 或 `Taro.switchTab` 后，到页面触发`componentWillMount` 会有一定延时。因此一些网络请求可以提前到发起跳转前一刻去请求

Taro 提供了 `componentWillPreload` 钩子，它接收页面跳转的参数作为参数。可以把需要预加载的内容通过 `return` 返回，然后在页面触发 `componentWillMount` 后即可通过 `this.$preloadData` 获取到预加载的内容。...

```js
class Index extends Component {
  componentWillMount () {
    console.log('isFetching: ', this.isFetching)
    this.$preloadData
      .then(res => {
        console.log('res: ', res)
        this.isFetching = false
      })
  }

  componentWillPreload (params) {
    return this.fetchData(params.url)
  }

  fetchData () {
    this.isFetching = true
    ...
  }
}...
```

## 三、Taro 设计思想及架构

### 3.1 抹平多端差异

## 四、CLI 原理及不同端的运行机制

### 4.1 taro-cli 包

### 4.2 用到的核心库

### 4.3 Taro Init

### 4.4 Taro Build

## 五、Taro 组件库及 API 的设计与适配

### 5.1 多端差异

### 5.2 多端适配

## 六、JSX 转换微信小程序模板的实现

### 6.1 代码的本质

### 6.2 Babel

### 6.3 实践例子

## 七、小程序运行时

### 7.1 注册程序、页面以及自定义组件

### 7.2 组件 state 转换

### 7.3 将组件的生命周期对应到小程序组件的生命周期

### 7.4 事件处理函数对应

### 7.5 对 API 进行 Promise 化的处理

## 八、H5 运行时

### 8.1 H5 运行时解析

### 8.2 API 适配

### 8.3 路由

### 8.4 Redux 处理

## 九、更多参考
