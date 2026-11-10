import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/errorHandler';
import { UserProfile, UserReport } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  ChefHat, 
  BookOpen, 
  Trophy, 
  LineChart, 
  Scale, 
  Search, 
  ArrowLeft,
  Key,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenChatWithUser: (userId: string, userName: string) => void;
  onOpenAddRecipe: () => void;
  onOpenAddArticle: () => void;
  onOpenAddReview: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenChatWithUser,
  onOpenAddRecipe,
  onOpenAddArticle,
  onOpenAddReview
}) => {
  const { user, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [reportsList, setReportsList] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) return;

    // Fetch users
    const usersCol = collection(db, 'users');
    const unsubUsers = onSnapshot(
      usersCol,
      (snapshot) => {
        const loaded: UserProfile[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...(d.data() as Omit<UserProfile, 'id'>) });
        });
        setUsersList(loaded);
      },
      (err) => {
        console.warn('Users listen error:', err);
      }
    );

    // Fetch reports
    const reportsCol = collection(db, 'reports');
    const unsubReports = onSnapshot(
      reportsCol,
      (snapshot) => {
        const loaded: UserReport[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...(d.data() as Omit<UserReport, 'id'>) });
        });
        loaded.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setReportsList(loaded);
        setLoading(false);
      },
      (err) => {
        console.warn('Reports listen error:', err);
      }
    );

    return () => {
      unsubUsers();
      unsubReports();
    };
  }, [user, isAdmin]);

  if (!isAdmin) {
    return (
      <section className="py-20 text-center bg-slate-50 font-sans">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-slate-800 mb-2">منطقة مخصصة للأدمن فقط</h2>
          <p className="text-xs text-slate-500">
            أنت مسجل حالياً بحساب مشترك عادي. للوصول لهذه اللوحة، يرجى تسجيل الدخول بحساب الطبيب المسؤول.
          </p>
        </div>
      </section>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <section id="admin" className="py-16 md:py-24 bg-slate-50 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>لوحة التحكم الطبية وإدارة المحتوى</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2">
                مرحباً دكتور أماني رأفت 👑
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                هنا يمكنك متابعة تقارير المشتركين، أوزانهم، والرد على استفساراتهم في الشات المباشر، وتحديث محتوى الموقع.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onOpenAddRecipe}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <ChefHat className="w-4 h-4" />
                <span>+ وجبة جديدة</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddArticle}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>+ مقال توعوي</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddReview}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>+ سكرين رأي عميل</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
            <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">المشتركين المسجلين</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{usersList.length}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
            <LineChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">التقارير المرسلة</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{reportsList.length}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
            <ChefHat className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">الوصفات المفعلة</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">10+</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
            <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold mb-1">آراء العملاء والتحولات</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">10+</p>
          </div>
        </div>

        {/* Main Split: Users List and Reports Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Registered Users Table */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-base text-slate-900">بيانات ومتابعة المشتركين</h3>
                <p className="text-xs text-slate-400">يمكنك فتح شات مباشر بنقرة واحدة مع أي مشترك</p>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="بحث باسم المشترك..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-9 pl-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-xs">لا يوجد مشتركون مطابقون.</div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 hover:bg-gray-50/70 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900">{u.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.role === 'admin' ? 'أدمن / دكتور' : 'مشترك'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono" dir="ltr">{u.email}</p>
                        
                        {(u.currentWeight || u.goal) && (
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-emerald-800">
                            {u.currentWeight && <span>الوزن: {u.currentWeight} كجم</span>}
                            {u.height && <span>• الطول: {u.height} سم</span>}
                            {u.goal && (
                              <span>• الهدف: {u.goal === 'lose' ? 'تخسيس' : u.goal === 'gain' ? 'عضل' : 'تثبيت'}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenChatWithUser(u.id, u.name)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>فتح الشات</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Reports Activity Stream */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-base text-slate-900">تقارير المشتركين الأخيرة</h3>
                <p className="text-xs text-slate-400">النتائج المحفوظة من حاسبة السعرات والقياسات</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                {reportsList.length} تقرير
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] divide-y divide-gray-100">
              {reportsList.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-xs">
                  لم يتم إرسال تقارير قياسات بعد.
                </div>
              ) : (
                reportsList.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-gray-50/60 transition space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-slate-800">{r.userName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {r.date || new Date(r.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-100">
                        الوزن: {r.weight} كجم
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-100">
                        BMI: {r.bmi}
                      </span>
                      {r.waterLiters && (
                        <span className="text-slate-500">ماء: {r.waterLiters}L</span>
                      )}
                    </div>

                    {r.notes && (
                      <p className="text-[11px] text-slate-500 bg-gray-50 p-2 rounded-xl border border-gray-100 mt-1">
                        {r.notes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
