(function(){
  var btn = document.getElementById('menuToggle');
  var panel = document.getElementById('mobilePanel');
  if(!btn||!panel) return;
  btn.addEventListener('click', function(){
    var isOpen = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && panel.classList.contains('open')){
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
})();
