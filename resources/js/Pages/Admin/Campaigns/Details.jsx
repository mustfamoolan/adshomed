import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Details({ campaign, project, marketingType, dailyMetrics = [] }) {
    const [editMode, setEditMode] = useState(false);
    const [dailyEditMode, setDailyEditMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [metrics, setMetrics] = useState(campaign.metrics || {});
    const [dailyData, setDailyData] = useState(dailyMetrics);

    const { data, setData, put, post, processing, errors, reset } = useForm({
        metrics: campaign.metrics || {},
        date: selectedDate,
        daily_metrics: {}
    });

    // إنشاء بيانات يومية من البيانات الحقيقية
    useEffect(() => {
        if (dailyMetrics && dailyMetrics.length > 0) {
            setDailyData(dailyMetrics);
        }
    }, [dailyMetrics]);

    // تحديد الحقول بناءً على منصة التسويق
    const getMetricsFields = (platformKey) => {
        const commonFields = {
            impressions: { label: 'عدد المشاهدات', type: 'number', format: 'number' },
            clicks: { label: 'عدد النقرات', type: 'number', format: 'number' },
            reach: { label: 'الوصول', type: 'number', format: 'number' },
            frequency: { label: 'التكرار', type: 'number', format: 'decimal' },
            ctr: { label: 'معدل النقر %', type: 'number', format: 'percentage' },
            cpm: { label: 'تكلفة الألف ظهور', type: 'number', format: 'currency' },
            cpc: { label: 'تكلفة النقرة', type: 'number', format: 'currency' },
        };

        // البيانات الديموغرافية والتحويلات (مشتركة لجميع المنصات)
        const demographicsFields = {
            // الدول
            top_countries: { label: 'أهم 3 دول', type: 'text', format: 'text' },
            country_iraq_percentage: { label: 'نسبة العراق %', type: 'number', format: 'percentage' },
            country_saudi_percentage: { label: 'نسبة السعودية %', type: 'number', format: 'percentage' },
            country_uae_percentage: { label: 'نسبة الإمارات %', type: 'number', format: 'percentage' },
            country_other_percentage: { label: 'نسبة دول أخرى %', type: 'number', format: 'percentage' },

            // الفئات العمرية
            age_18_24_percentage: { label: 'الفئة 18-24 سنة %', type: 'number', format: 'percentage' },
            age_25_34_percentage: { label: 'الفئة 25-34 سنة %', type: 'number', format: 'percentage' },
            age_35_44_percentage: { label: 'الفئة 35-44 سنة %', type: 'number', format: 'percentage' },
            age_45_54_percentage: { label: 'الفئة 45-54 سنة %', type: 'number', format: 'percentage' },
            age_55_plus_percentage: { label: 'الفئة 55+ سنة %', type: 'number', format: 'percentage' },

            // الجنس
            male_percentage: { label: 'نسبة الذكور %', type: 'number', format: 'percentage' },
            female_percentage: { label: 'نسبة الإناث %', type: 'number', format: 'percentage' },

            // التحويلات والمحادثات
            total_conversations: { label: 'عدد المحادثات الكلي', type: 'number', format: 'number' },
            leads_qualified: { label: 'العملاء المؤهلين', type: 'number', format: 'number' },
            customers_purchased: { label: 'عملاء اشتروا', type: 'number', format: 'number' },
            customers_not_purchased: { label: 'عملاء لم يشتروا', type: 'number', format: 'number' },
            conversion_rate_sales: { label: 'معدل تحويل المبيعات %', type: 'number', format: 'percentage' },
            average_order_value: { label: 'متوسط قيمة الطلب', type: 'number', format: 'currency' },
            total_revenue: { label: 'إجمالي الإيرادات', type: 'number', format: 'currency' },
            roas: { label: 'عائد الإنفاق الإعلاني', type: 'number', format: 'decimal' },
        };

        switch (platformKey) {
            case 'facebook':
            case 'instagram':
                return {
                    ...commonFields,
                    ...demographicsFields,
                    engagement: { label: 'التفاعل', type: 'number', format: 'number' },
                    likes: { label: 'الإعجابات', type: 'number', format: 'number' },
                    shares: { label: 'المشاركات', type: 'number', format: 'number' },
                    comments: { label: 'التعليقات', type: 'number', format: 'number' },
                    page_likes: { label: 'إعجابات الصفحة', type: 'number', format: 'number' },
                    video_views: { label: 'مشاهدات الفيديو', type: 'number', format: 'number' },
                    leads: { label: 'العملاء المحتملين', type: 'number', format: 'number' },
                    conversions: { label: 'التحويلات', type: 'number', format: 'number' },
                };
            case 'google':
                return {
                    ...commonFields,
                    ...demographicsFields,
                    conversions: { label: 'التحويلات', type: 'number', format: 'number' },
                    conversion_rate: { label: 'معدل التحويل %', type: 'number', format: 'percentage' },
                    cost_per_conversion: { label: 'تكلفة التحويل', type: 'number', format: 'currency' },
                    quality_score: { label: 'نقاط الجودة', type: 'number', format: 'decimal' },
                    position: { label: 'المتوسط الموضع', type: 'number', format: 'decimal' },
                    search_terms: { label: 'المصطلحات البحثية', type: 'number', format: 'number' },
                };
            case 'youtube':
                return {
                    ...commonFields,
                    ...demographicsFields,
                    video_views: { label: 'مشاهدات الفيديو', type: 'number', format: 'number' },
                    view_rate: { label: 'معدل المشاهدة %', type: 'number', format: 'percentage' },
                    avg_watch_time: { label: 'متوسط وقت المشاهدة (ثانية)', type: 'number', format: 'time' },
                    subscribers: { label: 'المشتركين الجدد', type: 'number', format: 'number' },
                    likes: { label: 'الإعجابات', type: 'number', format: 'number' },
                    dislikes: { label: 'عدم الإعجاب', type: 'number', format: 'number' },
                    comments: { label: 'التعليقات', type: 'number', format: 'number' },
                };
            case 'tiktok':
                return {
                    ...commonFields,
                    ...demographicsFields,
                    video_views: { label: 'مشاهدات الفيديو', type: 'number', format: 'number' },
                    likes: { label: 'الإعجابات', type: 'number', format: 'number' },
                    shares: { label: 'المشاركات', type: 'number', format: 'number' },
                    comments: { label: 'التعليقات', type: 'number', format: 'number' },
                    follows: { label: 'المتابعين الجدد', type: 'number', format: 'number' },
                    profile_views: { label: 'مشاهدات الملف الشخصي', type: 'number', format: 'number' },
                };
            case 'twitter':
                return {
                    ...commonFields,
                    ...demographicsFields,
                    retweets: { label: 'إعادة التغريد', type: 'number', format: 'number' },
                    likes: { label: 'الإعجابات', type: 'number', format: 'number' },
                    replies: { label: 'الردود', type: 'number', format: 'number' },
                    mentions: { label: 'الإشارات', type: 'number', format: 'number' },
                    followers: { label: 'المتابعين الجدد', type: 'number', format: 'number' },
                    profile_visits: { label: 'زيارات الملف الشخصي', type: 'number', format: 'number' },
                };
            case 'linkedin':
                return {
                    ...commonFields,
                    ...demographicsFields,
                    engagement: { label: 'التفاعل', type: 'number', format: 'number' },
                    clicks: { label: 'النقرات', type: 'number', format: 'number' },
                    leads: { label: 'العملاء المحتملين', type: 'number', format: 'number' },
                    followers: { label: 'المتابعين الجدد', type: 'number', format: 'number' },
                    shares: { label: 'المشاركات', type: 'number', format: 'number' },
                    comments: { label: 'التعليقات', type: 'number', format: 'number' },
                };
            default:
                return { ...commonFields, ...demographicsFields };
        }
    };

    const metricsFields = getMetricsFields(campaign.marketing_type_key);

    const formatValue = (value, format) => {
        if (!value) return '0';

        switch (format) {
            case 'number':
                return new Intl.NumberFormat('en-US').format(value);
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'IQD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(value);
            case 'percentage':
                return `${value}%`;
            case 'decimal':
                return parseFloat(value).toFixed(2);
            case 'time':
                const minutes = Math.floor(value / 60);
                const seconds = value % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            case 'text':
                return value.toString();
            default:
                return value;
        }
    };    const updateMetric = (key, value) => {
        const field = metricsFields[key];
        let processedValue = value;

        if (field && field.type === 'text') {
            processedValue = value; // للنصوص نحتفظ بالقيمة كما هي
        } else {
            processedValue = parseFloat(value) || 0; // للأرقام نحولها إلى float
        }

        const newMetrics = { ...metrics, [key]: processedValue };
        setMetrics(newMetrics);
        setData('metrics', newMetrics);
    };

    const handleSave = (e) => {
        e.preventDefault();
        put(route('admin.campaigns.update-metrics', campaign.id), {
            onSuccess: () => {
                setEditMode(false);
                reset();
            }
        });
    };

    // دوال البيانات اليومية
    const handleSaveDailyMetrics = (e) => {
        e.preventDefault();

        // التحقق من وجود بيانات
        if (!data.daily_metrics || Object.keys(data.daily_metrics).length === 0) {
            alert('يرجى إدخال بعض البيانات أولاً');
            return;
        }

        console.log('البيانات قبل الإرسال:', {
            date: selectedDate,
            metrics: data.daily_metrics
        });

        // استخدام router.post مباشرة مع البيانات
        router.post(route('admin.campaigns.store-daily-metrics', campaign.id), {
            date: selectedDate,
            metrics: data.daily_metrics
        }, {
            onSuccess: (response) => {
                setDailyEditMode(false);

                // تحديث البيانات اليومية محلياً
                const newDailyMetric = {
                    date: selectedDate,
                    metrics: data.daily_metrics
                };

                // إضافة أو تحديث البيانات اليومية
                const updatedDailyData = [...dailyData];
                const existingIndex = updatedDailyData.findIndex(item => item.date === selectedDate);

                if (existingIndex >= 0) {
                    updatedDailyData[existingIndex] = newDailyMetric;
                } else {
                    updatedDailyData.push(newDailyMetric);
                }

                // ترتيب البيانات حسب التاريخ
                updatedDailyData.sort((a, b) => new Date(a.date) - new Date(b.date));

                setDailyData(updatedDailyData);

                // إعادة تعيين النموذج
                setData('daily_metrics', {});

                alert('تم حفظ البيانات بنجاح! ستظهر في الرسوم البيانية فوراً.');
            },
            onError: (errors) => {
                console.error('خطأ في حفظ البيانات:', errors);

                // عرض تفاصيل الخطأ
                let errorMessage = 'حدث خطأ أثناء حفظ البيانات:\n';
                if (typeof errors === 'object') {
                    Object.keys(errors).forEach(key => {
                        errorMessage += `${key}: ${errors[key]}\n`;
                    });
                } else {
                    errorMessage += errors;
                }
                alert(errorMessage);
            }
        });
    };    const generateDailyMetrics = () => {
        if (confirm('هل تريد إنشاء بيانات يومية افتراضية لمدة الحملة؟ سيتم استبدال البيانات الموجودة.')) {
            post(route('admin.campaigns.generate-daily-metrics', campaign.id), {
                onSuccess: () => {
                    window.location.reload();
                }
            });
        }
    };

    const updateDailyMetric = (key, value) => {
        const currentMetrics = data.daily_metrics || {};
        const newMetrics = { ...currentMetrics, [key]: parseFloat(value) || 0 };
        setData('daily_metrics', newMetrics);
    };

    // إعداد البيانات للرسوم البيانية الزمنية
    const getTimeSeriesData = () => {
        if (!dailyData || dailyData.length === 0) return null;

        const dates = dailyData.map(day => new Date(day.date).toLocaleDateString('ar'));

        return {
            impressions: {
                labels: dates,
                datasets: [{
                    label: 'المشاهدات',
                    data: dailyData.map(day => day.metrics?.impressions || 0),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                }]
            },
            clicks: {
                labels: dates,
                datasets: [{
                    label: 'النقرات',
                    data: dailyData.map(day => day.metrics?.clicks || 0),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.1
                }]
            },
            conversions: {
                labels: dates,
                datasets: [{
                    label: 'التحويلات',
                    data: dailyData.map(day => day.metrics?.conversions || 0),
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.1
                }]
            },
            customers_purchased: {
                labels: dates,
                datasets: [{
                    label: 'عملاء اشتروا',
                    data: dailyData.map(day => day.metrics?.customers_purchased || 0),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.1
                }]
            }
        };
    };

    const timeSeriesData = getTimeSeriesData();

    // بيانات الرسوم البيانية
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // إعدادات الرسوم البيانية المفردة
    const singleAxisOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const performanceData = {
        labels: ['المشاهدات', 'النقرات', 'التفاعل', 'التحويلات'],
        datasets: [
            {
                label: 'الأداء',
                data: [
                    metrics.impressions || 0,
                    metrics.clicks || 0,
                    metrics.engagement || 0,
                    metrics.conversions || 0,
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const engagementData = {
        labels: ['إعجابات', 'مشاركات', 'تعليقات'],
        datasets: [
            {
                data: [
                    metrics.likes || 0,
                    metrics.shares || 0,
                    metrics.comments || 0,
                ],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                ],
                borderWidth: 0,
            },
        ],
    };

    // بيانات التوزيع الجغرافي
    const geographicData = {
        labels: ['العراق', 'السعودية', 'الإمارات', 'دول أخرى'],
        datasets: [
            {
                data: [
                    metrics.country_iraq_percentage || 0,
                    metrics.country_saudi_percentage || 0,
                    metrics.country_uae_percentage || 0,
                    metrics.country_other_percentage || 0,
                ],
                backgroundColor: [
                    '#EF4444',
                    '#22C55E',
                    '#3B82F6',
                    '#A855F7',
                ],
                borderWidth: 0,
            },
        ],
    };

    // بيانات الفئات العمرية
    const ageData = {
        labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
        datasets: [
            {
                label: 'الفئات العمرية %',
                data: [
                    metrics.age_18_24_percentage || 0,
                    metrics.age_25_34_percentage || 0,
                    metrics.age_35_44_percentage || 0,
                    metrics.age_45_54_percentage || 0,
                    metrics.age_55_plus_percentage || 0,
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
            },
        ],
    };

    // بيانات الجنس
    const genderData = {
        labels: ['ذكور', 'إناث'],
        datasets: [
            {
                data: [
                    metrics.male_percentage || 0,
                    metrics.female_percentage || 0,
                ],
                backgroundColor: [
                    '#3B82F6',
                    '#EC4899',
                ],
                borderWidth: 0,
            },
        ],
    };

    // بيانات التحويلات والمبيعات
    const conversionData = {
        labels: ['محادثات كلية', 'عملاء مؤهلين', 'اشتروا', 'لم يشتروا'],
        datasets: [
            {
                label: 'التحويلات',
                data: [
                    metrics.total_conversations || 0,
                    metrics.leads_qualified || 0,
                    metrics.customers_purchased || 0,
                    metrics.customers_not_purchased || 0,
                ],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.5)',
                    'rgba(34, 197, 94, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    return (
        <AdminLayout title={`تفاصيل الحملة: ${campaign.name || 'حملة جديدة'}`}>
            <Head title={`تفاصيل الحملة: ${campaign.name || 'حملة جديدة'}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href={route('admin.campaigns.show', project.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                حملات {project.name}
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 text-sm font-medium">تفاصيل الحملة</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {campaign.name || 'حملة جديدة'}
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                                المنصة: <span className="font-medium">{marketingType.name_ar}</span>
                            </span>
                            <span className="text-sm text-gray-600">
                                المدة: {new Date(campaign.start_date).toLocaleDateString('ar')} - {new Date(campaign.end_date).toLocaleDateString('ar')}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
                                editMode
                                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {editMode ? 'إلغاء التعديل' : 'تعديل الإحصائيات'}
                        </button>
                    </div>
                </div>

                {/* Campaign Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">المشاهدات</p>
                                <p className="text-2xl font-bold text-gray-900">{formatValue(metrics.impressions, 'number')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">النقرات</p>
                                <p className="text-2xl font-bold text-gray-900">{formatValue(metrics.clicks, 'number')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">معدل النقر</p>
                                <p className="text-2xl font-bold text-gray-900">{formatValue(metrics.ctr, 'percentage')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">تكلفة النقرة</p>
                                <p className="text-lg font-bold text-gray-900">{formatValue(metrics.cpc, 'currency')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Summary - Demographics & Conversions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">إجمالي المحادثات</p>
                                <p className="text-2xl font-bold text-gray-900">{formatValue(metrics.total_conversations, 'number')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">عملاء اشتروا</p>
                                <p className="text-2xl font-bold text-emerald-600">{formatValue(metrics.customers_purchased, 'number')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">عملاء لم يشتروا</p>
                                <p className="text-2xl font-bold text-red-600">{formatValue(metrics.customers_not_purchased, 'number')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">عائد الإنفاق</p>
                                <p className="text-lg font-bold text-orange-600">{formatValue(metrics.roas, 'decimal')}x</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Series Charts */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">البيانات اليومية للحملة</h2>
                            <p className="text-sm text-gray-600 mt-1">عرض وتتبع أداء الحملة يوم بيوم</p>
                        </div>

                        {/* زر اختيار التاريخ */}
                        <div className="flex items-center space-x-3">
                            <div className="max-w-xs">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    اختيار التاريخ
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    // إظهار البيانات للتاريخ المحدد
                                    const dayData = dailyData.find(day => day.date === selectedDate);
                                    if (dayData) {
                                        alert(`بيانات ${selectedDate}:\nالمشاهدات: ${dayData.metrics?.impressions || 0}\nالنقرات: ${dayData.metrics?.clicks || 0}\nالتحويلات: ${dayData.metrics?.conversions || 0}`);
                                    } else {
                                        alert(`لا توجد بيانات محفوظة لتاريخ ${selectedDate}`);
                                    }
                                }}
                                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                            >
                                عرض البيانات
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {timeSeriesData && (
                            <>
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">المشاهدات اليومية</h3>
                                    <Line data={timeSeriesData.impressions} options={singleAxisOptions} />
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">النقرات اليومية</h3>
                                    <Line data={timeSeriesData.clicks} options={singleAxisOptions} />
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">التحويلات اليومية</h3>
                                    <Line data={timeSeriesData.conversions} options={singleAxisOptions} />
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">عملاء اشتروا يومياً</h3>
                                    <Line data={timeSeriesData.customers_purchased} options={singleAxisOptions} />
                                </div>
                            </>
                        )}

                        {!timeSeriesData && (
                            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-8 text-center">
                                <p className="text-gray-500 text-lg">لا توجد بيانات يومية للعرض</p>
                                <p className="text-gray-400 text-sm mt-2">استخدم قسم "إحصائيات مفصلة - تيك توك" أدناه لإضافة بيانات يومية</p>
                            </div>
                        )}
                    </div>

                    {/* قائمة التواريخ المحفوظة */}
                    {dailyData.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">التواريخ المحفوظة</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {dailyData.map((dayData, index) => {
                                    const isSelected = dayData.date === selectedDate;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedDate(dayData.date)}
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="text-xs opacity-75">
                                                {new Date(dayData.date).toLocaleDateString('ar', { weekday: 'short' })}
                                            </div>
                                            <div className="font-bold">
                                                {new Date(dayData.date).toLocaleDateString('ar', { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="text-xs mt-1">
                                                {dayData.metrics?.impressions || 0} مشاهدة
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>نصيحة:</strong> اضغط على أي تاريخ لاختياره وعرض بياناته في الجرافات أعلاه
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">أداء الحملة</h3>
                        <Bar data={performanceData} options={chartOptions} />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">التفاعل</h3>
                        <div className="flex justify-center">
                            <Doughnut data={engagementData} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">التوزيع الجغرافي</h3>
                        <div className="flex justify-center">
                            <Doughnut data={geographicData} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">الفئات العمرية</h3>
                        <Bar data={ageData} options={chartOptions} />
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الجنس</h3>
                        <div className="flex justify-center">
                            <Doughnut data={genderData} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">التحويلات والمبيعات</h3>
                        <Bar data={conversionData} options={chartOptions} />
                    </div>
                </div>

                {/* Daily Data Table */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">البيانات اليومية للحملة</h2>
                        <p className="text-sm text-gray-600 mt-1">عرض وتتبع أداء الحملة يوم بيوم</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        التاريخ
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        المشاهدات
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        النقرات
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        معدل النقر %
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الوصول
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        التفاعل
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        التحويلات
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        التكلفة
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الاتجاه
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dailyData.map((day, index) => {
                                    const previousDay = index > 0 ? dailyData[index - 1] : null;
                                    const dayMetrics = day.metrics || {};
                                    const prevMetrics = previousDay ? (previousDay.metrics || {}) : {};

                                    const clicks = dayMetrics.clicks || 0;
                                    const impressions = dayMetrics.impressions || 0;
                                    const reach = dayMetrics.reach || 0;
                                    const engagement = dayMetrics.engagement || 0;
                                    const conversions = dayMetrics.conversions || 0;
                                    const cost = dayMetrics.cost || (day.cost || 0);

                                    const prevClicks = prevMetrics.clicks || 0;
                                    const prevImpressions = prevMetrics.impressions || 0;

                                    const clicksChange = previousDay && prevClicks > 0 ? ((clicks - prevClicks) / prevClicks * 100) : 0;
                                    const impressionsChange = previousDay && prevImpressions > 0 ? ((impressions - prevImpressions) / prevImpressions * 100) : 0;
                                    const ctr = impressions > 0 ? (clicks / impressions * 100).toFixed(2) : 0;

                                    return (
                                        <tr key={day.date} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {new Date(day.date).toLocaleDateString('ar', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <span>{formatValue(impressions, 'number')}</span>
                                                    {previousDay && (
                                                        <span className={`ml-2 text-xs ${impressionsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {impressionsChange >= 0 ? '↗' : '↘'} {Math.abs(impressionsChange).toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <span>{formatValue(clicks, 'number')}</span>
                                                    {previousDay && (
                                                        <span className={`ml-2 text-xs ${clicksChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {clicksChange >= 0 ? '↗' : '↘'} {Math.abs(clicksChange).toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    ctr >= 2 ? 'bg-green-100 text-green-800' :
                                                    ctr >= 1 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {ctr}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatValue(reach, 'number')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatValue(engagement, 'number')}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-green-600">
                                                {formatValue(conversions, 'number')}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-red-600">
                                                {formatValue(cost, 'currency')}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    {clicksChange >= 10 && <span className="text-green-600 text-lg">📈</span>}
                                                    {clicksChange >= 0 && clicksChange < 10 && <span className="text-blue-600 text-lg">➡️</span>}
                                                    {clicksChange < 0 && clicksChange > -10 && <span className="text-yellow-600 text-lg">↘️</span>}
                                                    {clicksChange <= -10 && <span className="text-red-600 text-lg">📉</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {dailyData.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">لا توجد بيانات يومية. اضغط على "تحديث البيانات اليومية" لإنشاء بيانات تجريبية.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* تحديث الإحصائيات المفصلة */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                إحصائيات مفصلة - تيك توك
                            </h2>
                            <button
                                onClick={() => setDailyEditMode(!dailyEditMode)}
                                className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
                                    dailyEditMode
                                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                            >
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {dailyEditMode ? 'إلغاء التعديل' : 'تعديل الإحصائيات اليومية'}
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {dailyEditMode ? (
                            <form onSubmit={handleSaveDailyMetrics} className="space-y-6">
                                {/* حقل التاريخ */}
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-purple-800 mb-2">
                                        التاريخ
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full max-w-xs px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                                    />
                                    <p className="text-xs text-purple-600 mt-1">
                                        اختر التاريخ المراد إضافة الإحصائيات له
                                    </p>
                                </div>

                                {/* حقول الإحصائيات */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            المشاهدات
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.impressions || ''}
                                            onChange={(e) => updateDailyMetric('impressions', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد المشاهدات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            النقرات
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.clicks || ''}
                                            onChange={(e) => updateDailyMetric('clicks', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد النقرات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الوصول
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.reach || ''}
                                            onChange={(e) => updateDailyMetric('reach', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد الأشخاص الذين وصلت إليهم"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            التفاعل
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.engagement || ''}
                                            onChange={(e) => updateDailyMetric('engagement', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="إجمالي التفاعل"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            التحويلات
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.conversions || ''}
                                            onChange={(e) => updateDailyMetric('conversions', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد التحويلات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            التكلفة (ر.س)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.daily_metrics.cost || ''}
                                            onChange={(e) => updateDailyMetric('cost', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="التكلفة اليومية"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            عملاء اشتروا
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.customers_purchased || ''}
                                            onChange={(e) => updateDailyMetric('customers_purchased', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد العملاء الذين اشتروا"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الإعجابات
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.likes || ''}
                                            onChange={(e) => updateDailyMetric('likes', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد الإعجابات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            المشاركات
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.shares || ''}
                                            onChange={(e) => updateDailyMetric('shares', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد المشاركات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            التعليقات
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.comments || ''}
                                            onChange={(e) => updateDailyMetric('comments', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد التعليقات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            محادثات كاملة
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.total_conversations || ''}
                                            onChange={(e) => updateDailyMetric('total_conversations', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="إجمالي المحادثات"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            عملاء مؤهلين
                                        </label>
                                        <input
                                            type="number"
                                            value={data.daily_metrics.leads_qualified || ''}
                                            onChange={(e) => updateDailyMetric('leads_qualified', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="عدد العملاء المؤهلين"
                                            min="0"
                                        />
                                    </div>

                                    {/* حقول الفئات العمرية */}
                                    <div className="col-span-full">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-purple-200 pb-2">نسب الفئات العمرية (%)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    18-24 سنة
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.age_18_24_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('age_18_24_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    25-34 سنة
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.age_25_34_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('age_25_34_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    35-44 سنة
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.age_35_44_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('age_35_44_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    45-54 سنة
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.age_45_54_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('age_45_54_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    55+ سنة
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.age_55_plus_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('age_55_plus_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* حقول نسب الجنس */}
                                    <div className="col-span-full">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-purple-200 pb-2">نسب الجنس (%)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ذكور (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.male_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('male_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    إناث (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.female_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('female_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* حقول التوزيع الجغرافي */}
                                    <div className="col-span-full">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-purple-200 pb-2">التوزيع الجغرافي (%)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    العراق (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.country_iraq_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('country_iraq_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    السعودية (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.country_saudi_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('country_saudi_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    الإمارات (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.country_uae_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('country_uae_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    دول أخرى (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={data.daily_metrics.country_other_percentage || ''}
                                                    onChange={(e) => updateDailyMetric('country_other_percentage', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="0.0"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* حقول إضافية مهمة */}
                                    <div className="col-span-full">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-purple-200 pb-2">معلومات إضافية</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    عملاء لم يشتروا
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.daily_metrics.customers_not_purchased || ''}
                                                    onChange={(e) => updateDailyMetric('customers_not_purchased', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="عدد العملاء الذين لم يشتروا"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    عائد الإنفاق (ROAS)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.daily_metrics.roas || ''}
                                                    onChange={(e) => updateDailyMetric('roas', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="مثال: 4.50"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    الإيرادات (ر.س)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.daily_metrics.revenue || ''}
                                                    onChange={(e) => updateDailyMetric('revenue', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                    placeholder="إجمالي الإيرادات"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* أزرار الحفظ والإلغاء */}
                                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setDailyEditMode(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white rounded-lg transition-all duration-200 shadow-lg"
                                    >
                                        {processing ? 'جاري الحفظ...' : 'حفظ الإحصائيات اليومية'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                {/* زر تحديث الإحصائيات */}
                                <button
                                    onClick={generateDailyMetrics}
                                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    إنشاء بيانات تجريبية
                                </button>

                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <div className="text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <p className="text-lg font-medium text-gray-600">إدارة الإحصائيات اليومية</p>
                                        <p className="text-sm text-gray-500 mt-2">اضغط على "تعديل الإحصائيات اليومية" لإضافة بيانات يوم محدد</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
