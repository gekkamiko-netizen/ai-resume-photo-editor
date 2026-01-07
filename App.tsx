
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
        throw new Error("画像の生成に失敗しました。");
      }
    } catch (err: any) {
      console.error(err);
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
    link.download = `resume-photo-${Date.now()}.png`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {!state.original ? (
          <div className="text-center space-y-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4">
                NEW: Gemini 2.5 Flash 対応
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                スマホ写真を<br/>
                <span className="text-blue-600">プロ級の履歴書用に。</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto">
                AIがスーツへの着せ替えと、背景の白抜き加工を自動で行います。
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative max-w-lg mx-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-bold text-slate-700 text-lg">写真を選択してください</p>
                <p className="text-slate-400 text-xs mt-2 font-medium">またはここにドラッグ＆ドロップ</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto pt-8 border-t border-slate-100">
              <div className="space-y-2">
                <div className="text-blue-600 font-bold text-sm flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">1</span>
                  写真を撮る
                </div>
                <p className="text-slate-400 text-xs">正面から明るい場所で撮影してください。</p>
              </div>
              <div className="space-y-2">
                <div className="text-blue-600 font-bold text-sm flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">2</span>
                  色を選ぶ
                </div>
                <p className="text-slate-400 text-xs">ブラック、ネイビー、グレーから選べます。</p>
              </div>
              <div className="space-y-2">
                <div className="text-blue-600 font-bold text-sm flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px]">3</span>
                  保存する
                </div>
                <p className="text-slate-400 text-xs">変換された画像を保存して履歴書に貼るだけ！</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">スーツの選択</h3>
                  <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    やり直す
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['black', 'navy', 'gray'] as SuitColor[]).map(color => (
                    <button
                      key={color}
                      onClick={() => setOptions({ suitColor: color })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${options.suitColor === color ? 'border-blue-600 bg-blue-50 shadow-md translate-y-[-2px]' : 'border-slate-50 bg-slate-50 opacity-60 hover:opacity-100'}`}
                    >
                      <div 
                        className="w-full h-10 rounded-lg shadow-inner border border-black/5" 
                        style={{ backgroundColor: color === 'black' ? '#1a1a1a' : color === 'navy' ? '#1e3a8a' : '#7f8c8d' }}
                      ></div>
                      <span className="text-[10px] font-bold text-slate-600">{color === 'black' ? 'ブラック' : color === 'navy' ? 'ネイビー' : 'グレー'}</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-bold mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" fillRule="evenodd"/></svg>
                    より綺麗に仕上げるコツ
                  </p>
                  <ul className="text-[10px] text-amber-600 list-disc list-inside space-y-0.5">
                    <li>真正面を向いた写真を選ぶ</li>
                    <li>背景と髪の色が被っていない写真</li>
                    <li>顔に強い影がついていないもの</li>
                  </ul>
                </div>

                <button 
                  onClick={handleProcessImage}
                  disabled={state.loading}
                  className={`w-full py-5 rounded-2xl font-bold text-white transition-all shadow-xl shadow-blue-200 text-lg ${state.loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
                >
                  {state.loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AIがスーツを着せています...
                    </span>
                  ) : '写真を作成する'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-[3/4] bg-slate-100 rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative flex items-center justify-center">
                {state.loading ? (
                  <div className="text-center space-y-6 px-10">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" fillRule="evenodd" clipRule="evenodd"/></svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">画像を解析中...</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Processing with Gemini AI</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 animate-[progress_3s_ease-in-out_infinite] w-full origin-left"></div>
                    </div>
                  </div>
                ) : state.processed ? (
                  <div className="relative w-full h-full group select-none">
                    <img src={state.processed} className="w-full h-full object-cover" alt="Processed" />
                    <div 
                      className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.1)]"
                      style={{ width: `${compareValue}%` }}
                    >
                      <img src={state.original} className="h-full object-cover max-w-none" style={{ width: `${100 / (compareValue/100)}%` }} alt="Original" />
                    </div>
                    
                    <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2">
                       <span className="text-[10px] font-bold text-white bg-black/30 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest">Slide to compare</span>
                       <input 
                        type="range" 
                        min="0" max="100" 
                        value={compareValue} 
                        onChange={(e) => setCompareValue(parseInt(e.target.value))}
                        className="w-4/5 h-2 bg-white/20 backdrop-blur-md appearance-none cursor-ew-resize accent-white rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img src={state.original} className="w-full h-full object-cover opacity-40 blur-[2px] grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
                        <p className="text-sm font-bold text-slate-800">準備完了</p>
                        <p className="text-[10px] text-slate-500 mt-1">「写真を作成する」ボタンを押して開始してください</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {state.processed && (
                <button 
                  onClick={handleDownload}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  高画質で写真を保存する
                </button>
              )}

              {state.error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-start gap-3 animate-shake">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fillRule="evenodd" clipRule="evenodd"/></svg>
                  <span>{state.error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </Layout>
  );
};

export default App;
