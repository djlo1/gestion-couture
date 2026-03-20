"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, Users, Ruler, Scissors, Search, ChevronRight, 
  Phone, UserPlus, X, CreditCard, Calendar, Camera 
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
  
  // Formulaires
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');

  useEffect(() => { fetchClients(); }, []);

  async function fetchClients() {
    setLoading(true);
    const { data, error } = await supabase.from('clients').select('*').order('nom');
    if (error) console.error(error);
    setClients(data || []);
    setLoading(false);
  }

  async function handleAddClient(e) {
    e.preventDefault();
    if (!nom) return;
    const { error } = await supabase.from('clients').insert([{ nom, telephone: tel }]);
    if (error) {
        alert("Erreur Supabase : " + error.message);
    } else {
        setNom(''); setTel(''); setShowAddForm(false);
        fetchClients();
    }
  }

  // --- RENDU DES VUES ---

  const renderClients = () => (
    <div>
      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>Mes Clients ({clients.length})</h2>
        <button onClick={() => setShowAddForm(true)} style={s.addButton}>
          <UserPlus size={20} color="white" />
        </button>
      </div>

      {loading ? <div style={s.loading}>Connexion à la base...</div> : (
        clients.map(client => (
          <div key={client.id} style={s.clientCard} onClick={() => {setSelectedClient(client); setActiveTab('details')}}>
            <div style={s.clientAvatar}>{client.nom[0]}</div>
            <div style={{flex: 1}}>
              <div style={s.clientName}>{client.nom}</div>
              <div style={s.clientTel}><Phone size={12} /> {client.telephone || 'Aucun numéro'}</div>
            </div>
            <ChevronRight size={20} color="#ccc" />
          </div>
        ))
      )}
    </div>
  );

  const renderDetails = () => (
    <div>
      <button onClick={() => setActiveTab('clients')} style={s.backBtn}>← Retour</button>
      <div style={s.profileHeader}>
        <div style={s.bigAvatar}>{selectedClient?.nom[0]}</div>
        <h2 style={{margin: '10px 0 5px 0'}}>{selectedClient?.nom}</h2>
        <p style={{color: '#666'}}>{selectedClient?.telephone}</p>
      </div>

      <div style={s.gridMenu}>
        <div style={s.menuItem}><Ruler /> <span>Mesures</span></div>
        <div style={s.menuItem}><Scissors /> <span>Commandes</span></div>
        <div style={s.menuItem}><CreditCard /> <span>Paiements</span></div>
        <div style={s.menuItem}><Camera /> <span>Photos</span></div>
      </div>
    </div>
  );

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.headerTitle}>Vif 🧵</h1>
        <div style={s.searchBar}>
          <Search size={18} style={{marginRight: 8, opacity: 0.6}} />
          <input placeholder="Rechercher..." style={s.searchInput} />
        </div>
      </div>

      <div style={s.content}>
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'details' && renderDetails()}
        {['mesures', 'travaux'].includes(activeTab) && (
            <div style={s.emptyState}>Module {activeTab} en cours d'activation...</div>
        )}
      </div>

      {showAddForm && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3>Ajouter un client</h3>
              <X onClick={() => setShowAddForm(false)} />
            </div>
            <form onSubmit={handleAddClient} style={s.form}>
              <input placeholder="Nom complet" style={s.input} value={nom} onChange={e => setNom(e.target.value)} />
              <input placeholder="Téléphone" style={s.input} value={tel} onChange={e => setTel(e.target.value)} />
              <button type="submit" style={s.submitButton}>Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      <nav style={s.nav}>
        <button onClick={() => setActiveTab('clients')} style={activeTab === 'clients' ? s.navItemActive : s.navItem}>
          <Users size={24} /><span style={s.navText}>Clients</span>
        </button>
        <button onClick={() => setActiveTab('mesures')} style={activeTab === 'mesures' ? s.navItemActive : s.navItem}>
          <Ruler size={24} /><span style={s.navText}>Agenda</span>
        </button>
        <button onClick={() => setActiveTab('travaux')} style={activeTab === 'travaux' ? s.navItemActive : s.navItem}>
          <Scissors size={24} /><span style={s.navText}>Atelier</span>
        </button>
      </nav>
    </div>
  );
}

const s = {
  container: { maxWidth: '500px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', paddingBottom: '100px' },
  header: { backgroundColor: '#2563eb', padding: '25px 20px', borderRadius: '0 0 30px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  headerTitle: { color: 'white', margin: 0, fontSize: '28px', fontWeight: 'bold', letterSpacing: '-1px' },
  searchBar: { backgroundColor: 'white', borderRadius: '15px', padding: '10px 15px', display: 'flex', alignItems: 'center', marginTop: '15px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  content: { padding: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 },
  addButton: { backgroundColor: '#2563eb', border: 'none', width: '45px', height: '45px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  clientCard: { backgroundColor: 'white', padding: '15px', borderRadius: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #eee', cursor: 'pointer' },
  clientAvatar: { width: '45px', height: '45px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 'bold' },
  clientName: { fontWeight: 'bold', color: '#1f2937' },
  clientTel: { color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' },
  nav: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', backgroundColor: 'white', height: '75px', borderRadius: '25px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  navItem: { border: 'none', background: 'none', color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  navItemActive: { border: 'none', background: 'none', color: '#2563eb', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  navText: { fontSize: '10px', fontWeight: 'bold', marginTop: '4px' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zInterval: 100 },
  modal: { backgroundColor: 'white', width: '100%', borderRadius: '30px', padding: '25px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #eee', backgroundColor: '#f9fafb', fontSize: '16px' },
  submitButton: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '18px', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px' },
  backBtn: { border: 'none', background: 'none', color: '#2563eb', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' },
  profileHeader: { textAlign: 'center', marginBottom: '30px' },
  bigAvatar: { width: '80px', height: '80px', backgroundColor: '#2563eb', color: 'white', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto', fontWeight: 'bold' },
  gridMenu: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  menuItem: { backgroundColor: 'white', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', border: '1px solid #eee', color: '#444', fontWeight: '500' },
  loading: { textAlign: 'center', padding: '50px', color: '#666' },
  emptyState: { textAlign: 'center', padding: '100px 20px', color: '#999' }
};
