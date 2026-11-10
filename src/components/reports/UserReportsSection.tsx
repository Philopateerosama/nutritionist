import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/errorHandler';
import { UserReport } from '../../types';
import { 
  LineChart, 
  Scale, 
  Droplet, 
  Plus, 
  Trash2, 
  TrendingDown, 
  Calendar, 
  CheckCircle2, 
  Flame,
  Award
} from 'lucide-react';

export const UserReportsSection: React.FC = () => {
  const { user, userProfile, updateUserData } = useAuth();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  // New check-in state
  const [newWeight, setNewWeight] = useState<number>(userProfile?.currentWeight || 75);
  const [waterLiters, setWaterLiters] = useState<number>(2.5);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'reports'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: UserReport[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<UserReport, 'id'>) });
        });
        // Sort descending by createdAt
        loaded.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setReports(loaded);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'reports');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const height = userProfile?.height || 165;
      const heightInMeters = height / 100;
      const calculatedBmi = Number((newWeight / (heightInMeters * heightInMeters)).toFixed(1));

      const newReportData: Omit<UserReport, 'id'> = {
        userId: user.uid,
        userName: userProfile?.name || 'مشترك',
        userEmail: user.email || '',
        date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium' }),
        weight: Number(newWeight),
        bmi: calculatedBmi,
        caloriesTarget: 1800,
        waterLiters: Number(waterLiters),
        notes: notes.trim() || 'تسجيل وزن دوري',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reports'), newReportData);
      await updateUserData({ currentWeight: Number(newWeight) });

      setShowAddForm(false);
      setNotes('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reports');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذا التقرير؟')) return;
    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reports/${id}`);
    }
  };

  // Stats calculation
  const latestWeight = reports.length > 0 ? reports[0].weight : (userProfile?.currentWeight || 0);
  const oldestWeight = reports.length > 0 ? reports[reports.length - 1].weight : latestWeight;
  const totalDifference = oldestWeight && latestWeight ? Number((oldestWeight - latestWeight).toFixed(1)) : 0;

  return (
    <section id="reports" className="py-16 md:py-24 bg-white relative font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            سجل المتابعة الشخصي
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 flex items-center justify-center gap-2">
            <span>تقاريري ومتابعة وزني</span>
            <LineChart className="w-8 h-8 text-emerald-600" />
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
            سجل أوزانك الأسبوعية والتزامك بالماء والدايت لمتابعة تقدمك مع دكتورة أماني خطوة بخطوة.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'إخفاء نموذج التسجيل' : 'تسجيل وزن وملاحظة جديدة'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-5 text-center">
            <Scale className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">الوزن الأخير المسجل</p>
            <p className="text-3xl font-black text-emerald-900">{latestWeight || '--'} <span className="text-sm">كجم</span></p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-5 text-center">
            <TrendingDown className="w-7 h-7 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي التغير في الوزن</p>
            <p className={`text-3xl font-black ${totalDifference > 0 ? 'text-emerald-700' : 'text-blue-900'}`}>
              {totalDifference > 0 ? `-${totalDifference}` : totalDifference} <span className="text-sm">كجم</span>
            </p>
          </div>

          <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-5 text-center">
            <Award className="w-7 h-7 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">إجمالي التقارير المسجلة</p>
            <p className="text-3xl font-black text-amber-900">{reports.length} <span className="text-sm">تقرير</span></p>
          </div>
        </div>

        {/* Check-in Form Modal / Drawer */}
        {showAddForm && (
          <div className="bg-slate-50 border-2 border-emerald-200 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-lg animate-in fade-in">
            <h3 className="font-black text-lg text-slate-900 mb-4 text-right">
              تسجيل قياس جديد للمتابعة الطبية
            </h3>
            <form onSubmit={handleAddReport} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">الوزن على الميزان</label>
                <div className="relative">
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    step="0.1"
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 font-black text-slate-800 text-lg"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">كجم</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">شرب الماء اليوم</label>
                <div className="relative">
                  <input
                    type="number"
                    value={waterLiters}
                    onChange={(e) => setWaterLiters(Number(e.target.value))}
                    step="0.5"
                    min="0"
                    max="10"
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 font-black text-slate-800 text-lg"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">لتر</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">ملاحظات أو شعورك مع الدايت</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: التزمت تماماً، بدون جوع"
                  className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-slate-700 font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ التقرير الآن'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reports History Table / Cards */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center">
            <h4 className="font-black text-sm text-slate-800">سجل القياسات السابقة</h4>
            <span className="text-xs text-gray-400">محدث تلقائياً</span>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <Scale className="w-10 h-10 mx-auto text-gray-300" />
              <p className="font-bold text-sm">لم تسجل أي قياسات بعد.</p>
              <p className="text-xs">استخدم حاسبة السعرات أعلاه أو زر التسجيل لحفظ أول قياس لك.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reports.map((report) => (
                <div key={report.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base shrink-0">
                      {report.weight}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-800">{report.weight} كجم</span>
                        <span className="text-xs font-bold text-gray-400">•</span>
                        <span className="text-xs font-bold text-emerald-700">BMI: {report.bmi}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{report.notes || 'تسجيل روتيني'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{report.date || new Date(report.createdAt).toLocaleDateString('ar-EG')}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteReport(report.id)}
                      className="text-gray-400 hover:text-rose-600 p-2 rounded-xl transition cursor-pointer"
                      title="حذف هذا التقرير"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
