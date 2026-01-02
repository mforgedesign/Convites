# Guia Completo de Uso das APIs Fal.ai

Este documento contém instruções detalhadas e exemplos práticos de como usar as APIs da Fal.ai para geração de imagens e vídeos.

## Índice

- [Autenticação](#autenticação)
- [1. Seedream V4 - Text-to-Image](#1-seedream-v4---text-to-image)
- [2. Veo3.1 - First-Last-Frame-to-Video](#2-veo31---first-last-frame-to-video)
- [3. SORA 2 - Image-to-Video](#3-sora-2---image-to-video)
- [Exemplos Completos](#exemplos-completos)
- [Troubleshooting](#troubleshooting)

---

## Autenticação

**Todas as APIs da Fal.ai requerem autenticação via API Key.**

### Headers Necessários

```powershell
$headers = @{
    "Authorization" = "Key YOUR_FAL_API_KEY_HERE"
    "Content-Type" = "application/json"
}
```

### Como Obter Sua API Key

1. Acesse [fal.ai](https://fal.ai)
2. Faça login ou crie uma conta
3. Navegue até as configurações da conta
4. Gere uma nova API Key

---

## 1. Seedream V4 - Text-to-Image

**Endpoint:** `https://fal.run/fal-ai/bytedance/seedream/v4/text-to-image`  
**Método:** `POST`  
**Documentação Oficial:** [https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image/api](https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image/api)

### Descrição

Gera imagens de alta qualidade a partir de prompts de texto usando o modelo Seedream V4 da ByteDance.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `prompt` | string | Sim | Descrição textual da imagem desejada |
| `image_size` | object ou enum | Não | Tamanho da imagem (objeto com `width` e `height`, ou enum predefinida) |
| `num_images` | integer | Não | Número de imagens a gerar (padrão: 1) |
| `seed` | integer | Não | Semente aleatória para reprodutibilidade |
| `enable_safety_checker` | boolean | Não | Ativa verificação de segurança (padrão: true) |

### Exemplo de Requisição (PowerShell)

```powershell
$headers = @{
    "Authorization" = "Key 73618b95-f8c7-430d-9817-fce2b036691f:9f9d1d697581e82f3566eb5360697671"
    "Content-Type" = "application/json"
}

$body = @{
    prompt = "A beautiful sunset over mountains with vibrant colors"
    image_size = @{
        width = 720
        height = 1280
    }
    num_images = 1
} | ConvertTo-Json -Depth 10

$response = Invoke-WebRequest `
    -Uri "https://fal.run/fal-ai/bytedance/seedream/v4/text-to-image" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

$result = $response.Content | ConvertFrom-Json
$imageUrl = $result.images[0].url

# Download da imagem
Invoke-WebRequest -Uri $imageUrl -OutFile "generated_image.png"
```

### Exemplo de Resposta

```json
{
  "images": [
    {
      "url": "https://v3b.fal.media/files/b/penguin/xyz123_generated.png",
      "width": 720,
      "height": 1280
    }
  ],
  "seed": 746406749
}
```

### Tamanhos de Imagem Disponíveis

- **Custom**: `{ "width": 720, "height": 1280 }` (valores entre 1024 e 4096)
- **Enums predefinidas**: `square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`, `auto`, `auto_2K`, `auto_4K`

---

## 2. Veo3.1 - First-Last-Frame-to-Video

**Endpoint:** `https://fal.run/fal-ai/veo3.1/fast/first-last-frame-to-video`  
**Método:** `POST`  
**Documentação Oficial:** [https://fal.ai/models/fal-ai/veo3.1/fast/first-last-frame-to-video](https://fal.ai/models/fal-ai/veo3.1/fast/first-last-frame-to-video)

### Descrição

Gera vídeos usando o modelo Veo 3.1 do Google, criando uma interpolação suave entre um frame inicial e um frame final.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `first_frame_url` | string | Sim | URL ou data URI do primeiro frame |
| `last_frame_url` | string | Sim | URL ou data URI do último frame |
| `prompt` | string | Sim | Descrição da animação desejada |
| `duration` | enum | Não | Duração do vídeo: `"4s"`, `"6s"`, `"8s"` (padrão: `"8s"`) |
| `aspect_ratio` | enum | Não | Proporção: `"auto"`, `"9:16"`, `"16:9"`, `"1:1"` (padrão: `"auto"`) |
| `resolution` | enum | Não | Resolução: `"720p"`, `"1080p"` (padrão: `"720p"`) |
| `generate_audio` | boolean | Não | Gerar áudio (padrão: true, custa 33% mais se true) |

### Exemplo de Requisição (PowerShell)

```powershell
# Ler e codificar imagens em base64
$firstFrameBytes = [System.IO.File]::ReadAllBytes("C:\path\to\first_frame.png")
$firstFrameB64 = [Convert]::ToBase64String($firstFrameBytes)

$lastFrameBytes = [System.IO.File]::ReadAllBytes("C:\path\to\last_frame.jpg")
$lastFrameB64 = [Convert]::ToBase64String($lastFrameBytes)

$body = @{
    prompt = "The envelope gently opens with a soft glow and sparkles, transitioning to white"
    first_frame_url = "data:image/png;base64,$firstFrameB64"
    last_frame_url = "data:image/jpeg;base64,$lastFrameB64"
    duration = "4s"
    aspect_ratio = "9:16"
    generate_audio = $false
} | ConvertTo-Json -Depth 10

$response = Invoke-WebRequest `
    -Uri "https://fal.run/fal-ai/veo3.1/fast/first-last-frame-to-video" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

$result = $response.Content | ConvertFrom-Json
$videoUrl = $result.video.url

# Download do vídeo
Invoke-WebRequest -Uri $videoUrl -OutFile "generated_video.mp4"
```

### Exemplo de Resposta

```json
{
  "video": {
    "url": "https://v3b.fal.media/files/b/lion/xyz_output.mp4",
    "content_type": "video/mp4",
    "file_size": 1315526
  }
}
```

### ⚠️ Notas Importantes

1. **Content Policy**: O prompt não deve conter conteúdo ofensivo ou violações de política. Prompts muito descritivos ou com termos ambíguos podem ser bloqueados.
2. **Custo**: Vídeos com áudio custam 33% a mais. Para economia, use `generate_audio: false`.
3. **Data URIs**: Você pode usar data URIs (base64) ou URLs públicas para os frames.

---

## 3. SORA 2 - Image-to-Video

**Endpoint:** `https://fal.run/fal-ai/sora-2/image-to-video`  
**Método:** `POST`  
**Documentação Oficial:** [https://fal.ai/models/fal-ai/sora-2/image-to-video](https://fal.ai/models/fal-ai/sora-2/image-to-video)

### Descrição

Gera vídeos a partir de uma única imagem usando o modelo SORA 2 da OpenAI, criando animações baseadas no prompt fornecido.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `image_url` | string | Sim | URL ou data URI da imagem de entrada |
| `prompt` | string | Sim | Descrição da animação desejada |
| `duration` | integer | Não | Duração em segundos: `4`, `8`, ou `12` (padrão: 8) |
| `aspect_ratio` | enum | Não | Proporção: `"9:16"`, `"16:9"`, `"1:1"` |

### Exemplo de Requisição (PowerShell)

```powershell
# Ler e codificar imagem em base64
$imageBytes = [System.IO.File]::ReadAllBytes("C:\path\to\input_image.png")
$imageB64 = [Convert]::ToBase64String($imageBytes)

$body = @{
    prompt = "The envelope gently opens with a soft glow and sparkles, transitioning to white"
    image_url = "data:image/png;base64,$imageB64"
    duration = 4
    aspect_ratio = "9:16"
} | ConvertTo-Json -Depth 10

$response = Invoke-WebRequest `
    -Uri "https://fal.run/fal-ai/sora-2/image-to-video" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

$result = $response.Content | ConvertFrom-Json
$videoUrl = $result.video.url

# Download do vídeo
Invoke-WebRequest -Uri $videoUrl -OutFile "sora_video.mp4"
```

### Exemplo de Resposta

```json
{
  "video": {
    "url": "https://v3b.fal.media/files/b/elephant/xyz_generated.mp4",
    "content_type": "video/mp4",
    "file_size": 1230641
  }
}
```

### ⚠️ Notas Importantes

1. **Duração**: Apenas os valores `4`, `8` ou `12` são aceitos. Outros valores resultarão em erro 422.
2. **Aspect Ratio**: Se não especificado, a API tentará detectar automaticamente a proporção da imagem.
3. **Content Policy**: Similar ao Veo3.1, prompts devem evitar conteúdo que viole políticas de uso.

---

## Exemplos Completos

### Workflow Completo: Imagem → Vídeo

Este exemplo mostra como gerar uma imagem com Seedream V4 e depois animá-la com SORA 2:

```powershell
# Configuração
$FAL_API_KEY = "SEU_API_KEY_AQUI"
$headers = @{
    "Authorization" = "Key $FAL_API_KEY"
    "Content-Type" = "application/json"
}

# PASSO 1: Gerar imagem com Seedream V4
Write-Host "Gerando imagem..."
$imageBody = @{
    prompt = "A magical invitation envelope with elegant design, 9:16 vertical format"
    image_size = @{ width = 720; height = 1280 }
    num_images = 1
} | ConvertTo-Json -Depth 10

$imageResponse = Invoke-WebRequest `
    -Uri "https://fal.run/fal-ai/bytedance/seedream/v4/text-to-image" `
    -Method POST `
    -Headers $headers `
    -Body $imageBody `
    -ContentType "application/json"

$imageResult = $imageResponse.Content | ConvertFrom-Json
$imageUrl = $imageResult.images[0].url

# Download da imagem
Invoke-WebRequest -Uri $imageUrl -OutFile "generated_image.png"
Write-Host "Imagem gerada: generated_image.png"

# PASSO 2: Animar com SORA 2
Write-Host "Gerando vídeo com SORA 2..."
$imageBytes = [System.IO.File]::ReadAllBytes("generated_image.png")
$imageB64 = [Convert]::ToBase64String($imageBytes)

$videoBody = @{
    prompt = "The envelope gently opens with sparkles and a soft glow"
    image_url = "data:image/png;base64,$imageB64"
    duration = 4
    aspect_ratio = "9:16"
} | ConvertTo-Json -Depth 10

$videoResponse = Invoke-WebRequest `
    -Uri "https://fal.run/fal-ai/sora-2/image-to-video" `
    -Method POST `
    -Headers $headers `
    -Body $videoBody `
    -ContentType "application/json"

$videoResult = $videoResponse.Content | ConvertFrom-Json
$videoUrl = $videoResult.video.url

# Download do vídeo
Invoke-WebRequest -Uri $videoUrl -OutFile "animated_video.mp4"
Write-Host "Vídeo gerado: animated_video.mp4"
```

---

## Troubleshooting

### Erro 422 - "detail": "Application not found"

**Causa**: Endpoint incorreto  
**Solução**: Verifique se está usando o endpoint completo e correto:
- ✅ `fal-ai/bytedance/seedream/v4/text-to-image`
- ❌ `fal-ai/seedream-v4`

### Erro 422 - "content_policy_violation"

**Causa**: Prompt viola políticas de conteúdo  
**Solução**: Simplifique o prompt, evite termos ambíguos ou potencialmente problemáticos. Teste com prompts mais curtos e claros.

### Erro 422 - "unexpected value; permitted: 4, 8, 12"

**Causa**: Duração inválida no SORA 2  
**Solução**: Use apenas os valores permitidos: `4`, `8`, ou `12` segundos.

### Erro 401 - Unauthorized

**Causa**: API Key inválida ou mal formatada  
**Solução**: 
- Verifique se a chave está correta
- Certifique-se de usar o formato: `"Key YOUR_API_KEY"`
- Não confunda com: `"Bearer YOUR_API_KEY"`

### Timeout ou demora excessiva

**Causa**: Geração de vídeos pode levar vários minutos  
**Solução**: 
- Para PowerShell, use timeouts maiores
- Considere usar o sistema de queue da Fal.ai para requisições assíncronas
- Monitore o status via polling

### Imagem/vídeo não é baixado corretamente

**Causa**: URL expirada ou problema de rede  
**Solução**:
- URLs da Fal.ai são temporárias, baixe imediatamente
- Verifique sua conexão de internet
- Adicione tratamento de erros no download

---

## Recursos Adicionais

- **Documentação Oficial Fal.ai**: [https://docs.fal.ai](https://docs.fal.ai)
- **Modelos Disponíveis**: [https://fal.ai/models](https://fal.ai/models)
- **Pricing**: [https://fal.ai/pricing](https://fal.ai/pricing)
- **Status da API**: [https://status.fal.ai](https://status.fal.ai)

---

## Resultados dos Testes

Durante os testes realizados, foram gerados os seguintes arquivos com sucesso:

1. **1_seedream_v4_generated.png** (306.18 KB) - Imagem gerada pelo Seedream V4
2. **2_veo31_generated.mp4** (1285.19 KB) - Vídeo gerado pelo Veo3.1
3. **3_sora2_generated.mp4** (1201.68 KB) - Vídeo gerado pelo SORA 2

Todos os testes foram concluídos com êxito em 27/11/2024 às 02:57 BRT.

---

**Última atualização**: 27 de Novembro de 2024  
**Versão do Documento**: 1.0
