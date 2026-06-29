
# Express详细使用

> Express是目前最流行的基于Node.js的Web开发框架，可以快速地搭建一个完整功能的网站

## 运行原理

### 底层：http模块

> Express框架建立在node.js内置的http模块上。http模块生成服务器的原始代码如下

```js
var http = require("http");

var app = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello world!");
});

app.listen(3000, "localhost");
```

> Express框架的核心是对http模块的再包装。上面的代码用Express改写如下

```js
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello world!');
});

app.listen(3000);
```

> Express框架等于在http模块之上，加了一个中间层

### 什么是中间件

> * 简单说，中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。App实例在运行过程中，会调用一系列的中间件
> * 每个中间件可以从App实例，接收三个参数，依次为request对象（代表HTTP请求）、response对象（代表HTTP回应），next回调函数（代表下一个中间件）。每个中间件都可以对HTTP请求（request对象）进行加工，并且决定是否调用next方法，将request对象再传给下一个中间件。

* 一个不进行任何操作、只传递`request`对象的中间件，就是下面这样

```js
function uselessMiddleware(req, res, next) {
  next();
}
```

* 上面代码的next就是下一个中间件。如果它带有参数，则代表抛出一个错误，参数为错误文本
* 抛出错误以后，后面的中间件将不再执行，直到发现一个错误处理函数为止

```js
function uselessMiddleware(req, res, next) {
  next('出错了！');
}
```

## use方法

> use是express注册中间件的方法，它返回一个函数。下面是一个连续调用两个中间件的例子

```js
var express = require("express");
var http = require("http");

var app = express();

app.use(function(request, response, next) {
  console.log("In comes a " + request.method + " to " + request.url);
  next();
});

app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});

http.createServer(app).listen(1337);
```

> 上面代码使用app.use方法，注册了两个中间件。收到HTTP请求后，先调用第一个中间件，在控制台输出一行信息，然后通过next方法，将执行权传给第二个中间件，输出HTTP回应。由于第二个中间件没有调用next方法，所以request对象就不再向后传递了

* use方法内部可以对访问路径进行判断，据此就能实现简单的路由，根据不同的请求网址，返回不同的网页内容

```js
var express = require("express");
var http = require("http");

var app = express();

app.use(function(request, response, next) {
  if (request.url == "/") {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Welcome to the homepage!\n");
  } else {
    next();
  }
});

app.use(function(request, response, next) {
  if (request.url == "/about") {
    response.writeHead(200, { "Content-Type": "text/plain" });
  } else {
    next();
  }
});

app.use(function(request, response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.end("404 error!\n");
});

http.createServer(app).listen(1337);
```

> 上面代码通过`request.url`属性，判断请求的网址，从而返回不同的内容。注意，`app.use`方法一共登记了三个中间件，只要请求路径匹配，就不会将执行权交给下一个中间件。因此，最后一个中间件会返回`404`错误，即前面的中间件都没匹配请求路径，找不到所要请求的资源

* 除了在回调函数内部判断请求的网址，`use`方法也允许将请求网址写在第一个参数。这代表，只有请求路径匹配这个参数，后面的中间件才会生效。无疑，这样写更加清晰和方便

```js
// 只对根目录的请求，调用某个中间件
app.use('/path', someMiddleware);
```

* 因此，上面的代码可以写成下面的样子

```js
ar express = require("express");
var http = require("http");

var app = express();

app.use("/home", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Welcome to the homepage!\n");
});

app.use("/about", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Welcome to the about page!\n");
});

app.use(function(request, response) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.end("404 error!\n");
});

http.createServer(app).listen(1337)
```

## Express的方法

### all方法和HTTP动词方法

## set方法

## response对象

## requst对象

## 搭建HTTPs服务器

## 静态网页模板

## 动态网页模板

### 安装模板引擎

### 新建数据脚本

### 新建网页模板

### 渲染模板

### 指定静态文件目录

## Express.Router用法

## router.route方法

## router中间件

## 对路径参数的处理

## app.route

## 上传文件
