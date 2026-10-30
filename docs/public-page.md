# Página pública e editor

Produto: **MakeBio** (`makebio.com.br/{slug}`).

A página pública e o preview do editor compartilham o mesmo render: [`SlugPageView`](../src/components/page-slug-view.tsx). Estilos scoped em [`slug-page-styles.ts`](../src/components/public/slug-page-styles.ts). O atributo HTML é `data-layout="classic" | "cover"` (minúsculo) — o enum Prisma continua `CLASSIC | COVER`.

## Layouts (`Page.layout`)

| Layout | No editor | Página pública |
| ------ | --------- | -------------- |
| **Clássico** | Foto redonda, links em botão | Avatar, título, bio, ícones sociais, lista de links |
| **Capa** | Foto em tela cheia, estilo feed | Hero 4:5 com degradê na cor do tema, nome/`@slug`/redes/bio sobre a imagem, links abaixo |

No **desktop**, o layout Capa envolve o conteúdo num card no formato de celular (`.sp-device`): cantos arredondados, sombra, fundo borrado da capa nas laterais. No **mobile** e no preview do editor o conteúdo é full-bleed (o celular do editor já tem a moldura).

O degradê do hero usa `theme.background` (preto no tema Astrid, cinza no Air, etc.) — não é um overlay transparente sobre a foto.

Troca de layout: Aparência → Layout, persistido por `updatePage`.

## Tipos de link (`Link.type`)

| Tipo | Aparência | Onde |
| ---- | --------- | ---- |
| `CLASSIC` | Botão com miniatura à esquerda (imagem, ícone ou emoji) | Lista principal |
| `FEATURED` | Card grande; com imagem, overlay 4:5 com título por cima | Lista principal |
| `SOCIAL` | Só ícone da rede | Fileira de ícones (no Capa, sobre o hero) |

Redes sociais não entram na lista de botões. Links inativos (`active: false`) não aparecem na pública.

## Editor

Rota: `/dashboard/{pageId}`. O header do dashboard some nesta rota.

Trilho:

1. **Links** — clássicos, featured e redes
2. **Cabeçalho** — foto/capa, título, bio, slug
3. **Aparência** — layout Clássico/Capa e tema

O preview à direita é um iPhone (393×852, scaled) com `SlugPageView` em modo `preview`.

## Temas

`Page.themeId` aponta para [`src/lib/themes.ts`](../src/lib/themes.ts). Cores (`background`, `foreground`, `cardBg`, `accent`…) alimentam as CSS variables `--sp-*` da página pública.

## QA — o que bater

- [ ] `/seu-slug` em **Clássico**: avatar redondo, bio abaixo, ícones, botões
- [ ] `/seu-slug` em **Capa** no **mobile**: foto 4:5, texto sobre o degradê (não “flutuando” na foto crua), links colados no hero
- [ ] **Capa** no **desktop**: card arredondado com sombra, laterais com a capa borrada
- [ ] Preview do editor igual à pública (mesmas cores e recorte)
- [ ] Link **featured** com imagem: card overlay; sem imagem: card grande
- [ ] Adicionar Instagram/TikTok: some da lista e aparece como ícone
- [ ] Tema claro vs escuro: o fade do Capa acompanha o fundo do tema
