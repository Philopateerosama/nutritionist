import React from 'react';
import { MessageCircle, Heart, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100 font-sans">
      {/* Contact Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-emerald-800 to-green-700 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-right">
            <div>
              <span className="bg-white/20 text-white text-xs font-black px-3.5 py-1.5 rounded-full inline-block mb-3">
                متاح الآن حجوزات برامج التغذية الجديدة
              </span>
              <h3 className="text-2xl sm:text-4xl font-black mb-3">
                جاهز تبدأ رحلة التغيير وتعيش بصحة أفضل؟
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
                برامج مخصصة، متابعة دورية بالميزان، شات مباشر مع دكتورة أماني، ونتائج مضمونة بدون حرمان.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href="https://wa.me/201287506835?text=مرحباً%20دكتور%20أماني،%20أريد%20الاستفسار%20عن%20تفاصيل%20الاشتراك%20والمتابعة."
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#1ebd5a] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-xl" />
                <span>تواصل للاشتراك عبر الواتساب</span>
              </a>

              <a
                href="#calculator"
                className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition active:scale-95 flex items-center justify-center"
              >
                احسب سعراتك مجاناً
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links & Social */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/logo_bacff5b8.png"
              alt="Eat Smart"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="font-black text-sm text-slate-800">Eat Smart - د. أماني رأفت</p>
              <p className="text-[10px] text-gray-400">عيادة التغذية العلاجية وإدارة الوزن</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/201287506835"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white transition"
              title="واتساب"
            >
              <i className="fa-brands fa-whatsapp text-lg" />
            </a>

            <a
              href="https://www.instagram.com/dramanyraafat_nutritionist?igsh=MTIwem0zcXg0NXRpMA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gradient-to-tr hover:from-amber-400 hover:via-rose-500 hover:to-purple-600 hover:text-white transition"
              title="إنستجرام"
            >
              <i className="fa-brands fa-instagram text-lg" />
            </a>

            <a
              href="https://www.facebook.com/share/1C8KGQFCa7/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition"
              title="فيسبوك"
            >
              <i className="fa-brands fa-facebook-f text-lg" />
            </a>

            <a
              href="https://www.tiktok.com/@amanyraafat5?_r=1&_t=ZS-98Byh8SuJ08"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-black hover:text-white transition"
              title="تيك توك"
            >
              <i className="fa-brands fa-tiktok text-lg" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          <p>© {new Date().getFullYear()} Eat Smart - جميع الحقوق محفوظة لدكتور أماني رأفت.</p>
        </div>
      </div>
    </footer>
  );
};
