// promise是抽象异步处理对象以及对其进行各种操作的组件
// 与回调函数的不同之处：在使用promise 进行处理的时候，必须按照接口规定的方法编写处理代码

// api大致分三种：Constructor(new Promise)
// Instance Method（resolve、reject、then）
// Static Method (Promise.all(), Promise.resolve()) 用于对Promise进行操作的辅助方法


// Promise create
function asyncFunction() {
    return new Promise(function(r, j){
        setTimeout(function() {
            r('Async success');
        }, 16)
    });
}

asyncFunction().then(function (value) {
    console.log(value); //
}).catch(function (error) {
    console.log(error);
})

// then()可以接受2个参数，一个是resolve的，一个是reject的，通常可以省略第二个参数
// catch()方法可以看做是then(undefined, onRejected)的写法

function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send();
    });
}

var URL = "http://httpbin.org/get";
// var URL = "http://httpbin.org/status/500";
getURL(URL).then(function onFulfilled(value) {
    console.log(value);
}).catch(function onRejected(error) {
    console.log(error);
})


// Promise.resolve

// new Promise
var promise = new Promise(function(r) {
    r('resolve');
});
promise.then(function(value) {console.log(value);});

Promise.resolve('resolve').then((value) => console.log(value));
Promise.reject(new Error('BOOM!')).catch((error) => console.error(error))
// 就像我们有时称具有 .length 方法的非数组对象为Array like一样，thenable指的是一个具有 .then 方法的对象。
// Promise.resolve 方法的另一个作用就是将thenable对象转换为promise对象

Promise.resolve($.ajax('/json/comment.json')).then((value) => console.log(value));

// Promise 在规范上规定只能使用异步方式调用，下面的例子中74行首先会执行promise中的内容，1出现
// 其次2会执行，最后3执行。promise中的内容会在调用的时候直接执行，而then的内容
// 则会在任务队列中。

var promise = new Promise((r,j) => {
    console.log('inner promise'); //1
    r(42);
});

promise.then((value) => console.log(value)); //3
console.log('outer promise'); //2

// 绝对不能对异步回调函数（即使在数据已经就绪）进行同步调用。
// 如果对异步回调函数进行同步调用的话，处理顺序可能会与预期不符，可能带来意料之外的后果。
// 对异步回调函数进行同步调用，还可能导致栈溢出或异常处理错乱等问题。
// 如果想在将来某时刻调用异步回调函数的话，可以使用 setTimeout 等异步API。


// Promise中可以将任意个方法连接在一起作为一个方法链(promise chain)
promise.then().catch()
new Promise(r => r('123')).then(v => new Promise(r => setTimeout(()=>r(), 2000))).then(()=>console.log('antoher'));
Promise.resolve('123').then(v => new Promise(r => setTimeout(()=>r(), 2000))).then(()=>console.log('antoher'));
new Promise(r => r('123')).then(v => '321').then(()=>console.log('antoher'));

// chain中的resolve和reject的执行
function taskA() { console.log('Task A'); }
function taskB() { console.log('Task B'); }
function onRejected(error) { console.log("Catch Error ", error);}
function finalTask() { console.log('Final Task'); }
Promise.resolve().then(taskA)
                 .then(taskB)
                 .catch(onRejected)
                 .then(finalTask);
// 无论A或者B有error都会触发onREjected, 最终都会执行finalTask
// Task A 处理中发生异常的话，会按照TaskA → onRejected → FinalTask 这个流程来进行处理。
// 每个task中的返回值会作为下一个task中的参数(then()的参数传递方式)
// 每次调用then都会创建并返回一个新ß的promise对象

// badAsyncCall 中无法被外界捕获，同时无法获得then的返回值，错误的使用方式
function badAsyncCall() {
    var promise = Promise.resolve();
    promise.then(function() {
        console.log('---1---');
        var a = Promise.resolve('a');
        // 任意处理
        return a;
    });
    return promise;
}

function anAsyncCall() {
    var promise = Promise.resolve();
    return promise.then(function() {
        console.log('---2---');  
        var b = Promise.resolve('b');        
        // 任意处理
        return b;
    });
}

// Promise.all 接受一个数组作为参数，数组中的promise全部为resolve或者reject时才会then
// 数组中的promise会同时开始执行，传递给 then的执行结果的顺序是固定的，和数组中的顺序相同

// `delay`毫秒后执行resolve
function timerPromisefy(delay) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(delay);
        }, delay);
    });
}
var startDate = Date.now();
// 所有promise变为resolve后程序退出
Promise.all([
    timerPromisefy(1),
    timerPromisefy(32),
    timerPromisefy(64),
    timerPromisefy(128)
]).then(function (values) {
    console.log(Date.now() - startDate + 'ms');
    // 約128ms
    console.log(values);    // [1,32,64,128]
});

// 4个计时函数同时开始计时。

// Promise.race 同样接受一个promise数组，也是同时开始执行
// 但只要有一个进入FulFilled或者Rejected状态就会执行后面的处理
// 于此同时，其他promise会继续执行，指导resolve或者rejected

var winnerPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('this is winner');
        resolve('this is winner');
    }, 4);
});
var loserPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('this is loser');
        resolve('this is loser');
    }, 1000);
});
// 第一个promise变为resolve后程序停止
Promise.race([winnerPromise, loserPromise]).then(function (value) {
console.log(value);    // => 'this is winner'
});

// 如果loserPromise的时间为4，则结果依旧相同

// then和catch的区别

function throwError(value) {
    // 抛出异常
    throw new Error(value);
}
// <1> onRejected不会被调用
function badMain(onRejected) {
    return Promise.resolve(42).then(throwError, onRejected);
}
// <2> 有异常发生时onRejected会被调用
function goodMain(onRejected) {
    return Promise.resolve(42).then(throwError).catch(onRejected);
}
// 运行示例
badMain(function(){
    console.log("BAD");
});
goodMain(function(){
    console.log("GOOD");
});

// GOOD
// then中第二个参数针对的是promise的reject情况，并不能捕获第一个参数中的错误
// 而goodMain中则遵循throwError ——> onRejected的调用流程，
// 在throwError中出现异常的话则可以在后面的.catch捕获
// .then 和 .catch 都会创建并返回一个 新的 promise对象。
// Promise实际上每次在方法链中增加一次处理的时候所操作的都不是完全相同的promise对象。
// 由于.catch是then的别名，所以.then也可以实现同样的工作

Promise.resolve(42).then(throwError).then(null, onRejected);

// Promise 测试