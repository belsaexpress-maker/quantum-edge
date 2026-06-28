import React from 'react';
import Card from '../components/ui/Card';

const AdminPanel: React.FC = () => (
  <div className="space-y-3">
    <h2 className="text-lg font-bold">🛡️ Admin Panel</h2>
    <div className="grid grid-cols-2 gap-3">
      <Card><h3>Kullanıcılar</h3><p className="text-2xl font-bold">124</p></Card>
      <Card><h3>İşlemler</h3><p className="text-2xl font-bold">1,892</p></Card>
    </div>
  </div>
);

export default AdminPanel;