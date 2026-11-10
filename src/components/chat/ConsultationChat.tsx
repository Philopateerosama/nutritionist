import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/errorHandler';
import { ChatThread, ChatMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User as UserIcon, 
  ShieldCheck, 
  Clock, 
  CheckCheck,
  Search,
  ArrowRight,
  Stethoscope
} from 'lucide-react';

export const ConsultationChat: React.FC = () => {
  const { user, userProfile, isAdmin } = useAuth();
  
  // Doctor Inbox state (when isAdmin)
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [activeChatUserName, setActiveChatUserName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Determine current active chat target
  const currentChatId = isAdmin ? activeChatUserId : user?.uid;

  // Auto-scroll ONLY inside the chat container so the webpage doesn't scroll down
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, currentChatId]);

  // For Doctor: Listen to all consultation threads in /chats
  useEffect(() => {
    if (!user || !isAdmin) return;

    const chatsCol = collection(db, 'chats');
    const unsubscribe = onSnapshot(
      chatsCol,
      (snapshot) => {
        const loaded: ChatThread[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ ...(docSnap.data() as ChatThread), userId: docSnap.id });
        });
        setThreads(loaded.sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || '')));

        // If no active chat selected yet, select the first thread
        if (!activeChatUserId && loaded.length > 0) {
          setActiveChatUserId(loaded[0].userId);
          setActiveChatUserName(loaded[0].userName);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'chats');
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  // Listen to messages for currentChatId
  useEffect(() => {
    if (!user || !currentChatId) return;

    const msgsCol = collection(db, 'chats', currentChatId, 'messages');
    const q = query(msgsCol, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<ChatMessage, 'id'>) });
        });
        setMessages(loaded);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `chats/${currentChatId}/messages`);
      }
    );

    return () => unsubscribe();
  }, [user, currentChatId]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !user || !currentChatId) return;

    setSending(true);
    try {
      const now = new Date().toISOString();

      // 1. Add message to /chats/{currentChatId}/messages
      await addDoc(collection(db, 'chats', currentChatId, 'messages'), {
        chatId: currentChatId,
        senderId: user.uid,
        senderRole: isAdmin ? 'admin' : 'user',
        senderName: userProfile?.name || (isAdmin ? 'د. أماني رأفت' : 'المشترك'),
        text: textToSend.trim(),
        createdAt: now
      });

      // 2. Update thread summary in /chats/{currentChatId}
      await setDoc(
        doc(db, 'chats', currentChatId),
        {
          userId: currentChatId,
          userName: isAdmin ? activeChatUserName || 'مشترك' : userProfile?.name || 'مشترك',
          userEmail: isAdmin ? '' : user.email || '',
          lastMessage: textToSend.trim(),
          lastUpdated: now,
          unreadDoctor: isAdmin ? 0 : 1,
          unreadUser: isAdmin ? 1 : 0
        },
        { merge: true }
      );

      setInputText('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `chats/${currentChatId}/messages`);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'عايزة أستفسر عن وزني بعد أسبوع الالتزام',
    'ما هي أفضل وجبة سناك وقت الجوع الليلي؟',
    'هل يمكن تبديل الفول في الإفطار بالبيض والقريش؟',
    'أشعر بدوخة خفيفة مع بداية الدايت، ما النصيحة؟'
  ];

  return (
    <section id="chat" className="py-16 md:py-24 bg-slate-50 relative font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
            متابعة حية ومباشرة
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 flex items-center justify-center gap-2">
            <span>الشات الطبي والاستشارة المباشرة</span>
            <MessageSquare className="w-7 h-7 text-emerald-600" />
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
            {isAdmin 
              ? 'صندوق استشارات ورسائل المشتركين - رد مباشرة على استفسارات عملائك وتابع خططهم.' 
              : 'تواصل مباشرة مع د. أماني رأفت، اسأل عن وجباتك، بدائلك، أو أرسل استفسارك في أي وقت.'}
          </p>
        </div>

        {/* Chat Main Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] max-h-[700px]">
          
          {/* If Admin: Users Inbox List on the right side */}
          {isAdmin && (
            <div className="md:col-span-5 lg:col-span-4 border-l border-gray-100 bg-slate-50/70 flex flex-col">
              <div className="p-4 border-b border-gray-200/80 bg-white">
                <h3 className="font-black text-sm text-slate-800 mb-2 flex items-center justify-between">
                  <span>المحادثات النشطة</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {threads.length} مشترك
                  </span>
                </h3>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث باسم المشترك..."
                    className="w-full bg-gray-100 rounded-xl pr-9 pl-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {threads.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs font-medium">
                    لا توجد محادثات مفتوحة حتى الآن.
                  </div>
                ) : (
                  threads
                    .filter((t) => t.userName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((t) => {
                      const isSelected = activeChatUserId === t.userId;
                      return (
                        <button
                          key={t.userId}
                          type="button"
                          onClick={() => {
                            setActiveChatUserId(t.userId);
                            setActiveChatUserName(t.userName);
                          }}
                          className={`w-full p-4 text-right flex items-start gap-3 transition cursor-pointer ${
                            isSelected ? 'bg-emerald-50/80 border-r-4 border-emerald-600' : 'hover:bg-gray-100/60'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
                            {t.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-black text-xs text-slate-800 truncate">{t.userName}</h4>
                              <span className="text-[10px] text-gray-400">
                                {t.lastUpdated ? new Date(t.lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{t.lastMessage || 'بدء المحادثة'}</p>
                          </div>
                        </button>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {/* Chat Window */}
          <div className={`${isAdmin ? 'md:col-span-7 lg:col-span-8' : 'md:col-span-12'} flex flex-col h-full bg-white`}>
            
            {/* Chat Top Bar */}
            <div className="px-6 py-4 bg-slate-50/90 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                    {isAdmin ? <UserIcon className="w-5 h-5" /> : <Stethoscope className="w-6 h-6" />}
                  </div>
                  <span className="w-3 h-3 bg-green-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 leading-tight">
                    {isAdmin ? (activeChatUserName || 'حدد مشتركاً من القائمة') : 'دكتور أماني رأفت'}
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <span>{isAdmin ? 'محادثة استشارية' : 'أخصائية التغذية العلاجية • متصلة للمتابعة'}</span>
                  </p>
                </div>
              </div>

              <div className="text-left text-[11px] text-slate-400 font-mono">
                {isAdmin ? 'Doctor Desk' : 'Eat Smart Clinic'}
              </div>
            </div>

            {/* Messages Feed */}
            <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-slate-50/40 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-black text-slate-700 text-sm">مرحباً بك في المحادثة المباشرة!</p>
                    <p className="text-xs text-gray-500 max-w-sm mt-1">
                      {isAdmin
                        ? 'اختر مشتركاً أو ابدأ الرد عليه.'
                        : 'أرسل سؤالك بخصوص الدايت أو الجرعات أو البدائل ود. أماني ستقوم بالرد عليك مباشرة.'}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.uid;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-gray-400 font-bold">
                        <span>{msg.senderName}</span>
                        {msg.senderRole === 'admin' && (
                          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[9px]">
                            دكتورة
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                          isMine
                            ? 'bg-emerald-700 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-slate-800 rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <div className={`text-[10px] mt-1.5 flex items-center gap-1 justify-end ${
                          isMine ? 'text-emerald-200' : 'text-gray-400'
                        }`}>
                          <span>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : ''}
                          </span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Prompts for regular user */}
            {!isAdmin && messages.length <= 2 && (
              <div className="px-4 py-2 bg-white border-t border-gray-100 flex overflow-x-auto gap-2">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(undefined, prompt)}
                    className="shrink-0 text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition cursor-pointer border border-emerald-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isAdmin ? 'اكتب ردك الطبي للمشترك...' : 'اكتب رسالتك أو استفسارك للدكتورة هنا...'}
                className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition"
              />
              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-5 h-5 rotate-180" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
