<template>
    <v-container fluid>
      <v-row>
        <v-col v-for="(card, i) in estatisticasCards" :key="i" cols="12" md="3" sm="6">
          <v-card class="mx-auto" :color="card.color" dark height="100%">
            <v-card-text>
              <div class="text-h4 text-center">{{ card.value }}</div>
              <div class="text-subtitle-1 text-center">{{ card.title }}</div>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-icon large>{{ card.icon }}</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'EstatisticasBasicas',
    props: {
      doadores: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      estatisticasCards() {
        if (!this.doadores || this.doadores.length === 0) {
          return [
            { title: 'Total de Doadores', value: 0, icon: 'mdi-account-group', color: 'primary' },
            { title: 'Média de Idade', value: 0, icon: 'mdi-calendar-clock', color: 'secondary' },
            { title: 'Homens', value: 0, icon: 'mdi-gender-male', color: 'accent' },
            { title: 'Mulheres', value: 0, icon: 'mdi-gender-female', color: 'error' }
          ];
        }
        
        const homens = this.doadores.filter(d => d.sexo === 'Masculino').length;
        const mulheres = this.doadores.filter(d => d.sexo === 'Feminino').length;
        
        const hoje = new Date();
        const idades = this.doadores.map(d => {
          const partesData = d.data_nasc.split('/');
          if (partesData.length !== 3) return 0;
          
          const dataNasc = new Date(
            parseInt(partesData[2]), 
            parseInt(partesData[1]) - 1, 
            parseInt(partesData[0])
          );
          
          let idade = hoje.getFullYear() - dataNasc.getFullYear();
          const mesAtual = hoje.getMonth();
          const diaAtual = hoje.getDate();
          const mesNasc = dataNasc.getMonth();
          const diaNasc = dataNasc.getDate();
          
          if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
            idade--;
          }
          
          return idade;
        });
        
        const mediaIdade = idades.length > 0 
          ? Math.round(idades.reduce((a, b) => a + b, 0) / idades.length) 
          : 0;
        
        return [
          { title: 'Total de Doadores', value: this.doadores.length, icon: 'mdi-account-group', color: 'primary' },
          { title: 'Média de Idade', value: mediaIdade, icon: 'mdi-calendar-clock', color: 'secondary' },
          { title: 'Homens', value: homens, icon: 'mdi-gender-male', color: 'accent' },
          { title: 'Mulheres', value: mulheres, icon: 'mdi-gender-female', color: 'error' }
        ];
      }
    }
  };
  </script>