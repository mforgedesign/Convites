# Guia de Uso do Token GitHub para Deploy de Convites

## Visão Geral

O AutoBuilder 3.1 utiliza a **API REST do GitHub** para fazer deploy de convites interativos diretamente no repositório `convites`, que é servido pelo GitHub Pages em `convites.mforge.com.br`.

---

## Configuração do Token

### 1. Criação do Token (Personal Access Token)

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Configure:
   - **Note**: `AutoBuilder Deploy`
   - **Expiration**: Escolha conforme necessário (90 dias, 1 ano, ou sem expiração)
   - **Scopes**: Marque apenas `repo` (Full control of private repositories)
4. Clique em **Generate token**
5. **COPIE O TOKEN IMEDIATAMENTE** (ele não será exibido novamente)

### 2. Formato do Token

- Tokens clássicos começam com `ghp_`
- Exemplo: `YOUR_GITHUB_TOKEN`

---

## Estrutura do Repositório

```
github.com/mforgedesign/convites/
├── home/                    # Página principal do site
│   ├── index.html
│   └── assets/
├── myla&arlan/              # Convite exemplo
│   ├── index.html
│   ├── capa/
│   ├── abertura/
│   ├── loop/
│   └── musica/
├── outro-convite/
│   └── ...
└── README.md
```

**URLs resultantes:**
- `https://convites.mforge.com.br/home` → Página principal
- `https://convites.mforge.com.br/myla&arlan` → Convite específico

---

## API Endpoints Utilizados

### 1. Verificar Existência de Slug
```
GET https://api.github.com/repos/{owner}/{repo}/contents/{slug}
Authorization: token {token}
```

### 2. Upload de Arquivo (Create/Update)
```
PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}
Authorization: token {token}
Content-Type: application/json

{
  "message": "Deploy {path}",
  "content": "{base64_encoded_content}",
  "branch": "main",
  "sha": "{sha_if_updating}"  // Opcional, necessário para atualizar arquivo existente
}
```

---

## Credenciais Salvas

As credenciais são salvas em `project_data.json` na raiz do projeto:

```json
{
  "github_user": "mforgedesign",
  "github_token": "ghp_...",
  "github_slug": "nome-do-convite"
}
```

⚠️ **Importante**: Este arquivo contém dados sensíveis. Não compartilhe ou commite em repositórios públicos.

---

## Usando com Outras IDEs

Para fazer deploy da página principal (`home`) ou outros conteúdos usando outra IDE/ferramenta:

### Exemplo em Python
```python
import requests
import base64

token = "ghp_..."
owner = "mforgedesign"
repo = "convites"

def upload_file(local_path, remote_path):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{remote_path}"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # Ler e encodar arquivo
    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    
    # Verificar SHA (para update)
    r = requests.get(url, headers=headers)
    sha = r.json().get("sha") if r.status_code == 200 else None
    
    # Upload
    data = {
        "message": f"Update {remote_path}",
        "content": content,
        "branch": "main"
    }
    if sha:
        data["sha"] = sha
    
    r = requests.put(url, headers=headers, json=data)
    return r.status_code in [200, 201]
```

### Exemplo de Uso
```python
# Deploy da página home
upload_file("index.html", "home/index.html")
upload_file("styles.css", "home/styles.css")
```

---

## Limites da API

- **Rate Limit**: 5.000 requests/hora (autenticado)
- **Tamanho máximo por arquivo**: 100 MB
- **Tamanho recomendado**: < 25 MB (para evitar timeouts)

---

## Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Bad credentials | Token inválido/expirado | Gere um novo token |
| 404 Not Found | Repositório/path não existe | Verifique owner/repo/path |
| 422 Unprocessable | SHA incorreto para update | Busque SHA atual antes de update |

---

## Referências

- [GitHub REST API - Contents](https://docs.github.com/en/rest/repos/contents)
- [Creating a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
