import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function MainScreen({ auth }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('ar-SA', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const features = [
        {
            title: 'إدارة العملاء',
            description: 'نظام شامل لإدارة قاعدة بيانات العملاء وتتبع معلوماتهم',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'حملات الإعلان',
            description: 'تخطيط وإدارة ومتابعة حملات الإعلان الرقمي بكفاءة عالية',
            icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'إدارة المشاريع',
            description: 'تنظيم ومتابعة المشاريع من البداية حتى التسليم النهائي',
            icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'التقارير والإحصائيات',
            description: 'تقارير مفصلة وإحصائيات دقيقة لمراقبة الأداء وإتخاذ القرارات',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const stats = [
        { label: 'العملاء النشطين', value: '1,250+', icon: '👥' },
        { label: 'المشاريع المكتملة', value: '345', icon: '✅' },
        { label: 'الحملات الجارية', value: '28', icon: '📢' },
        { label: 'معدل النجاح', value: '96%', icon: '🎯' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
            <Head title="نظام إدارة العملاء والحملات الإعلانية" />

            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-900">AdManager Pro</h1>
                                <p className="text-sm text-gray-600">نظام إدارة العملاء والحملات</p>
                            </div>
                        </div>

                        {/* Navigation - Desktop */}
                        <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">الميزات</a>
                            <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">حولنا</a>
                            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">تواصل معنا</a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-3 space-x-reverse">
                            {auth.user ? (
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <span className="text-sm text-gray-700">مرحباً، {auth.user.name}</span>
                                    <Link
                                        href="/dashboard"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                        لوحة التحكم
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <Link
                                        href="/login"
                                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                    >
                                        إنشاء حساب
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                        <div className="px-4 py-3 space-y-3">
                            <a href="#features" className="block text-gray-700 hover:text-blue-600 font-medium py-2">الميزات</a>
                            <a href="#about" className="block text-gray-700 hover:text-blue-600 font-medium py-2">حولنا</a>
                            <a href="#contact" className="block text-gray-700 hover:text-blue-600 font-medium py-2">تواصل معنا</a>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            إدارة متقدمة للعملاء
                            <span className="block text-blue-200">والحملات الإعلانية</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                            نظام شامل ومتطور لإدارة العملاء وحملات الإعلان والمشاريع بكفاءة وسهولة تامة
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href="/register"
                                        className="w-full sm:w-auto bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                    >
                                        ابدأ الآن مجاناً
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-700 transition-all duration-200"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className="w-full sm:w-auto bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                >
                                    دخول لوحة التحكم
                                </Link>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-blue-200 text-sm sm:text-base">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ميزات متطورة لإدارة أعمالك
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            استفد من مجموعة شاملة من الأدوات المتقدمة لإدارة عملائك ومشاريعك بكفاءة استثنائية
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Time Display Section */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 inline-block">
                        <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-xl text-gray-300">
                            {formatDate(currentTime)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center space-x-3 space-x-reverse mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">AdManager Pro</h3>
                                    <p className="text-gray-400">حلول إدارية متطورة</p>
                                </div>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                نظام شامل لإدارة العملاء والحملات الإعلانية والمشاريع بأحدث التقنيات والمعايير العالمية.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-xl font-bold mb-6">روابط سريعة</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">الميزات</a></li>
                                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">حولنا</a></li>
                                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">تواصل معنا</a></li>
                                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">سياسة الخصوصية</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-xl font-bold mb-6">تواصل معنا</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3 space-x-reverse">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-gray-400">+971 50 123 4567</span>
                                </li>
                                <li className="flex items-center space-x-3 space-x-reverse">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-400">info@admanager.ae</span>
                                </li>
                                <li className="flex items-center space-x-3 space-x-reverse">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-gray-400">دبي، الإمارات العربية المتحدة</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">
                            © 2025 AdManager Pro. جميع الحقوق محفوظة.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
