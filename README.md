# Front-end do Sistema de Chamados de Manutenção IFRN

**Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte (IFRN)**  
**Campus Pau dos Ferros · Técnico Integrado em Informática · Programação para Internet**

Aplicação web em **React + Vite** para gerenciamento de chamados de manutenção do campus, consumindo em tempo real a API REST: `https://api-chamados.jefersonqueiroga.com.br`.

---

## 🚀 Funcionalidades Implementadas

1. **Identificação do Aluno (`GET /eu`)**: Exibição no cabeçalho superior do nome do dono da chave de API, matrícula e turma.
2. **Listagem com Busca e Filtros (`GET /chamados`)**:
   - Campo de busca por texto (título ou descrição).
   - Filtros combinados por **Status** (`aberto`, `em andamento`, `resolvido`), **Tipo**, **Local** e **Prioridade**.
   - Parâmetros sincronizados com a API (`?status=&tipo=&local=&prioridade=&busca=`).
   - Cards visuais com indicação clara de status e prioridade.
3. **Detalhes do Chamado (`/chamado/:id`)**:
   - Exibição de todos os dados: título, descrição, tipo, local, data de abertura, responsável, solução e data de resolução.
   - Botão para voltar à listagem (`← Voltar`).
   - Botão de edição (bloqueado para chamados resolvidos).
   - Botão de exclusão com modal de confirmação.
4. **Ciclo de Atendimento em Etapas (Ações Contextuais)**:
   - Se **aberto**: formulário para *Iniciar Atendimento* informando o técnico responsável (`PATCH /chamados/{id}/iniciar`).
   - Se **em andamento**: formulário para *Resolver Chamado* descrevendo a solução executada (`PATCH /chamados/{id}/resolver`).
   - Se **resolvido**: mensagem de conclusão sem ações pendentes.
5. **Abertura e Edição de Chamados (`/novo` e `/editar/:id`)**:
   - Mesmo componente de formulário reutilizado para criação e edição.
   - Opções de seleção carregadas dinamicamente das rotas `/tipos`, `/locais` e `/prioridades`.
   - Bloqueio de edição para chamados com status `resolvido`.
6. **Exclusão com Confirmação (`DELETE /chamados/{id}`)**: Modal de confirmação antes de apagar qualquer registro.
7. **Estados de Interface**: Tratamento e feedback visual para:
   - Carregando dados (`Carregando chamados...`).
   - Lista vazia (`Nenhum chamado encontrado.`).
   - Erros vindos da API (400, 401, 404, 422 com mensagens detalhadas de validação).
8. **Gerenciador de Chave de API**: Seletor integrado no topo que permite alternar facilmente entre chaves de alunos da turma matutino ou inserir uma chave personalizada.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite**
- **React Router Dom**
- **Axios** (instância centralizada em `src/services/api.js`)
- **Tailwind CSS** (estilização sem frameworks prontos como Bootstrap ou MUI)
- **Lucide React** (ícones de apoio visual)

---

## 📦 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/chamados-front.git
   cd chamados-front
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto com sua chave de API pessoal:
   ```env
   VITE_API_KEY=sua-chave-aqui
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse no navegador: `http://localhost:3000` (ou a porta informada pelo Vite).
