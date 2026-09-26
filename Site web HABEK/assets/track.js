// Évènements de contact envoyés à Vercel Analytics (sans cookie, sans donnée personnelle).
// Si l'outil n'est pas activé sur le projet Vercel, ces appels sont sans effet.
(function(){
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  function send(name){ try { window.va('event', {name: name}); } catch(e) {} }
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a') : null;
    if(!a || a.hasAttribute('data-no-track')) return;
    var custom = a.getAttribute('data-track');
    if(custom){ send(custom); return; }
    var href = a.getAttribute('href') || '';
    if(/^https:\/\/wa\.me\//.test(href)) send('whatsapp_click');
    else if(href.indexOf('tel:') === 0) send('call_click');
    else if(href.indexOf('mailto:') === 0) send('email_click');
    else if(/\.pdf(\?|$)/.test(href)) send('brochure_download');
    else if(href.indexOf('scolo.habek.cc') > -1) send('scolo_app_click');
  });
  document.addEventListener('submit', function(e){
    if(e.target && e.target.id === 'demoForm') send('demo_request');
  });
})();
