(function(){
  var btn = document.getElementById('menuToggle');
  var panel = document.getElementById('mobilePanel');
  if(!btn||!panel) return;
  function setOpen(open){
    panel.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  btn.addEventListener('click', function(){ setOpen(!panel.classList.contains('open')); });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && panel.classList.contains('open')){
      setOpen(false);
      btn.focus();
    }
  });
})();

// Repère de section : met en valeur, dans le menu, la section visible (accueil uniquement)
(function(){
  var links = [].slice.call(document.querySelectorAll('nav.links a.nav-link[href^="#"]'));
  if(!links.length || !('IntersectionObserver' in window)) return;
  var items = [];
  links.forEach(function(link){
    var section = document.getElementById(link.getAttribute('href').slice(1));
    if(section) items.push({link: link, section: section});
  });
  if(!items.length) return;
  function setCurrent(link){
    items.forEach(function(it){
      if(it.link === link) it.link.setAttribute('aria-current', 'location');
      else it.link.removeAttribute('aria-current');
    });
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        items.forEach(function(it){ if(it.section === entry.target) setCurrent(it.link); });
      }
    });
  }, {rootMargin: '-40% 0px -55% 0px'});
  items.forEach(function(it){ observer.observe(it.section); });
  var hero = document.querySelector('.hero');
  if(hero) new IntersectionObserver(function(e){ if(e[0].isIntersecting) setCurrent(null); }, {rootMargin: '-40% 0px -55% 0px'}).observe(hero);
})();
