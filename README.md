# Sistema de Banco de Sangue - Front-end

Este projeto é o front-end para um sistema de gerenciamento de banco de sangue, desenvolvido como parte de um teste técnico. A aplicação permite o cadastro de doadores de sangue, visualização de dados, e análise estatística conforme os requisitos especificados.

## 📋 Sobre o Projeto

O sistema processa dados de candidatos a doadores de sangue e apresenta análises estatísticas importantes, incluindo:

- Distribuição de candidatos por estado brasileiro
- IMC médio por faixa etária (intervalos de 10 anos)
- Percentual de obesos entre homens e mulheres
- Média de idade por tipo sanguíneo
- Quantitativo de possíveis doadores para cada tipo sanguíneo receptor

> **Nota:** Somente pessoas com idade entre 16 a 69 anos e com peso acima de 50 Kg podem doar sangue.

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **Vue 3** - Framework JavaScript progressivo para construção de interfaces
- **Vuetify 3** - Biblioteca de componentes UI para Vue baseada no Material Design
- **Vue Router** - Roteamento oficial para aplicações Vue.js
- **Axios** - Cliente HTTP baseado em promises para fazer requisições
- **ECharts** - Biblioteca de visualização de dados para gráficos interativos
- **Vue ECharts** - Componente Vue para ECharts

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14.x ou superior)
- NPM ou Yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd front-end_teste_java
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure o arquivo `main.js` com o endereço da API backend:
   ```
    axios.defaults.baseURL = 'http://localhost:8080'
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run serve
   # ou
   yarn serve
   ```

   > **Importante:** O servidor de desenvolvimento roda na porta 3000 (http://localhost:3000). O backend está configurado para aceitar requisições CORS apenas desta origem.


## 📱 Funcionalidades

### 1. Página Inicial
- Visão geral do sistema
- Acesso rápido às principais funcionalidades

### 2. Cadastro de Doadores
- Upload de arquivo JSON com dados de doadores
- Cadastro manual de doadores com validação de campos
- Busca automática de endereço por CEP
- Visualização tabular dos doadores cadastrados

### 3. Estatísticas
- Cards com estatísticas básicas (total de doadores, média de idade, distribuição por sexo)
- Gráficos e visualizações com as análises requeridas


## 🔗 Integração com Backend

O front-end se comunica com o backend Spring Boot através de requisições HTTP usando Axios. As principais integrações incluem:

- `POST /api/doadores` - Envio de dados de doadores para processamento
- `GET /api/estatisticas` - Obtenção de estatísticas calculadas

## 📊 Modelos de Dados

### Doador
```javascript
{
  nome: String,
  cpf: String,
  rg: String,
  data_nasc: String, // formato: DD/MM/AAAA
  sexo: String, // 'Masculino' ou 'Feminino'
  mae: String,
  pai: String,
  email: String,
  cep: String,
  endereco: String,
  numero: Number,
  bairro: String,
  cidade: String,
  estado: String, // Sigla do estado (UF)
  telefone_fixo: String,
  celular: String,
  altura: Number, // em metros
  peso: Number, // em quilogramas
  tipo_sanguineo: String // 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
}
```

## 📜 Regras de Compatibilidade Sanguínea

| Tipo sanguíneo | Pode doar para | Pode receber de |
|----------------|----------------|-----------------|
| A+             | A+, AB+        | A+, A-, O+, O-  |
| A-             | A+, A-, AB+, AB- | A-, O-        |
| B+             | B+, AB+        | B+, B-, O+, O-  |
| B-             | B+, B-, AB+, AB- | B-, O-        |
| AB+            | AB+            | Todos           |
| AB-            | AB+, AB-       | A-, B-, O-, AB- |
| O+             | A+, B+, O+, AB+ | O+, O-         |
| O-             | Todos          | O-              |

## 🛠️ Scripts Disponíveis

- `npm run serve` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila e minifica para produção
- `npm run lint` - Executa o linter e corrige arquivos
