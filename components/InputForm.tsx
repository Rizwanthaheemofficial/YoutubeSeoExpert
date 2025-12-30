
import React from 'react';
import { SEOInput } from '../types';

interface InputFormProps {
  input: SEOInput;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGenerateThumbnail?: () => void;
  loading: boolean;
  loadingImage: boolean;
  canGenerateThumbnail: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ 
  input, 
  onChange, 
  onSubmit, 
  onGenerateThumbnail, 
  loading, 
  loadingImage,
  canGenerateThumbnail 
}) => {
  
  const getPlaceholders = () => {
    switch (input.userLanguage.toLowerCase()) {
      case 'sindhi':
        return {
          channel: 'مثال: سنڌي ويلاگز HD',
          topic: 'پنهنجي وڊيو بابت ٻڌايو (مثال: سنڌ جي تاريخ، سنڌي کاڌا وغيره)',
          language: 'Sindhi (سنڌي)',
          country: 'Pakistan (پاڪستان)',
          time: 'مثال: شام 8 وڳي'
        };
      case 'urdu':
        return {
          channel: 'مثال: اردو نیوز پرو',
          topic: 'اپنی ویڈیو کا عنوان یہاں لکھیں (جیسے: پاکستان کی سیاست، معلوماتی ویڈیو)',
          language: 'Urdu (اردو)',
          country: 'Pakistan (پاکستان)',
          time: 'مثال: رات 9 بجے'
        };
      default:
        return {
          channel: 'e.g. Global Tech HD',
          topic: 'Describe your topic (e.g. AI Trends, Space Travel, etc.)',
          language: 'e.g. English, Arabic',
          country: 'e.g. USA, UK, UAE',
          time: 'e.g. 7:00 PM'
        };
    }
  };

  const placeholders = getPlaceholders();

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="relative group">
          <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">
            Channel Name
            <span className="cursor-help text-zinc-600" title="Used to build brand authority and link related videos.">ⓘ</span>
          </label>
          <input
            name="channelName"
            value={input.channelName}
            onChange={onChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            placeholder={placeholders.channel}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">
              User Language
              <span className="cursor-help text-zinc-600" title="Determines script accuracy (e.g. Sindhi Arabic-style).">ⓘ</span>
            </label>
            <input
              name="userLanguage"
              value={input.userLanguage}
              onChange={onChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder={placeholders.language}
            />
          </div>
          <div className="relative group">
            <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">
              Video Type
              <span className="cursor-help text-zinc-600" title="Changes the AI's metadata style (Viral vs Informational).">ⓘ</span>
            </label>
            <select
              name="videoType"
              value={input.videoType}
              onChange={onChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              <option value="Education">Education</option>
              <option value="Vlog">Vlog</option>
              <option value="Tech">Tech</option>
              <option value="News">News</option>
              <option value="Shorts">Shorts</option>
              <option value="AI">AI</option>
              <option value="Finance">Finance</option>
              <option value="Gaming">Gaming</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">
              Target Country
              <span className="cursor-help text-zinc-600" title="Helps target regional algorithm feeds.">ⓘ</span>
            </label>
            <input
              name="targetCountry"
              value={input.targetCountry}
              onChange={onChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder={placeholders.country}
            />
          </div>
          <div className="relative group">
            <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">
              Preferred Upload Time
              <span className="cursor-help text-zinc-600" title="Timing the 'Velocity Spike' is critical for 110% reach.">ⓘ</span>
            </label>
            <input
              name="preferredUploadTime"
              value={input.preferredUploadTime}
              onChange={onChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              placeholder={placeholders.time}
            />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-sm font-medium text-zinc-400 mb-1 flex items-center gap-1">
            Video Content / Topic
            <span className="cursor-help text-zinc-600" title="The primary topic clusters used to hack recommendations.">ⓘ</span>
          </label>
          <textarea
            name="userContent"
            value={input.userContent}
            onChange={onChange}
            required
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
            placeholder={placeholders.topic}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg shadow-red-500/20 ${
            loading 
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
        >
          {loading ? 'Hacking Algorithm...' : 'GENERATE 110% SEO'}
        </button>

        {canGenerateThumbnail && (
          <button
            type="button"
            onClick={onGenerateThumbnail}
            disabled={loadingImage || loading}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
              loadingImage || loading
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
            }`}
          >
            {loadingImage ? 'Creating 8K Image...' : 'GENERATE THUMBNAIL'}
          </button>
        )}
      </div>
    </form>
  );
};

export default InputForm;
