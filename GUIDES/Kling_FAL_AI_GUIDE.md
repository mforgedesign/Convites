# Guia de Uso da API Fal.ai Kling (Image-to-Video)

Este guia explica como utilizar a API do Fal.ai para gerar vídeos a partir de imagens usando o modelo Kling.

## Pré-requisitos

1.  **Python Instalado**: Certifique-se de ter o Python instalado em sua máquina.
2.  **Chave de API**: Você precisará de uma chave de API válida do Fal.ai.
3.  **Biblioteca `fal-client`**: Instale a biblioteca oficial usando o pip:

```bash
pip install fal-client
```

## Como Usar

O script abaixo demonstra como enviar uma imagem e um prompt para gerar um vídeo de 5 segundos.

### Exemplo de Script Python

Crie um arquivo chamado `test_kling.py` com o seguinte conteúdo:

```python
import os
import fal_client
import requests

# Configure sua chave de API aqui ou via variável de ambiente
os.environ["FAL_KEY"] = "SUA_CHAVE_DE_API_AQUI"

def generate_video():
    # Caminho da imagem local
    image_path = "caminho/para/sua/imagem.png"
    
    if not os.path.exists(image_path):
        print(f"Erro: {image_path} não encontrado.")
        return

    print("Enviando imagem...")
    # Upload da imagem para o armazenamento do Fal.ai
    url = fal_client.upload_file(image_path)
    print(f"Imagem enviada: {url}")

    # Prompt descrevendo o vídeo desejado
    prompt = "Uma animação cinematográfica..."

    print("Enviando requisição para fal-ai/kling-video/o1/image-to-video...")
    # Envio da requisição para a API
    handler = fal_client.submit(
        "fal-ai/kling-video/o1/image-to-video",
        arguments={
            "prompt": prompt,
            "start_image_url": url, # Imagem inicial
            "end_image_url": url,   # Imagem final (opcional, pode ser diferente)
            "duration": "5"         # Duração em segundos (5 ou 10)
        },
    )

    print("Requisição enviada. Aguardando resultado...")
    # Aguarda o processamento
    result = handler.get()
    
    # Verifica e baixa o resultado
    if 'video' in result and 'url' in result['video']:
        video_url = result['video']['url']
        print(f"Vídeo gerado: {video_url}")
        
        output_dir = "generated_videos"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "output.mp4")
        
        print(f"Baixando vídeo para {output_path}...")
        response = requests.get(video_url)
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print("Download completo.")
    else:
        print("Erro: URL do vídeo não encontrada no resultado.")
        print(result)

if __name__ == "__main__":
    generate_video()
```

### Parâmetros Importantes

*   **`prompt`**: Descrição textual do que deve acontecer no vídeo.
*   **`start_image_url`**: URL da imagem que será o primeiro frame do vídeo.
*   **`end_image_url`**: URL da imagem que será o último frame do vídeo.
*   **`duration`**: Duração do vídeo em segundos. Valores aceitos: "5" ou "10".

## Exemplo Realizado

Neste projeto, utilizamos a imagem `folha preenchida.png` e o seguinte prompt:

> "A cinematic animation of a premium invitation in an enchanted ballroom setting with a blank texturized sheet, featuring gentle swaying of rose petals in the air, and soft golden dust particles slowly descending. Cinematograph style, smooth fluid motion, mesmerizing flow, 4k, hyperrealistic."

O resultado foi salvo na pasta `generated_videos`.

## Documentação Oficial

Para mais detalhes, consulte a [documentação oficial da API](https://fal.ai/models/fal-ai/kling-video/o1/image-to-video/api).
