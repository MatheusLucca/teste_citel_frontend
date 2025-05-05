<template>
  <v-container>
    <v-card class="mx-auto" max-width="1200px">
      <v-card-title class="text-h5 font-weight-bold primary white--text">
        Sistema de Banco de Sangue - Cadastro de Doadores
      </v-card-title>

      <v-card-text>
        <p class="mb-4">Carregue um arquivo JSON com dados de doadores ou adicione manualmente.</p>
        
        <v-tabs v-model="activeTab">
          <v-tab>Upload de Arquivo</v-tab>
          <v-tab>Cadastro Manual</v-tab>
          <v-tab>Visualizar Dados</v-tab>
          <v-tab>Estatísticas Básicas</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item :value="0">
            <v-card flat>
              <v-card-text>
                <v-file-input
                  v-model="jsonFile"
                  accept="application/json"
                  label="Selecione o arquivo JSON com dados dos doadores"
                  prepend-icon="mdi-file-document"
                  show-size
                  @change="onFileSelected"
                ></v-file-input>
                
                <v-alert v-if="uploadMessage" :type="uploadStatus" dismissible>
                  {{ uploadMessage }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item :value="1">
            <v-card flat>
              <v-card-text>
                <v-form ref="form" v-model="formValido">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="novoDoador.nome" label="Nome completo" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field 
                        v-model="novoDoador.cpf" 
                        label="CPF" 
                        required 
                        @input="formatarCPF"
                        maxlength="14"
                        placeholder="000.000.000-00"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="novoDoador.rg" label="RG"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="novoDoador.data_nasc"
                        label="Data de Nascimento"
                        prepend-icon="mdi-calendar"
                        placeholder="DD/MM/AAAA"
                        maxlength="10"
                        @input="formatarDataNascimento"
                        @blur="validarData"
                        :rules="[v => this.dataValida || 'Data inválida']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="novoDoador.sexo"
                        :items="['Masculino', 'Feminino']"
                        label="Sexo"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="novoDoador.tipo_sanguineo"
                        :items="tiposSanguineos"
                        label="Tipo Sanguíneo"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="novoDoador.mae" label="Nome da Mãe"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="novoDoador.pai" label="Nome do Pai"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="novoDoador.email" label="Email" type="email"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="novoDoador.telefone_fixo" label="Telefone Fixo"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="novoDoador.celular" label="Celular"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="3">
                      <v-text-field 
                        v-model="novoDoador.cep" 
                        label="CEP" 
                        @blur="buscarCep"
                        @input="formatarCEP"
                        maxlength="9"
                        placeholder="00000-000"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="5">
                      <v-text-field v-model="novoDoador.endereco" label="Endereço"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-text-field 
                        v-model.number="novoDoador.numero" 
                        label="Nº" 
                        type="number"
                        @input="formatarNumero('numero')"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field v-model="novoDoador.bairro" label="Bairro"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="novoDoador.cidade" label="Cidade"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="novoDoador.estado"
                        :items="estados"
                        label="Estado"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model.number="novoDoador.altura" 
                        label="Altura (m)" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        @input="formatarNumero('altura')"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model.number="novoDoador.peso" 
                        label="Peso (kg)" 
                        type="number"
                        step="0.1" 
                        min="0"
                        @input="formatarNumero('peso')"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-btn color="primary" @click="adicionarDoador" class="mr-4">
                    Adicionar Doador
                  </v-btn>
                  <v-btn color="error" @click="limparFormulario">
                    Limpar
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-window-item>
          
            <v-window-item :value="2">
              <v-card flat>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="doadoresList"
                    :items-per-page="5"
                    class="elevation-1"
                  >
                    <template v-slot:header="{ props: { headers } }">
                      <thead>
                        <tr>
                          <th v-for="header in headers" :key="header.value">
                            {{ header.text }}
                          </th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                    </template>

                    <template v-slot:item="{ item }">
                      <tr>
                        <td>{{ item.nome }}</td>
                        <td>{{ item.cpf }}</td>
                        <td>{{ item.data_nasc }}</td>
                        <td>{{ item.sexo }}</td>
                        <td>{{ item.tipo_sanguineo }}</td>
                        <td>{{ item.estado }}</td>
                        <td>
                          <v-btn icon color="error" small @click="removerDoador(item)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </template>
                    
                    <template v-slot:footer>
                      <div class="d-flex align-center justify-space-between pa-4">
                        <div class="text-body-2">
                          {{ `Mostrando ${Math.min(doadoresList.length, 5)} de ${doadoresList.length} doadores` }}
                        </div>
                        <div>
                          <v-pagination
                            v-model="paginaAtual"
                            :length="Math.ceil(doadoresList.length / 5)"
                            :total-visible="5"
                          ></v-pagination>
                        </div>
                      </div>
                    </template>
                  </v-data-table>

                  <v-alert v-if="doadoresList.length === 0" type="info" class="mt-4">
                    Nenhum doador cadastrado. Adicione doadores na aba "Cadastro Manual" ou faça upload de um arquivo JSON.
                  </v-alert>

                  <div class="d-flex justify-end mt-4">
                    <v-btn 
                      color="success" 
                      :disabled="doadoresList.length === 0" 
                      @click="enviarDados"
                      class="mr-4"
                    >
                      <v-icon left>mdi-send</v-icon>
                      Enviar Dados
                    </v-btn>
                    <v-btn 
                      color="error" 
                      :disabled="doadoresList.length === 0" 
                      @click="limparTodos"
                    >
                      <v-icon left>mdi-delete-sweep</v-icon>
                      Limpar Todos
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

          <v-window-item :value="3">
            <v-card flat>
              <v-card-text>
                <div v-if="doadoresList.length === 0" class="text-center pa-5">
                  <v-icon x-large color="grey lighten-1">mdi-chart-box-outline</v-icon>
                  <h3 class="text-h5 grey--text text--darken-1 mt-4">
                    Sem dados para análise
                  </h3>
                  <p class="grey--text text--darken-1">
                    Adicione doadores para visualizar estatísticas básicas.
                  </p>
                </div>
                <EstatisticasBasicas v-else :doadores="doadoresList" />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card-text>
      
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
        {{ snackbarText }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import EstatisticasBasicas from './EstatisticasBasicas.vue';

export default {
  components: {
    EstatisticasBasicas
  },
  name: 'CadastroDoadores',
  data() {
  return {
    activeTab: 0,
    jsonFile: null,
    uploadMessage: '',
    uploadStatus: 'info',
    formValido: false,
    doadoresList: [],
    paginaAtual: 1,
    novoDoador: this.initDoador(),
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'success',
    dataValida: true,
    tiposSanguineos: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    estados: [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
      'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
      'SP', 'SE', 'TO'
    ],
    headers: [
        { title: 'Nome', key: 'nome', sortable: true },
        { title: 'CPF', key: 'cpf' },
        { title: 'Data Nasc.', key: 'data_nasc' },
        { title: 'Sexo', key: 'sexo' },
        { title: 'Tipo Sanguíneo', key: 'tipo_sanguineo' },
        { title: 'Estado', key: 'estado' },
        { title: 'Excluir', key: 'actions', sortable: false }
      ]};
  },
  methods: {
    initDoador() {
      return {
        nome: '',
        cpf: '',
        rg: '',
        data_nasc: '',
        sexo: '',
        mae: '',
        pai: '',
        email: '',
        cep: '',
        endereco: '',
        numero: null,
        bairro: '',
        cidade: '',
        estado: '',
        telefone_fixo: '',
        celular: '',
        altura: null,
        peso: null,
        tipo_sanguineo: ''
      };
    },
    formatarDataNascimento(event) {
      let valor = event.target.value || '';
      
      valor = valor.replace(/\D/g, '');
      
      valor = valor.slice(0, 8);
      
      if (valor.length > 4) {
        valor = valor.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
      } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{0,2})/, '$1/$2');
      }
      
      this.novoDoador.data_nasc = valor;
    },
    validarData() {
      if (!this.novoDoador.data_nasc) {
        this.dataValida = false;
        return;
      }
      const partes = this.novoDoador.data_nasc.split('/');
      if (partes.length !== 3) {
        this.dataValida = false;
        return;
      }
      
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;
      const ano = parseInt(partes[2], 10);
      
      const data = new Date(ano, mes, dia);
      const dataAtual = new Date();
      
      this.dataValida = (
        !isNaN(data.getTime()) && 
        data.getDate() === dia && 
        data.getMonth() === mes && 
        data.getFullYear() === ano && 
        data <= dataAtual && 
        ano >= 1900 
      );
      
      return this.dataValida;
    },
    formatarNumero(campo) {
      if (typeof this.novoDoador[campo] === 'string') {
        this.novoDoador[campo] = Number(this.novoDoador[campo].replace(',', '.'));
      }
    },
    formatarCPF(e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11)
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      this.novoDoador.cpf = v
    },
    formatarCEP(event) {
      let valor = event.target.value.replace(/\D/g, '') 
      valor = valor.slice(0, 8) 

      if (valor.length > 5) {
        valor = valor.replace(/(\d{5})(\d{1,3})/, '$1-$2')
      }

      this.novoDoador.cep = valor
    },
    async buscarCep() {
      if (this.novoDoador.cep && this.novoDoador.cep.length >= 8) {
        try {
          const cepLimpo = this.novoDoador.cep.replace(/\D/g, '');
          const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          
          if (!response.data.erro) {
            this.novoDoador.endereco = response.data.logradouro;
            this.novoDoador.bairro = response.data.bairro;
            this.novoDoador.cidade = response.data.localidade;
            this.novoDoador.estado = response.data.uf;
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    },
    onFileSelected() {
      if (!this.jsonFile) {
        this.uploadMessage = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            this.doadoresList = data.map(doador => {
              return {
                ...doador,
                numero: doador.numero ? Number(doador.numero) : null,
                altura: doador.altura ? Number(String(doador.altura).replace(',', '.')) : null,
                peso: doador.peso ? Number(String(doador.peso).replace(',', '.')) : null
              };
            });
            this.uploadMessage = `${data.length} doadores carregados com sucesso!`;
            this.uploadStatus = 'success';
            this.activeTab = 2; 
          } else {
            this.uploadMessage = 'O arquivo deve conter um array de doadores.';
            this.uploadStatus = 'error';
          }
        } catch (error) {
          this.uploadMessage = 'Erro ao processar o arquivo JSON. Verifique o formato.';
          this.uploadStatus = 'error';
          console.error('Erro ao processar o arquivo JSON:', error);
        }
      };
      reader.readAsText(this.jsonFile);
    },
    adicionarDoador() {
      if (!this.novoDoador.nome || !this.novoDoador.cpf || !this.novoDoador.data_nasc || 
          !this.novoDoador.sexo || !this.novoDoador.tipo_sanguineo) {
        this.mostrarSnackbar('Preencha os campos obrigatórios.', 'warning');
        return;
      }
      
      if (!this.validarData()) {
        this.mostrarSnackbar('A data de nascimento é inválida.', 'warning');
        return;
      }
      
      const doadorProcessado = {
        ...this.novoDoador,
        numero: this.novoDoador.numero ? Number(this.novoDoador.numero) : null,
        altura: this.novoDoador.altura ? Number(this.novoDoador.altura) : null,
        peso: this.novoDoador.peso ? Number(this.novoDoador.peso) : null
      };
      
      this.doadoresList.push(doadorProcessado);
      
      this.limparFormulario();
      
      this.mostrarSnackbar('Doador adicionado com sucesso!', 'success');
      this.activeTab = 2;
    },
    limparFormulario() {
      this.novoDoador = this.initDoador();
      this.dataValida = true; 
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    removerDoador(item) {
      const index = this.doadoresList.indexOf(item);
      if (index !== -1) {
        this.doadoresList.splice(index, 1);
        this.mostrarSnackbar('Doador removido com sucesso!', 'info');
      }
    },
    limparTodos() {
      this.doadoresList = [];
      this.mostrarSnackbar('Todos os dados foram limpos.', 'info');
    },
    prepararDadosParaEnvio() {
      return this.doadoresList.map(doador => {
        return {
          ...doador,
          numero: doador.numero ? Number(doador.numero) : null,
          altura: doador.altura ? Number(String(doador.altura).replace(',', '.')) : null,
          peso: doador.peso ? Number(String(doador.peso).replace(',', '.')) : null
        };
      });
    },
    enviarDados() {
      const dadosProcessados = this.prepararDadosParaEnvio();      
      axios.post('/api/doadores', dadosProcessados)
        .then(response => {
          this.mostrarSnackbar(`${response.data.length} doadores cadastrados com sucesso!`, 'success');
          this.limparTodos();
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
          if (error.response && error.response.status === 409) {
            this.mostrarSnackbar(error.response.data.message, 'warning');
          } else {
            this.mostrarSnackbar('Erro ao enviar dados. Verifique o console para mais detalhes.', 'error');
          }
        });
    },
    mostrarSnackbar(texto, cor) {
      this.snackbarText = texto;
      this.snackbarColor = cor;
      this.snackbar = true;
    }
  }
};
</script>

<style scoped>
.v-data-table {
  max-height: 400px;
  overflow-y: auto;
}

#table > .v-data-footer .v-icon {
  color: black !important; 
}
</style>