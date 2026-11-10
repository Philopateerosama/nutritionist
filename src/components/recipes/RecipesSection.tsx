import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/errorHandler';
import { Recipe } from '../../types';
import { INITIAL_RECIPES } from '../../data/initialData';
import { 
  Utensils, 
  Flame, 
  Clock, 
  Plus, 
  Trash2, 
  X, 
  Scale, 
  Check, 
  ChefHat,
  Filter
} from 'lucide-react';

export const RecipesSection: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Admin Add/Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [formCalories, setFormCalories] = useState<number>(380);
  const [formProtein, setFormProtein] = useState<number>(30);
  const [formCarbs, setFormCarbs] = useState<number>(40);
  const [formFat, setFormFat] = useState<number>(8);
  const [formTime, setFormTime] = useState('20 دقيقة');
  const [formImageUrl, setFormImageUrl] = useState('/assets/aistudio/chicken_potato_27fb23c9.jpg');
  const [formIngredientsText, setFormIngredientsText] = useState('150 جم صدر دجاج مشوي\n100 جم أرز بسمتي مسلوق\nطبق سلطة خضراء كبير');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const colRef = collection(db, 'recipes');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const loaded: Recipe[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Recipe, 'id'>) });
        });

        // Fallback to initial recipes if empty yet
        if (loaded.length === 0) {
          setRecipes(INITIAL_RECIPES.map((r, i) => ({ ...r, id: `seed-${i}` })));
        } else {
          setRecipes(loaded);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'recipes');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredRecipes = recipes.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'under400') return r.calories < 400;
    return r.category === activeFilter;
  });

  const handleDeleteRecipe = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!window.confirm('هل أنت متأكد من حذف هذه الوجبة؟')) return;

    try {
      if (id.startsWith('seed-')) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      } else {
        await deleteDoc(doc(db, 'recipes', id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `recipes/${id}`);
    }
  };

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !user) return;
    setSubmitting(true);

    try {
      const ingredients = formIngredientsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const newRecipeData: Omit<Recipe, 'id'> = {
        title: formTitle.trim(),
        category: formCategory,
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        prepTime: formTime.trim() || '15 دقيقة',
        imageUrl: formImageUrl.trim() || '/assets/aistudio/chicken_potato_27fb23c9.jpg',
        ingredients: ingredients.length > 0 ? ingredients : ['مقادير صحية متوازنة بالجرام'],
        authorId: user.uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'recipes'), newRecipeData);
      setShowAddModal(false);
      // Reset form
      setFormTitle('');
      setFormCalories(350);
      setFormProtein(30);
      setFormCarbs(35);
      setFormFat(8);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'recipes');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="recipes" className="py-16 md:py-24 bg-white relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            بدون حرمان أو تجويع
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 flex items-center justify-center gap-2">
            <span>وصفات ووجبات ذكية ولذيذة</span>
            <ChefHat className="w-8 h-8 text-emerald-600" />
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            استمتع بأكلك المفضل (كشري، بشاميل، كبدة، شوفان، وسلطات) بطريقة صحية مدروسة ومحسوبة الماكروز بالميزان.
          </p>

          {/* Admin Add Recipe Button */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة وجبة ذكية جديدة (خاص بالأدمن)</span>
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2.5 justify-start md:justify-center mb-10 pb-2 px-1">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'breakfast', label: 'إفطار' },
            { id: 'lunch', label: 'غداء' },
            { id: 'dinner', label: 'عشاء' },
            { id: 'under400', label: '🔥 أقل من 400 سعر' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer group flex flex-col relative"
            >
              {/* Image & Badges */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/chicken_potato_27fb23c9.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Calories badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-emerald-800 px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{recipe.calories} سعر</span>
                </div>

                {/* Prep time badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{recipe.prepTime}</span>
                </div>

                {/* Admin Delete button */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                    className="absolute top-3 left-3 bg-rose-600/90 hover:bg-rose-700 text-white p-2 rounded-full shadow-md transition z-20"
                    title="حذف الوجبة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="font-black text-slate-900 text-base mb-4 line-clamp-2 leading-snug">
                  {recipe.title}
                </h3>

                {/* Macros Pills */}
                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-2xl border border-gray-100 mt-auto">
                  <div className="text-center w-1/3">
                    <span className="block text-[10px] text-gray-500 font-bold mb-0.5">بروتين</span>
                    <span className="font-black text-xs sm:text-sm text-blue-700">{recipe.protein}g</span>
                  </div>
                  <div className="w-px h-5 bg-gray-200" />
                  <div className="text-center w-1/3">
                    <span className="block text-[10px] text-gray-500 font-bold mb-0.5">كارب</span>
                    <span className="font-black text-xs sm:text-sm text-amber-700">{recipe.carbs}g</span>
                  </div>
                  <div className="w-px h-5 bg-gray-200" />
                  <div className="text-center w-1/3">
                    <span className="block text-[10px] text-gray-500 font-bold mb-0.5">دهون</span>
                    <span className="font-black text-xs sm:text-sm text-rose-600">{recipe.fat}g</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="relative h-56 bg-slate-100 shrink-0">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-4 left-4 text-white">
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {selectedRecipe.calories} سعر حراري
                </span>
                <h3 className="font-black text-xl leading-tight">{selectedRecipe.title}</h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Macros Breakdown */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-gray-100 text-center">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">بروتين صافي</span>
                  <span className="font-black text-base text-blue-700">{selectedRecipe.protein}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">كربوهيدرات</span>
                  <span className="font-black text-base text-amber-700">{selectedRecipe.carbs}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">دهون صحية</span>
                  <span className="font-black text-base text-rose-600">{selectedRecipe.fat}g</span>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  <span>المقادير الدقيقة (بالميزان الجرام):</span>
                </h4>
                <ul className="space-y-2.5">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition cursor-pointer"
              >
                إغلاق وتصفح باقي الوصفات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="font-black text-xl text-slate-900">إضافة وجبة ذكية جديدة</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddRecipe} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">اسم الوجبة</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: طاجن سمك فيليه بالليمون والخضار"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">القسم</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
                  >
                    <option value="breakfast">إفطار</option>
                    <option value="lunch">غداء</option>
                    <option value="dinner">عشاء</option>
                    <option value="snack">سناك</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">وقت التحضير</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="مثال: 15 دقيقة"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">السعرات</label>
                  <input
                    type="number"
                    value={formCalories}
                    onChange={(e) => setFormCalories(Number(e.target.value))}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">بروتين (جم)</label>
                  <input
                    type="number"
                    value={formProtein}
                    onChange={(e) => setFormProtein(Number(e.target.value))}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">كارب (جم)</label>
                  <input
                    type="number"
                    value={formCarbs}
                    onChange={(e) => setFormCarbs(Number(e.target.value))}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">دهون (جم)</label>
                  <input
                    type="number"
                    value={formFat}
                    onChange={(e) => setFormFat(Number(e.target.value))}
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-2.5 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">مسار أو رابط الصورة</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  dir="ltr"
                  placeholder="/assets/aistudio/... أو https://..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">المقادير (سطر لكل مكون بالميزان)</label>
                <textarea
                  value={formIngredientsText}
                  onChange={(e) => setFormIngredientsText(e.target.value)}
                  rows={4}
                  placeholder="150 جم لحم صافي مفروم&#10;50 جم خبز بلدي&#10;ملعقة طحينة صغيرة"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 text-xs font-medium"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-slate-700 rounded-xl font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ ونشر الوجبة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
