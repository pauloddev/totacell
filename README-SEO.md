# TotaCell: landing page, SEO técnico e publicação no Vercel

Site estático de página única (HTML + CSS + JS, sem framework e sem dependências).
O Vercel roda `node scripts/build.mjs`, que copia o site para `dist/`, minifica o CSS e troca:

- o marcador `https://TROCAR-PELO-LINK-DO-VERCEL.vercel.app` pelo link de produção (variável `VERCEL_PROJECT_PRODUCTION_URL`, automática no Vercel);
- o marcador `TROCAR-NUMERO-WHATSAPP` (em todos os botões `wa.me`) pelo número da TotaCell.

## Estrutura

| Arquivo | Para quê |
|---|---|
| `index.html` | Página (title, description, canonical, Open Graph, Twitter Card, favicons, JSON-LD) |
| `404.html` | Página de erro com a mesma identidade visual (`noindex`) |
| `assets/style.css` | Estilos com tokens da marca (ver `DESIGN-SYSTEM.md`) |
| `assets/script.js` | Menu, animações de entrada e ano do rodapé (carregado com `defer`) |
| `assets/fonts/` | Barlow Condensed e Montserrat em WOFF2, servidas pelo próprio site |
| `assets/img/` | Logo da TotaCell (ícone, nome e logo completo) em WebP com fundo transparente |
| `assets/produtos/` | 11 fotos da seção "Alguns dos nossos produtos" em WebP 3:4 (600 px e 360 px) |
| `assets/vitrine/` | 16 fotos de produtos em WebP 3:4 (600 px e 360 px; o microscópio também em 900 px) |
| `assets/video/` | 5 vídeos da loja em MP4 (H.264, com faststart) e WebM (VP9, reserva), mais a capa de cada um em WebP. Para trocar um vídeo, mantenha o nome do arquivo ou ajuste o `data-src` na seção `#videos` do `index.html` |
| `robots.txt` | Libera o rastreamento e aponta o sitemap |
| `sitemap.xml` | Única URL canônica do site (`/`) |
| `site.webmanifest` | Nome, cores e ícones 192/512 |
| `favicon.ico` (16/32/48), `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | Favicons, todos na **raiz** do projeto, gerados do logo |
| `og-image.jpg` | Imagem de compartilhamento 1200x630, na raiz, gerada do logo |
| `scripts/build.mjs` | **SITE_URL** e **WHATSAPP** centrais, build para `dist/` |
| `vercel.json` | Build, pasta de saída, redirecionamento de `/index.html` para `/`, cache |

## O que ficou para preencher

| Item | Arquivo e linha | O que fazer |
|---|---|---|
| WhatsApp | `scripts/build.mjs`, linha 35 | **Preenchido** com (81) 99736-6715. Só edite se o número mudar (ou use a variável `WHATSAPP_NUMERO` no Vercel). |
| URL do site (SITE_URL) | `scripts/build.mjs`, linha 29 | **Automático no Vercel.** Só edite se for publicar fora do Vercel. |
| **Vista 360° (conferir)** | `index.html`, linha 526 (`data-embed`) | Montei o endereço de incorporação a partir do link enviado, com coordenadas aproximadas do centro de Caruaru. Abra o site publicado e confira. Se a vista não aparecer: no Google Maps, abra a foto 360° da loja, *Compartilhar*, *Incorporar um mapa*, copie só o endereço que está dentro de `src="..."` e cole no `data-embed` dessa linha. O botão "Abrir a vista 360°" funciona de qualquer jeito. |
| Horário de atendimento | `index.html`, linhas 539 a 546 | Cole a tabela pronta do comentário com os horários reais. |
| Horário e coordenadas no JSON-LD (opcional) | `index.html`, linhas 66 a 71 | Acrescente os campos indicados no comentário quando tiver os dados. |
| Imagem de compartilhamento (opcional) | raiz, `og-image.jpg` | Já existe (gerada do logo). Para outra arte, substitua mantendo o nome e 1200x630 px. |
| Favicons (opcional) | raiz do projeto | Já existem. Substitua mantendo nomes e tamanhos, se quiser outra arte. |

Os marcadores de URL em `index.html` (linhas 16, 31, 33, 40, 51, 54 a 56), `robots.txt` (linha 6) e
`sitemap.xml` (linha 5) **não precisam ser editados**: o build troca tudo.

## Checklist

**a. Publicar no Vercel via GitHub**
1. Confira o WhatsApp na linha 35 de `scripts/build.mjs` (já preenchido).
2. Suba a pasta inteira para um repositório no GitHub (com `vercel.json` e `scripts/`).
3. No Vercel: *Add New, Project, Import* o repositório.
4. Framework Preset: *Other*. O resto vem do `vercel.json`. Se for usar a variável, adicione `WHATSAPP_NUMERO` em *Environment Variables*. Clique em *Deploy*.

**b. Link de produção e URL**
1. Ao terminar, copie o domínio de produção (ex.: `seu-projeto.vercel.app`).
2. A troca da URL é automática. Para conferir, abra `seu-projeto.vercel.app/robots.txt`
   e `/sitemap.xml`: devem mostrar o seu link, não o marcador.
3. Toque num botão de WhatsApp no link de produção e confira se abre a conversa com o número certo. Confira também a vista 360° e o mapa na seção Localização.
4. Links de *preview* do Vercel saem com `noindex` por padrão. Isso é normal;
   confira sempre no link de produção.

**c. Google Search Console**
1. Acesse search.google.com/search-console, *Adicionar propriedade*, *Prefixo do URL*,
   e cole `https://seu-projeto.vercel.app/`.
2. Verifique pelo método *Tag HTML*: cole a meta tag no `<head>` do `index.html`
   (logo abaixo do `<meta name="viewport">`), faça commit e espere o deploy.
3. Em *Sitemaps*, envie `sitemap.xml`.
4. Em *Inspeção de URL*, teste a página inicial e peça a indexação.
   A indexação depende da avaliação do Google e pode levar dias.

**d. Domínio próprio no futuro**
1. Vercel, *Settings, Domains*: adicione o domínio e configure o DNS indicado.
2. Marque o domínio próprio como principal e configure o `.vercel.app` para
   *Redirect* (308) para ele.
3. Faça um novo deploy (*Redeploy*): o build passa a usar o domínio novo em
   canonical, Open Graph, JSON-LD, robots e sitemap.
4. No Search Console, adicione a propriedade do domínio novo e envie o sitemap de novo.
