import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  Plus,
  FileText,
  CheckCircle2,
  MoreVertical,
  Video,
  Image as ImageIcon,
  FileCheck,
  ArrowRight,
  Ticket,
  Copy,
  Check,
  PlayCircle,
  Award,
  Menu,
  X,
  UploadCloud,
  File as FileIcon,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Play,
  Download,
  MessageSquare,
  Send,
  Clock,
  User,
} from "lucide-react";
import { UserRole } from "../App";
import { api } from "../services/api";

type Tab =
  | "overview"
  | "courses"
  | "quizzes"
  | "ai-tutor"
  | "codes"
  | "my-courses"
  | "certificates"
  | "free-video"
  | "settings"
  | "students"
  | "reports";

export default function Dashboard({
  onLogout,
  onGoBack,
  role,
  onChangeRole,
}: {
  onLogout: () => void;
  onGoBack?: () => void;
  role: UserRole;
  onChangeRole?: (role: UserRole) => void;
}) {
  const defaultTab =
    role === "admin"
      ? "overview"
      : role === "student"
        ? "my-courses"
        : "free-video";
  const [history, setHistory] = useState<Tab[]>([defaultTab]);
  const activeTab = history[history.length - 1];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHistory([defaultTab]);
  }, [role, defaultTab]);

  const pushTab = useCallback(
    (tab: Tab) => {
      if (tab !== activeTab) {
        setHistory((prev) => [...prev, tab]);
      }
      setIsMobileMenuOpen(false);
    },
    [activeTab],
  );

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    } else {
      if (onGoBack) onGoBack();
      else onLogout();
    }
  }, [history.length, onGoBack, onLogout]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-primary-600">
            <BrainCircuit className="w-7 h-7" />
            <span className="text-lg font-bold">إديوسمارت</span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {role === "admin" && (
            <>
              <NavItem
                icon={<LayoutDashboard />}
                label="نظرة عامة"
                active={activeTab === "overview"}
                onClick={() => pushTab("overview")}
              />
              <NavItem
                icon={<BookOpen />}
                label="الكورسات"
                active={activeTab === "courses"}
                onClick={() => pushTab("courses")}
              />
              <NavItem
                icon={<FileCheck />}
                label="الاختبارات الذكية"
                active={activeTab === "quizzes"}
                onClick={() => pushTab("quizzes")}
              />
              <NavItem
                icon={<Ticket />}
                label="إدارة الأكواد"
                active={activeTab === "codes"}
                onClick={() => pushTab("codes")}
              />
              <NavItem
                icon={<BrainCircuit />}
                label="المساعد الذكي"
                active={activeTab === "ai-tutor"}
                onClick={() => pushTab("ai-tutor")}
              />
              <div className="pt-4 mt-4 border-t border-gray-100">
                <NavItem
                  icon={<Users />}
                  label="الطلاب"
                  active={activeTab === "students"}
                  onClick={() => pushTab("students")}
                />
                <NavItem
                  icon={<BarChart3 />}
                  label="التقارير"
                  active={activeTab === "reports"}
                  onClick={() => pushTab("reports")}
                />
                <NavItem
                  icon={<Settings />}
                  label="الإعدادات"
                  active={activeTab === "settings"}
                  onClick={() => pushTab("settings")}
                />
              </div>
            </>
          )}

          {role === "student" && (
            <>
              <NavItem
                icon={<BookOpen />}
                label="كورساتي"
                active={activeTab === "my-courses"}
                onClick={() => pushTab("my-courses")}
              />
              <NavItem
                icon={<BrainCircuit />}
                label="المساعد الذكي (الشات بوت)"
                active={activeTab === "ai-tutor"}
                onClick={() => pushTab("ai-tutor")}
              />
              <NavItem
                icon={<Award />}
                label="الشهادات"
                active={activeTab === "certificates"}
                onClick={() => pushTab("certificates")}
              />
              <div className="pt-4 mt-4 border-t border-gray-100">
                <NavItem
                  icon={<Settings />}
                  label="إعدادات الحساب"
                  active={activeTab === "settings"}
                  onClick={() => pushTab("settings")}
                />
              </div>
            </>
          )}

          {role === "guest" && (
            <>
              <NavItem
                icon={<PlayCircle />}
                label="الفيديو التعريفي"
                active={activeTab === "free-video"}
                onClick={() => pushTab("free-video")}
              />
            </>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-3 py-2.5 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:pr-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors md:ml-2"
              title="الرجوع للصفحة السابقة"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline-block">
                رجوع
              </span>
            </button>
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-64">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="ابحث هنا..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              أ
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab key="overview" />}
            {activeTab === "courses" && <CoursesTab key="courses" />}
            {activeTab === "quizzes" && <QuizzesTab key="quizzes" />}
            {activeTab === "codes" && <CodesTab key="codes" />}
            {activeTab === "ai-tutor" && (
              <AITutorTab key="ai-tutor" role={role} />
            )}
            {activeTab === "my-courses" && <MyCoursesTab key="my-courses" />}
            {activeTab === "certificates" && (
              <CertificatesTab key="certificates" />
            )}
            {activeTab === "free-video" && (
              <FreeVideoTab
                key="free-video"
                onSignup={() => onChangeRole?.("student")}
              />
            )}
            {activeTab === "settings" && <SettingsTab key="settings" />}
            {activeTab === "students" && <StudentsTab key="students" />}
            {activeTab === "reports" && <ReportsTab key="reports" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Tabs ---

function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        مرحباً بك، أستاذ!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="إجمالي الطلاب"
          value="1,248"
          trend="+12%"
          icon={<Users />}
          color="blue"
        />
        <StatCard
          title="الكورسات النشطة"
          value="12"
          trend="+2"
          icon={<BookOpen />}
          color="purple"
        />
        <StatCard
          title="الاختبارات المصححة"
          value="450"
          trend="آلياً"
          icon={<CheckCircle2 />}
          color="green"
        />
        <StatCard
          title="الزيارات اليومية"
          value="8.5k"
          trend="+5%"
          icon={<BarChart3 />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              الكورسات الأخيرة
            </h2>
            <button className="text-primary-600 text-sm font-medium hover:underline">
              عرض الكل
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="w-16 h-12 bg-primary-100 rounded-lg flex flex-shrink-0 items-center justify-center">
                  <Video className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    أساسيات البرمجة باستخدام بايثون
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    تاريخ النشر: 12 مايو 2026
                  </p>
                </div>
                <div className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md text-sm">
                  45 طالب
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary-600" />
            نشاط الذكاء الاصطناعي
          </h2>
          <div className="flex-1 flex items-center justify-center flex-col text-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-primary-100 flex items-center justify-center border-t-primary-500 animate-[spin_3s_linear_infinite]">
              <span
                className="font-bold text-xl text-primary-600 rotate-0"
                style={{ animation: "spin 3s linear infinite reverse" }}
              >
                150
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900">سؤال مجاب آلياً</p>
              <p className="text-sm text-gray-500">
                خلال آخر 24 ساعة عبر الشات بوت
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CoursesTab() {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCourses()
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setLoading(false);
      });
  }, []);

  if (showAddCourse) {
    return (
      <AddCourseView
        onBack={() => setShowAddCourse(false)}
        onSuccess={(newCourse) => setCourses((prev) => [...prev, newCourse])}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الكورسات</h1>
        <button
          onClick={() => setShowAddCourse(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          كورس جديد
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <div
              key={course.id || i}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-200 transition-all group flex flex-col"
            >
              <div className="h-40 bg-gradient-to-br from-gray-100 to-primary-50 relative overflow-hidden flex items-center justify-center text-gray-400 group-hover:text-primary-400 transition-colors pointer-events-none">
                {course.videoUrl ? (
                  <video
                    src={course.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12" />
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-bold text-gray-800 shadow-sm z-10">
                  {course.price}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-all pointer-events-auto z-20">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform">
                    تعديل الكورس
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{course.duration || "12 ساعة"}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{course.instructor || "أستاذ المادة"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-md">
                      {course.type || "فيديو + PDF"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 ms-auto">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{course.students || 0} طالب</span>
                  </div>
                </div>
                <button className="w-full mt-auto py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-colors flex items-center justify-center gap-2 group-hover:border-primary-200">
                  عرض التفاصيل
                  <ArrowRight className="w-4 h-4 rotate-180 text-gray-400 group-hover:text-primary-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AddCourseView({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: (course: any) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoType, setVideoType] = useState<"upload" | "url">("url");
  const [externalVideoUrl, setExternalVideoUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "مجاني",
    duration: "ساعتين",
    instructor: "أستاذ المادة",
  });

  const handleUpload = async () => {
    if (!formData.title) return alert("الرجاء إدخال عنوان الكورس");
    if (videoType === "url" && !externalVideoUrl)
      return alert("الرجاء إدخال رابط الفيديو");

    setUploading(true);
    setUploadProgress(10);
    try {
      let finalVideoUrl = externalVideoUrl;

      if (videoType === "upload" && videoFile) {
        setUploadProgress(20);
        try {
          const uploadData = await api.uploadFile(videoFile, (progress) => {
            // Scale 20-80% for upload progress
            setUploadProgress(20 + Math.round(progress * 0.6));
          });
          finalVideoUrl = uploadData.url;
        } catch (err: any) {
          console.error("Upload error details:", err);
          const errorMessage = err?.message || JSON.stringify(err);
          alert(
            'تعذر رفع الفيديو إلى التخزين. يرجى التأكد من تفعيل Firebase Storage وتحديث قواعد الأمان، أو استخدام خيار "رابط خارجي" بدلاً من ذلك.\n\nتفاصيل الخطأ: ' +
              errorMessage,
          );
          setUploading(false);
          setUploadProgress(0);
          return;
        }
      }

      setUploadProgress(85);
      const newCourse = await api.addCourse({
        ...formData,
        videoUrl: finalVideoUrl,
        students: 0,
        type: "فيديو حصري",
      });

      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        alert("تم حفظ الكورس بنجاح!");
        onSuccess({
          id: newCourse.id,
          ...formData,
          videoUrl: finalVideoUrl,
          students: 0,
          type: "فيديو حصري",
        });
        onBack();
      }, 500);
    } catch (err: any) {
      setUploading(false);
      setUploadProgress(0);
      alert(
        "حدث خطأ أثناء حفظ الكورس: " + (err?.message || JSON.stringify(err)),
      );
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            إضافة كورس / درس جديد
          </h1>
          <p className="text-gray-500 text-sm">
            ارفع الفيديو والمواد العلمية الخاصة بالكورس
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
        >
          العودة للكورسات
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                عنوان الدرس / الكورس
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                placeholder="مثال: مقدمة في لغة بايثون"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                وصف المحتوى
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm resize-none"
                placeholder="اكتب وصفاً مختصراً لمحتوى الدرس ومخرجات التعلم..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  سعر الكورس
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none w-full text-center"
                    placeholder="مجاني أو السعر"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  اسم المدرس
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    className="border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none w-full text-center"
                    placeholder="د. محمد..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <strong>حماية المحتوى مفعلة:</strong> سيتم تشفير الفيديوهات لمنع
                تحميلها مباشرة لحماية حقوق النشر.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <label className="block text-sm font-bold text-gray-700">
                  فيديو الدرس
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setVideoType("url")}
                    className={`px-4 py-1 text-sm rounded-md transition-colors ${videoType === "url" ? "bg-white shadow-sm font-bold text-primary-600" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    رابط خارجي
                  </button>
                  <button
                    onClick={() => setVideoType("upload")}
                    className={`px-4 py-1 text-sm rounded-md transition-colors ${videoType === "upload" ? "bg-white shadow-sm font-bold text-primary-600" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    رفع ملف
                  </button>
                </div>
              </div>

              {videoType === "url" ? (
                <input
                  type="url"
                  placeholder="أدخل رابط يوتيوب أو فيميو أو جوجل درايف..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none text-right transition-all text-sm font-medium"
                  value={externalVideoUrl}
                  onChange={(e) => setExternalVideoUrl(e.target.value)}
                />
              ) : (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="video/mp4,video/webm"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-primary-50 hover:border-primary-300 transition-colors cursor-pointer group relative overflow-hidden"
                  >
                    {videoFile ? (
                      <div className="text-center">
                        <Video className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                        <p className="font-bold text-gray-800">
                          {videoFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:text-primary-600 group-hover:scale-110 transition-all">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-gray-700 mb-1">
                          اسحب الفيديو وأفلته هنا
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          أو انقر لاختيار ملف من جهازك (الحد الأقصى 2GB)
                        </p>
                        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm pointer-events-none">
                          تصفح الملفات
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                الملحقات (PDF, الصور, كود مصدري)
              </label>
              <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-gray-300 transition-colors cursor-pointer">
                <div className="bg-gray-100 p-2.5 rounded-lg text-gray-400">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-gray-700 text-sm truncate">
                    لا يوجد ملفات مرفقة حالياً
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">0 MB</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-bold mt-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> إضافة ملف آخر
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onBack}
            disabled={uploading}
            className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm"
          >
            إلغاء التغييرات
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                جاري الرفع والمعالجة ({uploadProgress}%)
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 shrink-0" />
                حفظ ونشر الكورس
              </>
            )}
          </button>
        </div>

        {uploading && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between text-xs font-bold text-primary-700 mb-2">
              <span>
                {uploadProgress < 50
                  ? "جاري رفع الفيديو..."
                  : "جاري حفظ بيانات الكورس..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-full transition-all duration-300 ease-linear rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function QuizzesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-primary-600 mb-6">
            <BrainCircuit className="w-6 h-6" />
            <h2 className="text-xl font-bold text-gray-900">
              توليد اختبار بالذكاء الاصطناعي
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حدد الدرس أو ألصق النص
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm focus:border-primary-500 outline-none transition-colors"
                placeholder="مثال: قم بإنشاء 5 أسئلة اختيار من متعدد عن الثورة الصناعية..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الأسئلة
                </label>
                <select className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm outline-none">
                  <option>اختيار من متعدد</option>
                  <option>صح وخطأ</option>
                  <option>مقالي (تصحيح آلي)</option>
                  <option>متنوع</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عدد الأسئلة
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-sm outline-none"
                />
              </div>
            </div>
            <button className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
              <BrainCircuit className="w-5 h-5" />
              توليد الاختبار الآن
            </button>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">
              اختبارات تحتاج مراجعة
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm flex items-center justify-between border border-amber-100">
                <span>اختبار الفيزياء - الوحدة 1</span>
                <span className="font-bold">5 أوراق</span>
              </div>
              <div className="p-3 bg-gray-50 text-gray-600 rounded-lg text-sm flex items-center justify-between border border-gray-100">
                <span>امتحان نهاية الكورس</span>
                <span className="font-bold text-green-600">مكتمل 100%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <Award className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-bold text-lg mb-2">إصدار الشهادات</h3>
              <p className="text-primary-100 text-sm mb-4 leading-relaxed">
                بمجرد اجتياز الطالب للاختبار، سيتم إصدار شهادة موثقة بـ QR Code
                تلقائياً.
              </p>
              <button className="bg-white text-primary-700 px-4 py-2 rounded-lg text-sm font-bold w-full">
                تخصيص قالب الشهادة
              </button>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AITutorTab({ role }: { role: UserRole }) {
  if (role === "student" || role === "guest") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="h-[calc(100vh-8rem)]"
      >
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-gray-100 bg-primary-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BotIcon className="w-6 h-6" />
              <h2 className="font-bold">المساعد الذكي لك</h2>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              متصل ومستعد
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 space-y-4">
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%] flex-row">
                <div className="w-10 h-10 rounded-full bg-secondary-500 text-white flex items-center justify-center shrink-0">
                  <BotIcon className="w-6 h-6" />
                </div>
                <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-gray-800 rounded-tr-none border border-gray-100">
                  أهلاً بك! أنا المساعد الذكي، جاهز لمساعدتك في أي استفسار حول
                  دروسك والكورسات المتاحة.
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                dir="rtl"
              />
              <button className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-[calc(100vh-8rem)]"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-900">
              إعدادات الشات بوت (المساعد الذكي للطلاب)
            </h2>
            <p className="text-xs text-gray-500">
              درب المساعد الخاص بك للإجابة على أسئلة محددة
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            نشط 24/7
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Training Data View */}
          <div className="flex-1 p-6 border-l border-gray-100 overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">
              مصادر معلومات المساعد
            </h3>
            <div className="space-y-4">
              {/* Source Items */}
              <div className="border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-primary-300 transition-colors">
                <div className="bg-blue-50 p-2 rounded-lg h-fit text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900">
                    دليل المنصة (PDF)
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    تم استخراج 45 سؤال وإجابة محتملة.
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                <Plus className="w-6 h-6 mb-2 text-gray-400" />
                <span className="font-bold text-sm text-gray-700">
                  اضف مصدر جديد
                </span>
                <span className="text-xs mt-1">
                  ارفع ملف PDF او رابط لموقعك لتدريب المساعد
                </span>
              </div>
            </div>
          </div>

          {/* Simulator View - similar to the AIChatbot component but styled for dashboard preview */}
          <div className="w-full lg:w-[400px] bg-gray-50 p-6 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 text-sm text-center">
              معاينة تجربة الطالب
            </h3>
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="bg-primary-600 p-3 text-white flex gap-2 items-center">
                <BotIcon className="w-5 h-5" />
                <span className="font-medium text-sm">مساعد إديوسمارت</span>
              </div>
              <div className="flex-1 p-4 bg-slate-50 flex flex-col gap-3">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tr-none p-3 shadow-sm text-sm max-w-[85%] self-start flex gap-2">
                  <span className="mt-0.5 text-lg">👋</span>
                  <span>
                    مرحباً! أنا المساعد الذكي، كيف أساعدك في فهم درس اليوم؟
                  </span>
                </div>
                <div className="bg-primary-600 text-white rounded-2xl rounded-tl-none p-3 shadow-sm text-sm max-w-[85%] self-end">
                  كيف أستخرج الشهادة الخاصة بكورس البايثون؟
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tr-none p-3 shadow-sm text-sm max-w-[85%] self-start">
                  بسيطة جداً! اذهب إلى صفحة "إنجازاتي" وستجد زر "تحميل الشهادة
                  بصيغة PDF". هل ترغب برابط مباشر للصفحة؟
                </div>
              </div>
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm text-gray-400">
                  يجرب الطالب الكتابة هنا...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CodesTab() {
  const [codes, setCodes] = useState([
    {
      id: 1,
      code: "EDUS-X9M2-K4V",
      course: "الرياضيات المتقدمة",
      status: "active",
      user: "--",
      type: "كورس",
    },
    {
      id: 2,
      code: "EDUS-P7L1-Z8B",
      course: "اشتراك بالمنصة (شهر)",
      status: "used",
      user: "أحمد محمود",
      type: "اشتراك",
    },
    {
      id: 3,
      code: "EDUS-A4C9-F2N",
      course: "شحن رصيد - 50$",
      status: "active",
      user: "--",
      type: "رصيد",
    },
  ]);

  const generateCode = (courseName: string, type: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newStr = "EDUS-";
    for (let i = 0; i < 4; i++)
      newStr += chars.charAt(Math.floor(Math.random() * chars.length));
    newStr += "-";
    for (let i = 0; i < 4; i++)
      newStr += chars.charAt(Math.floor(Math.random() * chars.length));

    setCodes([
      {
        id: Date.now(),
        code: newStr,
        course: courseName,
        status: "active",
        user: "--",
        type,
      },
      ...codes,
    ]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ الكود: " + text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            إدارة أكواد التفعيل
          </h1>
          <p className="text-gray-500 text-sm">
            توليد أكواد الاشتراك بالمنصة أو بيع الكورسات
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => generateCode("اشتراك بالمنصة (شهر)", "اشتراك")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            توليد كود اشتراك
          </button>
          <button
            onClick={() => generateCode("عام", "كورس")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm border border-gray-200"
          >
            <Plus className="w-4 h-4" />
            توليد كود كورس
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-bold">الكود (كود التفعيل)</th>
                <th className="px-6 py-4 font-bold">النوع</th>
                <th className="px-6 py-4 font-bold">يُفعلّ (المحتوى)</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">الطالب</th>
                <th className="px-6 py-4 font-bold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    <span
                      className={`px-2 py-1 rounded inline-block ${item.type === "اشتراك" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.course}</td>
                  <td className="px-6 py-4">
                    {item.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        <Check className="w-3.5 h-3.5" /> متاح للبيع
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        <LockIcon className="w-3.5 h-3.5" /> تم الاستخدام
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.user}</td>
                  <td className="px-6 py-4 text-left">
                    <button
                      onClick={() => copyToClipboard(item.code)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="نسخ الكود"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function LockIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function FreeVideoTab({ onSignup }: { onSignup?: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    code: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      alert("يرجى إدخال كود التفعيل المستلم من الإدارة");
      return;
    }
    if (onSignup) onSignup();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pt-2"
    >
      <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <div className="aspect-video bg-[#1a1d24] rounded-2xl overflow-hidden mb-8 relative flex flex-col justify-between p-5">
          <div className="flex-1 flex items-center justify-center">
            <PlayCircle
              className="w-[4.5rem] h-[4.5rem] text-white/90 hover:text-white hover:scale-105 transition-transform cursor-pointer"
              strokeWidth={1}
            />
          </div>
          <div className="flex justify-between items-center text-white/90 text-sm font-medium w-full mt-auto">
            <span>فيديو تعريفي مجاني</span>
            <span dir="ltr">00:00 / 05:30</span>
          </div>
        </div>

        <div className="text-center mb-8 px-2 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-4">
            مقدمة عن منصة إديوسمارت
          </h2>
          <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
            هذا الفيديو متاح لك كـ ضيف لتتعرف على مميزات المنصة وطريقة الشرح.
            للاستمتاع بكافة الكورسات والمميزات وإجراء الاختبارات، يرجى التسجيل
            أو شراء الكورسات المتاحة.
          </p>
        </div>

        <div className="bg-[#f5f8ff] rounded-2xl p-4 sm:p-6 flex items-stretch gap-4 border border-[#e5edff]">
          <div className="flex-1 text-right flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 sm:mb-2 leading-tight">
              هل أعجبك
              <br className="sm:hidden" /> المحتوى؟
            </h3>
            <p className="text-sm text-primary-600 font-medium leading-relaxed">
              انضم إلينا الآن للوصول
              <br className="sm:hidden" /> إلى كافة الكورسات.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 sm:px-8 py-4 sm:py-6 rounded-xl font-bold transition-colors w-[110px] sm:w-[140px] shrink-0 text-center shadow-md shadow-primary-500/20 flex flex-col justify-center items-center leading-snug text-base sm:text-lg"
          >
            <span>إنشاء</span>
            <span>حساب</span>
            <span>طالب</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                إنشاء حساب طالب
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                  placeholder="الاسم ثلاثي"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <input
                  required
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                  placeholder="email@example.com"
                  dir="auto"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  كلمة المرور
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  كود التفعيل (من الإدارة)
                </label>
                <input
                  required
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full border border-primary-200 bg-primary-50 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm font-bold uppercase"
                  placeholder="مثال: EDUS-XXXX-XXXX"
                  dir="ltr"
                />
                <p className="text-xs text-primary-600 mt-1.5 font-medium flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  تحتاج إلى كود اشتراك صالح لإتمام التسجيل
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-6 shadow-md shadow-primary-500/20"
              >
                إنشاء الحساب وتفعيل الاشتراك
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function CertificatesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">شهاداتي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 p-6 flex flex-col items-center justify-center relative">
            <Award className="w-16 h-16 text-emerald-600 mb-2" />
            <span className="absolute top-4 right-4 bg-white/60 text-xs font-bold px-2 py-1 rounded text-emerald-800">
              موثقة
            </span>
          </div>
          <div className="p-5 text-center">
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              أساسيات البرمجة
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              تاريخ الإصدار: 20 مايو 2026
            </p>
            <button className="w-full bg-gray-900 text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors">
              تحميل PDF
            </button>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-gray-400">
          <FileCheck className="w-12 h-12 mb-4 text-gray-300" />
          <p className="font-medium text-gray-600 mb-2">
            أكمل المزيد من الكورسات
          </p>
          <p className="text-sm">
            اجتز الاختبارات بنجاح لتحصل على شهاداتك هنا.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MyCoursesTab() {
  const [activeCourse, setActiveCourse] = useState<any>(null);

  if (activeCourse) {
    return (
      <CoursePlayerView
        course={activeCourse}
        onBack={() => setActiveCourse(null)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            الكورسات المشترك بها
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            تتبع تقدمك وأكمل دروسك بانتظام
          </p>
        </div>
        <button className="text-primary-600 bg-primary-50 px-4 py-2 rounded-lg font-medium text-sm border border-primary-100 hidden sm:block">
          تصفح كورسات جديدة
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() =>
            setActiveCourse({
              title: "أساسيات البرمجة باستخدام بايثون",
              currentLesson: "الدوال والوحدات في بايثون",
              progress: 65,
            })
          }
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-primary-300 transition-all group cursor-pointer lg:col-span-2 flex flex-col sm:flex-row"
        >
          <div className="w-full sm:w-64 bg-gray-100 relative group-hover:bg-primary-50 transition-colors aspect-video sm:aspect-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary-500 opacity-80 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md mb-3 inline-block">
                الدرس الحالي
              </span>
              <h3 className="font-bold text-gray-900 text-xl mb-2">
                الدوال والوحدات في بايثون
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                كورس: أساسيات البرمجة باستخدام بايثون
              </p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                <span>التقدم الإجمالي</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="h-32 bg-gray-100 p-4 flex flex-col justify-end">
            <span className="text-xs font-bold text-green-700 bg-green-100 w-fit px-2 py-1 rounded">
              مكتمل 100%
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                المنطق الرياضي
              </h3>
              <p className="text-sm text-gray-500">
                تم اجتياز الاختبار النهائي بنجاح
              </p>
            </div>
            <button className="w-full mt-4 bg-gray-50 text-gray-700 font-medium py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              عرض الشهادة
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CoursePlayerView({
  course,
  onBack,
}: {
  course: any;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "content" | "attachments" | "discussion"
  >("content");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {course.currentLesson}
          </h1>
          <p className="text-gray-500 text-sm">{course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video relative group">
            {/* Mock Video UI */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
              <button className="w-16 h-16 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700/50">
              <div
                className="h-full bg-primary-500"
                style={{ width: "45%" }}
              ></div>
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2">
              <Video className="w-4 h-4 text-primary-400" />
              محمي ومشفر
            </div>
          </div>

          {/* Description & Tabs */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "content" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
              >
                وصف الدرس
              </button>
              <button
                onClick={() => setActiveTab("attachments")}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "attachments" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
              >
                <FileIcon className="w-4 h-4" /> الملحقات (2)
              </button>
              <button
                onClick={() => setActiveTab("discussion")}
                className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === "discussion" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
              >
                <MessageSquare className="w-4 h-4" /> النقاش
              </button>
            </div>

            <div className="p-6">
              {activeTab === "content" && (
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p>
                    في هذا الدرس سنتعرف على كيفية استخدام الدوال والوحدات في
                    بايثون لتنظيم الكود وإعادة استخدامه.
                  </p>
                  <h4 className="mt-4 text-gray-900 font-bold mb-2">
                    أهداف الدرس:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      تعريف الدالة باستخدام <code>def</code>
                    </li>
                    <li>تمرير المعاملات (Parameters)</li>
                    <li>إرجاع القيم (Return Values)</li>
                    <li>استيراد الوحدات الجاهزة وتصنيع وحدات خاصة</li>
                  </ul>
                </div>
              )}
              {activeTab === "attachments" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          مذكرة الدوال (PDF)
                        </h4>
                        <p className="text-xs text-gray-500">1.2 MB</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                          الأكواد المصدرية (ZIP)
                        </h4>
                        <p className="text-xs text-gray-500">450 KB</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              {activeTab === "discussion" && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-1">
                    لا توجد أسئلة بعد
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    كن أول من يطرح سؤالاً حول هذا الدرس
                  </p>
                  <button className="bg-primary-50 text-primary-600 font-medium px-4 py-2 rounded-lg text-sm">
                    أضف سؤالاً
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Course Progress */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">
              كورس: {course.title}
            </h3>
            <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
              <span>مكتمل {course.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-gray-900 mb-3 text-sm">
                محتوى الكورس
              </div>
              {[
                {
                  title: "المتغيرات وأنواع البيانات",
                  duration: "12:45",
                  completed: true,
                },
                {
                  title: "الجمل الشرطية وحلقات التكرار",
                  duration: "18:20",
                  completed: true,
                },
                {
                  title: "الدوال والوحدات في بايثون",
                  duration: "24:10",
                  active: true,
                },
                { title: "التعامل مع الملفات", duration: "15:30" },
                { title: "مقدمة في البرمجة الكائنية", duration: "28:00" },
              ].map((lesson, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${lesson.active ? "bg-primary-50 border border-primary-100" : "hover:bg-gray-50 border border-transparent"}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {lesson.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : lesson.active ? (
                      <PlayCircle className="w-5 h-5 text-primary-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-bold text-sm ${lesson.active ? "text-primary-900" : "text-gray-700"}`}
                    >
                      {lesson.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {lesson.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">إعدادات الحساب</h1>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm max-w-3xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
              أ
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">أحمد محمود</h2>
              <p className="text-gray-500 text-sm">ahmed@example.com</p>
            </div>
            <button className="mr-auto bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              تغيير الصورة
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                الاسم بالكامل
              </label>
              <input
                type="text"
                defaultValue="أحمد محمود"
                className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                defaultValue="ahmed@example.com"
                className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                dir="ltr"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">تغيير كلمة المرور</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                  dir="ltr"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors text-sm"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
              حفظ التعديلات
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BotIcon(props: any) {
  return <BrainCircuit {...props} />;
}

// --- Utils ---

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
        active
          ? "bg-primary-50 text-primary-700 shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <div className={`${active ? "text-primary-600" : "text-gray-400"}`}>
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

function StatCard({
  title,
  value,
  trend,
  icon,
  color,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "amber";
}) {
  const bgColors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${bgColors[color]}`}>{icon}</div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
          {trend}
        </span>
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{title}</div>
      </div>
    </div>
  );
}

function StudentsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الطلاب</h1>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
          <Plus className="w-5 h-5" />
          إضافة طالب
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="ابحث باسم الطالب أو البريد..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button className="text-gray-600 bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-100">
            تصفية
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="p-4">اسم الطالب</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">تاريخ الانضمام</th>
                <th className="p-4 text-center">الاشتراك</th>
                <th className="p-4 text-center">الحالة</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">محمد علي {i}</td>
                  <td className="p-4" dir="ltr">
                    student{i}@example.com
                  </td>
                  <td className="p-4">2023-10-{15 + i}</td>
                  <td className="p-4 text-center">
                    <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded text-xs font-bold border border-primary-100">
                      باقة VIP
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs font-bold">
                      نشط
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-primary-600 p-1.5 hover:bg-primary-50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function ReportsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        التقارير والإحصائيات
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              +15% هذا الشهر
            </span>
          </div>
          <h3 className="text-gray-500 font-medium text-sm mb-1">
            إجمالي الاشتراكات
          </h3>
          <div className="text-3xl font-black text-gray-900">2,450</div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
              <PlayCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
              +8% هذا الشهر
            </span>
          </div>
          <h3 className="text-gray-500 font-medium text-sm mb-1">
            جلسات المشاهدة
          </h3>
          <div className="text-3xl font-black text-gray-900">12,840</div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <Ticket className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
              -2% هذا الشهر
            </span>
          </div>
          <h3 className="text-gray-500 font-medium text-sm mb-1">
            الأكواد المستخدمة
          </h3>
          <div className="text-3xl font-black text-gray-900">845</div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">
            المخطط البياني للتقارير (سيتم إضافته لاحقاً)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
