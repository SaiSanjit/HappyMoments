import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Camera,
  Layers,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';

interface Chapter {
  title: string;
  time: number;
  timeLabel: string;
  description: string;
  icon: React.ReactNode;
}

const CHAPTERS: Chapter[] = [
  {
    title: 'Portal Overview & Getting Started',
    time: 0,
    timeLabel: '00:00',
    description: 'Learn where to access the vendor portal and what features are available.',
    icon: <Sparkles className="w-4 h-4 text-orange-500" />
  },
  {
    title: 'Vendor Login & Credentials',
    time: 35,
    timeLabel: '00:35',
    description: 'How to sign in securely using your registered vendor credentials.',
    icon: <LogIn className="w-4 h-4 text-blue-500" />
  },
  {
    title: 'Dashboard Navigation',
    time: 80,
    timeLabel: '01:20',
    description: 'A complete tour of the vendor dashboard layout and key metrics.',
    icon: <Layers className="w-4 h-4 text-purple-500" />
  },
  {
    title: 'Profile & Package Setup',
    time: 130,
    timeLabel: '02:10',
    description: 'Update your portfolio images, pricing, and services offered.',
    icon: <Camera className="w-4 h-4 text-emerald-500" />
  },
  {
    title: 'Managing Leads & Inquiries',
    time: 180,
    timeLabel: '03:00',
    description: 'Review incoming customer requests and connect with wedding clients.',
    icon: <TrendingUp className="w-4 h-4 text-amber-500" />
  },
  {
    title: 'Best Practices for Success',
    time: 230,
    timeLabel: '03:50',
    description: 'Pro tips to maintain high ratings and close more wedding bookings.',
    icon: <Award className="w-4 h-4 text-rose-500" />
  }
];

const FAQS = [
  {
    question: 'How do I obtain my vendor login credentials?',
    answer: 'Your account credentials are generated upon successful verification of your business. If you registered recently or need assistance receiving your login details, contact our vendor onboarding team.'
  },
  {
    question: 'What if I forgot my vendor password?',
    answer: 'On the Vendor Login dialog, click "Forgot password?". Enter your registered email to receive a verification code and reset your password securely.'
  },
  {
    question: 'How quickly will I receive customer leads?',
    answer: 'Once your profile is active, clients searching for your category and location will discover your profile and send direct inquiries to your dashboard and phone.'
  },
  {
    question: 'Can I update my portfolio photos and pricing anytime?',
    answer: 'Yes! From your vendor dashboard, you can edit your business details, upload high-resolution work samples, and adjust your package pricing whenever you want.'
  }
];

