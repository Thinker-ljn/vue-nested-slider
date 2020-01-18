import Vue from 'vue'
const eventBus = new Vue()
const sliders = {
  getMinDeep,
  on (...args) {
    eventBus.$on(...args)
  },
  off (...args) {
    eventBus.$off(...args)
  },
  emit (...args) {
    eventBus.$emit(...args)
  }
}

export function genSliderConfig (routes, deep) {
  deep = deep < 1 ? 1 : deep
  sliders.routeList = []
  sliders.routeMap = {}

  const gen = (rs, parent = null, dp = 1) => {
    const len = rs.length
    for (let i = 0; i < len; i++) {
      const route = rs[i]

      const prev = rs[i - 1]
      const next = rs[i + 1]

      const routeConfig = sliders.routeMap[route.name] = {
        route,
        parent,
        prev,
        next,
        isFirst: parent ? parent.firstChild.component === route: void 0,
        isLast: parent ? parent.lastChild.component === route: void 0,
        pos: parent ? parent.pos + '-' + i : i + '',
        deep: dp
      }
      if (dp < deep && route.children && route.children.length) {
        routeConfig.firstChild = route.children[0]
        routeConfig.lastChild = route.children[route.children.length - 1]
        gen(route.children, routeConfig, dp + 1)
      }
    }
  }

  gen(routes)
}

function getMinDeep (to, from) {
  const toConfig = sliders.routeMap[to.name]
  const fromConfig = sliders.routeMap[from.name]

  const minDp = Math.min(toConfig.deep, fromConfig.deep)
  return minDp
}

export function elTranslate(el, movement, options) {
  const {x = 0, y = 0} = movement
  // console.log(el)
  if (!el) return
  const defaultOptions = {
    useTransfrom: true,
    transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    transitionDuration: '0s',
    unit: 'px'
  }

  const fianlOptions = {...defaultOptions, ...options}
  const u = fianlOptions.unit
  if (fianlOptions.useTransfrom) {
    el.style.transform = `translate3d(${x}${u},${y}${u},0)`
    el.style.transitionProperty = 'transform'
    el.style.transitionTimingFunction = fianlOptions.transitionTimingFunction
    el.style.transitionDuration = fianlOptions.transitionDuration
  } else {
    el.style.left = x + u
    el.style.top = y + u
  }
}

export default sliders
