### 1、Object.freeze()  如果需要解冻，那么需要克隆

阻止修改现有属性的特性和值，并阻止添加新属性
两种用法：Object.freeze( { } ) 和 Object.freeze( object )

```
<script type="text/javascript">
    let a = {};
    a.sex = '男';
    console.log(a.sex, 111);//男 111
    Object.freeze(a);
    a.sex = '女';
    console.log(a.sex, 222);//男 222 修改属性无效
</script>
<script type="text/javascript">
    let b = Object.freeze({
        name: "piter",
        age: 10
    });
    console.log(b.name,333); //piter 333
    b.name = "bob";
    console.log(b.name,444); //piter 444 修改属性无效
</script>
```

### 2、Object.assign(target,source1,source2,...)

该方法主要用于对象的合并，将源对象source的所有可枚举属性合并到目标对象target上,此方法只拷贝源对象的自身属性，不拷贝继承的属性。
Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。同名属性会替换。
Object.assign只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。
Object.assign可以用来处理数组，但是会把数组视为对象。

```
<script type="text/javascript">
    let target = {
        age: 10,
        page: 1
    };
    let objA = {
        age: 12,
        year: 20,
        newObj: {
            sex: '男'
        }
    };
    Object.assign(target, objA);
    console.log(target, '拷贝之后')
    //            {
    //                age:12,
    //                newObj: {
    //                    sex: '女'
    //                },
    //                page: 1
    //                year: 20,
    //            } 
    //拷贝之后
    // 同名属性会被覆盖
    target.newObj.sex = '女'; // 拷贝为对象引用
    console.log(target.newObj.sex, '修改拷贝后对象里面的属性') //女  修改拷贝后对象里面的属性

    function Person() {
        this.name = 'bob'
    };
    Person.prototype.age = 20;
    let man = new Person();
    man.age = 29;
    let obj = {
        sex: '男'
    };
    Object.assign(obj, man);
    console.log(obj, '构造函数拷贝后的属性===')
    //{sex: "男", name: "bob", age: 29} "构造函数拷贝后的属性==="
    // 只能拷贝自身的属性，不能拷贝prototype

    Object.assign([1, 2, 3], [4, 5])
    console.log(Object.assign([1, 2, 3], [4, 5]), '数组使用该方法===')
    // [4, 5, 3]
    // 把数组当作对象来处理
</script>
```

### 3、Object.create() --- Object.create(prototype[,propertiesObject]) 和 new Object()的区别

Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 原型链上的属性或者方法,例如：toString(), hasOwnProperty()等方法
Object.create()方法接受两个参数:Object.create(obj,propertiesObject) ;
propertiesObject：可选。该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与Object.defineProperties()的第二个参数一样）。注意：该参数对象不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，也就是说该对象的原型链上属性是无效的。

```
<script type="text/javascript">
    var o = Object.create(Object.prototype, {
        // foo会成为所创建对象的---数据属性
        foo: {
            enumerable:false,//对象属性是否可通过for-in循环，flase为不可循环，默认值为true
            writable: true,////对象属性是否可修改,flase为不可修改，默认值为true
            configurable: true,////能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
            value: "goodnice"
        },
        // bar会成为所创建对象的 ---访问器属性
        bar: {
            configurable: false,
            get: function() {
                return 10
            },
            set: function(value) {
                console.log("Setting `o.bar` to", value);
            }
        }
    });
    console.log(o, '对象');
    //{foo:'goodnice'}
    var test = Object.create(null);
    console.log(test);
    // {} No Properties
    //也就是在对象本身不存在属性跟方法，原型链上也不存在属性和方法;
</script>
```

### 4、Object.defineProperties(obj,props)

直接在一个对象上定义新的属性或修改现有属性，并返回该对象。

```
<script type="text/javascript">
var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello,word',
    writable: false
  }
});
console.log(obj)   
// {property1: true, property2: "Hello,word"}
</script>
```

Object.defineProperty(obj,prop,descriptor)

