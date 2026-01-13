
import React, { useState, useEffect, useRef } from 'react';
import { SEOInput, SEOPackage } from './types';
import { generateSEOPackage, generateThumbnailImage } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';

type TabType = 'metadata' | 'content' | 'strategy' | 'visuals';

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
  const [copiedAll, setCopiedAll] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false);
  
  // Cooldown logic for Rate Limits
  const [cooldown, setCooldown] = useState<number>(0);
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to resolve "Cannot find namespace 'NodeJS'" error
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
        msg = "Rate Limit Reached (Free Tier). Matrix Recharging...";
        code = "RATE_LIMIT_429";
        setCooldown(60); // Start 60s cooldown
      } else if (err.message?.includes('403')) {
        msg = "API Key Invalid or Region Restricted.";
        code = "AUTH_FORBIDDEN_403";
      } else if (err.message?.includes('API_KEY')) {
        msg = "API Key Missing. Check environment variables.";
        code = "CONFIG_MISSING";
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
      if (imgErr.message?.includes('429')) {
        setCooldown(60);
        setError({ message: "Rate limit hit during visual projection. Cooling down.", code: "RATE_LIMIT_429" });
      } else {
        setError({ message: "Visual projection failed. Try again.", code: "IMAGE_GEN_ERR" });
      }
    } finally {
      setLoadingImage(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = `
TUBEEXPERT PRO - SEO STRATEGY REPORT
Generated: ${new Date().toLocaleString()}
Target: ${input.channelName} | ${input.videoType}
-----------------------------------------------------------

[ TITLES ]
ENG: ${result.titleEnglish}
ROMAN SINDHI: ${result.titleRoman}

[ DESCRIPTION (ENGLISH) ]
${result.descriptionEnglish}

[ DESCRIPTION (ROMAN SINDHI) ]
${result.descriptionRoman}

[ TAGS & KEYWORDS ]
ENG: ${result.tagsEnglish.join(', ')}
ROMAN: ${result.tagsRoman.join(', ')}

[ HASHTAGS ]
ENG: ${result.hashtagsEnglish.join(' ')}
ROMAN: ${result.hashtagsRoman.join(' ')}

[ RETENTION STRATEGY ]
${result.algorithmBoostStrategy.viralHack110}

[ VIRAL SOURCES ]
${result.groundingSources?.map(s => `${s.title}: ${s.uri}`).join('\n') || 'None detected'}

[ LAUNCH ROADMAP ]
${result.launchRoadmap.map(s => `${s.timeframe}: ${s.action}`).join('\n')}

[ CHAPTERS ]
${result.videoChapters.map(c => `${c.timestamp} ${c.title}`).join('\n')}

Generated via TubeExpert AI Matrix - Dec 2025 Algorithm Core.
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEO_Report_${input.channelName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const content = `
TITLES:
- EN: ${result.titleEnglish}
- RS: ${result.titleRoman}

DESCRIPTION (EN):
${result.descriptionEnglish}

TAGS: ${result.tagsEnglish.join(', ')}
HASHTAGS: ${result.hashtagsEnglish.join(' ')}
    `.trim();
    navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
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
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">AI Newsroom Matrix v3.1</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setShowApiGuide(!showApiGuide)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-zinc-600 transition-all"
            >
              System Status
            </button>
            <div className="px-5 py-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center gap-3">
              <div className="flex gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cooldown > 0 ? 'bg-orange-600 animate-pulse' : 'bg-green-600 shadow-[0_0_8px_#16a34a]'}`}></span>
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse delay-75"></span>
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {cooldown > 0 ? `Matrix Cooldown: ${cooldown}s` : 'Global Trend Sync: Online'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* API Deployment Guide Modal */}
      {showApiGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 max-w-xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-black uppercase tracking-tighter">API Matrix Status</h2>
              <button onClick={() => setShowApiGuide(false)} className="text-zinc-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                <p className="font-bold text-white mb-1">Free Tier Limitations</p>
                <p>The Gemini free tier allows up to 15 requests per minute (RPM). If multiple people use your app at once, this limit is hit quickly.</p>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                <p className="font-bold text-white mb-1">The "Wait 60s" Strategy</p>
                <p>We've implemented a hard cooldown of 60 seconds when a 429 error occurs. This allows the API quota to reset automatically.</p>
              </div>
              <div className="p-4 bg-red-950/20 rounded-2xl border border-red-900/30">
                <p className="font-bold text-red-500 mb-1">Production Tip</p>
                <p>For high-traffic deployment, consider switching to "Pay-as-you-go" on Google Cloud to remove the 15 RPM cap entirely.</p>
              </div>
            </div>
            <button onClick={() => setShowApiGuide(false)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-600/30">Close Diagnostics</button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Side */}
          <div className="lg:col-span-4 space-y-10 no-print">
            <div className="space-y-3">
              <h1 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter text-white">
                Viral <br/><span className="text-red-600 underline decoration-red-600/20">SEO</span> Hub
              </h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
                Elite English & Roman Sindhi Content Architecture for Professional Newsrooms.
              </p>
            </div>
            
            <InputForm 
              input={input} 
              onChange={handleInputChange} 
              onToggleShorts={handleToggleShorts}
              onSubmit={handleSubmit} 
              onGenerateThumbnail={handleGenerateThumbnail}
              loading={loading || cooldown > 0}
              loadingImage={loadingImage}
              canGenerateThumbnail={!!result}
              cooldownRemaining={cooldown}
            />
            
            {error && (
              <div className={`p-5 rounded-3xl animate-in slide-in-from-top-4 border ${error.code === 'RATE_LIMIT_429' ? 'bg-orange-950/20 border-orange-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full ${error.code === 'RATE_LIMIT_429' ? 'bg-orange-500 text-black' : 'bg-red-500 text-white'}`}>
                      {error.code === 'RATE_LIMIT_429' ? '!' : 'X'}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${error.code === 'RATE_LIMIT_429' ? 'text-orange-500' : 'text-red-500'}`}>
                      {error.message}
                    </span>
                  </div>
                  {error.code === "RATE_LIMIT_429" && (
                    <div className="space-y-2">
                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-1000" 
                          style={{ width: `${(cooldown / 60) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest italic">
                        Cooling down for {cooldown}s. Free tier is restricted to 15 RPM.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Side */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                
                {/* Control Bar */}
                <div className="flex flex-col sm:flex-row gap-4 no-print sticky top-24 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl p-2 rounded-[2rem] border border-zinc-800/50 shadow-2xl">
                  <div className="flex bg-zinc-900/50 p-1 rounded-2xl flex-1">
                    {(['metadata', 'content', 'strategy', 'visuals'] as TabType[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                          activeTab === tab 
                            ? 'bg-red-600 text-white shadow-xl shadow-red-600/30 scale-[1.02]' 
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyAll} 
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 ${copiedAll ? 'bg-green-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
                    >
                      {copiedAll ? 'Copied' : 'Copy Essentials'}
                    </button>
                    <button 
                      onClick={handleDownloadReport} 
                      className="px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl flex items-center gap-2"
                    >
                      Download Report
                    </button>
                  </div>
                </div>

                {/* Tab Views */}
                <div className="min-h-[500px]">
                  {activeTab === 'metadata' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="English Title" content={result.titleEnglish} />
                        <ResultCard title="Roman Sindhi Title" content={result.titleRoman} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ResultCard title="Primary Tags (EN)" content={result.tagsEnglish} isList />
                         <ResultCard title="Primary Tags (RS)" content={result.tagsRoman} isList />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ResultCard title="Viral Hashtags (EN)" content={result.hashtagsEnglish} isList />
                         <ResultCard title="Viral Hashtags (RS)" content={result.hashtagsRoman} isList />
                      </div>
                      {result.groundingSources && result.groundingSources.length > 0 && (
                        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem]">
                          <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-4">Viral Trend Sources (Grounding)</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {result.groundingSources.map((source, i) => (
                              <a 
                                key={i} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-4 bg-black/40 border border-zinc-800 rounded-2xl text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-all flex justify-between items-center group"
                              >
                                <span className="truncate pr-4">{source.title}</span>
                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-700">
                      <ResultCard title="Full English Description (Premium)" content={result.descriptionEnglish} />
                      <ResultCard title="Roman Sindhi Summary" content={result.descriptionRoman} />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-4">
                           <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">English Hooks</h3>
                           {result.retentionHooksEnglish.map((h, i) => <p key={i} className="text-xs text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50 italic leading-relaxed">"{h}"</p>)}
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-4">
                           <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Roman Sindhi Hooks</h3>
                           {result.retentionHooksRoman.map((h, i) => <p key={i} className="text-xs text-zinc-400 bg-black/40 p-4 rounded-2xl border border-zinc-800/50 italic leading-relaxed">"{h}"</p>)}
                        </div>
                      </div>
                      
                      <ResultCard title="Strategic Chapters" content={result.videoChapters.map(c => `${c.timestamp} ${c.title}`).join('\n')} />
                    </div>
                  )}

                  {activeTab === 'strategy' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.dailyAlgoInsights.map((insight, i) => (
                          <div key={i} className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:border-red-600/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4">
                              <span className="text-[10px] font-black text-red-600 bg-red-600/10 px-3 py-1 rounded-full uppercase tracking-tighter">{insight.impact}</span>
                            </div>
                            <h4 className="text-xl font-black text-white mb-4 tracking-tighter group-hover:text-red-500 transition-colors">{insight.trend}</h4>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">HACK: <span className="text-zinc-300 italic">{insight.hack}</span></p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600"></div>
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-10 text-center">Viral Launch Timeline</h3>
                        <div className="space-y-6">
                          {result.launchRoadmap.map((step, i) => (
                            <div key={i} className="flex gap-8 group">
                              <div className="flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-red-600 shadow-xl shadow-red-600/40 group-hover:scale-150 transition-transform"></div>
                                <div className="w-0.5 flex-grow bg-zinc-800 my-2"></div>
                              </div>
                              <div className="pb-8">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{step.timeframe}</span>
                                <p className="text-sm font-black text-white mt-1 group-hover:translate-x-2 transition-transform">{step.action}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'visuals' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-[4rem] p-12 overflow-hidden shadow-2xl border-b-8 border-b-red-600">
                        <div className="max-w-3xl mx-auto space-y-10">
                          <div className="aspect-video bg-zinc-950 rounded-[3rem] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,1)] border border-zinc-800 group">
                            {thumbnailUrl ? (
                              <img src={thumbnailUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Viral projection" />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-zinc-800">
                                <div className="w-16 h-16 border-4 border-zinc-900 border-t-red-600 rounded-full animate-spin-slow"></div>
                                <span className="text-[10px] font-black uppercase tracking-[1em]">{loadingImage ? 'Generating High-CTR Visual...' : 'Visual Projection Offline'}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button 
                                onClick={handleGenerateThumbnail} 
                                disabled={cooldown > 0 || loadingImage}
                                className={`bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-110 transition-transform shadow-2xl ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                               >
                                 {cooldown > 0 ? `Recharging ${cooldown}s` : 'Regenerate Frame'}
                               </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                             <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 shadow-inner">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-4 italic underline decoration-red-600/30">English Hook Text</span>
                                <p className="text-3xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">{result.thumbnailTextEnglish.join(' / ')}</p>
                             </div>
                             <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 shadow-inner">
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-4 italic underline decoration-orange-600/30">Roman Sindhi Text</span>
                                <p className="text-3xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">{result.thumbnailTextRoman.join(' / ')}</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : loading ? (
              <div className="h-full min-h-[700px] flex flex-col items-center justify-center space-y-12">
                <div className="relative">
                   <div className="w-48 h-48 border-[12px] border-zinc-900 rounded-full"></div>
                   <div className="absolute inset-0 w-full h-full border-[12px] border-t-red-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-8 border-[12px] border-zinc-900 border-b-orange-600 rounded-full animate-spin reverse duration-1000"></div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white animate-pulse">Syncing Matrix...</h3>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Harvesting Trending Keywords</p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[700px] flex flex-col items-center justify-center text-center p-20 border-[16px] border-dashed border-zinc-900 rounded-[8rem] group hover:border-zinc-800 transition-colors duration-1000">
                <div className="w-32 h-32 bg-zinc-900/50 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700">
                  <svg className="w-16 h-16 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-4xl font-black text-zinc-800 uppercase tracking-widest italic leading-none group-hover:text-zinc-600 transition-colors">Neural Standby</h3>
                <p className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em] mt-6 max-w-xs leading-loose">Enter the topic matrix on the left to initialize the trilingual viral sequence.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-zinc-900 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4 opacity-40">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dec 2025 Algo Synchronized</span>
              <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Trilingual Core Active</span>
           </div>
           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
             Built for Sindh TV Network & Professional Newsrooms Globally.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
