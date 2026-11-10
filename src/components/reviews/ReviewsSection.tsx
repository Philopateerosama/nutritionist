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
import { Review } from '../../types';
import { INITIAL_REVIEWS } from '../../data/initialData';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  X, 
  ArrowLeftRight, 
  MessageSquare, 
  ZoomIn,
  Sparkles
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  // Admin Add Review Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [weightLost, setWeightLost] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/aistudio/1_df3f0600.jpg');
  const [source, setSource] = useState<'whatsapp' | 'instagram' | 'tiktok' | 'direct'>('whatsapp');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const colRef = collection(db, 'reviews');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const loaded: Review[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Review, 'id'>) });
        });

        if (loaded.length === 0) {
          setReviews(INITIAL_REVIEWS.map((r, i) => ({ ...r, id: `seed-rev-${i}` })));
        } else {
          setReviews(loaded);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'reviews');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDeleteReview = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (!window.confirm('هل أنت متأكد من حذف هذا الرأي؟')) return;

    try {
      if (id.startsWith('seed-rev-')) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        await deleteDoc(doc(db, 'reviews', id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSubmitting(true);

    try {
      const newReviewData: Omit<Review, 'id'> = {
        clientName: clientName.trim(),
        weightLost: weightLost.trim(),
        story: story.trim(),
        imageUrl: imageUrl.trim() || '/assets/aistudio/1_df3f0600.jpg',
        source,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reviews'), newReviewData);
      setShowAddModal(false);
      setClientName('');
      setWeightLost('');
      setStory('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="success" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-emerald-400 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            قصص وتجارب حقيقية
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-3 flex items-center justify-center gap-2">
            <span>أبطال دكتور أماني رأفت</span>
            <Trophy className="w-8 h-8 text-amber-400" />
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            سكرين شوتس ورسائل واتساب موثقة ونتائج واقعية لمشتركينا قبل وبعد الدايت.
          </p>

          <div className="inline-flex items-center gap-2 bg-slate-800/80 text-emerald-400 border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-bold animate-pulse">
            <ArrowLeftRight className="w-4 h-4" />
            <span>اسحب أفقياً لتصفح جميع السكرينات</span>
          </div>

          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سكرين شوت أو قصة نجاح جديدة (خاص بالأدمن)</span>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Carousel */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x snap-mandatory px-2">
          {reviews.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewImg(item.imageUrl)}
              className="shrink-0 snap-center w-[85vw] sm:w-[340px] bg-slate-800 rounded-3xl border border-slate-700/70 overflow-hidden shadow-2xl flex flex-col justify-between p-3.5 transition-all hover:scale-[1.02] cursor-pointer group relative"
            >
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 max-h-[460px] flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.clientName}
                  className="w-full h-auto max-h-[440px] object-contain rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/1_df3f0600.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-bold text-sm">
                  <ZoomIn className="w-5 h-5 text-emerald-400" />
                  <span>تكبير الصورة</span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteReview(item.id, e)}
                    className="absolute top-2.5 left-2.5 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition z-20"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Story text */}
              <div className="pt-3 px-1 text-right">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-sm text-slate-200">{item.clientName}</h4>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    {item.weightLost}
                  </span>
                </div>
                {item.story && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.story}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative max-w-2xl w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImg(null)}
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImg}
              alt="Review preview"
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl border border-white/20 object-contain"
            />
          </div>
        </div>
      )}

      {/* Admin Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-slate-800">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="font-black text-xl text-slate-900">إضافة رأي / قصة نجاح جديدة</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">اسم العميل / المشترك</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: ياسمين أحمد"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">الوزن المفقود أو الإنجاز</label>
                <input
                  type="text"
                  value={weightLost}
                  onChange={(e) => setWeightLost(e.target.value)}
                  placeholder="مثال: نزول 12 كيلو في شهرين"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">مسار أو رابط سكرين شوت المحادثة</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  dir="ltr"
                  placeholder="/assets/aistudio/... أو https://..."
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">نبذة أو ملخص القصة</label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={3}
                  placeholder="تجربة العميل مع الدايت والمتابعة..."
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
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-sm cursor-pointer"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ الرأي'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
