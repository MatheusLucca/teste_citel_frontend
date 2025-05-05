import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CadastroDoadores from '../components/CadastroDoadores.vue'
import Estatisticas from '../views/Estatisticas.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: CadastroDoadores
  },
  {
    path: '/estatisticas',
    name: 'Estatisticas',
    component: Estatisticas


  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router