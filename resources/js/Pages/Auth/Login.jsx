import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const formatTime = () => {
        return new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100" dir="rtl">
            <Head title="تسجيل الدخول - HOMED" />

            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative flex min-h-screen">
                {/* Left Side - Login Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                    <div className="w-full max-w-md space-y-8">
                        {/* Header */}
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                    <img
                                        src="/images/homd1.png"
                                        alt="HOMED Logo"
                                        className="w-12 h-12 object-contain filter brightness-0 invert"
                                    />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">HOMED</h1>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">مرحباً بعودتك</h2>
                            <p className="text-gray-600">قم بتسجيل الدخول للوصول إلى حسابك</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="mr-3">
                                        <p className="text-sm font-medium text-green-800">{status}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Form */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="phone" value="رقم الهاتف" className="text-gray-700 font-medium" />
                                    <div className="mt-2 relative">
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-right"
                                            autoComplete="tel"
                                            isFocused={true}
                                            placeholder="07712345678"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="كلمة المرور" className="text-gray-700 font-medium" />
                                    <div className="mt-2 relative">
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-right"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="mr-2 text-sm text-gray-600">تذكرني</span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                                        >
                                            نسيت كلمة المرور؟
                                        </Link>
                                    )}
                                </div>

                                <PrimaryButton
                                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image and Info */}
                <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
                        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
                        <div className="mb-8">
                            <img
                                src="/images/homd1.png"
                                alt="HOMED System"
                                className="w-32 h-32 mx-auto mb-6 filter brightness-0 invert"
                            />
                            <h3 className="text-4xl font-bold mb-4">نظام HOMED</h3>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                نظام إدارة متقدم للعملاء والحملات الإعلانية<br/>
                                تحكم كامل وسهولة في الاستخدام
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-center space-x-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">{formatTime()}</div>
                                    <div className="text-blue-200 text-sm">{formatDate()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="text-2xl font-bold">100%</div>
                                <div className="text-blue-200 text-sm">آمان</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-blue-200 text-sm">متاح</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                <div className="text-2xl font-bold">سريع</div>
                                <div className="text-blue-200 text-sm">الأداء</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
