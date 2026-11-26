// Top bar split (owner, Nov 26 2026): Game Day | Ratings | Players.
// Game Day = the ratings app's Live Scores view; Ratings = its North America / USA / Canada views. The app itself is not changed:
// its own "Live Scores" button is hidden, and its three ratings buttons are hidden while Game Day is showing.
// mpdNav(frame, cb): call once the ratings frame has loaded; cb('gd'|'rt') fires whenever the app moves between the two.
// mpdNavGo(frame, 'gd'|'rt'): switch.
window.mpdNav=function(fr,cb){try{var d=fr.contentDocument;if(!d||!d.body||d.__mpdNav)return;d.__mpdNav=1;
  var st=d.createElement("style");st.textContent='@media(max-width:560px){header .bar h1{display:none!important}header .bar .seg{margin-top:8px}}nav.tabs button[data-view="wk"]{display:none!important}body.gd nav.tabs button{display:none!important}';d.head.appendChild(st);
  /* phones: the six birth years fit on one row when the buttons show the year only (Nov 26 2026) */try{if(fr.contentWindow.innerWidth<=560)d.querySelectorAll("header .seg button[data-div]").forEach(function(x){x.textContent=x.getAttribute("data-div");x.style.flex="1 1 0";x.style.padding="10px 0"})}catch(e){}
  var cur="";function chk(){var on=d.querySelector("section.view.on"),id=on?on.id:"",m=id==="v-wk"?"gd":(id==="v-na"||id==="v-rank"||id==="v-can")?"rt":(cur||"gd");
    if(m!==cur){cur=m;d.body.classList.toggle("gd",m==="gd");try{var h=d.querySelector("header h1");if(h&&h.firstChild&&h.firstChild.nodeType===3)h.firstChild.nodeValue=m==="gd"?"Game Day":"Live Ratings"}catch(e){}try{cb(m)}catch(e){}}}
  new fr.contentWindow.MutationObserver(chk).observe(d.body,{subtree:true,attributes:true,attributeFilter:["class"]});chk()}catch(e){}};
window.mpdNavGo=function(fr,m){try{var b=fr.contentDocument.querySelector('nav.tabs button[data-view="'+(m==="gd"?"wk":"na")+'"]');if(b)b.click()}catch(e){}};
// Fresh scores without a manual refresh (owner, Nov 26 2026: the home-screen app showed 10:55 AM scores at 12:50 PM, and pull-to-refresh is gone
// since the header was fixed in place on Nov 25). mpdFresh({fr, url, prep, active, load}) checks the ratings file every 60 s while the page is on
// screen and every time the app comes back to the front. If the file changed: swap it in at once when the reader is near the top with no team open,
// otherwise show a "New scores: tap to update" pill. A round refresh button sits at the bottom right at all times. Birth year, view and scroll are kept.
window.mpdFresh=function(o){var last=null,busy=false,wait=null,doc=document;
  function sig(t){var h=0,n=t.length;for(var i=0;i<n;i++)h=(h*31+t.charCodeAt(i))|0;return n+":"+h}
  var css=doc.createElement("style");css.textContent="#mpdR{position:fixed;right:14px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:40;width:46px;height:46px;border-radius:50%;border:0;background:#0c2f4a;color:#fff;font-size:22px;line-height:46px;text-align:center;box-shadow:0 3px 12px rgba(0,0,0,.3);cursor:pointer;padding:0}#mpdR.spin{opacity:.55}#mpdP{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(20px + env(safe-area-inset-bottom));z-index:41;background:#c8102e;color:#fff;font:700 14px system-ui,-apple-system,sans-serif;border:0;border-radius:999px;padding:11px 18px;box-shadow:0 3px 14px rgba(0,0,0,.35);cursor:pointer}#mpdR[hidden],#mpdP[hidden]{display:none}";doc.head.appendChild(css);
  var btn=doc.createElement("button");btn.id="mpdR";btn.type="button";btn.setAttribute("aria-label","Refresh scores");btn.textContent="↻";btn.hidden=true;doc.body.appendChild(btn);
  var pill=doc.createElement("button");pill.id="mpdP";pill.type="button";pill.textContent="New scores · tap to update";pill.hidden=true;doc.body.appendChild(pill);
  function state(){var fr=o.fr(),s={y:0};try{var w=fr.contentWindow;s.div=w.eval("div");s.view=w.eval("view");s.team=w.eval("selTeam");s.y=(w.document.scrollingElement||w.document.documentElement).scrollTop||0}catch(e){}return s}
  function swap(t){var fr=o.fr(),s=state(),old=fr.src;try{t=o.prep?o.prep(t):t}catch(e){}
    if(s.div&&/^201\d$/.test(s.div))t=t.replace(/let div='201\d', view='wk'/,"let div='"+s.div+"', view='wk'");
    fr.addEventListener("load",function f(){fr.removeEventListener("load",f);setTimeout(function(){try{var w=fr.contentWindow;if(s.view&&s.view!=="wk"){var b=w.document.querySelector('nav.tabs button[data-view="'+s.view+'"]');if(b)b.click()}w.scrollTo(0,s.y)}catch(e){}},60)});
    var u=URL.createObjectURL(new Blob([t],{type:"text/html"}));try{if(o.load)o.load(u)}catch(e){}fr.src=u;setTimeout(function(){try{if(/^blob:/.test(old))URL.revokeObjectURL(old)}catch(e){}},5000);wait=null;pill.hidden=true}
  async function check(force){if(busy)return;if(!force&&(doc.visibilityState!=="visible"||(o.active&&!o.active())))return;busy=true;btn.classList.add("spin");
    try{var t=await (await fetch(o.url+"?v="+Date.now(),{cache:"no-store"})).text(),g=sig(t);
      if(t.length>5000&&g!==last){last=g;var s=state();if(force||(s.y<120&&!s.team))swap(t);else{wait=t;pill.hidden=!(o.active?o.active():true)}}}catch(e){}
    busy=false;setTimeout(function(){btn.classList.remove("spin")},400)}
  btn.addEventListener("click",function(){if(wait)swap(wait);else check(true)});pill.addEventListener("click",function(){if(wait)swap(wait)});
  setInterval(function(){check(false)},60000);doc.addEventListener("visibilitychange",function(){if(doc.visibilityState==="visible")check(false)});window.addEventListener("pageshow",function(){check(false)});window.addEventListener("focus",function(){check(false)});
  return{seen:function(t){last=sig(t);btn.hidden=false},show:function(v){btn.hidden=!v;if(!v)pill.hidden=true;else if(wait)pill.hidden=false},check:check}};
