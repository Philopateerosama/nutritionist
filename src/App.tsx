import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Navbar } from './components/navbar/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { MacroCalculator } from './components/calculator/MacroCalculator';
import { AlternativesSection } from './components/alternatives/AlternativesSection';
import { Glp1Section } from './components/glp1/Glp1Section';
import { RecipesSection } from './components/recipes/RecipesSection';
import { ArticlesSection } from './components/articles/ArticlesSection';
import { ReviewsSection } from './components/reviews/ReviewsSection';
import { ConsultationChat } from './components/chat/ConsultationChat';
import { UserReportsSection } from './components/reports/UserReportsSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/footer/Footer';
import { MessageSquare, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');

  // Ensure webpage starts cleanly at the top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="relative">
          <img
            src="/assets/aistudio/logo_bacff5b8.png"
            alt="Eat Smart"
            className="h-20 w-auto animate-pulse"
          />
        </div>
        <p className="mt-4 font-black text-slate-800 text-sm">جاري تشغيل منصة Eat Smart...</p>
      </div>
    );
  }

  // Auth Wall: Users must sign in to browse
  if (!user) {
    return <AuthModal />;
  }

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#15803d] selection:text-white flex flex-col">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Admin Dashboard if activeTab === 'admin' or placed above */}
        {isAdmin && (
          <AdminDashboard
            onOpenChatWithUser={(userId, userName) => {
              scrollToSection('chat');
            }}
            onOpenAddRecipe={() => scrollToSection('recipes')}
            onOpenAddArticle={() => scrollToSection('articles')}
            onOpenAddReview={() => scrollToSection('success')}
          />
        )}

        <HeroSection
          onOpenCalculator={() => scrollToSection('calculator')}
          onOpenChat={() => scrollToSection('chat')}
        />

        <MacroCalculator
          onReportSaved={() => scrollToSection('reports')}
        />

        <AlternativesSection />

        <Glp1Section />

        <RecipesSection />

        <ArticlesSection />

        <ReviewsSection />

        <UserReportsSection />

        <ConsultationChat />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chat Trigger Button */}
      <button
        type="button"
        onClick={() => scrollToSection('chat')}
        className="fixed bottom-6 left-6 z-40 bg-emerald-700 hover:bg-emerald-800 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer group border-2 border-white/40"
        title="استشارة طبية وشات مع الدكتورة"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-black mr-0 group-hover:mr-2">
          استشر د. أماني
        </span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
