import React, { useState } from 'react';
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

export default function ProjectCreate({ managers }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        initial_budget: '',
        product_price: '',
        type: 'sales',
        status: 'planning',
        manager_id: '',
        development_start_date: '',
        development_end_date: '',
        publication_date: '',
        publication_status: 'not_displayed',
        platforms: [],
        platform_urls: [],
        subscription_plans: []
    });

    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);

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

    const addSubscriptionPlan = () => {
        const newPlan = {
            plan_name: '',
            price: '',
            billing_cycle: 'monthly',
            description: ''
        };
        const newPlans = [...subscriptionPlans, newPlan];
        setSubscriptionPlans(newPlans);
        setData('subscription_plans', newPlans);
    };

    const removeSubscriptionPlan = (index) => {
        const newPlans = subscriptionPlans.filter((_, i) => i !== index);
        setSubscriptionPlans(newPlans);
        setData('subscription_plans', newPlans);
    };

    const updateSubscriptionPlan = (index, field, value) => {
        const newPlans = [...subscriptionPlans];
        newPlans[index][field] = value;
        setSubscriptionPlans(newPlans);
        setData('subscription_plans', newPlans);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.projects.store'));
    };

    return (
        <AdminLayout>
            <Head title="إضافة مشروع جديد" />

            <div className="min-h-screen bg-gray-50/80 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">إضافة مشروع جديد</h1>
                        <p className="text-gray-600">أضف مشروع جديد وحدد تفاصيله والميزانية الأولية</p>
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

                                    {/* Product Price - Only for Sales projects */}
                                    {data.type === 'sales' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سعر المنتج الواحد <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.product_price}
                                                onChange={(e) => setData('product_price', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                                    errors.product_price ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                                placeholder="0.00"
                                            />
                                            {errors.product_price && <p className="mt-1 text-sm text-red-600">{errors.product_price}</p>}
                                        </div>
                                    )}

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

                            {/* Subscription Plans - Only for Subscription projects */}
                            {data.type === 'subscription' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">باقات الاشتراك</h3>
                                        <button
                                            type="button"
                                            onClick={addSubscriptionPlan}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            إضافة باقة جديدة
                                        </button>
                                    </div>

                                    {subscriptionPlans.map((plan, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-medium text-gray-900">باقة {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSubscriptionPlan(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    حذف
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        اسم الباقة <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={plan.plan_name}
                                                        onChange={(e) => updateSubscriptionPlan(index, 'plan_name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="مثل: باقة أساسية"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        السعر <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={plan.price}
                                                        onChange={(e) => updateSubscriptionPlan(index, 'price', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0.00"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        دورة الفوترة <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={plan.billing_cycle}
                                                        onChange={(e) => updateSubscriptionPlan(index, 'billing_cycle', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="monthly">شهري</option>
                                                        <option value="yearly">سنوي</option>
                                                        <option value="lifetime">مدى الحياة</option>
                                                    </select>
                                                </div>

                                                <div className="md:col-span-2 lg:col-span-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        وصف الباقة
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={plan.description}
                                                        onChange={(e) => updateSubscriptionPlan(index, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="وصف مختصر للباقة وميزاتها"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {subscriptionPlans.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>لم يتم إضافة أي باقات اشتراك بعد</p>
                                            <p className="text-sm">اضغط "إضافة باقة جديدة" لبدء إضافة الباقات</p>
                                        </div>
                                    )}
                                </div>
                            )}

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
                                    {processing ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