obj---需要定义属性的对象；
prop---需定义或修改的属性的名字；
descriptor---将被定义或修改的属性的描述符；

在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>test</title>
    </head>
    <body>
        <div id="test">这是一个测试</div>
        <script>
            var test = document.getElementById("test");
            var data = {};
            var i = 0;
            Object.defineProperty(data, "b", {
                set: function(newValue) {
                    //当data.b的值改变的时候更新＃test的视图 
                    test.textContent = newValue;
                },
                get: function() {}
            });
            setInterval(function() {
                i++;
                data["b"] = "data.b的值更新了，视图更新" + i;
            }, 1000);
        </script>
    </body>
</html>
```
configurable
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。

enumerable
当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。
数据描述符同时具有以下可选键值：

value
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。

writable
当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。

存取描述符（第三个参数对象）同时具有以下可选键值：

get
一个给属性提供 getter 的方法，如果没有 getter 则为undefined。当我们读取某个属性的时候，其实是在对象内部调用了该方法，此方法必须要有return语句。该方法返回值被用作属性值。默认为 undefined。

set
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。也就是说，当我们设置某个属性的时候，实际上是在对象的内部调用了该方法。
要注意的一点是：在 descriptor 中不能同时设置访问器（get 和 set）和 wriable 或 value，否则会错，就是说想用 get 和 set，就不能用 writable 或 value 中的任何一个。

### 5、hasOwnProperty()
判断对象自身属性中是否具有指定的属性。

obj.hasOwnProperty('name')

### 6、Object.getOwnPropertyDescriptor(obj,prop)

返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）

如果指定的属性存在于对象上，则返回其属性描述符对象（property descriptor），否则返回 undefined。

### 7、Object.getOwnPropertyDescriptors(obj)

获取一个对象的所有自身属性的描述符。

```
<script>
    var obj = {
        name: 'bob',
        age: 18
    }
    console.log(Object.getOwnPropertyDescriptors(obj))
</script>
```

### 8、Object.getOwnPropertyNames()

返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。

```
<script>
    var obj = {
        age: 10,
        sex: "男",
        name: "bob"
    };
    Object.getOwnPropertyNames(obj).forEach(function(val) {
        console.log(val,'遍历的值');// age sex name 拿到的是实际是对象的键key
    });
    var obj = {
        x: 1,
        y: 2
    }
    Object.defineProperty(obj, 'z', {
        enumerable: false
    })
    console.log(Object.getOwnPropertyNames(obj)) // ["x", "y", "z"] 包含不可枚举属性 。
    console.log(Object.keys(obj)) // ["x", "y"]      只包含可枚举属性 。
</script>
```

### 9、Object.is()

判断两个值是否相同。
如果下列任何一项成立，则两个值相同：
两个值都是 undefined
两个值都是 null
两个值都是 true 或者都是 false
两个值是由相同个数的字符按照相同的顺序组成的字符串
两个值指向同一个对象
两个值都是数字并且
都是正零 +0
都是负零 -0
都是 NaN
都是除零和 NaN 外的其它同一个数字

```
<script>
    Object.is('foo', 'foo'); 
    console.log(Object.is('foo', 'foo'))// true
    Object.is(window, window); 
    console.log(Object.is(window, window))// true
    Object.is('foo', 'bar'); 
    console.log(Object.is('foo', 'bar'))// false
    Object.is([], []); 
    console.log(Object.is([], []))// false
    var test = {
        a: 1
    };
    Object.is(test, test); 
    console.log(Object.is(test, test))// true
    Object.is(null, null); 
    console.log(Object.is(null, null))// true
    // 特例
    Object.is(0, -0); 
    console.log(Object.is(0, -0))// false
    Object.is(-0, -0); 
    console.log(Object.is(-0, -0))// true
    Object.is(NaN, 0 / 0); 
    console.log(Object.is(NaN, 0 / 0))// true
