# TotaCell: design system da landing page

Tokens extraídos do logo (vermelho e o amarelo/laranja do "C") e dos stories do Instagram
(títulos amarelos com sombra 3D, cartões brancos com contorno preto e sombra amarela,
hexágonos em linha e cruzes amarelas). Todos ficam em `:root`, no topo de `assets/style.css`.

## Direção (Vibe Spec)

| | |
|---|---|
| Âncora | Os stories da própria marca: parede vermelha com etiquetas de prateleira |
| Emoção nos 3 primeiros segundos | "Aqui tem tudo, é só pedir" |
| Paleta | Vermelho TotaCell, amarelo de título, laranja de sombra, branco e contorno quase preto |
| Tipografia | Barlow Condensed 700/800/900 (títulos) + Montserrat 400/600/700 (texto) |
| Elemento memorável | O cartão-etiqueta: branco, contorno preto, sombra amarela deslocada que "afunda" ao toque |
| Evitar | Cara de e-commerce genérico, azul, gradiente roxo |

## Cores

| Token | Valor | Uso |
|---|---|---|
| `--red` | `#E32028` | Vermelho do logo: ícones dos cartões, brilhos do fundo |
| `--red-600` | `#C8141B` | Topo dos quadros dos stories |
| `--red-700` | `#B3121A` | Fundo principal, header, `theme-color` |
| `--red-800` | `#8F0D13` | Base dos gradientes |
| `--red-900` | `#5E070C` | Rodapé, sombra do texto branco |
| `--yellow` | `#FFC20E` | Títulos grandes, botão principal, faixa, etiquetas |
| `--yellow-text` | `#FFD866` | Texto amarelo pequeno (rótulos, links), para manter contraste AA |
| `--orange` | `#F28C1E` | Sombra 3D dos títulos |
| `--orange-700` | `#C2620A` | Sombra de "botão físico" |
| `--ink` | `#1A0606` | Contornos e texto sobre amarelo |
| `--white` | `#FFFFFF` | Texto, cartões-etiqueta |

Contraste conferido (WCAG): branco sobre `--red-700` 6,9:1; `--yellow-text` sobre `--red-700` 5,1:1;
`--yellow` sobre `--red-700` 4,3:1 (usado só em texto grande, mínimo 3:1); `--ink` sobre `--yellow` 12,1:1.

## Tipografia

| Estilo | Fonte | Tamanho |
|---|---|---|
| `h1` | Barlow Condensed 900, caixa alta, amarelo + `--shadow-3d` | `clamp(44px, 7.2vw, 90px)` |
| `.h2` | Barlow Condensed 900, amarelo + `--shadow-3d-sm`; `em` em branco | `clamp(34px, 5vw, 60px)` |
| `h3` | Barlow Condensed 800, branco | 24px |
| `.eyebrow` | Barlow Condensed 700, espaçado, `--yellow-text` | 14px |
| Texto | Montserrat 400 | 16px (lead: `clamp(16px, 1.6vw, 18px)`) |

Títulos usam `text-wrap: balance`; parágrafos longos, `text-wrap: pretty`.

## Forma, sombra e movimento

`--r: 18px` (painéis), `--r-sm: 12px`, `--r-pill: 14px` (cartões-etiqueta).
`--tag-shadow` / `--tag-shadow-hover`: sombra amarela com contorno, deslocada para a esquerda e para baixo.
`--ease: cubic-bezier(.22, 1, .36, 1)`. Todas as animações usam `transform`/`opacity`
e são desligadas com `prefers-reduced-motion`.

## Componentes

| Componente | Classe | Variações e estados |
|---|---|---|
| Botão | `.btn` | `--sm`, `--block`, `--light`. Hover sobe 2px, active afunda 4px, foco com contorno branco |
| Botão fantasma | `.ghost` | Hover com borda amarela |
| Cartão-etiqueta | `.pill` | `.pills--cats` (categorias), `.pills--brands` (marcas), padrão em lista. Hover encolhe a sombra, active "afunda" por completo. Cada cartão abre o WhatsApp com o item já escrito |
| Carrossel de vídeos | `.reel` | Barrinhas de progresso no estilo dos stories. Um vídeo toca por vez (sem som, até o visitante ligar). O ativo ganha borda e sombra amarela e o selo "Tocando agora". Os outros ficam esmaecidos. Pausa fora da tela e não toca sozinho com movimento reduzido |
| Destaque de produto | `.star` | Foto grande com sombra amarela e selo "Destaque" + texto e CTA (microscópio AK-7050) |
| Vitrine | `.shots` / `.shot` | Fotos 3:4 todas do mesmo tamanho: 5 colunas, 3 no tablet, faixa com rolagem lateral no celular. Cada foto abre o WhatsApp com o produto |
| Quadro de story | `.board` + `.board__title` | Fundo vermelho, hexágonos no canto e cruzes amarelas |
| Painel | `.panel` | Usado em vantagens (`.qual__item`), pagamento (`.pay__item`), lista (`.kit`), FAQ e contato |
| Ícone em bloco | `.ico`, `.kit__ico`, `.pill__ico` | Amarelo com contorno (painéis) ou vermelho (cartões) |
| Etiqueta | `.tag`, `.status`, `.ceo__plate` | Amarelo com texto `--ink` |
| Padrões | `.geo` (hexágonos), `.plus` (cruzes), `.traces` (trilhas de circuito do layout original) | Decorativos, `aria-hidden` |
