
![CSS CHEAT SHEET](https://s.poetries.top/uploads/2022/07/47b89e6c7852b4c4.png)

## 1 盒模型

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

## 2 BFC

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
4. `BFC` 的区域不会与 `float` 的元素区域重叠
5. 计算 `BFC` 的高度时，浮动子元素也参与计算
6. 文字层不会被浮动层覆盖，环绕于周围

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

```css
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

```css
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

```css
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

## 3 层叠上下文

## 4 居中布局

### 元素水平垂直居中的方法有哪些？如果元素不定宽高呢？

### 左右居中

### 上下居中

## 5 选择器权重计算方式

## 6 清除浮动

## 7 link 与 @import 的区别

## 8 CSS3的新特性

## 9 CSS动画和过渡

### transition 实现渐变动画

### transform 转变动画

### animation 实现自定义动画

### 用css3动画使一个图片旋转

## 10 有哪些方式（CSS）可以隐藏页面元素

## 11 说说em/px/rem/vh/vw区别

## 12 flex布局

## 13 关于伪类 LVHA 的解释

## 14 calc函数

## 15 伪类和伪元素

## 16 浏览器是怎样解析 CSS 选择器的

## 17 浏览器如何判断是否支持 webp 格式图片

## 18 CSS加载问题

## 19 文字单超出显示省略号

## 20 页面变灰

## 21 CSS中可继承的属性

## 22 常规流(文档流)是个怎样的排列关系

## 23 inline-block的使用场景

## 24 position: fixed什么时候会失效？

## 25 回流（reflow）和重绘（repaint）的理解

### 分析

### 如何触发

### 如何避免

## 26 GPU加速的原因

## 27 说说will-change

## 28 z-index和background的覆盖关系

## 29 移动端中css你是使用什么单位

## 30 说说设备像素、css像素、设备独立像素、dpr、ppi 之间的区别

## 31 在移动端中怎样初始化根元素的字体大小

## 32 移动端中不同手机html默认的字体大小都是一样的吗

## 33 line-height 如何继承

## 34 css 怎么开启硬件加速(GPU 加速)

## 35 flex:1 是哪些属性组成的

## 36 css选择器有哪些？优先级？哪些属性可以继承？

## 37 flex弹性盒布局模型及适用场景？

## 38 介绍一下grid网格布局

## 39 什么是响应式设计？响应式设计的基本原理是什么

## 40 如果要做优化，CSS提高性能的方法有哪些？

## 41 如何实现单行／多行文本溢出的省略样式？

## 42 让Chrome支持小于12px 的文字方式有哪些

## 43 说说对CSS预编语言的理解？有哪些区别?

## 44 编程题

### 画一条 0.5px 的线

### 如何画一个三角形

### 圆？半圆？椭圆？

### CSS画圆半圆扇形三角梯形

### 两栏布局：左边定宽，右边自适应方案

### 三栏布局：左右两边宽度固定中间自适应
