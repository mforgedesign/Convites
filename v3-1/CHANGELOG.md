# Changelog - Web Version

## [2025-12-25 15:58] - Correção Importação GitHub
### Arquivos Modificados:
* `static/js/app.js`:
    * Lines 155-385: Reescrita completa da função `importFromGitHubUrl`
    * Rationale: Adicionar mapeamento completo de campos do form_data.json e importação de presentes
    
### Problema Reportado:
- Troca de abas/janelas parou de funcionar após importação

### Possível Causa:
- A limpeza de inputs (linhas 196-200) pode estar afetando elementos do sistema de tabs
- O `dispatchEvent(new Event('input'))` no `setInputValue` pode estar causando conflitos

### Para Reverter:
1. Remover as linhas 195-200 (limpeza agressiva de inputs)
2. Ou usar backup: `app_bkp_2025_12_22_persistence_fix.js`

---

## [2025-12-25 15:43] - Edge Function v6
### Arquivos Modificados (Supabase):
* Edge Function `import-from-github`:
    * Corrigido nome do arquivo para `form_data.json` (com underscore)
    * Rationale: Arquivo salvo pelo builder usa underscore, não era encontrado com `formdata.json`

---

## [2025-12-25 15:36] - Melhoria Importação GitHub
### Arquivos Modificados (Supabase):
* Edge Function `import-from-github` versões 3-5:
    * Adicionado JSON.parse do menuConfig (é array de botões)
    * Extração de manualText do menuConfig
    * Busca de form_data.json
    * Rationale: O menuConfig nos convites é um array JSON, não objeto com propriedades

---

## [2025-12-25 14:50] - Correção Sidebar Mobile
### Arquivos Modificados:
* `static/css/style.css`:
    * Lines 713-725: Alterado `top: 0` para `top: 70px` na sidebar mobile
    * Rationale: Sidebar estava sendo coberta pelo header fixo

---

## [2025-12-25 14:32] - Correção Header Mobile
### Arquivos Modificados:
* `static/css/style.css`:
    * Lines 663-712: Corrigido CSS do header mobile
    * Rationale: Botões não mostravam nomes, header expandia demais