</script>
```

### 10、Object.keys(obj)

返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 （两者的主要区别是 一个 for-in 循环还会枚举其原型链上的属性）。

```
<script>
    let arr = ["a", "b", "c"];
    console.log(Object.keys(arr));
    //["0", "1", "2"]
    /* Object 对象 */
    let obj = {
            age: 20,
            sex: '男'
        },
    keys = Object.keys(obj);
    console.log(keys);
    //["age", "sex"]
</script>
```

### 11、Object.values()

方法返回一个给定对象自己的所有可枚举属性值的数组，值的顺序与使用for...in循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )。

```
<script>
    var obj = {
        10: 'a',
        1: 'b',
        2: 'c'
    };
    console.log(Object.values(obj));
    // ['b', 'c', 'a']

    var obj1 = {
        0: 'a',
        1: 'b',
        2: 'c'
    };
    console.log(Object.values(obj1));
    // ['a', 'b', 'c']
</script>
```

### propertyIsEnumerable  判断是否是可枚举  

for…in

Object.keys()

JSON.stringify   

如果是不可枚举属性，这三种情况都将受到影响


### Object.entries()
返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环也枚举原型链中的属性）。


### Object.getOwnPropertySymbols()
返回一个给定对象自身的所有 Symbol 属性的数组。

 

### Object.getPrototypeOf()
返回指定对象的原型（内部[[Prototype]]属性的值，即__proto__，而非对象的prototype）。

 

### isPrototypeOf()
判断一个对象是否存在于另一个对象的原型链上。

### Object.isFrozen()
判断一个对象是否被冻结 .

### Object.setPrototypeOf(obj,prototype) 类似于 obj.prototype = prototype
设置对象的原型对象

### Object.preventExtensions()
对象不能再添加新的属性。可修改，删除现有属性，不能添加新属性。
```
var obj = {
    name :'lilei',
    age : 30 ,
    sex : 'male'
}
 
obj = Object.preventExtensions(obj);
console.log(obj);    // {name: "lilei", age: 30, sex: "male"}
obj.name = 'haha';
console.log(obj)     // {name: "haha", age: 30, sex: "male"}
delete obj.sex ;
console.log(obj);    // {name: "haha", age: 30}
obj.address  = 'china';
console.log(obj)     // {name: "haha", age: 30}
```

### Object.isExtensible()
 
 判断对象是否是可扩展的，Object.preventExtensions，Object.seal 或 Object.freeze 方法都可以标记一个对象为不可扩展（non-extensible）


### Object.seal()
Object.seal() 方法可以让一个对象密封，并返回被密封后的对象。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出TypeError 异常. 不会影响从原型链上继承的属性。但 __proto__ (  ) 属性的值也会不能修改。

```
var obj = {
    prop: function () {},
    foo: "bar"
  };
 
// 可以添加新的属性,已有属性的值可以修改,可以删除
obj.foo = "baz";
obj.lumpy = "woof";
delete obj.prop;
 
var o = Object.seal(obj);
 
assert(o === obj);
assert(Object.isSealed(obj) === true);
 
// 仍然可以修改密封对象上的属性的值.
obj.foo = "quux";
 
// 但你不能把一个数据属性重定义成访问器属性.
Object.defineProperty(obj, "foo", { get: function() { return "g"; } }); // 抛出TypeError异常
 
// 现在,任何属性值以外的修改操作都会失败.
obj.quaxxor = "the friendly duck"; // 静默失败,新属性没有成功添加
delete obj.foo; // 静默失败,属性没有删除成功
 
// ...在严格模式中,会抛出TypeError异常
function fail() {
  "use strict";
  delete obj.foo; // 抛出TypeError异常
  obj.sparky = "arf"; // 抛出TypeError异常
}
fail();
 
// 使用Object.defineProperty方法同样会抛出异常
Object.defineProperty(obj, "ohai", { value: 17 }); // 抛出TypeError异常
Object.defineProperty(obj, "foo", { value: "eit" }); // 成功将原有值改变
```

### Object.isSealed()
判断一个对象是否被密封