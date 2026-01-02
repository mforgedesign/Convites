Nome do Projeto: AutoBuilder v4.0  
Descrição do Projeto: Um site (aplicação web) cujo possui chatbot, fluxos de script e ferramentas para a geração e edição de Convites Digitais Interativos.  
Objetivo do Projeto: Automatizar e/ou facilitar todo o fluxo de criação, para que qualquer pessoa não familiarizada com as ferramentas seja capaz de criar seu Convite Digital Personalizado com as funções e links desejados.

Uso: Ao acessar o builder, o usuário fornece os dados no chat (alimentado por I.A) ou preenchendo o formulário manualmente, fornecendo dados como Nome, Data, Hora, Idade, Tipo de evento, Tema do evento, Paleta de cores, Cor dos botões, Posição dos botões, tamanho dos botões, prévia dos botões, frase do convite, Música, Local do evento, link do google maps, Link presentes, Sugestões de presentes, links Extras (no formulário deverá haver um botão \- que o usuário ou chat poderá acionar para poder preencher os campos que irão surgir, cujo permitem ser escolhido o nome e o ícone do botão do link extra, além de anexar o próprio link), Instruções do Manual do Convidado, Número do Whatsapp, Link de Confirmação de Presença, Toggle Permitir Levar Acompanhante, Toggle Timer de Contagem Regressiva

{Uso de cada campo do Formulário}  
\#\#\# Definição e Lógica dos Campos do Formulário  
Esta sessão descreve as entradas de dados (inputs), suas dependências lógicas e o impacto direto na geração de prompts (IA), na estrutura de arquivos (File System) e na renderização final (HTML/CSS).

\#\#\#\# 1\. Dados Primários e Parâmetros de IA  
Estes campos alimentam o contexto para as APIs de geração de imagem/texto e variáveis globais do sistema.  
\* \*\*Nome:\*\* \[String\]  
    \* \*Uso na IA:\* Inserido no prompt para personalização da folha/arte.  
    \* \*Uso no Sistema:\* Variável injetada na mensagem padrão do Link de Confirmação (Whatsapp).  
\* \*\*Data:\*\* \[Date\]  
    \* \*Uso na IA:\* Inserido no prompt da folha.  
    \* \*Uso no Sistema:\* Define o target-date para a lógica do \*Timer de Contagem Regressiva\*.  
\* \*\*Hora:\*\* \[Time\]  
    \* \*Uso na IA:\* Inserido no prompt da folha.  
    \* \*Uso no Sistema:\* Refina o target-time para o \*Timer de Contagem Regressiva\*.  
\* \*\*Idade:\*\* \[Number/String\]  
    \* \*Uso na IA:\* Define o contexto etário no prompt da folha.  
