// 普通函数调用 指向window

var test = 'hahaha';
function thisHandler1() {
    console.log('test:', this.test, 'this:', this);
}

thisHandler1(); // test: hahaha this: window
window.thisHandler1(); //

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
function Bar() {
    this.name = 'banana'
}

var handlerA = new Bar();
console.log(handlerA.name); // banaba
console.log(name) // apple

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