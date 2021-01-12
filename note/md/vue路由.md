通过改变 URL，在不重新请求页面的情况下，更新页面视图。
更新视图但不重新请求页面，是前端路由原理的核心之一，目前在浏览器环境中这一功能的实现主要有2种方式：

　　　　1.Hash --- 利用 URL 中的hash("#");

　　　　2.利用 History interface 在HTML5中新增的方法。

Vue 中，它是通过 mode 这一参数控制路由的实现模式：
```
const router=new VueRouter({
    mode:'history',
    routes:[...]
})
```

源码
```
export default class VueRouter{
  mode: string; // 传入的字符串参数，指示history类别
  history: HashHistory | HTML5History | AbstractHistory; // 实际起作用的对象属性，必须是以上三个类的枚举
  fallback: boolean; // 如浏览器不支持，'history'模式需回滚为'hash'模式
  
  constructor (options: RouterOptions = {}) {
    
    let mode = options.mode || 'hash' // 默认为'hash'模式
    this.fallback = mode === 'history' && !supportsPushState // 通过supportsPushState判断浏览器是否支持'history'模式
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract' // 不在浏览器环境下运行需强制为'abstract'模式
    }
    this.mode = mode

    // 根据mode确定history实际的类并实例化
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  init (app: any /* Vue component instance */) {
    
    const history = this.history

    // 根据history的类别执行相应的初始化操作和监听
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }

  // VueRouter类暴露的以下方法实际是调用具体history对象的方法
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.replace(location, onComplete, onAbort)
  }
}
```
mode 参数：
　　　　1.默认 hash

　　　　2. history。如果浏览器不支持 history 新特性，则采用 hash

　　　　3. 如果不在浏览器环境下，就采用 abstract（Node环境下）

mode 区别：
1. mode:"hash"  多了 “#”
```
http://localhost:8080/#/login
```
2. mode:"history" 
```
http://localhost:8080/recommend
```
HashHistory:
　　　　hash("#") 的作用是加载 URL 中指示网页中的位置。

　　　　# 本身以及它后面的字符称职位 hash，可通过 window.location.hash 获取

　　　　特点：
　　　　　　1. hash 虽然出现在 url 中，但不会被包括在 http 请求中，它是用来指导浏览器动作的，对服务器端完全无用，因此，改变 hash 不会重新加载页面。

　　　　　　2. 可以为 hash 的改变添加监听事件：
```
window.addEventListener("hashchange",funcRef,false)
```

3. 每一次改变 hash(window.localtion.hash)，都会在浏览器访问历史中增加一个记录。

利用 hash 的以上特点，就可以来实现前端路由"更新视图但不重新请求页面"的功能了。

HashHistory 拥有两个方法，一个是 push， 一个是 replace
```
两个方法：HashHistory.push() 和 HashHistory.replace()
```
HashHistory.push()  将新路由添加到浏览器访问历史的栈顶
```
HashHisttory.push()
```
解析
```
1 $router.push() //调用方法

2 HashHistory.push() //根据hash模式调用,设置hash并添加到浏览器历史记录（添加到栈顶）（window.location.hash= XXX）

3 History.transitionTo() //监测更新，更新则调用History.updateRoute()

4 History.updateRoute() //更新路由

5 {app._route= route} //替换当前app路由

6 vm.render() //更新视图
```
transitionTo() 方法是父类中定义的是用来处理路由变化中的基础逻辑的，push() 方法最主要的是对 window 的 hash 进行了直接赋值：
```
window.location.hash=route.fullPath
```
hash 的改变会自动添加到浏览器的访问历史记录中。
那么视图的更新是怎么实现的呢，我们来看看父类 History 中的 transitionTo() 方法：
```
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const route = this.router.match(location, this.current)
  this.confirmTransition(route, () => {
    this.updateRoute(route)
    ...
  })
}

updateRoute (route: Route) {
  
  this.cb && this.cb(route)
  
}

listen (cb: Function) {
  this.cb = cb
}
```
可以看到，当路由变化时，调用了Hitory中的this.cb方法，而this.cb方法是通过History.listen(cb)进行设置的，回到VueRouter类定义中，找到了在init()中对其进行了设置：
```
init (app: any /* Vue component instance */) {
    
  this.apps.push(app)

  history.listen(route => {
    this.apps.forEach((app) => {
      app._route = route
    })
  })
}
```
HashHistory.replace()

replace()方法与push()方法不同之处在于，它并不是将新路由添加到浏览器访问历史的栈顶，而是替换掉当前的路由

```
HashHisttory.replace()
```



HTML5History
　　　　History interface 是浏览器历史记录栈提供的接口，通过back()、forward()、go()等方法，我们可以读取浏览器历史记录栈的信息，进行各种跳转操作。

　　　　从 HTML5开始，History interface 提供了2个新的方法：pushState()、replaceState() 使得我们可以对浏览器历史记录栈进行修改：
```
window.history.pushState(stateObject,title,url)
window.history,replaceState(stateObject,title,url)
```
stateObject：当浏览器跳转到新的状态时，将触发 Popstate 事件，该事件将携带这个 stateObject 参数的副本

　　　　title：所添加记录的标题

　　　　url：所添加记录的 url

　　　　

　　　　这2个方法有个共同的特点：当调用他们修改浏览器历史栈后，虽然当前url改变了，但浏览器不会立即发送请求该url，这就为单页应用前端路由，更新视图但不重新请求页面提供了基础

　　　　

　　　　1.push

　　　　　　与hash模式类似，只是将window.hash改为history.pushState

　　　　2.replace

　　　　　　与hash模式类似，只是将window.replace改为history.replaceState

　　　　3.监听地址变化

　　　　　　在HTML5History的构造函数中监听popState（window.onpopstate）

```
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}

replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    replaceState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}

// src/util/push-state.js
export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

export function replaceState (url?: string) {
  pushState(url, true)
}
```
两种模式比较
pushState设置的新URL可以是与当前URL同源的任意URL；而hash只可修改#后面的部分，故只可设置与当前同文档的URL

pushState通过stateObject可以添加任意类型的数据到记录中；而hash只可添加短字符串

pushState可额外设置title属性供后续使用

history模式则会将URL修改得就和正常请求后端的URL一样,如后端没有配置对应/user/id的路由处理，则会返回404错误