import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Sparkles, 
  Layout, 
  Download, 
  Cpu, 
  ScrollText, 
  Image as ImageIcon,
  Loader2,
  RefreshCcw,
  Zap,
  Wand2,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Music,
  BookOpen,
  X,
  Play,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import { GoogleGenAI, Type, Modality } from '@google/genai';

export default function App() {
  // State Management
  const [tema, setTema] = useState('');
  const [activeChar, setActiveChar] = useState('');
  const [format, setFormat] = useState('9:16');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showThemes, setShowThemes] = useState(false);
  const [showChars, setShowChars] = useState(false);
  const [showVoices, setShowVoices] = useState(false);
  const [showBgm, setShowBgm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); // State untuk Modal Tutorial
  const [copied, setCopied] = useState(false); // State untuk copy caption
  const [watermark, setWatermark] = useState(''); // State untuk watermark
  
  // Audio & Music State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [voice, setVoice] = useState('Auto');
  const [bgm, setBgm] = useState('Auto'); 
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgmRef = useRef<HTMLAudioElement>(null);

  // Configuration Constants
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  useEffect(() => {
    // Reset cache audio saat user mengganti pilihan suara
    setAudioUrl(null);
    setIsAudioPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    if (bgmRef.current) bgmRef.current.pause();
  }, [voice, bgm]);

  // Expanded Human Character List (30 Arketipe)
  const characters = [
    { id: 'kakek', name: 'Kakek Bijak', emoji: '👴', vibe: 'ambient' },
    { id: 'pemuda', name: 'Pemuda Urban', emoji: '👔', vibe: 'viral_jj' },
    { id: 'pertiwi', name: 'Ibu Pertiwi', emoji: '👩', vibe: 'piano' },
    { id: 'pendekar', name: 'Pendekar Tunggal', emoji: '⚔️', vibe: 'epic' },
    { id: 'sufi', name: 'Guru Sufi', emoji: '👳', vibe: 'ambient' },
    { id: 'cyber', name: 'Cyberpunk', emoji: '💻', vibe: 'cyber' },
    { id: 'nelayan', name: 'Nelayan Tua', emoji: '🛶', vibe: 'ambient' },
    { id: 'ilmuwan', name: 'Ilmuwan Visioner', emoji: '🧬', vibe: 'cyber' },
    { id: 'musisi', name: 'Musisi Jalanan', emoji: '🎸', vibe: 'viral_aesthetic' },
    { id: 'petani', name: 'Petani Tangguh', emoji: '🌾', vibe: 'ambient' },
    { id: 'anak', name: 'Anak Desa', emoji: '👦', vibe: 'piano' },
    { id: 'penjelajah', name: 'Penjelajah Waktu', emoji: '⏳', vibe: 'viral_cinematic' },
    { id: 'alkemis', name: 'Sang Alkemis', emoji: '⚗️', vibe: 'mystery' },
    { id: 'penari', name: 'Penari Langit', emoji: '💃', vibe: 'viral_aesthetic' },
    { id: 'pertapa', name: 'Pertapa Gunung', emoji: '🏔️', vibe: 'ambient' },
    { id: 'pencerita', name: 'Sang Pencerita', emoji: '📜', vibe: 'piano' },
    { id: 'pelukis', name: 'Pelukis Jiwa', emoji: '🎨', vibe: 'viral_aesthetic' },
    { id: 'astronom', name: 'Astronom Kuno', emoji: '🔭', vibe: 'mystery' },
    { id: 'tabib', name: 'Tabib Hutan', emoji: '🌿', vibe: 'ambient' },
    { id: 'pengembara', name: 'Sang Pengembara', emoji: '🚶', vibe: 'epic' },
    { id: 'mekanik', name: 'Mekanik Steampunk', emoji: '⚙️', vibe: 'cyber' },
    { id: 'penjaga', name: 'Penjaga Hutan', emoji: '🌳', vibe: 'mystery' },
    { id: 'penyair', name: 'Penyair Bisu', emoji: '🖋️', vibe: 'piano' },
    { id: 'ratues', name: 'Ratu Es', emoji: '❄️', vibe: 'mystery' },
    { id: 'pandaibesi', name: 'Pandai Besi', emoji: '🔨', vibe: 'epic' },
    { id: 'astronot', name: 'Astronot Tersesat', emoji: '🚀', vibe: 'cyber' },
    { id: 'dewimalam', name: 'Dewi Malam', emoji: '🌙', vibe: 'mystery' },
    { id: 'ksatria', name: 'Ksatria Cahaya', emoji: '🛡️', vibe: 'viral_cinematic' },
    { id: 'pemburu', name: 'Pemburu Bayangan', emoji: '🏹', vibe: 'mystery' },
    { id: 'biksu', name: 'Biksu Diam', emoji: '📿', vibe: 'ambient' }
  ];

  // Quick Themes (50 Ide Moral - Fokus Inspirasi, Emosional & Kehidupan)
  const quickThemes = [
    "Bangkit dari puing kegagalan", "Merangkul luka masa lalu", "Menembus batas keraguan diri",
    "Keberanian memulai dari nol", "Seni melepaskan ekspektasi", "Berdamai dengan ketidaksempurnaan",
    "Mengubah rasa sakit menjadi kekuatan", "Menghargai setiap detik yang berlalu", "Menemukan terang di lorong gelap",
    "Percaya pada keajaiban proses", "Menangis untuk kembali tangguh", "Menulis ulang takdir sendiri",
    "Bahagia dalam kesederhanaan", "Berdiri tegak melawan badai", "Merajut kembali mimpi yang patah",
    "Menyembuhkan luka batin yang terpendam", "Menjadi pahlawan bagi diri sendiri", "Makna tersembunyi sebuah perpisahan",
    "Bertahan di titik terendah", "Melangkah walau dengan kaki terluka", "Kebebasan dalam memaafkan diri",
    "Menerima kenyataan pahit", "Bintang yang bersinar di malam kelam", "Harga sebuah perjuangan",
    "Menyala terang meski sendirian", "Seni menikmati kesendirian", "Menembus kemustahilan",
    "Arti sejati sebuah kesuksesan", "Memeluk bayangan diri", "Bertumbuh dari rasa sakit",
    "Langkah kecil yang mengubah hidup", "Menemukan rumah di dalam hati", "Ketenangan di tengah kekacauan dunia",
    "Keberanian untuk menjadi berbeda", "Menyapu air mata, melanjutkan langkah", "Cinta pada diri sendiri",
    "Menghadapi ketakutan terbesar", "Menari di bawah hujan badai", "Menata kepingan hati yang hancur",
    "Percaya pada kekuatan impian", "Berlayar melawan arus kehidupan", "Kekuatan di balik sebuah senyuman",
    "Menemukan makna di setiap kejadian", "Menjaga kewarasan di dunia yang bising", "Keikhlasan merelakan yang pergi",
    "Cahaya harapan di ujung lelah", "Menjadi karang yang tegar", "Membangun asa dari sisa kehancuran",
    "Keindahan dalam sebuah perjuangan", "Memilih bahagia hari ini"
  ];

  // Voice Options
  const voiceOptions = [
    { id: 'Auto', name: 'Auto (Sesuai Karakter)' },
    { id: 'Fenrir', name: 'Pria (Dramatis & Berat)' },
    { id: 'Charon', name: 'Pria (Tenang)' },
    { id: 'Zephyr', name: 'Pria (Muda)' },
    { id: 'Aoede', name: 'Wanita (Lembut & Anggun)' },
    { id: 'Kore', name: 'Wanita (Tegas)' }
  ];

  // BGM Options
  const bgmOptions = [
    { id: 'Auto', name: 'Auto (Sesuai Suasana)' },
    { id: 'none', name: 'Tanpa Musik (Hanya Suara)' },
    { id: 'viral_jj', name: 'Viral (Jedag Jedug / Beat)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { id: 'viral_aesthetic', name: 'Viral (Aesthetic / Galau)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { id: 'viral_cinematic', name: 'Viral (Cinematic / Story)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'ambient', name: 'Ambient (Tenang & Damai)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
    { id: 'epic', name: 'Epic (Dramatis & Menggugah)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
    { id: 'lofi', name: 'Lo-Fi (Santai & Modern)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
    { id: 'piano', name: 'Piano (Emosional & Menyentuh)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3' },
    { id: 'cyber', name: 'Synthwave (Cyber & Retro)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
    { id: 'mystery', name: 'Misteri (Gelap & Mendalam)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
  ];

  // Helpers API calls & Audio Conversion
  const pcmToWav = (pcmBase64: string, sampleRate = 24000) => {
    const binaryString = atob(pcmBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    const pcmData = new Int16Array(bytes.buffer);
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, pcmData.length * 2, true);
    const wavBytes = new Uint8Array(44 + pcmData.length * 2);
    wavBytes.set(new Uint8Array(wavHeader), 0);
    wavBytes.set(new Uint8Array(pcmData.buffer), 44);
    return new Blob([wavBytes], { type: 'audio/wav' });
  };

  const handleToggleSpeech = async () => {
    if (audioUrl) {
      if (audioRef.current) {
        if (isAudioPlaying) {
          audioRef.current.pause();
          if (bgmRef.current) bgmRef.current.pause();
        } else {
          audioRef.current.play();
          if (bgmRef.current && bgm !== 'none') bgmRef.current.play();
        }
      }
      return;
    }

    setIsAudioLoading(true);
    try {
      const prompt = `Ucapkan kalimat filosofis ini dengan tempo natural, artikulasi jelas, dramatis, dan penuh penjiwaan: "${result.script}"`;
      
      let voiceName = 'Fenrir';
      if (voice === 'Auto') {
        const femaleKeywords = ['Ibu', 'Dewi', 'Ratu', 'Penari'];
        const isFemale = femaleKeywords.some(kw => activeChar.includes(kw));
        voiceName = isFemale ? 'Aoede' : 'Fenrir';
      } else {
        voiceName = voice;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: prompt,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName }
            }
          }
        }
      });
      const pcmBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!pcmBase64) throw new Error("Gagal mengambil data suara");

      const wavBlob = pcmToWav(pcmBase64, 24000);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      let selectedBgm = bgm;
      if (bgm === 'Auto') {
        const charData = characters.find(c => c.name === activeChar);
        selectedBgm = charData ? charData.vibe : 'ambient';
      }
      
      if (selectedBgm !== 'none' && bgmRef.current) {
        const bgmTrack = bgmOptions.find(b => b.id === selectedBgm);
        if (bgmTrack && bgmTrack.url) {
          bgmRef.current.src = bgmTrack.url;
          bgmRef.current.volume = 0.15; 
        }
      }

      setTimeout(() => {
        if (audioRef.current) audioRef.current.play();
        if (bgmRef.current && selectedBgm !== 'none') bgmRef.current.play();
      }, 100);

    } catch (err) {
      console.error(err);
      setError("Gagal membangkitkan suara nurani. Coba lagi.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    if (bgmRef.current) bgmRef.current.pause();
  };

  const handleCopyCaption = () => {
    if (!result?.caption) return;
    const textArea = document.createElement("textarea");
    textArea.value = result.caption;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleAutoMatch = () => {
    const randomTheme = quickThemes[Math.floor(Math.random() * quickThemes.length)];
    const randomChar = characters[Math.floor(Math.random() * characters.length)].name;
    setTema(randomTheme);
    setActiveChar(randomChar);
  };

  const generateVision = async () => {
    if (!tema || !activeChar) {
      setError("Pilih sosok pencerita dan isi jejak makna dulu, Arsitek!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAudioUrl(null);
    setIsAudioPlaying(false);
    if (bgmRef.current) bgmRef.current.pause();

    try {
      const systemPrompt = `You are a Visual Philosopher and Social Media Expert. Based on a moral theme and character, create:
      1. A short philosophical monologue in Indonesian (max 25 words), spoken strictly from the FIRST-PERSON perspective (using "Aku", "Saya", or "Hamba") of the chosen character archetype, deeply reflecting the moral theme.
      2. A detailed cinematic image prompt (English, 8k, hyper-realistic, dramatic lighting, cultural/ethereal elements).
      3. A highly engaging, emotional social media caption in Indonesian (Instagram/TikTok style) exploring the theme deeply. Include relevant emojis and 5-7 popular hashtags.
      Always respond in strict JSON format: {"script": "...", "visual_prompt": "...", "caption": "..."}`;

      const userQuery = `Tema: "${tema}", Karakter: "${activeChar}". Buat monolog filosofis dan visual prompt yang sangat mendalam.`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              script: { type: Type.STRING },
              visual_prompt: { type: Type.STRING },
              caption: { type: Type.STRING }
            },
            required: ["script", "visual_prompt", "caption"]
          }
        }
      });

      const aiResponseText = textResponse.text;
      if (!aiResponseText) throw new Error("Invalid response from Gemini");
      const aiResponse = JSON.parse(aiResponseText);

      const apiAspectRatio = format === '4:5' ? '3:4' : format; 

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: aiResponse.visual_prompt,
        config: {
          imageConfig: {
            aspectRatio: apiAspectRatio as any
          }
        }
      });

      let base64Image = "";
      const parts = imageResponse.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (!base64Image) throw new Error("Failed to generate image");
      const imageUrl = `data:image/png;base64,${base64Image}`;

      setResult({ script: aiResponse.script, caption: aiResponse.caption, imageUrl: imageUrl, metadata: aiResponse });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal menghubungkan nurani ke server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result?.imageUrl) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `VisionAI_${activeChar.replace(/\s+/g, '_')}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30 p-4 md:p-8 relative">
      
      {/* --- MODAL PANDUAN (TUTORIAL) --- */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowTutorial(false)} className="p-2 bg-black/50 text-zinc-400 hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <h2 className="text-xl font-black uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                <BookOpen size={24} /> Panduan Arsitek
              </h2>
              
              <div className="space-y-6 text-sm text-zinc-300">
                <div className="flex gap-4">
                  <div className="bg-green-500/10 text-green-400 p-3 rounded-xl h-fit"><Wand2 size={20} /></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">1. Ideasi Super Cepat</h3>
                    <p className="text-xs text-zinc-400">Tak perlu bingung. Klik tombol <strong>AUTO</strong> untuk meracik paduan <em>Jejak Makna</em> & <em>Sosok Pencerita</em> secara instan.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-green-500/10 text-green-400 p-3 rounded-xl h-fit"><Zap size={20} /></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">2. Menenun Visual</h3>
                    <p className="text-xs text-zinc-400">Tekan <strong>GENERATE VISI</strong>. AI akan merancang naskah monolog dan melukis gambar sinematik dalam hitungan detik.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-green-500/10 text-green-400 p-3 rounded-xl h-fit"><Volume2 size={20} /></div>
                  <div>
                    <h3 className="font-bold text-white mb-1">3. Menghidupkan Suara</h3>
                    <p className="text-xs text-zinc-400">Setelah gambar muncul, klik ikon <strong>Play (🔊)</strong> di atas teks untuk mendengar sosok tersebut berbicara diiringi musik latar.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-zinc-800 text-zinc-300 p-3 rounded-xl h-fit"><Play size={20} /></div>
                  <div>
                    <h3 className="font-bold text-white mb-1 text-green-400">Pro-Tip: Membuat Video Lip-Sync</h3>
                    <p className="text-xs text-zinc-400">Ingin bibirnya bergerak? Download hasil gambar ini, salin teksnya, dan gunakan alat AI pembuat avatar seperti <strong>Hedra</strong> atau <strong>D-ID</strong>.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowTutorial(false)}
                className="w-full mt-8 py-4 bg-green-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-green-400 transition-colors active:scale-95"
              >
                Mulai Berkarya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <Cpu size={20} className="text-black -rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Vision <span className="text-green-500">AI</span>
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-[0.2em] font-bold">NURANI VISUAL V4.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold mr-2">
            <span>Engine: Gemini 2.5</span>
            <span>|</span>
            <span>Core: Imagen 4.0</span>
          </div>
          <button 
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-green-400 hover:border-green-500 transition-all active:scale-95"
          >
            <BookOpen size={14} /> <span className="hidden sm:inline">Panduan</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Section: Inputs */}
        <section className="space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-6 md:p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            
            {/* Theme Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
                  <ScrollText size={14} className="text-green-500" /> Jejak Makna
                </label>
                <button onClick={() => setShowThemes(!showThemes)} className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-400 hover:text-green-400 transition-colors">
                  {showThemes ? 'Sembunyikan' : 'Pilih Cepat'} {showThemes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
              {showThemes && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {quickThemes.map((qt, idx) => (
                    <button key={idx} onClick={() => { setTema(qt); setShowThemes(false); }} className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-bold transition-all border ${tema === qt ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'}`}>
                      {qt}
                    </button>
                  ))}
                </div>
              )}
              <textarea value={tema} onChange={(e) => setTema(e.target.value)} className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 h-24 focus:border-green-500/50 outline-none text-sm transition-all resize-none placeholder:text-zinc-700" placeholder="Pilih jejak makna di atas, atau ketik filosofi Anda sendiri di sini..." />
            </div>

            {/* Characters Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
                  <User size={14} className="text-green-500" /> Sosok Pencerita
                </label>
                <button onClick={() => setShowChars(!showChars)} className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-400 hover:text-green-400 transition-colors">
                  {showChars ? 'Sembunyikan' : 'Pilih Sosok'} {showChars ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
              {!showChars && activeChar && (
                <div onClick={() => setShowChars(true)} className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 cursor-pointer hover:border-green-500/60 hover:bg-green-500/20 transition-all animate-in fade-in">
                  <span className="text-xl">{characters.find(c => c.name === activeChar)?.emoji}</span>
                  <span className="text-sm font-bold text-green-400">{activeChar}</span>
                  <span className="ml-auto text-[9px] text-green-500/50 uppercase tracking-widest font-bold">Terpilih</span>
                </div>
              )}
              {!showChars && !activeChar && (
                <div onClick={() => setShowChars(true)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center cursor-pointer hover:border-zinc-700 transition-all text-zinc-500 text-xs animate-in fade-in">
                  Belum ada sosok yang dipilih. Klik untuk memilih.
                </div>
              )}
              {showChars && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  {characters.map((char) => (
                    <button key={char.id} onClick={() => { setActiveChar(char.name); setShowChars(false); }} className={`p-3 rounded-xl text-center text-[10px] transition-all border flex flex-col items-center gap-1 hover:scale-105 active:scale-95 ${activeChar === char.name ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                      <span className="text-base">{char.emoji}</span>
                      <span className="font-medium whitespace-nowrap">{char.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Format Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
                <Layout size={14} className="text-green-500" /> Dimensi Visual
              </label>
              <div className="flex gap-2">
                {['9:16', '4:5', '1:1', '16:9'].map((f) => (
                  <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-3 px-1 rounded-xl text-[9px] font-bold border transition-all ${format === f ? 'bg-zinc-800 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                    {f === '9:16' ? 'Layar Tegak (9:16)' : f === '4:5' ? 'Potret Klasik (4:5)' : f === '1:1' ? 'Simetri (1:1)' : 'Sinematik (16:9)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice & Music Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
                    <Volume2 size={14} className="text-green-500" /> Suara Narator
                  </label>
                  <button onClick={() => setShowVoices(!showVoices)} className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-400 hover:text-green-400 transition-colors">
                    {showVoices ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
                {!showVoices && (
                  <div onClick={() => setShowVoices(true)} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-all">
                    <span className="text-xs font-bold text-zinc-300">{voiceOptions.find(v => v.id === voice)?.name || 'Auto'}</span>
                  </div>
                )}
                {showVoices && (
                  <div className="grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {voiceOptions.map((v) => (
                      <button key={v.id} onClick={() => { setVoice(v.id); setShowVoices(false); }} className={`py-2 px-2 rounded-xl text-[9px] font-bold border transition-all text-center ${voice === v.id ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                        {v.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
                    <Music size={14} className="text-green-500" /> Musik Latar
                  </label>
                  <button onClick={() => setShowBgm(!showBgm)} className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-400 hover:text-green-400 transition-colors">
                    {showBgm ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
                {!showBgm && (
                  <div onClick={() => setShowBgm(true)} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-all">
                    <span className="text-xs font-bold text-zinc-300">{bgmOptions.find(b => b.id === bgm)?.name || 'Auto'}</span>
                  </div>
                )}
                {showBgm && (
                  <div className="grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {bgmOptions.map((b) => (
                      <button key={b.id} onClick={() => { setBgm(b.id); setShowBgm(false); }} className={`py-2 px-2 rounded-xl text-[9px] font-bold border transition-all text-center ${bgm === b.id ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Watermark Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em]">
                <Tag size={14} className="text-green-500" /> Watermark / Branding
              </label>
              <input 
                type="text" 
                value={watermark} 
                onChange={(e) => setWatermark(e.target.value)} 
                placeholder="Contoh: @username atau Nama Brand" 
                className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-4 focus:border-green-500/50 outline-none text-sm transition-all placeholder:text-zinc-700" 
              />
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-xs text-center animate-pulse">{error}</div>}

            <div className="flex gap-3">
              <button onClick={handleAutoMatch} disabled={loading} className={`flex items-center justify-center gap-2 px-5 py-5 rounded-2xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 hover:border-green-500 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} title="Auto Match">
                <Wand2 size={18} className="text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Auto</span>
              </button>
              <button onClick={generateVision} disabled={loading} className={`flex-1 group relative overflow-hidden py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-xl ${loading ? 'bg-zinc-800 cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-400 hover:shadow-green-500/20 active:scale-[0.98]'}`}>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="animate-spin" size={18} /><span>Menenun...</span></> : <><Zap size={18} fill="currentColor" /><span>Generate Visi</span></>}
                </div>
                {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}
              </button>
            </div>
          </div>
        </section>

        {/* Right Section: Visual Result */}
        <section className="flex flex-col items-center justify-center h-full w-full">
          <div className={`relative bg-zinc-900 border-8 border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-700 flex flex-col items-center justify-center ${format === '9:16' ? 'w-full max-w-[360px] aspect-[9/16]' : format === '4:5' ? 'w-full max-w-[400px] aspect-[4/5]' : format === '1:1' ? 'w-full max-w-[400px] aspect-square' : 'w-full max-w-[600px] aspect-[16/9]'}`}>
            {loading && (
              <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center p-10 text-center gap-4 backdrop-blur-sm">
                <div className="relative w-16 h-16"><div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div><div className="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"></div></div>
                <div className="space-y-1"><p className="text-[10px] text-green-500 uppercase tracking-[0.4em] font-black animate-pulse">Menghidupkan Jiwa</p><p className="text-[8px] text-zinc-500 italic">Meresapi dimensi filosofi...</p></div>
              </div>
            )}

            {result ? (
              <>
                <img src={result.imageUrl} className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-1000" alt="AI Vision" />
                
                {/* Watermark Overlay */}
                {watermark && (
                  <div className="absolute top-6 left-0 right-0 flex justify-center z-20 opacity-80">
                    <span className="bg-black/40 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase border border-white/10 shadow-lg">
                      {watermark}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-6 md:bottom-10 inset-x-0 px-4 md:px-6 z-20 animate-in slide-in-from-bottom duration-700 delay-500">
                  <div className="bg-black/60 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 shadow-2xl relative">
                     <button onClick={handleToggleSpeech} disabled={isAudioLoading} className="absolute -top-5 right-4 bg-green-500 text-black p-3 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-110 active:scale-95 transition-all" title="Dengarkan Suara & Musik">
                       {isAudioLoading ? <Loader2 size={16} className="animate-spin" /> : isAudioPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                     </button>
                     <div className="flex justify-center mb-2"><div className="w-8 h-1 bg-green-500/50 rounded-full"></div></div>
                     <p className="text-[10px] md:text-[11px] leading-relaxed italic text-zinc-100 text-center font-medium font-serif">"{result.script}"</p>
                  </div>
                </div>
              </>
            ) : !loading && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 gap-4">
            <ImageIcon size={48} className="text-zinc-800" />
            <p className="text-zinc-600 text-[10px] leading-relaxed uppercase tracking-widest italic font-bold">Hasil visual karakter dan filosofi akan muncul di kanvas ini</p>
          </div>
        )}
      </div>

      {result && (
        <div className={`w-full mt-8 space-y-4 animate-in fade-in duration-1000 ${format === '9:16' ? 'max-w-[360px]' : format === '4:5' ? 'max-w-[400px]' : format === '1:1' ? 'max-w-[400px]' : 'max-w-[600px]'}`}>
          
          {/* Caption Box */}
          <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-zinc-800/50 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-[10px] uppercase font-black text-green-500 tracking-[0.2em]">
                <ScrollText size={14} /> Caption Sosmed
              </label>
              <button onClick={handleCopyCaption} className="text-[9px] uppercase font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-1 bg-zinc-800 px-3 py-1.5 rounded-full hover:bg-zinc-700 active:scale-95">
                {copied ? <><Check size={12} className="text-green-500"/> Disalin</> : <><Copy size={12}/> Salin</>}
              </button>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 max-h-48 overflow-y-auto">
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {result.caption}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-zinc-800/50 space-y-4">
            <div className="flex gap-2">
              <button onClick={downloadImage} className="flex-1 bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg active:scale-95">
                <Download size={14} /> Download HD
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  </main>

      {/* Hidden Audio Players */}
      <audio ref={audioRef} src={audioUrl || undefined} onEnded={handleAudioEnded} onPause={() => setIsAudioPlaying(false)} onPlay={() => setIsAudioPlaying(true)} className="hidden" />
      <audio ref={bgmRef} loop className="hidden" />
    </div>
  );
}
