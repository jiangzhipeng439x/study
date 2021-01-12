//监听
事件需要监听才能触发
dom.addEventLisenter('alert',function(){
    alert('成功触发')
})

// 创建
var evt = document.createEvent("HTMLEvents");

HTMLEvents	HTMLEvent	initEvent()
MouseEvents	MouseEvent	initMouseEvent()
UIEvents	UIEvent	initUIEvent()


// 初始化
evt.initEvent("alert", false, false);
 
// 触发, 即弹出文字
dom.dispatchEvent(evt);





二、自定义事件
1、Event
自定义事件的函数有 Event、CustomEvent 和 dispatchEvent  (相当于createEvent和initEvent)
```
window.dispatchEvent(new Event('resize'))
 

// 直接自定义事件，使用 Event 构造函数：
var event = new Event('build');
var elem = document.querySelector('#id')
// 监听事件
elem.addEventListener('build', function (e) { ... }, false);
// 触发事件.
elem.dispatchEvent(event);
```

2、CustomEvent
CustomEvent 可以创建一个更高度自定义事件，还可以附带一些数据，具体用法如下：
```
var myEvent = new CustomEvent(eventname, options);
其中 options 可以是：
{
  detail: {
    ...
  },
  bubbles: true,    //是否冒泡
  cancelable: false //是否取消默认事件
}
```

其中 detail 可以存放一些初始化的信息，可以在触发的时候调用。其他属性就是定义该事件是否具有冒泡等等功能。

内置的事件会由浏览器根据某些操作进行触发，自定义的事件就需要人工触发。
dispatchEvent 函数就是用来触发某个事件：
```
element.dispatchEvent(customEvent);
```
```
// add an appropriate event listener
obj.addEventListener("cat", function(e) { process(e.detail) });
 
// create and dispatch the event
var event = new CustomEvent("cat", {"detail":{"hazcheeseburger":true}});
obj.dispatchEvent(event);
使用自定义事件需要注意兼容性问题，而使用 jQuery 就简单多了：

// 绑定自定义事件
$(element).on('myCustomEvent', function(){});
 
// 触发事件
$(element).trigger('myCustomEvent');
// 此外，你还可以在触发自定义事件时传递更多参数信息：
 
$( "p" ).on( "myCustomEvent", function( event, myName ) {
  $( this ).text( myName + ", hi there!" );
});
$( "button" ).click(function () {
  $( "p" ).trigger( "myCustomEvent", [ "John" ] );
});
```

3、IE浏览器
由于向下很多版本的浏览器都不支持document.createEvent()方法，因此我们需要另辟蹊径（据说IE有document.createEventObject()和event.fireEvent()方法，但是不支持自定义事件~~）。
IE浏览器有不少自给自足的东西，例如下面要说的这个"propertychange"事件，顾名思意，就是属性改变即触发的事件。
例如文本框value值改变，或是元素id改变，或是绑定的事件改变等等。

dom.evtAlert = "2012-04-01";
dom.attachEvent("onpropertychange", function(e) {
    if (e.propertyName == "evtAlert") {
        fn.call(this);
    }
});
dom.evtAlert = Math.random().toString(36).substr(2)

三、自定义事件的删除
与触发事件不同，事件删除，各个浏览器都提供了对应的事件删除方法，如removeEventListener和detachEvent。
不过呢，对于IE浏览器，还要多删除一个事件，就是为了实现触发功能额外增加的onpropertychange事件：

作者：R_X
链接：https://www.jianshu.com/p/5f9027722204
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
dom.detachEvent("onpropertychange", evt);

var fireEvent = function(element,event){ 
   if (document.createEventObject){ 
       // IE浏览器支持fireEvent方法 
       var evt = document.createEventObject(); 
       return element.fireEvent('on'+event,evt) 
   } 
   else{ 
       // 其他标准浏览器使用dispatchEvent方法 
       var evt = document.createEvent( 'HTMLEvents' ); 
       evt.initEvent(event, true, true); 
       return !element.dispatchEvent(evt); 
   } 
}; 
