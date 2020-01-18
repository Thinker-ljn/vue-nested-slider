<template>
  <component :is="component" class="position-provider"></component>
</template>

<script>
import Vue from 'vue';
export default {
  data () {
    return {
      viewName: ''
    }
  },
  props: {
    position: {default: ''},
    view: {default: null},
  },
  computed: {
    routeName: {
      cache: false,
      get () {
        return this.view && this.view.name
      }
    },
    component () {
      return this.view && this.view.component
    }
  },
  provide () {
    const _self = this;
    this._proxyVm = new Vue({
      data() {
        return {
          position: _self.position,
          routeName: _self.routeName,
          viewName: _self.view,
        };
      },
    });
    return {
      positionProvider: this._proxyVm._data,
    }
  },
  mounted () {
    setTimeout(() => {
      this.viewName = this.view && this.view.name
    })
  }
}
</script>
