import './assets/main.css'
import 'quasar/src/css/index.sass'
import './assets/overrides.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Notify, Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import BaseBtn from './components/base/BaseBtn.vue'

const app = createApp(App)
app.use(Quasar, {
  plugins: { Notify },
  config: {
    dark: false,
    notify: {}, // default set of options for Notify Quasar plugin
    loading: {}, // default set of options for Loading Quasar plugin
    loadingBar: {}, // settings for LoadingBar Quasar plugin
  },
})
app.use(createPinia())
app.use(router)
app.component('BaseBtn', BaseBtn)

app.mount('#app')
