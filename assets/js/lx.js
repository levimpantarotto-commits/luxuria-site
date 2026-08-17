/* ==========================================================================
   LUXÚRIA IMPORTS — comportamento
   ==========================================================================
   >>> EDITAR ANTES DE PUBLICAR:
       1. CONFIG.whatsapp — número comercial da loja
       2. CATEGORIAS[]    — o que a Luxúria realmente vende (hoje é a lista da
                            referência que a cliente mandou, A CONFIRMAR)
       3. PECAS[]         — nome, categoria e foto de cada peça
   ========================================================================== */

const CONFIG = {
  // TODO CONFIRMAR: número comercial da Luxúria, formato 55DDNNNNNNNNN
  whatsapp: "5548000000000",
  saudacao: "Fala! Vim pelo site da Luxúria e queria ver as peças."
};

/* --------------------------------------------------------------------------
   CATEGORIAS
   ⚠️ Lista montada a partir da referência que a cliente mandou
   (jgimportss.lojavirtualnuvem.com.br). NÃO está confirmado que a Luxúria
   trabalha com todas. Tirar o que não tiver antes de publicar.
   -------------------------------------------------------------------------- */
const CATEGORIAS = [
  "Camisetas", "Camisetas Premium", "Oversized", "Gola Polo",
  "Moletons", "Jaquetas", "Calças", "Bermudas",
  "Conjuntos", "Tênis", "Bonés", "Perfumes"
];

/* --------------------------------------------------------------------------
   PEÇAS
   Preencher `img` com o caminho em assets/img/pecas/. Enquanto for null,
   entra o placeholder — o site funciona, só não tem foto ainda.
   -------------------------------------------------------------------------- */
/* Fotos: prints de story do fornecedor, recortados — a foto de dentro foi
   extraída e o resto (barra de status, cabeçalho do story, rodapé) descartado.
   Script: Temp/lx-shots/tratar-lx.py. Quadradas, 591px.
   ⚠️ Nome de marca fica FORA do site de propósito (as peças são de marca). */
const PECAS = [
  { nome:"Camiseta básica",     cat:"Camisetas Premium", img:"assets/img/pecas/camiseta-marinho-basica.jpg", selo:"Novidade", desce:false },
  { nome:"Camiseta lisa",       cat:"Camisetas Premium", img:"assets/img/pecas/camisetas-cores.jpg",         selo:null,       desce:true  },
  { nome:"Camiseta bordada",    cat:"Camisetas",         img:"assets/img/pecas/camisetas-neutras.jpg",       selo:null,       desce:false },
  { nome:"Camiseta recorte",    cat:"Camisetas",         img:"assets/img/pecas/polo-detalhe.jpg",            selo:"Últimas",  desce:false },
  { nome:"Camiseta clássica",   cat:"Camisetas Premium", img:"assets/img/pecas/polos-cores.jpg",             selo:null,       desce:true  }
];

/* ========================================================================== */

const linkWa = (extra) => {
  const txt = extra ? `${CONFIG.saudacao}\n\nInteresse: ${extra}` : CONFIG.saudacao;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
};

const ICONE_VAZIO = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 8.5 8 4h8l5 4.5-3 2.5v9H6v-9L3 8.5Z"/><path d="M9 4a3 3 0 0 0 6 0"/></svg>`;

/* --------------------------------------------------------------------------
   1. Categorias — cada uma abre o WhatsApp já dizendo qual é
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
   2. Vitrine
   -------------------------------------------------------------------------- */
function montarVitrine(){
  const alvo = document.getElementById("vitrine");
  if(!alvo) return;

  alvo.innerHTML = PECAS.map(p => {
    const classes = ["peca", p.desce ? "peca--desce" : ""].filter(Boolean).join(" ");
    const visual = p.img
      ? `<img class="peca__img" src="${p.img}" alt="${p.nome}" loading="lazy" decoding="async">`
      : `<div class="peca__vazio">${ICONE_VAZIO}<span>foto em breve</span></div>`;
    const selo = p.selo ? `<span class="peca__selo">${p.selo}</span>` : "";

    return `
      <article class="${classes}" data-rev>
        <div class="peca__quadro">
          ${selo}
          ${visual}
          <a class="peca__ver" href="${linkWa(p.nome)}" target="_blank" rel="noopener">Quero essa</a>
        </div>
        <div class="peca__pe">
          <h3 class="peca__nome">${p.nome}</h3>
          <span class="peca__cat">${p.cat}</span>
        </div>
      </article>`;
  }).join("");
}

