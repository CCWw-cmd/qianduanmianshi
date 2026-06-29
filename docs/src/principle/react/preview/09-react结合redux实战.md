
> 以`TODO`为例分析，实际开发中并不是那么简单，下面的原型只是开发中的一个原型，这个简单的例子，有助于掌握数据处理传递的原则。

## 一、定义constants

> 这一步不是必须的

```js
/**
 * 常量统一保存，便于管理
 */
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY = 'SET_VISIBILITY';

//controll todo wheher show or hide
export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_ACTIVE = 'SHOW_ACTIVE';
export const SHOW_COMPLETED = 'SHOW_COMPLETED';
```

## 二、定义actionCreator

```js
/**
 * 定义action creator
 */

import * as actionType from '../constant/index';

let nextTodo = 0;

export const addTodo = (text)=>({
  type:actionType.ADD_TODO,
  id:nextTodo++,
  text
})

export const toggleTodo = (id)=>({
  type:actionType.TOGGLE_TODO,
  id
})

export const setVisibilityFilter = (filter)=>{
  return {
    type:actionType.SET_VISIBILITY,
    filter
  }
}
```

## 三、定义reducer

## 四、定义store

## 五、结合react-redux
