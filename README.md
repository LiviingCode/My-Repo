# My Repo

Uma aplicação React moderna para visualizar diferentes tipos de arquivos (imagens, PDFs, vídeos, documentos)

## 🚀 Funcionalidades

- **Listagem de Banners**: Exibe todos os banners disponíveis em um layout de grid responsivo
- **Upload de Arquivos**: Adicione novos arquivos através de drag & drop ou seleção manual
- **Edição de Arquivos**: Modifique arquivos existentes ou seus nomes diretamente no modal de visualização
- **Exclusão de Arquivos**: Remova arquivos com confirmação de segurança
- **Visualização Interativa**: Clique em qualquer banner para abrir um modal de visualização
- **Suporte a Múltiplos Formatos**:
  - Imagens (PNG, JPG, GIF, etc.)
  - PDFs
  - Vídeos
  - Documentos
  - Download para outros tipos de arquivo
- **Interface Moderna**: Design limpo e responsivo com Tailwind CSS
- **Loading States**: Indicadores de carregamento durante requisições
- **Tratamento de Erros**: Mensagens de erro amigáveis
- **Feedback Visual**: Notificações de sucesso e erro para uploads

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── BannerCard.tsx   # Card individual do banner
│   ├── BannerDialog.tsx # Modal de visualização com ações
│   ├── FileUpload.tsx   # Componente de upload de arquivos
│   ├── FileEdit.tsx     # Componente de edição de arquivos
│   └── ui/
│       ├── Button.tsx
│       ├── Dialog.tsx
│       └── LoadingSpinner.tsx
├── pages/
│   └── BannerList.tsx   # Página principal
├── services/            # Serviços de API
│   └── api.ts           # Configuração e chamadas HTTP
├── hooks/               # Custom hooks
│   ├── useBanners.ts    # Hook para gerenciar banners
│   └── useFileDownload.ts # Hook para download de arquivos
├── types/               # Tipagens TypeScript
│   └── index.ts
├── utils/
│   └── index.ts
└── App.tsx              # Componente principal
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript 4.9.5** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Requisições HTTP
- **React Hooks** - Gerenciamento de estado

## 📦 Instalação

Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🔧 Configuração da API

A aplicação espera que a API esteja rodando em `http://localhost:8080` com os seguintes endpoints:

### GET /api/files

Retorna a lista de banners disponíveis:

```json
[
  {
    "name": "arquivo.pdf",
    "type": "pdf"
  },
  {
    "name": "imagem.jpg",
    "type": "image"
  }
]
```

### GET /api/download/{nome_do_arquivo}

Retorna o arquivo binário com o header `Content-Type` apropriado.

### POST /api/upload

Recebe um arquivo via multipart/form-data com os campos:

- `file`: O arquivo em si
- `name_file`: Nome do arquivo

### PUT /api/update/{nome_do_arquivo}

Atualiza um arquivo existente via multipart/form-data. O `{nome_do_arquivo}` na URL deve ser o nome **original** do arquivo para localizá-lo. Ambos os campos são opcionais:

- `file`: Novo arquivo (opcional)
- `name_file`: Novo nome do arquivo (opcional)

### DELETE /api/delete/{nome_do_arquivo}

Remove um arquivo do sistema.

## 🎨 Componentes Principais

### BannerCard

- Exibe informações do banner (nome, tipo, ícone)
- Responsivo e com hover effects
- Clique abre o modal de visualização

### BannerDialog

- Modal responsivo para visualização de arquivos
- Suporte a diferentes tipos de mídia
- Loading states e tratamento de erros
- Botão de download para arquivos não suportados
- Botões de ação (Editar/Excluir) na parte inferior
- Confirmação de exclusão com aviso de segurança

### FileUpload

- Interface de upload com drag & drop
- Validação de arquivos e nomes
- Loading states durante upload
- Feedback visual de sucesso/erro

### FileEdit

- Interface de edição com campos opcionais
- Validação de alterações
- Loading states durante atualização
- Feedback visual de sucesso/erro

### useBanners Hook

- Gerencia o estado da lista de banners
- Loading states e tratamento de erros
- Função de refetch para recarregar dados

### useFileDownload Hook

- Gerencia o download e visualização de arquivos
- Cria URLs temporárias para visualização
- Limpeza automática de recursos

## 🔄 Fluxo da Aplicação

1. **Carregamento Inicial**: A aplicação faz uma requisição para `/api/files`
2. **Exibição**: Os banners são exibidos em cards na tela
3. **Upload**: Usuário pode adicionar novos arquivos via botão ou quando não há arquivos
4. **Interação**: Usuário clica em um banner
5. **Download**: Sistema faz requisição para `/api/download/{nome}`
6. **Visualização**: Arquivo é renderizado no modal baseado no Content-Type
7. **Ações**: Usuário pode editar ou excluir arquivos através dos botões no modal
8. **Edição**: Modal de edição permite alterar arquivo e/ou nome
9. **Exclusão**: Confirmação de segurança antes de remover arquivo
10. **Fechamento**: Modal é fechado e recursos são limpos

## 🚀 Próximas Funcionalidades

- [x] Upload de novos banners ✅
- [ ] Filtros por tipo de arquivo
- [ ] Busca por nome
- [ ] Paginação para muitos arquivos
- [ ] Preview em miniatura para imagens
- [ ] Histórico de visualizações

**Desenvolvido por Gabriel Souza Silva**
