
## 一、前言

有同学问：能否详细说一下 diff 算法。

> 简单说：diff 算法是一种优化手段，将前后两个模块进行差异化比较，修补(更新)差异的过程叫做 patch，也叫打补丁。

详细的说，请阅读这篇文章，有疑问的地方欢迎联系「松宝写代码」一起讨论。

文章主要解决的问题：

* 1、为什么要说这个 diff 算法？
* 2、虚拟 dom 的 diff 算法
* 3、为什么使用虚拟 dom？
* 4、diff 算法的复杂度和特点？
* 5、vue 的模板文件是如何被编译渲染的？
* 6、vue2.x 和 vue3.x 中的 diff 有区别吗
* 7、diff 算法的源头 snabbdom 算法
* 8、diff 算法与 snabbdom 算法的差异地方？

## 二、为什么要说这个 diff 算法？

因为 diff 算法是 vue2.x ， vue3.x 以及 react 中关键核心点，理解 diff 算法，更有助于理解各个框架本质。

说到「diff 算法」，不得不说「虚拟 Dom」，因为这两个息息相关。

比如：

* vue 的响应式原理？
* vue 的 template 文件是如何被编译的？
* 介绍一下 Virtual Dom 算法？
* 为什么要用 virtual dom 呢？
* diff 算法复杂度以及最大的特点？
* vue2.x 的 diff 算法中节点比较情况？

等等

## 三、虚拟 dom 的 diff 算法

### **3.1 vue 中 diff 算法**

### **3.2 React diff 算法**

## 四、为什么使用虚拟 dom？

## 五、diff 算法的复杂度和特点？

## 六、vue 的模板文件是如何被编译渲染的？

### **1、mount 函数**

### **2、compileToFunction 函数**

### **3、compile 函数**

### **4、patch 函数**

### **总结一下**

## 七、vue2.x，vue3.x，React 中的 diff 有区别吗？

## **八、diff 算法的源头 snabbdom 算法**

### **1、snabbdom 中定义 Vnode 的类型**

### **2、init 函数分析**

### **3、patch 函数分析**

### **4、h 函数分析**

## 九、diff 算法与 snabbdom 算法的差异地方？
