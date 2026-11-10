import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Flame, Dumbbell, Star, ArrowLeft, Calculator, MessageCircle } from 'lucide-react';

interface HeroSectionProps {
  onOpenCalculator: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCalculator, onOpenChat }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      if (!videoRef.current.muted && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-white font-sans">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 -right-4 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span>نستقبل الآن حجوزات الشهر الجديد مع د. أماني رأفت</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 md:mb-6 text-slate-900">
              حقق حلمك بجسم مثالي وصحة حديد <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-600 to-green-500">
                مع دكتور أماني رأفت
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              سواء كان هدفك نزول الوزن، بناء العضلات، أو تحسين صحتك والتخلص من مقاومة الأنسولين، سأقدم لك برامج مخصصة تناسب أسلوب حياتك بدون حرمان أو ملل.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 md:gap-4">
              <button
                onClick={onOpenChat}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-base hover:bg-slate-800 shadow-xl shadow-slate-900/15 active:scale-95 transition flex items-center justify-center gap-3 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>ابدأ الشات والمتابعة الطبية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="bg-white text-emerald-700 border-2 border-emerald-600 px-8 py-4 rounded-2xl font-black text-base hover:bg-emerald-50 active:scale-95 transition flex items-center justify-center gap-3 shadow-lg shadow-emerald-50 cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                <span>احسب سعراتك بدقة</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex flex-row items-center justify-center lg:justify-start gap-4 text-gray-600">
              <div className="flex -space-x-3 space-x-reverse">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="user"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
                  alt="user"
                />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-800 shadow-sm">
                  +5K
                </div>
              </div>
              <div className="text-right">
                <div className="flex text-amber-400 text-xs mb-0.5 justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-700">آلاف المشتركين حققوا أهدافهم</p>
              </div>
            </div>
          </div>

          {/* Video / Visual */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-slate-900 group">
              <video
                ref={videoRef}
                src="/assets/aistudio/hero-video_df6c7e1b.mp4"
                playsInline
                autoPlay
                loop
                muted={isMuted}
                className="w-full object-cover h-[340px] sm:h-[420px] lg:h-[540px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-11 h-11 flex items-center justify-center rounded-full z-30 backdrop-blur-md transition border border-white/20 cursor-pointer shadow-lg"
                title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between pointer-events-none">
                <span className="font-bold">فيديو تعريفي مع د. أماني رأفت</span>
                <span className="text-[10px] text-emerald-300 font-mono">Eat Smart System</span>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -bottom-4 -right-2 md:bottom-8 md:-right-6 bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-gray-100">
              <div className="bg-rose-50 text-rose-600 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold">معدل حرق دهون متوازن</p>
                <p className="text-sm md:text-base font-black text-slate-900">-5 كجم شهرياً بدون ترهل</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute top-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl z-20 items-center gap-3 border border-gray-100">
              <div className="bg-blue-50 text-blue-600 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold">بناء وتدعيم الكتلة العضلية</p>
                <p className="text-sm font-black text-slate-900">حماية عضلية مستمرة</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
