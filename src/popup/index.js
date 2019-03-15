import Vue from 'vue'
import root from './root.vue'
import {Card, Row, Col} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../assets/scss/app.scss'

Vue.config.productionTip = false
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

/* eslint-disable no-new */
new Vue({
    el: '#root',
    render: h => h(root)
})
