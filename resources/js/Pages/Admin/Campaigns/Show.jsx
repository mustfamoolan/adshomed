import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ project, campaigns, marketingTypes }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        project_id: project.id,
        start_date: '',
        end_date: '',
        marketing_type_key: 'facebook',
        budget: ''
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'draft':
                return 'مسودة';
            case 'active':
                return 'نشطة';
            case 'paused':
                return 'متوقفة';
            case 'completed':
                return 'مكتملة';
            case 'cancelled':
                return 'ملغية';
            default:
                return 'غير محدد';
        }
    };

    // حساب الإحصائيات
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + parseFloat(c.budget || 0), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + parseFloat(c.actual_cost || 0), 0);

    const handleCreateCampaign = (e) => {
        e.preventDefault();
        post(route('admin.campaigns.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    const handleEditCampaign = (e) => {
        e.preventDefault();
        put(route('admin.campaigns.update', editingCampaign.id), {
            onSuccess: () => {
                setEditingCampaign(null);
                reset();
            }
        });
    };

    const handleDelete = (campaignId) => {
        if (confirm('هل أنت متأكد من حذف هذه الحملة؟')) {
            router.delete(route('admin.campaigns.destroy', campaignId));
        }
    };

    const openEditModal = (campaign) => {
        setEditingCampaign(campaign);
        setData({
            project_id: project.id,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            marketing_type_key: campaign.marketing_type_key,
            budget: campaign.budget
        });
    };

    return (
        <AdminLayout title={`حملات المشروع: ${project.name}`}>
            <Head title={`حملات المشروع: ${project.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href={route('admin.campaigns.index')}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                إدارة الحملات
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 text-sm font-medium">حملات المشروع</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-gray-600 mt-1">إدارة جميع حملات التسويق للمشروع</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            إضافة حملة جديدة
                        </button>
                        <Link
                            href={route('admin.projects.show', project.id)}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            عرض المشروع
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">إجمالي الحملات</p>
                                <p className="text-2xl font-bold text-gray-900">{totalCampaigns.toLocaleString('en-US')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">حملات نشطة</p>
                                <p className="text-2xl font-bold text-gray-900">{activeCampaigns.toLocaleString('en-US')}</p>
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
                                <p className="text-sm font-medium text-gray-600">إجمالي الميزانية</p>
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4 4m4-4l-4-4" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">إجمالي الإنفاق</p>
                                <p className="text-lg font-bold text-red-600">{formatCurrency(totalSpent)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaigns List */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">قائمة الحملات</h2>
                    </div>

                    {campaigns.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            اسم الحملة
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            المنصة
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الفترة
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الميزانية
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الإنفاق
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الحالة
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            العمليات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                                    {campaign.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.description}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {campaign.marketing_type?.name_ar || 'غير محدد'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div>
                                                    <div>{new Date(campaign.start_date).toLocaleDateString('en-US')}</div>
                                                    <div className="text-gray-500">إلى {new Date(campaign.end_date).toLocaleDateString('en-US')}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(campaign.budget)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-red-600 font-medium">
                                                {formatCurrency(campaign.actual_cost)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(campaign.status)}`}>
                                                    {getStatusText(campaign.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium space-x-2">
                                                <Link
                                                    href={route('admin.campaigns.details', campaign.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    التفاصيل
                                                </Link>
                                                <button
                                                    onClick={() => openEditModal(campaign)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    تعديل
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(campaign.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    حذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد حملات</h3>
                            <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء حملة تسويقية جديدة لهذا المشروع.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    إضافة حملة جديدة
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">إضافة حملة جديدة</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateCampaign} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ البداية
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ النهاية
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min={data.start_date}
                                            required
                                        />
                                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            منصة التسويق
                                        </label>
                                        <select
                                            value={data.marketing_type_key}
                                            onChange={(e) => setData('marketing_type_key', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {marketingTypes.map((type) => (
                                                <option key={type.key} value={type.key}>
                                                    {type.name_ar}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.marketing_type_key && <p className="mt-1 text-sm text-red-600">{errors.marketing_type_key}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            مبلغ التسويق (IQD)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.budget}
                                            onChange={(e) => setData('budget', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="0.01"
                                            required
                                            placeholder="أدخل مبلغ التسويق"
                                        />
                                        {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
                                    >
                                        {processing ? 'جاري الحفظ...' : 'إضافة الحملة'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Campaign Modal */}
            {editingCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">تعديل الحملة: {editingCampaign.name}</h3>
                                <button
                                    onClick={() => setEditingCampaign(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleEditCampaign} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ البداية
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ النهاية
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min={data.start_date}
                                            required
                                        />
                                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            منصة التسويق
                                        </label>
                                        <select
                                            value={data.marketing_type_key}
                                            onChange={(e) => setData('marketing_type_key', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {marketingTypes.map((type) => (
                                                <option key={type.key} value={type.key}>
                                                    {type.name_ar}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.marketing_type_key && <p className="mt-1 text-sm text-red-600">{errors.marketing_type_key}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            مبلغ التسويق (IQD)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.budget}
                                            onChange={(e) => setData('budget', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="0.01"
                                            required
                                            placeholder="أدخل مبلغ التسويق"
                                        />
                                        {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingCampaign(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
                                    >
                                        {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
