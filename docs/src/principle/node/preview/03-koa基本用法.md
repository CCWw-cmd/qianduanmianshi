
# Koa基本用法

> Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高

## 一、基本用法

### 1.1 架设 HTTP 服务

> 只要三行代码，就可以用 `Koa` 架设一个 `HTTP` 服务。

```js
const Koa = require('koa');
const app = new Koa();

app.listen(3000);
```

> 打开浏览器，访问`http://127.0.0.1:3000` 。你会看到页面显示"Not Found"，表示没有发现任何内容。这是因为我们并没有告诉 `Koa` 应该显示什么内容

### 1.2 Context 对象

> `Koa` 提供一个 `Context` 对象，表示一次对话的上下文（包括 `HTTP` 请求和 `HTTP` 回复）。通过加工这个对象，就可以控制返回给用户的内容

* `Context.response.body`属性就是发送给用户的内容

```js
const Koa = require("koa");
const app = new Koa();

app.use(ctx => { //处理请求的中间件
    ctx.response.body = "hello world";
}).listen(3000);
```

> 上面代码中，`main`函数用来设置`ctx.response.body`。然后，使用`app.use`方法加载`main`函数

* `ctx.response`代表 `HTTP Response`。同样地，`ctx.request`代表 `HTTP Request`

### 1.3 HTTP Response 的类型

> `Koa` 默认的返回类型是`text/plain`，如果想返回其他类型的内容，可以先用`ctx.request.accepts`判断一下，客户端希望接受什么数据（根据 `HTTP Request` 的Accept字段），然后使用`ctx.response.type`指定返回类型

```js
const Koa = require("koa");
const app = new Koa();

app.use(ctx => {
    if (ctx.request.accepts('xml')) {
        ctx.response.type = 'xml';
        ctx.response.body = '<data>Hello World</data>';
    } else if (ctx.request.accepts('json')) {
        ctx.response.type = 'json';
        ctx.response.body = { data: 'Hello World' };
    } else if (ctx.request.accepts('html')) {
        ctx.response.type = 'html';
        ctx.response.body = '<p>Hello World</p>';
    } else {
        ctx.response.type = 'text';
        ctx.response.body = 'Hello World';
    }
}).listen(3000);
```

### 1.4 网页模板

> 实际开发中，返回给用户的网页往往都写成模板文件。我们可以让 Koa 先读取模板文件，然后将这个模板返回给用户

```js
const Koa = require("koa");
const app = new Koa();
const fs = require('fs');

app.use(ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./demos/template.html');
}).listen(3000);
```

## 二、路由

> 网站一般都有多个页面。通过`ctx.request.path`可以获取用户请求的路径，由此实现简单的路由

```js
const Koa = require("koa");
const app = new Koa();
const fs = require('fs');

app.use(ctx => {
    if (ctx.request.path !== '/') {
        ctx.response.type = 'html';
        ctx.response.body = '<a href="/">Index Page1</a>';
    } else {
        ctx.response.body = 'Hello World';
    }
}).listen(3000);
```

### 2.1 koa-route 模块

> 原生路由用起来不太方便，我们可以使用封装好的`koa-route`模块

```js
const Koa = require("koa");
const app = new Koa();
const fs = require('fs');
const route = require('koa-route');

const main = route.get("/", ctx => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page1</a>';
})
const about = route.get("/about", ctx => {
    ctx.response.body = 'Hello World';
})

app.use(main);
app.use(about);
app.listen(3000);
```

### 2.2 静态资源

> 如果网站提供静态资源（图片、字体、样式表、脚本......），为它们一个个写路由就很麻烦，也没必要。`koa-static`模块封装了这部分的请求

```js
// 访问 http://localhost:3000/test.json
const Koa = require("koa");
const app = new Koa();

const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname, "../public/"));

app.use(main);
app.listen(3000);
```

### 2.3 重定向

> 有些场合，服务器需要重定向（`redirect`）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。`ctx.response.redirect()`方法可以发出一个`302`跳转，将用户导向另一个路由

```js
const Koa = require("koa");
const app = new Koa();
const route = require("koa-route");

const redirect = route.get("/redirect", ctx => {
    ctx.response.redirect('/');
    ctx.response.body = '<a href="/">Index Page</a>';
})
const main = route.get("/", ctx => {
    ctx.response.body = "hello world";
});

app.use(main);
app.use(redirect);
app.listen(3000);
```

## 三、中间件

### 3.1 Logger 功能

### 3.2 中间件的概念

### 3.3 中间件栈

### 3.4 异步中间件

### 3.5 中间件的合成

## 四、错误处理

### 4.1 500 错误

### 4.2 404错误

### 4.3 处理错误的中间件

### 4.4 error 事件的监听

## 五、Web App 的功能

### 5.1 Cookies

### 5.2 表单

### 5.3 文件上传
