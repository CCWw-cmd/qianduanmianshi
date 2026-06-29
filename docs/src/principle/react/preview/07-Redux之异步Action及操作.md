
## 一、创建同步Action

> `Action`是数据从应用传递到 `store`/`state` 的载体，也是开启一次完成数据流的开始

**普通的action对象**

```js
const action = {
 type:'ADD_TODO',
 name:'poetries'
}

dispatch(action)
```

**封装action creator**

```js
function actionCreator(data){
    return {
     type:'ADD_TODO',
     data:data
    }
}

dispatch(actionCreator('poetries'))
```

**bindActionCreators合并**

```js
function a(name,id){
 reurn {
  type:'a',
  name,
  id
 }
}
function b(name,id){
 reurn {
  type:'b',
  name,
  id
 }
}

let actions = Redux.bindActionCreators({a,b},store.dispatch)

//调用
actions.a('poetries','id001')
actions.b('jing','id002')
```

**action创建的标准**

> 在Flux的架构中，一个Action要符合 FSA(Flux Standard Action) 规范，需要满足如下条件

* 是一个纯文本对象
* 只具备 `type` 、`payload`、`error` 和 `meta`中的一个或者多个属性。`type` 字段不可缺省，其它字段可缺省
* 若 `Action` 报错，`error` 字段不可缺省，切必须为 `true`

> `payload` 是一个对象，用作Action携带数据的载体

**标准action示例**

* A basic Flux Standard Action:

```js
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'  
  }
}
```

* An FSA that represents an error, analogous to a rejected Promise

```js
{
  type: 'ADD_TODO',
  payload: new Error(),
  error: true
}
```

> <https://github.com/acdlite/flux-standard-action>

* 可以采用如下一个简单的方式检验一个`Action`是否符合FSA标准

```js
// every有一个匹配不到返回false
let isFSA = Object.keys(action).every((item)=>{
   return  ['payload','type','error','meta'].indexOf(item) >  -1
})
```

## 二、创建异步action的多种方式

> 最简单的方式就是使用同步的方式来异步，将原来同步时一个`action`拆分成多个异步的`action`的，在异步开始前、异步请求中、异步正常返回（异常）操作分别使用同步的操作，从而模拟出一个异步操作了。这样的方式是比较麻烦的，现在已经有`redux-saga`等插件来解决这些问题了

**异步action的实现方式一：setTimeout**

> `redux-thunk`中间处理解析

```js
function thunkAction(data) {
    reutrn (dispatch)=>{
        setTimeout(function(){
            dispatch({
                type:'ADD_TODO',
                data
            })
        },3000)
    }
}
```

**异步action的实现方式二：promise实现异步action**

> redux-promise`中间处理这种`action

```js
function promiseAction(name){
    return new Promise((resolve,reject) => {
        setTimeout((param)=>{
            resolve({
                type:'ADD_TODO',
                name
            })
        },3000)
    }).then((param)=>{
        dispatch(action("action2"))
        return;
    }).then((param)=>{
        dispatch(action("action3"))
    })
}
```

## 三、redux异步流程

## 四、Redux异步方案选型

## 五、redux异步操作代码演示
