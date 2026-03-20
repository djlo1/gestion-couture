"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Users, Ruler, Scissors, Search, ChevronRight, Phone, UserPlus, X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CoutureApp() {
  const [activeTab, setActiveTab] = useState('clients');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');

  useEffect(() => { fetchClients(); }, []);

  async function fetchClients() {
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').order('nom');
    setClients(data || []);
    setLoading(false);
  }

  async function handleAddClient(e) {
    e.preventDefault();
    if (!nom) return;
    const { error } = await supabase.from('clients').insert([{ nom, telephone: tel }]);
    if (!error) {
      setNom(''); setTel(''); setShowAddForm(false);
      fetchClients();
    }
  }

  return (
    <div style={s.container}>
      {/* HEADER */}
      <div style={s.header}>
        <h1 style={s.headerTitle}>Mon Atelier 🧵</h1>
        <div style={s.searchBar}>
          <Search size={18} style={{marginRight: 8, opacity: 0.6}} />
          <input placeholder="Rechercher un client..." style={s.searchInput} />
        </div>
      </div>

      <div style={s.content}>
        {activeTab === 'clients' && (
          <div>
            <div style={s.sectionHeader}>
              <h2 style={s.sectionTitle}>Mes Clients ({clients.length})</h2>
              <button onClick={() => setShowAddForm(true)} style={s.addButton}>
                <UserPlus size={20} color="white" />
              </button>
            </div>

            {loading ? <div style={s.loading}>Chargement...</div> : (
              clients.map(client => (
                <div key={client.id} style={s.clientCard}>
                  <div style={s.clientAvatar}>{client.nom[0]}</div>
                  <div style={{flex: 1}}>
                    <div style={s.clientName}>{client.nom}</div>
                    <div style={s.clientTel}><Phone size={12} /> {client.telephone || 'Non renseigné'}</div>
                  </div>
                  <ChevronRight size={20} color="#ccc" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab !== 'clients' && (
          <div style={s.emptyState}>
            <div style={{fontSize: 40}}>🚧</div>
            <p>Bientôt disponible</p>
          </div>
        )}
      </div>

      {/* FORMULAIRE MODAL */}
      {showAddForm && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h3>Nouveau Client</h3>
              <X onClick={() => setShowAddForm(false)} style={{cursor: 'pointer'}} />
            </div>
            <form onSubmit={handleAddClient} style={s.form}>
              <input 
                placeholder="Nom du client" 
                style={s.input}
                value={nom} onChange={e => setNom(e.target.value)}
              />
              <input 
                placeholder="Numéro de téléphone" 
                style={s.input}
                value={tel} onChange={e => setTel(e.target.value)}
              />
              <button type="submit" style={s.submitButton}>Enregistrer le client</button>
            </form>
          </div>
        </div>
      )}

      {/* NAVIGATION BASSE */}
      <nav style={s.nav}>
        <button onClick={() => setActiveTab('clients')} style={activeTab === 'clients' ? s.navItemActive : s.navItem}>
          <Users size={24} />
          <span style={{fontSize: 10, marginTop: 4}}>Clients</span>
        </button>
        <button onClick={() => setActiveTab('mesures')} style={activeTab === 'mesures' ? s.navItemActive : s.navItem}>
          <Ruler size={24} />
          <span style={{fontSize: 10, marginTop: 4}}>Mesures</span>
        </button>
        <button onClick={() => setActiveTab('travaux')} style={activeTab === 'travaux' ? s.navItemActive : s.navItem}>
          <Scissors size={24} />
          <span style={{fontSize: 10, marginTop: 4}}>Travaux</span>
        </button>
      </nav>
    </div>
  );
}

// STYLES CSS-IN-JS (Garantis de fonctionner partout)
const s = {
  container: { maxWidth: '500px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8f9fa', paddingBottom: '100px' },
  header: { backgroundColor: '#4f46e5', padding: '25px 20px', borderRadius: '0 0 30px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  headerTitle: { color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' },
  searchBar: { backgroundColor: 'white', borderRadius: '15px', padding: '10px 15px', display: 'flex', alignItems: 'center', marginTop: '15px' },
  searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  content: { padding: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 },
  addButton: { backgroundColor: '#4f46e5', border: 'none', width: '45px', height: '45px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' },
  clientCard: { backgroundColor: 'white', padding: '15px', borderRadius: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #eee' },
  clientAvatar: { width: '45px', height: '45px', backgroundColor: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold', fontSize: '18px' },
  clientName: { fontWeight: 'bold', color: '#1f2937', marginBottom: '2px' },
  clientTel: { color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' },
  loading: { textAlign: 'center', padding: '40px', color: '#999' },
  nav: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', backgroundColor: 'white', height: '70px', borderRadius: '25px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #eee' },
  navItem: { border: 'none', background: 'none', color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  navItemActive: { border: 'none', background: 'none', color: '#4f46e5', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 },
  modal: { backgroundColor: 'white', width: '100%', borderRadius: '30px', padding: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '15px', border: '1px solid #eee', backgroundColor: '#f9fafb', outline: 'none', fontSize: '16px' },
  submitButton: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#999' }
};
