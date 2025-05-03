# 📝 PlanMe - Seu planner, do seu jeitinho

![PlanMe Logo](public/assets/eb543096-c99c-44f7-ae59-6a4aa15e8764.png)

**Projeto final do curso Desenvolvedor Web - Senac.**

Um planner digital retrô e fofo desenvolvido como projeto final do curso de Desenvolvedor Web do Senac. O PlanMe combina funcionalidade moderna com design vintage encantador.

## ✨ Características

- **Design Retrô & Fofo**: Interface vintage inspirada em máquinas de escrever e papelaria antiga
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Sistema de Cores Harmonioso**: Paleta cuidadosa com verde menta, bege claro, rosa antigo e marrom suave
- **Tipografia Especial**: Fontes "Special Elite" para títulos e "Quicksand" para texto geral
- **Animações Suaves**: Transições e efeitos que tornam a experiência mais agradável

## 🚀 Funcionalidades

### 📅 Planner Mensal
- Visualização de calendário mensal completo
- Navegação entre meses (anterior/próximo)
- Adição de eventos e compromissos
- Categorização por cores (Compromissos, Eventos Especiais, Lembretes)
- Destaque para o dia atual
- Interface intuitiva para gerenciamento de eventos

### 📝 Sistema de Anotações (CRUD Completo)
- **Criar**: Nova anotação com título, conteúdo e categoria
- **Ler**: Visualização organizada com busca e filtros
- **Atualizar**: Edição inline das anotações existentes
- **Deletar**: Remoção com confirmação
- **Busca Inteligente**: Pesquisa por título ou conteúdo
- **Categorização**: Organização por Pessoal, Trabalho, Estudos, Ideias
- **Data de Criação/Modificação**: Controle temporal das anotações

### 🖨️ Widget Flutuante - Máquina de Escrever
- **Componente Sempre Disponível**: Botão flutuante no canto inferior direito
- **Efeito de Digitação**: Som e feedback visual ao digitar
- **Auto-expansão**: Textarea que cresce conforme o conteúdo
- **Salvamento Rápido**: Anotações salvas instantaneamente
- **Histórico Local**: Mantém anotações anteriores no modal
- **Animação Float**: Movimento suave que chama atenção
- **JavaScript Puro Integrado**: Efeitos especiais com manipulação DOM

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal para interface
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool moderna e rápida
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **Lucide React** - Ícones SVG otimizados
- **React Router** - Navegação SPA

### Design System
- **Cores HSL**: Sistema de cores consistente
- **CSS Custom Properties**: Variáveis para fácil manutenção
- **Responsive Design**: Grid e flexbox para todos os tamanhos
- **Animações CSS**: Keyframes e transitions personalizadas

### Fontes
- **Special Elite** (Google Fonts) - Títulos e elementos vintage
- **Quicksand** (Google Fonts) - Texto geral e interface

## 📁 Estrutura do Projeto

```
planme/
├── public/
│   ├── assets/                   # Imagens do projeto (logo e máquina de escrever)
│   └── robots.txt
├── src/
│   ├── components/              # Componentes React reutilizáveis
│   │   ├── ui/                  # Componentes base (shadcn/ui)
│   │   ├── Header.tsx           # Cabeçalho com navegação
│   │   ├── TypewriterWidget.tsx # Widget flutuante da máquina de escrever
│   │   ├── PlannerMensal.tsx    # Componente do calendário mensal
│   │   └── AnotacaoList.tsx     # Sistema completo de anotações CRUD
│   ├── pages/
│   │   ├── Index.tsx            # Página principal com navegação
│   │   └── NotFound.tsx         # Página 404
│   ├── hooks/
│   │   ├── use-mobile.tsx       # Hook para detecção mobile
│   │   └── use-toast.ts         # Sistema de notificações
│   ├── lib/
│   │   └── utils.ts             # Utilitários (className merge)
│   ├── App.tsx                  # Componente raiz da aplicação
│   ├── main.tsx                 # Ponto de entrada React
│   └── index.css                # Estilos globais e design system
├── tailwind.config.ts           # Configuração Tailwind personalizada
├── vite.config.ts               # Configuração Vite
└── README.md                    # Este arquivo
```

## 🎨 Design System

### Paleta de Cores
```css
/* Cores Principais */
--primary: 165 45% 65%        /* Verde menta */
--secondary: 340 25% 80%      /* Rosa antigo */
--accent: 25 35% 70%          /* Marrom suave */
--background: 48 20% 95%      /* Bege claro */

/* Cores Especiais PlanMe */
--vintage-paper: 45 25% 92%   /* Papel vintage */
--typewriter-green: 150 35% 50% /* Verde máquina */
--flower-orange: 25 70% 70%   /* Laranja da flor */
--soft-pink: 340 30% 85%      /* Rosa suave */
--warm-brown: 25 40% 45%      /* Marrom quente */
```

### Tipografia
- **font-vintage**: "Special Elite" - Para títulos e elementos retrô
- **font-soft**: "Quicksand" - Para texto geral e interface

### Efeitos Especiais
- **vintage-paper**: Gradiente e sombra para aparência de papel antigo
- **typewriter-effect**: Gradiente e sombra para elementos da máquina
- **float-animation**: Animação flutuante suave
- **typing-effect**: Efeito de cursor piscando

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <URL-DO-REPOSITORIO>

# Entre na pasta do projeto
cd planme

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

### Build para Produção
```bash
# Gera build otimizado
npm run build

# Preview do build local
npm run preview
```

## 💡 Funcionalidades JavaScript Puro

O projeto integra JavaScript puro em várias funcionalidades especiais:

### TypewriterWidget
- Manipulação DOM direta para efeitos de digitação
- Event listeners para sons de tecla
- Auto-redimensionamento de textarea
- Efeitos visuais de salvamento

### Animações Personalizadas
```css
/* Animação flutuante */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Efeito máquina de escrever */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
```

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

Utiliza Grid CSS e Flexbox para layouts adaptativos.

## 🎯 Objetivos do Projeto (Senac)

Este projeto demonstra competências em:
- **Desenvolvimento Frontend Moderno**: React, TypeScript, Tailwind
- **Design System**: Criação de sistema coeso de cores, tipografia e componentes
- **UX/UI Design**: Interface intuitiva e visualmente atraente
- **Programação CRUD**: Operações completas de Create, Read, Update, Delete
- **JavaScript Avançado**: Manipulação DOM, eventos, animações
- **Responsividade**: Design que funciona em todos os dispositivos
- **Organização de Código**: Estrutura modular e manutenível
- **Integração de Tecnologias**: Combinação harmoniosa de diferentes ferramentas

## 👥 Créditos

**Desenvolvido por**: [Seu Nome]  
**Curso**: Desenvolvedor Web - Senac  
**Ano**: 2025  
**Orientador**: [Nome do Professor]

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de Desenvolvedor Web do Senac.

---

### 🌟 "Seu planner, do seu jeitinho"

O PlanMe foi criado com muito carinho para tornar a organização pessoal uma experiência agradável e nostálgica. Cada detalhe foi pensado para trazer a sensação acolhedora de uma papelaria vintage, combinada com a praticidade moderna que você precisa.

**Divirta-se organizando sua vida! ✨**
