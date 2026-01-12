
import React from 'react';
import { SEOInput } from '../types';

interface InputFormProps {
  input: SEOInput;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onToggleShorts: (enabled: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGenerateThumbnail?: () => void;
  loading: boolean;
  loadingImage: boolean;
  canGenerateThumbnail: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ 
  input, 
  onChange, 
  onToggleShorts,
  onSubmit, 
  onGenerateThumbnail, 
  loading, 
  loadingImage,
  canGenerateThumbnail 
}) => {
  
  const getPlaceholders = () => {
    const lang = input.userLanguage.toLowerCase();
    
    if (lang.includes('roman') || lang.includes('latin')) {
      return {
        channel: 'Sindh TV News / @SindhTVNewsOfficial',
        topic: 'Asif Zardari jo Sindh assembly mein khitab...',
        language: 'Roman Sindhi',
        country: 'Pakistan / UAE',
        time: '8:00 PM Prime Time'
      };
    }
    
    if (lang.includes('sindhi') || lang.includes('سنڌي')) {
      return {
        channel: 'سنڌ ٽي وي نيوز (Sindh TV News)',
        topic: 'سنڌ اسيمبلي ۾ وڏي وزير جو خطاب ۽ بجيٽ تي بحث...',
        language: 'Sindhi (سنڌي)',
        country: 'پاڪستان (Pakistan)',
        time: 'شام 7 کان 9 وڳي'
      };
    }

    if (lang.includes('urdu') || lang.includes('اردو')) {
      return {
        channel: 'Geo News / ARY News Style',
        topic: 'پاکستان کی تازہ ترین سیاسی صورتحال اور خبریں...',
        language: 'Urdu (اردو)',
        country: 'Pakistan',
        time: '9:00 PM News Bulletin'
      };
    }

    // Default / English
    return {
      channel: 'BBC News / CNN / Sindh TV English',
      topic: 'Climate change impact on Indus River and local farming...',
      language: 'English (US/UK)',
      country: 'Global / Pakistan',
      time: '6:00 PM GMT'
    };
  };

  const placeholders = getPlaceholders();

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-md shadow-inner">
      <div className="flex items-center justify-between p-4 bg-red-600/5 border border-red-600/10 rounded-2xl mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)] ${input.isShortsMode ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {input.isShortsMode ? 'Shorts SEO Engine Active' : 'Standard Video SEO'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleShorts(!input.isShortsMode)}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
            input.isShortsMode 
              ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' 
              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:border-zinc-500'
          }`}
        >
          {input.isShortsMode ? 'Switch to Long' : 'Switch to Shorts'}
        </button>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
            Channel Name / Authority
          </label>
          <input
            name="channelName"
            value={input.channelName}
            onChange={onChange}
            required
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-zinc-700 font-medium"
            placeholder={placeholders.channel}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative group">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Input Language
            </label>
            <input
              name="userLanguage"
              value={input.userLanguage}
              onChange={onChange}
              required
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-zinc-700 font-medium"
              placeholder={placeholders.language}
            />
          </div>
          <div className="relative group">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Content Niche
            </label>
            <select
              name="videoType"
              value={input.videoType}
              onChange={onChange}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all appearance-none font-medium"
            >
              <optgroup label="Newsroom Categories">
                <option value="News">General News Bulletin</option>
                <option value="Breaking">Breaking News Alert</option>
                <option value="News Package">News Package / Story</option>
                <option value="Report">Special Report</option>
                <option value="Current Affair">Current Affair Program</option>
                <option value="Talk Show">Talk Show / Debate</option>
                <option value="Entertainment News">Entertainment News</option>
                <option value="Sports News">Sports News</option>
              </optgroup>
              <optgroup label="Other Formats">
                <option value="Shorts">Vertical Shorts Feed</option>
                <option value="Documentary">Investigation / Docu</option>
                <option value="Education">Educational / Insight</option>
                <option value="Vlog">Lifestyle / On-Location</option>
                <option value="Live Stream">Live Stream Archive</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative group">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Target Territory
            </label>
            <input
              name="targetCountry"
              value={input.targetCountry}
              onChange={onChange}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-zinc-700 font-medium"
              placeholder={placeholders.country}
            />
          </div>
          <div className="relative group">
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
              Optimum Upload Window
            </label>
            <input
              name="preferredUploadTime"
              value={input.preferredUploadTime}
              onChange={onChange}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-zinc-700 font-medium"
              placeholder={placeholders.time}
            />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
            Topic Matrix (Detailed Keywords)
          </label>
          <textarea
            name="userContent"
            value={input.userContent}
            onChange={onChange}
            required
            rows={5}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none placeholder:text-zinc-700 font-medium leading-relaxed"
            placeholder={placeholders.topic}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-2xl ${
            loading 
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700' 
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-600/30'
          }`}
        >
          {loading ? 'Processing Neural Clusters...' : input.isShortsMode ? 'Inject Viral Metadata' : 'Initiate Full SEO Sequence'}
        </button>

        {canGenerateThumbnail && (
          <button
            type="button"
            onClick={onGenerateThumbnail}
            disabled={loadingImage || loading}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95 shadow-xl ${
              loadingImage || loading
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
            }`}
          >
            {loadingImage ? 'Projecting HDR...' : 'Get Frame'}
          </button>
        )}
      </div>
    </form>
  );
};

export default InputForm;
