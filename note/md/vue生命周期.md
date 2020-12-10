<body>
    <div id="app">
        <h3 id="h3">{{msg}}</h3>
        <input type="button" value="修改msg" @click="msg='No'">
    </div>
    <script>
        var vm = new Vue({
            el:'#app',
            data:{
                msg:'ok',
            },
            methods:{
                show(){
                    console.log('执行了show方法')
                }
            },
**组件创建期间的4个钩子函数**
 一、第一个生命周期函数，表示实例完全被创建之前，会执行这个函数
     在beforeCreate生命周期函数执行的时候，data 和 methods 中的数据还没有被初始化

            beforeCreate() {   
                 console.log(this.msg)   //undefind
                 this.show()   //is not defind
            },

 二、第二个生命周期函数
     在 created 中，data 和 methods 都已经被初始化好了！
     如果要调用 methods 中的方法，或者操作 data 中的数据，最早，只能在 created 中操作

            created() {    
                console.log(this.msg)   //ok
                this.show()        //执行了show方法
            },

 三、第三个生命周期函数，表示模板已经在内存中编译完成，但是尚未把模板渲染到页面中
     在beforeMount执行的时候，页面中的元素没有被真正替换过来，知识之前写的一些模板字符串

            beforeMount() {  
                console.log(document.getElementById('h3').innerText)  //{{msg}}
            }, 

 四、第四个生命周期函数，表示内存中的模板已经真实的挂载到页面中，用户已经可以看到渲染好的页面
     这个mounted是实例创建期间的最后一个生命周期函数，当执行完 mounted 就表示，实例已经被完
     全创建好了，此时，如果没有其它操作的话，这个实例，就静静地在内存中不动
            mounted() {    
                console.log(document.getElementById('h3').innerText)   //ok
            }, 

**组件运行阶段的2个钩子函数**
 五、第五个生命周期函数，表示 界面还没有被更新，但是数据肯定被更新了
     得出结论：当执行 beforeUpdate 的时候，页面中的显示的数据，还是旧的，此时data 数据是最
              新的，页面尚未和 最新的数据保持同步
            beforeUpdate() { 
                console.log('界面上元素的内容'+ document.getElementById('h3').innerText)  //没有执行，因为数据没改变
                console.log('data 中的msg数据是：' + this.msg)
            },

 六、第六个生命周期函数
     updated事件执行的时候，页面和 data 数据已经保持同步了，都是最新的
     updated() {
        console.log('界面上元素的内容'+ document.getElementById('h3').innerText)   //No
        console.log('data 中的msg数据是：' + this.msg)   //No
     },

 **第七个 和 第八个销毁阶段的函数在上面的图片中**

  })
    </script>
</body>


1、在beforeCreate和created钩子函数之间的生命周期

　　在这个生命周期之间，进行初始化事件，进行数据的观测，可以看到在created的时候数据已经和data属性进行绑定（放在data中的属性当值发生改变的同时，视图也会改变）。

　　注意：此时还是没有el选项

2、created钩子函数和beforeMount间的生命周期

　　在这一阶段发生的事情还是比较多的。

　　首先，会判断对象是否有el选项：如果有的话就继续向下编译，如果没有el选项，则停止编译，也就意味着停止了生命周期，直到在该vue实例上调用vm.$mount(el)。

　　测试：此时注释掉代码中:el选项，发现执行到created的时候就停止了：



　　如果我们在后面继续调用vm.$mount(el)，可以发现代码继续向下执行了

 

　　然后，我们往下看，template参数选项的有无对生命周期的影响。

　　（1）如果vue实例对象中有template参数选项，则将其作为模板编译成render函数。

　　（2）如果没有template选项，则将外部HTML作为模板编译。

　　（3）可以看到template中的模板优先级要高于outer HTML的优先级。

　　如果在HTML结构中增加了一串html，在vue对象中增加template选项：会发现显示template中的内容，如果注释到template选择，则才显示html中的内容。

　　在vue对象中还有一个render函数，它是以createElement作为参数，然后做渲染操作，而且我们可以直接嵌入JS

new Vue({
    el: '#app',
    render: function(createElement) {
        return createElement('h1', 'this is createElement')
    }
})//渲染h1标签元素
　　所以综合排名优先级：render函数选项 > template选项 > outer HTML

3、beforeMount和mounted 钩子函数间的生命周期

 　　可以看到此时是给vue实例对象添加$el成员，并且替换掉挂在的DOM元素。因为在之前console中打印的结果可以看到beforeMount之前el上还是undefined。

4、mounted

 　　在mounted之前p中还是通过{{message}}进行占位的，因为此时还没有挂在到页面上，还是JavaScript中的虚拟DOM形式存在的。在mounted之后可以看到h1中的内容发生了变化。

5、beforeUpdate钩子函数和updated钩子函数间的生命周期

　　当vue发现data中的数据发生了改变，会触发对应组件的重新渲染，先后调用beforeUpdate和updated钩子函数。

　　在beforeUpdate可以监听到data的变化，但是view层没有被重新渲染，view层的数据没有变化。等到updated的时候，view层才被重新渲染，数据更新。

6、beforeDestroy和destroyed钩子函数间的生命周期

　　beforeDestroy钩子函数在实例销毁之前调用。在这一步，实例仍然完全可用。

　　destroyed钩子函数在Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。