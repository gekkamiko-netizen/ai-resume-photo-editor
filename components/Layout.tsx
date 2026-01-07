
import React, { useState } from 'react';
import LegalModal from './LegalModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">
              写
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              履歴書AI写真くん
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-slate-100 py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400">© 2024 履歴書AI写真くん. すべての画像処理は安全に行われます。</p>
          <div className="flex gap-8 text-xs text-slate-400">
            <button onClick={() => setLegalType('terms')} className="hover:text-slate-600 transition-colors">利用規約</button>
            <button onClick={() => setLegalType('privacy')} className="hover:text-slate-600 transition-colors">プライバシーポリシー</button>
          </div>
        </div>
      </footer>

      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </div>
  );
};

export default Layout;
