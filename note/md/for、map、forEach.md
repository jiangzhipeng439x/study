### 一、for 
for循环是可以被打破的，每一次都会执行，整个函数块共享一个作用域
可以使用break，continue

在for循环中使用async/awit中，会导致每一步都需要等待下一步返回

### 二、map、forEach
map有返回值，这是和forEach最大的区别。
不能被打破，使用async/awit时，会把同步执行完后，再执行异步等待

```
var ary=[1,2,"哈哈","杨洋"];
    ary.forEach(function(item,index,arr) {},ary);

    Array.prototype.myForEach=function (fn,obj) {
        for(var i=0;i<this.length;i++){
            if(typeof obj=="undefined"){
                //obj没有传
                fn(this[i],i,this);
            }else {
                fn.call(obj,this[i],i,this);
            }
        }
    };
    Array.prototype.myMap=function (fn,obj) {
        var arr=[];
        for(var i=0;i<this.length;i++){
            if(typeof obj=="undefined"){
                arr.push(fn(this[i],i,this));
            }else {
                arr.push(fn.call(obj,this[i],i,this));
            }
        }
        return arr;
    };
    console.log(ary.myMap(function (item, index, arr) {
        return 1
    }, ary));
```