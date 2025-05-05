<template>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <v-card class="mx-auto" max-width="800">
            <v-img
              height="200"
              src="https://via.placeholder.com/800x200?text=Banco+de+Sangue"
            ></v-img>
            
            <v-card-title class="text-h4 font-weight-bold">
              Bem-vindo ao Sistema de Banco de Sangue
            </v-card-title>
            
            <v-card-text>
              <p class="text-body-1">
                Este sistema permite o cadastro de doadores de sangue e gera estatísticas importantes para análise.
              </p>
              
              <v-divider class="my-4"></v-divider>
              
              <h3 class="text-h5 mb-3">Funcionalidades</h3>
              
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-account-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Cadastro de Doadores</v-list-item-title>
                    <v-list-item-subtitle>Adicione doadores manualmente ou via arquivo JSON</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-chart-bar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Estatísticas</v-list-item-title>
                    <v-list-item-subtitle>Análise de dados dos doadores</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" 
                x-large 
                @click="$router.push('/cadastro')"
              >
                Ir para Cadastro
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn 
                color="secondary" 
                x-large 
                @click="$router.push('/estatisticas')"
              >
                Ver Estatísticas
                <v-icon right>mdi-chart-bar</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
  }
  </script>