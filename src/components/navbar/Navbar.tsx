import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  MessageSquare, 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  Calculator, 
  BookOpen, 
  Utensils, 
  Sparkles,
  LineChart
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  const { userProfile, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'calculator', label: 'الحاسبة' },
    { id: 'alternatives', label: 'البدائل' },
    { id: 'glp1', label: 'حقن التخسيس', highlight: true },
    { id: 'recipes', label: 'الوصفات' },
    { id: 'articles', label: 'المقالات' },
    { id: 'success', label: 'النتائج' },
    { id: 'reports', label: 'تقاريري' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 focus:outline-none text-right cursor-pointer"
              >
                <img
                  src="/assets/aistudio/logo_bacff5b8.png"
                  alt="Eat Smart"
                  className="h-12 md:h-14 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="hidden sm:block">
                  <span className="font-black text-slate-800 text-lg leading-tight block">Eat Smart</span>
                  <span className="text-[10px] text-emerald-700 font-bold block">د. أماني رأفت - تغذية علاجية</span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 space-x-reverse">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.highlight
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Chat Consultation Button */}
              <button
                onClick={() => handleNavClick('chat')}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>الشات الطبي</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Admin Panel Button */}
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>لوحة الأدمن</span>
                </button>
              )}
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-3">
              {/* Profile Pill */}
              <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                  {userProfile?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black text-slate-800 leading-tight">
                    {userProfile?.name || 'المشترك'}
                  </span>
                  <span className="block text-[10px] font-bold text-emerald-600">
                    {isAdmin ? 'دكتور / أدمن 👑' : 'مشترك معتمد'}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="تسجيل الخروج"
                className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 rounded-xl bg-gray-50 border border-gray-200 text-slate-700 hover:text-emerald-700 focus:outline-none cursor-pointer"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/98 backdrop-blur-xl flex flex-col pt-24 pb-8 px-6 overflow-y-auto font-sans xl:hidden">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">
              {userProfile?.name?.charAt(0) || <UserIcon className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-black text-base text-slate-900">{userProfile?.name}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 mt-1">
                {isAdmin ? '👑 دكتور ومسؤول النظام' : 'مشترك معتمد'}
              </span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-right px-4 py-3 rounded-2xl font-black text-base text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('chat')}
              className="w-full text-right px-4 py-3 rounded-2xl font-black text-base bg-emerald-50 text-emerald-800 flex items-center justify-between mt-3"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>الشات الطبي المباشر</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} جديد
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-right px-4 py-3 rounded-2xl font-black text-base bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2 mt-2"
              >
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>لوحة تحكم الأدمن ومحتوى الموقع</span>
              </button>
            )}
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 bg-rose-50 text-rose-700 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-rose-100"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      )}
    </>
  );
};
