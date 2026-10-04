// Formulaire → message WhatsApp prérempli. Aucune donnée n'est envoyée ni stockée par le site.
// Le formulaire porte data-wa (numéro), data-intro (première ligne) ; chaque champ porte data-label (libellé dans le message).
(function(){
  var forms = document.querySelectorAll('form[data-wa]');
  function clean(v, max){ return (v || '').replace(/\s+/g, ' ').trim().slice(0, max); }

  [].forEach.call(forms, function(form){
    var status = form.querySelector('.form-status');
    var number = form.getAttribute('data-wa');
    var intro = form.getAttribute('data-intro') || 'Bonjour,';

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = new FormData(form);
      var lines = [intro, ''];
      var seen = {};
      [].forEach.call(form.querySelectorAll('[data-label]'), function(el){
        var name = el.getAttribute('name');
        if(!name || seen[name]) return;
        seen[name] = true;
        var values = d.getAll(name).map(function(v){ return clean(v, 100); }).filter(Boolean);
        if(values.length) lines.push(el.getAttribute('data-label') + ' : ' + values.join(', '));
      });

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
  });
})();
