import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ customer, projects, clientProjects, statusOptions }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: customer.name || '',
        phone: customer.phone || '',
        project_id: customer.project_id || '',
        status: customer.status || 'potential_buyer',
        client_project_id: customer.client_project_id || '',
        source: customer.source || '',
        activation_code: customer.activation_code || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.customers.update', customer.id));
    };

    const generateActivationCode = () => {
        const code = Math.random().toString(36).substr(2, 8).toUpperCase();
        setData('activation_code', code);
    };

    return (
        <AdminLayout title={`تعديل العميل: ${customer.name}`}>
            <Head title={`تعديل العميل: ${customer.name}`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">تعديل العميل: {customer.name}</h1>
                    <p className="text-gray-600 mt-1">قم بتحديث بيانات العميل وحالته</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات المشروع</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المشروع/البرنامج
                                </label>
                                <select
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">اختر المشروع</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    اختر المشروع أو البرنامج الذي يهتم به العميل
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    مشروع العميل (للخدمات)
                                </label>
                                <select
                                    value={data.client_project_id}
                                    onChange={(e) => setData('client_project_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">اختر مشروع العميل</option>
                                    {clientProjects.map(clientProject => (
                                        <option key={clientProject.id} value={clientProject.id}>
                                            {clientProject.name} - {clientProject.client_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    اختر هذا إذا كان العميل يطلب خدمة مخصصة
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activation Code */}
                    {(data.status === 'subscriber' || data.activation_code) && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">كود التفعيل</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        كود التفعيل
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={data.activation_code}
                                            onChange={(e) => setData('activation_code', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                            placeholder="أدخل كود التفعيل أو اتركه فارغاً"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateActivationCode}
                                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            إنشاء كود
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        كود التفعيل مطلوب للعملاء المشتركين فقط
                                    </p>
                                </div>

                                {data.activation_code && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-green-800">
                                                كود التفعيل: <span className="font-mono font-semibold">{data.activation_code}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-blue-900">معلومات حول الحالة</h3>
                                <div className="mt-1 text-sm text-blue-800">
                                    {data.status === 'potential_buyer' && (
                                        <p>العميل مهتم بالشراء ولكن لم يتخذ قرار نهائي بعد. يحتاج لمتابعة.</p>
                                    )}
                                    {data.status === 'subscriber' && (
                                        <p>العميل مشترك. تأكد من وجود كود تفعيل صحيح.</p>
                                    )}
                                    {data.status === 'service_request' && (
                                        <p>العميل يطلب خدمة مخصصة. تأكد من ربطه بمشروع العميل المناسب.</p>
                                    )}
                                    {data.status === 'cancelled' && (
                                        <p>العميل ألغى طلبه أو قرر عدم المتابعة.</p>
                                    )}
                                    {data.status === 'bad' && (
                                        <p>عميل مشكوك فيه أو كان له تجربة سيئة.</p>
                                    )}
                                    {data.status === 'service_completed' && (
                                        <p>تم إكمال الخدمة المطلوبة للعميل بنجاح.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer History */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">تاريخ العميل</h2>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>تاريخ التسجيل:</span>
                                <span className="font-medium">{new Date(customer.created_at).toLocaleDateString('en-US')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>آخر تحديث:</span>
                                <span className="font-medium">{new Date(customer.updated_at).toLocaleDateString('en-US')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>عدد الملاحظات:</span>
                                <span className="font-medium">{customer.notes_count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>عدد الطلبات:</span>
                                <span className="font-medium">{customer.requests_count || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={() => router.get(route('admin.customers.show', customer.id))}
                                className="px-6 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            >
                                عرض التفاصيل
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            {processing ? 'جاري التحديث...' : 'حفظ التعديلات'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
