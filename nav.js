// Top bar split (owner, Nov 26 2026): Game Day | Ratings | Players.
// Game Day = the ratings app's Live Scores view; Ratings = its North America / USA / Canada views. The app itself is not changed:
// its own "Live Scores" button is hidden, and its three ratings buttons are hidden while Game Day is showing.
// mpdNav(frame, cb): call once the ratings frame has loaded; cb('gd'|'rt') fires whenever the app moves between the two.
// mpdNavGo(frame, 'gd'|'rt'): switch.
window.mpdNav=function(fr,cb){try{var d=fr.contentDocument;if(!d||!d.body||d.__mpdNav)return;d.__mpdNav=1;
  var st=d.createElement("style");st.textContent='nav.tabs button[data-view="wk"]{display:none!important}body.gd nav.tabs button{display:none!important}';d.head.appendChild(st);
  var cur="";function chk(){var on=d.querySelector("section.view.on"),id=on?on.id:"",m=id==="v-wk"?"gd":(id==="v-na"||id==="v-rank"||id==="v-can")?"rt":(cur||"gd");
    if(m!==cur){cur=m;d.body.classList.toggle("gd",m==="gd");try{var h=d.querySelector("header h1");if(h&&h.firstChild&&h.firstChild.nodeType===3)h.firstChild.nodeValue=m==="gd"?"Game Day":"Live Ratings"}catch(e){}try{cb(m)}catch(e){}}}
  new fr.contentWindow.MutationObserver(chk).observe(d.body,{subtree:true,attributes:true,attributeFilter:["class"]});chk()}catch(e){}};
window.mpdNavGo=function(fr,m){try{var b=fr.contentDocument.querySelector('nav.tabs button[data-view="'+(m==="gd"?"wk":"na")+'"]');if(b)b.click()}catch(e){}};
