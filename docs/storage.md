# Storage (MinIO / S3)

O lnkcore usa armazenamento de objetos compatível com S3 para imagens de perfil, capas de páginas e ícones de links.

Em desenvolvimento local, o [MinIO](https://min.io) é executado via Docker. Em produção, qualquer serviço S3-compatible pode ser usado (AWS S3, Cloudflare R2, Backblaze B2, etc.).

## Infraestrutura local

O `docker-compose.yml` sobe o MinIO com as seguintes configurações:

```yaml
minio:
  image: minio/minio:latest
  command: server /data --console-address ":9001"
  environment:
    MINIO_ROOT_USER: lnkcore
    MINIO_ROOT_PASSWORD: lnkcore123
  ports:
    - "9000:9000"   # API S3
    - "9001:9001"   # Console web
```

Acesse o console em [http://localhost:9001](http://localhost:9001) com `lnkcore` / `lnkcore123`.

## Variáveis de ambiente

| Variável | Exemplo (dev) | Descrição |
| -------- | ------------- | --------- |
| `S3_ENDPOINT` | `http://localhost:9000` | URL base do serviço S3 |
| `S3_REGION` | `us-east-1` | Região (qualquer valor para MinIO) |
| `S3_ACCESS_KEY` | `lnkcore` | Access key |
| `S3_SECRET_KEY` | `lnkcore123` | Secret key |
| `S3_BUCKET` | `lnkcore` | Nome do bucket padrão |
| `S3_FORCE_PATH_STYLE` | `true` | Obrigatório para MinIO e provedores não-AWS |

> Para AWS S3, defina `S3_FORCE_PATH_STYLE=false` e omita `S3_ENDPOINT`.

## Criar o bucket no MinIO (primeira vez)

Via console web:
1. Acesse [http://localhost:9001](http://localhost:9001)
2. Vá em **Buckets → Create Bucket**
3. Digite `lnkcore` e confirme

Via CLI (`mc` — MinIO Client):

```bash
# Instalar mc (macOS)
brew install minio/stable/mc

# Configurar alias
mc alias set local http://localhost:9000 lnkcore lnkcore123

# Criar bucket
mc mb local/lnkcore

# Listar buckets
mc ls local
```

## Uso em produção

Troque as variáveis de ambiente pelo provedor escolhido:

### AWS S3

```env
S3_ENDPOINT=            # deixe vazio para usar o endpoint padrão da AWS
S3_REGION=us-east-1
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=...
S3_BUCKET=meu-bucket-producao
S3_FORCE_PATH_STYLE=false
```

### Cloudflare R2

```env
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_REGION=auto
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=lnkcore
S3_FORCE_PATH_STYLE=true
```

## Nota de implementação

A integração do cliente S3 (upload, geração de URLs pré-assinadas, etc.) ainda não está implementada no código-fonte. As variáveis de ambiente já estão definidas e prontas para uso quando a funcionalidade for desenvolvida.
