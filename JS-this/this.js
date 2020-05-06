// 普通函数调用 指向window

var test = 'hahaha';
function thisHandler1() {
    console.log('test:', this.test, 'this:', this);
}

// PS: var 的变量在Window上可以找到，而let 的变量并不在Window上，
// 使用 var 在全局级别（在函数外部）进行声明都会自动成为 window 对象上的一个属性, let 则不会
// 所以此处如果是let 的变量，this.test 则为undefined
thisHandler1(); // test: hahaha this: window
window.thisHandler1(); //

function thisHandler11() {
    var fruit = 'apple';
    console.log(this.user); // undefined 全局上没有这个属性
    console.log(this); // Window
}
thisHandler11();


// 作为对象方法调用

var thisHandler2 = {
    name: 'apple',
    test: function () {
        console.log('my name:', this.name)
    }
}

thisHandler2.test() // my name: apple

var thisHandler3 = {
    name: 'apple',
    fn: {
        name: 'banana',
        test: function() {
            console.log('my name: ', this.name);
        }
    }
}

thisHandler3.fn.test() // my name banana

var name = 'apple';
var thisHandler4 = {
    name: 'banana',
    fn: {
        name: 'hello',
        test: function() {
            console.log('my name: ', this.name);
        }
    }
}

var testHandler = thisHandler4.fn.test;
testHandler();

// 此处相当于window.testHandler()

// 构造函数调用
var name = 'apple';
function fn1() {
    this.name = 'banana'
}

var handlerA = new fn1();
console.log(handlerA.name); // banaba
console.log(name) // apple

// 为什么this会指向handleA？
// 首先new关键字会创建一个空的对象，
// 然后会自动调用一个函数apply方法，
// 将this指向这个空对象，这样的话函数内部的this就会被这个空的对象替代。


function fn2() {
    this.name = 'apple';
}
var handlerB = new fn2;
console.log(handlerB.name); // apple

function fn3() {
    this.name = 'apple';
    return {};
}
var handlerC = new fn3;
console.log(handlerC.name); // undefined

function fn4() {
    this.name = 'apple';
    return function(){};
}
var handlerD = new fn4;
console.log(handlerD.name); // undefined

function fn5() {
    this.name = 'apple';
    return 1;
}
var handlerE = new fn5;
console.log(handlerE.name); // apple

function fn6() {
    this.name = 'apple';
    return undefined;
}
var handlerF = new fn6;
console.log(handlerF.name); // apple
console.log(handlerF); // fn6 {name: "apple"}

function fn7() {
    this.name = 'apple';
    return null;
}
var handlerG = new fn7;
console.log(handlerG.name); // apple
console.log(handlerG); // fn7 {name: "apple"}
//还有一点就是虽然null也是对象，但是在这里this还是指向那个函数的实例，因为null比较特殊。
//如果返回值是一个对象，那么this指向的就是那个返回的对象，
//如果返回值不是一个对象那么this还是指向函数的实例。


// apply call

var name = 'apple';
var thisHandler5 = {
    name: 'banana',
    test: function(){
        console.log('my name:', this.name);
    }
}

thisHandler5.test(); // banana 
thisHandler5.test.apply(); // apple

// apply 指向null或者undefined时，自动指向window（非严格模式）

// 箭头函数

var name = 'apple';
var thisHandler6 = {
    name: 'banana',
    test: () => {
        console.log('my name: ', this.name);
    }
}

thisHandler6.test(); // apple this指向window

// 箭头函数中没有this绑定，需要查找作用域链决定
// 如果箭头函数被非箭头函数包含， this绑定最近一层
// 非箭头函数的this，否则，this的值会被设置为undefined

// PS: 箭头函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数
  setInterval(() => this.s1++, 1000);
  // 普通函数
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0

var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
// 上面代码的init方法中，使用了箭头函数，这导致这个箭头函数里面的this，总是指向handler对象。
// 否则，回调函数运行时，this.doSomething这一行会报错，因为此时this指向document对象。

// this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。
// 正是因为它没有this，所以也就不能用作构造函数。



// 闭包

var name = 'apple';
var thisHandler7 = {
    name: 'banana',
    test: () => {
        return function () {
            console.log('my name: ', this.name);
        }
    }
}

thisHandler7.test(); // 此时得到的是return的函数，其this指向的是window
thisHandler7.test()(); // apple

'use strict';
var name = 'apple';
var thisHandler71 = {
    name: 'banana',
    test: () => {
        return function () {
            console.log('my name: ', this.name);
        }
    }
}

thisHandler71.test(); // 此时得到的是return的函数，其this指向的是undefined
thisHandler71.test()(); // 在严格版中的默认的this不再是window，而是undefined。

var name = 'apple';
var thisHandler8 = {
    name: 'banana',
    test: () => {
        var that = this;
        return function(){
            console.log('my name: ', that.name);
        }
    }
}

thisHandler8.test();
thisHandler8.test()(); // apple 由于箭头函数的缘故

var name = 'apple';
var thisHandler9 = {
    name: 'banana',
    test: function () {
        var that = this;
        return function() {
            console.log('my name: ', that.name);
        }
    }
}

thisHandler9.test();
thisHandler9.test()(); // banana 

// 此处的that表示把this值赋给that，that本身并不是js关键字
// 仅仅是一个变量赋值而已。
