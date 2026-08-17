/* ==========================================================================
   LUXÚRIA IMPORTS — versão saída do DESIGN LOOP
   ==========================================================================
   Correções de conteúdo vindas dos críticos:
   · nomes genéricos ("básica", "clássica") apagavam o logo que a foto entrega
   · "Camiseta recorte" estava na categoria "Gola Polo" e a foto é gola careca
   · 8 categorias inventadas → só o que a foto comprova
   · CTA preso em opacity:0 por seletor errado → rede de segurança no fim
   ========================================================================== */

const CONFIG = {
  // TODO CONFIRMAR com a Paola. Enquanto for este número, NENHUM link funciona.
  whatsapp: "5548000000000",
  saudacao: "Fala! Vim pelo site da Luxúria e queria ver as peças."
};

/* Categorias: só as que a foto comprova. As outras 6 eram cópia da referência.
   Quando a cliente confirmar o que vende, é só somar aqui. */
const CATEGORIAS = [
  { nome:"Camisetas",  nota:"gola careca, logo no peito" },
  { nome:"Gola polo",  nota:"perguntar disponibilidade" },
  { nome:"Outras peças", nota:"diz o que tu procura" }
];

/* Nome descreve o que a foto MOSTRA. "Básica" e "clássica" são vocabulário de
   quem quer discrição, e esse comprador paga pelo logo aparecendo. */
const PECAS = [
  { nome:"Logo bordado no peito", cat:"Camisetas", nota:"7 cores na foto",
    img:"assets/img/pecas/camisetas-cores.jpg" },
  { nome:"Tom sobre tom",         cat:"Camisetas", nota:"logo na mesma cor do tecido",
    img:"assets/img/pecas/camiseta-marinho-basica.jpg" },
  { nome:"Bordado em relevo",     cat:"Camisetas", nota:"5 cores na foto",
    img:"assets/img/pecas/camisetas-neutras.jpg" },
  { nome:"Gola careca com friso", cat:"Camisetas", nota:"detalhe em contraste",
    img:"assets/img/pecas/polo-detalhe.jpg" },
  { nome:"Logo bordado colorido", cat:"Camisetas", nota:"8 cores na foto",
    img:"assets/img/pecas/polos-cores.jpg" }
];

/* ========================================================================== */

const ICONE_WA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.03c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.95 0-1.41.73-2.1.99-2.38.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.65.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.29.38-.24.64-.14.26.09 1.66.78 1.95.93.28.14.47.21.54.33.07.12.07.69-.18 1.38Z"/></svg>`;

