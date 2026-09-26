(function(){
  var form = document.getElementById('demoForm');
  if(!form) return;
  var status = document.getElementById('demoStatus');
  var number = form.getAttribute('data-wa');

  function clean(v, max){ return (v || '').replace(/\s+/g, ' ').trim().slice(0, max); }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var d = new FormData(form);
    var school = clean(d.get('ecole'), 100);
    var city = clean(d.get('ville'), 60);
    var size = clean(d.get('effectif'), 40);
    var name = clean(d.get('nom'), 80);
    var pref = clean(d.get('contact'), 40);
    var levels = d.getAll('niveau').map(function(v){ return clean(v, 30); }).filter(Boolean);

    var lines = ['Bonjour, je souhaite une démonstration de Scolo pour mon école.', ''];
    lines.push('École : ' + school);
    lines.push('Ville : ' + city);
    if(size) lines.push('Effectif : ' + size);
    if(levels.length) lines.push('Niveaux : ' + levels.join(', '));
    if(name) lines.push('Contact : ' + name);
    if(pref) lines.push('Préférence : ' + pref);

    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('data-no-track', '1');
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

    if(status){
      status.textContent = '';
      status.appendChild(document.createTextNode('WhatsApp devrait s\u2019ouvrir avec votre message, prêt à envoyer. Sinon, '));
      var link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener';
      link.textContent = 'touchez ici';
      status.appendChild(link);
      status.appendChild(document.createTextNode('.'));
    }
  });
})();
