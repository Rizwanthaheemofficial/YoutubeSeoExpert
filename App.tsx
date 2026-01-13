
import React, { useState, useEffect, useRef } from 'react';
import { SEOInput, SEOPackage } from './types';
import { generateSEOPackage, generateThumbnailImage } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';

type TabType = 'metadata' | 'content' | 'visuals';

const App: React.FC = () => {
  const [input, setInput] = useState<SEOInput>({
    userContent: '',
    userLanguage: 'Roman Sindhi',
    channelName: 'Sindh TV News',
    targetCountry: 'Pakistan',
    videoType: 'News',
    preferredUploadTime: '7:30 PM',
    isShortsMode: false,
  });
  const [result, setResult] = useState<SEOPackage | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('metadata');
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<{message: string, code?: string} | null>(null);
  const [showApiGuide, setShowApiGuide] = useState(false);
  
  const [cooldown, setCooldown] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else if (cooldown === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setError(null);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleShorts = (enabled: boolean) => {
    setInput(prev => ({ 
      ...prev, 
      isShortsMode: enabled,
      videoType: enabled ? 'Shorts' : 'News'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setThumbnailUrl(null);
    
    try {
      const data = await generateSEOPackage(input);
      setResult(data);
    } catch (err: any) {
      let msg = "Neural Matrix Fault.";
      let code = "GENERAL_ERROR";
      if (err.message?.includes('429')) {
        msg = "Rate Limit Reached. Recharging...";
        code = "RATE_LIMIT_429";
        setCooldown(60);
      } else if (err.message?.includes('403')) {
        msg = "API Key Invalid.";
        code = "AUTH_FORBIDDEN_403";
      }
      setError({ message: msg, code });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!result || cooldown > 0) return;
    setLoadingImage(true);
    try {
      const imageUrl = await generateThumbnailImage(result.thumbnailAIPrompt);
      setThumbnailUrl(imageUrl);
    } catch (imgErr: any) {
      setError({ message: "Visual projection failed.", code: "IMAGE_GEN_ERR" });
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans selection:bg-red-600/50">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-zinc-800/50 px-6 py-4 no-print shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/20 rotate-3 transition-transform hover:rotate-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white drop-shadow-md"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter uppercase block leading-none">TubeExpert <span className="text-red-600">PRO</span></span>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">AI Matrix v3.1</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setShowApiGuide(!showApiGuide)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-zinc-600 transition-all">Status</button>
            <div className="px-5 py-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${cooldown > 0 ? 'bg-orange-600 animate-pulse' : 'bg-green-600 shadow-[0_0_8px_#16a34a]'}`}></span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{cooldown > 0 ? `Wait: ${cooldown}s` : 'Online'}</span>
            </div>
          </div>
        </div>
      </header>

      {showApiGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black uppercase tracking-tighter">System Info</h2>
              <button onClick={() => setShowApiGuide(false)} className="text-zinc-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">System optimized for Titles, Tags, and Descriptions. Strategy and Chapter functions disabled to maximize performance.</p>
            <button onClick={() => setShowApiGuide(false)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Close</button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-10 no-print">
            <div className="space-y-3">
              <h1 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter text-white">Viral <br/><span className="text-red-600 underline decoration-red-600/20">SEO</span> Hub</h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Elite English & Roman Sindhi Content Architecture.</p>
            </div>
            <InputForm 
              input={input} onChange={handleInputChange} onToggleShorts={handleToggleShorts}
              onSubmit={handleSubmit} onGenerateThumbnail={handleGenerateThumbnail}
              loading={loading || cooldown > 0} loadingImage={loadingImage}
              canGenerateThumbnail={!!result} cooldownRemaining={cooldown}
            />
            {error && (
              <div className={`p-5 rounded-3xl animate-in slide-in-from-top-4 border ${error.code === 'RATE_LIMIT_429' ? 'bg-orange-950/20 border-orange-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${error.code === 'RATE_LIMIT_429' ? 'text-orange-500' : 'text-red-500'}`}>{error.message}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <div className="flex gap-4 no-print sticky top-24 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl p-2 rounded-3xl border border-zinc-800/50 shadow-2xl">
                  {(['metadata', 'content', 'visuals'] as TabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                        activeTab === tab ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="min-h-[500px]">
                  {activeTab === 'metadata' && (
                    <div className="space-y-6 animate-in fade-in duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="English Title" content={result.titleEnglish} />
                        <ResultCard title="Roman Sindhi Title" content={result.titleRoman} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="Tags (EN)" content={result.tagsEnglish} isList />
                        <ResultCard title="Tags (RS)" content={result.tagsRoman} isList />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="Hashtags (EN)" content={result.hashtagsEnglish} isList />
                        <ResultCard title="Hashtags (RS)" content={result.hashtagsRoman} isList />
                      </div>
                      {result.algorithmBoostStrategy?.viralHack110 && (
                        <div className="p-6 bg-red-600/5 border border-red-600/20 rounded-3xl">
                          <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Algorithm Hack</h4>
                          <p className="text-sm text-zinc-300 italic">"{result.algorithmBoostStrategy.viralHack110}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div className="space-y-6 animate-in fade-in duration-700">
                      <ResultCard title="English Description" content={result.descriptionEnglish} />
                      <ResultCard title="Roman Sindhi Summary" content={result.descriptionRoman} />
                    </div>
                  )}

                  {activeTab === 'visuals' && (
                    <div className="space-y-8 animate-in fade-in duration-700">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 overflow-hidden shadow-2xl">
                        <div className="aspect-video bg-zinc-950 rounded-2xl overflow-hidden relative group border border-zinc-800">
                          {thumbnailUrl ? (
                            <img src={thumbnailUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Thumbnail" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-zinc-800 tracking-widest">{loadingImage ? 'Generating...' : 'Offline'}</div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={handleGenerateThumbnail} disabled={cooldown > 0 || loadingImage} className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase shadow-2xl">Regenerate</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                           <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-2">English Overlay</span>
                              <p className="text-2xl font-black text-white uppercase italic">{result.thumbnailTextEnglish.join(' / ')}</p>
                           </div>
                           <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2">Roman Sindhi Overlay</span>
                              <p className="text-2xl font-black text-white uppercase italic">{result.thumbnailTextRoman.join(' / ')}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-20 border-[16px] border-dashed border-zinc-900 rounded-[8rem] group hover:border-zinc-800 transition-colors">
                <h3 className="text-4xl font-black text-zinc-800 uppercase tracking-widest italic group-hover:text-zinc-600">Neural Standby</h3>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