/* --------------------------------------------------------------------------
   2b. Mural do hero — as peças de verdade em cima, não o brasão
   -------------------------------------------------------------------------- */
function montarMural(){
  const alvo = document.getElementById("mural");
  if(!alvo) return;
  const fotos = PECAS.map(p => p.img).filter(Boolean).slice(0, 5);
  if(fotos.length < 3){ alvo.remove(); return; }
  alvo.innerHTML = fotos.map((src, i) => `
    <figure>
      <img src="${src}" alt="" ${i > 1 ? 'loading="lazy"' : ""} decoding="async">
      ${i === 0 ? '<span class="mural__luz"></span>' : ""}
    </figure>`).join("");
}

/* --------------------------------------------------------------------------
   3. WhatsApp em tudo que tem [data-wa]
   -------------------------------------------------------------------------- */
function ligarWhatsapp(){
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = linkWa(); a.target = "_blank"; a.rel = "noopener";
  });
}

/* --------------------------------------------------------------------------
   4. Rolagem com inércia
   -------------------------------------------------------------------------- */
let lenis = null;
function ligarRolagem(){
  if(typeof Lenis === "undefined") return;
  lenis = new Lenis({ duration:1.15, smoothWheel:true, wheelMultiplier:.95, touchMultiplier:1.6 });

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
      lenis.scrollTo(alvo, { offset:-70, duration:1.4 });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Abertura
   Sem cortina de carregamento (o Levi pediu pra tirar, 17/08). A página já
   nasce visível; o conteúdo do topo entra em cascata, sem prender ninguém.
   -------------------------------------------------------------------------- */
function abertura(){
  const mostrarFlutuante = () => document.querySelector(".flutua").classList.add("viva");

  if(!window.gsap){
    document.querySelectorAll(".mural figure").forEach(f => f.style.opacity = 1);
    mostrarFlutuante();
    return;
  }

  const tl = gsap.timeline({ defaults:{ ease:"power3.out" },
    onComplete(){ ScrollTrigger.refresh(); } });

  tl.fromTo(".mural figure", { opacity:0, y:30, scale:.97 },
            { opacity:1, y:0, scale:1, duration:.7, stagger:.08 })
    .fromTo("[data-letras]", { yPercent:110 }, { yPercent:0, duration:.5 }, "-=.5")
    .fromTo(".hero__titulo .linha > span", { yPercent:112 },
            { yPercent:0, duration:.75, stagger:.07, ease:"power4.out" }, "-=.35")
    .fromTo(".hero__sub", { opacity:0, y:18 }, { opacity:1, y:0, duration:.5 }, "-=.45")
    .fromTo(".hero__acoes .btn", { opacity:0, y:18 },
            { opacity:1, y:0, duration:.45, stagger:.07 }, "-=.3")
    .fromTo(".hero__selos li", { opacity:0, y:14 },
            { opacity:1, y:0, duration:.45, stagger:.07 }, "-=.3")
    .fromTo(".hero__rodape > *", { opacity:0 }, { opacity:1, duration:.4, stagger:.08 }, "-=.25")
    .add(mostrarFlutuante, "-=.2");
}

/* --------------------------------------------------------------------------
   6. Revelações
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
    gsap.fromTo(itens, { opacity:0, y:34 },
      { opacity:1, y:0, duration:.9, ease:"power3.out", stagger:.06,
        scrollTrigger:{ trigger:sec, start:"top 78%" } });
  });

  /* o hero desbota conforme sai — start em "top top" pra progresso ser 0 no topo */
  gsap.fromTo(".hero__centro", { opacity:1, y:0 },
    { opacity:0, y:-70, ease:"none", immediateRender:false,
      scrollTrigger:{ trigger:".hero", start:"top top", end:"bottom 30%", scrub:.5, invalidateOnRefresh:true } });

  /* zoom lento nas fotos da vitrine */
  gsap.utils.toArray(".peca__quadro").forEach(q => {
    const alvo = q.querySelector(".peca__img, .peca__vazio");
    if(!alvo) return;
    gsap.fromTo(alvo, { scale:1.1 }, { scale:1, ease:"none",
      scrollTrigger:{ trigger:q, start:"top bottom", end:"bottom top", scrub:1 } });
  });
}

/* --------------------------------------------------------------------------
   7. Nav e menu
   -------------------------------------------------------------------------- */
function ligarNav(){
  const nav = document.getElementById("nav");
  const olhar = () => nav.classList.toggle("fixa", window.scrollY > 40);
  olhar();
  window.addEventListener("scroll", olhar, { passive:true });

  const burguer = document.getElementById("burguer");
  const menu = document.getElementById("menu");
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
