<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6 text-center">Estatísticas do Banco de Sangue</h1>
        </v-col>
      </v-row>
  
      <v-row v-if="loading">
        <v-col cols="12" class="text-center">
          <v-progress-circular 
            indeterminate 
            color="primary" 
            size="64"
          ></v-progress-circular>
          <div class="mt-4">Carregando estatísticas...</div>
        </v-col>
      </v-row>
  
      <v-row v-else>
        <v-col cols="12">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="text-h6">
              <v-icon start>mdi-map-marker</v-icon>
              Doadores por Estado
            </v-card-title>
            <v-card-text>
              <v-chart class="chart-wide" :option="estadosChartOption" />
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="text-h6">
              <v-icon start>mdi-scale-balance</v-icon>
              IMC Médio por Faixa Etária
            </v-card-title>
            <v-card-text>
              <v-chart class="chart" :option="imcChartOption" />
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="text-h6">
              <v-icon start>mdi-human-male-female</v-icon>
              Percentual de Obesos por Gênero
            </v-card-title>
            <v-card-text>
              <v-chart class="chart" :option="obesosChartOption" />
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="text-h6">
              <v-icon start>mdi-water</v-icon>
              Média de Idade por Tipo Sanguíneo
            </v-card-title>
            <v-card-text>
              <v-chart class="chart-wide" :option="idadeChartOption" />
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12">
          <v-card elevation="2" id="doadores-receptor-card">
            <v-card-title class="text-h6">
              <v-icon start>mdi-blood-bag</v-icon>
              Quantidade de Possíveis Doadores por Tipo Receptor
            </v-card-title>
            <v-card-text>
              <v-tabs 
                v-model="activeTab" 
                @update:modelValue="handleTabChange"
                :show-arrows="true"
              >
                <v-tab 
                  v-for="tipoSanguineo in Object.keys(estatisticas.quantidadeDoadoresPorReceptor || {})" 
                  :key="tipoSanguineo" 
                  :value="tipoSanguineo"
                >
                  {{ tipoSanguineo }}
                </v-tab>
              </v-tabs>
              <v-window v-model="activeTab">
                <v-window-item 
                  v-for="(receptores, tipoSanguineo) in estatisticas.quantidadeDoadoresPorReceptor || {}" 
                  :key="tipoSanguineo"
                  :value="tipoSanguineo"
                >
                  <div class="pa-2">
                    <v-chart class="chart-taller" :option="getDoadoresChartOption(tipoSanguineo, receptores)" autoresize />
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { PieChart, BarChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  } from 'echarts/components';
  import VChart from 'vue-echarts';
  
  use([
    CanvasRenderer,
    PieChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  ]);
  
  export default {
    name: 'EstatisticasPage',
    components: {
      VChart
    },
    setup() {
      const loading = ref(true);
      const estatisticas = ref({
        quantidadePorEstado: [],
        imcMedioPorFaixaEtaria: [],
        percentualObesos: { percentualHomens: 0, percentualMulheres: 0 },
        mediaIdadePorTipoSanguineo: [],
        quantidadeDoadoresPorReceptor: {}
      });
      const activeTab = ref(null);
  
      const fetchData = async () => {
        try {
          loading.value = true;
          const response = await axios.get('http://localhost:8080/api/doadores/estatisticas');
          estatisticas.value = response.data;
          if (Object.keys(estatisticas.value.quantidadeDoadoresPorReceptor || {}).length > 0) {
            activeTab.value = Object.keys(estatisticas.value.quantidadeDoadoresPorReceptor)[0];
          }
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const handleTabChange = () => {
        setTimeout(() => {
          const cardElement = document.getElementById('doadores-receptor-card');
          if (cardElement) {
            const yOffset = -20;
            const y = cardElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }
        
          window.dispatchEvent(new Event('resize'));
        }, 50);
      };
  
      const estadosChartOption = computed(() => ({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          bottom: 10,
          left: 'center',
          itemWidth: 25,
          itemHeight: 14
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '3%',
          containLabel: true
        },
        series: [
          {
            name: 'Doadores por Estado',
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}',
              position: 'outside'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
                formatter: '{b}: {c} ({d}%)'
              }
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10
            },
            data: estatisticas.value.quantidadePorEstado.map(item => ({
              name: item.estado,
              value: item.quantidade
            }))
          }
        ]
      }));
  
      const imcChartOption = computed(() => ({
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return `${params[0].name} anos: ${params[0].value.toFixed(2)}`;
          }
        },
        xAxis: {
          type: 'category',
          data: estatisticas.value.imcMedioPorFaixaEtaria.map(
            item => `${item.faixaInicial}-${item.faixaFinal}`
          )
        },
        yAxis: {
          type: 'value',
          name: 'IMC Médio',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            data: estatisticas.value.imcMedioPorFaixaEtaria.map(item => item.imcMedio),
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            },
            type: 'bar',
            itemStyle: {
              color: function(params) {
                const imcValue = params.value;
                if (imcValue < 18.5) return '#91CA64'; 
                if (imcValue < 25) return '#6495ED';   
                if (imcValue < 30) return '#FFA500';  
                return '#FF6347'; 
              }
            }
          }
        ]
      }));
  
      const obesosChartOption = computed(() => ({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}%'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        series: [
          {
            name: 'Percentual de Obesos',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
                show: true,
                formatter: '{c}%',
                position: 'outside'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
                formatter: '{c}%'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { 
                name: 'Homens', 
                value: estatisticas.value.percentualObesos.percentualHomens,
                itemStyle: { color: '#6495ED' }
              },
              { 
                name: 'Mulheres', 
                value: estatisticas.value.percentualObesos.percentualMulheres,
                itemStyle: { color: '#FF69B4' }
              }
            ]
          }
        ]
      }));
  
      const idadeChartOption = computed(() => ({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: estatisticas.value.mediaIdadePorTipoSanguineo.map(
            item => item.tipoSanguineo
          )
        },
        yAxis: {
          type: 'value',
          name: 'Idade Média'
        },
        series: [
          {
            data: estatisticas.value.mediaIdadePorTipoSanguineo.map(item => item.mediaIdade),
            label: {
              show: true,
              position: 'top',
              formatter: '{c}'
            },
            type: 'bar',
            itemStyle: {
              color: function(params) {
                const bloodTypeColors = {
                  'A+': '#FF6347',
                  'A-': '#FF9E83',
                  'B+': '#4169E1',
                  'B-': '#87CEFA',
                  'AB+': '#9932CC',
                  'AB-': '#DDA0DD',
                  'O+': '#2E8B57',
                  'O-': '#90EE90'
                };
                return bloodTypeColors[estatisticas.value.mediaIdadePorTipoSanguineo[params.dataIndex].tipoSanguineo] || '#5470C6';
              }
            }
          }
        ]
      }));
  
      const getDoadoresChartOption = (tipoReceptor, doadoresData) => {
        return {
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c} doadores'
          },
          xAxis: {
            type: 'category',
            data: doadoresData.map(item => item.tipoSanguineo)
          },
          yAxis: {
            type: 'value',
            name: 'Quantidade de Doadores'
          },
          series: [
            {
              data: doadoresData.map(item => item.quantidade),
              label: {
                show: true,
                position: 'top',
                formatter: '{c}'
              },
              type: 'bar',
              itemStyle: {
                color: function(params) {
                  const bloodTypeColors = {
                    'A+': '#FF6347',
                    'A-': '#FF9E83',
                    'B+': '#4169E1',
                    'B-': '#87CEFA',
                    'AB+': '#9932CC',
                    'AB-': '#DDA0DD',
                    'O+': '#2E8B57',
                    'O-': '#90EE90'
                  };
                  return bloodTypeColors[doadoresData[params.dataIndex].tipoSanguineo] || '#5470C6';
                }
              }
            }
          ]
        };
      };
  
      onMounted(() => {
        fetchData();
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 300);
      });
  
      return {
        loading,
        estatisticas,
        activeTab,
        handleTabChange,
        estadosChartOption,
        imcChartOption,
        obesosChartOption,
        idadeChartOption,
        getDoadoresChartOption
      };
    }
  };
  </script>
  
  <style scoped>
  .chart {
    height: 300px;
    width: 100%;
  }
  
  .chart-wide {
    height: 400px;
    width: 100%;
  }
  
  .chart-taller {
    height: 400px;
    width: 100%;
  }
  
  .chart-container {
    width: 100%;
    height: 450px;
    position: relative;
    padding: 8px;
  }
  </style>