const VendorTutorial: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(256);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update current time & active chapter
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      // Find active chapter
      let activeIndex = 0;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        if (cur >= CHAPTERS[i].time) {
          activeIndex = i;
          break;
        }
      }
      setActiveChapterIndex(activeIndex);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 256);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const jumpToChapter = (chapterTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = chapterTime;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const changeSpeed = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow">
        {/* Top Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-wedding-navy via-slate-900 to-slate-900 text-white pt-10 pb-20">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F57C00_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Navigation / Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Link 
                  to="/vendor-login"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/15"
                >
                  <ArrowLeft className="w-4 h-4 text-wedding-orange" />
                  Back to Vendor Login
                </Link>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-xs sm:text-sm text-white/70 hidden sm:inline">
                  Happy Moments Vendor Academy
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/vendor-login')}
                  className="bg-wedding-orange hover:bg-wedding-orange-hover text-white text-xs sm:text-sm px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-orange-500/25 transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Vendor Login
                </Button>
              </div>
            </div>

            {/* Header Content */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-4 h-4 text-wedding-orange" />
                Official Vendor Walkthrough Video
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
                How to Use Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Vendor Portal</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6">
                Watch our quick step-by-step walkthrough to get familiar with signing in, setting up your services, viewing wedding leads, and growing your business.
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  ~4 Minutes Walkthrough
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Guide
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Full HD Mobile Screen Walkthrough
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Video Player & Chapters Section */}
        <section className="relative -mt-10 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left/Center: Video Player Showcase */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-4 shadow-2xl border border-slate-200/80 relative">
                  {/* Subtle outer glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-xl -z-10" />

                  {/* Top Phone-Style Bezel Accent */}
                  <div className="flex items-center justify-between px-3 py-1 mb-2 text-xs text-slate-500 border-b border-slate-100">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Vendor Tutorial Video
                    </span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {formatSeconds(currentTime)} / {formatSeconds(duration)}
                    </span>
                  </div>

                  {/* Video Box */}
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/19] sm:aspect-[9/18.5] max-h-[620px] mx-auto flex items-center justify-center shadow-inner group">
                    <video
                      ref={videoRef}
                      src="/vendor_tutorial.mp4"
                      className="w-full h-full object-contain cursor-pointer"
                      playsInline
                      preload="metadata"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlay}
                    />

                    {/* Big Overlay Play Button when paused */}
                    {!isPlaying && (
                      <button
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-wedding-orange/90 hover:bg-wedding-orange text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 z-20 backdrop-blur-sm"
                        aria-label="Play tutorial video"
                      >
                        <Play className="w-9 h-9 fill-current ml-1" />
                      </button>
                    )}
                  </div>

                  {/* Custom Modern Controls Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    {/* Progress Bar */}
                    <div 
                      className="w-full bg-slate-200 h-2 rounded-full cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        if (videoRef.current) {
                          videoRef.current.currentTime = pos * duration;
                        }
                      }}
                    >
                      <div 
                        className="bg-gradient-to-r from-wedding-orange to-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={togglePlay}
                          className="w-9 h-9 rounded-full bg-wedding-orange hover:bg-wedding-orange-hover text-white flex items-center justify-center transition-colors shadow-sm"
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>

                        <button
                          onClick={() => skipTime(-10)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                          title="Rewind 10s"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => skipTime(10)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                          title="Forward 10s"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-xs font-medium text-slate-600 pl-1">
                          {formatSeconds(currentTime)} / {formatSeconds(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Speed selector */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-semibold text-slate-700">
                          {[1, 1.25, 1.5].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => changeSpeed(speed)}
                              className={`px-2 py-1 rounded transition-colors ${
                                playbackRate === speed
                                  ? 'bg-white shadow text-wedding-orange'
                                  : 'hover:text-slate-900'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={toggleFullscreen}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                          title="Fullscreen"
                        >
                          <Maximize className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct helper below video */}
                <p className="text-xs text-slate-500 mt-3 text-center">
                  💡 Tip: Click any chapter on the right to jump directly to that section.
                </p>
              </div>

              {/* Right: Interactive Chapters & Step-by-Step Guide */}
              <div className="lg:col-span-5 space-y-6">
                {/* Chapters Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Video Chapters</h2>
                      <p className="text-xs text-slate-500">Jump to any specific topic in the video</p>
                    </div>
                    <span className="text-xs font-semibold bg-orange-50 text-wedding-orange px-2.5 py-1 rounded-full border border-orange-200">
                      6 Topics
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {CHAPTERS.map((chapter, idx) => {
                      const isActive = activeChapterIndex === idx;
                      return (
                        <button
                          key={chapter.title}
                          onClick={() => jumpToChapter(chapter.time)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                            isActive
                              ? 'bg-orange-50/80 border-wedding-orange/50 shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                            isActive ? 'bg-wedding-orange text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {chapter.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-semibold truncate ${
                                isActive ? 'text-wedding-orange' : 'text-slate-800'
                              }`}>
                                {chapter.title}
                              </span>
                              <span className="text-xs font-mono font-medium text-slate-500 ml-2">
                                {chapter.timeLabel}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {chapter.description}
                            </p>
                          </div>

                          <ChevronRight className={`w-4 h-4 mt-2 transition-transform ${
                            isActive ? 'text-wedding-orange translate-x-0.5' : 'text-slate-300'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Action CTA Card */}
                <div className="bg-gradient-to-br from-wedding-navy to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-orange/10 rounded-full blur-2xl" />
                  
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-wedding-orange" />
                    Ready to Log In?
                  </h3>
                  <p className="text-sm text-slate-300 mb-5">
                    Put what you learned into action. Access your vendor dashboard now to update your profile and review customer leads.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => navigate('/vendor-login')}
                      className="w-full bg-wedding-orange hover:bg-wedding-orange-hover text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Go to Vendor Login
                    </Button>

                    <a
                      href="https://wa.me/917330732710?text=Hi%20HappyMoments!%20I%20have%20a%20question%20about%20the%20vendor%20tutorial%20and%20login."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10 text-center"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      Ask on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features & Walkthrough Highlights */}
        <section className="py-12 bg-white border-t border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                Everything You Need to Succeed
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Your Happy Moments vendor portal is built to give you total control over how clients discover and book your services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Instant Lead Alerts</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Receive notifications as soon as a customer requests details for their wedding date.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Portfolio & Media</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Upload high-res photos and packages to showcase your best work to future couples.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Packages & Pricing</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Create clear pricing tiers so clients understand what's included before they reach out.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Direct Client Calls</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Verified couples can connect with you via WhatsApp and phone calls without friction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-slate-50 border-t border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-semibold mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-wedding-orange" />
                Vendor Help & Questions
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/70"
                >
                  <h3 className="text-base font-bold text-slate-800 mb-2 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-wedding-orange flex-shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Support Callout */}
            <div className="mt-12 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-3xl p-6 sm:p-8 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Still have questions or need help onboarding?
              </h3>
              <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
                Our vendor support managers are available to guide you through setup, profile optimization, and lead handling.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="tel:7330732710"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  Call: 7330732710
                </a>

                <a
                  href="https://wa.me/917330732710?text=Hi%20HappyMoments!%20I'm%20a%20vendor%20and%20need%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>

                <Button
                  onClick={() => navigate('/vendor-login')}
                  className="bg-wedding-orange hover:bg-wedding-orange-hover text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VendorTutorial;
