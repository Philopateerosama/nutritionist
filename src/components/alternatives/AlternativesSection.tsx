import React, { useState } from 'react';
import { 
  ChevronDown, 
  Milk, 
  Wheat, 
  Drumstick, 
  Apple, 
  Coffee, 
  Check, 
  Ban, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface AlternativeItem {
  id: string;
  title: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  content: React.ReactNode;
}

export const AlternativesSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('dairy');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const items: AlternativeItem[] = [
    {
      id: 'dairy',
      title: 'بدائل الحليب ومنتجات الألبان',
      icon: Milk,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      content: (
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700">
            1 كوب لبن (240 مللي)
          </span>
          <span className="text-emerald-600 font-black text-sm">=</span>
          <span className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800">
            كوب زبادي صغير (180 مللي)
          </span>
          <span className="text-emerald-600 font-black text-sm">=</span>
          <span className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800">
            شريحة جبن شيدر طبيعي (30 جم)
          </span>
        </div>
      )
    },
    {
      id: 'carbs',
      title: 'بدائل النشويات والكربوهيدرات',
      icon: Wheat,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">ربع رغيف بلدي</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">1 شريحة توست بني</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">نصف كوب (شوفان / ذرة / فريك / برغل / بليلة)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">3 أكواب فشار بدون زيت مفرط</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">نصف كوز ذرة مشوي</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">نصف كوب بقوليات (فول / عدس / فاصوليا)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">ثلث كوب أرز أو مكرونة مطبوخة (5 معالق)</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">حبة بطاطس متوسطة مسلوقة أو مشوية في الإيرفراير</span>
          </div>
        </div>
      )
    },
    {
      id: 'protein',
      title: 'بدائل البروتين الحيواني والنباتي',
      icon: Drumstick,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">1 بيضة مسلوقة كاملة</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">ربع كوب جبنة قريش (50 جم)</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">2 ملعقة طعام جبنة بيضاء قليلة الملح</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">حجم أصبعين من (لحم صافي / فراخ / سمك فيليه)</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">5 حبات جمبري مشوي</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">علبة تونة مصفاة من الزيت أو نصف كوب مشروم</span>
          </div>
        </div>
      )
    },
    {
      id: 'fruits',
      title: 'بدائل الفواكه والخضروات المفتوحة',
      icon: Apple,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">1 ثمرة متوسطة (تفاح / كمثرى / برتقال / جوافة)</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">نصف ثمرة (موز / مانجا)</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">3 إلى 5 حبات تمر</span>
          </div>
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
            <p className="font-black text-xs sm:text-sm text-emerald-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>الخضروات الورقية المفتوحة (بأي كمية بدون حساب):</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              الخس، الكابوتشي، الجرجير، البقدونس، الكرفس، الخيار، الفجل، السبانخ النيئة. مليئة بالألياف وتبطئ امتصاص السكر.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'fats',
      title: 'الدهون الصحية والمشروبات والممنوعات',
      icon: Coffee,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">معلقة صغيرة زيت زيتون أو سمن بلدي</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-700">6 حبات مكسرات نية (لوز / جوز)</span>
            <span className="text-emerald-600 font-black text-xs">=</span>
            <span className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800">8 حبات زيتون أسود أو ملعقتين طحينة صغيرة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl">
              <h4 className="font-black text-xs sm:text-sm text-emerald-800 mb-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>المشروبات المسموحة بحرية:</span>
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                المياه، القهوة السادة، الشاي الأخضر، ليمون بدون سكر، يانسون، كركديه، نعناع، قرفة.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl">
              <h4 className="font-black text-xs sm:text-sm text-rose-800 mb-1 flex items-center gap-1">
                <Ban className="w-4 h-4" />
                <span>أشياء نبتعد عنها للنتائج السريعة:</span>
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                السكر الأبيض الزائد، المخبوزات المصنعة، المقليات العميقة، الكريمر الصناعي، والصودا.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="alternatives" className="py-16 md:py-24 bg-white relative font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-14">
          <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            الدايت مش حرمان
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 flex items-center justify-center gap-2">
            <span>دليل البدائل الذكية</span>
            <ArrowRightLeft className="w-8 h-8 text-emerald-600" />
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            نفسك في صنف ومش متوفر عندك؟ اختار بديله من القائمة دي بنفس السعرات والقيمة الغذائية بدون ما تكسر نظامك!
          </p>
        </div>

        <div className="space-y-3.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/50 shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full px-5 py-4 sm:p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-slate-800 text-sm sm:text-base text-right">
                      {item.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 py-4 sm:p-6 border-t border-gray-100 bg-white">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
