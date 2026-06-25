import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Video, Award, BrainCircuit, BarChart3, Users, Settings, ShieldCheck, Globe, MessageCircle, ArrowRight, Ticket, X, CheckCircle2, UserCircle, LogIn } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '../App';
import { api } from '../services/api';

export default function LandingPage({ onLogin, onGoBack, showBackBtn }: { onLogin: (role: UserRole) => void, onGoBack?: () => void, showBackBtn?: boolean }) {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [activationStatus, setActivationStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleActivate = async () => {
    if(!activationCode.trim() || !studentName.trim()) {
      alert("الرجاء إدخال اسمك وكود التفعيل");
      return;
    }
    setActivationStatus('loading');
    try {
      const codeData = await api.verifyCode(activationCode);
      if (!codeData) {
        alert("الكود غير صحيح.");
        setActivationStatus('idle');
        return;
      }

      await api.markCodeAsUsed(codeData.id, studentName);

      setActivationStatus('success');
      
      const activeCodes = JSON.parse(localStorage.getItem('my_codes') || '[]');
      if (!activeCodes.find((c: any) => c.code === codeData.code)) {
        activeCodes.push(codeData);
        localStorage.setItem('my_codes', JSON.stringify(activeCodes));
      }
      
      setTimeout(() => {
          setActivationStatus('idle');
          setShowCodeModal(false);
          setActivationCode('');
          setStudentName('');
          onLogin('student');
      }, 2000);
    } catch(err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
      setActivationStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary-600">
              <BrainCircuit className="w-8 h-8" />
              <span className="text-xl font-bold">إديوسمارت</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">المميزات</a>
            <a href="#courses" className="hover:text-primary-600 transition-colors">الكورسات</a>
            <a href="#contact" className="hover:text-primary-600 transition-colors">تواصل معنا</a>
          </div>
          <div className="flex items-center gap-4">
             <button
               onClick={() => setShowCodeModal(true)}
               className="text-primary-600 font-bold px-4 py-2 flex items-center gap-2 hover:bg-primary-50 rounded-lg transition-colors"
             >
               <Ticket className="w-5 h-5" />
               تفعيل كود
             </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              دخول المنصة
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-start"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            جاهزة للإطلاق خلال 3 أيام فقط!
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            منصتك التعليمية الكاملة أصبحت <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">أكثر ذكاءً</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            استضف دوراتك غير المحدودة، أدر طلابك، وصحح الاختبارات إلكترونياً. مع شات بوت ذكي ومسار تسويقي متكامل عبر Zoom, WhatsApp, و Facebook Pixel.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button onClick={() => setShowLoginModal(true)} className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5">
              جرب لوحة التحكم
            </button>
            <button className="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all">
              تحدث مع المبيعات
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full max-w-lg md:max-w-none relative aspect-square md:aspect-auto md:h-[500px]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-3xl transform rotate-3"></div>
          <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* Fake Browser UI */}
            <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Dashboard Preview */}
            <div className="p-6 flex-1 bg-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-24 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-24 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="bg-white flex-1 rounded-xl shadow-sm border border-gray-100 mt-2 p-4">
                 <div className="w-full h-32 bg-gray-100 rounded-lg mb-4"></div>
                 <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                 <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Floating UI Elements */}
          <div className="absolute -left-6 top-20 bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
               <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">تم إصدار</div>
              <div className="font-bold text-sm">شهادة جديدة</div>
            </div>
          </div>
          
          <div className="absolute -right-4 bottom-24 bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
               <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">الذكاء الاصطناعي</div>
              <div className="font-bold text-sm">تم التصحيح</div>
            </div>
          </div>

        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">كل ما تحتاجه للنجاح، في مكان واحد</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">من الإطلاق وحتى إصدار الشهادات، نوفر لك بنية تحتية قوية تواكب تطلعاتك التعليمية.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-6 h-6" />}
              title="شات بوت ذكي"
              desc="مساعد مبني بالذكاء الاصطناعي للرد على الاستفسارات 24/7."
              color="blue"
            />
            <FeatureCard 
              icon={<Award className="w-6 h-6" />}
              title="اختبارات وشهادات"
              desc="تصحيح آلي للاختبارات (مقالي، اختياري) وإصدار دقيق للشهادات."
              color="purple"
            />
            <FeatureCard 
              icon={<Video className="w-6 h-6" />}
              title="Zoom & Meet"
              desc="ربط سلس لتقديم بث مباشر للدروس والمحاضرات أونلاين."
              color="indigo"
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="كورسات لا محدودة"
              desc="مساحة غير محدودة لرفع الفيديوهات، PDF، ونصوص المواد العلمية."
              color="emerald"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6" />}
              title="حماية المحتوى"
              desc="تشفير عالي مع SSL، ومنع تحميل الفيديوهات للحفاظ على حقوقك."
              color="rose"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="تسويق وإحصائيات"
              desc="تقارير كاملة، وربط مع Facebook Pixel و Google Analytics."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Integration Banner */}
      <section className="py-16 bg-primary-600 text-white overflow-hidden relative">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mt-0 ml-0" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">متصل دائمًا، متوافق مع كافة أدواتك</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-10">
               <span className="text-xl font-bold opacity-80 hover:opacity-100 transition-opacity">Zoom</span>
               <span className="text-xl font-bold opacity-80 hover:opacity-100 transition-opacity">Google Meet</span>
               <span className="text-xl font-bold opacity-80 hover:opacity-100 transition-opacity">WhatsApp</span>
               <span className="text-xl font-bold opacity-80 hover:opacity-100 transition-opacity">Tutor LMS</span>
               <span className="text-xl font-bold opacity-80 hover:opacity-100 transition-opacity">Meta Pixel</span>
            </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-col md:flex-row gap-4">
           <div className="flex items-center gap-2 text-white">
              <BrainCircuit className="w-6 h-6" />
              <span className="text-lg font-bold">إديوسمارت</span>
           </div>
           <p className="text-sm">جميع الحقوق محفوظة &copy; 2026. تم البناء بواسطة الذكاء الاصطناعي.</p>
        </div>
      </footer>

      {/* Code Activation Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
               onClick={() => setShowCodeModal(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
               {activationStatus === 'success' ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">تم تفعيل الكود بنجاح!</h3>
                     <p className="text-gray-500">جاري توجيهك إلى الكورس الخاص بك...</p>
                  </div>
               ) : (
                  <>
                     <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3 text-primary-600">
                           <div className="bg-primary-100 p-2 rounded-lg"><Ticket className="w-5 h-5" /></div>
                           <h3 className="font-bold text-gray-900 text-lg">تفعيل كود شحن / مساق</h3>
                        </div>
                        <button onClick={() => setShowCodeModal(false)} className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 p-2 rounded-xl transition-colors">
                           <X className="w-5 h-5" />
                        </button>
                     </div>
                     <div className="p-6">
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                           يرجى إدخال اسمك وكود التفعيل المكون من 12 حرف ورقم والذي حصلت عليه، ليتم إضافة الكورس أو الرصيد إلى حسابك فوراً.
                        </p>
                        <div className="mb-4">
                           <label className="block text-sm font-bold text-gray-700 mb-2">اسمك الكامل</label>
                           <input 
                              type="text" 
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="أحمد محمد" 
                              className="w-full border-2 border-gray-200 rounded-xl p-3.5 bg-gray-50/50 outline-none focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                           />
                        </div>
                        <div className="mb-6">
                           <label className="block text-sm font-bold text-gray-700 mb-2">كود التفعيل</label>
                           <input 
                              type="text" 
                              value={activationCode}
                              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                              placeholder="EDUS-XXXX-XXXX" 
                              className="w-full border-2 border-gray-200 rounded-xl p-3.5 bg-gray-50/50 text-center font-mono font-bold text-lg tracking-widest focus:border-primary-500 focus:bg-white outline-none transition-all uppercase placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:font-medium"
                              dir="ltr"
                           />
                        </div>
                        <button 
                           onClick={handleActivate}
                           disabled={activationStatus === 'loading' || !activationCode.trim() || !studentName.trim()}
                           className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                           {activationStatus === 'loading' ? (
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block"></span>
                           ) : 'تفعيل الكود الآن'}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                           إذا واجهت أية مشكلة في التفعيل، يرجى التواصل مع الدعم الفني.
                        </p>
                     </div>
                  </>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Role Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
               onClick={() => setShowLoginModal(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
               <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3 text-primary-600">
                     <div className="bg-primary-100 p-2 rounded-lg"><LogIn className="w-5 h-5" /></div>
                     <h3 className="font-bold text-gray-900 text-lg">تسجيل الدخول للمنصة</h3>
                  </div>
                  <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 p-2 rounded-xl transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                     الرجاء اختيار نوع الحساب الذي ترغب بتجربته لتسجيل الدخول:
                  </p>
                  
                  <div className="space-y-4">
                     <button onClick={() => { setShowLoginModal(false); setShowCodeModal(true); }} className="w-full bg-white border border-gray-200 hover:border-primary-300 hover:shadow-md hover:bg-primary-50 p-4 rounded-xl flex items-center gap-4 transition-all group text-start">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex justify-center items-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                           <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary-700 transition-colors">دخول كطالب</h4>
                           <p className="text-sm text-gray-500">حساب طالب مسجل لعرض الكورسات</p>
                        </div>
                     </button>
                     
                     <button onClick={() => { setShowLoginModal(false); onLogin('guest'); }} className="w-full bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md hover:bg-emerald-50 p-4 rounded-xl flex items-center gap-4 transition-all group text-start">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex justify-center items-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                           <Video className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">الدخول كضيف (مجاني)</h4>
                           <p className="text-sm text-gray-500">مشاهدة فيديو تعريفي واحد بدون تسجيل</p>
                        </div>
                     </button>

                     <button onClick={() => { setShowLoginModal(false); onLogin('admin'); }} className="w-full bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md hover:bg-purple-50 p-4 rounded-xl flex items-center gap-4 transition-all group text-start">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex justify-center items-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                           <Settings className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">دخول الإدارة / المعلم</h4>
                           <p className="text-sm text-gray-500">لوحة التحكم الكاملة وإدارة المنصة</p>
                        </div>
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: 'blue' | 'purple' | 'indigo' | 'emerald' | 'rose' | 'amber' }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorStyles[color]} border`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
