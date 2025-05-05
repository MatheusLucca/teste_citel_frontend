<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Sistema de Banco de Sangue</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="$router.push('/')">
        <v-icon left>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn text @click="$router.push('/cadastro')">
        <v-icon left>mdi-account-plus</v-icon>
        Cadastro
      </v-btn>
      <v-btn text @click="$router.push('/estatisticas')">
        <v-icon left>mdi-chart-bar</v-icon>
        Estatísticas
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app color="primary" dark>
      <span>&copy; {{ new Date().getFullYear() }} - Sistema de Banco de Sangue</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
  }),
};
</script>