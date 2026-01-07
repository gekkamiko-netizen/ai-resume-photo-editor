
import React from 'react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    terms: {
      title: '利用規約',
      sections: [
        {
          h: '第1条（目的）',
          p: '本規約は、「履歴書AI写真くん」（以下「本サービス」）の利用条件を定めるものです。'
        },
        {
          h: '第2条（サービスの提供）',
          p: '本サービスは、GoogleのAI（Gemini API）を利用して画像を加工する実験的なツールです。生成された画像の正確性や、特定の公的書類での有効性を保証するものではありません。'
        },
        {
          h: '第3条（禁止事項）',
          p: '公序良俗に反する画像のアップロード、他人の権利を侵害する行為、本サービスの運営を妨げる行為を禁止します。'
        },
        {
          h: '第4条（免責事項）',
          p: '本サービスの利用により生じた直接的、間接的な損害について、運営者は一切の責任を負いません。生成画像の使用判断はユーザー自身の責任で行ってください。'
        }
      ]
    },
    privacy: {
      title: 'プライバシーポリシー',
      sections: [
        {
          h: '1. 情報の収集について',
          p: '本サービスは、ユーザーがアップロードした画像データを収集します。このデータはAIによる画像生成処理のためにのみ使用されます。'
        },
        {
          h: '2. 第三者へのデータ送信',
          p: '画像生成のため、アップロードされた画像はGoogle LLCのGemini APIへ送信されます。Google社におけるデータの取り扱いは、同社のプライバシーポリシーに準じます。'
        },
        {
          h: '3. データの保存について',
          p: '本サービス側のサーバーにおいて、ユーザーがアップロードした画像や生成された画像を永続的に保存することはありません。ブラウザを閉じると処理データは消去されます。'
        },
        {
          h: '4. セキュリティ',
          p: '通信はSSLにより暗号化され、安全に処理されます。'
        }
      ]
    }
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-8">
          {current.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-bold text-slate-800">{section.h}</h3>
              <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{section.p}</p>
            </div>
          ))}
          <div className="pt-8 text-[10px] text-slate-400 border-t border-slate-50">
            2024年3月 改訂
          </div>
        </div>
        <div className="px-8 py-6 bg-slate-50 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
