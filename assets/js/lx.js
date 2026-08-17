/* ==========================================================================
   LUXÚRIA IMPORTS — comportamento (v4)
   ==========================================================================
   >>> EDITAR ANTES DE PUBLICAR:
       1. CONFIG.whatsapp — número comercial da loja
       2. CATEGORIAS[]    — o que a Luxúria realmente vende (A CONFIRMAR)
       3. PECAS[]         — nome, PREÇO, tamanhos, estoque e foto de cada peça
   ========================================================================== */

const CONFIG = {
  // TODO CONFIRMAR: número comercial da Luxúria, formato 55DDNNNNNNNNN
  whatsapp: "5548000000000",
  saudacao: "Fala! Vim pelo site da Luxúria e queria ver as peças.",
  parcelas: 3   // em quantas vezes o cartão divide, para o "3x de R$X"
};

/* --------------------------------------------------------------------------
   CATEGORIAS
   ⚠️ Lista da referência que a cliente mandou, NÃO confirmada com ela.
   Tirar o que a Luxúria não tiver antes de publicar pra valer.
   -------------------------------------------------------------------------- */
const CATEGORIAS = [
  "Camisetas", "Gola Polo", "Oversized", "Conjuntos",
  "Bermudas", "Calças", "Bonés", "Tênis"
];

/* --------------------------------------------------------------------------
   PEÇAS
   `preco` em reais (número) ou null enquanto não houver. Com preço, o cartão
   mostra valor + parcelado, que é o que as lojas do nicho fazem.
   `de`      — preço antigo, para riscar. null se não houver promoção.
   `tamanhos`— array. `estoque` — número ou null.
   -------------------------------------------------------------------------- */
const PECAS = [
  { nome:"Camiseta básica",   cat:"Camisetas",  img:"assets/img/pecas/camiseta-marinho-basica.jpg",
    preco:null, de:null, tamanhos:["P","M","G","GG"], estoque:null, selo:"Novidade" },
  { nome:"Camiseta lisa",     cat:"Camisetas",  img:"assets/img/pecas/camisetas-cores.jpg",
    preco:null, de:null, tamanhos:["P","M","G","GG"], estoque:null, selo:null },
  { nome:"Camiseta bordada",  cat:"Camisetas",  img:"assets/img/pecas/camisetas-neutras.jpg",
    preco:null, de:null, tamanhos:["M","G","GG"],     estoque:null, selo:null },
  { nome:"Camiseta recorte",  cat:"Gola Polo",  img:"assets/img/pecas/polo-detalhe.jpg",
    preco:null, de:null, tamanhos:["P","M","G"],      estoque:null, selo:"Últimas" },
  { nome:"Camiseta clássica", cat:"Camisetas",  img:"assets/img/pecas/polos-cores.jpg",
    preco:null, de:null, tamanhos:["P","M","G","GG"], estoque:null, selo:null }
];

/* ========================================================================== */

const ICONE_WA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.03c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.95 0-1.41.73-2.1.99-2.38.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.65.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.28.14.47.21.54.33.07.12.07.69-.18 1.38Z"/></svg>`;

const ICONE_VAZIO = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 8.5 8 4h8l5 4.5-3 2.5v9H6v-9L3 8.5Z"/><path d="M9 4a3 3 0 0 0 6 0"/></svg>`;

const linkWa = (extra) => {
  const txt = extra ? `${CONFIG.saudacao}\n\nInteresse: ${extra}` : CONFIG.saudacao;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
};

const real = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits:2, maximumFractionDigits:2 });

/* --------------------------------------------------------------------------
   1. Categorias
   -------------------------------------------------------------------------- */
function montarCategorias(){
  const alvo = document.getElementById("categorias-grade");
  if(!alvo) return;
  alvo.innerHTML = CATEGORIAS.map(nome => `
    <a class="categoria" href="${linkWa(nome)}" target="_blank" rel="noopener" data-rev>
      <span class="categoria__nome">${nome}</span>
      <span class="categoria__ver">ver o que tem</span>
    </a>`).join("");
}

/* --------------------------------------------------------------------------
   2. Vitrine — cartão de loja: foto, nome, preço, parcelado, tamanhos, estoque
   -------------------------------------------------------------------------- */
function montarVitrine(){
  const alvo = document.getElementById("vitrine");
  if(!alvo) return;

  alvo.innerHTML = PECAS.map(p => {
    const visual = p.img
      ? `<img class="peca__img" src="${p.img}" alt="${p.nome}" loading="lazy" decoding="async">`
      : `<div class="peca__vazio">${ICONE_VAZIO}<span>foto em breve</span></div>`;

    const selo = p.selo ? `<span class="peca__selo">${p.selo}</span>` : "";
    const estoque = (p.estoque !== null && p.estoque !== undefined)
      ? `<span class="peca__estoque">${p.estoque} em estoque</span>` : "";

    /* Sem preço definido, o bloco inteiro some — nada de "R$ 0,00" na tela */
    const preco = (p.preco !== null && p.preco !== undefined) ? `
      <div class="peca__preco">
        ${p.de ? `<span class="peca__de">R$ ${real(p.de)}</span>` : ""}
        <span class="peca__valor">R$ ${real(p.preco)}</span>
      </div>
      <p class="peca__parcela">${CONFIG.parcelas}x de <strong>R$ ${real(p.preco / CONFIG.parcelas)}</strong> sem juros</p>`
      : `<p class="peca__parcela">Preço no zap</p>`;

    const tamanhos = (p.tamanhos && p.tamanhos.length)
      ? `<div class="peca__tamanhos">${p.tamanhos.map(t => `<span>${t}</span>`).join("")}</div>` : "";

    return `
      <article class="peca" data-rev>
        <div class="peca__quadro">${selo}${visual}${estoque}</div>
        <div class="peca__corpo">
          <span class="peca__cat">${p.cat}</span>
          <h3 class="peca__nome">${p.nome}</h3>
          ${preco}
          ${tamanhos}
          <a class="peca__ver" href="${linkWa(p.nome)}" target="_blank" rel="noopener">
            ${ICONE_WA} Quero essa
          </a>
        </div>
      </article>`;
  }).join("");
}

