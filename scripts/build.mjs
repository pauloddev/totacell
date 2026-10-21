// Build de SEO para o deploy no Vercel (sem dependências: só Node).
// Copia o site para dist/, minifica o CSS e troca os marcadores de URL e de WhatsApp.
//
// ============================================================
// 1) SITE_URL: URL CENTRAL DO SITE
//    (canonical, og:url, og:image, JSON-LD, robots.txt e sitemap.xml usam este valor)
//
//    No Vercel ela é preenchida sozinha com VERCEL_PROJECT_PRODUCTION_URL
//    (o link de produção, ex.: seu-projeto.vercel.app, ou o seu domínio
//    próprio quando você conectar um).
//
//    TODO: PREENCHER só se quiser fixar a URL manualmente: troque o texto
//    da linha 29 (SITE_URL_MANUAL) pelo seu link, sem barra no final.
//
// 2) WHATSAPP: NÚMERO USADO EM TODOS OS BOTÕES DO SITE
//    Número da TotaCell na linha 35 (só dígitos: 55 + DDD + número).
//    Para trocar, edite a linha 35 mantendo o mesmo formato.
//    (WhatsApp atual: (81) 99736-6715)
//    Também dá para definir no Vercel a variável de ambiente WHATSAPP_NUMERO,
//    que tem prioridade sobre a linha 35.
// ============================================================
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const URL_PLACEHOLDER = "https://TROCAR-PELO-LINK-DO-VERCEL.vercel.app";
const WA_PLACEHOLDER = "TROCAR-NUMERO-WHATSAPP";

// URL do site (manual, só fora do Vercel)
const SITE_URL_MANUAL = "https://TROCAR-PELO-LINK-DO-VERCEL.vercel.app";
const SITE_URL = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : SITE_URL_MANUAL
).replace(/\/+$/, "");

// WhatsApp da TotaCell
const WHATSAPP = (process.env.WHATSAPP_NUMERO || "5581997366715").replace(/\D+/g, "") || WA_PLACEHOLDER;

const ROOT = process.cwd();
const OUT = join(ROOT, "dist");

// Arquivos e pastas públicos do site
const PUBLIC = [
  "index.html", "404.html", "assets", "robots.txt", "sitemap.xml", "site.webmanifest",
  "favicon.ico", "favicon.svg", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png",
  "icon-192.png", "icon-512.png", "og-image.jpg",
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const item of PUBLIC) {
  if (existsSync(join(ROOT, item))) cpSync(join(ROOT, item), join(OUT, item), { recursive: true });
  else console.warn(`[seo] AVISO: ${item} não encontrado na raiz do projeto.`);
}

// Troca os marcadores nos arquivos de texto
const today = new Date().toISOString().slice(0, 10);
for (const f of ["index.html", "404.html", "robots.txt", "sitemap.xml"]) {
  const p = join(OUT, f);
  let txt = readFileSync(p, "utf8").split(URL_PLACEHOLDER).join(SITE_URL).split(WA_PLACEHOLDER).join(WHATSAPP);
  if (f === "sitemap.xml") txt = txt.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${today}</lastmod>`);
  writeFileSync(p, txt);
}

// Minifica o CSS em dist/ (remove comentários e espaços extras)
{
  const cssPath = join(OUT, "assets", "style.css");
  const css = readFileSync(cssPath, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
  writeFileSync(cssPath, css);
}

if (SITE_URL === URL_PLACEHOLDER) console.warn("[seo] AVISO: SITE_URL ainda é o marcador. Fora do Vercel, defina SITE_URL_MANUAL em scripts/build.mjs.");
if (WHATSAPP === WA_PLACEHOLDER) console.warn("[seo] AVISO: número do WhatsApp não preenchido (scripts/build.mjs, linha 35). Os botões de WhatsApp não vão funcionar.");
console.log(`[seo] Build pronto em dist/ com SITE_URL = ${SITE_URL} e WhatsApp = ${WHATSAPP}`);
