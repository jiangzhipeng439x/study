### 一、new关键字生效的过程中发生了什么

```
let child = new Person();
```

1、开辟一块新的内存空间，创建空对象；
```
var obj = {};
```

2、设置原型链---这里所说原型链，就是设置新建对象obj的隐式原型即_proto_属性指向构造函数Person的显示原型prototype对象，即
```
obj.__proto__ = Person.prototype;
```

3、利用call()或者是apply()来执行构造函数，构造函数中的this指向new出对象
```
Person.call(obj);
```

4、将第三步中初始化完成后的对象地址，保存到新对象中，同时要判断构造函数Person的返回值类型，为什么要判断值类型呢？因为如果构造函数中返回this这个时候则返回新的实例对象，如果返回的是其他，这时会新对象应该是返回的值（这个和网上其他的说法有异）
```
child = obj;
``

5、JS实现new关键字过程
```
function newObject(func) {
    return function () {
        let newObj = {
            __proto__: func.prototype // 新生成一个对象,且新对象的隐式原型对象继承自构造对象的显示原型对象
        }
        var returnObj = func.call(obj, arguments) // 以第二次执行函数的参数,在obj作用域中执行func
        if ((typeof returnObj === "object" || typeof returnObj === "function") && returnObj !== null) {
            return returnObj;
        } // 同理,returnObj是 "对象" 类型,那么这个对象会取代newObj作为返回的对象
        return newObj
    }
}
```


PS:function函数的构造函数是它自身，apply、call都可以执行调用对象的构造函数，我们平时使用的apply、call的时候，实际上也是去调用这个对象的构造函数