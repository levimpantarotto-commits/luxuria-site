/* ==========================================================================
   AVISO DE PRÉVIA + REDE DE SEGURANÇA
   ==========================================================================
   Duas funções, as duas se desligam sozinhas quando o site vira operação:

   1. NÚMERO PLACEHOLDER
      Enquanto o WhatsApp for 5548000000000, todo botão de conversa avisa
      em vez de abrir um número que não existe. Quando o número real entrar
      no lugar, este arquivo não faz mais nada: nenhuma tarja, nenhum aviso.

   2. MOTOR DE ANIMAÇÃO
      O CSS deixa vários blocos em opacity 0 esperando o GSAP revelar. Se o
      script do CDN não carregar (rede ruim, bloqueador, CDN fora), a página
      abriria em branco. Passados 3 segundos sem o motor ter subido, revela
      tudo na marra. Já aconteceu uma vez em produção (17/08/2026).
   ========================================================================== */
(function(){
  "use strict";

  var PLACEHOLDER = "5548000000000";

  /* ---------------------------------------------------------------------
     1. Rede de segurança do motor
     --------------------------------------------------------------------- */
  setTimeout(function(){
    if (window.__motorPronto) return;
    var vitrine = document.getElementById("vitrine");
    var semVitrine = vitrine && vitrine.children.length === 0;
    var alvos = document.querySelectorAll("[data-rev], .rv, .mural figure, .hero__acoes .btn, .hero__titulo, .hero__sub");
    var revelou = 0;
    Array.prototype.forEach.call(alvos, function(el){
      var op = window.getComputedStyle(el).opacity;
      if (op === "0" || op === 0) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
        revelou++;
      }
    });
    if (revelou || semVitrine) {
      console.warn("[preview] motor de animação não subiu; conteúdo revelado sem animação (" + revelou + " blocos).");
    }
  }, 3000);

  /* ---------------------------------------------------------------------
     2. Número placeholder
     --------------------------------------------------------------------- */
  function usaPlaceholder(){
    var links = document.querySelectorAll('a[href*="wa.me/"]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("href").indexOf(PLACEHOLDER) > -1) return true;
    }
    return false;
  }

  function estilo(){
    var css = ''
      + '.pv-tarja{position:fixed;top:0;left:0;right:0;z-index:9990;display:flex;gap:10px;align-items:center;justify-content:center;'
      + 'flex-wrap:wrap;background:#1C1B1A;color:#F0EDE8;padding:9px 14px;border-bottom:1px solid rgba(235,201,110,.30);'
      + 'font:500 13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center}'
      + '@media(max-width:560px){.pv-tarja{font-size:12px;padding:8px 12px;gap:6px}}'
      + '.pv-tarja b{font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:11px;color:#EBC96E}'
      + '.pv-tarja span{opacity:.9}'
      + '.pv-fundo{position:fixed;inset:0;z-index:9998;background:rgba(10,9,9,.62);opacity:0;pointer-events:none;transition:opacity .22s ease}'
      + '.pv-fundo.on{opacity:1;pointer-events:auto}'
      + '.pv-caixa{position:fixed;z-index:9999;left:50%;top:50%;transform:translate(-50%,-46%) scale(.96);opacity:0;pointer-events:none;'
      + 'width:min(420px,90vw);background:#FFFFFF;color:#141312;border-radius:14px;padding:28px 26px 24px;'
      + 'box-shadow:0 30px 80px rgba(0,0,0,.42);transition:opacity .22s ease,transform .22s cubic-bezier(.22,1,.36,1);'
      + 'font:400 15px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;text-align:left}'
      + '.pv-caixa.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}'
      + '.pv-caixa h3{margin:0 0 10px;font:800 19px/1.2 inherit;letter-spacing:-.01em;text-transform:none;color:#141312}'
      + '.pv-caixa p{margin:0 0 8px;color:#4A4845}'
      + '.pv-caixa p.pv-num{font:600 14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#8A857E}'
      + '.pv-caixa button{margin-top:16px;width:100%;border:0;border-radius:999px;background:#141312;color:#fff;'
      + 'padding:13px 18px;font:600 14px/1 inherit;cursor:pointer}'
      + '.pv-caixa button:hover{background:#000}';
    var s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* A tarja é fixa no topo. Como as duas navs do projeto também são fixas em
     top:0, elas precisam descer a altura da tarja, e o body ganha o mesmo
     respiro. Tudo é medido, não chutado, e refeito no resize. */
  function tarja(){
    var t = document.createElement("div");
    t.className = "pv-tarja";
    t.innerHTML = '<b>Prévia para aprovação</b>'
      + '<span>Os botões de WhatsApp ainda estão sem o número da loja.</span>';
    document.body.insertBefore(t, document.body.firstChild);

    var presos = [];
    Array.prototype.forEach.call(document.querySelectorAll("body *"), function(el){
      if (el.className && String(el.className).indexOf("pv-") === 0) return;
      var cs = window.getComputedStyle(el);
      if ((cs.position === "fixed" || cs.position === "sticky") && cs.top === "0px") presos.push(el);
    });

    function medir(){
      var h = t.getBoundingClientRect().height;
      document.body.style.paddingTop = h + "px";
      presos.forEach(function(el){ el.style.top = h + "px"; });
      if (window.ScrollTrigger && window.ScrollTrigger.refresh) window.ScrollTrigger.refresh();
    }

    medir();
    window.addEventListener("resize", medir);
    /* fonte externa chegando depois muda a altura da linha */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
  }

  function caixa(){
    var fundo = document.createElement("div");
    fundo.className = "pv-fundo";
    var cx = document.createElement("div");
    cx.className = "pv-caixa";
    cx.setAttribute("role", "dialog");
    cx.setAttribute("aria-modal", "true");
    cx.innerHTML = '<h3>Falta o número da loja</h3>'
      + '<p>Este botão vai abrir o WhatsApp já com a peça escrita na mensagem. '
      + 'Só que o número comercial ainda não foi cadastrado no site.</p>'
      + '<p class="pv-num">no lugar dele está ' + PLACEHOLDER + '</p>'
      + '<p>Assim que o número certo entrar, todos os botões passam a abrir a conversa direto.</p>'
      + '<button type="button">Entendi</button>';
    document.body.appendChild(fundo);
    document.body.appendChild(cx);

    function fechar(){ fundo.classList.remove("on"); cx.classList.remove("on"); }
    fundo.addEventListener("click", fechar);
    cx.querySelector("button").addEventListener("click", fechar);
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") fechar(); });

    return function abrir(){
      fundo.classList.add("on");
      cx.classList.add("on");
      cx.querySelector("button").focus();
    };
  }

  function ligar(){
    if (!usaPlaceholder()) return;   // número real cadastrado: nada acontece
    estilo();
    tarja();
    var abrir = caixa();
    document.addEventListener("click", function(e){
      var a = e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
      if (!a) return;
      if (a.getAttribute("href").indexOf(PLACEHOLDER) === -1) return;
      e.preventDefault();
      abrir();
    }, true);
  }

  /* a vitrine é montada por JS, então os links de peça só existem depois */
  function esperar(){
    ligar();
    if (!usaPlaceholder()) {
      var tenta = 0;
      var t = setInterval(function(){
        if (++tenta > 20) return clearInterval(t);
        if (usaPlaceholder()) { clearInterval(t); ligar(); }
      }, 150);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", esperar);
  } else {
    esperar();
  }
})();
