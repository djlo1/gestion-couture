"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Users, Ruler, Scissors, Search, ChevronRight, 
  Phone, UserPlus, X, CreditCard, Calendar, Camera, Save, ArrowLeft
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function VifApp() {
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // États Formulaires
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [mesures, setMesures] = useState({});
  const [commande, setCommande] = useState({ habit: '', tissu: '', prix: '', avance: '' });

  useEffect(() => { fetchClients(); }, []);

  async function fetchClients() {
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').order('nom');
    setClients(data || []);
    setLoading(false);
  }

  async function handleAddClient(e) {
    e.preventDefault();
    const { error } = await supabase.from('clients').insert([{ nom, telephone: tel }]);
    if (!error) { setNom(''); setTel(''); setShowAddForm(false); fetchClients(); }
  }

  async function loadClientData(client) {
    setSelectedClient(client);
    const { data: m } = await supabase.from('mesures').select('*').eq('client_id', client.id).single();
    setMesures(m || {});
    setActiveTab('details');
  }

  async function saveMesures() {
    const { error } = await supabase.from('mesures').upsert({ 
        client_id: selectedClient.id, 
        ...mesures 
    }, { onConflict: 'client_id' });
    if (!error) alert("Mesures enregistrées !");
  }

  // --- COMPOSANTS DE VUE ---

  const renderClients = () => (
    <div className="fade-in">
      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>Mes Clients ({clients.length})</h2>
        <button onClick={() => setShowAddForm(true)} style={s.addButton}><UserPlus size={20} color="white" /></button>
      </div>
      <div style={s.searchBar}>
        <Search size={18} style={{marginRight: 8, opacity: 0.4}} />
        <input placeholder="Rechercher..." style={s.searchInput} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      <div style={{marginTop: '20px'}}>
        {clients.filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
          <div key={client.id} style={s.clientCard} onClick={() => loadClientData(client)}>
            <div style={s.clientAvatar}>{client.nom[0]}</div>
            <div style={{flex: 1}}>
              <div style={s.clientName}>{client.nom}</div>
              <div style={s.clientTel}>{client.telephone}</div>
            </div>
            <ChevronRight size={18} color="#ccc" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="fade-in">
      <button onClick={() => setActiveTab('clients')} style={s.backBtn}><ArrowLeft size={18}/> Retour</button>
      <div style={s.profileHeader}>
        <div style={s.bigAvatar}>{selectedClient?.nom[0]}</div>
        <h2 style={{margin: '10px 0 5px 0'}}>{selectedClient?.nom}</h2>
        <p style={{color: '#666', fontSize: '14px'}}>{selectedClient?.telephone}</p>
      </div>

      <div style={s.tabsRow}>
        <button onClick={() => setActiveTab('details')} style={activeTab === 'details' ? s.tabActive : s.tab}>Mesures</button>
        <button onClick={() => setActiveTab('commandes_client')} style={activeTab === 'commandes_client' ? s.tabActive : s.tab}>Commandes</button>
      </div>

      {activeTab === 'details' && (
        <div style={s.mesuresGrid}>
          {['epaule', 'poitrine', 'taille', 'hanche', 'longueur_haut', 'longueur_bas', 'manche', 'cou'].map(field => (
            <div key={field} style={s.inputGroup}>
              <label style={s.label}>{field.replace('_', ' ')} (cm)</label>
              <input 
                type="number" 
                style={s.inputMesure} 
                value={mesures[field] || ''} 
                onChange={e => setMesures({...mesures, [field]: e.target.value})}
              />
            </div>
          ))}
          <button onClick={saveMesures} style={s.saveBtn}><Save size={18}/> Enregistrer les mesures</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.headerTitle}>Vif 🧵</h1>
      </div>

      <div style={s.content}>
        {activeTab === 'clients' && renderClients()}
        {(activeTab === 'details' || activeTab === 'commandes_client') && renderDetails()}
      </div>

      {showAddForm && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}><h3>Nouveau Client</h3><X onClick={() => setShowAddForm(false)} /></div>
            <form onSubmit={handleAddClient} style={s.form}>
              <input placeholder="Nom" style={s.input} value={nom} onChange={e => setNom(e.target.value)} required />
              <input placeholder="Téléphone" style={s.input} value={tel} onChange={e => setTel(e.target.value)} />
              <button type="submit" style={s.submitButton}>Ajouter</button>
            </form>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setActiveTab('clients')} style={activeTab === 'clients' ? s.navItemActive : s.navItem}><Users /><span style={s.navT}>Clients</span></button>
        <button style={s.navItem}><Calendar /><span style={s.navT}>Agenda</span></button>
        <button style={s.navItem}><Scissors /><span style={s.navT}>Atelier</span></button>
      </nav>
    </div>
  );
}

const s = {
  container: { maxWidth: '500px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fcfcfc', paddingBottom: '100px', fontFamily: 'system-ui' },
  header: { backgroundColor: '#2563eb', padding: '20px', borderRadius: '0 0 25px 25px', color: 'white' },
  headerTitle: { margin: 0, fontSize: '24px', fontWeight: '800' },
  content: { padding: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold' },
  searchBar: { backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '10px 15px', display: 'flex', alignItems: 'center' },
  searchInput: { border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  addButton: { backgroundColor: '#2563eb', border: 'none', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer' },
  clientCard: { backgroundColor: 'white', padding: '12px', borderRadius: '16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  clientAvatar: { width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' },
  clientName: { fontWeight: 'bold', fontSize: '15px' },
  clientTel: { color: '#64748b', fontSize: '12px' },
  nav: { position: 'fixed', bottom: '15px', left: '15px', right: '15px', backgroundColor: 'white', height: '70px', borderRadius: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' },
  navItem: { border: 'none', background: 'none', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  navItemActive: { border: 'none', background: 'none', color: '#2563eb', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  navT: { fontSize: '10px', fontWeight: '600', marginTop: '4px' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 },
  modal: { backgroundColor: 'white', width: '100%', borderRadius: '24px', padding: '20px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px' },
  submitButton: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' },
  backBtn: { border: 'none', background: 'none', color: '#2563eb', fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' },
  profileHeader: { textAlign: 'center', marginBottom: '20px' },
  bigAvatar: { width: '70px', height: '70px', backgroundColor: '#2563eb', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto', fontWeight: 'bold' },
  tabsRow: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9' },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#94a3b8', fontWeight: '600' },
  tabActive: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#2563eb', borderBottom: '2px solid #2563eb', fontWeight: '600' },
  mesuresGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },
  inputMesure: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '16px', textAlign: 'center' },
  saveBtn: { gridColumn: 'span 2', backgroundColor: '#059669', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};
