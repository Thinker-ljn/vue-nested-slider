<template>
  <div class="tab-slider">
    <div
      ref="prevPage"
      class="tab-slider__out-of-screen tab-slider__out-of-screen--left">
      <PositionProvider v-if="prevView" :view="prevView" position="left"/>
    </div>
    <transition :name="transitionName">
      <router-view v-if="!viewPosition"
        v-bind="$attrs"
        class="tab-slider__content"
        ref="currentPage"
        @touchstart.native="onTouchStart">
      </router-view>
      <PositionProvider v-if="viewComponent" :view="viewComponent" :position="viewPosition"/>
    </transition>
    <div
      ref="nextPage"
      class="tab-slider__out-of-screen tab-slider__out-of-screen--right">
      <PositionProvider v-if="nextView" :view="nextView" position="right"/>
    </div>
  </div>
</template>

<script>
import PositionProvider from './position-provider.vue'
import sliders, { elTranslate } from './slider'
export default {
  components: {
    PositionProvider,
  },
  data () {
    return {
      sliders: sliders,
      transitionName: '',
      isDragedSlide: false,

      currView: null,
      prevView: null,
      nextView: null,
      isFirst: false,
      isLast: false,
    }
  },
  inject: {
    positionProvider: { default: () => {return {position: ''}} }
  },
  computed: {
    viewPosition () {
      return this.positionProvider.position
    },
    viewRouteName () {
      return this.positionProvider.routeName
    },
    viewComponent () {
      // 当前页不在主页面时（在左或右）保持其状态以及子组件状态
      const routeInfo = this.sliders.routeMap[this.viewRouteName]
      if (!routeInfo) {return null}
      const {currChildIndex, route} = routeInfo
      if (currChildIndex > -1 && route.children && route.children.length) {
        return route.children[currChildIndex]
      }
      return this.viewPosition === 'left' ? routeInfo.lastChild : routeInfo.firstChild
    }
  },
  mounted () {
    this.maxMoveDistance = window.innerWidth

    this.initCurrInfo()
  },
  watch: {
    $route (to, from) {
      this.initCurrInfo()
      const minDeep = this.sliders.getMinDeep(to, from)
      if (!this.isDragedSlide && this.currView && minDeep === this.currView.deep) {
        const toConfig = this.sliders.routeMap[to.name]
        const fromConfig = this.sliders.routeMap[from.name]
        this.transitionName = toConfig.pos < fromConfig.pos ? 'slide-right' : 'slide-left'
      } else {
        this.transitionName = ''
      }
      this.isDragedSlide = false
    }
  },
  methods: {
    initCurrInfo () {
      return new Promise((resolve, reject) => {
        const self = this
        requestAnimationFrame(function tryInit () {
          const currPage = self.$refs.currentPage
          if (currPage) {
            const match = self.$route.matched.find(match => match.instances.default === currPage)
            if (match) {
              self.currView = self.sliders.routeMap[match.name]
              self.prevView = self.currView.prev
              self.nextView = self.currView.next
              self.isFirst = !self.prevView
              self.isLast = !self.nextView
              resolve(self)
            } else {
              reject(new Error('cannot match route'))
            }
          } else {
            requestAnimationFrame(tryInit)
          }
        })
      })
    },
    updateRouter(el, component, toLeft) {
      if (this.isDragedSlide) {
        const { name, path } = component

        if (name === this.$route.name) {
          return
        }
        name ? this.$router.push({name}) : this.$router.push(path)
        el.style.transform = ''
        el.style.transitionDuration = '0s'
      }
    },
    onTouchStart (ev) {
      // 不是第一或最后一页面，可滑动，不冒泡。
      if (!this.isFirst && !this.isLast) {
        ev.stopPropagation()
      }
      let stopSlide = false
      const startTime = Date.now()
      const t = ev.changedTouches[0]
      let movement = 0
      let toLeft
      const centerEl = ev.currentTarget
      let toCenterEl
      let toCenterComp
      const move = (ev) => {
        const mt = ev.changedTouches[0]
        if (!mt) {
          return
        }
        movement = mt.pageX - t.pageX
        if (movement === 0) {
          // 不是水平方向，停止滑动
          stopSlide = true
          return
        }
        toLeft = movement < 0
        const toRight = !toLeft
        if (this.isFirst && toRight || this.isLast && toLeft) {
          // 禁止第一页向右滑或最后一页向左滑
          stopSlide = true
          return
        } else {
          // 其他情况允许滑动，不冒泡
          ev.stopPropagation()
        }
        toCenterEl = this.$refs[toLeft ? 'nextPage' : 'prevPage']
        toCenterComp = toLeft ? this.nextView : this.prevView
        elTranslate(toCenterEl, {x: movement})
        elTranslate(centerEl, {x: movement})
        this.sliders.emit('translate', {
          from: this.currView.route,
          to: toCenterComp,
          movement,
          rate: movement / this.maxMoveDistance
        })
      }
      const end = () => {
        if (!toCenterComp || !toCenterEl) {
          removeEvent()
          return 
        }
        const touchTime = Date.now() - startTime
        const absMv = Math.abs(movement)
        const signFactor = movement / absMv
        let moveDistance
        if (!stopSlide && (absMv > this.maxMoveDistance / 2 || 
          (touchTime < 150 && absMv > this.maxMoveDistance / 10))
        ) {
          moveDistance = signFactor * this.maxMoveDistance
          this.isDragedSlide = true
          setTimeout(() => {
            this.updateRouter(toCenterEl, toCenterComp, toLeft)
          }, 200)
        } else {
          moveDistance = 0
        }
        elTranslate(centerEl, {x: moveDistance}, {
          transitionDuration: '.2s'
        })
        elTranslate(toCenterEl, {x: moveDistance}, {
          transitionDuration: '.2s'
        })
        this.sliders.emit('translateend', {
          from: this.currView.route,
          to: toCenterComp,
          movement: moveDistance,
          rate: moveDistance / this.maxMoveDistance
        })
        function removeEvent () {
          centerEl.removeEventListener('touchmove', move)
          centerEl.removeEventListener('touchend', end)
        }
        removeEvent()
      }

      centerEl.addEventListener('touchmove', move)
      centerEl.addEventListener('touchend', end)
    }
  }
}
</script>
<style>
.tab-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tab-slider__content {
  position: absolute;
  height: 100%;
  width: 100%;
}
.tab-slider__content.slide-left-enter, 
.tab-slider__content.slide-right-leave-to {
  transform: translateX(100%)
}
.tab-slider__content.slide-left-enter-active, 
.tab-slider__content.slide-left-leave-active {
  transition: transform linear .2s
}
.tab-slider__content.slide-right-enter, 
.tab-slider__content.slide-left-leave-to {
  transform: translateX(-100%)
}
.tab-slider__content.slide-right-enter-active, 
.tab-slider__content.slide-right-leave-active {
  transition: transform linear .2s
}
.tab-slider__out-of-screen {
  position: absolute;
  width: 100%;
  height: 100%;
}
.tab-slider__out-of-screen>:first-child {
  height: 100%;
}
.tab-slider__out-of-screen.tab-slider__out-of-screen--left {
  left: -100%;
}
.tab-slider__out-of-screen.tab-slider__out-of-screen--right {
  right: -100%;
}
</style>