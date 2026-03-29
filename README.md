# Brazuka Flix - Plataforma de Curadoria Audiovisual Nacional

Brazuka Flix e uma solucao de streaming focada exclusivamente no cinema brasileiro, series e novelas nacionais. A plataforma oferece uma experiencia de usuario premium inspirada nas melhores praticas de UI/UX do mercado de streaming, adaptada para destacar a riqueza da producao audiovisual brasileira.

---

## Contexto de Desenvolvimento

O projeto teve origem na Imersao Front-End da Alura, porem foi expandido significativamente como um projeto autoral para aplicar conceitos avancados da graduacao em Sistemas de Analise e Desenvolvimento (ADS). O objetivo foi transcender o escopo educacional original, transformando-o em uma aplicacao production-ready que demonstra competencias reais de engenharia de software.

---

## Arquitetura e Tecnologias

**Framework:** Next.js 16 (App Router)

**Linguagem:** TypeScript com tipagem estática para robustez do codigo

**UI:** React 19 e Tailwind CSS 4

**Dados:** Integracao via REST API com The Movie Database (TMDB)

---

## Diferenciais Tecnicos

**Server Components:** Implementacao de Server Components do Next.js para otimizacao de performance e melhoria de SEO, reduzindo o JavaScript enviado ao cliente.

**Seguranca:** Gestao segura de variaveis de ambiente via process.env, garantindo que chaves de API nunca sejam expostas no codigo cliente. As requisicoes sao feitas exclusivamente do lado do servidor.

**Mobile-First Design:** Refatoracao completa da interface seguindo metodologia Mobile-First, garantindo integridade visual e funcional em diferentes Viewports, desde dispositivos moveis ate desktops.

**Watch Providers:** Logica de exibicao dinamica de provedores de streaming, indicando onde cada titulo esta disponivel (Netflix, Globoplay, etc), com suporte para diferentes modelos de acesso (assinatura, locacao, gratuito).

**Resiliencia:** Tratamento robusto de erros com try/catch em todas as requisicoes API. Funcao getAllCategories utiliza Promise.allSettled para que uma falha não afete as demais categorias.

**Fallback de Imagens:** Sistema de fallback automatico com imagem personalizada do Brazuka Flix quando a API nao retorna poster ou backdrop.

**SEO Otimizado:** Metadados dinamicos para cada rota (title, description, keywords, OpenGraph, Twitter Cards) com indexacao correta para mecanismos de busca.

---

## Instalacao e Configuracao

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd brazukaflix
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto com as seguintes chaves:

```env
TMDB_API_KEY=sua_chave_api_aqui
TMDB_ACCESS_TOKEN=seu_access_token_aqui
```

### 4. Executar o projeto

```bash
npm run dev
```

O projeto estara disponivel em `http://localhost:3000`

---

## Estrutura de Diretorios

```
src/
├── app/                    # Next.js App Router
│   ├── browse/            # Paginas de catalogo
│   ├── api/               # API Routes internas
│   └── layout.tsx         # Layout principal
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── hero/              # Billboard (destaque)
│   ├── media/             # MediaCard, MediaModal
│   └── ui/                # Componentes reutilizaveis
├── lib/
│   ├── tmdb.ts           # Integracao com API TMDB
│   └── constants.ts      # Configuracoes globais
└── types/
    └── media.ts          # Tipos TypeScript
```

---

## Consideracoes de Engenharia

O desenvolvimento de interfaces modernas exige atencao redobrada em tres pilares fundamentais: Clean Code, componentizacao e tratamento de estados assincronos. O Brazuka Flix foi arquitetado seguindo principios de responsabilidade unica, onde cada componente possui uma funcao clara e bem definida. A componentizacao permite reutilizacao de codigo e manutencao simplificada, enquanto o tratamento adequado de estados assincronos garante que a experiencia do usuario permaneca fluida mesmo durante carregamentos de dados externos. A documentacao inline em portugues tecnico serve tanto como registro arquitetural quanto como material didatico para outros desenvolvedores que possam contribuir com o projeto.

---

## Stack Tecnologico

- **Framework:** Next.js 16.2.1 (App Router)
- **UI:** React 19 + Tailwind CSS 4
- **Animacoes:** Framer Motion
- **Icones:** Lucide React
- **Tipografia:** Poppins (display), Montserrat (headings), Inter (body)
- **API:** TMDB (The Movie Database)
- **TypeScript:** Tipagem completa

---

## Funcionalidades Principais

### Navegacao
- Navbar fixa com transparencia que escurece no scroll
- Links: Inicio, Filmes Nacionais, Series e Docs, Novelas Classicas, Minha Lista
- Busca em tempo real
- Menu mobile hamburger

### Pagina Principal (Browse)
- Billboard com trailer YouTube em loop (mute) ou backdrop de alta qualidade
- Categorias com carroseis horizontais de conteudo brasileiro
- Filtros por tipo: `/browse?type=movie`, `/browse?type=series`, `/browse?type=novela`

### Detalhes (Modal)
- Sinopse completa
- Informacoes: ano, duracao/capitulos, avaliacoes
- Trailer YouTube integrado
- Onde Assistir com provedores de streaming

### Perfis Regionais
- 6 perfis baseados em regioes do Brasil
- Cada perfil tem cor e descricao tematica

### Minha Lista
- Adicionar/remover itens
- Persistencia local (localStorage)

---

## Paleta de Cores (Tropical Premium)

```
--color-dark-green: #006400      # Verde escuro (navbar)
--color-olive-green: #556B2F     # Verde oliva
--color-sea-green: #8FBC8F       # Verde-mar
--color-accent-yellow: #FFFF00  # Amarelo vibrante
--color-accent-gold: #FFD700     # Dourado

--color-navy-deep: #0A1628     # Fundo principal
--color-navy-medium: #0F1D32    # Superficies
--color-navy-light: #162540     # Cards
```

---

## Variaveis de Ambiente

```env
TMDB_API_KEY=sua_chave_api_aqui
TMDB_ACCESS_TOKEN=seu_access_token_aqui
```

---

## Como Executar

```bash
# Instalar dependencias
npm install

# Desenvolvimento
npm run dev

# Build de producao
npm run build

# Executar producao
npm start
```

---

## Deploy em Producao

### Vercel (Recomendado)

1. Faca push do projeto para um repositorio Git
2. Acesse vercel.com e importe o repositorio
3. Configure as variaveis de ambiente na Vercel:
   - `TMDB_API_KEY`
   - `TMDB_ACCESS_TOKEN`
4. Execute deploy

### Verificacao de Build

```bash
npm run build
```

O build gera arquivos estaticos otimos para deploy em qualquer plataforma (Vercel, Netlify, AWS, etc).

---

## Creditos

- Dados: TMDB (The Movie Database)
- Inspiracao: Netflix, Amazon Prime Video
