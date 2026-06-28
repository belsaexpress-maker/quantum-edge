import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { t } = useLang();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@email.com');
  const [bio, setBio] = useState('Crypto trader since 2020');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-3 max-w-xl">
      <h2 className="text-base font-semibold flex items-center gap-2"><User size={18} className="text-[var(--color-accent)]" /> {t('profile')}</h2>
      <Card className="p-4 text-center">
        <div className="relative inline-block"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold mx-auto">J</div><button className="absolute bottom-0 right-0 w-7 h-7 bg-[var(--color-accent)] rounded-full flex items-center justify-center"><Camera size={14} className="text-white" /></button></div>
        <h3 className="font-bold mt-2">{name}</h3><p className="text-xs text-[var(--color-text-muted)]">{bio}</p>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-3">Account Information</h3>
        <div className="space-y-3">
          <div><label className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><User size={12} /> {t('username')}</label><input type="text" value={name} onChange={e => setName(e.target.value)} disabled={!editing} className="w-full mt-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 focus:outline-none focus:border-[var(--color-accent)]" /></div>
          <div><label className="text-xs text-[var(--color-text-muted)] flex items-center gap-1"><Mail size={12} /> {t('email')}</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!editing} className="w-full mt-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 focus:outline-none focus:border-[var(--color-accent)]" /></div>
          <div><label className="text-xs text-[var(--color-text-muted)]">Bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} disabled={!editing} rows={2} className="w-full mt-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50 focus:outline-none focus:border-[var(--color-accent)]" /></div>
        </div>
        <div className="flex gap-2 mt-3">
          {editing ? (<><button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 bg-[var(--color-success)] text-white text-sm rounded-lg"><Save size={14} /> {t('save')}</button><button onClick={() => setEditing(false)} className="px-4 py-2 bg-[var(--color-bg-hover)] text-sm rounded-lg">{t('cancel')}</button></>) : (<button onClick={() => setEditing(true)} className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm rounded-lg">{t('edit')}</button>)}
          {saved && <span className="text-[var(--color-success)] text-sm flex items-center">✓ {t('saved')}</span>}
        </div>
      </Card>
      <Card className="p-3">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Shield size={16} /> {t('security')}</h3>
        <div className="space-y-2">
          <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-[var(--color-bg-hover)]">{t('change_password')}</button>
          <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-[var(--color-bg-hover)]">{t('two_factor')}</button>
          <button className="w-full text-left text-sm p-2 rounded-lg hover:bg-[var(--color-bg-hover)] text-red-400">{t('delete_account')}</button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;