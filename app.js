/* Home-screen app support (Nov 25, 2026). No service worker on purpose: scores and ratings must never be served from a stale cache.
   1. Opened from the Home Screen icon (standalone): a signed-in member who lands on the free page goes to the member site.
   2. On a phone browser: one small dismissible bar that says how to add the site to the Home Screen
      (member page: always; free page: returning visitors only). Dismissed or installed = never shown again. */
(function(){try{
var L=localStorage,p=location.pathname,sa=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
if(sa){try{L.setItem("mpd_app","1")}catch(e){}if(/^\/live\/?$/.test(p)&&L.getItem("mpd_m")&&!/[?&]stay=1/.test(location.search)){location.replace("/members/");}return}
var ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua),and=/Android/.test(ua);
if(!(ios||and)||L.getItem("mpd_a2hs"))return;
var mem=/^\/members\/?$/.test(p),live=/^\/live\/?$/.test(p);
if(!(mem&&L.getItem("mpd_m"))&&!(live&&L.getItem("mpd_app_seen")))  {try{if(live)L.setItem("mpd_app_seen","1")}catch(e){}return}
if(/FBAN|FBAV|Instagram/.test(ua))return; /* in-app browsers cannot add to the Home Screen */
var dp=null;window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e});
function show(){var b=document.createElement("div");b.id="a2hs";
b.style.cssText="position:fixed;left:8px;right:8px;bottom:8px;z-index:40;background:#0c1a24;color:#fff;border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:10px;font:600 13.5px/1.35 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.3)";
var t=document.createElement("div");t.style.cssText="flex:1;min-width:0";
t.innerHTML='<b style="color:#f4d35e">Get the app.</b> '+(ios?'Tap the Share button, then "Add to Home Screen".':'Tap the menu (three dots), then "Add to Home screen".');
var go=null;if(and){go=document.createElement("button");go.textContent="Add";go.style.cssText="background:#f4d35e;color:#0c1a24;border:0;border-radius:8px;padding:8px 12px;font:800 13px inherit;cursor:pointer;display:none";
 go.onclick=function(){if(dp){dp.prompt();dp=null}done()};setTimeout(function(){if(dp)go.style.display=""},1500)}
var x=document.createElement("button");x.setAttribute("aria-label","Close");x.textContent="×";x.style.cssText="background:none;border:0;color:#9fb0bd;font-size:22px;line-height:1;padding:2px 6px;cursor:pointer";
function done(){try{L.setItem("mpd_a2hs","1")}catch(e){}b.remove()}x.onclick=done;
b.appendChild(t);if(go)b.appendChild(go);b.appendChild(x);document.body.appendChild(b);
try{if(typeof mpdLog==="function")mpdLog("a2hs_shown",mem?"members":"live")}catch(e){}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(show,2500)});else setTimeout(show,2500);
window.addEventListener("appinstalled",function(){try{L.setItem("mpd_a2hs","1")}catch(e){}});
}catch(e){}})();
