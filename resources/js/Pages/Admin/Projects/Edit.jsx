import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const platformOptions = [
    { value: 'web', label: 'موقع ويب' },
    { value: 'android', label: 'أندرويد' },
    { value: 'ios', label: 'آيفون' },
    { value: 'desktop', label: 'سطح المكتب' },
    { value: 'facebook', label: 'فيسبوك' },
    { value: 'instagram', label: 'إنستغرام' },
    { value: 'youtube', label: 'يوتيوب' },
    { value: 'telegram', label: 'تليغرام' },
    { value: 'whatsapp', label: 'واتساب' },
    { value: 'other', label: 'أخرى' }
];

export default function ProjectEdit({ project, managers }) {
    const { data, setData, put, processing, errors } = useForm({
        name: project.name || '',
        description: project.description || '',
        initial_budget: project.initial_budget || '',
        total_revenue: project.total_revenue || 0,
        sales_count: project.sales_count || 0,
        downloads_count: project.downloads_count || 0,
        type: project.type || 'sales',
        status: project.status || 'planning',
        manager_id: project.manager_id || '',
        development_start_date: project.development_start_date || '',
        development_end_date: project.development_end_date || '',
        publication_date: project.publication_date || '',
        publication_status: project.publication_status || 'not_displayed',
        platforms: project.platforms?.map(p => p.platform) || [],
        platform_urls: project.platforms?.map(p => p.platform_url || '') || []
    });

    const [selectedPlatforms, setSelectedPlatforms] = useState([]);

    useEffect(() => {
        if (project.platforms) {
            const platforms = project.platforms.map(p => ({
                value: p.platform,
                label: platformOptions.find(opt => opt.value === p.platform)?.label || p.platform,
                url: p.platform_url || ''
            }));
            setSelectedPlatforms(platforms);
        }
    }, [project.platforms]);

    const handlePlatformChange = (platform) => {
        const isSelected = selectedPlatforms.some(p => p.value === platform.value);

        if (isSelected) {
            const newPlatforms = selectedPlatforms.filter(p => p.value !== platform.value);
            setSelectedPlatforms(newPlatforms);
            setData({
                ...data,
                platforms: newPlatforms.map(p => p.value),
                platform_urls: newPlatforms.map(p => p.url || '')
            });
        } else {
            const newPlatforms = [...selectedPlatforms, { ...platform, url: '' }];
            setSelectedPlatforms(newPlatforms);
            setData({
                ...data,
                platforms: newPlatforms.map(p => p.value),
                platform_urls: newPlatforms.map(p => p.url || '')
            });
        }
    };

    const handlePlatformUrlChange = (index, url) => {
        const newPlatforms = [...selectedPlatforms];
        newPlatforms[index].url = url;
        setSelectedPlatforms(newPlatforms);
        setData({
            ...data,
            platform_urls: newPlatforms.map(p => p.url || '')
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.projects.update', project.id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <AdminLayout>
            <Head title={`تعديل المشروع - ${project.name}`} />

            <div className="min-h-screen bg-gray-50/80 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل المشروع: {project.name}</h1>
                        <p className="text-gray-600">قم بتعديل تفاصيل المشروع والميزانيات</p>

                        {/* Project Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-blue-600 font-medium">الميزانية الإجمالية</p>
                                <p className="text-lg font-bold text-blue-900">
                                    {formatCurrency(project.total_budget)}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-green-600 font-medium">إجمالي الإيرادات</p>
                                <p className="text-lg font-bold text-green-900">
                                    {formatCurrency(project.total_revenue)}
                                </p>
                            </div>
                            <div className={`rounded-lg p-4 ${project.profit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <p className={`text-sm font-medium ${project.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    صافي الربح
                                </p>
                                <p className={`text-lg font-bold ${project.profit >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>
                                    {formatCurrency(project.profit)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">المعلومات الأساسية</h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اسم المشروع <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                errors.name ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="ادخل اسم المشروع"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            مدير المشروع <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.manager_id}
                                            onChange={(e) => setData('manager_id', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                errors.manager_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">اختر مدير المشروع</option>
                                            {managers.map(manager => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.manager_id && <p className="mt-1 text-sm text-red-600">{errors.manager_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            نوع المشروع <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="sales">مبيعات</option>
                                            <option value="subscription">اشتراكات</option>
                                            <option value="free">مجاني</option>
                                            <option value="downloads">تحميلات</option>
                                        </select>
                                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            حالة المشروع <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="planning">في التخطيط</option>
                                            <option value="active">نشط</option>
                                            <option value="completed">مكتمل</option>
                                            <option value="paused">متوقف مؤقت</option>
                                            <option value="cancelled">ملغى</option>
                                        </select>
                                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الميزانية الأولية <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.initial_budget}
                                            onChange={(e) => setData('initial_budget', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                errors.initial_budget ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="0.00"
                                        />
                                        {errors.initial_budget && <p className="mt-1 text-sm text-red-600">{errors.initial_budget}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            إجمالي الإيرادات
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.total_revenue}
                                            onChange={(e) => setData('total_revenue', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="0.00"
                                        />
                                        {errors.total_revenue && <p className="mt-1 text-sm text-red-600">{errors.total_revenue}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            عدد المبيعات
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.sales_count}
                                            onChange={(e) => setData('sales_count', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="0"
                                        />
                                        {errors.sales_count && <p className="mt-1 text-sm text-red-600">{errors.sales_count}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            عدد التحميلات
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.downloads_count}
                                            onChange={(e) => setData('downloads_count', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="0"
                                        />
                                        {errors.downloads_count && <p className="mt-1 text-sm text-red-600">{errors.downloads_count}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            حالة النشر <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.publication_status}
                                            onChange={(e) => setData('publication_status', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="not_displayed">لم يعرض</option>
                                            <option value="published">منشور</option>
                                            <option value="unpublished">مغلق</option>
                                        </select>
                                        {errors.publication_status && <p className="mt-1 text-sm text-red-600">{errors.publication_status}</p>}
                                    </div>
                                </div>

                                {/* Date Fields */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ بداية التطوير
                                        </label>
                                        <input
                                            type="date"
                                            value={data.development_start_date}
                                            onChange={(e) => setData('development_start_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                        {errors.development_start_date && <p className="mt-1 text-sm text-red-600">{errors.development_start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ انتهاء التطوير
                                        </label>
                                        <input
                                            type="date"
                                            value={data.development_end_date}
                                            onChange={(e) => setData('development_end_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                        {errors.development_end_date && <p className="mt-1 text-sm text-red-600">{errors.development_end_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ النشر
                                        </label>
                                        <input
                                            type="date"
                                            value={data.publication_date}
                                            onChange={(e) => setData('publication_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                        {errors.publication_date && <p className="mt-1 text-sm text-red-600">{errors.publication_date}</p>}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وصف المشروع
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="ادخل وصف مفصل للمشروع"
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Platforms */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">المنصات</h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                                    {platformOptions.map((platform) => (
                                        <div key={platform.value} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={platform.value}
                                                checked={selectedPlatforms.some(p => p.value === platform.value)}
                                                onChange={() => handlePlatformChange(platform)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={platform.value} className="mr-2 text-sm text-gray-700">
                                                {platform.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Platform URLs */}
                                {selectedPlatforms.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-md font-medium text-gray-900">روابط المنصات</h4>
                                        {selectedPlatforms.map((platform, index) => (
                                            <div key={platform.value}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    رابط {platform.label}
                                                </label>
                                                <input
                                                    type="url"
                                                    value={platform.url || ''}
                                                    onChange={(e) => handlePlatformUrlChange(index, e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder={`ادخل رابط منصة ${platform.label}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50"
                                >
                                    {processing ? 'جاري التحديث...' : 'تحديث المشروع'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
