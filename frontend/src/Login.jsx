import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl w-96 text-center">
        <h1 className="text-3xl font-black text-blue-500 mb-2">QUANTUM EDGE</h1>
        <p className="text-gray-400 mb-8">Trade with AI Precision</p>
        
        {/* Buraya Clerk veya Google OAuth butonu gelecek */}
        <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition">
          Google ile Giriş Yap
        </button>
        
        <p className="mt-6 text-xs text-gray-500">
          Giriş yaparak kullanım koşullarını kabul etmiş olursun.
        </p>
      </div>
    </div>
  );
}