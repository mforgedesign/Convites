window.config = {
  "evento": {
    "tipo": "Aniversário",
    "nome": "Amanda Ketlhyn",
    "idade": 15,
    "data": "2026-08-22",
    "hora": "18:30",
    "horaTermino": "",
    "endereco": "Rua Pedro Pessoa 4401 A",
    "frase1": "",
    "frase2": "",
    "frase3": ""
  },
  "convite": {
    "paletaCores": "Lilás, Preto e Prata",
    "tema": "Noite estrelada",
    "musica": "assets/music_1785595082636.mp3",
    "tipoAbertura": "curta",
    "particulasAbertura": false,
    "slug": "ConviteNoiteEstreladaDaAmandaKetlhyn",
    "seo": {
      "pageTitle": "Amanda Ketlhyn | Aniversário 15 Anos",
      "ogTitle": "Amanda Ketlhyn | Aniversário 15 Anos",
      "ogDescription": "Clique para ver o convite interativo!"
    },
    "publicationOrigin": {
      "repository": "mforgedesign/Convites",
      "cname": "convites.mforge.com.br",
      "url": "https://convites.mforge.com.br/ConviteNoiteEstreladaDaAmandaKetlhyn",
      "importedAt": "2026-08-01T13:50:00.000Z"
    }
  },
  "assets": {
    "capa": "assets/cover_1785595082636.jpg",
    "cartao": "",
    "aberturaSlides": [
      "assets/slide1_1785595082636.mp4"
    ],
    "aberturaSlidesMeta": [
      {
        "filePath": "assets/slide1_1785595082636.mp4",
        "label": "Slide 1",
        "type": "video"
      }
    ],
    "folhaVazia": "",
    "folhaPreenchida": "assets/folha_1785595082636.mp4",
    "musica": "assets/music_1785595082636.mp3",
    "musicStartSec": 0,
    "musicEndSec": null,
    "fabric": {
      "saveTheDate": {
        "referencia": "",
        "resultado": "",
        "musicaPersonalizada": "",
        "musicSource": "convite",
        "hasMusic": true,
        "musicStartSec": 0,
        "durationSec": 20
      },
      "lembrete": {
        "referencia": "",
        "resultado": "",
        "musicaPersonalizada": "",
        "musicSource": "convite",
        "hasMusic": true,
        "musicStartSec": 0,
        "durationSec": 20
      }
    },
    "fotos": [],
    "popupImagensPorBotao": {}
  },
  "botoes": [
    {
      "id": "btn_legacy_location",
      "tipoAcao": "Link",
      "tipoVisual": "css",
      "titulo": "Localização",
      "icone": "fa-solid fa-location-dot",
      "conteudo": "https://www.google.com/maps/search/?api=1&query=Rua+Pedro+Pessoa+4401+A"
    },
    {
      "id": "btn_legacy_manual",
      "tipoAcao": "PopupHtml",
      "tipoVisual": "css",
      "titulo": "Manual",
      "icone": "fa-solid fa-book-open",
      "conteudo": "<style>\n  .ak-manual {\n    --ak-preto: #0b0910;\n    --ak-lilas: #9b79c8;\n    --ak-lilas-escuro: #5f427f;\n    --ak-prata: #c9cad1;\n    --ak-prata-claro: #ececf0;\n    position: relative;\n    overflow: hidden;\n    padding: 26px 16px;\n    border: 1px solid rgba(201, 202, 209, 0.45);\n    border-radius: 24px;\n    background:\n      radial-gradient(circle at 12% 4%, rgba(155, 121, 200, 0.42), transparent 34%),\n      radial-gradient(circle at 96% 92%, rgba(95, 66, 127, 0.42), transparent 38%),\n      linear-gradient(145deg, var(--ak-preto), #17111f 58%, var(--ak-preto));\n    color: var(--ak-prata-claro);\n    box-shadow: 0 18px 42px rgba(11, 9, 16, 0.34);\n    font-family: Georgia, \"Times New Roman\", serif;\n  }\n\n  .ak-manual,\n  .ak-manual * {\n    box-sizing: border-box;\n  }\n\n  .ak-manual::before,\n  .ak-manual::after {\n    position: absolute;\n    color: rgba(201, 202, 209, 0.56);\n    font-size: 18px;\n    line-height: 1;\n    content: \"✦\";\n    pointer-events: none;\n  }\n\n  .ak-manual::before {\n    top: 15px;\n    right: 18px;\n  }\n\n  .ak-manual::after {\n    bottom: 15px;\n    left: 18px;\n    font-size: 11px;\n  }\n\n  .ak-manual__heading {\n    position: relative;\n    z-index: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 10px;\n    margin: 0 0 20px;\n    color: var(--ak-prata-claro);\n    font-size: clamp(20px, 5vw, 28px);\n    font-weight: 600;\n    letter-spacing: 0.06em;\n    text-align: center;\n  }\n\n  .ak-manual__heading i {\n    color: var(--ak-lilas);\n    font-size: 0.82em;\n  }\n\n  .ak-manual__list {\n    position: relative;\n    z-index: 1;\n    display: grid;\n    gap: 12px;\n  }\n\n  .ak-manual__item {\n    margin: 0;\n    padding: 16px;\n    border: 1px solid rgba(201, 202, 209, 0.28);\n    border-left: 4px solid var(--ak-lilas);\n    border-radius: 17px;\n    background: linear-gradient(135deg, rgba(11, 9, 16, 0.88), rgba(95, 66, 127, 0.28));\n    color: var(--ak-prata);\n    font-size: 15.5px;\n    line-height: 1.62;\n    box-shadow: 0 8px 22px rgba(11, 9, 16, 0.24);\n  }\n\n  .ak-manual__item > i {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 36px;\n    height: 36px;\n    margin: 0 9px 6px 0;\n    border: 1px solid rgba(201, 202, 209, 0.45);\n    border-radius: 50%;\n    background: linear-gradient(145deg, var(--ak-lilas), var(--ak-lilas-escuro));\n    color: var(--ak-prata-claro);\n    vertical-align: middle;\n  }\n\n  .ak-manual__item strong {\n    color: var(--ak-prata-claro);\n    font-weight: 700;\n  }\n\n  @media (max-width: 420px) {\n    .ak-manual {\n      padding: 22px 12px;\n      border-radius: 20px;\n    }\n\n    .ak-manual__item {\n      padding: 14px;\n      font-size: 15px;\n    }\n  }\n</style>\n\n<section class=\"ak-manual\" aria-label=\"Manual do Convidado\">\n  <h2 class=\"ak-manual__heading\"><i class=\"fa-solid fa-book-open\" aria-hidden=\"true\"></i> Manual do Convidado</h2>\n  <div class=\"ak-manual__list\">\n    <p class=\"ak-manual__item\"><i class=\"fa-solid fa-clock\" aria-hidden=\"true\"></i> <strong>A pontualidade é o primeiro brinde à nossa alegria.</strong> Sua presença desde o início é essencial para que possamos compartilhar cada detalhe emocionante desta celebração.</p>\n    <p class=\"ak-manual__item\"><i class=\"fa-solid fa-calendar-check\" aria-hidden=\"true\"></i> <strong>Sua confirmação é fundamental.</strong> Para que possamos preparar tudo com o carinho que você merece, pedimos a gentileza de confirmar sua presença até 15 dias antes do grande dia.</p>\n    <p class=\"ak-manual__item\"><i class=\"fa-solid fa-camera-retro\" aria-hidden=\"true\"></i> <strong>Prepare o sorriso para memórias inesquecíveis!</strong> Queremos eternizar cada instante ao seu lado com nossa plataforma 360, espelho mágico e um filtro exclusivo personalizado para o evento.</p>\n    <p class=\"ak-manual__item\"><i class=\"fa-solid fa-heart\" aria-hidden=\"true\"></i> <strong>Celebre com toda a intensidade!</strong> Estamos ansiosos para viver este momento especial e criar lembranças que guardaremos para sempre em nossos corações.</p>\n  </div>\n</section>"
    },
    {
      "id": "btn_legacy_rsvp",
      "tipoAcao": "RSVP",
      "tipoVisual": "css",
      "titulo": "Confirmar Presença",
      "icone": "fa-brands fa-whatsapp",
      "whatsapp": "5588999776538",
      "rsvpConfig": {
        "exibirNome": true,
        "exibirWhatsapp": true,
        "exibirAcompanhantes": false
      }
    },
    {
      "id": "btn_legacy_gifts",
      "tipoAcao": "PopupImagem",
      "tipoVisual": "css",
      "titulo": "Presentes",
      "icone": "fa-solid fa-gift",
      "conteudo": "assets/convitenoiteestreladadaamandaketlhyn_presentes_sem_prata_1785595082636.png"
    }
  ],
  "upsell": {
    "galeriaFotos": false,
    "saveTheDate": false,
    "lembrete": false
  },
  "config": {
    "exibirMarcaDagua": false,
    "cronometro": false,
    "buttonColor": "#000000",
    "buttonGradientColor": "#ec4899",
    "buttonGradientEnabled": false,
    "buttonSize": 1,
    "isButtonFilled": true,
    "shadowStyle": "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
    "brilhos": {
      "esquerdo": false,
      "direito": false,
      "centro": false
    }
  },
  "briefing": {
    "text": "Importação fiel do convite histórico ConviteNoiteEstreladaDaAmandaKetlhyn. Preservar tema, paleta, data, hora, música, abertura, fundo, Manual, RSVP e estrutura dos botões. Alterar somente o endereço para Rua Pedro Pessoa 4401 A e a arte de Presentes para remover Prata, deixando Acessórios.",
    "usedAt": "2026-08-01T13:50:00.000Z",
    "source": "legacy-import",
    "completionMode": "focused",
    "buttonDecisions": {
      "manualComConteudo": true,
      "presentesComConteudo": true,
      "manualPremium": false,
      "presentesPremium": true,
      "manualResumo": "Manual original preservado.",
      "presentesResumo": "Arte original recriada sem Prata, deixando Acessórios."
    }
  }
};
