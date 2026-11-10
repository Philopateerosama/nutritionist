import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/errorHandler';
import { Article } from '../../types';
import { INITIAL_ARTICLES } from '../../data/initialData';
import { 
  BookOpen, 
  Clock, 
  Plus, 
  Trash2, 
  X, 
  Sparkles, 
  ArrowLeft,
  Calendar,
  Share2
} from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Admin Add Article State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('تغذية علاجية');
  const [formReadTime, setFormReadTime] = useState('3 دقائق');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/assets/aistudio/chicken_potato_27fb23c9.jpg');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const colRef = collection(db, 'articles');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const loaded: Article[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Article, 'id'>) });
        });

        if (loaded.length === 0) {
          setArticles(INITIAL_ARTICLES.map((a, i) => ({ ...a, id: `seed-art-${i}` })));
        } else {
          setArticles(loaded);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'articles');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDeleteArticle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      if (id.startsWith('seed-art-')) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        await deleteDoc(doc(db, 'articles', id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `articles/${id}`);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSubmitting(true);

    try {
      const newArticleData: Omit<Article, 'id'> = {
        title: formTitle.trim(),
        category: formCategory.trim() || 'تغذية علاجية',
        summary: formSummary.trim(),
        content: formContent.trim(),
        readTime: formReadTime.trim() || '3 دقائق',
        authorName: 'د. أماني رأفت',
        imageUrl: formImageUrl.trim() || '/assets/aistudio/chicken_potato_27fb23c9.jpg',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'articles'), newArticleData);
      setShowAddModal(false);
      setFormTitle('');
      setFormSummary('');
      setFormContent('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'articles');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="articles" className="py-16 md:py-24 bg-slate-50 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            المعرفة أساس الاستمرار
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 flex items-center justify-center gap-2">
            <span>المقالات التوعوية والنصائح الطبية</span>
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            مقالات حصرية من د. أماني رأفت تشرح لك أسرار الحرق، الصيام المتقطع، ضبط مقاومة الأنسولين، وكيف تتجنب أخطاء الدايت الشائعة.
          </p>

          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مقال توعوي جديد (خاص بالأدمن)</span>
              </button>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer flex flex-col group relative"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/chicken_potato_27fb23c9.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />

                <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                  {article.category}
                </div>

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{article.readTime}</span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteArticle(article.id, e)}
                    className="absolute top-3 left-3 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-md transition z-20"
                    title="حذف المقال"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg mb-2.5 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{article.authorName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>قراءة المقال</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="relative h-60 bg-slate-900 shrink-0">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 right-6 left-6 text-white">
                <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full inline-block mb-2">
                  {selectedArticle.category}
                </span>
                <h3 className="font-black text-xl sm:text-2xl leading-tight">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span>بقلم {selectedArticle.authorName}</span>
                  <span>•</span>
                  <span>وقت القراءة: {selectedArticle.readTime}</span>
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 text-xs sm:text-sm font-bold text-emerald-900 leading-relaxed">
                📌 <span className="font-black">خلاصة المقال: </span>
                {selectedArticle.summary}
              </div>

              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {selectedArticle.content}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold">Eat Smart Medical Blog</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition"
                >
                  إغلاق المقال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="font-black text-xl text-slate-900">نشر مقال توعوي جديد</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">عنوان المقال</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: كيف تكسر ثبات الوزن في 3 خطوات بسيطة؟"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">التصنيف</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="تغذية علاجية، صيام، حقن تخسيس..."
                    required
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">مدة القراءة</label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="مثال: 3 دقائق"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
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
                <label className="block text-xs font-black text-slate-700 mb-1">ملخص قصير</label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="ملخص يظهر في البطاقة للمشتركين"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">محتوى المقال كاملاً</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={6}
                  placeholder="اكتب تفاصيل المقال، النقاط التوعوية، والنصائح..."
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
                  {submitting ? 'جاري النشر...' : 'نشر المقال الآن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