const linkWa = (extra) => {
  const txt = extra ? `${CONFIG.saudacao}\n\nInteresse: ${extra}` : CONFIG.saudacao;
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(txt)}`;
};

function montar(){
  const cats = document.getElementById("categorias-grade");
  if(cats) cats.innerHTML = CATEGORIAS.map(c => `
    <a class="categoria" href="${linkWa(c.nome)}" target="_blank" rel="noopener" data-rev>
      <b>${c.nome}</b><span>${c.nota}</span>
    </a>`).join("");

  const vit = document.getElementById("vitrine");
  if(vit) vit.innerHTML = PECAS.map(p => `
    <article class="peca" data-rev>
      <div class="peca__foto"><img src="${p.img}" alt="${p.nome}" loading="lazy" decoding="async"></div>
      <div class="peca__corpo">
        <span class="peca__cat">${p.cat}</span>
        <h3 class="peca__nome">${p.nome}</h3>
        <p class="peca__nota">${p.nota}</p>
        <a class="peca__ver" href="${linkWa(p.nome)}" target="_blank" rel="noopener">
          ${ICONE_WA} Perguntar no zap
        </a>
      </div>
    </article>`).join("");

  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = linkWa(); a.target = "_blank"; a.rel = "noopener";
  });
}

let lenis = null;
function rolagem(){
  if(typeof Lenis === "undefined") return;
  lenis = new Lenis({ duration:1.1, smoothWheel:true, wheelMultiplier:.95, touchMultiplier:1.6 });
  if(window.gsap && window.ScrollTrigger){
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const l = t => { lenis.raf(t); requestAnimationFrame(l); };
    requestAnimationFrame(l);
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

/* Abertura: receita aprovada em 11/08 (escala 1,22 + blur 20px→0, expo.out 1,6s).
   Sem gate de reduce-motion, porque o Windows do Levi tem isso ligado. */
function abertura(){
  const acender = () => document.querySelector(".flutua").classList.add("viva");
  if(!window.gsap){ acender(); return; }

  gsap.timeline({ onComplete(){ ScrollTrigger.refresh(); } })
    .fromTo(".palco", { opacity:0, scale:1.22, filter:"blur(20px)" },
      { opacity:1, scale:1, filter:"blur(0px)", duration:1.6, ease:"expo.out" }, 0)
    .fromTo("[data-letras]", { yPercent:130 }, { yPercent:0, duration:.7, ease:"expo.out" }, .1)
    .fromTo(".hero__linha > span", { yPercent:115 },
      { yPercent:0, duration:1, stagger:.09, ease:"expo.out" }, .25)
    .fromTo(".hero__sub", { opacity:0, y:26 }, { opacity:1, y:0, duration:.7, ease:"expo.out" }, .75)
    .fromTo(".hero__acoes .wa", { opacity:0, y:26, scale:.94 },
      { opacity:1, y:0, scale:1, duration:.7, ease:"back.out(1.7)" }, .85)
    .fromTo(".selos li", { opacity:0, y:20 },
      { opacity:1, y:0, duration:.55, stagger:.1, ease:"expo.out" }, 1.1)
    .add(acender, 1.3);
}

/* A página não pode animar uma vez e morrer: a foto do palco continua se
   movendo com a rolagem, com deslocamento grande o bastante pra ser visto. */
function revelar(){
  if(!window.gsap || !window.ScrollTrigger){
    document.querySelectorAll("[data-rev]").forEach(e => e.style.opacity = 1);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".cabeca [data-rev]").forEach(el => {
    gsap.fromTo(el, { opacity:0, y:44, filter:"blur(10px)" },
      { opacity:1, y:0, filter:"blur(0px)", duration:1, ease:"expo.out",
        scrollTrigger:{ trigger:el, start:"top 84%" } });
  });

  gsap.fromTo(".peca[data-rev]", { opacity:0, y:56, scale:.92, filter:"blur(12px)" },
    { opacity:1, y:0, scale:1, filter:"blur(0px)", duration:1, ease:"expo.out", stagger:.15,
      scrollTrigger:{ trigger:"#pecas", start:"top 78%" } });

  gsap.fromTo(".categoria[data-rev]", { opacity:0, y:40, scale:.94 },
    { opacity:1, y:0, scale:1, duration:.8, ease:"back.out(1.5)", stagger:.1,
      scrollTrigger:{ trigger:"#categorias", start:"top 80%" } });

  gsap.fromTo(".passo[data-rev]", { opacity:0, y:44, filter:"blur(10px)" },
    { opacity:1, y:0, filter:"blur(0px)", duration:.9, ease:"expo.out", stagger:.13,
      scrollTrigger:{ trigger:"#comprar", start:"top 78%" } });

  gsap.fromTo(".duvida[data-rev]", { opacity:0, x:-30 },
    { opacity:1, x:0, duration:.7, ease:"expo.out", stagger:.09,
      scrollTrigger:{ trigger:"#duvidas", start:"top 80%" } });

  gsap.fromTo(".fecho [data-rev]", { opacity:0, y:40, scale:.94 },
    { opacity:1, y:0, scale:1, duration:.9, ease:"expo.out", stagger:.12,
      scrollTrigger:{ trigger:".fecho", start:"top 82%" } });

  /* a foto do palco atravessa a dobra em movimento contínuo */
  gsap.fromTo(".palco img", { scale:1.18, yPercent:-6 },
    { scale:1, yPercent:6, ease:"none",
      scrollTrigger:{ trigger:".palco", start:"top bottom", end:"bottom top", scrub:.7 } });

  /* REDE DE SEGURANÇA: nenhum [data-rev] pode ficar preso em opacity:0 por
     causa de um seletor errado. Foi assim que 5 CTAs sumiram na versão anterior. */
  requestAnimationFrame(() => {
    document.querySelectorAll("[data-rev]").forEach(el => {
      if(!gsap.getTweensOf(el).length){
        gsap.fromTo(el, { opacity:0, y:30 },
          { opacity:1, y:0, duration:.8, ease:"expo.out",
            scrollTrigger:{ trigger:el, start:"top 90%" } });
      }
    });
  });
}

function ligarMenu(){
  const b = document.getElementById("burguer"), m = document.getElementById("menu");
  if(!b || !m) return;
  b.addEventListener("click", () => {
    const aberto = m.classList.toggle("aberto");
    b.classList.toggle("aberto", aberto);
    b.setAttribute("aria-expanded", String(aberto));
    m.setAttribute("aria-hidden", String(!aberto));
    document.body.style.overflow = aberto ? "hidden" : "";
    if(lenis) aberto ? lenis.stop() : lenis.start();
  });
}
function fecharMenu(){
  const m = document.getElementById("menu"), b = document.getElementById("burguer");
  if(!m || !m.classList.contains("aberto")) return;
  m.classList.remove("aberto"); b.classList.remove("aberto");
  b.setAttribute("aria-expanded","false"); m.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  if(lenis) lenis.start();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("ano").textContent = new Date().getFullYear();
  montar(); ligarMenu(); rolagem(); revelar(); abertura();
});
