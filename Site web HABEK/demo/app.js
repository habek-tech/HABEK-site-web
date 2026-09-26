function scoloApp() {
  const TODAY = new Date('2026-09-14T00:00:00');

  return {
    topView: 'dashboard',
    ficheStudent: null,
    networkOnline: true,
    isSubmitting: false,
    toasts: [], nextToastId: 1, nextReceiptNumber: 4623,
    newOperateur: '',

    activeSub: { paiements: 'enregistrer', echeanciers: 'impayes', relances: 'j', parametres: 'modes' },

    navSections: [
      { id: 'dashboard', label: 'Tableau de bord', shortLabel: 'Bord', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V10M11 19V5M18 19v-7"/></svg>' },
      { id: 'eleves', label: 'Élèves', shortLabel: 'Élèves', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>' },
      { id: 'paiements', label: 'Paiements', shortLabel: 'Paiem.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
        subs: [{id:'enregistrer', label:'Enregistrer un paiement'}, {id:'historique', label:'Historique'}] },
      { id: 'echeanciers', label: 'Échéanciers', shortLabel: 'Éch.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M9 4v16"/></svg>',
        subs: [{id:'impayes', label:'Impayés'}, {id:'avenir', label:'À venir'}, {id:'toutes', label:'Toutes'}] },
      { id: 'relances', label: 'Relances', shortLabel: 'Rel.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1114.5 4.6L20 20l-3.6-1.2A8 8 0 014 12z"/></svg>',
        subs: [{id:'j7', label:'J-7'}, {id:'j3', label:'J-3'}, {id:'j', label:'J'}, {id:'modeles', label:'Modèles de messages'}, {id:'historique', label:'Historique'}] },
      { id: 'parametres', label: 'Paramètres', shortLabel: 'Param.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>',
        subs: [{id:'modes', label:'Modes de paiement'}, {id:'operateurs', label:'Opérateurs Mobile Money'}, {id:'modeles', label:'Modèles de messages'}, {id:'config', label:'Configuration des échéances'}] },
    ],

    kpis: { tauxGlobal: 78.5, totalEncaisseMois: 12450000, relancesEnvoyees: 146 },
    classRates: [
      { name: '6ème A', rate: 88 }, { name: '6ème B', rate: 72 }, { name: '5ème A', rate: 81 },
      { name: '5ème B', rate: 65 }, { name: '4ème A', rate: 90 }, { name: 'Terminale C', rate: 58 },
    ],

    modesPaiement: [
      { id: 'Espèces', label: 'Espèces', actif: true },
      { id: 'Mobile Money', label: 'Mobile Money', actif: true },
      { id: 'Chèque', label: 'Chèque', actif: true },
      { id: 'Virement bancaire', label: 'Virement bancaire', actif: true },
    ],
    operateursMM: [
      { id: 'om', label: 'Orange Money', actif: true },
      { id: 'moov', label: 'Moov Money', actif: true },
      { id: 'wave', label: 'Wave', actif: true },
      { id: 'wizall', label: 'Telecel/Wizall', actif: false },
    ],

    messageTemplates: {
      j7: { canal: 'WhatsApp', texte: "Bonjour,\nNous vous informons que le prochain paiement de scolarité de votre enfant [Nom élève], inscrit en [Classe], arrive à échéance le [Échéance].\nMontant restant à payer : [Montant dû] FCFA.\nMerci de procéder au règlement avant cette date." },
      j3: { canal: 'WhatsApp', texte: "Bonjour,\nL'échéance de [Nom élève] ([Classe]) approche : le [Échéance], soit dans 3 jours.\nMontant restant dû : [Montant dû] FCFA.\nMerci de régulariser rapidement." },
      j:  { canal: 'SMS', texte: "Scolo — L'échéance de [Nom élève] ([Classe]) datée du [Échéance] n'a pas été réglée. Solde dû : [Montant dû] FCFA. Merci de contacter le secrétariat." },
    },

    echeanceConfig: { nbTranches: 3, relancesActives: { 'J-7': true, 'J-3': true, 'J': true } },

    relanceHistorique: [
      { id: 1, student: 'Boureima Sawadogo', stage: 'J', canal: 'SMS', date: '2026-09-12', statut: 'Livré' },
      { id: 2, student: 'Issa Compaoré', stage: 'J', canal: 'WhatsApp', date: '2026-09-11', statut: 'Lu' },
      { id: 3, student: 'Salimata Yaméogo', stage: 'J', canal: 'WhatsApp', date: '2026-09-10', statut: 'Échec' },
      { id: 4, student: 'Ramata Nikiéma', stage: 'J', canal: 'SMS', date: '2026-09-09', statut: 'Livré' },
      { id: 5, student: 'Fatimata Kaboré', stage: 'J-7', canal: 'WhatsApp', date: '2026-09-14', statut: 'Envoyé' },
    ],

    students: [
      { id: 1, matricule: 'DEM-2026-0031', firstName: 'Aïcha', lastName: 'Ouédraogo', class: '6ème A', birthDate: '2014-03-12',
        contract: { numero: 'CT-2026-0031', dateInscription: '2026-08-18', anneeScolaire: '2026-2027' },
        guardianName: 'Moussa Ouédraogo', guardianPhone: '+226 70 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 50000 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [
          { date: '2026-09-10', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Orange Money', numero: '+226 70 •• •• ••', reference: 'OM-77045' }, statut: 'Validé', number: 4512, hash: 'a3f9c1e7b2d84a06f1c2' },
          { date: '2026-10-08', amount: 50000, mode: 'Espèces', details: {}, statut: 'Validé', number: 4589, hash: '7be2091fa4c3d5e83a9b' },
        ], extraDocuments: [] },
      { id: 2, matricule: 'DEM-2026-0032', firstName: 'Boureima', lastName: 'Sawadogo', class: '6ème A', birthDate: '2014-07-02',
        contract: { numero: 'CT-2026-0032', dateInscription: '2026-08-19', anneeScolaire: '2026-2027' },
        guardianName: 'Ali Sawadogo', guardianPhone: '+226 76 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 10000 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-05', amount: 10000, mode: 'Espèces', details: {}, statut: 'Validé', number: 4498, hash: '2d81fbc9034e7a12c6d0' }], extraDocuments: [] },
      { id: 3, matricule: 'DEM-2026-0058', firstName: 'Fatimata', lastName: 'Kaboré', class: '6ème B', birthDate: '2014-01-22',
        contract: { numero: 'CT-2026-0058', dateInscription: '2026-08-20', anneeScolaire: '2026-2027' },
        guardianName: 'Salif Kaboré', guardianPhone: '+226 65 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-09-20', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-11', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Moov Money', numero: '+226 65 •• •• ••', reference: 'MM-56201' }, statut: 'Validé', number: 4520, hash: 'f10a2c5e9b7d3164a8e2' }], extraDocuments: [] },
      { id: 4, matricule: 'DEM-2026-0059', firstName: 'Issa', lastName: 'Compaoré', class: '6ème B', birthDate: '2014-11-05',
        contract: { numero: 'CT-2026-0059', dateInscription: '2026-08-21', anneeScolaire: '2026-2027' },
        guardianName: 'Rasmata Compaoré', guardianPhone: '+226 71 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 0 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-08', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Orange Money', numero: '+226 71 •• •• ••', reference: 'OM-77301' }, statut: 'Échec', number: null, hash: '' }], extraDocuments: [] },
      { id: 5, matricule: 'DEM-2026-0071', firstName: 'Awa', lastName: 'Traoré', class: '5ème A', birthDate: '2013-05-30',
        contract: { numero: 'CT-2026-0071', dateInscription: '2026-08-19', anneeScolaire: '2026-2027' },
        guardianName: 'Idrissa Traoré', guardianPhone: '+226 78 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 20000 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [
          { date: '2026-09-09', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Wave', numero: '+226 78 •• •• ••', reference: 'WV-88055' }, statut: 'Validé', number: 4505, hash: '91bd0e6a2f7c4318d5b9' },
          { date: '2026-10-14', amount: 20000, mode: 'Mobile Money', details: { operateur: 'Wave', numero: '+226 78 •• •• ••', reference: 'WV-88213' }, statut: 'Validé', number: 4612, hash: '6a2e4d81c9f03b57e1a4' },
        ], extraDocuments: [{ type: 'Justificatif', label: 'Justificatif de réduction — fratrie', date: '2026-08-19' }] },
      { id: 6, matricule: 'DEM-2026-0072', firstName: 'Ibrahim', lastName: 'Zongo', class: '5ème A', birthDate: '2013-09-14',
        contract: { numero: 'CT-2026-0072', dateInscription: '2026-08-20', anneeScolaire: '2026-2027' },
        guardianName: 'Clarisse Zongo', guardianPhone: '+226 66 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-09-16', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-12', amount: 25000, mode: 'Espèces', details: {}, statut: 'Validé', number: 4530, hash: 'c47e1a03d8b2f96e5c71' }], extraDocuments: [] },
      { id: 7, matricule: 'DEM-2026-0090', firstName: 'Ramata', lastName: 'Nikiéma', class: '5ème B', birthDate: '2013-02-08',
        contract: { numero: 'CT-2026-0090', dateInscription: '2026-08-21', anneeScolaire: '2026-2027' },
        guardianName: 'Boukary Nikiéma', guardianPhone: '+226 72 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 15000 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-06', amount: 15000, mode: 'Chèque', details: { numeroCheque: '0451236', banque: 'Coris Bank', dateEmission: '2026-09-05' }, statut: 'Validé', number: 4499, hash: 'e02c9b4f61a7d38052c9' }], extraDocuments: [] },
      { id: 8, matricule: 'DEM-2026-0091', firstName: 'Souleymane', lastName: 'Bamba', class: '5ème B', birthDate: '2013-12-19',
        contract: { numero: 'CT-2026-0091', dateInscription: '2026-08-22', anneeScolaire: '2026-2027' },
        guardianName: 'Habiba Bamba', guardianPhone: '+226 77 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 0 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-13', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Moov Money', numero: '+226 77 •• •• ••', reference: 'MM-56890' }, statut: 'En cours', number: null, hash: '' }], extraDocuments: [] },
      { id: 9, matricule: 'DEM-2026-0110', firstName: 'Mariam', lastName: 'Diallo', class: '4ème A', birthDate: '2012-04-27',
        contract: { numero: 'CT-2026-0110', dateInscription: '2026-08-18', anneeScolaire: '2026-2027' },
        guardianName: 'Ousmane Diallo', guardianPhone: '+226 70 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-09-15', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-10', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Moov Money', numero: '+226 70 •• •• ••', reference: 'MM-56342' }, statut: 'Validé', number: 4515, hash: 'b6d391a04f8e2c75d1a3' }], extraDocuments: [] },
      { id: 10, matricule: 'DEM-2026-0111', firstName: 'Adama', lastName: 'Kondé', class: '4ème A', birthDate: '2012-08-11',
        contract: { numero: 'CT-2026-0111', dateInscription: '2026-08-19', anneeScolaire: '2026-2027' },
        guardianName: 'Fatou Kondé', guardianPhone: '+226 76 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 25000 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [
          { date: '2026-09-11', amount: 25000, mode: 'Espèces', details: {}, statut: 'Validé', number: 4519, hash: 'd82a4f01c9e73b56a0f2' },
          { date: '2026-10-15', amount: 25000, mode: 'Virement bancaire', details: { banque: 'UBA Burkina', reference: 'VIR-33021', date: '2026-10-15', compteEmetteur: 'BF12-XXXX-9981' }, statut: 'Validé', number: 4618, hash: '19f6c3a08e5d2b7401ac' },
        ], extraDocuments: [] },
      { id: 11, matricule: 'DEM-2026-0140', firstName: 'Salimata', lastName: 'Yaméogo', class: 'Terminale C', birthDate: '2008-06-16',
        contract: { numero: 'CT-2026-0140', dateInscription: '2026-08-20', anneeScolaire: '2026-2027' },
        guardianName: 'Yacouba Yaméogo', guardianPhone: '+226 64 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 5000 },
          { label: 'Tranche 1', dueDate: '2026-10-15', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-07', amount: 5000, mode: 'Espèces', details: {}, statut: 'Validé', number: 4501, hash: '4bc0e8a1d5f2937c6b1e' }], extraDocuments: [] },
      { id: 12, matricule: 'DEM-2026-0141', firstName: 'Bakary', lastName: 'Ouattara', class: 'Terminale C', birthDate: '2008-01-03',
        contract: { numero: 'CT-2026-0141', dateInscription: '2026-08-21', anneeScolaire: '2026-2027' },
        guardianName: 'Aminata Ouattara', guardianPhone: '+226 79 •• •• ••',
        installments: [
          { label: "Frais d'inscription", dueDate: '2026-09-01', amount: 25000, paid: 25000 },
          { label: 'Tranche 1', dueDate: '2026-10-20', amount: 50000, paid: 0 },
          { label: 'Tranche 2', dueDate: '2027-01-15', amount: 50000, paid: 0 },
        ],
        payments: [{ date: '2026-09-12', amount: 25000, mode: 'Mobile Money', details: { operateur: 'Wave', numero: '+226 79 •• •• ••', reference: 'WV-88150' }, statut: 'Validé', number: 4522, hash: '87d2a0c4e9f1b53602ad' }], extraDocuments: [] },
    ],

    baseSearch: '', echSearch: '',
    paiementSearch: '', paiementStudent: null,
    encaissementForm: { mode: 'Espèces', montant: null, details: {} },
    showReceiptModal: false, currentReceipt: null,

    goTo(id) { this.topView = id; if (id !== 'eleves') this.ficheStudent = null; },
    currentSubs() { const s = this.navSections.find(n => n.id === this.topView); return (s && s.subs) ? s.subs : []; },
    currentSectionLabel() {
      const s = this.navSections.find(n => n.id === this.topView);
      if (!s) return '';
      if (s.subs) { const sub = s.subs.find(x => x.id === this.activeSub[s.id]); return s.label + (sub ? ' — ' + sub.label : ''); }
      return s.label;
    },

    formatCfa(n) { return (n || 0).toLocaleString('fr-FR') + ' FCFA'; },
    formatDate(d) { if (!d) return '—'; const p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; },
    daysUntil(dateStr) { return Math.round((new Date(dateStr + 'T00:00:00') - TODAY) / 86400000); },
    daysLate(s) { const n = this.nextUnpaid(s); return n ? Math.max(0, -this.daysUntil(n.inst.dueDate)) : 0; },

    studentTotalDue(s) { return s.installments.reduce((a, i) => a + i.amount, 0); },
    studentTotalPaid(s) { return s.installments.reduce((a, i) => a + i.paid, 0); },
    studentBalance(s) { return this.studentTotalDue(s) - this.studentTotalPaid(s); },
    nextUnpaid(s) { const idx = s.installments.findIndex(i => i.paid < i.amount); return idx === -1 ? null : { inst: s.installments[idx], idx }; },

    studentStatus(s) {
      const n = this.nextUnpaid(s);
      if (!n) return '🟢';
      const d = this.daysUntil(n.inst.dueDate);
      if (d < 0) return '🔴';
      if (d <= 7) return '🟠';
      return '🟢';
    },
    statusLabel(icon) { return icon === '🟢' ? '🟢 À jour' : icon === '🟠' ? '🟠 Échéance proche' : '🔴 Impayé'; },
    statusClasses(icon) {
      if (icon === '🟢') return 'bg-success/10 text-success';
      if (icon === '🟠') return 'bg-scolo-gold text-scolo-navy';
      return 'bg-danger/10 text-danger';
    },
    studentsByStatus(icon) { return this.students.filter(s => this.studentStatus(s) === icon).sort((a,b) => this.daysLate(b) - this.daysLate(a)); },
    totalImpayes() { return this.students.reduce((a, s) => a + (this.studentStatus(s) === '🔴' ? this.studentBalance(s) : 0), 0); },

    installmentIcon(s, idx) {
      const i = s.installments[idx];
      if (i.paid >= i.amount) return '✅';
      const nextIdx = s.installments.findIndex(x => x.paid < x.amount);
      return idx === nextIdx ? '⏳' : '🔒';
    },

    relanceStage(s) {
      const n = this.nextUnpaid(s);
      if (!n) return null;
      const d = this.daysUntil(n.inst.dueDate);
      if (d < 0) return 'j';
      if (d <= 3) return 'j3';
      if (d <= 7) return 'j7';
      return null;
    },
    relancesForStage(sub) { return this.students.filter(s => this.relanceStage(s) === sub); },
    stageLabel(sub) { return sub === 'j7' ? 'J-7' : sub === 'j3' ? 'J-3' : 'J'; },
    relanceStepLabel(s, stageDisplay) {
      const current = this.relanceStage(s);
      const currentDisplay = current ? this.stageLabel(current) : null;
      const order = { 'J-7': 0, 'J-3': 1, 'J': 2 };
      if (!current) return this.nextUnpaid(s) ? 'Non nécessaire' : '—';
      if (order[stageDisplay] < order[currentDisplay]) return 'Envoyée';
      if (order[stageDisplay] === order[currentDisplay]) return 'Envoyée';
      return 'Programmée';
    },

    modeLabel(p) { return p.mode === 'Mobile Money' ? p.details.operateur : p.mode; },
    modeReference(p) { return p.details.reference || p.details.numeroCheque || null; },
    paymentStatutClasses(st) {
      if (st === 'Validé') return 'bg-success/10 text-success';
      if (st === 'En cours') return 'bg-scolo-gold text-scolo-navy';
      return 'bg-danger/10 text-danger';
    },
    relanceStatusClasses(s) {
      if (s === 'Lu') return 'bg-success/10 text-success';
      if (s === 'Livré') return 'bg-info/10 text-info';
      if (s === 'Envoyé') return 'bg-scolo-navy/10 text-scolo-navy';
      return 'bg-danger/10 text-danger';
    },

    studentDocuments(s) {
      const fromPayments = s.payments.filter(p => p.statut === 'Validé' && p.number).map(p => ({ type: 'Reçu', label: 'Reçu n°' + p.number, date: p.date }));
      return [...fromPayments, ...(s.extraDocuments || [])].sort((a,b) => b.date.localeCompare(a.date));
    },

    allPayments() {
      return this.students.flatMap(s => s.payments.map(p => ({ ...p, student: s.firstName + ' ' + s.lastName })))
        .sort((a,b) => b.date.localeCompare(a.date));
    },

    filteredForSearch(q) {
      const query = q.trim().toLowerCase();
      if (!query) return [];
      return this.students.filter(s => (s.firstName+' '+s.lastName).toLowerCase().includes(query) || s.matricule.toLowerCase().includes(query)).slice(0,6);
    },

    get filteredBase() {
      const q = this.baseSearch.trim().toLowerCase();
      if (!q) return this.students;
      return this.students.filter(s =>
        (s.firstName+' '+s.lastName).toLowerCase().includes(q) || s.matricule.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q) || s.guardianPhone.replace(/\s/g,'').includes(q.replace(/\s/g,'')));
    },

    echeanciersTitle() { const m={impayes:'Impayés',avenir:'Échéances à venir',toutes:'Toutes les échéances'}; return m[this.activeSub.echeanciers]; },
    echeanciersRows() {
      const q = this.echSearch.trim().toLowerCase();
      let rows = [];
      this.students.forEach(s => s.installments.forEach(inst => {
        if (inst.paid >= inst.amount) return;
        rows.push({ student: s, inst });
      }));
      if (this.activeSub.echeanciers === 'impayes') rows = rows.filter(r => this.daysUntil(r.inst.dueDate) < 0);
      if (this.activeSub.echeanciers === 'avenir') rows = rows.filter(r => this.daysUntil(r.inst.dueDate) >= 0);
      if (q) rows = rows.filter(r => (r.student.firstName+' '+r.student.lastName).toLowerCase().includes(q) || r.student.matricule.toLowerCase().includes(q));
      return rows.sort((a,b) => a.inst.dueDate.localeCompare(b.inst.dueDate));
    },

    renderTemplate(text, s) {
      if (!s) return text;
      const n = this.nextUnpaid(s);
      return text
        .split('[Nom élève]').join(s.firstName + ' ' + s.lastName)
        .split('[Classe]').join(s.class)
        .split('[Montant dû]').join(n ? (n.inst.amount - n.inst.paid).toLocaleString('fr-FR') : '0')
        .split('[Échéance]').join(n ? this.formatDate(n.inst.dueDate) : '—')
        .split('[Type de paiement]').join(n ? n.inst.label : '—')
        .split('[Numéro de facture/reçu]').join(s.payments.length ? String(s.payments[0].number || '—') : '—')
        .split('[Période concernée]').join(s.contract.anneeScolaire);
    },

    toggleNetwork() { this.networkOnline = !this.networkOnline; this.pushToast(this.networkOnline ? 'Réseau rétabli — synchronisation en cours' : 'Mode hors-ligne simulé — les encaissements resteront en local'); },
    pushToast(message) { const id = this.nextToastId++; this.toasts.push({ id, message }); setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 2800); },

    openFiche(s) { this.ficheStudent = s; this.topView = 'eleves'; window.scrollTo(0,0); },
    startPaymentFor(s) {
      this.paiementStudent = s; this.paiementSearch = '';
      this.encaissementForm = { mode: 'Espèces', montant: null, details: {} };
      this.activeSub.paiements = 'enregistrer';
      this.topView = 'paiements'; this.ficheStudent = null;
      window.scrollTo(0,0);
    },

    generateHash() { const chars = 'abcdef0123456789'; let h=''; for (let i=0;i<20;i++) h += chars[Math.floor(Math.random()*chars.length)]; return h; },

    validateEncaissement() {
      if (this.isSubmitting || !this.encaissementForm.montant || this.encaissementForm.montant <= 0) return;
      this.isSubmitting = true;
      setTimeout(() => {
        const s = this.paiementStudent;
        let remaining = this.encaissementForm.montant;
        for (const inst of s.installments) {
          if (remaining <= 0) break;
          const due = inst.amount - inst.paid;
          if (due <= 0) continue;
          const applied = Math.min(due, remaining);
          inst.paid += applied; remaining -= applied;
        }

        const receiptNumber = this.networkOnline ? this.nextReceiptNumber++ : null;
        const hash = this.generateHash();
        const details = { ...this.encaissementForm.details };
        s.payments.unshift({ date: new Date().toISOString().slice(0,10), amount: this.encaissementForm.montant, mode: this.encaissementForm.mode, details, statut: this.networkOnline ? 'Validé' : 'En cours', number: receiptNumber, hash });

        const detailsList = [];
        if (this.encaissementForm.mode === 'Mobile Money') { detailsList.push({label:'Numéro', value: details.numero||'—'}); detailsList.push({label:'Référence', value: details.reference||'—'}); }
        if (this.encaissementForm.mode === 'Chèque') { detailsList.push({label:'N° chèque', value: details.numeroCheque||'—'}); detailsList.push({label:'Banque', value: details.banque||'—'}); detailsList.push({label:"Date d'émission", value: this.formatDate(details.dateEmission)||'—'}); }
        if (this.encaissementForm.mode === 'Virement bancaire') { detailsList.push({label:'Banque', value: details.banque||'—'}); detailsList.push({label:'Référence', value: details.reference||'—'}); }

        this.currentReceipt = {
          number: receiptNumber, provisional: !this.networkOnline,
          studentName: s.firstName+' '+s.lastName, studentClass: s.class,
          amount: this.encaissementForm.montant,
          modeLabelDisplay: this.encaissementForm.mode === 'Mobile Money' ? details.operateur : this.encaissementForm.mode,
          detailsList, timestamp: new Date().toLocaleString('fr-FR'), hash,
        };
        this.showReceiptModal = true;
        this.isSubmitting = false;
        this.encaissementForm = { mode: 'Espèces', montant: null, details: {} };
        this.pushToast(this.networkOnline ? 'Encaissement confirmé et synchronisé' : 'Encaissement enregistré en local — en attente de synchronisation');
      }, 500);
    },

    addOperateur() {
      if (!this.newOperateur.trim()) return;
      this.operateursMM.push({ id: 'op'+Date.now(), label: this.newOperateur.trim(), actif: true });
      this.newOperateur = '';
      this.pushToast('Opérateur ajouté');
    },

    launchRelanceWave() {
      const count = this.relancesForStage(this.activeSub.relances).length;
      this.pushToast(count > 0 ? count + ' relance(s) WhatsApp envoyée(s)' : 'Aucun élève à ce stade actuellement');
    },
  };
}
