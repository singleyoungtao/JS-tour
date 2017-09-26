// 简单原型链

function Super1(){
    this.val = 1;
    this.arr = [2];
}

function Sub1(){}

Sub1.prototype = new Super1(); // *

var sub11 = new Sub1();
var sub12 = new Sub1();
console.log(sub11.val); // 1
console.log(sub12.val); // 1
console.log(sub11.arr); // [2]
sub11.val = 2
sub11.arr.push(2);
console.log(sub11.val); // 2
console.log(sub12.val); // 1
console.log(sub11.arr); // [2,2]
console.log(sub12.arr); // [2,2]

// 父类实例充当子类的原型对象
// 来自原型对象的引用是所有实例共享的
// 创建子类实例时，无法向父类构造函数传参

// 借用构造函数

function Super2(val){
    this.val = val;
    this.arr = [1];
    this.fun = function(){}
}

function Sub2(val){
    Super2.call(this, val); // *  这个this指向谁？
}

var sub21 = new Sub2(1);
var sub22 = new Sub2(2);
console.log(sub21.val); // 1
console.log(sub22.val); // 2
sub21.arr.push(2);
console.log(sub21.arr); // [1,2]
console.log(sub22.arr); // [1]
console.log(sub21.fun === sub21.fun); // false

// 借父类的构造函数来增强子类实例，相当于把父类的实例属性
// 复制了一份给子类实例装上了，完全没有用到原型

// 解决了子类实例共享父类引用属性的问题
// 创建子类实例时，可以向弗雷构造函数传递参数

// BUT 无法实现函数复用，每个子类都有一个新的fun函数
// 多了之后影响性能，内存BOOM！

// 组合继承（最常用）

function Super3(){
    this.val = 1;
    this.arr = [1];
}

Super3.prototype.fun1 = function(){};
Super3.prototype.fun2 = function(){};

function Sub3(){
    Super3.call(this); // *
}
Sub3.prototype = new Super3(); // *
var sub31 = new Sub3(1);
var sub32 = new Sub3(2);
console.log(sub31.val); // 1
console.log(sub32.val); // 1
sub32.arr.push(2);
console.log(sub31.arr); // [1]
console.log(sub32.arr); // [1, 2]
console.log(sub31.fun1 === sub32.fun1); // true

// 把实例函数都放在原型对象上，以实现函数复用。
// 同时还要保留借用构造函数方式的优点，
// 通过Super.call(this);继承父类的基本属性和引用属性并保留能传参的优点；
// 通过Sub.prototype = new Super();继承父类函数，实现函数复用

// 子类原型上有一份多余的父类实例属性，
// 因为父类构造函数被调用了两次，生成了两份，
// 而子类实例上的那一份屏蔽了子类原型上的。(内存浪费，不过问题不大）


// 原型式

function Handler(obj){
    var F = function(){};
    F.prototype = obj;
    return new F();
}
function Super5(){
    this.val = 1;
    this.arr = [1];
}

var sup = new Super5(); // 拿到父类对象
var sub51 = Handler(sup); // *
sub51.attr1 = 1;
sub51.attr2 = 2;
console.log(sub51.val); // 1
console.log(sub51.arr); // [1]
console.log(sub51.attr1); // 1

// 通过定义Handler函数， 得到没有实例属性的新对象然后再填充实例属性
// Object.create() ---> 内部就是原型式继承；
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

// 寄生式











// 寄生组合继承（best）

// function Handler(obj){
//     var F = function(){};
//     F.prototype = obj;
//     return new F();
// }

// function Super4(){
//     this.val = 1;
//     this.arr = [1];
// }

// Super4.prototype.fun1 = function(){};
// Super4.prototype.fun2 = function(){};

// function Sub4(){
//     Super.call(this); // *
// }

// var proto = Handler(Super4.prototype); // *
// proto.constructor = Sub4; // *
// Sub4.prototype = proto; // *

// var sub41 = new Sub4();
// console.log(sub41.val);
// console.log(sub41.arr);