/* --------------------------------------------------------------------------
   3. Mural do hero
   -------------------------------------------------------------------------- */
function montarMural(){
  const alvo = document.getElementById("mural");
  if(!alvo) return;
  const fotos = PECAS.map(p => p.img).filter(Boolean).slice(0, 4);
  if(fotos.length < 3){ alvo.remove(); return; }
  alvo.innerHTML = fotos.map((src, i) =>
    `<figure><img src="${src}" alt="" ${i > 1 ? 'loading="lazy"' : ""} decoding="async"></figure>`
  ).join("");
}

/* --------------------------------------------------------------------------
   4. WhatsApp em tudo que tem [data-wa]
   -------------------------------------------------------------------------- */
function ligarWhatsapp(){
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = linkWa(); a.target = "_blank"; a.rel = "noopener";
  });
}

/* --------------------------------------------------------------------------
   5. Rolagem com inércia
   -------------------------------------------------------------------------- */
let lenis = null;
function ligarRolagem(){
  if(typeof Lenis === "undefined") return;
  lenis = new Lenis({ duration:1.1, smoothWheel:true, wheelMultiplier:.95, touchMultiplier:1.6 });

  if(window.gsap && window.ScrollTrigger){
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const laco = t => { lenis.raf(t); requestAnimationFrame(laco); };
    requestAnimationFrame(laco);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const alvo = document.querySelector(a.getAttribute("href"));
      if(!alvo) return;
      e.preventDefault(); fecharMenu();
      lenis.scrollTo(alvo, { offset:-70, duration:1.2 });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Abertura — sem cortina de carregamento (o Levi pediu pra tirar, 17/08)
   -------------------------------------------------------------------------- */
function abertura(){
  const mostrarFlutuante = () => document.querySelector(".flutua").classList.add("viva");

  if(!window.gsap){
    document.querySelectorAll(".mural figure").forEach(f => f.style.opacity = 1);
    mostrarFlutuante();
    return;
  }

  gsap.timeline({ defaults:{ ease:"power3.out" }, onComplete(){ ScrollTrigger.refresh(); } })
    .fromTo(".mural figure", { opacity:0, y:24, scale:.97 },
            { opacity:1, y:0, scale:1, duration:.6, stagger:.07 })
    .fromTo("[data-letras]", { yPercent:110 }, { yPercent:0, duration:.45 }, "-=.45")
    .fromTo(".hero__titulo", { opacity:0, y:20 }, { opacity:1, y:0, duration:.55 }, "-=.3")
    .fromTo(".hero__sub", { opacity:0, y:16 }, { opacity:1, y:0, duration:.45 }, "-=.35")
    .fromTo(".hero__acoes .btn", { opacity:0, y:16 },
            { opacity:1, y:0, duration:.4, stagger:.06 }, "-=.28")
    .fromTo(".hero__selos li", { opacity:0, y:12 },
            { opacity:1, y:0, duration:.4, stagger:.06 }, "-=.28")
    .add(mostrarFlutuante, "-=.2");
}

/* --------------------------------------------------------------------------
   7. Revelações
   -------------------------------------------------------------------------- */
function ligarRevelacoes(){
  if(!window.gsap || !window.ScrollTrigger){
    document.querySelectorAll("[data-rev]").forEach(el => el.style.opacity = 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll("section, footer").forEach(sec => {
    const itens = sec.querySelectorAll("[data-rev]");
    if(!itens.length) return;
    gsap.fromTo(itens, { opacity:0, y:26 },
      { opacity:1, y:0, duration:.7, ease:"power3.out", stagger:.05,
        scrollTrigger:{ trigger:sec, start:"top 82%" } });
  });
}

/* --------------------------------------------------------------------------
   8. Menu
   -------------------------------------------------------------------------- */
function ligarNav(){
  const burguer = document.getElementById("burguer");
  const menu = document.getElementById("menu");
  if(!burguer || !menu) return;
  burguer.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    burguer.classList.toggle("aberto", aberto);
    burguer.setAttribute("aria-expanded", String(aberto));
    menu.setAttribute("aria-hidden", String(!aberto));
    document.body.style.overflow = aberto ? "hidden" : "";
    if(lenis) aberto ? lenis.stop() : lenis.start();
  });
}

function fecharMenu(){
  const menu = document.getElementById("menu");
  const burguer = document.getElementById("burguer");
  if(!menu || !menu.classList.contains("aberto")) return;
  menu.classList.remove("aberto");
  burguer.classList.remove("aberto");
  burguer.setAttribute("aria-expanded","false");
  menu.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  if(lenis) lenis.start();
}

/* -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ano").textContent = new Date().getFullYear();
  montarCategorias();
  montarVitrine();
  montarMural();
  ligarWhatsapp();
  ligarNav();
  ligarRolagem();
  ligarRevelacoes();
  abertura();
});
