import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User as UserIcon, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('يرجى كتابة الاسم بالكامل');
        }
        await signupWithEmail(email, password, name.trim());
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ، يرجى المحاولة ثانية');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول بحساب Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-emerald-100 flex items-center justify-center p-4 py-8 relative overflow-hidden font-sans">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side: Brand & Visuals */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/assets/aistudio/logo_bacff5b8.png"
                alt="Eat Smart Logo"
                className="h-16 w-auto bg-white/95 p-2 rounded-2xl shadow-lg"
              />
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block">منصة المتابعة الطبية</span>
                <h1 className="text-xl font-black">Eat Smart</h1>
              </div>
            </div>

            <div className="space-y-4 my-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                تحت إشراف د. أماني رأفت
              </div>
              <h2 className="text-2xl font-black leading-tight">
                أهلاً بك في منصتك الخاصة للوصول للجسم المثالي والصحة الحديد
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                سجّل الدخول لتصفح الوصفات الذكية، حاسبة السعرات، والمتابعة بالشات المباشر مع الدكتورة.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حسابات مؤمنة عبر Firebase Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شات واستشارات طبية مشفرة ومباشرة مع الطبيب</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>لوحة تحكم كاملة ومتابعة دورية للوزن والماكروز</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-slate-400 text-xs flex justify-between items-center relative z-10">
            <span>© موقع دكتور أماني رأفت</span>
            <span className="text-emerald-400 font-mono">v2.0 Firebase</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-2xl flex w-full max-w-sm">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${
                  isLogin
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all ${
                  !isLogin
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                إنشاء حساب جديد
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">الاسم بالكامل</label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سارة محمد"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                  dir="ltr"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  dir="ltr"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition text-left"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">6 أحرف أو أرقام على الأقل</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl font-black text-base shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'دخول الحساب' : 'إنشاء حساب جديد'}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-bold text-gray-400 uppercase">أو المتابعة عبر</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-slate-800 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>تسجيل الدخول بحساب Google</span>
          </button>

          {/* Admin badge tip */}
          <div className="mt-6 p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">حسابات الإدارة والأطباء:</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                حساب الأدمن مرتبط بـ <span className="font-mono font-bold text-amber-950">philopateerosama2004@gmail.com</span> للدخول مباشرة كطبيب وإدارة محتوى الموقع والرد على الشات.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
