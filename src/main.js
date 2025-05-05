import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import '@mdi/font/css/materialdesignicons.css'


axios.defaults.baseURL = 'http://localhost:8080'

const app = createApp(App)

app.use(router)
app.use(vuetify)


app.mount('#app')