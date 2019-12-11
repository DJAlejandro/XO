## 1. 页面滚动


如果希望路由切换时，页面滚动到指定位置，分两种情况实现


1) 整体页面（html）滚动到指定位置

使用前端路由，当切换到新路由时，想要**页面**滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。



```
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```


**也就是说scrollBehavior的行为针对的是页面根节点，如果滚动的对象是其中的一个组件，那么scrollBehavior就不起作用了，这时就需要第二种实现方法**


2) 页面组件滚动到指定位置


**如果滚动的对象是一个组件，就需要通过手动触发自定义事件，在组件内监听，手动将DOM的scrollTop置为固定值的方式实现**


当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。

复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象：


```
...
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      this.$emit("scroll-top");
    }
  },
  mounted() {
    this.$emit("scroll-top");
  }
}
...
```

**需要注意的是watch (监测变化) $route的出发条件是路由切换前后使用的组件相同，如果路由切换前后使用的组件不同，那么触发的是mounted钩子**，所以要在这两个钩子里触发一个scroll-top自定义事件，由希望滚动到指定位置的组件监听该事件，执行滚动操作

```
<template>
  <div id="app">
    <router-view @scroll-top="scrollTop"></router-view>
  </div>
</template>
```

```
...
  methods: {
    scrollTop() {
      this.$refs.content.scrollTop = 0;
    }
  }
...
```


- [vue路由切换时内容组件的滚动条回到顶部](https://blog.csdn.net/weixin_30925411/article/details/101078816)


## 2.嵌套路由


这个例子将所有自定义事件scroll-top监听在根组件的router-view元素上的原理是嵌套路由


组件AlbumDetail，ArtistDetail所在路由的路径path: '/album'，path: '/artist'和根组件Home的路径path: '/'在同一层级中，所以它们公用根组件的router-view元素。在这些组件内触发的自定义事件都能被根组件监听。另外，这些组件在HTML结构上渲染的位置和HOME组件相同。这样我们才会看到在切换路由前后，不同组件渲染的位置相同，且都触发了scroll-top事件，组件回滚到顶部是效果



