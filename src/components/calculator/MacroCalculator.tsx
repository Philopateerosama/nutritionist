import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/errorHandler';
import { 
  Calculator, 
  Sparkles, 
  Weight, 
  Ruler, 
  Calendar, 
  Activity, 
  CheckCircle, 
  Flame, 
  Drumstick, 
  Wheat, 
  Droplets,
  Share2
} from 'lucide-react';

interface MacroCalculatorProps {
  onReportSaved?: () => void;
}

export const MacroCalculator: React.FC<MacroCalculatorProps> = ({ onReportSaved }) => {
  const { user, userProfile, updateUserData } = useAuth();

  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [age, setAge] = useState<number>(userProfile?.currentWeight ? 28 : 26);
  const [weight, setWeight] = useState<number>(userProfile?.currentWeight || 75);
  const [height, setHeight] = useState<number>(userProfile?.height || 165);
  const [activity, setActivity] = useState<number>(1.55);

  const [calculated, setCalculated] = useState(false);
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<{ text: string; color: string; bg: string }>({
    text: '',
    color: '',
    bg: ''
  });
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fats, setFats] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const heightInMeters = height / 100;
    const calculatedBmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    setBmi(calculatedBmi);

    let cat = { text: 'وزن مثالي وطبيعي', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
    if (calculatedBmi < 18.5) {
      cat = { text: 'نقص في الوزن (نحافة)', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
    } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
      cat = { text: 'زيادة في الوزن', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
    } else if (calculatedBmi >= 30) {
      cat = { text: 'سمنة (تتطلب متابعة دقيقة)', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
    }
    setBmiCategory(cat);

    // Mifflin-St Jeor Equation for BMR
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    let tdee = bmr * activity;
    let finalCals = tdee;

    if (goal === 'lose') finalCals -= 500;
    else if (goal === 'gain') finalCals += 300;

    if (gender === 'female' && finalCals < 1200) finalCals = 1200;
    if (gender === 'male' && finalCals < 1500) finalCals = 1500;

    const roundedCals = Math.round(finalCals);
    setCalories(roundedCals);

    let proGrams = 0;
    let fatGrams = 0;

    if (goal === 'lose') {
      proGrams = weight * 2.2;
      fatGrams = (roundedCals * 0.25) / 9;
    } else if (goal === 'gain') {
      proGrams = weight * 2.0;
      fatGrams = (roundedCals * 0.25) / 9;
    } else {
      proGrams = weight * 1.8;
      fatGrams = (roundedCals * 0.3) / 9;
    }

    const proCals = proGrams * 4;
    const fatCals = fatGrams * 9;
    const carbGrams = Math.max(20, (roundedCals - (proCals + fatCals)) / 4);

    setProtein(Math.round(proGrams));
    setFats(Math.round(fatGrams));
    setCarbs(Math.round(carbGrams));
    setCalculated(true);
    setSavedSuccess(false);

    // Smooth scroll down to result
    setTimeout(() => {
      document.getElementById('calc-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveToProfileAndDoctor = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Update user profile
      await updateUserData({
        currentWeight: weight,
        height,
        goal
      });

      // 2. Save new report to reports collection
      const reportData = {
        userId: user.uid,
        userName: userProfile?.name || 'مشترك',
        userEmail: user.email || '',
        date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium' }),
        weight,
        bmi,
        caloriesTarget: calories,
        waterLiters: Number(((weight * 35) / 1000).toFixed(1)),
        notes: `الهدف: ${goal === 'lose' ? 'تخسيس ونزول وزن' : goal === 'gain' ? 'بناء عضل' : 'تثبيت وزن'} | بروتين: ${protein}g | كارب: ${carbs}g | دهون: ${fats}g`,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reports'), reportData);
      setSavedSuccess(true);
      if (onReportSaved) onReportSaved();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reports');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="calculator" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            أدوات دكتور أماني رأفت
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
            حاسبة السعرات والماكروز الذكية 🎯
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            أدخل قياساتك لمعرفة مؤشر كتلة جسمك (BMI) واحتياجك اليومي من السعرات والبروتين بدقة، مع إمكانية حفظ النتيجة ومشاركتها مع الدكتورة.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl p-6 sm:p-10 border border-gray-100">
          <form onSubmit={handleCalculate} className="space-y-8">
            
            {/* Gender & Goal Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-3">النوع</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`p-4 rounded-2xl border-2 font-black text-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                      gender === 'female'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">♀</span>
                    <span>أنثى</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`p-4 rounded-2xl border-2 font-black text-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                      gender === 'male'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">♂</span>
                    <span>ذكر</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-3">هدفك الأساسي</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'lose', label: 'تخسيس', icon: '📉' },
                    { id: 'maintain', label: 'تثبيت', icon: '⚖️' },
                    { id: 'gain', label: 'بناء عضل', icon: '💪' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id as any)}
                      className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer transition ${
                        goal === item.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs: Age, Weight, Height */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">العمر</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={12}
                    max={100}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-12 py-3.5 font-black text-slate-800 text-lg focus:outline-none focus:border-emerald-600 transition"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">سنة</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">الوزن الحالي</label>
                <div className="relative">
                  <Weight className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min={30}
                    max={250}
                    step="0.5"
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-12 py-3.5 font-black text-slate-800 text-lg focus:outline-none focus:border-emerald-600 transition"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">كجم</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">الطول</label>
                <div className="relative">
                  <Ruler className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={100}
                    max={230}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-12 py-3.5 font-black text-slate-800 text-lg focus:outline-none focus:border-emerald-600 transition"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">سم</span>
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-2">معدل النشاط الحركي</label>
              <div className="relative">
                <Activity className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={activity}
                  onChange={(e) => setActivity(Number(e.target.value))}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pr-11 pl-6 py-3.5 font-bold text-slate-800 text-sm focus:outline-none focus:border-emerald-600 transition appearance-none cursor-pointer"
                >
                  <option value={1.2}>قليل الحركة (عمل مكتبي بدون تمارين)</option>
                  <option value={1.375}>نشاط خفيف (تمارين خفيفة 1-3 أيام بالأسبوع)</option>
                  <option value={1.55}>نشاط متوسط (تمارين 3-5 أيام بالأسبوع)</option>
                  <option value={1.725}>نشيط جداً (تمارين شاقة 6-7 أيام بالأسبوع)</option>
                  <option value={1.9}>رياضي محترف (تمارين شاقة يومياً أو عمل بدني قوي)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-slate-900/15 active:scale-98 transition cursor-pointer"
            >
              <span>احسب النتيجة والماكروز الآن</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          {/* Results Output */}
          {calculated && (
            <div id="calc-results" className="mt-10 pt-10 border-t-2 border-gray-100">
              <h3 className="text-center font-black text-2xl text-slate-900 mb-6">نتيجتك المخصصة</h3>

              {/* BMI Card */}
              <div className="bg-white border-2 border-gray-100 rounded-3xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${bmiCategory.bg}`}>
                    <Weight className="w-7 h-7 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">مؤشر كتلة الجسم (BMI)</p>
                    <p className="text-3xl font-black text-slate-900">{bmi}</p>
                  </div>
                </div>
                <div className={`px-5 py-2.5 rounded-xl text-sm font-black border-2 ${bmiCategory.bg} ${bmiCategory.color}`}>
                  {bmiCategory.text}
                </div>
              </div>

              {/* Calories Target Card */}
              <div className="bg-gradient-to-r from-emerald-700 to-green-600 rounded-3xl p-8 text-white text-center mb-6 shadow-xl shadow-emerald-700/20">
                <p className="text-sm font-bold opacity-90 mb-1">سعراتك اليومية المقترحة للوصول لهدفك</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-black tracking-tight">{calories}</span>
                  <span className="text-lg font-bold opacity-80">سعر حراري / يوم</span>
                </div>
                <p className="text-xs opacity-75 mt-2">
                  محسوبة بمعادلة Mifflin-St Jeor الطبية المعتمدة
                </p>
              </div>

              {/* Macros Breakdown */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                    <Drumstick className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-500">البروتين</p>
                  <p className="text-xl font-black text-blue-700">{protein}g</p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-2">
                    <Wheat className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-500">الكربوهيدرات</p>
                  <p className="text-xl font-black text-amber-700">{carbs}g</p>
                </div>

                <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 mx-auto bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-2">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-500">دهون صحية</p>
                  <p className="text-xl font-black text-rose-700">{fats}g</p>
                </div>
              </div>

              {/* Save to Firestore button */}
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 text-center">
                <p className="text-xs sm:text-sm text-emerald-900 font-bold mb-3">
                  تريد حفظ هذه النتيجة في ملفك ومشاركتها مع دكتور أماني رأفت للمتابعة؟
                </p>
                <button
                  type="button"
                  onClick={handleSaveToProfileAndDoctor}
                  disabled={saving || savedSuccess}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : savedSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>تم الحفظ والمشاركة بنجاح في تقاريرك!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>حفظ النتيجة ومشاركتها مع الدكتورة</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};
