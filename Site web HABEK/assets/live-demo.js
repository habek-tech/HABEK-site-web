// Charge la démonstration interactive (iframe) uniquement au clic, pour économiser les données mobiles.
(function(){
  var box = document.getElementById('liveDemo');
  var btn = document.getElementById('launchDemo');
  if(!box || !btn) return;
  btn.addEventListener('click', function(e){
    e.preventDefault();
    var frame = document.createElement('iframe');
    frame.src = btn.getAttribute('href');
    frame.title = 'Démonstration interactive de Scolo (données fictives)';
    frame.className = 'live-demo-frame';
    frame.setAttribute('referrerpolicy', 'no-referrer');
    var note = document.createElement('p');
    note.className = 'live-demo-note';
    note.appendChild(document.createTextNode('Données fictives. '));
    var full = document.createElement('a');
    full.href = btn.getAttribute('href');
    full.target = '_blank';
    full.rel = 'noopener';
    full.setAttribute('data-track', 'demo_fullscreen');
    full.textContent = 'Ouvrir en plein écran →';
    note.appendChild(full);
    box.textContent = '';
    box.className = 'live-demo live-demo-open';
    box.appendChild(frame);
    box.appendChild(note);
    frame.focus();
  });
})();
