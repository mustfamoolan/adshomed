import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ projects, clientProjects, statusOptions, customerTypeOptions, projectTypeOptions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        customer_type: 'service_request',
        project_id: '',
        client_project_id: '',
        subscription_type: '',
        status: 'potential_buyer',
        initial_notes: '',
        source: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.customers.store'));
    };

    return (
        <AdminLayout title="إضافة عميل جديد">
            <Head title="إضافة عميل جديد" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">إضافة عميل جديد</h1>
                    <p className="text-gray-600 mt-1">أدخل بيانات العميل الجديد وحدد نوعه والمشروع المرتبط به</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Type Selection */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">نوع العميل *</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(customerTypeOptions).map(([key, label]) => (
                                <div key={key} className="relative">
                                    <input
                                        type="radio"
                                        id={`customer_type_${key}`}
                                        name="customer_type"
                                        value={key}
                                        checked={data.customer_type === key}
                                        onChange={(e) => setData('customer_type', e.target.value)}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor={`customer_type_${key}`}
                                        className={`block w-full p-4 text-center border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                            data.customer_type === key
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        <div className="font-medium">{label}</div>
                                        <div className="text-xs mt-1">
                                            {key === 'service_request' && 'عميل يحتاج خدمة أو استشارة'}
                                            {key === 'our_project_client' && 'عميل مهتم بأحد مشاريعنا'}
                                            {key === 'client_project_owner' && 'صاحب مشروع نقوم بتطويره'}
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.customer_type && (
                            <p className="mt-2 text-sm text-red-600">{errors.customer_type}</p>
                        )}
                    </div>
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم العميل *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="أدخل اسم العميل"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رقم الهاتف *
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.phone ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="مثال: 966501234567"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    مصدر العميل
                                </label>
                                <input
                                    type="text"
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="مثال: إعلان فيسبوك، إحالة صديق، موقع إلكتروني"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    حالة العميل *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.status ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    {Object.entries(statusOptions).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Information */}
                    {data.customer_type !== 'service_request' && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات المشروع</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.customer_type === 'our_project_client' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                المشروع/البرنامج *
                                            </label>
                                            <select
                                                value={data.project_id}
                                                onChange={(e) => setData('project_id', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.project_id ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="">اختر المشروع</option>
                                                {projects.map(project => (
                                                    <option key={project.id} value={project.id}>{project.name}</option>
                                                ))}
                                            </select>
                                            {errors.project_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.project_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                نوع المشروع *
                                            </label>
                                            <select
                                                value={data.subscription_type}
                                                onChange={(e) => setData('subscription_type', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors.subscription_type ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="">اختر نوع المشروع</option>
                                                {Object.entries(projectTypeOptions).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                            {errors.subscription_type && (
                                                <p className="mt-1 text-sm text-red-600">{errors.subscription_type}</p>
                                            )}
                                            <p className="mt-1 text-xs text-gray-500">
                                                {data.subscription_type === 'sale' && 'سيتم إنشاء كود تفعيل للعميل'}
                                                {data.subscription_type === 'subscription' && 'سيتم إنشاء كود تفعيل للاشتراك'}
                                                {data.subscription_type === 'download' && 'يمكن إضافة معرف التحميل لاحقاً'}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {data.customer_type === 'client_project_owner' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            مشروع العميل *
                                        </label>
                                        <select
                                            value={data.client_project_id}
                                            onChange={(e) => setData('client_project_id', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.client_project_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">اختر مشروع العميل</option>
                                            {clientProjects.map(clientProject => (
                                                <option key={clientProject.id} value={clientProject.id}>
                                                    {clientProject.name} - {clientProject.client_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.client_project_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.client_project_id}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            اختر المشروع الذي يملكه العميل والذي نقوم بتطويره
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Initial Notes */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">ملاحظات أولية</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ملاحظات العميل
                            </label>
                            <textarea
                                value={data.initial_notes}
                                onChange={(e) => setData('initial_notes', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="أضف أي ملاحظات مهمة حول العميل، متطلباته، أو تفاصيل المحادثة الأولى..."
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                هذه الملاحظات ستظهر في سجل الملاحظات الخاص بالعميل
                            </p>
                        </div>
                    </div>

                    {/* Status Information */}
                    {data.customer_type && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-blue-900">معلومات حول نوع العميل</h3>
                                    <div className="mt-1 text-sm text-blue-800">
                                        {data.customer_type === 'service_request' && (
                                            <p>سيتم إنشاء طلب خدمة تلقائياً للعميل. يمكن إضافة الملاحظات والطلبات لاحقاً.</p>
                                        )}
                                        {data.customer_type === 'our_project_client' && (
                                            <>
                                                <p>عميل مهتم بأحد مشاريعنا.</p>
                                                {data.subscription_type === 'sale' && <p>• سيتم إنشاء كود تفعيل للبيع</p>}
                                                {data.subscription_type === 'subscription' && <p>• سيتم إنشاء كود تفعيل للاشتراك</p>}
                                                {data.subscription_type === 'download' && <p>• يمكن إضافة معرف التحميل من صفحة العميل</p>}
                                            </>
                                        )}
                                        {data.customer_type === 'client_project_owner' && (
                                            <p>صاحب مشروع نقوم بتطويره. سيتم ربطه بالمشروع المحدد لتتبع التطوير والتكاليف.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            {processing ? 'جاري الحفظ...' : 'حفظ العميل'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
