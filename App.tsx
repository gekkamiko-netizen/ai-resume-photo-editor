
import React, { useState, useRef } from 'react';
import Layout from './components/Layout';
import { ImageState, SuitColor, ProcessOptions } from './types';
import { editImageToProfessional } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    processed: null,
    loading: false,
    error: null,
  });
  
  const [options, setOptions] = useState<ProcessOptions>({
    suitColor: 'black',
  });

  const [compareValue, setCompareValue] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState({
          original: event.target?.result as string,
          processed: null,
          loading: false,
          error: null,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImage = async () => {
    if (!state.original) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await editImageToProfessional(state.original, options);
      if (result.imageUrl) {
        setState(prev => ({ ...prev, processed: result.imageUrl, loading: false }));
      } else {
        throw new Error("作成に失敗しました。");
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const handleReset = () => {
    setState({ original: null, processed: null, loading: false, error: null });
  };

  const handleDownload = () => {
    if (!state.processed) return;
    const link = document.createElement('a');
    link.href = state.processed;
    link.download = `resume-photo.png`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {!state.original ? (
          <div className="text-center space-y-10 py-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                スマホ写真を<br/>
                <span className="text-blue-600">履歴書用に変換。</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                AIがスーツの着用と、背景の白抜き加工を自動で行います。
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-bold text-slate-700">写真を選択してください</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>✓ 登録不要</span>
              <span>✓ 無料</span>
              <span>✓ 背景白抜き</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">スーツの選択</h3>
                  <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 transition-colors">別の写真にする</button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['black', 'navy', 'gray'] as SuitColor[]).map(color => (
                    <button
                      key={color}
                      onClick={() => setOptions({ suitColor: color })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${options.suitColor === color ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50 opacity-60'}`}
                    >
                      <div 
                        className="w-full h-8 rounded-md shadow-inner" 
                        style={{ backgroundColor: color === 'black' ? '#1a1a1a' : color === 'navy' ? '#1e3a8a' : '#7f8c8d' }}
                      ></div>
                      <span className="text-[10px] font-bold">{color === 'black' ? 'ブラック' : color === 'navy' ? 'ネイビー' : 'グレー'}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleProcessImage}
                  disabled={state.loading}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-200 ${state.loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
                >
                  {state.loading ? 'AIが作成中...' : '写真を作成する'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner relative flex items-center justify-center">
                {state.loading ? (
                  <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-bold text-blue-600">処理中...</p>
                  </div>
                ) : state.processed ? (
                  <div className="relative w-full h-full group">
                    <img src={state.processed} className="w-full h-full object-cover" />
                    <div 
                      className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white/50"
                      style={{ width: `${compareValue}%` }}
                    >
                      <img src={state.original} className="h-full object-cover max-w-none" style={{ width: `${100 / (compareValue/100)}%` }} />
                    </div>
                    
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={compareValue} 
                      onChange={(e) => setCompareValue(parseInt(e.target.value))}
                      className="absolute inset-x-0 bottom-4 mx-auto w-4/5 h-1 bg-white/30 appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-300">
                    <img src={state.original} className="w-full h-full object-cover opacity-30 grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-bold text-slate-400 bg-white/80 px-4 py-2 rounded-full">「写真を作成」で開始</p>
                    </div>
                  </div>
                )}
              </div>
              
              {state.processed && (
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
                >
                  写真を保存する
                </button>
              )}

              {state.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold border border-red-100 text-center">
                  {state.error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
