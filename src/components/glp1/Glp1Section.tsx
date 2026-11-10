import React from 'react';
import { 
  Syringe, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Microscope, 
  MessageCircle, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const Glp1Section: React.FC = () => {
  const labTests = [
    { name: 'HBA1C', ar: 'السكر التراكمي' },
    { name: 'TSH, FT3, FT4', ar: 'وظائف الغدة الدرقية' },
    { name: 'Serum Ferritin', ar: 'مخزون الحديد' },
    { name: 'Serum Amylase', ar: 'إنزيمات البنكرياس' },
    { name: 'Serum Lipase', ar: 'إنزيمات هضم الدهون' },
    { name: 'Uric Acid', ar: 'حمض اليوريك / النقرس' },
    { name: 'CBC', ar: 'صورة دم كاملة' },
    { name: 'Creatinine', ar: 'وظائف الكلى' },
    { name: 'Vit D3', ar: 'فيتامين د' },
    { name: 'Lipid Profile', ar: 'دهون الدم والكوليسترول' }
  ];

  return (
    <section id="glp1" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-rose-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            دليل طبي معتمد
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 flex items-center justify-center gap-2">
            <span>دليل حقن التخسيس (GLP-1)</span>
            <Syringe className="w-8 h-8 text-rose-500" />
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            كل ما تحتاج معرفته علمياً وطبياً عن إبر إنقاص الوزن، الفروق بينها، والتحاليل الإلزامية قبل أخذ أي جرعة.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-rose-50 border-r-4 border-rose-500 p-5 md:p-6 rounded-3xl mb-10 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-rose-900 text-base md:text-lg mb-1">
              تحذير طبي صارم من د. أماني رأفت
            </h3>
            <p className="text-rose-800 text-xs sm:text-sm leading-relaxed font-medium">
              يُمنع تماماً أخذ أي حقن تنحيف دون استشارة طبية مباشرة وإجراء التحاليل المرفقة أدناه! استخدام هذه الحقن بدون نظام غذائي مخصص عالي البروتين يؤدي إلى فقدان حاد في الكتلة العضلية (Sarcopenia)، ترهلات شديدة في الوجه والجسم، وهبوط حاد في الحرق يعقبه ارتداد سريع للوزن.
            </p>
          </div>
        </div>

        {/* Three Injections Cards */}
        <h3 className="font-black text-lg text-slate-900 mb-4 text-right">أشهر الأنواع المعتمدة علمياً</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Ozempic */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Syringe className="w-6 h-6" />
            </div>
            <h4 className="font-black text-xl text-slate-900 mb-1">
              أوزمبيك <span className="text-xs text-gray-400 font-sans block">Ozempic</span>
            </h4>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-3">
              المادة: Semaglutide
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              الأشهر عالمياً، تؤخذ أسبوعياً بجرعات متدرجة تبدأ من 0.25 مجم. تعمل على تقليل الشهية وتنظيم السكر في الدم.
            </p>
          </div>

          {/* Wegovy */}
          <div className="bg-white p-6 rounded-3xl border-2 border-teal-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Syringe className="w-6 h-6" />
            </div>
            <h4 className="font-black text-xl text-slate-900 mb-1">
              ويجوفي <span className="text-xs text-gray-400 font-sans block">Wegovy</span>
            </h4>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 mb-3">
              المادة: Semaglutide (تركيز أعلى)
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              تحتوي على نفس المادة الفعالة لأوزمبيك ولكن بجرعات مخصصة ومصرحة من هيئة الغذاء والدواء (FDA) خصيصاً لعلاج السمنة.
            </p>
          </div>

          {/* Mounjaro */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Syringe className="w-6 h-6" />
            </div>
            <h4 className="font-black text-xl text-slate-900 mb-1">
              مونجارو <span className="text-xs text-gray-400 font-sans block">Mounjaro</span>
            </h4>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 mb-3">
              المادة: Tirzepatide (هرمونين مزدوجين)
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              الجيل الأحدث والأقوى تأثيراً؛ تعمل على مستقبلي GLP-1 و GIP معاً، مما يعطي كبحاً قوياً للجوع ونزولاً أسرع تحت إشراف طبي.
            </p>
          </div>

        </div>

        {/* Pros & Cons and Medical Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Side Effects and Details */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <h4 className="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>كيف تساعدك الحقن عند الالتزام بالدايت؟</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>كبح قوي جداً لشهية السكريات والأكل العاطفي.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>تأخير إفراغ المعدة والشعور بالامتلاء لفترات طويلة.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>تحسين مؤشرات مقاومة الأنسولين والكوليسترول الضار.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>الأعراض الجانبية المتوقعة:</span>
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {['غثيان خفيف في البداية', 'إمساك أو إسهال', 'حموضة وارتجاع', 'صداع ودوخة مؤقتة'].map((s, idx) => (
                  <span key={idx} className="bg-rose-50 text-rose-700 px-3 py-1 rounded-xl text-xs font-bold border border-rose-100">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium leading-relaxed">
                💡 <span className="font-bold">نصيحة دكتورة أماني:</span> للتغلب على هذه الأعراض، قسم وجباتك إلى حصص صغيرة، تجنب الأطعمة الدسمة، وتناول البروتين أولاً مع وفرة من السوائل.
              </p>
            </div>
          </div>

          {/* Required Lab Tests */}
          <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Microscope className="w-6 h-6 text-emerald-400" />
                <h4 className="font-black text-xl">قائمة التحاليل المخبرية المطلوبة</h4>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                قبل كتابة أي جرعة لك، يجب فحص هذه التحاليل للتأكد من سلامة الغدة الدرقية والبنكرياس ووظائف الكلى:
              </p>

              <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm font-bold">
                {labTests.map((test, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <span className="text-emerald-300 font-mono" dir="ltr">{test.name}</span>
                    <span className="text-[11px] text-slate-300">{test.ar}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/201287506835?text=مرحباً%20دكتور%20أماني،%20أريد%20إرسال%20التحاليل%20الطبية%20لمراجعتها%20قبل%20البدء%20في%20كورس%20حقن%20التخسيس."
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال التحاليل للدكتورة عبر الواتساب للمراجعة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
