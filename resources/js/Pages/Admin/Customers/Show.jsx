import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({
    customer,
    notes,
    activities = [],
    requests,
    subscriptions = [],
    availableSubscriptionPlans = [],
    projects,
    clientProjects,
    statusOptions,
    customerTypeOptions,
    projectTypeOptions,
    subscriptionStatusOptions = {}
}) {
    const [activeTab, setActiveTab] = useState('details');
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [showDownloadIdForm, setShowDownloadIdForm] = useState(false);
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

    const { data: noteData, setData: setNoteData, post: postNote, processing: processingNote, errors: noteErrors } = useForm({
        content: '',
        is_important: false,
    });

    const { data: requestData, setData: setRequestData, post: postRequest, processing: processingRequest, errors: requestErrors } = useForm({
        type: '',
        description: '',
        client_project_id: '',
        status: 'pending',
    });

    const { data: downloadIdData, setData: setDownloadIdData, patch: patchDownloadId, processing: processingDownloadId, errors: downloadIdErrors } = useForm({
        download_id: customer.download_id || '',
    });

    const { data: subscriptionData, setData: setSubscriptionData, post: postSubscription, processing: processingSubscription, errors: subscriptionErrors } = useForm({
        project_subscription_plan_id: '',
        activation_code: '',
        status: 'pending',
        started_at: '',
        expires_at: '',
        notes: '',
    });

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        postNote(route('admin.customers.notes.store', customer.id), {
            onSuccess: () => {
                setNoteData('content', '');
                setNoteData('is_important', false);
                setShowNoteForm(false);
            }
        });
    };

    const handleDownloadIdSubmit = (e) => {
        e.preventDefault();
        patchDownloadId(route('admin.customers.update-download-id', customer.id), {
            onSuccess: () => {
                setShowDownloadIdForm(false);
            }
        });
    };

    const handleSubscriptionSubmit = (e) => {
        e.preventDefault();
        postSubscription(route('admin.customers.subscriptions.store', customer.id), {
            onSuccess: () => {
                setSubscriptionData({
                    project_subscription_plan_id: '',
                    activation_code: '',
                    status: 'pending',
                    started_at: '',
                    expires_at: '',
                    notes: '',
                });
                setShowSubscriptionForm(false);
            }
        });
    };

    const updateSubscriptionStatus = (subscriptionId, newStatus) => {
        router.patch(route('admin.customers.subscriptions.update-status', [customer.id, subscriptionId]), {
            status: newStatus
        });
    };

    const updateCustomerStatus = (newStatus) => {
        router.patch(route('admin.customers.update', customer.id), {
            status: newStatus
        });
    };

    const generateActivationCode = () => {
        router.post(route('admin.customers.generate-activation', customer.id));
    };

    const getCustomerTypeBadge = (type) => {
        const typeColors = {
            'service_request': 'bg-purple-100 text-purple-800',
            'our_project_client': 'bg-blue-100 text-blue-800',
            'client_project_owner': 'bg-green-100 text-green-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
                {customerTypeOptions[type] || type}
            </span>
        );
    };

    const getProjectTypeBadge = (type) => {
        if (!type) return null;

        const typeColors = {
            'sale': 'bg-orange-100 text-orange-800',
            'subscription': 'bg-indigo-100 text-indigo-800',
            'download': 'bg-cyan-100 text-cyan-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
                {projectTypeOptions[type] || type}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'potential_buyer': 'bg-yellow-100 text-yellow-800',
            'subscriber': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'bad': 'bg-red-100 text-red-800',
            'service_request': 'bg-blue-100 text-blue-800',
            'service_completed': 'bg-purple-100 text-purple-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {statusOptions[status] || status}
            </span>
        );
    };

    const getRequestStatusBadge = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in_progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
        };

        const labels = {
            'pending': 'في الانتظار',
            'in_progress': 'قيد التنفيذ',
            'completed': 'مكتمل',
            'cancelled': 'ملغي',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AdminLayout title={`عميل: ${customer.name}`}>
            <Head title={`عميل: ${customer.name}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold text-blue-600">
                                    {customer.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                                <p className="text-gray-600">{customer.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {getStatusBadge(customer.status)}
                            <button
                                onClick={() => router.get(route('admin.customers.edit', customer.id))}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                تعديل
                            </button>
                        </div>
                    </div>

                    {/* Quick Status Update */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">تحديث سريع للحالة:</span>
                            <div className="flex space-x-1">
                                {Object.entries(statusOptions).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => updateCustomerStatus(key)}
                                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                            customer.status === key
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { key: 'details', label: 'التفاصيل', count: null },
                                { key: 'notes', label: 'الملاحظات', count: notes.length },
                                { key: 'requests', label: 'الطلبات', count: requests.length },
                                ...(customer.customer_type === 'our_project_client' && customer.subscription_type === 'subscription'
                                    ? [{ key: 'subscriptions', label: 'الاشتراكات', count: subscriptions.length }]
                                    : []),
                                { key: 'activity', label: 'النشاط', count: null },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === tab.key
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.count !== null && (
                                        <span className="mr-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Basic Customer Info */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات العميل</h3>
                                        <dl className="space-y-3">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">الاسم</dt>
                                                <dd className="text-sm text-gray-900">{customer.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">رقم الهاتف</dt>
                                                <dd className="text-sm text-gray-900">{customer.phone}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">نوع العميل</dt>
                                                <dd className="text-sm text-gray-900">{getCustomerTypeBadge(customer.customer_type)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">الحالة</dt>
                                                <dd className="text-sm text-gray-900">{getStatusBadge(customer.status)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">تاريخ التسجيل</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(customer.created_at).toLocaleDateString('en-US')}
                                                </dd>
                                            </div>
                                            {customer.source && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">مصدر العميل</dt>
                                                    <dd className="text-sm text-gray-900">{customer.source}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    {/* Project Info */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات المشروع</h3>
                                        <dl className="space-y-3">
                                            {customer.customer_type === 'our_project_client' && customer.project && (
                                                <>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">المشروع/البرنامج</dt>
                                                        <dd className="text-sm text-gray-900">{customer.project.name}</dd>
                                                    </div>
                                                    {customer.subscription_type && (
                                                        <div>
                                                            <dt className="text-sm font-medium text-gray-500">نوع المشروع</dt>
                                                            <dd className="text-sm text-gray-900">{getProjectTypeBadge(customer.subscription_type)}</dd>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {customer.customer_type === 'client_project_owner' && customer.client_project && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">مشروع العميل</dt>
                                                    <dd className="text-sm text-gray-900">
                                                        {customer.client_project.name}
                                                    </dd>
                                                </div>
                                            )}
                                            {customer.customer_type === 'service_request' && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">نوع الخدمة</dt>
                                                    <dd className="text-sm text-gray-900">طلب خدمة عامة</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    {/* Activation & IDs */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">معرفات التفعيل</h3>
                                        <dl className="space-y-3">
                                            {(customer.subscription_type === 'sale' || customer.subscription_type === 'subscription') && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">كود التفعيل</dt>
                                                    {customer.activation_code ? (
                                                        <dd className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded flex items-center justify-between">
                                                            <span>{customer.activation_code}</span>
                                                            <button
                                                                onClick={generateActivationCode}
                                                                className="text-blue-600 hover:text-blue-700 text-xs"
                                                                title="إنشاء كود جديد"
                                                            >
                                                                تجديد
                                                            </button>
                                                        </dd>
                                                    ) : (
                                                        <dd>
                                                            <button
                                                                onClick={generateActivationCode}
                                                                className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                                                            >
                                                                إنشاء كود تفعيل
                                                            </button>
                                                        </dd>
                                                    )}
                                                </div>
                                            )}

                                            {customer.subscription_type === 'download' && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">معرف التحميل</dt>
                                                    {customer.download_id ? (
                                                        <dd className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded flex items-center justify-between">
                                                            <span>{customer.download_id}</span>
                                                            <button
                                                                onClick={() => setShowDownloadIdForm(true)}
                                                                className="text-blue-600 hover:text-blue-700 text-xs"
                                                                title="تعديل معرف التحميل"
                                                            >
                                                                تعديل
                                                            </button>
                                                        </dd>
                                                    ) : (
                                                        <dd>
                                                            <button
                                                                onClick={() => setShowDownloadIdForm(true)}
                                                                className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                                                            >
                                                                إضافة معرف التحميل
                                                            </button>
                                                        </dd>
                                                    )}
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>

                                {/* Download ID Form */}
                                {showDownloadIdForm && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">تحديث معرف التحميل</h4>
                                        <form onSubmit={handleDownloadIdSubmit} className="space-y-3">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={downloadIdData.download_id}
                                                    onChange={(e) => setDownloadIdData('download_id', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="أدخل معرف التحميل"
                                                />
                                                {downloadIdErrors.download_id && (
                                                    <p className="mt-1 text-sm text-red-600">{downloadIdErrors.download_id}</p>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    type="submit"
                                                    disabled={processingDownloadId}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                                >
                                                    {processingDownloadId ? 'جاري الحفظ...' : 'حفظ'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDownloadIdForm(false)}
                                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400 transition-colors"
                                                >
                                                    إلغاء
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notes Tab */}
                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">ملاحظات العميل</h3>
                                    <button
                                        onClick={() => setShowNoteForm(!showNoteForm)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        إضافة ملاحظة
                                    </button>
                                </div>

                                {showNoteForm && (
                                    <form onSubmit={handleNoteSubmit} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    الملاحظة
                                                </label>
                                                <textarea
                                                    value={noteData.content}
                                                    onChange={(e) => setNoteData('content', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="اكتب الملاحظة هنا..."
                                                />
                                                {noteErrors.content && (
                                                    <p className="mt-1 text-sm text-red-600">{noteErrors.content}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={noteData.is_important}
                                                    onChange={(e) => setNoteData('is_important', e.target.checked)}
                                                    className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="text-sm text-gray-700">ملاحظة مهمة</label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    type="submit"
                                                    disabled={processingNote}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                                >
                                                    {processingNote ? 'جاري الحفظ...' : 'حفظ الملاحظة'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNoteForm(false)}
                                                    className="px-4 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    إلغاء
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {notes.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">لا توجد ملاحظات للعميل</p>
                                    ) : (
                                        notes.map((note) => (
                                            <div key={note.id} className={`p-4 rounded-lg border ${
                                                note.is_important ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-white'
                                            }`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-gray-900">{note.content}</p>
                                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                                            <span>{note.user?.name || 'نظام'}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{new Date(note.created_at).toLocaleString('en-US')}</span>
                                                            {note.is_important && (
                                                                <>
                                                                    <span className="mx-2">•</span>
                                                                    <span className="text-yellow-600 font-medium">مهم</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Subscriptions Tab */}
                        {activeTab === 'subscriptions' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">اشتراكات العميل</h3>
                                    {availableSubscriptionPlans.length > 0 && (
                                        <button
                                            onClick={() => setShowSubscriptionForm(!showSubscriptionForm)}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            إضافة اشتراك
                                        </button>
                                    )}
                                </div>

                                {showSubscriptionForm && (
                                    <form onSubmit={handleSubscriptionSubmit} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    باقة الاشتراك *
                                                </label>
                                                <select
                                                    value={subscriptionData.project_subscription_plan_id}
                                                    onChange={(e) => setSubscriptionData('project_subscription_plan_id', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">اختر باقة الاشتراك</option>
                                                    {availableSubscriptionPlans.map(plan => (
                                                        <option key={plan.id} value={plan.id}>
                                                            {plan.plan_name} - {plan.price} ريال ({plan.billing_cycle_label})
                                                        </option>
                                                    ))}
                                                </select>
                                                {subscriptionErrors.project_subscription_plan_id && (
                                                    <p className="mt-1 text-sm text-red-600">{subscriptionErrors.project_subscription_plan_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    كود التفعيل (اختياري)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={subscriptionData.activation_code}
                                                    onChange={(e) => setSubscriptionData('activation_code', e.target.value.toUpperCase())}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="أدخل كود التفعيل (اختياري)"
                                                />
                                                {subscriptionErrors.activation_code && (
                                                    <p className="mt-1 text-sm text-red-600">{subscriptionErrors.activation_code}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    تاريخ البداية
                                                </label>
                                                <input
                                                    type="date"
                                                    value={subscriptionData.started_at}
                                                    onChange={(e) => setSubscriptionData('started_at', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    تاريخ الانتهاء
                                                </label>
                                                <input
                                                    type="date"
                                                    value={subscriptionData.expires_at}
                                                    onChange={(e) => setSubscriptionData('expires_at', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ملاحظات
                                                </label>
                                                <textarea
                                                    value={subscriptionData.notes}
                                                    onChange={(e) => setSubscriptionData('notes', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="ملاحظات حول الاشتراك"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 mt-4">
                                            <button
                                                type="submit"
                                                disabled={processingSubscription}
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                            >
                                                {processingSubscription ? 'جاري الحفظ...' : 'إضافة الاشتراك'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowSubscriptionForm(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Subscriptions List */}
                                <div className="space-y-3">
                                    {subscriptions.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            لا توجد اشتراكات للعميل
                                        </div>
                                    ) : (
                                        subscriptions.map((subscription) => (
                                            <div key={subscription.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <h4 className="font-medium text-gray-900">
                                                                {subscription.subscription_plan?.plan_name}
                                                            </h4>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                subscription.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                                subscription.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {subscriptionStatusOptions[subscription.status] || subscription.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-sm text-gray-600">
                                                            {subscription.activation_code && (
                                                                <p>كود التفعيل: <span className="font-mono bg-gray-100 px-1 rounded">{subscription.activation_code}</span></p>
                                                            )}
                                                            {subscription.started_at && (
                                                                <p>تاريخ البداية: {new Date(subscription.started_at).toLocaleDateString('en-US')}</p>
                                                            )}
                                                            {subscription.expires_at && (
                                                                <p>تاريخ الانتهاء: {new Date(subscription.expires_at).toLocaleDateString('en-US')}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {Object.entries(subscriptionStatusOptions).map(([key, label]) => (
                                                            <button
                                                                key={key}
                                                                onClick={() => updateSubscriptionStatus(subscription.id, key)}
                                                                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                                                    subscription.status === key
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Requests Tab */}
                        {activeTab === 'requests' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">طلبات العميل</h3>
                                    <button
                                        onClick={() => setShowRequestForm(!showRequestForm)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        إضافة طلب
                                    </button>
                                </div>

                                {showRequestForm && (
                                    <form onSubmit={handleRequestSubmit} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        نوع الطلب
                                                    </label>
                                                    <select
                                                        value={requestData.type}
                                                        onChange={(e) => setRequestData('type', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">اختر نوع الطلب</option>
                                                        <option value="service">طلب خدمة</option>
                                                        <option value="support">طلب دعم</option>
                                                        <option value="consultation">استشارة</option>
                                                        <option value="complaint">شكوى</option>
                                                        <option value="other">أخرى</option>
                                                    </select>
                                                    {requestErrors.type && (
                                                        <p className="mt-1 text-sm text-red-600">{requestErrors.type}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        مشروع العميل
                                                    </label>
                                                    <select
                                                        value={requestData.client_project_id}
                                                        onChange={(e) => setRequestData('client_project_id', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">اختر المشروع</option>
                                                        {clientProjects.map(project => (
                                                            <option key={project.id} value={project.id}>
                                                                {project.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    وصف الطلب
                                                </label>
                                                <textarea
                                                    value={requestData.description}
                                                    onChange={(e) => setRequestData('description', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="اكتب تفاصيل الطلب..."
                                                />
                                                {requestErrors.description && (
                                                    <p className="mt-1 text-sm text-red-600">{requestErrors.description}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    type="submit"
                                                    disabled={processingRequest}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                                >
                                                    {processingRequest ? 'جاري الحفظ...' : 'حفظ الطلب'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRequestForm(false)}
                                                    className="px-4 py-2 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    إلغاء
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {requests.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">لا توجد طلبات للعميل</p>
                                    ) : (
                                        requests.map((request) => (
                                            <div key={request.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <h4 className="font-medium text-gray-900">{request.type}</h4>
                                                            {getRequestStatusBadge(request.status)}
                                                        </div>
                                                        <p className="text-gray-700 mb-2">{request.description}</p>
                                                        {request.client_project && (
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                المشروع: {request.client_project.name}
                                                            </p>
                                                        )}
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(request.created_at).toLocaleString('en-US')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Activity Tab */}
                        {activeTab === 'activity' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">نشاط العميل</h3>

                                {activities && activities.length > 0 ? (
                                    <div className="space-y-3">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="bg-gray-50 p-4 rounded-lg border">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                                            <span>بواسطة: {activity.user?.name || 'النظام'}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{new Date(activity.created_at).toLocaleDateString('ar-EG', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-xs">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            activity.type === 'subscription_added'
                                                                ? 'bg-green-100 text-green-800'
                                                                : activity.type === 'subscription_status_changed'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {activity.type === 'subscription_added' ? 'إضافة اشتراك' :
                                                             activity.type === 'subscription_status_changed' ? 'تغيير حالة اشتراك' :
                                                             activity.type === 'customer_type_changed' ? 'تغيير نوع العميل' :
                                                             activity.type === 'status_changed' ? 'تغيير حالة العميل' : activity.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        لا توجد أنشطة مسجلة لهذا العميل
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
