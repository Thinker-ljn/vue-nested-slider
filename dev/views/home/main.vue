<template>
  <div class="home">
    <header>
      <router-link class="menu-item"
       v-for="route in routes"
       :to="{name: route}"
       :class="{actived: route == currMatch.name}"
       :key="route"
       >
        {{route}}
      </router-link>
    </header>
    <slider-view class="home-slider"></slider-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routes: ['first', 'second', 'third'],
    }
  },
  computed: {
    currMatch () {
      return this.$route.matched[1] || {}
    }
  }
}
</script>
<style scoped>
.home {
  display: flex;
  flex-direction: column;
}
.home-slider {
  flex: 1
}
header {
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