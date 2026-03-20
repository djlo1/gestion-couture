"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Users, Ruler, Scissors, Search, ChevronRight } from 'lucide-react';

// Connexion Supabase (utilisera les variables d'environnement de Vercel)
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

  useEffect(() => {
    fetchClients();
  }, []);

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
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Mon Atelier 🧵</h1>
        <p className="text-indigo-100 opacity-80 text-sm">Gestion de couture</p>
      </div>

      <div className="p-4">
        {/* Liste des clients */}
        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Mes Clients</h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-indigo-600 text-white p-2 rounded-full shadow-md"
              >
                <Plus size={24} />
              </button>
            </div>

            {loading ? <p>Chargement...</p> : (
              clients.map(client => (
                <div key={client.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">{client.nom}</h3>
                    <p className="text-gray-500 text-sm">{client.telephone || 'Pas de numéro'}</p>
                  </div>
                  <ChevronRight className="text-gray-300" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Placeholder pour les autres onglets */}
        {activeTab !== 'clients' && (
          <div className="text-center py-20 text-gray-400">
            <p>Cette fonctionnalité arrive bientôt !</p>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout (Modal simple) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Nouveau Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input 
                placeholder="Nom complet" 
                className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                value={nom} onChange={e => setNom(e.target.value)}
              />
              <input 
                placeholder="Téléphone" 
                className="w-full p-4 bg-gray-100 rounded-2xl outline-none"
                value={tel} onChange={e => setTel(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 p-4 text-gray-500 font-bold">Annuler</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Mobile */}
      <nav className="fixed bottom-6 left-4 right-4 bg-white h-20 rounded-3xl shadow-2xl border border-gray-100 flex justify-around items-center px-6 z-40">
        <button onClick={() => setActiveTab('clients')} className={`flex flex-col items-center ${activeTab === 'clients' ? 'text-indigo-600' : 'text-gray-400'}`}>
          <Users size={24} />
          <span className="text-[10px] font-bold mt-1">Clients</span>
        </button>
        <button onClick={() => setActiveTab('mesures')} className={`flex flex-col items-center ${activeTab === 'mesures' ? 'text-indigo-600' : 'text-gray-400'}`}>
          <Ruler size={24} />
          <span className="text-[10px] font-bold mt-1">Mesures</span>
        </button>
        <button onClick={() => setActiveTab('commandes')} className={`flex flex-col items-center ${activeTab === 'commandes' ? 'text-indigo-600' : 'text-gray-400'}`}>
          <Scissors size={24} />
          <span className="text-[10px] font-bold mt-1">Travaux</span>
        </button>
      </nav>
    </div>
  );
}
