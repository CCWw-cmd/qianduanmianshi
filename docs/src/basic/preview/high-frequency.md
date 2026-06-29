
# 高频篇

> 一天快速复习完高频面试题

## 1 CSS

### 盒模型

> * 有两种， `IE`盒子模型、`W3C`盒子模型；
> * 盒模型： 内容(`content`)、填充(`padding`)、边界(`margin`)、 边框(`border`)；
> * 区 别： `IE`的`content`部分把 `border` 和 `padding`计算了进去;

**标准盒子模型的模型图**

![](https://s.poetries.top/uploads/2022/09/5c302a15e52c1b08.png)

从上图可以看到：

* 盒子总宽度 = `width` + `padding` + `border` + `margin`;
* 盒子总高度 = `height` + `padding` + `border` + `margin`

也就是，`width/height` 只是内容高度，不包含 `padding` 和 `border` 值

**IE 怪异盒子模型**

![](https://s.poetries.top/uploads/2022/09/55340636fa7cdcee.png)

从上图可以看到：

* 盒子总宽度 = `width` + `margin`;
* 盒子总高度 = `height` + `margin`;

也就是，`width/height` 包含了 `padding` 和 `border`值

> 页面渲染时，`dom` 元素所采用的 布局模型。可通过`box-sizing`进行设置

**通过 box-sizing 来改变元素的盒模型**

CSS 中的 `box-sizing` 属性定义了引擎应该如何计算一个元素的总宽度和总高度

* `box-sizing: content-box;` 默认的标准(W3C)盒模型元素效果，元素的 `width/height` 不包含`padding`，`border`，与标准盒子模型表现一致
* `box-sizing: border-box;` 触发怪异(IE)盒模型元素的效果，元素的 `width/height` 包含 `padding`，`border`，与怪异盒子模型表现一致
* `box-sizing: inherit;` 继承父元素 `box-sizing` 属性的值

**小结**

* 盒子模型构成：内容(`content`)、内填充(`padding`)、 边框(`border`)、外边距(`margin`)
* `IE8`及其以下版本浏览器，未声明 `DOCTYPE`，内容宽高会包含内填充和边框，称为怪异盒模型(`IE`盒模型)
* 标准(`W3C`)盒模型：元素宽度 = `width + padding + border + margin`
* 怪异(`IE`)盒模型：元素宽度 = `width + margin`
* 标准浏览器通过设置 css3 的 `box-sizing: border-box` 属性，触发“怪异模式”解析计算宽高

### BFC

> 块级格式化上下文，是一个独立的渲染区域，让处于 `BFC` 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。

> `IE`下为 `Layout`，可通过 `zoom:1` 触发

**触发条件:**

* 根元素，即HTML元素
* 绝对定位元素 `position: absolute/fixed`
* 行内块元素 `display`的值为`inline-block`、`table`、`flex`、`inline-flex`、`grid`、`inline-grid`
* 浮动元素：`float`值为`left`、`right`
* `overflow值`不为 `visible`，为 `auto`、`scroll`、`hidden`

**规则:**

1. 属于同一个 `BFC` 的两个相邻 `Box` 垂直排列
2. 属于同一个 `BFC` 的两个相邻 `Box` 的 `margin` 会发生重叠
3. `BFC` 中子元素的 `margin box` 的左边， 与包含块 (BFC) `border box`的左边相接触 (子元素 `absolute` 除外)

在CSS中，BFC代表"块级格式化上下文"（Block Formatting Context），是一个用于布局元素的概念。一个元素形成了BFC之后，会根据BFC的规则来进行布局和定位。在理解BFC中子元素的`margin box`与包含块（BFC）的`border box`相接触的概念时，可以考虑以下要点：

* **外边距折叠（Margin Collapsing）：** 在正常情况下，块级元素的外边距会折叠，即相邻元素的外边距会取两者之间的最大值，而不是简单相加。但是，当一个元素形成了BFC时，它的外边距不会和其内部的子元素的外边距折叠。
* **相邻边界情况：** BFC中子元素的`margin box`的左边会与包含块的`border box`的左边相接触，这意味着子元素的外边距不会穿过包含块的边界，从而保证布局的合理性。

下面是一个示例代码，帮助你更好地理解这个概念：

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="child">Child Element</div>
  </div>
</body>
</html>
```

CSS (`styles.css`):

```css
.container {
  border: 2px solid black; /* 包含块的边框 */
  overflow: hidden; /* 创建 BFC */
}

.child {
  margin: 20px; /* 子元素的外边距 */
  padding: 10px; /* 子元素的内边距 */
  background-color: lightgray;
}
```

在这个示例中，`.container`元素创建了一个BFC（通过设置`overflow: hidden;`），而`.child`是`.container`的子元素。由于`.child`的外边距和内边距，我们可以看到以下效果：

* `.child`元素的`margin box`的外边界会与`.container`的`border box`的左边界相接触，这意味着`.child`的外边距不会超出`.container`的边界。
* 由于`.container`创建了BFC，`.child`的外边距不会与`.container`的外边距折叠。

通过这个示例，你可以更好地理解BFC中子元素的`margin box`与包含块的`border box`之间的关系，以及BFC对布局的影响。

1. `BFC` 的区域不会与 `float` 的元素区域重叠
2. 计算 `BFC` 的高度时，浮动子元素也参与计算
3. 文字层不会被浮动层覆盖，环绕于周围

**应用:**

* 利用`2`：阻止`margin`重叠
* 利用`4`：自适应两栏布局
* 利用 `5` ，可以避免高度塌陷
* 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个`div`都位于同一个 `BFC` 区域之中)

**示例**

**1\. 防止margin重叠（塌陷）**

```css
<style>
    p {
      color: #f55;
      background: #fcc;
      width: 200px;
      line-height: 100px;
      text-align:center;
      margin: 100px;
    }
</style>
<body>
  <p>Haha</p >
  <p>Hehe</p >
</body>
```

![](https://s.poetries.top/uploads/2022/09/d8f4f47649805c27.png)

* 两个`p`元素之间的距离为`100px`，发生了`margin`重叠（塌陷），以最大的为准，如果第一个`P`的`margin`为`80`的话，两个`P`之间的距离还是`100`，以最大的为准。
* 同一个`BFC`的俩个相邻的盒子的`margin`会发生重叠
* 可以在`p`外面包裹一层容器，并触发这个容器生成一个`BFC`，那么两个`p`就不属于同一个`BFC`，则不会出现`margin`重叠

```html
<style>
    .wrap {
        overflow: hidden;// 新的BFC
    }
    p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 100px;
    }
</style>
<body>
    <p>Haha</p >
    <div class="wrap">
        <p>Hehe</p >
    </div>
</body>
```

这时候，边距则不会重叠：

![](https://s.poetries.top/uploads/2022/09/5d6156d0fd00e6da.png)

**2\. 清除内部浮动**

```html
<style>
    .par {
        border: 5px solid #fcc;
        width: 300px;
    }
 
    .child {
        border: 5px solid #f66;
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
      <div class="child"></div>
      <div class="child"></div>
    </div>
</body>
```

![](https://s.poetries.top/uploads/2022/09/f8eb06e196dd211b.png)

而`BFC`在计算高度时，浮动元素也会参与，所以我们可以触发`.par`元素生成`BFC`，则内部浮动元素计算高度时候也会计算

```css
.par {
    overflow: hidden;
}
```

![](https://s.poetries.top/uploads/2022/09/32984028a445dbc7.png)

**3\. 自适应多栏布局**

这里举个两栏的布局

```html
<style>
    body {
        width: 300px;
        position: relative;
    }
 
    .aside {
        width: 100px;
        height: 150px;
        float: left;
        background: #f66;
    }
 
    .main {
        height: 200px;
        background: #fcc;
    }
</style>
<body>
    <div class="aside"></div>
    <div class="main"></div>
</body>
```

![](https://s.poetries.top/uploads/2022/09/07acd0b2a466762f.png)

* 每个元素的左外边距与包含块的左边界相接触
* 因此，虽然`.aslide`为浮动元素，但是main的左边依然会与包含块的左边相接触，而`BFC`的区域不会与浮动盒子重叠
* 所以我们可以通过触发`main`生成`BFC`，以此适应两栏布局

```css
.main {
  overflow: hidden;
}
```

这时候，新的`BFC`不会与浮动的`.aside`元素重叠。因此会根据包含块的宽度，和`.aside`的宽度，自动变窄

![](https://s.poetries.top/uploads/2022/09/8749636e9068ae4a.png)

### 选择器权重计算方式

> !important > 内联样式 = 外联样式 > ID选择器 > 类选择器 = 伪类选择器 = 属性选择器 > 元素选择器 = 伪元素选择器 > 通配选择器 = 后代选择器 = 兄弟选择器

1. 属性后面加`!important`会覆盖页面内任何位置定义的元素样式
2. 作为`style`属性写在元素内的样式
3. `id`选择器
4. 类选择器
5. 标签选择器
6. 通配符选择器（`*`）
7. 浏览器自定义或继承

**同一级别：后写的会覆盖先写的**

> css选择器的解析原则：选择器定位DOM元素是从右往左的方向，这样可以尽早的过滤掉一些不必要的样式规则和元素

### 清除浮动

1. 在浮动元素后面添加 `clear:both` 的空 `div` 元素

```html
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
    <div style="clear:both"></div>
</div>
```

2. 给父元素添加 `overflow:hidden` 或者 `auto` 样式，触发`BFC`

```html
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>
```

```html
.container{
    width: 300px;
    background-color: #aaa;
    overflow:hidden;
    zoom:1;   /*IE6*/
}
```

3. 使用伪元素，也是在元素末尾添加一个点并带有 `clear: both` 属性的元素实现的。

```html
<div class="container clearfix">
    <div class="left"></div>
    <div class="right"></div>
</div>
```

```css
.clearfix{
    zoom: 1; /*IE6*/
}
.clearfix:after{
    content: ".";
    height: 0;
    clear: both;
    display: block;
    visibility: hidden;
}
```

> 推荐使用第三种方法，不会在页面新增div，文档结构更加清晰

### 垂直居中的方案

1. **利用绝对定位+transform**，设置 `left: 50%` 和 `top: 50%` 现将子元素左上角移到父元素中心位置，然后再通过 `translate` 来调整子元素的中心点到父元素的中心。该方法可以**不定宽高**

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

2. **利用绝对定位+margin:auto**，子元素所有方向都为 `0` ，将 `margin` 设置为 `auto` ，由于宽高固定，对应方向实现平分，该方法必须**盒子有宽高**

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
  margin: auto;
  height: 100px;
  width: 100px;
}
```

3. **利用绝对定位+margin:负值**，设置 `left: 50%` 和 `top: 50%` 现将子元素左上角移到父元素中心位置，然后再通过 `margin-left` 和 `margin-top` 以子元素自己的一半宽高进行负值赋值。该方法必须定宽高

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -100px;
}
```

4. **利用 flex** ，最经典最方便的一种了，不用解释，**定不定宽高无所谓**

```css
<style>
    .father {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 200px;
        background: skyblue;
    }
    .son {
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

5. **grid网格布局**

```html
<style>
.father {
  display: grid;
  align-items:center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: skyblue;

}
.son {
  width: 10px;
  height: 10px;
  border: 1px solid red
}
</style>
<div class="father">
  <div class="son"></div>
</div>
```

6. **table布局**

设置父元素为`display:table-cell`，子元素设置 `display: inline-block`。利用`vertical`和`text-align`可以让所有的行内块级元素水平垂直居中

```html
<style>
    .father {
        display: table-cell;
        width: 200px;
        height: 200px;
        background: skyblue;
        vertical-align: middle;
        text-align: center;
    }
    .son {
        display: inline-block;
        width: 100px;
        height: 100px;
        background: red;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```

**小结**

不知道元素宽高大小仍能实现水平垂直居中的方法有：

* `利用绝对定位+transform`
* `flex`布局
* `grid`布局

**根据元素标签的性质，可以分为：**

* 内联元素居中布局
* 块级元素居中布局

**内联元素居中布局**

* 水平居中
  * 行内元素可设置：`text-align: center`
  * `flex`布局设置父元素：`display: flex; justify-content: center`
* 垂直居中
  * 单行文本父元素确认高度：`height === line-height`
  * 多行文本父元素确认高度：`display: table-cell; vertical-align: middle`

**块级元素居中布局**

* 水平居中
  * 定宽: `margin: 0 auto`
  * `绝对定位+left:50%+margin:负自身一半`
* 垂直居中
  * `position: absolute`设置`left`、`top`、`margin-left`、`margin-top`(定高)
  * `display: table-cell`
  * `transform: translate(x, y)`
  * `flex`(不定高，不定宽)
  * `grid`(不定高，不定宽)，兼容性相对比较差

### CSS3的新特性

![](https://s.poetries.top/uploads/2022/09/29fc55febf95ee90.png)

**1\. 是什么**

css，即层叠样式表（Cascading Style Sheets）的简称，是一种标记语言，由浏览器解释执行用来使页面变得更美观

`css3`是css的最新标准，是向后兼容的，`CSS1/2`的特性在 `CSS3` 里都是可以使用的

而 `CSS3` 也增加了很多新特性，为开发带来了更佳的开发体验

**2\. 选择器**

`css3`中新增了一些选择器，主要为如下图所示：

![](https://s.poetries.top/uploads/2022/09/bfd8984363dc561d.png)

**3\. 新样式**

* **边框** `css3`新增了三个边框属性，分别是：
  * `border-radius`：创建圆角边框
  * `box-shadow`：为元素添加阴影
  * `border-image`：使用图片来绘制边框
* **box-shadow** 设置元素阴影，设置属性如下（其中水平阴影和垂直阴影是必须设置的）
  * 水平阴影
  * 垂直阴影
  * 模糊距离(虚实)
  * 阴影尺寸(影子大小)
  * 阴影颜色
  * 内/外阴影
* **背景** 新增了几个关于背景的属性，分别是`background-clip`、`background-origin`、`background-size`和`background-break`
  * **`background-clip`** 用于确定背景画区，有以下几种可能的属性：通常情况，背景都是覆盖整个元素的，利用这个属性可以设定背景颜色或图片的覆盖范围
    * `background-clip: border-box`; 背景从`border`开始显示
    * `background-clip: padding-box`; 背景从`padding`开始显示
    * `background-clip: content-box`; 背景显`content`区域开始显示
    * `background-clip: no-clip`; 默认属性，等同于b`order-box`
  * **`background-origin`** 当我们设置背景图片时，图片是会以左上角对齐，但是是以`border`的左上角对齐还是以`padding`的左上角或者`content`的左上角对齐? `border-origin`正是用来设置这个的
    * `background-origin: border-box`; 从`border`开始计算`background-position`
    * `background-origin: padding-box`; 从`padding`开始计算`background-position`
    * `background-origin: content-box`; 从`content`开始计算`background-position`
    * 默认情况是`padding-box`，即以`padding`的左上角为原点
  * **`background-size`** 常用来调整背景图片的大小，主要用于设定图片本身。有以下可能的属性：
    * `background-size: contain`; 缩小图片以适合元素（维持像素长宽比）
    * `background-size: cover`; 扩展元素以填补元素（维持像素长宽比）
    * `background-size: 100px 100px`; 缩小图片至指定的大小
    * `background-size: 50% 100%`; 缩小图片至指定的大小，百分比是相对包 含元素的尺寸
  * **`background-break`** 元素可以被分成几个独立的盒子（如使内联元素`span`跨越多行），`background-break` 属性用来控制背景怎样在这些不同的盒子中显示
    * `background-break: continuous`; 默认值。忽略盒之间的距离（也就是像元素没有分成多个盒子，依然是一个整体一样）
    * `background-break: bounding-box`; 把盒之间的距离计算在内；
    * `background-break: each-box`; 为每个盒子单独重绘背景
* **文字**
  * **`word-wrap: normal|break-word`**
    * `normal`：使用浏览器默认的换行
    * `break-all`：允许在单词内换行
  * **`text-overflow`** 设置或检索当当前行超过指定容器的边界时如何显示，属性有两个值选择
    * `clip`：修剪文本
    * `ellipsis`：显示省略符号来代表被修剪的文本
  * **`text-shadow`** 可向文本应用阴影。能够规定水平阴影、垂直阴影、模糊距离，以及阴影的颜色
  * **`text-decoration`** CSS3里面开始支持对文字的更深层次的渲染，具体有三个属性可供设置：
    * `text-fill-color`: 设置文字内部填充颜色
    * `text-stroke-color`: 设置文字边界填充颜色
    * `text-stroke-width`: 设置文字边界宽度
* **颜色**
  * `css3`新增了新的颜色表示方式`rgba`与`hsla`
  * `rgba`分为两部分，`rgb`为颜色值，`a`为透明度
  * `hala`分为四部分，`h`为色相，`s`为饱和度，`l`为亮度，`a`为透明度

**4\. transition 过渡**

`transition`属性可以被指定为一个或多个CSS属性的过渡效果，多个属性之间用逗号进行分隔，必须规定两项内容：

* 过度效果
* 持续时间

```js
transition： CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)
```

上面为简写模式，也可以分开写各个属性

```js
transition-property: width; 
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;
```

**5\. transform 转换**

* `transform`属性允许你旋转，缩放，倾斜或平移给定元素
* `transform-origin`：转换元素的位置（围绕那个点进行转换），默认值为`(x,y,z):(50%,50%,0)`

使用方式：

* `transform: translate(120px, 50%)`：位移
* `transform: scale(2, 0.5)`：缩放
* `transform: rotate(0.5turn)`：旋转
* `transform: skew(30deg, 20deg)`：倾斜

**6\. animation 动画**

动画这个平常用的也很多，主要是做一个预设的动画。和一些页面交互的动画效果，结果和过渡应该一样，让页面不会那么生硬

`animation`也有很多的属性

* `animation-name`：动画名称
* `animation-duration`：动画持续时间
* `animation-timing-function`：动画时间函数
* `animation-delay`：动画延迟时间
* `animation-iteration-count`：动画执行次数，可以设置为一个整数，也可以设置为infinite，意思是无限循环
* `animation-direction`：动画执行方向
* `animation-paly-state`：动画播放状态
* `animation-fill-mode`：动画填充模式

**7\. 渐变**

颜色渐变是指在两个颜色之间平稳的过渡，`css3`渐变包括

* `linear-gradient`：线性渐变 `background-image: linear-gradient(direction, color-stop1, color-stop2, ...)`;
* `radial-gradient`：径向渐变 `linear-gradient(0deg, red, green)`

**8\. 其他**

* `Flex`弹性布局
* `Grid`栅格布局
* 媒体查询 `@media screen and (max-width: 960px) {}`还有打印`print`

**transition和animation的区别**

> `Animation`和`transition`大部分属性是相同的，他们都是随时间改变元素的属性值，他们的主要区别是`transition`需要触发一个事件才能改变属性，而`animation`不需要触发任何事件的情况下才会随时间改变属性值，并且`transition`为2帧，从`from .... to`，而`animation`可以一帧一帧的

### CSS动画和过渡

常见的动画效果有很多，如`平移`、`旋转`、`缩放`等等，复杂动画则是多个简单动画的组合

**css实现动画的方式，有如下几种：**

* `transition` 实现渐变动画
* `transform` 转变动画
* `animation` 实现自定义动画

**1\. transition 实现渐变动画**

**transition的属性如下：**

* `transition-property:填写需要变化的css属性`
* `transition-duration:完成过渡效果需要的时间单位(s或者ms)默认是 0`
* `transition-timing-function:完成效果的速度曲线`
* `transition-delay: （规定过渡效果何时开始。默认是`0`）`

> 一般情况下，我们都是写一起的，比如：`transition： width 2s ease 1s`

其中`timing-function`的值有如下：

值

描述

`linear`

匀速（等于 `cubic-bezier(0,0,1,1)`）

`ease`

从慢到快再到慢（`cubic-bezier(0.25,0.1,0.25,1)`）

`ease-in`

慢慢变快（等于 `cubic-bezier(0.42,0,1,1)`）

`ease-out`

慢慢变慢（等于 `cubic-bezier(0,0,0.58,1)`）

`ease-in-out`

先变快再到慢（等于 `cubic-bezier(0.42,0,0.58,1)`），渐显渐隐效果

`cubic-bezier(*n*,*n*,*n*,*n*)`

在 `cubic-bezier` 函数中定义自己的值。可能的值是 `0` 至 `1` 之间的数值

注意：并不是所有的属性都能使用过渡的，如`display:none<->display:block`

举个例子，实现鼠标移动上去发生变化动画效果

```html
<style>
  .base {
    width: 100px;
    height: 100px;
    display: inline-block;
    background-color: #0EA9FF;
    border-width: 5px;
    border-style: solid;
    border-color: #5daf34;
    transition-property: width, height, background-color, border-width;
    transition-duration: 2s;
    transition-timing-function: ease-in;
    transition-delay: 500ms;
  }

  /*简写*/
  /*transition: all 2s ease-in 500ms;*/
  .base:hover {
    width: 200px;
    height: 200px;
    background-color: #5daf34;
    border-width: 10px;
    border-color: #3a8ee6;
  }
</style>
<div class="base"></div>
```

**2\. transform 转变动画**

包含四个常用的功能：

* `translate(x,y)`：位移
* `scale`：缩放
* `rotate`：旋转
* `skew`：倾斜

一般配合`transition`过度使用

> 注意的是，`transform`不支持`inline元`素，使用前把它变成`block`

举个例子

```html
<style>
.base {
  width: 100px;
  height: 100px;
  display: inline-block;
  background-color: #0EA9FF;
  border-width: 5px;
  border-style: solid;
  border-color: #5daf34;
  transition-property: width, height, background-color, border-width;
  transition-duration: 2s;
  transition-timing-function: ease-in;
  transition-delay: 500ms;
}
.base2 {
  transform: none;
  transition-property: transform;
  transition-delay: 5ms;
}
.base2:hover {
  transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
}
</style>
<div class="base base2"></div>
```

可以看到盒子发生了旋转，倾斜，平移，放大

**3\. animation 实现自定义动画**

> 一个关键帧动画，最少包含两部分，`animation` 属性及属性值（动画的名称和运行方式运行时间等）`@keyframes`（规定动画的具体实现过程）

`animation`是由 `8` 个属性的简写，分别如下：

属性

描述

属性值

`animation-duration`

指定动画完成一个周期所需要时间，单位秒（`s`）或毫秒（`ms`），默认是 `0`

`animation-timing-function`

指定动画计时函数，即动画的速度曲线，默认是 "`ease`"

`linear`、`ease`、`ease-in`、`ease-out`、`ease-in-out`

`animation-delay`

指定动画延迟时间，即动画何时开始，默认是 `0`

`animation-iteration-count`

指定动画播放的次数，默认是 `1`。但我们一般用`infinite`，一直播放

`animation-direction` 指定动画播放的方向

默认是 `normal`

`normal`、`reverse`、`alternate`、`alternate-reverse`

`animation-fill-mode`

指定动画填充模式。默认是 `none`

`forwards`、`backwards`、`both`

`animation-play-state`

指定动画播放状态，正在运行或暂停。默认是 `running`

`running`、`pauser`

`animation-name`

指定 `@keyframes` 动画的名称

`CSS` 动画只需要定义一些关键的帧，而其余的帧，浏览器会根据计时函数插值计算出来，

> `@keyframes`定义关键帧，可以是`from->to`（等同于`0%`和`100%`），也可以是从`0%->100%`之间任意个的分层设置

因此，如果我们想要让元素旋转一圈，只需要定义开始和结束两帧即可：

```css
@keyframes rotate{
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

> `from` 表示最开始的那一帧，`to` 表示结束时的那一帧

**也可以使用百分比刻画生命周期**

```css
@keyframes rotate{
  0%{
    transform: rotate(0deg);
  }
  50%{
    transform: rotate(180deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
```

定义好了关键帧后，下来就可以直接用它了：

```js
animation: rotate 2s;
```

**总结**

属性

含义

`transition（过度）`

用于设置元素的样式过度，和`animation`有着类似的效果，但细节上有很大的不同

`transform（变形）`

用于元素进行旋转、缩放、移动或倾斜，和设置样式的动画并没有什么关系，就相当于`color`一样用来设置元素的“外表”

`translate（移动）`

只是`transform`的一个属性值，即移动

`animation（动画）`

用于设置动画属性，他是一个简写的属性，包含`6`个属性

**4\. 用css3动画使一个图片旋转**

```js
#loader {
  display: block;
  position: relative;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

### 有哪些方式（CSS）可以隐藏页面元素

* `opacity:0`：本质上是将元素的透明度将为`0`，就看起来隐藏了，但是依然占据空间且可以交互
* `display:none`: 这个是彻底隐藏了元素，元素从文档流中消失，既不占据空间也不交互，也不影响布局
* `visibility:hidden`: 与上一个方法类似的效果，占据空间，但是不可以交互了
* `overflow:hidden`: 这个只隐藏元素溢出的部分，但是占据空间且不可交互
* `z-index:-9999`: 原理是将层级放到底部，这样就被覆盖了，看起来隐藏了
* `transform:scale(0,0)`: 平面变换，将元素缩放为`0`，但是依然占据空间，但不可交互

**display: none 与 visibility: hidden 的区别**

* 修改常规流中元素的`display`通常会造成文档重排。修改`visibility`属性只会造成本元素的重绘
* 读屏器不会读取`display:none`;元素内容；会读取`visibility:hidden;`元素内容
* `display:none`;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；`visibility:hidden`;不会让元素从渲染树消失，渲染时元素继续占据空间，只是内容不可见
* `display:none`;是非继承属性，**子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示**；`visibility:hidden;`是继承属性，**子孙节点消失由于继承了`hidden`，通过设置`visibility:visible;`可以让子孙节点显式**

### 说说em/px/rem/vh/vw区别

* 传统的项目开发中，我们只会用到`px`、`%`、`em`这几个单位，它可以适用于大部分的项目开发，且拥有比较良好的兼容性
* 从`CSS3`开始，浏览器对计量单位的支持又提升到了另外一个境界，新增了`rem`、`vh`、`vw`、`vm`等一些新的计量单位
* 利用这些新的单位开发出比较良好的响应式页面，适应多种不同分辨率的终端，包括移动设备等
* 在`css`单位中，可以分为长度单位、绝对单位，如下表所指示

**CSS单位**

相对长度单位

`em`、`ex`、`ch`、`rem`、`vw`、`vh`、`vmin`、`vmax`、`%`

绝对长度单位

`cm`、`mm`、`in`、`px`、`pt`、`pc`

这里我们主要讲述`px`、`em`、`rem`、`vh`、`vw`

**px**

`px`，表示像素，所谓像素就是呈现在我们显示器上的一个个小点，每个像素点都是大小等同的，所以像素为计量单位被分在了绝对长度单位中

有些人会把`px`认为是相对长度，原因在于在移动端中存在设备像素比，`px`实际显示的大小是不确定的

这里之所以认为`px`为绝对单位，在于`px`的大小和元素的其他属性无关

**em**

`em`是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸（`1em = 16px`）

为了简化 `font-size` 的换算，我们需要在`css`中的 `body` 选择器中声明`font-size`\= `62.5%`，这就使 em 值变为 `16px*62.5% = 10px`

这样 `12px = 1.2em`, `10px = 1em`, 也就是说只需要将你的原来的`px` 数值除以 10，然后换上 `em`作为单位就行了

特点：

* `em` 的值并不是固定的
* `em` 会继承父级元素的字体大小
* `em` 是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸
* 任意浏览器的默认字体高都是 `16px`

举个例子

```html
<div class="big">
  我是14px=1.4rem<div class="small">我是12px=1.2rem</div>
</div>
```

样式为

```html
<style>
    html {font-size: 10px;  } /*  公式16px*62.5%=10px  */  
    .big{font-size: 1.4rem}
    .small{font-size: 1.2rem}
</style>
```

这时候`.big`元素的`font-size`为`14px`，而`.small`元素的`font-size`为12px

**rem(常用)**

* 根据屏幕的分辨率动态设置`html`的文字大小，达到等比缩放的功能
* 保证`html`最终算出来的字体大小，不能小于`12px`
* 在不同的移动端显示不同的元素比例效果
* 如果`html`的`font-size:20px`的时候，那么此时的`1rem = 20px`
* 把设计图的宽度分成多少分之一，根据实际情况
* `rem`做盒子的宽度，`viewport`缩放

`head`加入常见的`meta`属性

```html
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<!--这个是关键-->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0，minimum-scale=1.0">
```

把这段代码加入`head`中的`script`预先加载

```js
// rem适配用这段代码动态计算html的font-size大小
(function(win) {
    var docEl = win.document.documentElement;
    var timer = '';

    function changeRem() {
      var width = docEl.getBoundingClientRect().width;
      if (width > 750) { // 750是设计稿大小
          width = 750;
      }
      var fontS = width / 10; // 把设备宽度十等分 1rem<=75px
      docEl.style.fontSize = fontS + "px";
    }
    win.addEventListener("resize", function() {
      clearTimeout(timer);
      timer = setTimeout(changeRem, 30);
    }, false);
    win.addEventListener("pageshow", function(e) {
      if (e.persisted) { //清除缓存
        clearTimeout(timer);
        timer = setTimeout(changeRem, 30);
      }
    }, false);
    changeRem();
})(window)
```

* 或者使用淘宝提供的库 [https://github.com/amfe/lib-flexible(opens new window)](https://github.com/amfe/lib-flexible)

```js
(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
```

**vh、vw**

`vw` ，就是根据窗口的宽度，分成`100`等份，`100vw`就表示满宽，`50vw`就表示一半宽。（`vw` 始终是针对窗口的宽），同理，`vh`则为窗口的高度

这里的窗口分成几种情况：

* 在桌面端，指的是浏览器的可视区域
* 移动端指的就是布局视口

像`vw`、`vh`，比较容易混淆的一个单位是`%`，不过百分比宽泛的讲是相对于父元素：

* 对于普通定位元素就是我们理解的父元素
* 对于`position: absolute;`的元素是相对于已定位的父元素
* 对于`position: fixed;`的元素是相对于 `ViewPort`（可视窗口）

**总结**

* **px**：绝对单位，页面按精确像素展示
* **%**：相对于父元素的宽度比例
* **em**：相对单位，基准点为父节点字体的大小，如果自身定义了`font-size`按自身来计算（浏览器默认字体是`16px`），整个页面内`1em`不是一个固定的值
* **rem**：相对单位，可理解为`root em`, 相对根节点`html`的字体大小来计算
* **vh、vw**：主要用于页面视口大小布局，在页面布局上更加方便简单
  * `vw`：屏幕宽度的`1%`
  * `vh`：屏幕高度的`1%`
  * `vmin`：取`vw`和`vh`中较小的那个（如：`10vh=100px 10vw=200px` 则`vmin=10vh=100px`）
  * `vmax`：取`vw`和`vh`中较大的那个（如：`10vh=100px 10vw=200px` 则`vmax=10vw=200px`）

### flex布局

很多时候我们会用到 `flex: 1` ，它具体包含了以下的意思

* `flex-grow: 1` ：该属性默认为 `0` ，如果存在剩余空间，元素也不放大。设置为 `1`  代表会放大。
* `flex-shrink: 1` ：该属性默认为 \`1 ，如果空间不足，元素缩小。
* `flex-basis: 0%` ：该属性定义在分配多余空间之前，元素占据的主轴空间。浏览器就是根据这个属性来计算是否有多余空间的。默认值为 `auto` ，即项目本身大小。设置为 `0%`  之后，因为有 `flex-grow`  和 `flex-shrink` 的设置会自动放大或缩小。在做两栏布局时，如果右边的自适应元素 `flex-basis`  设为`auto`  的话，其本身大小将会是 `0`

### 如果要做优化，CSS提高性能的方法有哪些？

实现方式有很多种，主要有如下：

* **内联首屏关键CSS**
  * 在打开一个页面，页面首要内容出现在屏幕的时间影响着用户的体验，而通过内联`css`关键代码能够使浏览器在下载完`html`后就能立刻渲染
  * 而如果外部引用`css`代码，在解析`html`结构过程中遇到外部`css`文件，才会开始下载`css`代码，再渲染
  * 所以，`CSS`内联使用使渲染时间提前
  * 注意：但是较大的`css`代码并不合适内联（初始拥塞窗口、没有缓存），而其余代码则采取外部引用方式
* **异步加载CSS**
  * 在CSS文件请求、下载、解析完成之前，CSS会阻塞渲染，浏览器将不会渲染任何已处理的内容
  * 前面加载内联代码后，后面的外部引用css则没必要阻塞浏览器渲染。这时候就可以采取异步加载的方案，主要有如下：

    * 使用javascript将`link`标签插到`head`标签最后

        ```js
        // 创建link标签
        const myCSS = document.createElement( "link" );
        myCSS.rel = "stylesheet";
        myCSS.href = "mystyles.css";
        // 插入到header的最后位置
        document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling )
        ```

    * 设置`link`标签`media`属性为`noexis`，浏览器会认为当前样式表不适用当前类型，会在不阻塞页面渲染的情况下再进行下载。加载完成后，将media的值设为`screen`或`all`，从而让浏览器开始解析CSS

        ```js
        <link rel="stylesheet" href="mystyles.css" media="noexist" onload="this.media='all'">
        ```

    * 通过`rel`属性将`link`元素标记为`alternate`可选样式表，也能实现浏览器异步加载。同样别忘了加载完成之后，将`rel`设回`stylesheet`

        ```js
        <link rel="alternate stylesheet" href="mystyles.css" onload="this.rel='stylesheet'">
        ```

* **资源压缩**
  * 利用`webpack`、`gulp/grunt`、`rollup`等模块化工具，将`css`代码进行压缩，使文件变小，大大降低了浏览器的加载时间
* **合理使用选择器**
  * css匹配的规则是从右往左开始匹配，例如`#markdown .content h3`匹配规则如下：
    * 先找到`h3`标签元素
    * 然后去除祖先不是`.content`的元素
    * 最后去除祖先不是`#markdown`的元素
  * 如果嵌套的层级更多，页面中的元素更多，那么匹配所要花费的时间代价自然更高
  * 所以我们在编写选择器的时候，可以遵循以下规则：
    * 不要嵌套使用过多复杂选择器，最好不要三层以上
    * 使用id选择器就没必要再进行嵌套
    * 通配符和属性选择器效率最低，避免使用
* **减少使用昂贵的属性**
  * 在页面发生重绘的时候，昂贵属性如`box-shadow/border-radius/filter/透明度/:nth-child`等，会降低浏览器的渲染性能
* **不要使用@import**
  * css样式文件有两种引入方式，一种是`link`元素，另一种是`@import`
  * `@import`会影响浏览器的并行下载，使得页面在加载时增加额外的延迟，增添了额外的往返耗时
  * 而且多个`@import`可能会导致下载顺序紊乱
  * 比如一个css文件`index.css`包含了以下内容：`@import url("reset.css")`
  * 那么浏览器就必须先把`index.css`下载、解析和执行后，才下载、解析和执行第二个文件`reset.css`
* **其他**
  * 减少重排操作，以及减少不必要的重绘
  * 了解哪些属性可以继承而来，避免对这些属性重复编写
  * `css Sprite`，合成所有`icon`图片，用宽高加上b`ackgroud-position`的背景图方式显现出我们要的`icon`图，减少了`http`请求
  * 把小的`icon`图片转成`base64`编码
  * CSS3动画或者过渡尽量使用`transform`和`opacity`来实现动画，不要使用`left`和`top`属性

### 画一条 0.5px 的线

* 采用 `meta viewport` 的方式 `<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`
* 采用 `border-image` 的方式
* 采用 `transform: scale()` 的方式

### 如何画一个三角形

三角形原理:边框的均分原理

```css
div {
  width:0px;
  height:0px;
  border-top:10px solid red; 
  border-right:10px solid transparent; 
  border-bottom:10px solid transparent; 
  border-left:10px solid transparent;
}
```

### 两栏布局：左边定宽，右边自适应方案

```html
<div class="box">
  <div class="box-left"></div>
  <div class="box-right"></div>
</div>
```

**利用float + margin实现**

```css
.box {
 height: 200px;
}

.box > div {
  height: 100%;
}

.box-left {
  width: 200px;
  float: left;
  background-color: blue;
}

.box-right {
  margin-left: 200px;
  background-color: red;
}
```

**利用calc计算宽度**

```css
.box {
 height: 200px;
}

.box > div {
  height: 100%;
}

.box-left {
  width: 200px;
  float: left;
  background-color: blue;
}

.box-right {
  width: calc(100% - 200px);
  float: right;
  background-color: red;
}
```

**利用float + overflow实现**

```css
.box {
 height: 200px;
}

.box > div {
  height: 100%;
}

.box-left {
  width: 200px;
  float: left;
  background-color: blue;
}

.box-right {
  overflow: hidden;
  background-color: red;
}
```

**利用flex实现**

```css
.box {
  height: 200px;
  display: flex;
}

.box > div {
  height: 100%;
}

.box-left {
  width: 200px;
  background-color: blue;
}

.box-right {
  flex: 1; // 设置flex-grow属性为1，默认为0
  background-color: red;
}
```

## 2 JavaScript

### typeof类型判断

> `typeof` 是否能正确判断类型？`instanceof` 能正确判断对象的原理是什么

* `typeof` 对于原始类型来说，除了 `null` 都可以显示正确的类型

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
```

> `typeof` 对于对象来说，除了函数都会显示 `object`，所以说 `typeof` 并不能准确判断变量到底是什么类型

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

> 如果我们想判断一个对象的正确类型，这时候可以考虑使用 `instanceof`，因为内部机制是通过原型链来判断的

```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str = 'hello world'
str instanceof String // false

var str1 = new String('hello world')
str1 instanceof String // true
```

> 对于原始类型来说，你想直接通过 `instanceof`来判断类型是不行的

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

**写一个getType函数，获取详细的数据类型**

* **获取类型**
  * 手写一个`getType`函数，传入任意变量，可准确获取类型
  * 如`number`、`string`、`boolean`等值类型
  * 引用类型`object`、`array`、`map`、`regexp`

```js
/**
 * 获取详细的数据类型
 * @param x x
 */
function getType(x) {
  const originType = Object.prototype.toString.call(x) // '[object String]'
  const spaceIndex = originType.indexOf(' ')
  const type = originType.slice(spaceIndex + 1, -1) // 'String' -1不要右边的]
  return type.toLowerCase() // 'string'
}
```

```js
// 功能测试
console.info( getType(null) ) // null
console.info( getType(undefined) ) // undefined
console.info( getType(100) ) // number
console.info( getType('abc') ) // string
console.info( getType(true) ) // boolean
console.info( getType(Symbol()) ) // symbol
console.info( getType({}) ) // object
console.info( getType([]) ) // array
console.info( getType(() => {}) ) // function
console.info( getType(new Date()) ) // date
console.info( getType(new RegExp('')) ) // regexp
console.info( getType(new Map()) ) // map
console.info( getType(new Set()) ) // set
console.info( getType(new WeakMap()) ) // weakmap
console.info( getType(new WeakSet()) ) // weakset
console.info( getType(new Error()) ) // error
console.info( getType(new Promise(() => {})) ) // promise
```

### 类型转换

> 首先我们要知道，在 `JS` 中类型转换只有三种情况，分别是：

* 转换为布尔值
* 转换为数字
* 转换为字符串

![](https://s.poetries.top/gitee/2020/07/1.png)

**转Boolean**

> 在条件判断时，除了 `undefined`，`null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象

**对象转原始类型**

> 对象在转换类型的时候，会调用内置的 `[[ToPrimitive]]` 函数，对于该函数来说，算法逻辑一般来说如下

* 如果已经是原始类型了，那就不需要转换了
* 调用 `x.valueOf()`，如果转换为基础类型，就返回转换的值
* 调用 `x.toString()`，如果转换为基础类型，就返回转换的值
* 如果都没有返回原始类型，就会报错

> 当然你也可以重写 `Symbol.toPrimitive`，该方法在转原始类型时调用优先级最高。

```js
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}
1 + a // => 3
```

**四则运算符**

> 它有以下几个特点：

* 运算中其中一方为字符串，那么就会把另一方也转换为字符串
* 如果一方不是字符串或者数字，那么会将它转换为数字或者字符串

```js
1 + '1' // '11'
true + true // 2
4 + [1,2,3] // "41,2,3"
```

* 对于第一行代码来说，触发特点一，所以将数字 `1` 转换为字符串，得到结果 `'11'`
* 对于第二行代码来说，触发特点二，所以将 `true` 转为数字 `1`
* 对于第三行代码来说，触发特点二，所以将数组通过 `toString`转为字符串 `1,2,3`，得到结果 `41,2,3`

> 另外对于加法还需要注意这个表达式 `'a' + + 'b'`

```js
'a' + + 'b' // -> "aNaN"
```

* 因为 `+ 'b'` 等于 `NaN`，所以结果为 `"aNaN"`，你可能也会在一些代码中看到过 `+ '1'`的形式来快速获取 `number` 类型。
* 那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字

```js
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```

**比较运算符**

* 如果是对象，就通过 `toPrimitive` 转换对象
* 如果是字符串，就通过 `unicode` 字符索引来比较

```js
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  }
}
a > -1 // true
```

> 在以上代码中，因为 `a` 是对象，所以会通过 `valueOf` 转换为原始类型再比较值。

### 闭包

> 闭包的定义其实很简单：函数 `A` 内部有一个函数 `B`，函数 `B` 可以访问到函数 `A` 中的变量，那么函数 `B` 就是闭包

```js
function A() {
  let a = 1
  window.B = function () {
    console.log(a)
  }
}
A()
B() // 1
```

**闭包存在的意义就是让我们可以间接访问函数内部的变量**

> 经典面试题，循环中使用闭包解决 `var` 定义函数的问题

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}

```

> 首先因为 `setTimeout` 是个异步函数，所以会先把循环全部执行完毕，这时候 `i`就是 `6` 了，所以会输出一堆 `6`

**解决办法有三种**

1. 第一种是使用闭包的方式

```js
for (var i = 1; i <= 5; i++) {
  ;(function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}
```

> 在上述代码中，我们首先使用了立即执行函数将 `i` 传入函数内部，这个时候值就被固定在了参数 `j` 上面不会改变，当下次执行 `timer` 这个闭包的时候，就可以使用外部函数的变量 `j`，从而达到目的

2. 第二种就是使用 `setTimeout` 的第三个参数，这个参数会被当成 `timer` 函数的参数传入

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j)
    },
    i * 1000,
    i
  )
}
```

3. 第三种就是使用 `let` 定义 `i` 了来解决问题了，这个也是最为推荐的方式

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

### 原型与原型链

**原型关系**

* 每个`class`都有显示原型`prototype`
* 每个实例都有隐式原型`__proto__`
* 实例的`__proto__`指向`class`的`prototype`

![](https://s.poetries.top/uploads/2023/02/6c4e92a507491e75.png)

```js
// 父类
class People {
    constructor(name) {
      this.name = name
    }
    eat() {
      console.log(`${this.name} eat something`)
    }
}

// 子类
class Student extends People {
  constructor(name, number) {
    super(name)
    this.number = number
  }
  sayHi() {
    console.log(`姓名 ${this.name} 学号 ${this.number}`)
  }
}

// 实例
const xialuo = new Student('夏洛', 100)
console.log(xialuo.name)
console.log(xialuo.number)
xialuo.sayHi()
xialuo.eat()
```

**基于原型的执行规则**

获取属性`xialuo.name`或执行方法`xialuo.sayhi`时，先在自身属性和方法查找，找不到就去`__proto__`中找

**原型链**

```js
People.prototype === Student.prototype.__proto__
```

![](https://s.poetries.top/uploads/2023/02/bc261ce998487d1e.png)

### 原型继承和 Class 继承

> 涉及面试题：原型如何实现继承？`Class` 如何实现继承？`Class` 本质是什么？

首先先来讲下 `class`，其实在 `JS`中并不存在类，`class` 只是语法糖，本质还是函数

```js
class Person {}
Person instanceof Function // true
```

**组合继承**

> 组合继承是最常用的继承方式

```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}
function Child(value) {
  Parent.call(this, value)
}
Child.prototype = new Parent()

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

* 以上继承的方式核心是在子类的构造函数中通过 `Parent.call(this)` 继承父类的属性，然后改变子类的原型为 `new Parent()` 来继承父类的函数。
* 这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费

**寄生组合继承**

> 这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了构造函数，我们只需要优化掉这点就行了

```js
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}

function Child(value) {
  Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

> 以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。

**Class 继承**

> 以上两种继承方式都是通过原型去解决的，在 `ES6` 中，我们可以使用 `class` 去实现继承，并且实现起来很简单

```js
class Parent {
  constructor(value) {
    this.val = value
  }
  getValue() {
    console.log(this.val)
  }
}
class Child extends Parent {
  constructor(value) {
    super(value)
    this.val = value
  }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

> `class` 实现继承的核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，因为这段代码可以看成 `Parent.call(this, value)`。

### 模块化

> 涉及面试题：为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？

使用一个技术肯定是有原因的，那么使用模块化可以给我们带来以下好处

* 解决命名冲突
* 提供复用性
* 提高代码可维护性

**立即执行函数**

> 在早期，使用立即执行函数实现模块化是常见的手段，通过函数作用域解决了命名冲突、污染全局作用域的问题

```js
(function(globalVariable){
   globalVariable.test = function() {}
   // ... 声明各种变量、函数都不会污染全局作用域
})(globalVariable)
```

**AMD 和 CMD**

> 鉴于目前这两种实现方式已经很少见到，所以不再对具体特性细聊，只需要了解这两者是如何使用的。

```js
// AMD
define(['./a', './b'], function(a, b) {
  // 加载模块完毕可以使用
  a.do()
  b.do()
})
// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a')
  a.doSomething()
})
```

**CommonJS**

> `CommonJS` 最早是 `Node` 在使用，目前也仍然广泛使用，比如在 `Webpack` 中你就能见到它，当然目前在 `Node` 中的模块管理已经和 `CommonJS`有一些区别了

```js
// a.js
module.exports = {
    a: 1
}
// or
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```

```js
ar module = require('./a.js')
module.a
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
    a: 1
}
```

```js
// module 基本实现
var module = {
  id: 'xxxx', // 我总得知道怎么去找到他吧
  exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function (module) {
  // 导出的东西
  var a = 1
  module.exports = a
  return module.exports
};
// 然后当我 require 的时候去找到独特的id，然后将要使用的东西用立即执行函数包装下，over
```

> 虽然 `exports` 和 `module.exports` 用法相似，但是不能对 `exports` 直接赋值。因为 `var exports = module.exports` 这句代码表明了 `exports` 和 `module.exports`享有相同地址，通过改变对象的属性值会对两者都起效，但是**如果直接对 `exports` 赋值就会导致两者不再指向同一个内存地址，修改并不会对 `module.exports` 起效**

**ES Module**

> `ES Module` 是原生实现的模块化方案，与 `CommonJS` 有以下几个区别

1. `CommonJS` 支持动态导入，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
2. `CommonJS` 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
3. `CommonJS` 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 `ES Module` 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
4. `ES Module` 会编译成 `require/exports`来执行的

```js
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
```

### 事件机制

> 涉及面试题：事件的触发过程是怎么样的？知道什么是事件代理嘛？

**1\. 事件触发三阶段**

**事件触发有三个阶段**：

* `window`往事件触发处传播，遇到注册的捕获事件会触发
* 传播到事件触发处时触发注册的事件
* 从事件触发处往 `window` 传播，遇到注册的冒泡事件会触发

> 事件触发一般来说会按照上面的顺序进行，但是也有特例，如果给一个 `body` 中的子节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行

```js
// 以下会先打印冒泡然后是捕获
node.addEventListener(
  'click',
  event => {
    console.log('冒泡')
  },
  false
)
node.addEventListener(
  'click',
  event => {
    console.log('捕获 ')
  },
  true
)
```

**2\. 注册事件**

> 通常我们使用 `addEventListener` 注册事件，该函数的第三个参数可以是布尔值，也可以是对象。对于布尔值 `useCapture` 参数来说，该参数默认值为 `false` ，`useCapture` 决定了注册的事件是捕获事件还是冒泡事件。对于对象参数来说，可以使用以下几个属性

* `capture`：布尔值，和 `useCapture` 作用一样
* `once`：布尔值，值为 `true` 表示该回调只会调用一次，调用后会移除监听
* `passive`：布尔值，表示永远不会调用 `preventDefault`

> 一般来说，如果我们只希望事件只触发在目标上，这时候可以使用 `stopPropagation`来阻止事件的进一步传播。通常我们认为 `stopPropagation` 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。`stopImmediatePropagation` 同样也能实现阻止事件，但是还能阻止该事件目标执行别的注册事件。

```js
node.addEventListener(
  'click',
  event => {
    event.stopImmediatePropagation()
    console.log('冒泡')
  },
  false
)
// 点击 node 只会执行上面的函数，该函数不会执行
node.addEventListener(
  'click',
  event => {
    console.log('捕获 ')
  },
  true
)
```

**3\. 事件代理**

> 如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上

```js
<ul id="ul">
 <li>1</li>
    <li>2</li>
 <li>3</li>
 <li>4</li>
 <li>5</li>
</ul>
<script>
 let ul = document.querySelector('#ul')
 ul.addEventListener('click', (event) => {
  console.log(event.target);
 })
</script>
```

**事件代理的方式相较于直接给目标注册事件来说，有以下优点**：

* 节省内存
* 不需要给子节点注销事件

### 箭头函数

* 箭头函数不绑定 `arguments`，可以使用 `...args` 代替
* 箭头函数没有 `prototype` 属性，不能进行 `new` 实例化
* 箭头函数不能通过 `call`、`apply` 等绑定 `this`，因为箭头函数底层是使用`bind`永久绑定`this`了，`bind`绑定过的`this`不能修改
* 箭头函数的`this`指向创建时父级的`this`
* 箭头函数不能使用`yield`关键字，不能作为`Generator`函数

```js
const fn1 = () => {
  // 箭头函数中没有arguments
  console.log('arguments', arguments)
}
fn1(100, 300)

const fn2 = () => {
  // 这里的this指向window，箭头函数的this指向创建时父级的this
  console.log('this', this)
}
// 箭头函数不能修改this
fn2.call({x: 100})

const obj = {
  name: 'poetry',
  getName2() {
    // 这里的this指向obj
    return () => {
      // 这里的this指向obj
      return this.name
    }
  },
  getName: () => { // 1、不适用箭头函数的场景1：对象方法
    // 这里不能使用箭头函数，否则箭头函数指向window
    return this.name
  }
}

obj.prototype.getName3 = () => { // 2、不适用箭头函数的场景2：对象原型
  // 这里不能使用箭头函数，否则this指向window
  return this.name
}

const Foo = (name) => { // 3、不适用箭头函数的场景3：构造函数
  this.name = name
}
const f = new Foo('poetry') // 箭头函数没有 prototype 属性，不能进行 new 实例化

const btn1 = document.getElementById('btn1')
btn1.addEventListener('click',()=>{ // 4、不适用箭头函数的场景4：动态上下文的回调函数
  // 这里不能使用箭头函数 this === window
  this.innerHTML = 'click'
})

// Vue 组件本质上是一个 JS 对象，this需要指向组件实例
// vue的生命周期和method不能使用箭头函数
new Vue({
  data:{name:'poetry'},
  methods: { // 5、不适用箭头函数的场景5：vue的生命周期和method
    getName: () => {
      // 这里不能使用箭头函数，否则this指向window
      return this.name
    }
  },
  mounted:() => {
    // 这里不能使用箭头函数，否则this指向window
    this.getName()
  }
})

// React 组件（非 Hooks）它本质上是一个 ES6 class
class Foo {
  constructor(name) {
    this.name = name
  }
  getName = () => { // 这里的箭头函数this指向实例本身没有问题的
    return this.name
  }
}
const f = new Foo('poetry') 
console.log(f.getName() )
```

**总结：不适用箭头函数的场景**

* 场景1：对象方法
* 场景2：对象原型
* 场景3：构造函数
* 场景4：动态上下文的回调函数
* 场景5：vue的生命周期和`method`

### JS内存泄露如何检测？场景有哪些？

**内存泄漏**：当一个对象不再被使用，但是由于某种原因，它的内存没有被释放，这就是内存泄漏。

**1\. 垃圾回收机制**

* 对于在JavaScript中的字符串，对象，数组是没有固定大小的，只有当对他们进行动态分配存储时，解释器就会分配内存来存储这些数据，当JavaScript的解释器消耗完系统中所有可用的内存时，就会造成系统崩溃。
* 内存泄漏，在某些情况下，不再使用到的变量所占用内存没有及时释放，导致程序运行中，内存越占越大，极端情况下可以导致系统崩溃，服务器宕机。
* JavaScript有自己的一套垃圾回收机制，JavaScript的解释器可以检测到什么时候程序不再使用这个对象了（数据），就会把它所占用的内存释放掉。
* 针对JavaScript的垃圾回收机制有以下两种方法（常用）：标记清除（现代），引用计数（之前）

**有两种垃圾回收策略：**

* **标记清除**：标记阶段即为所有活动对象做上标记，清除阶段则把没有标记（也就是非活动对象）销毁。
* **引用计数**：它把对象是否不再需要简化定义为对象有没有其他对象引用到它。如果没有引用指向该对象（引用计数为 `0`），对象将被垃圾回收机制回收

**标记清除的缺点：**

* **内存碎片化**，空闲内存块是不连续的，容易出现很多空闲内存块，还可能会出现分配所需内存过大的对象时找不到合适的块。
* **分配速度慢**，因为即便是使用 `First-fit` 策略，其操作仍是一个 `O(n)` 的操作，最坏情况是每次都要遍历到最后，同时因为碎片化，大对象的分配效率会更慢。

> 解决以上的缺点可以使用 **标记整理（Mark-Compact）算法** 标记结束后，标记整理算法会将活着的对象（即不需要清理的对象）向内存的一端移动，最后清理掉边界的内存（如下图）

![](https://s.poetries.top/uploads/2022/08/9ab816979f615b6e.png)

**引用计数的缺点：**

* 需要一个计数器，所占内存空间大，因为我们也不知道被引用数量的上限。
* `解决不了循环引用导致的无法回收问题`
  * `IE 6、7`，`JS`对象和`DOM`对象循环引用，清除不了，导致内存泄露

> `V8` 的垃圾回收机制也是基于标记清除算法，不过对其做了一些优化。

* 针对新生区采用并行回收。
* 针对老生区采用增量标记与惰性回收

> **注意**：`闭包不是内存泄露，闭包的数据是不可以被回收的`

**拓展：WeakMap、WeakMap的作用**

* 作用是`防止内存泄露的`
* `WeakMap`、`WeakMap`的应用场景
  * 想临时记录数据或关系
  * 在`vue3`中大量使用了`WeakMap`
* `WeakMap`的`key`只能是对象，不能是基本类型

**2\. 如何检测内存泄露**

内存泄露模拟

```js
<p>
  memory change
  <button id="btn1">start</button>
</p>

<script>
    const arr = []
    for (let i = 0; i < 10 * 10000; i++) {
      arr.push(i)
    }

    function bind() {
      // 模拟一个比较大的数据
      const obj = {
        str: JSON.stringify(arr) // 简单的拷贝
      }

      window.addEventListener('resize', () => {
        console.log(obj)
      })
    }

    let n = 0
    function start() {
      setTimeout(() => {
        bind()
        n++

        // 执行 50 次
        if (n < 50) {
          start()
        } else {
          alert('done')
        }
      }, 200)
    }

    document.getElementById('btn1').addEventListener('click', () => {
      start()
    })
</script>
```

打开开发者工具，选择 `Performance`，点击 `Record`，然后点击 `Stop`，在 `Memory` 选项卡中可以看到内存的使用情况。

![](https://s.poetries.top/uploads/2023/01/b8ae23cbae7287dc.png) ![](https://s.poetries.top/uploads/2023/01/d61278c2d0d42926.png) ![](https://s.poetries.top/uploads/2023/01/eafc2ab966c30f92.png)

**3\. 内存泄露的场景（Vue为例）**

* 被全局变量、函数引用，组件销毁时未清除
* 被全局事件、定时器引用，组件销毁时未清除
* 被自定义事件引用，组件销毁时未清除

```js
<template>
  <p>Memory Leak Demo</p>
</template>

<script>
export default {
  name: 'Memory Leak Demo',
  data() {
    return {
      arr: [10, 20, 30], // 数组 对象
    }
  },
  methods: {
    printArr() {
      console.log(this.arr)
    }
  },
  mounted() {
    // 全局变量
    window.arr = this.arr
    window.printArr = ()=>{
      console.log(this.arr)
    }

    // 定时器
    this.intervalId = setInterval(() => {
      console.log(this.arr)
    }, 1000)

    // 全局事件
    window.addEventListener('resize', this.printArr)
    // 自定义事件也是这样
  },
  // Vue2是beforeDestroy
  beforeUnmount() {
    // 清除全局变量
    window.arr = null
    window.printArr = null

    // 清除定时器
    clearInterval(this.intervalId)

    // 清除全局事件
    window.removeEventListener('resize', this.printArr)
  },
}
</script>
```

**4\. 拓展 WeakMap WeakSet**

`weakmap` 和 `weakset` 都是弱引用，不会阻止垃圾回收机制回收对象。

```js
const map = new Map() 
function fn1() {
  const obj = { x: 100 }
  map.set('a', obj) // fn1执行完 map还引用着obj
}
fn1()
```

```js
const wMap = new WeakMap() // 弱引用
function fn1() {
  const obj = { x: 100 }
  // fn1执行完 obj会被清理掉
  wMap.set(obj, 100) // weakMap 的 key 只能是引用类型，字符串数字都不行
}
fn1()
```

### async/await异步总结

**知识点总结**

* `promise.then`链式调用，但也是基于回调函数
* `async/await`是同步语法，彻底消灭回调函数

**async/await和promise的关系**

* 执行`async`函数，返回的是`promise`

```js
async function fn2() {
  return new Promise(() => {})
}
console.log( fn2() )

async function fn1() {
  return 100
}
console.log( fn1() ) // 相当于 Promise.resolve(100)
```

* `await`相当于`promise`的`then`
* `try catch`可捕获异常，代替了`promise`的`catch`
* `await` 后面跟 `Promise` 对象：会阻断后续代码，等待状态变为 `fulfilled` ，才获取结果并继续执行
* `await` 后续跟非 `Promise` 对象：会直接返回

```js
(async function () {
  const p1 = new Promise(() => {})
  await p1
  console.log('p1') // 不会执行
})()

(async function () {
  const p2 = Promise.resolve(100)
  const res = await p2
  console.log(res) // 100
})()

(async function () {
  const res = await 100
  console.log(res) // 100
})()

(async function () {
  const p3 = Promise.reject('some err') // rejected状态，不会执行下面的then
  const res = await p3 // await 相当于then
  console.log(res) // 不会执行
})()
```

* `try...catch` 捕获 `rejected` 状态

```js
(async function () {
    const p4 = Promise.reject('some err')
    try {
      const res = await p4
      console.log(res)
    } catch (ex) {
      console.error(ex)
    }
})()
```

**总结来看：**

* `async` 封装 `Promise`
* `await` 处理 `Promise` 成功
* `try...catch` 处理 `Promise` 失败

**异步本质**

`await` 是同步写法，但本质还是异步调用。

```js
async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end') // 关键在这一步，它相当于放在 callback 中，最后执行
  // 类似于Promise.resolve().then(()=>console.log('async1 end'))
}

async function async2 () {
  console.log('async2')
}

console.log('script start')
async1()
console.log('script end')

// 打印
// script start
// async1 start
// async2
// script end
// async1 end
```

```js
async function async1 () {
  console.log('async1 start') // 2
  await async2()

  // await后面的下面三行都是异步回调callback的内容
  console.log('async1 end') // 5 关键在这一步，它相当于放在 callback 中，最后执行
  // 类似于Promise.resolve().then(()=>console.log('async1 end'))
  await async3()
  
  // await后面的下面1行都是异步回调callback的内容
  console.log('async1 end2') // 7
}

async function async2 () {
  console.log('async2') // 3
}
async function async3 () {
  console.log('async3') // 6
}

console.log('script start') // 1
async1()
console.log('script end') // 4
```

> 即，只要遇到了 `await` ，后面的代码都相当于放在 `callback`(微任务) 里。

**执行顺序问题**

网上很经典的面试题

```js
async function async1 () {
  console.log('async1 start')
  await async2() // 这一句会同步执行，返回 Promise ，其中的 `console.log('async2')` 也会同步执行
  console.log('async1 end') // 上面有 await ，下面就变成了“异步”，类似 cakkback 的功能（微任务）
}

async function async2 () {
  console.log('async2')
}

console.log('script start')

setTimeout(function () { // 异步，宏任务
  console.log('setTimeout')
}, 0)

async1()

new Promise (function (resolve) { // 返回 Promise 之后，即同步执行完成，then 是异步代码
  console.log('promise1') // Promise 的函数体会立刻执行
  resolve()
}).then (function () { // 异步，微任务
  console.log('promise2')
})

console.log('script end')

// 同步代码执行完之后，屡一下现有的异步未执行的，按照顺序
// 1. async1 函数中 await 后面的内容 —— 微任务（先注册先执行）
// 2. setTimeout —— 宏任务（先注册先执行）
// 3. then —— 微任务

// 同步代码执行完毕（event loop - call stack被清空）
// 执行微任务
// 尝试DOM渲染
// 触发event loop执行宏任务

// 输出
// script start 
// async1 start  
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

**关于for...of**

* `for in`以及`forEach`都是常规的同步遍历
* `for of`用于异步遍历

```js
// 定时算乘法
function multi(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

// 使用 forEach ，是 1s 之后打印出所有结果，即 3 个值是一起被计算出来的
function test1 () {
  const nums = [1, 2, 3];
  nums.forEach(async x => {
    const res = await multi(x);
    console.log(res); // 一次性打印
  })
}
test1();

// 使用 for...of ，可以让计算挨个串行执行
async function test2 () {
  const nums = [1, 2, 3];
  for (let x of nums) {
    // 在 for...of 循环体的内部，遇到 await 会挨个串行计算
    const res = await multi(x)
    console.log(res) // 依次打印
  }
}
test2()
```

### Promise异步总结

**知识点总结**

* **三种状态**
  * `pending`、`fulfilled`(通过`resolve`触发)、`rejected`(通过`reject`触发)
  * `pending => fulfilled`或者`pending => rejected`
  * 状态变化不可逆
* **状态的表现和变化**
  * `pending`状态，不会触发`then`和`catch`
  * `fulfilled`状态会触发后续的`then`回调
  * `rejected`状态会触发后续的`catch`回调
* **then和catch对状态的影响（重要）**

  * `then`正常返回`fulfilled`，里面有报错返回`rejected`

    ```js
    const p1 = Promise.resolve().then(()=>{
      return 100
    })
    console.log('p1', p1) // fulfilled会触发后续then回调
    p1.then(()=>{
      console.log(123)
    }) // 打印123
    
    const p2 = Promise.resolve().then(()=>{
      throw new Error('then error')
    })
    // p2是rejected会触发后续catch回调
    p2.then(()=>{
      console.log(456)
    }).catch(err=>{
      console.log(789)
    })
    // 打印789
    ```

  * `catch`正常返回`fulfilled`，里面有报错返回`rejected`

    ```js
    const p1 = Promise.reject('my error').catch(()=>{
      console.log('catch error')
    })
    p1.then(()=>{
      console.log(1)
    })
    // console.log(p1) p1返回fulfilled 触发then回调
    const p2 = Promise.reject('my error').catch(()=>{
      throw new Error('catch error')
    })
    // console.log(p2) p2返回rejected 触发catch回调
    p2.then(()=>{
      console.log(2)
    }).catch(()=>{
      console.log(3)
    })
    ```

**promise then和catch的链接**

```js
// 第一题
Promise.resolve()
.then(()=>console.log(1))// 状态返回fulfilled
.catch(()=>console.log(2)) // catch中没有报错，状态返回fulfilled，后面的then会执行
.then(()=>console.log(3)) // 1,3
// 整个执行完没有报错，状态返回fulfilled

// 第二题
Promise.resolve()
.then(()=>{ // then中有报错 状态返回rejected,后面的catch会执行
  console.log(1)
  throw new Error('error')
})
.catch(()=>console.log(2)) // catch中没有报错，状态返回fulfilled，后面的then会执行
.then(()=>console.log(3)) // 1,2,3
// 整个执行完没有报错，状态返回fulfilled

// 第三题
Promise.resolve()
.then(()=>{//then中有报错 状态返回rejected，后面的catch会执行
  console.log(1)
  throw new Error('error')
})
.catch(()=>console.log(2)) // catch中没有报错，状态返回fulfilled，后面的catch不会执行
.catch(()=>console.log(3)) // 1，2
// 整个执行完没有报错，状态返回fulfilled
```

### Event Loop执行机制过程

![](https://s.poetries.top/uploads/2023/02/4fdc86445fa2367b.png) ![](https://s.poetries.top/uploads/2023/02/0c93d362749fe612.png) ![](https://s.poetries.top/uploads/2023/02/facd54cb3df73dd0.png)

* 同步代码一行行放到`Call Stack`执行，执行完就出栈
* 遇到异步优先记录下，等待时机（定时、网络请求）
* 时机到了就移动到`Call Queue`(宏任务队列)
  * 如果遇到微任务（如`promise.then`）放到微任务队列
  * 宏任务队列和微任务队列是分开存放的
    * 因为微任务是`ES6`语法规定的
    * 宏任务(`setTimeout`)是浏览器规定的
* 如果`Call Stack`为空，即同步代码执行完，`Event Loop`开始工作
  * `Call Stack`为空，尝试先`DOM`渲染，在触发下一次`Event Loop`
* 轮询查找`Event Loop`，如有则移动到`Call Stack`
* 然后继续重复以上过程（类似永动机）

**DOM事件和Event Loop**

> `DOM`事件会放到`Web API中`等待用户点击，放到`Call Queue`，在移动到`Call Stack`执行

![](https://s.poetries.top/uploads/2023/02/181bf0446f68007f.png)

* `JS`是单线程的，异步(`setTimeout`、`Ajax`)使用回调，基于`Event Loop`
* `DOM`事件也使用回调，`DOM`事件非异步，但也是基于`Event Loop`实现

**宏任务和微任务**

* **介绍**

  * 宏任务：`setTimeout` 、`setInterval` 、`DOM`事件、`Ajax`
  * 微任务：`Promise.then`、`async/await`
  * 微任务比宏任务执行的更早

    ```js
    console.log(100)
    setTimeout(() => {
      console.log(200)
    })
    Promise.resolve().then(() => {
      console.log(300)
    })
    console.log(400)
    // 100 400 300 200
    ```

* **event loop 和 DOM 渲染**

  * 每次`call stack`清空（每次轮询结束），即同步代码执行完。都是`DOM`重新渲染的机会，`DOM`结构如有改变重新渲染
  * 再次触发下一次`Event Loop`

    ```js
    const $p1 = $('<p>一段文字</p>')
    const $p2 = $('<p>一段文字</p>')
    const $p3 = $('<p>一段文字</p>')
    $('#container')
                .append($p1)
                .append($p2)
                .append($p3)
    
    console.log('length',  $('#container').children().length )
    alert('本次 call stack 结束，DOM 结构已更新，但尚未触发渲染')
    // （alert 会阻断 js 执行，也会阻断 DOM 渲染，便于查看效果）
    // 到此，即本次 call stack 结束后（同步任务都执行完了），浏览器会自动触发渲染，不用代码干预
    
    // 另外，按照 event loop 触发 DOM 渲染时机，setTimeout 时 alert ，就能看到 DOM 渲染后的结果了
    setTimeout(function () {
      alert('setTimeout 是在下一次 Call Stack ，就能看到 DOM 渲染出来的结果了')
    })
    ```

* **宏任务和微任务的区别**

  * 宏任务：`DOM` 渲染后再触发，如`setTimeout`
  * 微任务：`DOM` 渲染前会触发，如`Promise`

    ```js
    // 修改 DOM
    const $p1 = $('<p>一段文字</p>')
    const $p2 = $('<p>一段文字</p>')
    const $p3 = $('<p>一段文字</p>')
    $('#container')
        .append($p1)
        .append($p2)
        .append($p3)
    
    // 微任务：渲染之前执行（DOM 结构已更新，看不到元素还没渲染）
    // Promise.resolve().then(() => {
    //     const length = $('#container').children().length
    //     alert(`micro task ${length}`) // DOM渲染了？No
    // })
    
    // 宏任务：渲染之后执行（DOM 结构已更新，可以看到元素已经渲染）
    setTimeout(() => {
      const length = $('#container').children().length
      alert(`macro task ${length}`) // DOM渲染了？Yes
    })
    ```

> 再深入思考一下：为何两者会有以上区别，一个在渲染前，一个在渲染后？

* **微任务**：`ES` 语法标准之内，`JS` 引擎来统一处理。即，不用浏览器有任何干预，即可一次性处理完，更快更及时。
* **宏任务**：`ES` 语法没有，`JS` 引擎不处理，浏览器（或 `nodejs`）干预处理。

![](https://s.poetries.top/uploads/2023/02/facd54cb3df73dd0.png)

总结：正确的一次 Event loop 顺序是这样

* 执行同步代码，这属于宏任务
* 执行栈为空，查询是否有微任务需要执行
* 执行所有微任务
* 必要的话渲染 `UI`
* 然后开始下一轮 `Event loop`，执行宏任务中的异步代码

> 通过上述的 `Event loop` 顺序可知，如果宏任务中的异步代码有大量的计算并且需要操作 `DOM` 的话，为了更快的响应界面响应，我们可以把操作 `DOM` 放入微任务中

## 3 浏览器

### 储存

### 浏览器缓存机制

### 从输入URL 到网页显示的完整过程

### 常见的web前端攻击方式有哪些

### 跨域方案

### 移动端H5点击有300ms延迟，该如何解决

### 如何实现网页多标签tab通讯

### requestIdleCallback和requestAnimationFrame有什么区别

### script标签的defer和async有什么区别

## 4 Vue2

### 响应式原理

### vdom和diff算法

### 模板编译

### Vue组件渲染过程

### Vue组件之间通信方式有哪些

### Vue的生命周期方法有哪些

### 如何统一监听Vue组件报错

### 在实际工作中，你对Vue做过哪些优化

## 5 Vue3

### vue3 对 vue2 有什么优势

### vue3 和 vue2 的生命周期有什么区别

### 如何理解Composition API和Options API

### ref如何使用

### toRef和toRefs如何使用和最佳方式

### 深入理解为什么需要ref、toRef、toRefs

### vue3升级了哪些重要功能

### Composition API 如何实现逻辑复用

### Vue3如何实现响应式

### Proxy 基本使用

### vue3用Proxy 实现响应式

### v-model参数的用法

### watch和watchEffect的区别

### setup中如何获取组件实例

### Vue3为何比Vue2快

### 什么是PatchFlag

### 什么是HoistStatic和CacheHandler

### SSR和Tree-shaking的优化

### Vite 为什么启动非常快

### Composition API 和 React Hooks 的对比

## 6 React

### JSX本质

### React合成事件机制

### setState和batchUpdate机制

### 根据jsx写出vnode和render函数

### 虚拟DOM（vdom）真的很快吗

### react组件渲染过程

### React setState经典面试题

### React useEffect闭包陷阱问题

### Vue React diff 算法有什么区别

### 如何统一监听React组件报错

### 在实际工作中，你对React做过哪些优化

### React真题

### React和Vue的区别（常考）

## 7 React Hooks

### class组件存在哪些问题

### 用useState实现state和setState功能

### 用useEffect模拟组件生命周期

### 用useEffect模拟WillUnMount时的注意事项

### useRef和useContext

### useReducer能代替redux吗

### 使用useMemo做性能优化

### 使用useCallback做性能优化

### 什么是自定义Hook

### 使用Hooks的两条重要规则

### 为何Hooks要依赖于调用顺序

### class组件逻辑复用有哪些问题

### Hooks组件逻辑复用有哪些好处

### Hooks使用中的几个注意事项

## 8 Webpack

### hash、chunkhash、contenthash区别

### webpack常用插件总结

### webpack热更新原理

### webpack原理简述

### webpack性能优化-构建速度

### webpack性能优化-产出代码（线上运行）

## 9 HTTP

### HTTP基础总结

### HTTP缓存

### HTTP协议1.0和1.1和2.0有什么区别

### WebSocket和HTTP协议有什么区别

### 请描述TCP三次握手和四次挥手

### HTTP跨域请求时为什么要发送options请求

### HTTP请求中token、cookie、session有什么区别

### 什么是HTTPS中间人攻击，如何预防（HTTPS加密过程、原理）

## 10 Node

### 浏览器和nodejs事件循环（Event Loop）有什么区别

### nodejs如何开启多进程，进程如何通讯

## 11 综合题目

### 你们的工作流程是怎么样的

### 工作中遇到过哪些项目难点，是如何解决的

### 前端性能优化

### 前端常用的设计模式和使用场景

### 如果一个H5很慢，如何排查性能问题

### 后端一次性返回十万条数据，你该如何渲染

### H5页面如何进行首屏优化

### 请描述js-bridge的实现原理

### 从零搭建开发环境需要考虑什么

### 如果你是项目前端技术负责人，将如何做技术选型（常考）

### 高效的字符串前缀匹配如何做

### 前端路由原理

### 首屏渲染优化

### interface和type的区别（常考）

## 12 手写题

### 防抖

### 节流

### New的过程

### instanceOf原理

### 实现call方法

### 实现apply方法

### 实现bind方法

### 发布订阅模式

### 手写JS深拷贝-考虑各种数据类型和循环引用

### 用JS实现一个LRU缓存

### 手写curry函数，实现函数柯里化

### 手写一个LazyMan，实现sleep机制

### 手写一个getType函数，获取详细的数据类型

### 手写一个JS函数，实现数组扁平化Array Flatten

### 把一个数组转换为树

### 获取当前页面URL参数

### 手写Promise加载一张图片

### 两个数组求交集和并集

### JS反转字符串

### 设计实现一个H5图片懒加载

### 手写Vue3基本响应式原理

### 实现一个简洁版的promise

## 13 算法题

### 时间复杂度与空间复杂度基本概念

### 实现数字千分位格式化

### 实现快速排序并说明时间复杂度

### 将数组中的0移动到末尾

### 求斐波那契数列的第n值

### 给一个数组，找出其中和为n的两个元素（两数之和）

### 实现二分查找并分析时间复杂度

### 实现队列功能

### 手写判断一个字符串"{a(b\[c\]d)e}f"是否括号匹配

## 14 开放问题

### 面试结束面试官问你想了解什么

### 工作中遇到过哪些项目难点，是如何解决的

### 你未来发展怎么规划的

### 你期望加入一家什么样的公司

### 平常除了开发还会做什么？

### 怎么看待加班

### 你最大的缺点

### 你觉得你有哪些不足之处

### 优雅谈薪的技巧