\* \*\*Tipo de evento:\*\* \[String\] (Ex: Casamento, Aniversário)  
    \* \*Uso na IA:\* Define o contexto principal no prompt da folha.  
    \* \*Uso no File System:\* Utilizado na nomenclatura de arquivos exportados (ZIP), referências no histórico e Título (\`\<title\>\`) do preview/link final.  
\* \*\*Tema do evento:\*\* \[String\]  
    \* \*Uso na IA:\* Define o estilo estético e elementos visuais no prompt da folha.  
\* \*\*Paleta de cores:\*\* \[String\] (Ex: Hex codes ou descritivo)  
    \* \*Uso na IA:\* Instrui a colorização no prompt da folha.  
\* \*\*Frase do convite (Opcional):\*\* \[String\]  
    \* \*Uso na IA:\* Texto a ser inserido ou interpretado artisticamente na geração da folha.  
\* \*\*Local do evento:\*\* \[String\] (Nome/Endereço)  
    \* \*Uso na IA:\* Inserido no prompt da folha (se aplicável ao design).

\#\#\#\# 2\. Estilização e UI (CSS Injection)  
Campos que alteram diretamente as classes ou estilos inline do \`index.html\` final.  
\* \*\*Cor dos botões:\*\* \[Hex/RGB\]  
    \* \*Ação:\* Define a cor de fundo/borda dos botões interativos.  
\* \*\*Posição dos botões:\*\* \[Value\]  
    \* \*Ação:\* Ajusta a propriedade \`bottom\` ou \`top\` (altura) do container de botões no CSS.  
\* \*\*Tamanho dos botões:\*\* \[Value\]  
    \* \*Ação:\* Ajusta \`width\`, \`height\` ou \`padding\` dos botões.  
\* \*\*Seletor de Sombra Gradiente:\*\* \[Color Picker\]  
    \* \*Ação:\* Define a cor da sombra gradiente ascendente (\`linear-gradient\`) fixada atrás dos botões na parte inferior do convite para garantir legibilidade.

\#\#\#\# 3\. Funcionalidades e Links (Core Logic)  
Lógica de botões funcionais e integração com scripts externos.  
\* \*\*Música:\*\* \[String\] (Nome da faixa)  
    \* \*"*Dependência:* Recebe o arquivo carregado via Upload ou Seleção de Sample na **Janela de Música**. *Build:* O arquivo é renomeado e incluído na pasta `/musica` do projeto final."  
    \* \*Build:\* O arquivo baixado é incluído no ZIP final e referenciado no player de áudio do HTML.  
\* \*\*Link do Google Maps:\*\* \[URL\]  
    \* \*Target:\* Botão "Como Chegar".  
    \* \*Ação:\* Redirecionamento direto (\`href\`).  
\* \*\*Links Extras:\*\* \[Dynamic Array\]  
    \* \*Interface:\* Botão (+) ou (-) para adicionar/remover campos dinamicamente.  
    \* \*Estrutura do Objeto:\* \`{ Nome do Botão, URL de Destino, Código do Ícone (Font Awesome ou similar) }\`.  
    \* \*Build:\* Gera botões adicionais iterativos no HTML final.

\#\#\#\# 4\. Lógica Condicional Complexa (Estados Mutuamente Exclusivos)  
Campos que ativam modos específicos, desativando funcionalidades concorrentes.

\*\*A. Sistema de Lista de Presentes\*\*  
\* \*\*Input 1:\*\* \*Link presentes\* \[URL\]  
\* \*\*Input 2:\*\* \*Sugestões de presentes\* (via \*Janela de Criação da Sugestão de Presentes\*)  
\* \*\*Lógica de Estado:\*\*  
    \* SE \*Link presentes\* for preenchido: Habilita \*\*Modo Link\*\*. O botão "Lista de Presentes" redireciona para a URL. Desabilita/Oculta funcionalidades de imagem em popup.  
    \* SE \*Link presentes\* for vazio/nulo E houver input na \*Janela de Presentes\*: Habilita \*\*Modo Imagem (Popup)\*\*. O botão abre um modal exibindo a imagem gerada (baseada nos itens de sugestão).  
    \* \*Toggle UI:\* A \*Janela de Presentes\* deve possuir um alternador manual entre "Modo Link" e "Modo Popup de Imagem".

\*\*B. Sistema do Manual do Convidado\*\*  
\* \*\*Input 1:\*\* \*Instruções do Manual\* \[Text Area\]  
\* \*\*Input 2:\*\* \*Imagem do Manual\* (via \*Janela do Manual do Convidado\*)  
\* \*\*Lógica de Estado:\*\*  
    \* SE \*Instruções do Manual\* contiver texto: Habilita \*\*Modo Texto (Popup)\*\*. O texto é enviado à IA para otimização (estruturação em tópicos \+ ícones Font Awesome) e exibido no chat para aprovação. Desabilita o modo de imagem.  
    \* SE \*Instruções do Manual\* for vazio E houver imagem na janela: Habilita \*\*Modo Imagem (Popup)\*\*. O botão abre um modal com a imagem.  
    \* \*Toggle UI:\* A \*Janela do Manual\* deve possuir um alternador manual entre "Modo Popup de Texto" e "Modo Popup de Imagem".

\*\*C. Sistema de Confirmação de Presença (RSVP)\*\*  
\* \*\*Input 1:\*\* \*Número do Whatsapp\* \[String/Phone\]  
\* \*\*Input 2:\*\* \*Link de Confirmação de Presença\* \[URL\] (Ex: Google Forms, Site externo)  
\* \*\*Lógica de Estado:\*\*  
    \* SE \*Número do Whatsapp\* for preenchido: Habilita \*\*Modo Popup Whatsapp\*\*. Ao clicar, abre-se um modal interno para configurar a mensagem (incluindo acompanhantes, se ativado) antes de redirecionar para a API do Whatsapp.  
    \* SE \*Link de Confirmação\* for preenchido: Habilita \*\*Modo Link Externo\*\*. O botão redireciona diretamente, ignorando o modal interno.  
    \* \*Prioridade:\* Se ambos forem preenchidos (edge case), o sistema deve priorizar o \*Modo Link Externo\* ou solicitar desambiguação ao usuário.

\*\*D. Toggles de Funcionalidade (Booleans)\*\*  
\* \*\*Toggle Permitir Levar Acompanhante:\*\* \[Boolean\]  
    \* \*Dependência:\* Só funciona se o sistema de RSVP estiver no \*\*Modo Popup Whatsapp\*\*. Habilita o seletor de quantidade (contador) dentro do modal de confirmação.  
\* \*\*Toggle Timer de Contagem Regressiva:\*\* \[Boolean\]  
    \* \*Ação:\* Habilita/Desabilita a injeção do script JS e elementos HTML do contador regressivo (baseado nos campos \*Data\* e \*Hora\*) na tela do convite.

\#\#\#\# 5\. Visualização e Simulação  
\* \*\*Prévia dos botões:\*\* \[View Component\]  
    \* \*Descrição:\* Renderização em tempo real (WYSIWYG) dentro do formulário.  
    \* \*Especificações de Emulação:\* Deve simular o viewport do Chrome no dispositivo \*\*Moto G75\*\* (6,8 polegadas, 1080 x 2400 pixels).  
    \* \*Interatividade:\* Os botões na prévia devem ser clicáveis e refletir as cores e tamanhos selecionados instantaneamente.  
{Fim do Uso de cada campo do Formulário}

{Janelas do Builder}  
Janela inicial (Chatbot) \-  \*\*Função:\*\* Orquestrador Central do AutoBuilder e Interface Primária de Interação.

Esta janela atua como o controlador principal do fluxo de criação. Ela centraliza a comunicação entre o usuário e o sistema, gerenciando a entrada de dados via texto, a ingestão de arquivos (multimídia e projetos) e o feedback visual das APIs de geração (Imagem, Vídeo e Texto).

\#\#\#\# 1\. Interface de Entrada (Input Zone)  
A área inferior da janela deve possuir um container de entrada focado em comandos textuais e gerenciamento de arquivos:  
\* \*\*Entrada de Texto:\*\* Campo (Text Input) para digitação de comandos em linguagem natural e respostas às interações do bot (Ex: "Altere a cor para azul", "Aprovar prompt").  
\* \*\*Entrada de Arquivos (Upload & Drag-and-Drop):\*\*  
    \* \*\*Botão de Anexo:\*\* Deve abrir o seletor de arquivos do sistema operacional, filtrando as extensões permitidas baseadas no contexto ou aceitando todos os formatos suportados.  
    \* \*\*Zona de Arraste Global:\*\* A janela inteira deve funcionar como uma área de \*drop\* para arquivos. O sistema deve identificar o tipo de arquivo e processá-lo conforme a etapa atual ou sua extensão:  
        \* \*\*Imagens:\*\* \`.png\`, \`.jpg\`, \`.jpeg\`, \`.webp\` (Usadas para Capa, Folha, Referências, Manual, Presentes).  
        \* \*\*Vídeo:\*\* \`.mp4\` (Usado para loops de background ou animações).  
        \* \*\*Áudio:\*\* \`.mp3\`, \`.m4a\` (Interpretado exclusivamente como \*\*Trilha Sonora/Música\*\* do convite \- Etapa 6).  
        \* \*\*Arquivos de Projeto:\*\* \`.zip\` (Interpretado como importação de convite/backup para o fluxo de "Upload de ZIP Personalizado" ou "Importação Manual").

\#\#\#\# 2\. Interface de Exibição (Display Zone)  
A área de histórico de mensagens deve suportar a renderização de componentes de UI interativos (Rich UI) intercalados com mensagens de texto:  
\* \*\*Cards de Aprovação de Prompt:\*\*  
    \* Ao iniciar uma geração (Capa, Folha, etc.), o chat exibe um card com o \*resumo do design\* traduzido para o português.  
    \* \*\*Controles:\*\* Botões de "Aprovar" (Dispara o request com o prompt técnico em inglês para a API) e "Editar" (Permite o ajuste fino do texto antes do envio).  
\* \*\*Placeholders de Mídia (Progressivos):\*\*  
    \* \*\*Imagens:\*\* Exibe thumbnails/prévias das gerações. Clique expande para visualização completa (Lightbox) com opção de download.  
    \* \*\*Vídeos:\*\* Player HTML5 nativo para revisar loops e animações geradas.  
    \* \*\*Player de Áudio:\*\* Ao fazer upload de um arquivo de som (ou selecionar um sample), um player visual deve aparecer no chat permitindo o \*playback\* para confirmação da escolha.  
    \* \*\*Renderização HTML (Manual do Convidado):\*\* Para a Etapa 5, deve exibir o output HTML renderizado (texto estruturado \+ ícones) dentro de uma bolha do chat, permitindo validação visual imediata.  
\* \*\*Status e Feedback:\*\*  
    \* Indicadores de estado ("Gerando...", "Enviando...", "Tratando...") devem ser exibidos contextualmente na mensagem ativa, refletindo as etapas de APIs (ex: Hailuo, Fal.ai) e processos de build (Github Actions).

\#\#\#\# 3\. Lógica de Controle e Contexto  
O Chatbot deve manter um estado de contexto inteligente (Context-Awareness) para interpretar as ações do usuário:  
\* \*\*Interpretação de Uploads por Contexto:\*\*  
    \* Se o usuário arrastar um arquivo de áudio (\`.mp3\`/\`.m4a\`) em \*qualquer\* momento, o sistema deve assumir que é a música do convite, atualizando o campo correspondente na \*Janela de Música\* e no JSON de dados.  
    \* Se o usuário arrastar uma imagem durante a "Etapa 1", ela pode ser tratada como referência ou arquivo final, dependendo do comando acompanhante ou da seleção em botões de ação ("Usar como Referência" vs "Usar como Capa").  
\* \*\*Sincronização Bidirecional:\*\*  
    \* Comandos de texto que envolvem dados (Ex: "O evento será no Sítio Real") devem ser parseados via NLP e preencher instantaneamente os campos do \*Formulário\*.  
    \* O chat deve detectar solicitações de navegação ou ação (Ex: "Publicar agora") e acionar os gatilhos da \*Janela de Finalizar\*.

Janela do histórico (Histórico) \- \*\*Função:\*\* Gerenciamento de Repositório e Recuperação de Versões (Version Control Retrieval).

Esta janela atua como uma interface gráfica para o repositório do GitHub conectado, listando as implantações (deploys) anteriores e permitindo a recuperação de estados do projeto.

\#\#\#\# 1\. Lógica de Carregamento de Dados (Data Fetching Strategy)  
Para otimizar o Time-to-Interactive (TTI) e evitar latência excessiva em repositórios com muitos convites, o sistema \*\*não deve\*\* realizar um \*fetch\* em lote (batch) de todos os dados de uma vez.  
\* \*\*Carregamento Progressivo Sequencial (Sequential Lazy Loading):\*\*  
    \* O sistema deve iterar sobre a árvore de arquivos do repositório (via GitHub API), partindo do commit/pasta mais recente (baseado em \*timestamp\*) para o mais antigo.  
    \* \*\*Renderização Assíncrona:\*\* A cada convite identificado, o sistema deve realizar o \*fetch\* individual dos metadados mínimos necessários (Slug e Imagem da Capa) e renderizar o card imediatamente na DOM.  
    \* Este processo ocorre em "cascata": assim que o Card N é renderizado, inicia-se a busca pelo Card N-1. Isso garante que o usuário veja os convites recentes instantaneamente enquanto o histórico antigo carrega em background.

\#\#\#\# 2\. Componentes de UI (Cards de Histórico)  
A visualização deve ser disposta em uma lista ou grid de \*\*Cards Verticais\*\*, contendo:  
\* \*\*Visualização da Capa (Thumbnail):\*\*  
    \* Deve exibir a imagem \`capa\*.jpg\` (ou extensão compatível) presente na pasta do slug.  
    \* \*Nota:\* O sistema deve resolver dinamicamente o nome do arquivo, considerando a numeração aleatória de cache (ex: \`capa412842.jpg\`) definida na \*\*Etapa Final\*\*.  
\* \*\*Identificador:\*\* Exibição do \*\*Nome do Slug\*\* (identificador da URL/Pasta).  
\* \*\*Botões de Ação (Action Triggers):\*\*  
    1\.  \*\*Visualizar no GitHub:\*\* Link externo (\`target="\_blank"\`) direcionando para a árvore de arquivos específica daquele slug no repositório.  
    2\.  \*\*Visualizar Online (Live Preview):\*\* Link externo (\`target="\_blank"\`) para a URL final do GitHub Pages (o convite renderizado).  
    3\.  \*\*Importar para o Builder:\*\* Botão de ação interna.

\#\#\#\# 3\. Lógica de Importação (Import Logic)  
Ao clicar no botão "Importar direto do github":  
1\.  \*\*Reset de Ambiente:\*\* Dispara o script de "Novo Convite" (conforme definido em \*Flow Ideal com arquivos base\*), limpando o formulário, placeholders e contexto do Chatbot para evitar contaminação de dados.  
2\.  \*\*Fetching de Assets:\*\* O Builder baixa os arquivos mais recentes da pasta selecionada (imagens, vídeos, áudios).  
3\.  \*\*Injeção de Estado (State Hydration):\*\* O sistema lê o arquivo \`data\` (JSON) — criado na \*\*Etapa Final\*\* do convite original — e preenche programaticamente todos os campos do Formulário (inputs, toggles, cores) e as zonas de upload das Janelas (Capa, Folha, Música, etc.).

Janela do Formulário (Formulário) \- **Função:** Central de Dados, Parâmetros e Personalização Visual.

Esta janela consolida a entrada de dados explícitos do convite. Devido à densidade de informações, a UI deve priorizar a organização hierárquica, utilizando grupos colapsáveis (Accordions) ou Seções bem definidas para evitar fadiga cognitiva. O formulário possui *Two-Way Data Binding* (Vinculação Bidirecional) com o Chatbot: alterações aqui refletem no contexto da IA, e comandos no chat preenchem estes campos.

#### **1\. Arquitetura de Layout (UI/UX)**

* **Desktop:** Layout de colunas divididas (Split-Screen).  
  * **Coluna Esquerda (60-70%):** Área scrollável contendo os campos de input agrupados logicamente.  
  * **Coluna Direita (30-40%):** Painel fixo (Sticky) contendo o componente **"Prévia dos Botões"**, garantindo feedback visual imediato.  
* **Mobile:** Layout em pilha (Stacked).  
  * O formulário ocupa a tela. O componente de Prévia deve ser acessível via um botão flutuante (FAB) ou aba fixa "Ver Prévia" que abre um *Modal* ou *Drawer* sobreposto.

#### **2\. Agrupamento Lógico dos Campos (Sections)**

**A. Identidade do Evento (Dados Primários)** Campos essenciais que alimentam o Prompt da IA e variáveis de sistema.

* **Campos de Texto:** `Nome` (Input), `Tipo de Evento` (Select ou Input com sugestões), `Tema do Evento` (Input), `Local do Evento` (Input \- Nome/Endereço visual).  
* **Seletores de Tempo:** `Data` (Date Picker nativo) e `Hora` (Time Picker). Estes campos inicializam o *Countdown Timer*.  
* **Dados Demográficos:** `Idade` (Number Input) \- Define contexto etário para a arte.  
* **Mensagem:** `Frase do Convite` (Textarea \- Opcional) \- Texto para interpretação artística ou injeção direta.

**B. Estilização Visual (UI Kit Control)** Controles diretos sobre o CSS do arquivo final `index.html`.

* **Colorimetria:**  
  * `Paleta de Cores`: Input de texto ou Color Pickers múltiplos para guiar a IA.  
  * `Cor dos Botões`: Color Picker (Hex/RGB) com *live preview*.  
  * `Seletor de Sombra Gradiente`: Color Picker dedicado para configurar o `linear-gradient` inferior (fundo de legibilidade).  
* **Geometria e Layout:**  
  * `Posição dos Botões`: Slider ou Input Numérico (controla `bottom`/`top` CSS).  
  * `Tamanho dos Botões`: Slider ou Select (Pequeno, Médio, Grande) afetando `width`/`padding`.

**C. Funcionalidades e Navegação (Core & Links)** Gerenciamento de rotas e integrações externas.

* **Localização:** `Link do Google Maps` (URL Input) \- Validação básica de formato URL.  
* **Áudio:** `Música` (Input Read-only ou Texto).  
  * *UX:* Deve exibir o nome da faixa selecionada. Se vazio, exibe "Nenhuma música selecionada". Deve possuir um atalho/link ("Escolher Música") que redireciona o foco para a **Janela de Música**.  
* **Links Extras (Dynamic Array):**  
  * *Interface:* Lista dinâmica.  
  * *Controles:* Botão de Adicionar (+) que insere uma nova linha. Cada linha possui botão de Remover (-).  
  * *Estrutura da Linha:* \[Input Nome do Botão\] | \[Input URL\] | \[Seletor de Ícone (FontAwesome)\].

**D. Lógica Condicional e Módulos Especiais** Esta seção deve reagir dinamicamente aos estados definidos nas janelas específicas ou inputs inseridos.

* **Módulo de Presentes:**  
  * `Link de Presentes` (URL Input): Se preenchido, o sistema assume **Modo Link** (desabilitando visualmente acesso à Janela de Presentes). Se vazio, o sistema assume **Modo Popup** (dependente da geração na *Janela de Sugestão de Presentes*).  
  * *UX:* Incluir link rápido "Configurar Sugestões Visuais" que leva à janela específica se o campo URL estiver vazio.  
* **Módulo RSVP (Confirmação de Presença):**  
  * `Número do Whatsapp` (Phone Input com máscara).  
  * `Link de Confirmação` (URL Input \- ex: Google Forms).  
  * *Regra de Exibição:* Se ambos preenchidos, alertar sobre prioridade do Link Externo.  
  * *Toggle Dependente:* `Permitir Levar Acompanhante` (Switch). **Só deve estar habilitado/visível** se o campo `Número do Whatsapp` estiver preenchido e o `Link de Confirmação` vazio.  
* **Módulo Manual do Convidado:**  
  * `Instruções do Manual` (Textarea grande).  
  * *Comportamento:* A presença de texto aqui ativa o **Modo Texto (Popup)**. Se vazio, o sistema busca imagem na *Janela do Manual*.  
* **Timers:**  
  * `Toggle Timer de Contagem Regressiva` (Switch): Ativa/Desativa a injeção do script de contagem regressiva baseado nos inputs de Data/Hora.

#### **3\. Componente de Visualização (Preview dos Botões)**

Um container que simula o resultado final, essencial para ajuste fino de CSS sem necessidade de *Build* completo.

* **Device Emulation:** Viewport fixo simulando **Moto G75** (Aspect Ratio \~20:9, 1080x2400px logicamente escalado).  
* **Renderização:**  
  * Deve aplicar em tempo real: `Cor dos Botões`, `Tamanho`, `Posição`, `Sombra Gradiente` e a lista de botões (incluindo Extras).  
  * **Background:** Se a Imagem da Capa ou Folha já tiver sido gerada/uploadada em outras janelas, deve ser exibida como fundo deste preview. Caso contrário, usar um placeholder cinza neutro.

Janela da Capa (Capa) \-**Janela da Capa (Capa)**

**Função:** Interface dedicada à gestão, criação (via IA) e upload do ativo visual principal do convite: a **Capa**. Esta janela atua como o ponto de partida visual e fornece o *start-frame* para a geração de vídeo na **Janela da Animação da Capa**.

#### **1\. Interface de Visualização e Upload (Main Placeholder)**

* **Componente:** *Dropzone* com visualização de imagem (*Image Preview*).  
* **Estado Inicial:** Exibe um *placeholder* neutro indicando a área da Capa.  
* **Estado Preenchido:** Exibe a imagem atual definida como capa.  
* **Métodos de Entrada (Input Methods):**  
  * **Drag-and-Drop:** Aceita arrastar arquivos diretamente para a área.  
  * **Botão de Upload:** Abre o seletor nativo do SO.  
  * **Chatbot Injection:** O usuário pode fazer upload no chat e direcionar para cá via comando (ver *Integração com Chatbot*).  
* **Formatos Suportados:** `.png`, `.jpg`, `.jpeg`, `.webp`.  
* **Lógica de Build e Referência:**  
  * A extensão do arquivo carregado deve ser armazenada em uma variável de estado.  
  * Durante a **Etapa Final (Preview/Exportação)**, o sistema deve renomear o arquivo (ex: `capa[random_id].jpg`) para *cache busting* e injetar o caminho correto na tag `<img>` ou `style="background-image"` do HTML final.  
* **Ações de Controle:**  
  * **Botão Deletar:** Ícone ou botão sobreposto à imagem (visível apenas no *Estado Preenchido*) para remover o ativo e resetar para o *Estado Inicial*.

#### **2\. Controles de Geração via IA (Prompting & API)**

* **Campo de Prompt (Text Area):**  
  * Exibe o prompt textual que será enviado à API.  
  * *Sincronização:* O texto é pré-preenchido automaticamente com base nos dados do **Formulário** (Nome, Tema, Cores), mas é totalmente editável pelo usuário.  
* **Placeholder de Imagem de Referência (Opcional):**  
  * Permite anexar uma imagem guia (*Reference Image*) para influenciar o estilo ou composição.  
  * Possui botão próprio de **Deletar** para remover apenas a referência.  
* **Botão de Ação Primária ("Gerar" / "Regenerar"):**  
  * **Estado "Gerar":** Exibido quando não há imagem de Capa gerada/anexada.  
  * **Estado "Regenerar":** Exibido quando já existe uma imagem no *Main Placeholder*.  
  * **Lógica de Disparo (API Trigger):**  
* O sistema deve validar a presença de arquivos nos placeholders antes de montar a requisição (`payload`).  
* **Prioridade de Origem:** A presença de uma *Imagem de Referência* **anula** o uso da *Imagem da Capa Atual* como insumo para a geração.  
* **Cenário A (Sem Referência):**  
  * *Condição:* `Reference_Placeholder == null`  
  * *Ação:* Envia apenas o texto do *Campo de Prompt* para a **API de Criação de Imagem** (Mode: `Text-to-Image`).  
  * *Nota:* Mesmo se houver uma imagem no *Main Placeholder* (caso "Regenerar"), ela deve ser ignorada neste cenário, gerando uma nova versão do zero baseada apenas no texto.  
* **Cenário B (Com Referência):**  
  * *Condição:* `Reference_Placeholder != null`  
  * *Ação:* Envia o texto do *Campo de Prompt* \+ o arquivo do *Placeholder de Referência* para a **API de Edição de Imagem** (Mode: `Image-to-Image`).  
  * *Regra de Exclusão:* O arquivo presente no *Main Placeholder* **NÃO** deve ser enviado na requisição.

#### **3\. Ferramentas Externas e Recursos (Links)**

A janela deve conter uma seção ou menu de "Ferramentas Avançadas" com links diretos para plataformas de geração, permitindo ao usuário criar ativos externamente e importar manualmente:

* **Seedream v4 (Text-to-Image):** `https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image`  
* **Seedream v4.5 (Edit/Img-to-Img):** `https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit`  
* **Gemini (Prompting/Free Edit):** `https://gemini.google.com`  
* **PXZ.ai (Ferramenta Gratuita):** `https://pxz.ai/tools/image-generator`

#### **4\. Integração com Chatbot (Natural Language Control)**

Todas as funcionalidades da GUI devem ser acessíveis via comandos de texto no **Chatbot (Janela Inicial)**:

* **Gerenciamento de Arquivos:** "Use a imagem que enviei como Capa", "Apague a capa atual", "Use esta imagem como referência".  
* **Acionamento de API:** "Gerar a capa agora", "Regere a capa com mais brilho" (atualiza o prompt e clica em regenerar virtualmente).  
* **Navegação:** "Abra a janela da Capa", "Mostre os links de criação".  
* **Download:** "Baixar a capa atual" (deve acionar o download do arquivo em resolução original).

Janela da Folha vazia (Folha Vazia) \- **Função:** Interface dedicada à criação, upload e processamento técnico da base visual do convite (a "Folha"). Esta janela é crítica pois define o background estático e, via processamento, gera os ativos necessários (camadas separadas) para a **Janela da Animação do Background** e para a **Janela de Preenchimento da Folha**.

#### **1\. Arquitetura de Interface (UI/UX Responsiva)**

* **Desktop:** Layout de grade (Grid) ou Flexbox.  
  * **Coluna Principal:** Placeholder da Folha Vazia (Grande) e Controles de Prompt.  
  * **Coluna/Painel Inferior ou Lateral:** Área de "Tratamento e Camadas" (Placeholders menores para Background e Folha Recortada).  
* **Mobile:** Layout em Pilha (Stack). A área de "Tratamento" deve ser um *accordion* ou seção rolável abaixo da imagem principal para economizar espaço vertical.

#### **2\. Componente Principal: Visualização e Upload (Main Leaf Placeholder)**

* **Componente:** *Dropzone* com *Image Preview*.  
* **Estado Inicial:** Exibe *placeholder* indicando "Folha Vazia".  
* **Entrada de Arquivos:**  
  * **Drag-and-Drop:** Aceita `.png`, `.jpg`, `.jpeg`, `.webp`.  
  * **Botão de Upload:** Seletor de arquivos nativo.  
  * **Lógica de Build:** A extensão do arquivo original deve ser armazenada. No momento do *Build Final* (Janela de Finalizar), o sistema renomeia o arquivo para evitar cache (ex: `folha_base[id].png`) e injeta o caminho no HTML.  
* **Ações de Controle:**  
  * **Botão Deletar:** Remove a imagem e reseta o estado para "Vazio".  
  * **Botão Download:** Permite baixar o arquivo na resolução original.

#### **3\. Controles de Geração via IA (Prompting & Generation Logic)**

* **Campo de Prompt (Text Area):**  
  * Pré-preenchido com dados do **Formulário** (Tema, Cores, Evento), mas editável.  
* **Placeholder de Imagem de Referência (Opcional):**  
  * Permite anexar uma imagem guia.  
* **Botão de Ação Primária ("Gerar" / "Regenerar"):**  
  * **Lógica de Roteamento de API:**  
    * **SE** `Reference_Image == NULL`: Envia o prompt para **API Text-to-Image**.  
    * **SE** `Reference_Image != NULL`: Envia prompt \+ imagem de referência para **API Image-to-Image**.  
  * **Estado:** O botão muda de "Gerar" para "Regenerar" se o *Main Leaf Placeholder* já estiver preenchido.

#### **4\. Pipeline de Tratamento de Imagem (Segmentation & Inpainting)**

Esta funcionalidade é um *Gatekeeper* para o "Modo Video Loop".

* **Trigger:** Botão **"Realizar Tratamento"**.  
* **Pré-requisito:** O *Main Leaf Placeholder* deve estar preenchido.  
* **Ação do Botão:** Dispara duas requisições paralelas (ou sequenciais) para a **API de Edição de Imagem**:  
  * **Job A (Remove Background):** Mantém a folha, remove o fundo (Gera `leaf_only.png`).  
  * **Job B (Inpainting/Remove Object):** Remove a folha, reconstrói o fundo (Gera `background_only.jpg`).  
* **Placeholders de Resultado (Camadas):**  
  * Devem aparecer abaixo da imagem principal após o início do tratamento.  
  * **Placeholder A (Background sem Folha):** Exibe o resultado do Job B. Possui botão "Regenerar" independente.  
  * **Placeholder B (Folha sem Background):** Exibe o resultado do Job A. Possui botão "Regenerar" independente.  
* **Gestão de Estado Global (Video Loop Mode):**  
  * **Ativação:** O modo "Video Loop" só é ativado (flag `videoLoop = true`) se **ambos** os placeholders de tratamento estiverem preenchidos com sucesso.  
  * **Dependências:**  
    * A imagem `background_only.jpg` alimentará a **Janela da Animação do Background**.  
    * A imagem `leaf_only.png` alimentará a **Janela de Preenchimento da Folha** (para ser preenchida e depois sobreposta ao vídeo).  
  * **Desativação:** Se o usuário deletar qualquer imagem dos placeholders de tratamento ou não realizar o processo, `videoLoop = false`. O convite final usará a imagem estática do *Main Leaf Placeholder*.

#### **5\. Ferramentas Externas (Links)**

Lista de links rápidos para ferramentas de geração manual:

* **Seedream v4 (Criação):** `https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image`  
* **Seedream v4.5 (Edição):** `https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit`  
* **Gemini (Edição Gratuita/Prompting):** `https://gemini.google.com`  
* **PXZ.ai (Wrapper Gratuito):** `https://pxz.ai/tools/image-generator`

#### **6\. Integração com Chatbot (NLP Hooks)**

O controlador do Chatbot deve mapear intenções para funções desta janela:

* **Uploads:** "Use esta imagem como folha vazia", "Use isto como referência para a folha".  
* **Tratamento:** "Separe a folha do fundo", "Faça o tratamento da imagem da folha".  
* **Geração:** "Gere a folha agora", "Regere a folha sem fundo".  
* **Gestão:** "Apague a folha tratada", "Baixar imagem da folha".

Janela da Animação da Capa (Abertura) \- \*\*Função:\*\* Interface dedicada à geração de vídeo (Image-to-Video) e gestão do ativo de abertura do convite.

Esta janela consome o ativo estático gerado na \*\*Janela da Capa\*\* e o transforma em um loop de vídeo ou animação introdutória (\`.mp4\`). Ela atua como uma ponte entre a arte estática e a experiência dinâmica do convite.

\#\#\#\# \*\*1. Arquitetura de Interface (UI/UX Responsiva)\*\*  
\* \*\*Desktop:\*\* Layout dividido.  
    \* \*\*Painel Principal:\*\* Player de Vídeo/Placeholder (destaque).  
    \* \*\*Painel Lateral/Inferior:\*\* Controles de Prompt, Links de Ferramentas e Status da API.  
\* \*\*Mobile:\*\* Layout em Pilha (Stack). O Player de Vídeo deve ter prioridade visual no topo, seguido pelos controles.

\#\#\#\# \*\*2. Componente Principal: Visualização e Upload (Main Video Placeholder)\*\*  
\* \*\*Componente:\*\* Player de Vídeo HTML5 com controles nativos customizados e zona de \*Dropzone\*.  
\* \*\*Estado Inicial:\*\* Exibe um \*placeholder\* estático ou ícone de vídeo indicando "Nenhuma animação gerada".  
\* \*\*Entrada de Arquivos:\*\*  
    \* \*\*Drag-and-Drop:\*\* Aceita exclusivamente arquivos \`.mp4\`.  
    \* \*\*Botão de Upload:\*\* Abre o seletor nativo filtrando por \`video/mp4\`.  
\* \*\*Lógica de Build e Cache:\*\*  
    \* O sistema deve armazenar o arquivo resultante.  
    \* Durante a \*\*Etapa Final\*\*, o arquivo deve ser renomeado (ex: \`abertura\[random\_id\].mp4\`) para garantir a atualização de cache nos dispositivos dos convidados.  
\* \*\*Ações de Controle:\*\*  
    \* \*\*Botão Deletar:\*\* Remove o vídeo atual e reseta o estado para "Vazio".  
    \* \*\*Botão Download:\*\* Permite baixar o \`.mp4\` gerado/enviado.

\#\#\#\# \*\*3. Controles de Geração via IA (Image-to-Video Logic)\*\*  
\* \*\*Dependência Crítica (Input):\*\* Esta função depende da existência de uma imagem válida na \*\*Janela da Capa\*\*.  
    \* \*Validação:\* Se a Janela da Capa estiver vazia, os botões de geração desta janela devem estar desabilitados (Disabled state) com um \*tooltip\* instruindo o usuário a criar a capa primeiro.  
\* \*\*Campo de Prompt (Text Area):\*\*  
    \* Campo para descrição do movimento desejado (ex: "Camera zoom in, particles floating, cinematic lighting").  
    \* \*Sincronização:\* O Chatbot pode preencher este campo automaticamente baseado no contexto do \*\*Tema do Evento\*\*.  
\* \*\*Botão de Ação Primária ("Gerar" / "Regenerar"):\*\*  
    \* \*\*Estado "Gerar":\*\* Exibido quando o placeholder de vídeo está vazio.  
    \* \*\*Estado "Regenerar":\*\* Exibido quando já existe um vídeo, permitindo refazer.  
    \* \*\*Payload da API (Lógica de Backend):\*\*  
        \* Ao clicar, o sistema monta uma requisição contendo:  
            1\.  \*\*Source Image:\*\* A imagem atualmente definida na \*\*Janela da Capa\*\*.  
            2\.  \*\*Prompt:\*\* O texto contido no campo desta janela.  
            3\.  \*\*Keyframes (Regra de Negócio \- Etapa 2):\*\* Conforme definido no fluxo ideal, o sistema deve configurar (se a API suportar) a imagem da capa como \`start-frame\` e, para efeitos de loop ou transição suave, utilizar um \`blank.jpg\` (ou a própria capa novamente, dependendo do efeito desejado de loop) como referência de \`end-frame\`.  
\* \*\*Feedback Visual:\*\* Barra de progresso ou \*spinner\* deve indicar o processamento da API de Vídeo.

\#\#\#\# \*\*4. Ferramentas Externas (Links de Modelos)\*\*  
Links diretos para \*Playgrounds\* de modelos de vídeo, permitindo geração manual externa para posterior upload:  
\* \*\*Hailuo (Minimax):\*\* \`https://fal.ai/models/fal-ai/minimax/hailuo-02/standard/image-to-video/playground\`  
\* \*\*Kling Standard o1:\*\* \`https://fal.ai/models/fal-ai/kling-video/o1/standard/image-to-video\`  
\* \*\*Veo3.1 Fast:\*\* \`https://fal.ai/models/fal-ai/veo3.1/fast/first-last-frame-to-video\`

\#\#\#\# \*\*5. Integração com Chatbot (NLP Hooks)\*\*  
O orquestrador do Chatbot deve mapear comandos de linguagem natural para as funções desta janela:  
\* \*\*Uploads:\*\* "Use este vídeo como abertura/animação da capa" (detecta \`.mp4\` no chat).  
\* \*\*Geração:\*\* "Anime a capa agora", "Gere um vídeo da capa com movimento de zoom".  
    \* \*Ação:\* O Chatbot preenche o prompt na janela e dispara o clique virtual no botão "Gerar".  
\* \*\*Gestão:\*\* "Apague a animação da capa", "Baixar o vídeo da capa".  
\* \*\*Navegação:\*\* "Abra a janela de animação", "Quais ferramentas de vídeo posso usar?".

Janela da Animação do background da Folha (Folha) \- **Função:** Interface dedicada à geração de vídeo em loop (*Image-to-Video*) baseada no tratamento do background da folha.

Esta janela consome o ativo visual `background_only.jpg` (gerado pelo processo de tratamento na **Janela da Folha Vazia**) e o transforma em um vídeo ambiental (\`.mp4\`). Este vídeo será posicionado na camada `z-index: 10` do HTML final, servindo de fundo animado para os botões e sobreposto pela folha recortada (`leaf_only.png`).

#### **1\. Arquitetura de Interface (UI/UX Responsiva)**

* **Desktop:** Layout dividido (*Split-Screen*).  
  * **Painel Principal:** Player de Vídeo/Placeholder (destaque visual).  
  * **Painel Lateral/Inferior:** Controles de Prompt, Links de Ferramentas e Status de Dependência.  
* **Mobile:** Layout em Pilha (*Stack*). O Player de Vídeo tem prioridade no topo, seguido pelos controles.

#### **2\. Componente Principal: Visualização e Upload (Main Loop Placeholder)**

* **Componente:** Player de Vídeo HTML5 com controles nativos e zona de *Dropzone*.  
* **Estado Inicial:** Exibe um *placeholder* estático ou ícone indicando "Nenhum loop gerado".  
* **Entrada de Arquivos:**  
  * **Drag-and-Drop:** Aceita exclusivamente arquivos `.mp4`.  
  * **Botão de Upload:** Abre o seletor nativo filtrando por `video/mp4`.  
* **Lógica de Build e Cache:**  
  * O arquivo resultante deve ser salvo como `loop.mp4`.  
  * Durante a **Etapa Final**, o sistema deve renomear o arquivo (ex: `loop[random_id].mp4`) para *cache busting*.  
* **Ações de Controle:**  
  * **Botão Deletar:** Remove o vídeo atual, reseta o estado para "Vazio" e atualiza a variável global `videoLoop = false`.  
  * **Botão Download:** Permite baixar o arquivo `.mp4` carregado/gerado.

#### **3\. Controles de Geração via IA (Image-to-Video Logic)**

* **Gatekeeper (Dependência Crítica):**  
  * Esta função depende estritamente da existência da imagem tratada `background_only.jpg` (Background da Folha).  
  * **Validação:** Se a imagem "Background da Folha" não existir (ou seja, se o tratamento na **Janela da Folha Vazia** não foi executado), os botões de geração desta janela devem permanecer **Bloqueados/Desabilitados**, exibindo um alerta ou *tooltip*: *"Realize o tratamento da Folha Vazia primeiro"*.  
* **Campo de Prompt (Text Area):**  
  * Campo para descrição do movimento ambiente (ex: "Wind blowing softly, particles, light rays, cinematic, slow motion").  
  * *Sincronização:* O Chatbot pode preencher este campo baseado no *Tema do Evento*.  
* **Botão de Ação Primária ("Gerar" / "Regenerar"):**  
  * **Estado "Gerar":** Exibido quando o placeholder está vazio e a dependência `background_only.jpg` foi satisfeita.  
  * **Estado "Regenerar":** Exibido quando já existe um vídeo.  
  * **Payload da API (Lógica de Loop Perfeito):**  
    * Ao clicar, o sistema monta uma requisição para a API de Vídeo contendo:  
      1. **Source Image (Start-Frame):** A imagem `background_only.jpg`.  
      2. **Prompt:** O texto contido no campo desta janela.  
      3. **End-Frame (Opcional/Recomendado):** Para garantir um loop perfeito (se a API suportar), deve-se enviar a mesma imagem `background_only.jpg` também como frame final, ou instruir a API via prompt para criar um loop contínuo (*seamless loop*).

#### **4\. Ferramentas Externas (Links de Modelos)**

Links diretos para *Playgrounds* de modelos de vídeo para criação manual:

* **Hailuo (Minimax):** `https://fal.ai/models/fal-ai/minimax/hailuo-02/standard/image-to-video/playground`  
* **Kling Standard o1:** `https://fal.ai/models/fal-ai/kling-video/o1/standard/image-to-video`  
* **Veo3.1 Fast:** `https://fal.ai/models/fal-ai/veo3.1/fast/first-last-frame-to-video`

#### **5\. Integração com Chatbot (NLP Hooks)**

O orquestrador do Chatbot deve mapear comandos de linguagem natural para todas as funções desta janela:

* **Uploads:** "Use este vídeo como fundo/loop da folha" (detecta `.mp4` no chat e injeta neste placeholder).  
* **Geração:** "Anime o fundo da folha", "Gere um loop de vento para o background".  
  * *Ação:* Verifica a existência de `background_only.jpg`. Se existir, preenche o prompt e dispara a geração. Se não, avisa o usuário sobre a dependência.  
* **Navegação e Acesso:** "Abra a janela do loop da folha", "Quais sites posso usar para animar o fundo?".  
* **Gestão:** "Apague o loop atual", "Baixar o vídeo do background".

Janela de Preenchimento da folha (Preencher Folha) \- **Função:** Interface híbrida dedicada à composição final da camada visual dos botões. Esta janela define se o convite usará uma renderização em camadas (*Layered Rendering*) ou um vídeo único composto (*Flat Rendering*).

#### **1\. Arquitetura de Lógica (Smart Composition)**

O sistema deve detectar o **Tipo de Arquivo** presente no placeholder principal desta janela para determinar a estrutura do HTML final:

* **Modo Superposição (Automático):** Se o arquivo for uma **Imagem** (`.png`, `.webp` com transparência).  
  * *Build:* O HTML final renderizará o vídeo da *Janela de Animação do Background* no `z-index: 10` e esta imagem no `z-index: 20` (camada `folha-overlay`).  
  * *Vantagem:* Elimina a necessidade de edição de vídeo externa (Canva).  
* **Modo Composição Manual (Flat):** Se o arquivo for um **Vídeo** (`.mp4`).  
  * *Build:* O sistema ignora o vídeo da *Janela de Animação do Background* e utiliza *apenas* este vídeo no `z-index: 10`.  
  * *Uso:* Para usuários que preferiram baixar os ativos e unificá-los externamente.

#### **2\. Componente Principal: Visualização e Upload**

* **Componente:** *Smart Dropzone* com suporte a mídia mista.  
* **Entrada de Arquivos:**  
  * **Imagens:** `.png`, `.webp`. (Ativa Modo Superposição).  
  * **Vídeos:** `.mp4`. (Ativa Modo Composição Manual).  
* **Estado Inicial:** Exibe placeholder indicando "Arraste a Folha Preenchida (PNG) ou o Vídeo Final (MP4)".

#### **3\. Controles de Geração via IA (Image Generation)**

* **Foco:** Geração da imagem estática (Folha Preenchida).  
* **Botão "Preencher" / "Refazer":**  
  * Envia o prompt \+ a imagem `leaf_only.png` (Folha sem background vinda da Etapa 1\) para a API de *Inpainting* ou *Image-to-Image*.  
  * *Nota:* Se a *Janela de Animação do Background* estiver vazia (modo estático), envia a folha original.  
* **Links de Ferramentas:** Seedream v4, v4.5, Gemini e PXZ.ai (mesmos links das outras janelas).

#### **4\. Integração com Chatbot**

* **Comandos de Upload:**  
  * "Use esta imagem como folha preenchida" \-\> Sistema anexa imagem, ativa Modo Superposição.  
  * "Use este vídeo como fundo final" \-\> Sistema anexa vídeo, ativa Modo Composição Manual (substituindo o loop anterior).  
* **Gestão de Downloads:**  
  * O usuário pode pedir: "Baixar a folha preenchida" e "Baixar o loop de fundo" separadamente para realizar a montagem manual no Canva, se desejar.

Para que toda essa lógica funcione, você precisará alterar a estrutura do `final_template.html` (não precisa reescrever o arquivo inteiro agora, mas considere isso na implementação):

**Adição no HTML:** É necessário criar uma nova tag `<img>` ou `<div>` acima do `#videoLoop` para receber a folha preenchida no **Modo Superposição**.  
HTML  
\<video id="videoLoop" class="camada z-10 ..." src="\[\[VIDEO\_SOURCE\]\]"\>\</video\>

\<img id="imgOverlayFolha" class="camada z-20 \[\[OVERLAY\_VISIBILITY\_CLASS\]\]" src="\[\[OVERLAY\_SOURCE\]\]"\>

**Lógica de Injeção (Build Script):**

* **SE** Input \== Imagem:  
  * `[[VIDEO_SOURCE]]` \= `loop/loop.mp4` (da Janela Background).  
    * `[[OVERLAY_SOURCE]]` \= `folha/preenchida.png`.  
    * `[[OVERLAY_VISIBILITY_CLASS]]` \= `visivel`.  
  * **SE** Input \== Vídeo:  
    * `[[VIDEO_SOURCE]]` \= `folha/video_composto.mp4` (da Janela Preencher Folha).  
    * `[[OVERLAY_VISIBILITY_CLASS]]` \= `invisivel`.

Janela de Criação da Sugestão de Presentes (Presentes) \- Janela de Criação da Sugestão de Presentes (Presentes) \- **Função:** Interface dedicada ao gerenciamento do módulo "Lista de Presentes", operando em dois estados mutuamente exclusivos: **Modo Link Externo** (Redirecionamento) ou **Modo Popup de Imagem** (Visualização Interna).

#### **1\. Arquitetura de Estado e Lógica Condicional (State Management)**

Esta janela deve reagir dinamicamente à variável de estado `giftMode` (ou similar), determinada pela presença de dados no campo "Link de Presentes" do **Formulário Global**.

* **Estado A: Modo Link Externo (Prioritário)**  
  * **Ativação:** Ocorre automaticamente se o campo `link_presentes` (URL) do formulário estiver preenchido.  
  * **Interface:**  
    * Oculta todos os placeholders de imagem, controles de IA e ferramentas de edição.  
    * Exibe um card informativo: *"O botão de presentes está configurado para redirecionar para: \[URL\_DO\_LINK\]"*.  
    * **Ação:** Exibe o botão/toggle **"Alternar para Modo Popup de Imagem"**.  
      * *Ao clicar:* Limpa a variável `link_presentes` no formulário global e ativa o **Estado B**.  
* **Estado B: Modo Popup de Imagem**  
  * **Ativação:** Ocorre se `link_presentes` for nulo/vazio.  
  * **Interface:** Exibe a UI completa de Upload, Prompting e Geração descrita abaixo.  
  * **Ação:** Exibe o botão/toggle **"Alternar para Modo Link"**.  
    * *Ao clicar:* Solicita uma URL (input modal ou foco no campo do formulário), define `link_presentes` e ativa o **Estado A**, ocultando/limpando a imagem atual.

#### **2\. Interface do Modo Imagem (UI/UX Responsiva)**

Quando no **Estado B**, a interface deve apresentar:

* **A. Componente Principal: Visualização e Upload (Main Gift Placeholder)**  
  * **Visualização:** Exibe a imagem gerada ou enviada.  
  * **Input Methods:**  
    * **Drag-and-Drop:** Aceita arquivos `.png`, `.jpg`, `.jpeg`, `.webp`.  
    * **Botão Upload:** Seletor nativo de arquivos.  
  * **Lógica de Build:**  
    * Armazena a referência da extensão do arquivo.  
    * Na **Etapa Final**, renomeia o arquivo (ex: `presentes[id].jpg`) e injeta no `src` da tag `<img id="imagemPresentes">` do HTML (`final_template.html`).  
    * Garante que o botão do menu (`menuConfig`) receba a propriedade `isGiftImage: true` para acionar a função `abrirPresentes()` no script final.  
  * **Controles:** Botão de **Deletar** (sobreposto) para remover o arquivo.  
* **B. Painel de Prompt e Contexto (Generation Controls)**  
  * **Input "Lista de Itens" (Data Binding):**  
    * Campo de texto ou *tags input* espelhando a lista de sugestões inserida no **Formulário**.  
    * *Sincronização:* Edições aqui devem refletir no contexto da IA, mas idealmente devem manter *Two-Way Binding* com o formulário principal para consistência.  
  * **Input "Prompt de Geração" (Text Area):**  
    * Pré-preenchido automaticamente combinando: *Tema do Evento* \+ *Paleta de Cores* \+ *Lista de Itens*.  
    * Totalmente editável pelo usuário para refinar instruções artísticas.  
  * **Placeholder de Referência (Opcional):**  
    * Dropzone pequena para anexar imagem guia (Style Reference).  
    * Contém botão **Deletar** individual.  
* **C. Ações de Geração (API Triggers)**  
  * **Botão "Gerar" / "Regenerar":**  
    * *Estado:* Muda para "Regenerar" se o placeholder principal já contiver uma imagem.  
    * *Lógica de API:*  
      * **SE** `Reference_Image == NULL`: Envia Prompt para API **Text-to-Image**.  
      * **SE** `Reference_Image != NULL`: Envia Prompt \+ Referência para API **Image-to-Image**.  
      * **Nota de Integração (Flow Ideal):** Conforme descrito no fluxo, esta etapa pode opcionalmente ingerir o `background_only.jpg` (da Etapa 1\) como base para manter a identidade visual, funcionando como um *Inpainting* ou *Composition* sobre o fundo do convite.

#### **3\. Ferramentas Externas e Chatbot**

* **Links de Ferramentas (Quick Access):**  
  * Seedream v4 (Criação): `https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image`  
  * Seedream v4.5 (Edição): `https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit`  
  * Gemini (Prompting): `https://gemini.google.com`  
  * PXZ.ai (Free Wrapper): `https://pxz.ai/tools/image-generator`  
* **Integração com Chatbot (NLP Intent Mapping):**  
  * **Controle de Modo:** "Mude para link de lista de presentes", "Quero usar uma imagem com a lista".  
  * **Gerenciamento de Arquivos:** "Use esta imagem como lista de presentes", "Apague a imagem de presentes".  
  * **Edição de Dados:** "Adicione 'Liquidificador' na lista de presentes" (Atualiza o input de Lista e regenera o contexto do prompt).  
  * **Geração:** "Gere a imagem da lista agora", "Refaça a lista com fundo mais claro".

Janela do Manual do Convidado (Manual do Convidado) \- **Função:** Interface dual para gerenciamento de informações logísticas do evento. Opera em dois estados mutuamente exclusivos: **Modo Texto (Popup Otimizado)** ou **Modo Imagem (Arte Visual)**.

Esta janela define o comportamento do botão "Manual do Convidado" no `index.html` final, alterando dinamicamente o *Event Listener* e o conteúdo carregado no modal.

#### **1\. Arquitetura de Estado e Lógica de Alternância**

O estado da janela é determinado pela presença de dados no campo *Instruções do Manual* do **Formulário Global**.

* **Estado A: Modo Texto (Prioritário)**  
  * **Ativação:** Automática se o campo de texto do formulário contiver caracteres.  
  * **Comportamento:** Oculta placeholders de imagem e ferramentas de geração visual. Exibe o editor de texto e prévia HTML.  
  * **Toggle de Ação:** Botão **"Alternar para Modo Popup de Imagem"**.  
    * *Ação:* Limpa o campo de texto do formulário (resetando para `null`), remove a flag de texto e exibe a UI do **Estado B**.  
* **Estado B: Modo Imagem (Visual)**  
  * **Ativação:** Automática se o campo de texto estiver vazio e/ou o usuário alternar manualmente.  
  * **Comportamento:** Exibe placeholders de upload, controles de Prompt IA e ferramentas de edição.  
  * **Toggle de Ação:** Botão **"Alternar para Modo Texto"**.  
    * *Ação:* Foca no input de texto (ou abre modal de inserção), oculta a UI de imagem e ativa o **Estado A**.

#### **2\. Interface do Modo Imagem (UI/UX Responsiva)**

Visível apenas no **Estado B**.

* **A. Componente Principal: Visualização e Upload**  
  * **Main Placeholder:**  
    * *Visualização:* Exibe a imagem do manual (se anexada).  
    * *Input Methods:* Drag-and-Drop e Botão de Upload (`.png`, `.jpg`, `.jpeg`, `.webp`).  
    * *Controle:* Botão **Deletar** (sobreposto) que limpa o ativo.  
  * **Lógica de Build:**  
    * No momento da exportação, o arquivo é renomeado (ex: `manual[id].jpg`) e salvo na pasta `/manual`.  
    * O objeto do botão no script `menuConfig` recebe a flag `isManualImage: true`.  
* **B. Controles de Geração via IA (Prompting)**  
  * **Campo de Prompt (Editável):** Texto base para a API de imagem.  
  * **Placeholder de Referência:** Dropzone opcional para *Style Reference* (Image-to-Image). Possui botão **Deletar** próprio.  
  * **Botão de Ação ("Gerar" / "Regenerar"):**  
    * *Estado:* Muda para "Regenerar" se já houver imagem no Main Placeholder.  
    * *API Trigger:* Envia Prompt (+ Referência, se houver) para a API de Criação/Edição.  
* **C. Ferramentas Externas (Links Rápidos):**  
  * Seedream v4 (Criação): `https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image`  
  * Seedream v4.5 (Edição): `https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit`  
  * Gemini (Edição/Prompting): `https://gemini.google.com`  
  * PXZ.ai (Wrapper Gratuito): `https://pxz.ai/tools/image-generator`

#### **3\. Interface do Modo Texto (Processamento NLP e HTML)**

Visível apenas no **Estado A**.

* **Fluxo de Otimização (Chatbot Pipeline):**  
  * Ao inserir/receber texto bruto (Input), o Chatbot deve processar o conteúdo via NLP com o objetivo de **Estruturação e Harmonização**.  
  * **Regras de Output:** O texto deve ser convertido em HTML estruturado, utilizando quebras de linha (`<br>`, `<p>`) e injeção de ícones da biblioteca **Font Awesome** contextualizados (ex: Ícone de carro para instruções de estacionamento).  
* **Componentes de UI:**  
  * **Visualizador de Renderização (Preview):** Um container que renderiza o HTML final para aprovação visual (WYSIWYG), exibindo os ícones e a formatação real.  
  * **Editor de HTML Bruto (Raw Edit):** Um `textarea` ou editor de código que permite ao usuário ajustar manualmente as tags HTML geradas pela IA.  
* **Lógica de Build:**  
  * O HTML resultante é injetado como *String* na propriedade `manualText` do objeto correspondente em `menuConfig`.  
  * O objeto do botão recebe a flag `isManualImage: false`.

#### **4\. Integração com Chatbot (Natural Language Control)**

O orquestrador deve mapear comandos para todas as funcionalidades desta janela:

* **Controle de Modo:** "Mude o manual para texto", "Prefiro usar uma imagem no manual".  
* **Geração e Upload:** "Gere uma imagem para o manual com regras da casa", "Use esta foto como manual", "Apague a imagem do manual".  
* **Manipulação de Texto:**  
  * *Input:* "O manual deve dizer: Traje Esporte Fino e chegar às 20h". \-\> O sistema detecta o texto, ativa o Modo Texto, estrutura com ícones (ex: 👔, 🕗) e apresenta a prévia.  
  * *Edição:* "Troque o ícone do traje por um vestido" \-\> O sistema edita o HTML bruto.  
* **Navegação:** "Abra a janela do manual", "Quais sites servem para criar o manual?".

Janela de Música (Música) \- **Função:** Interface dedicada ao gerenciamento da trilha sonora do convite. Esta janela centraliza o upload de arquivos de áudio e a seleção de faixas pré-definidas (Samples), garantindo que o usuário defina o arquivo de som que tocará em *loop* no convite.

#### **1\. Arquitetura de Interface (UI/UX Responsiva)**

* **Desktop:** Layout dividido (*Split-Screen*).  
  * **Topo (Painel Ativo):** Player de Áudio Principal (Preview da Seleção Atual) e *Dropzone* de Upload.  
  * **Base (Biblioteca):** Lista scrollável ou Grid da "Biblioteca de Samples" (Músicas Padrão).  
* **Mobile:** Layout em Pilha (*Stack*).  
  * O Painel Ativo (Player \+ Upload) é fixado no topo ou ocupa a primeira dobra visual. A Biblioteca de Samples aparece listada logo abaixo.

#### **2\. Componente Principal: Upload e Visualização (Main Audio Controller)**

* **Componente:** *Smart Dropzone* combinada com Player HTML5.  
* **Estado Inicial:**  
  * Exibe *placeholder* com ícone musical e texto: "Arraste seu áudio (MP3/M4A) ou escolha um Sample abaixo".  
  * Exibe "Nenhuma música selecionada" no display do player.  
* **Entrada de Arquivos (Upload Manual):**  
  * **Drag-and-Drop Global:** O sistema deve aceitar arquivos arrastados para a janela, validando extensões `.mp3` e `.m4a`.  
  * **Botão de Upload:** Abre o seletor nativo do SO filtrando por `audio/mpeg` e `audio/mp4`.  
  * Importante: Como não há compressão de servidor, se o usuário subir um WAV de 50MB, o site final ficará pesado. Portanto, coloque uma validação simples no upload: *"Arquivo muito grande. Recomendamos MP3 abaixo de 5MB para carregamento rápido no celular."*  
* **Lógica de Build e Normalização:**  
  * **Armazenamento:** O arquivo selecionado (Upload do usuário ou cópia do Sample) é armazenado temporariamente no blob/memória do navegador.  
  * **Exportação (Build):** Na **Etapa Final**, o arquivo ativo deve ser renomeado para `musica.mp3` (ou `musica.m4a`) e salvo na pasta `/musica` do ZIP ou do repositório.  
  * **Tratamento de Extensão no HTML:** O script de build deve detectar a extensão do arquivo final e atualizar a tag `<source>` no `index.html` para corresponder ao MIME type correto (ex: se for `.m4a`, mudar type para `audio/mp4`).  
* **Ações de Controle:**  
  * **Player:** Botões Play/Pause e barra de progresso para revisar a faixa escolhida.  
  * **Botão Deletar:** Remove o arquivo atual e reseta o estado para "Sem Música".

#### **3\. Biblioteca de Samples (Músicas Padrão)**

Uma coleção de arquivos de áudio pré-carregados no Builder para usuários que não possuem arquivos próprios.

* **Interface:** Lista ou Cards contendo `{ Título da Música, Duração, Gênero }`.  
* **Interatividade:**  
  * **Botão Play (Preview):** Toca a música apenas para audição, sem defini-la como a música do convite. Deve pausar o *Main Audio Controller* se estiver tocando.  
  * **Botão Selecionar ("Usar esta"):**  
    * *Ação:* Clona o arquivo do sample para o contexto do **Main Audio Controller**.  
    * *Visual:* O Sample selecionado deve ganhar destaque visual (borda ou cor ativa) na lista.  
    * *Dados:* Atualiza o campo "Música" no formulário global com o nome do sample.

#### **4\. Integração com Chatbot e Formulário**

* **Sincronização de Estado:**  
  * O campo "Música" na **Janela do Formulário** deve ser *Read-Only* ou permitir apenas limpar a seleção. Ele deve refletir o nome do arquivo carregado nesta janela.  
* **Comandos via Chat (NLP):**  
  * **Upload:** Se o usuário arrastar um áudio para o chat ou fizer upload lá, o chatbot deve perguntar: "Deseja usar este áudio como música de fundo?". Se sim, injeta o arquivo nesta janela.  
  * **Seleção:** Comandos como "Use a música padrão de aniversário" podem buscar na Biblioteca de Samples e selecionar automaticamente.  
  * **Gestão:** "Remover a música", "Qual música está selecionada?".

Janela de Prévia, Exportação de Publicação (Finalizar) \- **Função:** Hub central de compilação, persistência de dados, exportação local e *deploy* contínuo para o GitHub Pages. Inclui controles de proteção de propriedade intelectual (Marca d'água de Pagamento).

#### **1\. Arquitetura de Interface (UI/UX Responsiva)**

* **Desktop:**  
  * **Painel Esquerdo (Controles de Publicação):**  
    * **Input "Slug":** Campo de texto para definir a URL final (`usuario.github.io/repo/[SLUG]`).  
    * **Toggle "Modo Prévia (Aguardando Pagamento)":**  
      * *Estado:* Switch On/Off.  
      * *Descrição:* Quando ativado, insere um aviso semi-transparente fixo na tela do convite.  
    * **Visualizador de Status (Steps):** Componente visual que mostra o progresso do deploy.  
    * **Botão Primário "Publicar":** Ação de destaque.  
  * **Painel Direito (Ações Rápidas):**  
    * Grid de botões grandes: **"Preview Local"**, **"Baixar ZIP"**.  
    * **Zona de Importação (Custom Deploy):** Área de *Dropzone* com botão **"Upload ZIP Personalizado"**.  
* **Mobile:**  
  * Layout em Pilha (*Stack*). Ordem: Input Slug \-\> **Toggle Modo Prévia** \-\> Botão Publicar \-\> Visualizador de Status \-\> (Separador) \-\> Botão Preview \-\> Botão Baixar ZIP \-\> Zona Upload ZIP.

#### **2\. Pipeline de Build (Core Logic: `executeBuild()`)**

Esta função é executada obrigatoriamente antes de qualquer ação de Saída.

1. **Geração de Identificadores (Cache Busting Strategy):**  
   * Gera ID único (ex: `_v8492`) e renomeia virtualmente todos os arquivos ativos (`capa[ID].jpg`, `loop[ID].mp4`, etc.) para evitar cache.  
2. **Tratamento de Mídia:**  
   * Detecta extensão do áudio e define `[[AUDIO_TYPE]]` (`audio/mpeg` ou `audio/mp4`).  
3. **Persistência de Estado (`data.json`):**  
   * Cria o JSON contendo todos os inputs, incluindo o estado do **Toggle Modo Prévia**.  
4. **Lógica da Marca D'água (Novo):**  
   * **SE** `Toggle Modo Prévia == ON`:  
     * Define a variável `[[WATERMARK_CLASS]]` como `"visivel"`.  
     * Define o texto `[[WATERMARK_TEXT]]` (ex: "PRÉVIA \- AGUARDANDO PAGAMENTO FINAL").  
   * **SE** `Toggle Modo Prévia == OFF`:  
     * Define a variável `[[WATERMARK_CLASS]]` como `"oculto"` (display: none).  
5. **Renderização do Template (`final_template.html`):**  
   * Carrega o HTML base e substitui as variáveis.  
   * Gera o script `menuConfig` com botões e links.  
6. **Estruturação do Sistema de Arquivos Virtual (VFS):**  
   * Organiza dados na memória (`/index.html`, `/capa/`, `/loop/`, etc.).

#### **3\. Mecânica da Marca D'água (Especificação Técnica do `index.html`)**

Para garantir que o aviso cumpra seu papel sem estragar a experiência de navegação:

**Estrutura HTML Injetada:**  
HTML  
\<div id="watermarkOverlay" class="\[\[WATERMARK\_CLASS\]\]"\>  
  \<p\>PRÉVIA DO CONVITE\<br\>Aguardando Pagamento Final\</p\>  
\</div\>

*   
* **Estilização CSS (Injetada no Head):**  
  * `position: fixed;` (Fica preso na tela mesmo ao rolar).  
  * `top: 50%; left: 50%; transform: translate(-50%, -50%);` (Centralizado perfeitamente).  
  * `z-index: 9999;` (Acima de tudo, inclusive modais, mas abaixo de alertas do sistema).  
  * `opacity: 0.4;` (Visível, mas permite ver o design atrás).  
  * `font-size: 2rem; font-weight: bold; text-align: center; color: #fff; text-shadow: 0px 0px 10px rgba(0,0,0,0.8);` (Legível em qualquer fundo).  
  * **Importante:** `pointer-events: none;` (Isso permite que o cliente clique nos botões e links *através* do texto, sem que o aviso bloqueie a interação).  
* **Comportamento (Script):**  
  * O aviso inicia com `display: none` ou `opacity: 0`.  
  * No evento de clique da capa ("Abrir Convite"), junto com o *fade-in* dos botões, o script dispara o aparecimento do `#watermarkOverlay`.

#### **4\. Funcionalidades de Saída**

* **A. Preview Local:** Executa `executeBuild()` e abre o HTML. (Útil para você verificar se o aviso está legível antes de mandar).  
* **B. Exportar ZIP:** Gera o `.zip` da estrutura.  
* **C. Publicação no GitHub:**  
  * Verifica conflito de Slug.  
  * Executa o Build.  
  * Realiza Commit/Push.  
  * Feedback Visual de progresso.

#### **5\. Módulo de Importação Direta (ZIP Personalizado)**

* Permite upload de ZIP. Bypass do `executeBuild()` e Wipe & Replace no repositório.

{Fim de Janelas do Builder}

{Flow Ideal sem arquivos base}  
Um fluxo de criação é iniciado, com uma barra de status superior minimalista para cada criação de material via API que acompanha a geração de Imagem/Vídeo.

# Etapa 1 \- Criação de Imagens Base da Capa e da Folha Vazia.

Esta etapa foca na geração dos ativos estáticos primários `capa.jpg` e `folha_base.png`. O fluxo é conduzido via **Janela Inicial (Chatbot)**, mas reflete o estado e permite controle granular nas **Janela da Capa** e **Janela da Folha Vazia**.

**1\. Geração e Aprovação de Prompts (Contexto & NLP)**

* **Trigger:** Início do fluxo de criação. O sistema lê os dados populados na **Janela do Formulário** (Nome, Tema, Cores, Tipo de Evento).  
* **Processamento:**  
  * O Chatbot gera prompts descritivos (Natural Language) para a Capa.  
  * **UX do Chat:** Exibe um *Card de Aprovação* contendo apenas a descrição estética traduzida (ex: *"Arte floral aquarela com tons pastéis..."*), ocultando parâmetros técnicos (ratio, lighting, lens) que compõem o payload final.  
* **Interação:**  
  * O usuário pode refinar o design via texto (ex: "Troque as flores por estrelas"). O prompt é atualizado em tempo real.  
  * **Aprovação:** Ao clicar em "Aprovar" ou confirmar via texto, o payload completo (Prompt Técnico em Inglês \+ Parâmetros) é enviado para a **API de Criação de Imagem (Text-to-Image)**.  
* **Sequenciamento:** O fluxo prioriza a **Capa**. Assim que a requisição da Capa é disparada, o chat inicia imediatamente o processo de aprovação do prompt da **Folha Vazia**, otimizando o tempo de espera.

**2\. Renderização, Feedback e Iteração (Loop de Criação)**

* **Exibição:** Assim que a API retorna os assets:  
  * **No Chat:** Exibe thumbnails expansíveis (Lightbox) com opção de "Download (Original Quality)".  
  * **Nas Janelas Específicas:** Os arquivos preenchem automaticamente os *Placeholders Principais* da **Janela da Capa** e **Janela da Folha Vazia**.  
* **Lógica de Edição (IA Inteligente):**  
  * O Chatbot deve analisar a intenção do usuário ao solicitar alterações:  
    * *Caso A (Regeneração):* "Não gostei, faça outra" \-\> Altera a Seed ou ajusta o Prompt e chama **Text-to-Image** novamente (Reset do ativo).  
    * *Caso B (Edição Pontual):* "Remova o pássaro" ou "Aumente o brilho" \-\> Mantém a imagem atual como *Input Image* e chama a **API de Edição (Inpainting/Image-to-Image)**.

**3\. Intervenção Manual e Upload (Override System)**

* **Flexibilidade:** Em qualquer momento desta etapa, o usuário pode realizar uploads via Chat ou Drag-and-Drop nas Janelas.  
* **Lógica de Contexto:** O sistema deve perguntar ou identificar a intenção via comando:  
  * *Input como Referência:* "Use isso de base" \-\> Anexa a imagem ao payload da API (Image-to-Image) para a próxima geração.  
  * *Input como Final:* "Use esta imagem como Capa" \-\> Cancela gerações pendentes, define o arquivo como o asset final (`capa.jpg` ou `folha_base.png`) e avança o progresso.  
* **Responsividade:** Em Mobile, o upload deve ser acessível tanto pelo clipe no chat quanto pelos botões de upload nas Janelas (que devem estar em layout de pilha/stack).

**4\. Pipeline de Tratamento da Folha (Segmentação & Camadas)**

* **Pré-requisito:** A imagem da **Folha Vazia** (`folha_base.png`) deve estar aprovada/definida.  
* **Condicional de Fluxo:** Se o usuário optar por **não animar** o background (decisão via Chat ou Toggle), esta sub-etapa é pulada.  
* **Execução (Split Processing):** Caso a animação seja desejada, o sistema envia a `folha_base.png` para a **API de Edição** em duas requisições paralelas:  
  * **Job Remoção de Fundo:** Retorna `leaf_only.png` (Transparência preservada, apenas os elementos da folha).  
  * **Job Remoção de Objeto (Inpainting):** Retorna `background_only.jpg` (Reconstrução do fundo sem a folha/borda).  
* **Output:**  
  * Os resultados são exibidos no Chat e populam os *Placeholders de Camadas* na **Janela da Folha Vazia**.  
  * Esses arquivos são dependências críticas (Blocking Dependencies) para a **Etapa 2 (Criação de Animação)** e **Etapa 3 (Composição)**.

#  Etapa 2 \- Criação de Animação.

Esta etapa foca na transformação dos ativos estáticos gerados na **Etapa 1** em vídeos dinâmicos. O processo é sequencial e gerenciado pelo **Chatbot**, mas reflete o estado em tempo real nas **Janela da Animação da Capa (Abertura)** e **Janela da Animação do background da Folha**.

**1\. Fluxo de Geração Assistida (Chatbot Pipeline)**

* **Lógica de Sequenciamento:**  
  * O sistema processa primeiro a **Animação da Capa** (prioridade visual) e, em seguida, a **Animação do Background da Folha**.  
  * *Condicional de Background:* Se na Etapa 1 o usuário optou por não tratar a folha (resultando na inexistência de `background_only.jpg`), a sub-etapa de animação do background é automaticamente ignorada.  
* **Prompting e Aprovação:**  
  * O Chatbot gera um prompt descritivo em português baseado no *Tema do Evento* (ex: "Movimento de câmera lento, partículas douradas flutuando").  
  * **Interação:** O usuário aprova ou solicita ajustes.  
  * **Tradução e Envio:** Após aprovação, o sistema traduz o prompt para inglês (Technical Prompt) e monta o payload para a **API de Vídeo (Image-to-Video)**.

**2\. Regras de Negócio e Payloads da API (Technical Specs)**

O sistema deve configurar parâmetros específicos de *Keyframes* para garantir a fluidez da experiência do usuário final (`index.html`):

* **A. Animação da Capa (Abertura):**  
  * **Target Window:** *Janela da Animação da Capa*.  
  * **Input (Start-Frame):** Imagem `capa.jpg` (Gerada na Etapa 1).  
  * **Keyframe Logic (Transição):** Para criar um efeito de transição suave ou fade-out no final da abertura:  
    * `start_image`: `capa.jpg`  
    * `end_image`: `blank.jpg` (Arquivo preto ou branco sólido, ou conforme definição de estilo).  
  * **Output:** Arquivo `abertura.mp4`.  
* **B. Animação do Background (Loop):**  
  * **Target Window:** *Janela da Animação do background da Folha*.  
  * **Input (Start-Frame):** Imagem `background_only.jpg` (Gerada na Etapa 1).  
  * **Keyframe Logic (Seamless Loop):** Para garantir que o vídeo funcione como um fundo infinito sem cortes visíveis:  
    * `start_image`: `background_only.jpg`  
    * `end_image`: `background_only.jpg` (A mesma imagem do início).  
  * **Output:** Arquivo `loop.mp4`.

**3\. Tratamento de Feedback e Refinamento (Smart Context)**

O Chatbot deve distinguir entre solicitações de *Regeneração* e *Alteração de Prompt*:

* **Cenário A (Retry/Refazer):** Se o usuário diz "Refaça" ou "Tente de novo" sem novos detalhes, o sistema mantém o prompt original e a imagem base, solicitando uma nova *Seed* à API.  
* **Cenário B (Edit Prompt):** Se o usuário diz "Adicione mais brilho" ou "Faça mais lento", o sistema atualiza o prompt técnico mantendo a imagem base e dispara a nova geração.  
* **Visualização:**  
  * Os vídeos gerados são exibidos imediatamente no fluxo do Chat e nos placeholders das respectivas Janelas.  
  * **UX Responsiva:** O player no chat deve permitir visualização em tela cheia (*Fullscreen*) e download direto.

**4\. Gestão de Estado e Sincronização UI**

* **Atualização de Janelas:** Assim que um vídeo é aprovado no chat, ele deve popular automaticamente o *Main Video Placeholder* da janela correspondente.  
* **Controle Manual:** O usuário pode, a qualquer momento, acessar as janelas específicas para fazer upload manual (`.mp4`), o que sobrescreve a geração da IA.  
* **Responsividade:**  
  * Em **Desktop**, a atualização reflete nos painéis laterais/divididos.  
  * Em **Mobile**, como as janelas estão em *Stack* (pilha), o Chatbot é a interface principal de feedback, mas ao navegar para a janela específica, o vídeo já deve estar carregado no topo da tela.

#  Etapa 3 \- Preenchimento da Folha e Composição Final. 

Com a folha vazia tratada e as animações de fundo criadas, define-se a visualização final da tela de botões. O prompt base de preenchimento é enviado no chat. Após aprovação, a API gera a **Folha Preenchida** (com texto/elementos) sobre a base transparente (`leaf_only.png`).

A partir daqui, o fluxo se bifurca automaticamente conforme a ação do usuário:

* **Caminho A (Automático \- Superposição):**  
  * O usuário aprova a imagem gerada (ou faz upload de um PNG próprio).  
  * **O Builder entende:** Manter a imagem como *Overlay*.  
  * **Resultado:** No convite final, o navegador carrega dois arquivos: o `loop.mp4` (fundo) e a `folha_preenchida.png` (frente), sobrepondo-os perfeitamente. Nenhuma edição de vídeo é necessária.  
* **Caminho B (Manual \- Canva/Edição Externa):**  
  * O usuário baixa a **Folha Preenchida** (gerada nesta etapa) e o **Loop de Fundo** (gerado na Etapa 2).  
  * O usuário une os arquivos em software externo (ex: Canva), criando um único vídeo.  
  * O usuário faz o upload desse **Novo Vídeo** na Janela de Preenchimento da Folha.  
  * **O Builder entende:** Substituir o loop original pelo novo vídeo composto.  
  * **Resultado:** O convite final carrega apenas um arquivo `video_final.mp4`.

# Etapa 4 \- Módulo de Sugestões de Presentes (Link Externo vs. Popup Visual)

Esta etapa gerencia a criação ou configuração da funcionalidade "Lista de Presentes". O sistema opera sob uma lógica de exclusão mútua entre dois modos: **Modo Link Externo** (Redirecionamento) e **Modo Popup Visual** (Imagem Interna).

#### **1\. Definição de Modos e Lógica de Estado**

O comportamento do botão "Lista de Presentes" no convite final (`index.html`) e a interface do Builder dependem da variável de estado associada ao input `link_presentes` do **Formulário Global**:

* **Prioridade:** O **Modo Link Externo** tem precedência. Se o campo de URL estiver preenchido, o Modo Popup é desabilitado/oculto.  
* **Responsividade:** No mobile, as interações via Chatbot são prioritárias. No Desktop, o usuário tem acesso visual simultâneo ao Chat e à **Janela de Criação da Sugestão de Presentes**.

#### **2\. Fluxo A: Modo Link Externo (Redirecionamento)**

* **Trigger via Chatbot (NLP):** O usuário pode colar uma URL no chat com uma intenção natural (ex: *"Aqui está o link da minha lista na Amazon: https://..."*). O orquestrador NLP deve identificar a URL e injetá-la automaticamente no campo `link_presentes` do Formulário.  
* **Trigger Manual:** O usuário insere a URL diretamente no input correspondente na **Janela do Formulário** ou no modal de configuração da **Janela de Presentes**.  
* **Resultado no Build:** O botão renderizado no menu (`menuConfig`) terá um atributo `href` apontando para o link externo e `isGiftImage: false`.

#### **3\. Fluxo B: Modo Popup Visual (Imagem Interna)**

Ativado quando não há Link Externo definido. O objetivo é gerar ou carregar uma imagem (`.jpg`, `.png`) contendo a lista de presentes visualmente integrada ao tema.

* **Entrada de Dados:**  
  * **Upload Manual:** Via Drag-and-Drop (Chat ou Janela) ou Botão de Upload.  
  * **Geração via IA (API de Edição):** Foco na integração visual com a identidade do convite.

#### **4\. Lógica de Geração IA (Technical Specs)**

Se o usuário optar por criar a lista via IA, o fluxo segue rigorosamente a consistência visual estabelecida na **Etapa 1**.

1. **Contexto e Prompting:**  
   * O Chatbot envia um *Prompt Base* sugestivo (ex: *"Lista de presentes elegante, fundo suave, contendo: Liquidificador, Toalhas..."*), derivado dos inputs de "Sugestões de Presentes" do Formulário.  
   * O usuário aprova ou edita o prompt no Chat.  
2. **Montagem do Payload (Dependência da Etapa 1):**  
   * Uma vez aprovado, o sistema dispara uma requisição para a **API de Edição (Image-to-Image/Inpainting)**.  
   * **Input Image (Critical Dependency):** O sistema deve recuperar a imagem `background_only.jpg` gerada na **Etapa 1** (resultado do tratamento de remoção de objeto da folha).  
   * **Objetivo:** A IA deve escrever/compor os textos da lista *sobre* este background limpo, garantindo que a lista de presentes tenha exatamente o mesmo fundo animado (estaticamente) do resto do convite.  
   * *Fallback:* Se `background_only.jpg` não existir (usuário pulou o tratamento da Etapa 1), usar a `folha_base.png` ou gerar um fundo novo baseado apenas no Prompt (Text-to-Image).  
3. **Feedback e Sincronização:**  
   * O progresso é exibido na barra de status superior.  
   * A imagem resultante (`presentes_gen.jpg`) é exibida simultaneamente no fluxo do Chat (com zoom/download) e no *Main Placeholder* da **Janela de Presentes**.

#### **5\. Opcionalidade e Exclusão**

* **Pular Etapa:** Se o usuário não interagir com esta etapa e os campos (Link e Imagem) permanecerem vazios, o botão "Lista de Presentes" **não** será gerado no `menuConfig` final.  
* **Remoção:** O usuário pode excluir a imagem gerada (botão "Deletar" na Janela) ou apagar o link do formulário a qualquer momento. Isso remove o botão do convite.

#   Etapa 5 \- Manual do Convidado.

Esta etapa define o comportamento e o conteúdo do botão "Manual do Convidado". O sistema opera em dois estados mutuamente exclusivos: **Modo Texto** (Renderização HTML com Ícones) ou **Modo Imagem** (Popup de Arte Visual).

#### **1\. Arquitetura de Estado e Decisão Lógica**

O Builder deve monitorar o campo `manual_text` (Instruções do Manual) do **Formulário Global** e gerenciar uma variável de estado interna para o HTML final (`finalManualHTML`):

* **Prioridade (Modo Texto):** Se o campo `manual_text` contiver caracteres, o sistema ativa o **Modo Texto**.  
* **Fallback (Modo Imagem):** Se `manual_text` estiver vazio/nulo, o sistema ativa o **Modo Imagem**.  
* **Estado Nulo (Skip):** Se ambos (texto e imagem) estiverem vazios, o botão "Manual do Convidado" é removido da lista `menuConfig` no build final.

#### **2\. Fluxo A: Modo Texto (Processamento NLP e HTML Seguro)**

Focado na legibilidade e estruturação de informações logísticas. Este fluxo exige um gerenciamento de estado cuidadoso para preservar edições manuais do usuário.

* **Input e Processamento Inicial (NLP):**  
  * **Trigger:** O usuário digita instruções brutas no Chat ou no input do Formulário (ex: *"A festa começa às 20h..."*).  
  * **Ação da IA:** O Chatbot processa o texto visando **Harmonização e Estruturação**.  
  * **Regra de Output:** A IA converte o texto bruto em HTML estruturado (`<br>`, `<p>`, `<strong>`) e injeta ícones da biblioteca **Font Awesome 6.4.0** (ex: "Estacionamento" \-\> `<i class="fa-solid fa-car"></i>`).  
  * **Inicialização de Estado:** O resultado deste processamento é salvo imediatamente na variável de estado `finalManualHTML`.  
* **Interface de Aprovação e Edição (UI/UX):**  
  * **Visualização Híbrida:**  
    1. **Preview (Render):** Renderiza o conteúdo de `finalManualHTML` (WYSIWYG).  
    2. **Editor Raw (Código):** Um `textarea` vinculado (*Two-Way Binding*) à variável `finalManualHTML`.  
* **Persistência de Edições Manuais (Crítico):**  
  * Se o usuário editar o código diretamente no **Editor Raw** (ex: trocar um ícone manualmente), a variável `finalManualHTML` deve ser atualizada em tempo real.  
  * **Regra de Build:** A função `executeBuild()` (Etapa Final) deve ler o conteúdo de `finalManualHTML` e **NÃO** reprocessar o input original `manual_text`. Isso garante que o refinamento manual do usuário nunca seja sobrescrito por uma nova passagem da IA.

#### **3\. Fluxo B: Modo Imagem (Arte Visual Integrada)**

Focado em criar uma peça gráfica única contendo as informações.

* **Entrada de Dados:**  
  * **Upload Manual:** Drag-and-drop ou seletor de arquivos (`.jpg`, `.png`).  
  * **Geração via IA (Composition):** Utiliza a API de Edição (Image-to-Image).  
* **Pipeline de Geração (Dependência da Etapa 1):**  
  * **Input Image:** O sistema recupera a imagem `background_only.jpg` (gerada na **Etapa 1** \- Tratamento da Folha).  
  * **Objetivo:** A IA deve gerar os elementos textuais/gráficos do manual *sobre* o fundo limpo do convite, garantindo identidade visual (paleta e estética) perfeita.  
  * **Fallback:** Se a Etapa 1 foi pulada, utiliza `folha_base.png` ou gera do zero (Text-to-Image).  
* **Feedback Visual:** A imagem resultante popula o placeholder da **Janela do Manual**.

#### **4\. Responsividade e Gestão de Arquivos (Build)**

* **Mobile Experience:**  
  * Priorizar o Chatbot para aprovação inicial da estruturação NLP.  
  * O botão "Editar HTML" deve abrir o Editor Raw em um modal de tela cheia ou drawer, maximizando o espaço de digitação.  
* **Execução do Build (Exportação):**  
  * **Se Modo Texto:** O sistema captura a string `finalManualHTML`, minifica (remove quebras de linha desnecessárias do código) e a injeta na propriedade `manualText` dentro do objeto do botão no `data.json` e `menuConfig`. Flag: `isManualImage: false`.  
  * **Se Modo Imagem:** O arquivo ativo é renomeado para `manual[random_id].jpg`, salvo na pasta `/manual`, e a flag é definida como `isManualImage: true`.

#   Etapa 6 \- Música

Esta etapa foca na definição da identidade sonora do convite. O usuário deve selecionar um único arquivo de áudio que será reproduzido em *loop* no `index.html`. O sistema oferece duas vias de entrada: **Upload de Arquivo Próprio** ou **Seleção de Biblioteca de Samples**.

#### **1\. Arquitetura de Interface (UI/UX Responsiva)**

A **Janela de Música** deve operar como um controlador de mídia centralizado.

* **Painel Principal (Active Player):**  
  * Exibe a faixa atualmente selecionada.  
  * Controles: Play/Pause, Barra de Progresso e Botão **Remover** (Limpar seleção).  
  * *Feedback Visual:* Se nenhuma música estiver selecionada, exibe o estado "Sem Áudio".  
* **Biblioteca de Samples (Listagem):**  
  * Lista de áudios pré-carregados no sistema (assets estáticos do Builder).  
  * **Layout Desktop:** Painel lateral ou inferior ao Player Principal.  
  * **Layout Mobile:** Lista rolável posicionada abaixo do Player Principal (Stack).

#### **2\. Fluxo de Entrada de Dados (Input Methods)**

* **Método A: Upload de Arquivo Próprio**  
  * **Drag-and-Drop Global:** O sistema deve aceitar arquivos arrastados tanto para a Janela de Música quanto para a área do Chatbot (Janela Inicial).  
  * **Formatos Suportados:** `.mp3` (MPEG) e `.m4a` (AAC/MP4 Audio). *Nota: Arquivos `.wav` devem ser bloqueados ou convertidos no client-side para evitar peso excessivo no load final.*  
  * **Validação:** Alerta de tamanho máximo sugerido (ex: 5MB) para garantir performance em redes móveis 4G/5G.  
* **Método B: Seleção via Biblioteca (Samples)**  
  * Cada item da lista possui dois gatilhos distintos:  
    1. **Botão Play (Preview):** Reproduz o áudio apenas para conferência, sem vinculá-lo ao convite. Pausa qualquer outro áudio em execução.  
    2. **Botão Selecionar (Commit):** Define o arquivo como a "Música do Convite".  
       * *Ação Técnica:* O sistema clona o blob/referência do sample para o estado do **Main Audio Controller**.  
       * *Feedback:* O item na lista ganha destaque (borda/cor ativa) e o nome aparece no Painel Principal.

#### **3\. Lógica de Build e Tratamento de Arquivos (Technical Specs)**

Para garantir a compatibilidade cross-browser (especialmente Safari iOS e Chrome Android), o sistema de Build (detalhado na **Etapa Final**) deve tratar o arquivo com rigor:

1. **Renomeação e Persistência:**  
   * Independentemente do nome original (ex: `coldplay_v2.mp3`), o arquivo selecionado é renomeado para `musica[random_id].[ext]` na exportação.  
2. **MIME Type Handling (Crítico):**  
   * O `final_template.html` possui a tag `<audio id="musicaFundo"><source src="..." type="..."></audio>`.  
   * O Builder deve detectar a extensão do arquivo ativo:  
     * **SE** `.mp3` \-\> Injeta `type="audio/mpeg"`.  
     * **SE** `.m4a` \-\> Injeta `type="audio/mp4"`.  
   * *Erro Comum:* Servir `.m4a` com header `audio/mpeg` pode quebrar a reprodução em dispositivos Apple. A IDE deve garantir essa lógica condicional.

#### **4\. Integração com Chatbot (Context Awareness)**

O Chatbot atua como um facilitador para uploads rápidos:

* **Upload via Chat:** Se o usuário arrastar um arquivo de áudio para a conversa, o Bot pergunta: *"Deseja definir este áudio como a música de fundo?"*. Ao confirmar, o arquivo é enviado para o Player Principal da Janela de Música.  
* **Comandos NLP:**  
  * *"Tire a música"* \-\> Aciona a função de limpar seleção.  
  * *"Use a música padrão de Casamento"* \-\> Busca na biblioteca de samples por *tags* ou nome e seleciona automaticamente.

#  Etapa Final \- Preview, Exportação e Publicação.

Esta etapa atua como o orquestrador final do AutoBuilder. Ela consolida todos os ativos gerados nas etapas anteriores, compila o código-fonte e gerencia a distribuição do convite, incluindo mecanismos de proteção de propriedade intelectual.

#### **1\. Arquitetura de Interface (UI/UX Responsiva)**

* **Desktop (Split-Screen):** \* **Painel Esquerdo (Controles de Publicação):** \* **Input "Slug":** Campo de texto para definir a URL final (`usuario.github.io/repo/[SLUG]`).  
  * **Toggle "Modo Prévia (Pagamento Pendente)":** Switch para ativar/desativar a marca d'água de proteção na tela.  
  * **Visualizador de Status (Steps):** Componente visual que mostra o progresso do deploy (ex: Ícones de "Build", "Upload", "Live").  
  * **Botão Primário "Publicar":** Ação de destaque.  
  * **Painel Direito (Ações Rápidas):** \* Grid de botões grandes: **"Preview Local"**, **"Baixar ZIP"**.  
    * **Zona de Importação (Custom Deploy):** Área de *Dropzone* com botão **"Upload ZIP Personalizado"** para *bypass* do construtor.  
* **Mobile (Stack Layout):** \* Ordem de empilhamento vertical: Input Slug \-\> **Toggle Modo Prévia** \-\> Botão Publicar \-\> Visualizador de Status \-\> (Separador) \-\> Botão Preview \-\> Botão Baixar ZIP \-\> Zona Upload ZIP.

#### **2\. Pipeline de Build (Core Logic: `executeBuild()`)**

Esta função é o "coração" do sistema, executada obrigatoriamente antes de qualquer ação de Saída (Preview, ZIP ou Publicação Padrão).

1. **Geração de Identificadores (Cache Busting Strategy):** \* O sistema deve gerar um ID único (ex: Timestamp ou Random Hash `_v8492`) para esta build.  
   * **Renomeação de Ativos:** Todos os arquivos ativos (blobs em memória ou URLs) devem ser renomeados virtualmente para evitar cache agressivo dos navegadores e CDNs:  
     * `capa.jpg` \-\> `capa[ID].jpg`  
     * `loop.mp4` \-\> `loop[ID].mp4`  
     * `musica.mp3` \-\> `musica[ID].mp3` (e assim por diante).  
2. **Tratamento de Mídia (Audio MIME Type Handler):** \* Verificar a extensão do arquivo na **Janela de Música**.  
   * Definir a variável de injeção `[[AUDIO_TYPE]]`:  
     * Se `.mp3`: `audio/mpeg`  
     * Se `.m4a`: `audio/mp4`  
3. **Persistência de Estado (`data.json`):** \* O sistema deve criar um objeto JSON contendo **absolutamente todos** os inputs e configurações atuais do Builder, incluindo o estado do **Toggle Modo Prévia**.  
   * **Campos Obrigatórios:** Nome, Data, Hora, Idade, Tipo/Tema Evento, Paleta, Configurações de Botões, Frase, Música, Local/Maps, Links Extras, Toggle Acompanhante, Toggle Timer, Texto/HTML do Manual, Dados de RSVP e **Status do Watermark**.  
4. **Configuração da Marca D'água (Proteção de Pagamento):** \* **Verificação Lógica:** O sistema lê o estado do Toggle "Modo Prévia".  
   * **SE Ativado (ON):** \* Define a variável `[[WATERMARK_VISIBILITY]]` como `"visivel"`.  
     * Injeta o CSS responsável por exibir o aviso persistente: `position: fixed; pointer-events: none; opacity: 0.5; z-index: 9999`. A propriedade `pointer-events: none` é crítica para garantir que o aviso não bloqueie cliques nos botões.  
   * **SE Desativado (OFF):** \* Define a variável `[[WATERMARK_VISIBILITY]]` como `"oculto"` (`display: none`).  
5. **Renderização do Template (`final_template.html`):** \* Carregar o HTML base.  
   * **Substituição de Variáveis:** Trocar todas as chaves `[[KEY]]` pelos valores processados (incluindo `[[WATERMARK_VISIBILITY]]`).  
   * **Injeção de Script (`menuConfig`):** \* Gerar dinamicamente o array JS `const menuConfig = [...]` combinando botões nativos e links extras.  
6. **Estruturação do Sistema de Arquivos Virtual (VFS):** \* Organizar os dados na memória (preparação para ZIP ou Commit):  
   * `/index.html` (Processado com ou sem marca d'água)  
   * `/data.json` (Estado)  
   * `/capa/` (Imagem renomeada)  
   * `/loop/` (Vídeo/Imagem renomeados)  
   * `/abertura/` (Vídeo renomeado)  
   * `/musica/` (Áudio renomeado)  
   * `/manual/` (Se houver imagem)  
   * `/presentes/` (Se houver imagem)

#### **3\. Funcionalidades de Saída**

**A. Preview Local**

* **Ação:** Executa `executeBuild()`.  
* **Output:** Abre o `index.html` resultante em uma nova aba. Se o Modo Prévia estiver ativo, o aviso de pagamento pendente aparecerá sobre o convite imediatamente após a abertura.

**B. Exportar ZIP**

* **Ação:** Executa `executeBuild()`.  
* **Output:** Gera e dispara o download do arquivo `.zip` contendo a estrutura VFS completa (com a proteção ativa, se selecionada).

**C. Publicação no GitHub (Deploy)**

* **Input:** Campo "Slug".  
* **Validação de Conflito (GitHub API):** \* Antes de iniciar, fazer um `GET /repos/{owner}/{repo}/contents/{slug}`.  
  * **SE Status 200 (Existe):** Exibir Modal de Alerta: *"O convite '{slug}' já existe. Deseja sobrescrever/atualizar?"*.  
  * **SE Confirmado ou 404 (Não existe):** Prosseguir.  
* **Execução:** \* Rodar `executeBuild()`.  
  * Utilizar a API do GitHub para realizar o *commit* e *push* dos arquivos na pasta `/{slug}`.  
* **Feedback Visual (Status Inteligente):** \* A barra de status deve refletir etapas reais: *1\. Build Local \-\> 2\. Upload para GitHub \-\> 3\. Aguardando GitHub Actions (Deploy)*.  
  * Ao concluir, exibir link final e link do código-fonte.

#### **4\. Módulo de Importação Direta (ZIP Personalizado)**

Funcionalidade para usuários avançados que editaram o código externamente e desejam apenas usar o AutoBuilder como ferramenta de deploy.

* **Trigger:** Upload de arquivo `.zip` na zona dedicada.  
* **Pré-requisito:** Campo "Slug" deve estar preenchido.  
* **Lógica de Execução (Bypass & Wipe):** 1\. **NÃO** executa `executeBuild()` (preserva os arquivos originais do ZIP do usuário, incluindo qualquer marca d'água ou ausência dela definida externamente).  
  2\. **Limpeza Remota:** Remove recursivamente todo o conteúdo da pasta `/{slug}` no repositório.  
  3\. **Upload:** Descompacta o ZIP e envia os arquivos brutos para o repositório.  
  4\. Aciona o mesmo **Feedback Visual** da publicação padrão.

{Fim do Flow Ideal sem arquivos base}

{Flow Ideal com arquivos base}

Este fluxo define as rotas alternativas de entrada de dados no AutoBuilder, permitindo que o usuário inicie um projeto a partir de arquivos existentes em vez de criar do zero (Prompt-to-Creation). O sistema deve suportar três modalidades de entrada: **Importação de ZIP Local**, **Importação via GitHub (Histórico)** e **Upload Manual Individual**.

Independentemente da origem, o objetivo final é popular o estado da aplicação (variáveis, inputs do formulário e placeholders visuais) para permitir edição contínua via **Janela do Formulário**, **Janelas de Mídia** ou comandos do **Chatbot**.

#### **1\. Rotina de Reset de Ambiente (`resetBuilderState()`)**

Para garantir a integridade dos dados e evitar "contaminação" de estados anteriores, uma função de limpeza profunda deve ser executada imediatamente **antes** de qualquer processo de importação (Seja via ZIP ou GitHub).

* **Escopo de Ação:**  
  1. **Limpeza de Variáveis:** Reseta o objeto global `data.json` e o array `menuConfig`.  
  2. **Limpeza de UI (Formulário):** Limpa todos os `inputs`, `textareas` e reseta `toggles` para o estado `false` (padrão).  
  3. **Limpeza de Assets (Placeholders):** Remove as referências de blob/URL de todas as janelas (Capa, Folha, Vídeos, Áudio, Manual, Presentes) e restaura os placeholders visuais para o estado "Vazio".  
  4. **Reset de Contexto (IA):** Limpa o histórico de conversa do Chatbot e reseta as instruções de sistema para o "Início de Projeto".

#### **2\. Caminho A: Importação Manual (ZIP Local)**

Permite ao usuário carregar um projeto previamente exportado pelo AutoBuilder.

* **Trigger:** Upload de arquivo `.zip` na **Janela de Finalizar** (Botão "Upload ZIP Personalizado") ou via *Drag-and-Drop* na **Janela Inicial**.  
* **Processamento (Client-Side Parsing):**  
  1. **Execução:** Chama `resetBuilderState()`.  
  2. **Leitura do ZIP:** Utiliza biblioteca JS (ex: `JSZip`) para ler a estrutura de diretórios na memória.  
  3. **Extração de Estado (`data.json`):**  
     * Localiza e parsa o arquivo `data.json` na raiz do ZIP.  
     * **Hidratação do Formulário:** Mapeia cada chave do JSON para o respectivo input na **Janela do Formulário** (Ex: `json.nome` \-\> `input#nome`).  
  4. **Reconstrução de Mídia (Assets Hydration):**  
     * Itera sobre as pastas de mídia (`/capa`, `/loop`, `/musica`, etc.).  
     * Converte os arquivos encontrados em objetos `File` ou `Blob`.  
     * Injeta esses blobs nos placeholders das janelas correspondentes (ex: Arquivo em `/capa/*.jpg` é exibido na **Janela da Capa**).  
* **Resultado:** O Builder entra em estado de "Edição", idêntico ao estado final de uma criação do zero.

#### **3\. Caminho B: Importação do GitHub (Via Janela de Histórico)**

Permite recuperar um convite já publicado para realizar atualizações ou correções.

* **Interface (Janela de Histórico):**  
  * Exibe cards dos convites publicados. Cada card possui o botão de ação: **"Importar para o Builder"**.  
* **Lógica de Fetch e Seleção de Versão:**  
  * **Execução:** Chama `resetBuilderState()`.  
  * **Request API:** O sistema faz um `GET` na árvore de arquivos do repositório correspondente ao *slug* selecionado.  
  * **Critério de Seleção de Arquivos (Handling Cache Busting):**  
    * Como os arquivos possuem IDs aleatórios (ex: `capa_v832.jpg`), o sistema não pode buscar nomes estáticos.  
    * **Prioridade 1 (Via `data.json`):** Baixa e lê o `data.json` remoto. Usa os nomes de arquivos referenciados nele para buscar os assets exatos.  
    * **Prioridade 2 (Fallback Timestamp):** Se o `data.json` estiver corrompido ou ausente, o sistema deve listar os arquivos da pasta (ex: `/musica/`) e baixar o arquivo com o *timestamp* de commit mais recente.  
  * **Hidratação:** Processo idêntico ao do ZIP (Preenchimento de inputs e injeção de Blobs nos placeholders).  
* **UX Responsiva:**  
  * Durante o download dos assets, exibir um *Overlay* de carregamento ("Importando projeto..."), pois a latência de rede pode variar.

#### **4\. Caminho C: Upload Manual Individual**

O usuário constrói o convite "colcha de retalhos", subindo arquivos separadamente em cada janela.

* **Trigger:** Botões de Upload ou *Dropzones* nas janelas específicas (Capa, Folha, Música, etc.).  
* **Comportamento:**  
  * Não aciona `resetBuilderState()` (preserva o que já foi feito).  
  * Substitui apenas o ativo da janela específica.  
  * Atualiza o contexto do Chatbot (ex: "Nova capa definida manualmente").

#### **5\. Fluxo de Publicação e Atualização (Merge Logic)**

Ao finalizar as edições (vindas de qualquer um dos caminhos acima), o usuário aciona a publicação na **Janela de Finalizar**.

* **Detecção de Conflito (Slug Check):**  
  1. Se o usuário mantiver o mesmo `Slug` da importação original.  
  2. O sistema detecta via API que a pasta já existe.  
  3. Exibe Modal: *"O convite já existe. Deseja atualizar?"*.  
* **Execução da Atualização (Cache Busting Strategy):**  
  1. **Renomeação Crítica:** O processo `executeBuild()` gera **novos IDs aleatórios** para todos os arquivos (mesmo os que não foram alterados visualmente).  
     * *Por que?* Para garantir que, ao substituir o site, os navegadores dos convidados baixem a nova versão e não sirvam a versão em cache antigo.  
  2. **Deploy (Commit):**  
     * O sistema envia os novos arquivos.

{Fim do Flow Ideal com arquivos base}

**{Chatbot Inteligente}**

**(Núcleo de Orquestração e Inteligência do AutoBuilder)**

O Chatbot não é apenas uma interface de texto; é um agente autônomo com permissão de leitura/escrita no estado global do builder. Ele atua como um *Middleware* inteligente entre a intenção do usuário (Linguagem Natural) e a execução técnica (Funções do Sistema/APIs).

#### **1\. Arquitetura e Prompt Mestre (System Instruction)**

O "Cérebro" do Chatbot deve ser inicializado com um System Prompt robusto que defina sua persona, suas capacidades e, crucialmente, suas limitações de escopo.

**System Prompt (Definição Técnica):**

"Você é o **AutoBuilder AI**, um assistente especializado em design e engenharia de convites digitais interativos. Sua função é guiar o usuário na criação de convites web complexos, orquestrando a geração de ativos (Imagens/Vídeos via APIs externas) e a configuração de dados (JSON/HTML).

**Suas Diretrizes Primárias:**

1. **Gerenciamento de Estado:** Você tem acesso de leitura/escrita ao objeto global `builderState`. Se o usuário disser 'O evento é um casamento', você deve chamar a função `updateState({ tipo_evento: 'Casamento' })` imediatamente.  
2. **Proatividade Visual:** Sempre que gerar um prompt de imagem ou vídeo, apresente-o ao usuário para aprovação antes de chamar a API de geração. Use linguagem descritiva e artística em Português para o usuário, mas converta para Inglês Técnico ao chamar as APIs (Fal.ai/Minimax).  
3. **Contexto e Continuidade:** Mantenha o contexto das etapas. Se o usuário estiver na etapa de 'Capa', não sugira músicas, a menos que solicitado.  
4. **Segurança de Importação:** Ao receber arquivos ou dados brutos, valide a estrutura antes de aplicar. Se detectar formatos obsoletos (Legacy), inicie o protocolo de Migração Assistida.  
5. **Tom de Voz:** Profissional, criativo e direto. Evite jargões de programação excessivos ao falar com o usuário, mas seja rigoroso nos logs e chamadas de função."

#### **2\. Mapeamento de Funções (Function Calling Tools)**

O Chatbot deve ter acesso a um conjunto estrito de ferramentas ("Tools") para manipular o sistema. A IDE deve configurar estas definições de função para a LLM:

* **`updateBuilderState(key: string, value: any)`**  
  * *Descrição:* Atualiza qualquer campo do Formulário ou Variável de Estado.  
  * *Exemplos de Uso:* Definir data do evento, mudar cor dos botões, alterar texto do manual.  
* **`triggerImageGeneration(prompt: string, model: string, target_window: string)`**  
  * *Descrição:* Dispara as APIs de imagem (Seedream/Flux).  
  * *Parâmetros:* `prompt` (inglês técnico), `model` (v4/v4.5), `target_window` ('capa', 'folha', 'manual').  
* **`triggerVideoGeneration(source_image: url, prompt: string, type: string)`**  
  * *Descrição:* Dispara as APIs de vídeo (Hailuo/Kling).  
  * *Parâmetros:* `type` ('loop', 'abertura').  
* **`switchWindow(window_id: string)`**  
  * *Descrição:* Força a interface gráfica a mudar para a janela especificada.  
  * *Uso:* Quando o usuário diz "Quero editar a música", o bot chama `switchWindow('musica')`.  
* **`analyzeAndMigrateData(raw_data: json | text)`**  
  * *Descrição:* Função especial para importação de versões legadas (detalhada abaixo).

#### **3\. Lógica de Importação Inteligente e Migração de Versão**

Esta é a função crítica solicitada. O AutoBuilder v4 deve ser capaz de ler arquivos de versões anteriores (v2, v3) ou estruturas de dados malformadas e adaptá-las para o esquema atual (`schema_v4`).

**Função: `smartImportHandler(fileContent)`**

Esta lógica deve ser executada sempre que um arquivo `.zip` ou `.json` é carregado.

1. **Detecção de Versão (Schema Check):**  
   * O sistema verifica se o JSON importado possui a chave `"version": "4.0"` e se as chaves obrigatórias (ex: `menuConfig`, `palette`) correspondem à estrutura atual.  
   * **SE Compatível:** Executa a hidratação direta (Flow Padrão).  
   * **SE Incompatível ou Ausente:** Dispara o gatilho de **Migração via LLM**.  
2. **Protocolo de Migração via LLM (LLM-Based Migration):**  
   * O sistema envia o conteúdo do arquivo antigo (JSON ou até trechos de HTML) para o Chatbot com um prompt de sistema temporário e específico:  
     "Analise este objeto de dados legado. Mapeie os valores antigos para a nova estrutura do AutoBuilder v4.  
     * Exemplo: Converta `cor_fundo_botao` (v3) para `buttonColor` (v4).  
     * Exemplo: Se houver `lista_presentes_url`, mova para o campo `link_presentes`.  
     * Exemplo: Se faltar a configuração de 'Sombra', defina o padrão `#000000`. Retorne APENAS o JSON válido na estrutura v4."  
   * **Ação:** O Chatbot processa os dados e retorna o JSON higienizado.  
   * **Feedback:** O Chat informa ao usuário: *"Detectei um convite de uma versão antiga. Converti seus dados para o novo formato com sucesso. Por favor, revise as cores e posições."*

#### **4\. Fluxos de Diálogo e Intenções (NLP Hooks)**

O Chatbot deve "escutar" intenções específicas para acionar comportamentos complexos:

* **Intenção: "Revisão Estética"**  
  * *Usuário:* "O que você acha dessa combinação de cores?"  
  * *Ação:* O Chatbot lê os valores atuais de `paleta` e `tema`, analisa a harmonia baseada em teoria das cores e sugere ajustes chamando `updateBuilderState` caso o usuário aceite.  
* **Intenção: "Ajuda Criativa"**  
  * *Usuário:* "Não sei o que escrever no convite."  
  * *Ação:* O Chatbot gera 3 opções de frases baseadas no `tipo_evento` e pede para o usuário escolher uma (A, B ou C) para injetar automaticamente no formulário.  
* **Intenção: "Debug/Correção"**  
  * *Usuário:* "O botão não está aparecendo."  
  * *Ação:* O Chatbot verifica as variáveis de estado (ex: se o link está vazio) e explica o motivo técnico em linguagem simples: *"O botão de presentes está oculto porque você ainda não definiu um link ou uma imagem para ele. Quer configurar agora?"*

---

### **Considerações para a Implementação na IDE**

1. **Latência da Migração:** A leitura de arquivos via LLM para migração pode levar alguns segundos. É vital exibir um estado de "Processando/Convertendo..." na UI enquanto o Chatbot reescreve o JSON.  
2. **Segurança (Sandbox):** O Chatbot nunca deve executar código arbitrário vindo da importação. A migração deve ser estritamente *Data-to-Data* (JSON velho \-\> JSON novo), nunca *Code-Execution*.

 {Fim de Chatbot Inteligente}

**{Prompts Base}**

**(Repositório de Engenharia de Prompt e Templates Dinâmicos)**

Este componente centraliza a lógica de construção de strings para as APIs Generativas (Seedream v4/v4.5 e Hailuo 02). O **Chatbot Inteligente** deve consultar este componente, injetar as variáveis do estado (`builderState`) e enviar o *payload* resultante.

#### **1\. Definição de Variáveis Globais (Injection Keys)**

Para todos os templates abaixo, o sistema deve substituir os tokens entre colchetes ou chaves pelos valores reais do projeto:

* `{{THEME}}`: Tema do evento (ex: "Tropical", "Minimalist Black").  
* `{{COLORS}}`: Paleta de cores (ex: "Gold and White", "Pastel Pink").  
* `{{INITIALS_AGE}}`: Iniciais (Casamento) ou Idade (Aniversário).  
* `{{EVENT_DATA}}`: Concatenação de Nome, Data, Hora e Local.  
* `{{LIST_CONTENT}}`: Lista de presentes ou regras do manual.

---

#### **2\. Templates de Geração de Imagem (Seedream v4/v4.5)**

**A. Template Mestre da Capa (Capa)**

* **Target:** **Janela da Capa**.  
* **API:** Seedream v4 (Text-to-Image).  
* **Objetivo:** Criar o envelope fechado que será a "primeira dobra" da experiência.  
* **Prompt Template:**  
  "Create a vertical image of a hyper-realistic 3D render of a premium invitation envelope infused with a **{{THEME}}** theme, featuring a palette of **{{COLORS}}**. The envelope is sealed with an intricately detailed wax seal in matching colors with the number/initials '**{{INITIALS\_AGE}}**'. The paper boasts a high-quality, textured finish, exuding elegance and sophistication. Background: A lush **{{THEME}}** setting, with highly detailed elements that enhance the luxurious feel of the invitation. The composition is centered, with dramatic lighting casting volumetric light and creating a soft focus and depth of field. Lighting: Dramatic, cinematic lighting with volumetric effects, simulating god rays filtering through **{{THEME}}** motifs. Highlights on the envelope and wax seal accentuate the texture and detail. Style: Photorealistic, hyper-detailed, cinematic, elegant, and romantic. Technical Details: Resolution: 8K, ultra high resolution. Aspect Ratio: 9:16. Rendering Engine: Octane Render, Unreal Engine 5\. Camera: Macro lens, f/2.8, shallow depth of field."

**B. Template Mestre da Folha Vazia (Folha)**

* **Target:** **Janela da Folha Vazia**.  
* **API:** Seedream v4 (Text-to-Image).  
* **Lógica de Derivação:** Mantém a estética da capa (Fundo, Luz, Render), mas remove o objeto "Envelope" e insere "Folha Vazia".  
* **Regra de Layout:** A folha deve ocupar **90% da área útil** para maximizar o espaço de escrita na etapa posterior.  
* **Prompt Template:**  
  "Create a vertical image of a hyper-realistic 3D render of a premium blank sheet adorned with a **{{THEME}}** theme, featuring a palette of **{{COLORS}}**. The sheet boasts a high-quality, textured finish, exuding elegance and sophistication, with intricate elegant adornments related to the theme. Background: A lush **{{THEME}}** setting, with highly detailed elements that enhance the luxurious feel of the composition. **The sheet occupies 90% of the image**, centered, with dramatic lighting casting volumetric light and creating a soft focus and depth of field. Lighting: Dramatic, cinematic lighting with volumetric effects, simulating god rays filtering through **{{THEME}}** motifs. Highlights on the sheet accentuate the texture and detail. Style: Photorealistic, hyper-detailed, cinematic, elegant, and romantic. Technical Details: Resolution: 8K, ultra high resolution. Aspect Ratio: 9:16. Rendering Engine: Octane Render, Unreal Engine 5\. Camera: Macro lens, f/2.8, shallow depth of field."

**C. Template de Preenchimento da Folha (Escrita)**

* **Target:** **Janela de Preenchimento da Folha**.  
* **API:** Seedream v4.5 (Edit / Inpainting).  
* **Input Image:** `leaf_only.png` (Resultado do tratamento na Etapa 1).  
* **Lógica:** A IA deve "escrever" os dados como se fosse uma impressão ou caligrafia digital sobre a textura.  
* **Prompt Template:**  
  "**Context:** You are a professional calligrapher and invitation designer. **Task:** Fill this blank sheet with the following event details creatively and elegantly. **Data to Write:** **{{EVENT\_DATA}}**. **Style Instructions:** Theme **{{THEME}}** (Palette: **{{COLORS}}**). Use elegant design elements, dividers, lines, and introductory phrases like 'You are invited to...' based on your creativity. Apply texture and adornments to the text. Use a cursive, sophisticated font style (resembling 'Great Vibes' or 'Pinyon Script'). Ensure high contrast for readability."

---

#### **3\. Templates de Geração de Vídeo (Hailuo 02\)**

**D. Template de Animação da Capa (Abertura)**

* **Target:** **Janela da Animação da Capa**.  
* **API:** Hailuo 02 (Image-to-Video).  
* **Input Image:** `capa.jpg`.  
* **Regra Crítica de Transição:** O vídeo **DEVE** terminar em uma tela branca ou brilho intenso ("White Out"). Isso é essencial para que o script do `final_template.html` faça a transição invisível para o loop (`z-index` swap).  
* **Prompt Template:**  
  "The animation begins with a focus on the closed envelope. As the wax seal gracefully detaches and falls, the envelope's flap uplifts slowly. From its interior, a spectacular eruption of glittering sparkles and smoke, shimmering dust, and glowing light trails emerges, cascading outward in a mesmerizing display. These vibrant particles swirl dynamically, increasing in density and brightness around the envelope. The radiant light and swirling glitter intensify, rapidly expanding to fill the entire scene. **CRITICAL:** The overwhelming brilliance transitions the frame to a solid, blinding white screen in the very final frame, achieved through a dramatic zoom-in effect."

**E. Template de Animação do Background (Loop)**

* **Target:** **Janela da Animação do Background**.  
* **API:** kling-video/o1/image-to-video.  
* **Input Image:** `background_only.jpg` (Fundo tratado na Etapa 1).  
* **Regra de UX:** A câmera deve ser **ESTÁTICA**. Movimentos bruscos de câmera tornam o texto ilegível e causam náusea no usuário. Apenas as partículas/luzes devem se mover.  
* **Prompt Template:**  
  "The animation displays smooth, looping movements of the shimmering effect based on the provided image. Dramatic sparkles and shining smokes flying in the background, cinematic lighting with volumetric effects (divine rays) filters through shimmering particles, creating a magical atmosphere with highlights. Rendered in a photorealistic and hyper-detailed style, the animation flows perfectly with a cinematic approach, captivating the viewer's attention with its fluid movement and mesmerizing 4K quality. **IMPORTANT: Static Camera / No Camera Movement**, only environmental motion."

---

#### **4\. Templates de Módulos Especiais (Listas)**

Estes templates utilizam a API de Edição para fundir texto estruturado com arte visual. O Chatbot deve formatar a lista (`\n`) antes de injetar.

**F. Template de Sugestão de Presentes**

* **Target:** **Janela de Sugestão de Presentes** (Modo Popup de Imagem).  
* **API:** Seedream v4.5 (Edit).  
* **Input Image:** `background_only.jpg` ou `folha_base.png`.  
* **Prompt Template:**  
  "Create a central parchment sheet containing the Gift List listed below. Use your creativity to insert photorealistic 3D elements related to the **{{THEME}}** theme (e.g., if Disney theme, insert the character elegantly; if Floral, insert flowers) interacting with the paper. **Gift List:** **{{LIST\_CONTENT}}** **Visual Style:** Mature and realistic composition. Highly detailed 3D render, centered composition, dramatic lighting, volumetric light. Highlights on the textured paper to emphasize texture and detail. Style: Photorealistic, cinematic, elegant. Resolution: 8K. Aspect Ratio: 9:16."

**G. Template do Manual do Convidado**

* **Target:** **Janela do Manual do Convidado** (Modo Imagem).  
* **API:** Seedream v4.5 (Edit).  
* **Input Image:** `background_only.jpg` ou `folha_base.png`.  
* **Lógica:** Similar ao de Presentes, mas focado em ícones informativos e texto de regras.  
* **Prompt Template:**  
  "Create a central parchment or elegant card containing the Guest Guide/Rules listed below. Use your creativity to insert photorealistic 3D elements related to the **{{THEME}}** theme around the text. **Guest Guide Rules:** **{{LIST\_CONTENT}}** **Visual Style:** Clean layout for readability. Highly detailed 3D render, centered composition. Lighting: Soft cinematic lighting, clear focus on the text area. Style: Photorealistic, elegant, formal yet inviting. Resolution: 8K. Aspect Ratio: 9:16."

---

### **Notas Técnicas para a IDE (Implementação)**

1. **Validação de Variáveis:** O Chatbot deve verificar se `{{THEME}}` e `{{COLORS}}` não são nulos antes de montar o prompt. Se forem, deve usar valores de fallback (ex: "Elegant generic theme", "Gold").  
2. **Consistência de Seed:** Para manter a identidade visual entre a **Capa** e a **Folha**, o sistema deve tentar (se a API permitir) reutilizar a mesma `seed` ou enviar a Capa como `image_reference` com peso baixo (low denoise) na geração da Folha.

{Fim do Prompts Base}
