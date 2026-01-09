
import React, { useState } from 'react';
import { SEOInput, SEOPackage } from './types';
import { generateSEOPackage, generateThumbnailImage } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';

type TabType = 'metadata' | 'content' | 'strategy' | 'visuals';

const App: React.FC = () => {
  const [input, setInput] = useState<SEOInput>({
    userContent: '',
    userLanguage: 'Sindhi',
    channelName: 'Sindh TV News (Official)',
    targetCountry: 'Pakistan',
    videoType: 'News',
    preferredUploadTime: '7:30 PM (Prime Time)',
    isShortsMode: false,
  });
  const [result, setResult] = useState<SEOPackage | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('metadata');
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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
    setLoading(true);
    setError(null);
    setResult(null);
    setThumbnailUrl(null);
    
    try {
      const data = await generateSEOPackage(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Viral system fault.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!result) return;
    setLoadingImage(true);
    try {
      const imageUrl = await generateThumbnailImage(result.thumbnailAIPrompt);
      setThumbnailUrl(imageUrl);
    } catch (imgErr: any) {
      setError("Visual projection offline.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleCopyAll = () => {
    if (!result) return;
    const content = `
TUBEEXPERT DUAL-LANGUAGE SEO PACKAGE (${new Date().toLocaleDateString()})
-----------------------------------------------------------
TITLES:
- ENGLISH: ${result.titleEnglish}
- ROMAN SINDHI: ${result.titleRoman}

DESCRIPTION (ENGLISH):
${result.descriptionEnglish}

DESCRIPTION (ROMAN SINDHI):
${result.descriptionRoman}

HASHTAGS (ENGLISH): ${result.hashtagsEnglish.join(' ')}
HASHTAGS (ROMAN SINDHI): ${result.hashtagsRoman.join(' ')}

STRATEGY: ${result.algorithmBoostStrategy.viralHack110}
    `.trim();
    navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-red-500/30">
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 no-print shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <span className="font-black text-xl tracking-tight uppercase block leading-none">TubeExpert <span className="text-red-600">DUAL</span></span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">English & Roman Sindhi SEO</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex px-4 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trend Grounding Active</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8 no-print">
            <div className="space-y-2">
              <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter">
                SEO <span className="text-red-600 underline decoration-red-600/10">Expert</span> <br/> Hub
              </h1>
              <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.3em]">English + Roman Sindhi Focus</p>
            </div>
            <InputForm 
              input={input} 
              onChange={handleInputChange} 
              onToggleShorts={handleToggleShorts}
              onSubmit={handleSubmit} 
              onGenerateThumbnail={handleGenerateThumbnail}
              loading={loading}
              loadingImage={loadingImage}
              canGenerateThumbnail={!!result}
            />
            {error && <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase">{error}</div>}
          </div>

          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                
                {/* Dashboard Tabs */}
                <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 backdrop-blur-sm no-print">
                  {(['metadata', 'content', 'strategy', 'visuals'] as TabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab 
                          ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center no-print">
                   <button onClick={handleCopyAll} className={`px-10 py-4 rounded-2xl text-sm font-black transition-all shadow-2xl flex items-center gap-3 ${copiedAll ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white'}`}>
                    {copiedAll ? '✓ COPIED ALL' : 'COPY DUAL PACKAGE'}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  </button>
                </div>

                {activeTab === 'metadata' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ResultCard title="ENGLISH TITLE" content={result.titleEnglish} />
                      <ResultCard title="ROMAN SINDHI TITLE" content={result.titleRoman} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ResultCard title="ENGLISH TAGS" content={result.tagsEnglish} isList />
                       <ResultCard title="ROMAN SINDHI TAGS" content={result.tagsRoman} isList />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ResultCard title="ENGLISH HASHTAGS" content={result.hashtagsEnglish} isList />
                       <ResultCard title="ROMAN SINDHI HASHTAGS" content={result.hashtagsRoman} isList />
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <ResultCard title="FULL ENGLISH DESCRIPTION" content={result.descriptionEnglish} />
                    <ResultCard title="ROMAN SINDHI SUMMARY" content={result.descriptionRoman} />
                    
                    <div className="bg-red-600/5 border border-red-600/20 rounded-[2rem] p-8">
                      <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-6">Retention Hooks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <span className="text-[10px] font-black text-zinc-500 uppercase">English</span>
                           {result.retentionHooksEnglish.map((hook, i) => <p key={i} className="text-[11px] text-zinc-300 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">{hook}</p>)}
                        </div>
                        <div className="space-y-3">
                           <span className="text-[10px] font-black text-zinc-500 uppercase">Roman Sindhi</span>
                           {result.retentionHooksRoman.map((hook, i) => <p key={i} className="text-[11px] text-zinc-300 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">{hook}</p>)}
                        </div>
                      </div>
                    </div>
                    
                    <ResultCard title="VIDEO CHAPTERS" content={result.videoChapters.map(c => `${c.timestamp} ${c.title}`).join('\n')} />
                  </div>
                )}

                {activeTab === 'strategy' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.dailyAlgoInsights.map((insight, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] border-l-8 border-l-red-600 shadow-xl">
                          <h4 className="text-lg font-black text-white mb-3 tracking-tighter">{insight.trend}</h4>
                          <p className="text-xs text-zinc-400 font-medium leading-relaxed italic border-t border-zinc-800 pt-3 mt-3">Hack: {insight.hack}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
                       <div className="p-8 space-y-4">
                          {result.launchRoadmap.map((step, i) => (
                            <div key={i} className="flex items-center gap-6 p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                              <span className="text-[10px] font-black text-red-600 uppercase w-20 shrink-0">{step.timeframe}</span>
                              <p className="text-sm text-zinc-300 font-black">{step.action}</p>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <ResultCard title="COMMUNITY POST (EN)" content={result.communityPostEnglish} />
                       <ResultCard title="COMMUNITY POST (ROMAN)" content={result.communityPostRoman} />
                    </div>
                  </div>
                )}

                {activeTab === 'visuals' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
                      <div className="p-10">
                        <div className="bg-zinc-950 aspect-video rounded-[2.5rem] overflow-hidden relative mb-10 border border-zinc-800 group shadow-2xl">
                           {thumbnailUrl ? (
                             <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Viral projection" />
                           ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-zinc-800">
                               <span className="text-[11px] font-black uppercase tracking-[0.8em]">{loadingImage ? 'Projecting HDR Visual...' : 'Projection Matrix Offline'}</span>
                             </div>
                           )}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={handleGenerateThumbnail} className="bg-white text-black px-6 py-2 rounded-xl font-black text-xs uppercase">Regenerate</button>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="p-8 bg-zinc-800/40 rounded-[2rem] border border-zinc-800">
                              <span className="text-[10px] font-black text-red-500 uppercase mb-3 block italic">English Overlay</span>
                              <p className="text-2xl font-black text-white leading-tight">{result.thumbnailTextEnglish.join(' | ')}</p>
                           </div>
                           <div className="p-8 bg-zinc-800/40 rounded-[2rem] border border-zinc-800">
                              <span className="text-[10px] font-black text-red-500 uppercase mb-3 block italic">Roman Overlay</span>
                              <p className="text-2xl font-black text-white leading-tight">{result.thumbnailTextRoman.join(' | ')}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                    <ResultCard title="OUTRO & ENDSCREEN" content={`${result.outroStrategy.endScreen}\n\nCARDS: ${result.outroStrategy.cards}`} />
                  </div>
                )}

              </div>
            ) : loading ? (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center space-y-12">
                <div className="w-40 h-40 border-8 border-zinc-900 rounded-full relative">
                  <div className="absolute inset-0 w-full h-full border-t-8 border-red-600 rounded-full animate-spin"></div>
                </div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Syncing Dual SEO...</h3>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 border-8 border-dashed border-zinc-900 rounded-[5rem] opacity-50">
                <h3 className="text-3xl font-black text-zinc-700 uppercase tracking-widest italic leading-none">Matrix Standby</h3>
                <p className="text-[11px] text-zinc-800 font-bold uppercase tracking-[0.3em] mt-4">Waiting for Target Keywords</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
