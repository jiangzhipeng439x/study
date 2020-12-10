如果需要直接操作 DOM，那么就会用到自定义指令啦。

1 注册
注册自定义指令分为全局注册与局部注册两种：

全局注册：

   Vue.directive('xxx', {
        inserted: function (el) {
           //指令属性
        }
    });
局部注册：

var app = new Vue({
    el: '#app',
    directives: {
        xxx: {
            //指令属性
        }
    }
});
2 属性
自定义指令属性包含这些钩子函数，它们都是可选的：

钩子函数	说明
bind	只调用一次，第一次绑定指令到元素时调用，我们可以在此绑定只执行一次的初始化动作。
inserted	被绑定元素插入父节点时调用（父节点只要存在即可调用，不必存在于 document 中）。
update	无论绑定值是否发生变化，只要被绑定元素所在的模板被更新即可调用。Vue.js 会通过比较更新前后的绑定值，忽略不必要的模板更新操作。
componentUpdated	被绑定元素所在模板完成一次更新周期时调用。
unbind	指令与元素解绑时调用，只调用一次。
假设我们需要自定义一个 v-focus 指令，即在 <input> 或 <textarea> 标签初始化时获得焦点。

html：

<div id="app">
    <input type="text" v-focus>
</div>
js：

//全局注册
Vue.directive('focus', {
    inserted: function (el) {
        el.focus();//聚焦
    }
});

var app = new Vue({
    el: '#app',
    data: {}
});
效果：


这些钩子函数一般包含这些入参：

入参	说明
el	指令所绑定的元素，可利用它直接操作 DOM
binding	绑定对象。（下面会具体说明）
vnode	编译生成的虚拟节点。
oldVnode	上一个虚拟节点，仅在 update 与 componentUpdated 中可用。
绑定对象属性说明：

属性	说明	示例
name	指令名，不包含前缀 v-。	v-focus 中的 focus。
value	指令所绑定的值（计算后）。	v-focus=“1 + 2” 中的 3。
oldValue	指令所绑定的前一个值，无论值是否改变都有值，且仅在 update 与 componentUpdated 中可用。	-
expression	绑定的值的字符串形式（不计算）。	v-focus=“1 + 2” 中的 1 + 2。
arg	传递给指令的参数。	v-focus:xxx 中的 xxx。
modifiers	包含修饰符的对象。	v-focus.a.b 中，为 {a:true, b:true}。
html：

<div id="app2">
    <div v-deniro-directive:content.a.b="content"></div>
</div>
js：

Vue.directive('deniro-directive', {
    bind: function (el, binding, vnode) {
        var keys = [];
        for (var i in vnode) {
            keys.push(i);
        }

        el.innerHTML =
            'names:' + binding.name + '<br>' +
            'value:' + binding.value + '<br>' +
            'expression:' + binding.expression + '<br>' +
            'arg:' + binding.arg + '<br>' +
            'modifiers:' + JSON.stringify(binding.modifiers) + '<br>' +
            'vnode keys:' + keys.join(', ');
    }
});
var app2 = new Vue({
    el: '#app2',
    data: {
        content: '养生吃枸杞，选对的别选贵的！'
    }
});

渲染结果：

names:deniro-directive
value:养生吃枸杞，选对的别选贵的！
expression:content
arg:content
modifiers:{"a":true,"b":true}
vnode keys:tag, data, children, text, elm, ns, context, functionalContext, key, componentOptions, componentInstance, parent, raw, isStatic, isRootInsert, isComment, isCloned, isOnce

我们可以在 bind 中绑定一些事件（addEventListener），然后在 unbind 中解绑一些事件（removeEventListener）。比如让某个元素随着鼠标移动。

3 多值入参
我们可以通过 JavaScript 的对象字面量，为自定义指令一次性传入多个值。其实任意一个合法的 JavaScript 表达式都是支持的。

html：

<div id="app3">
    <div v-deniro-directive2="{title:'物理学家新发现四起黑洞相撞事件',content:'物理学家探测到了它们向地球发来的引力波'}"></div>
</div>
js：

Vue.directive('deniro-directive2', {
    bind: function (el, binding, vnode) {

        el.innerHTML =
            'title:' + binding.value.title + '<br>' +
            'content:' + binding.value.content + '<br>';
    }
});
var app3 = new Vue({
    el: '#app3',
    data: {
    }
});

作者：deniro
链接：https://www.jianshu.com/p/c5de3aa0c465
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。