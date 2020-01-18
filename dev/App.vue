<template>
  <div id="app">
    <slider-view class="app-slider"></slider-view>
    <footer>
      <router-link class="menu-item"
       v-for="route in routes"
       :to="{name: route}"
       :class="{actived: route == currMatch.name}"
       :key="route"
       >
        {{route}}
      </router-link>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routes: ['home', 'about', 'mine'],
    }
  },
  computed: {
    currMatch () {
      return this.$route.matched[0] || {}
    }
  }
}
</script>
<style scoped>
.app-slider {
  flex: 1
}
footer {
  display: flex;
  height: 2rem;
  background: #fff;
}
.menu-item {
  flex: 1;
  font-size: 1rem;
}
.menu-item.actived {
  color: #ffa04c;
}
</style>

<style>
body, html {
  width: 100%;
  height: 100%;
  margin: 0;
  font-size: 16px;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}
</style>