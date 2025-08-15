import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ project, developmentCategories }) {
    const [showAddCostModal, setShowAddCostModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        development_category_id: '',
        amount: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0],
        receipt_number: '',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return 'غير محدد';
        return new Date(date).toLocaleDateString('ar-IQ');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'unpaid':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'partial':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'قيد الانتظار';
            case 'in_progress':
                return 'قيد التنفيذ';
            case 'completed':
                return 'مكتمل';
            case 'cancelled':
                return 'ملغي';
            default:
                return 'غير محدد';
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'unpaid':
                return 'غير مدفوع';
            case 'partial':
                return 'مدفوع جزئياً';
            case 'paid':
                return 'مدفوع بالكامل';
            default:
                return 'غير محدد';
        }
    };

    // حساب كلف التطوير
    const totalDevelopmentCosts = project.development_costs?.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) || 0;
    const netProfit = project.paid_amount - totalDevelopmentCosts;
    const expectedProfit = project.project_value - totalDevelopmentCosts;

    const handleAddCost = (e) => {
        e.preventDefault();
        post(route('admin.client-projects.development-costs.store', project.id), {
            onSuccess: () => {
                setShowAddCostModal(false);
                reset();
            }
        });
    };

    const handleDeleteCost = (costId) => {
        if (confirm('هل أنت متأكد من حذف هذه التكلفة؟')) {
            router.delete(route('admin.client-projects.development-costs.destroy', [project.id, costId]));
        }
    };

    return (
        <AdminLayout title={`مشروع: ${project.name}`}>
            <Head title={`مشروع: ${project.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                        <p className="text-gray-600 mt-1">العميل: {project.client_name}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route('admin.client-projects.edit', project.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            تعديل المشروع
                        </Link>
                        <Link
                            href={route('admin.client-projects.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            العودة للقائمة
                        </Link>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">حالة المشروع</span>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(project.status)}`}>
                                {getStatusText(project.status)}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">حالة الدفع</span>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPaymentStatusColor(project.payment_status)}`}>
                                {getPaymentStatusText(project.payment_status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Financial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* قيمة المشروع */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">قيمة المشروع</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.project_value)}</p>
                            </div>
                        </div>
                    </div>

                    {/* المبلغ المدفوع */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">المبلغ المدفوع</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(project.paid_amount)}</p>
                            </div>
                        </div>
                    </div>

                    {/* كلف التطوير */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4 4m4-4l-4-4" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">كلف التطوير</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDevelopmentCosts)}</p>
                            </div>
                        </div>
                    </div>

                    {/* صافي الربح المحقق */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                <svg className={`w-6 h-6 ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">صافي الربح المحقق</p>
                                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {formatCurrency(netProfit)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* الربح المتوقع */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${expectedProfit >= 0 ? 'bg-purple-100' : 'bg-red-100'}`}>
                                <svg className={`w-6 h-6 ${expectedProfit >= 0 ? 'text-purple-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">الربح المتوقع</p>
                                <p className={`text-2xl font-bold ${expectedProfit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                                    {formatCurrency(expectedProfit)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">تقدم المشروع</h3>
                        <span className="text-sm font-semibold text-blue-600">
                            {Math.round((project.paid_amount / project.project_value) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((project.paid_amount / project.project_value) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>مدفوع: {formatCurrency(project.paid_amount)}</span>
                        <span>متبقي: {formatCurrency(project.remaining_amount)}</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Project Details */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل المشروع</h3>
                        <div className="space-y-4">
                            {project.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                                    <p className="text-gray-900">{project.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                                    <p className="text-gray-900">{formatDate(project.start_date)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                                    <p className="text-gray-900">{formatDate(project.end_date)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">موعد التسليم</label>
                                    <p className="text-gray-900">{formatDate(project.delivery_date)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">مدير المشروع</label>
                                    <p className="text-gray-900">{project.manager?.name || 'غير محدد'}</p>
                                </div>
                            </div>

                            {project.notes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{project.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Client Details */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
                                <p className="text-gray-900 font-medium">{project.client_name}</p>
                            </div>

                            {project.client_phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                                    <a href={`tel:${project.client_phone}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                        {project.client_phone}
                                    </a>
                                </div>
                            )}

                            {project.client_email && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                                    <a href={`mailto:${project.client_email}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                        {project.client_email}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Development Costs Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">كلف التطوير</h3>
                            <button
                                onClick={() => setShowAddCostModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                إضافة تكلفة
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {project.development_costs && project.development_costs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-right py-3 px-4 font-medium text-gray-700">الفئة</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-700">المبلغ</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-700">الوصف</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-700">التاريخ</th>
                                            <th className="text-center py-3 px-4 font-medium text-gray-700">العمليات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {project.development_costs.map((cost) => (
                                            <tr key={cost.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full ml-2"
                                                            style={{ backgroundColor: cost.development_category.color }}
                                                        ></div>
                                                        {cost.development_category.name}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-red-600">
                                                    {formatCurrency(cost.amount)}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    {cost.description || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    {formatDate(cost.expense_date)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => handleDeleteCost(cost.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="py-3 px-4">الإجمالي</td>
                                            <td className="py-3 px-4 text-red-600">{formatCurrency(totalDevelopmentCosts)}</td>
                                            <td className="py-3 px-4"></td>
                                            <td className="py-3 px-4"></td>
                                            <td className="py-3 px-4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد كلف تطوير</h3>
                                <p className="text-gray-600">ابدأ بإضافة أول تكلفة تطوير للمشروع</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Cost Modal */}
            {showAddCostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">إضافة تكلفة تطوير</h3>
                        </div>

                        <form onSubmit={handleAddCost} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    فئة التطوير *
                                </label>
                                <select
                                    value={data.development_category_id}
                                    onChange={(e) => setData('development_category_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">اختر فئة التطوير</option>
                                    {developmentCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.development_category_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.development_category_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المبلغ (IQD) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الوصف
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="وصف التكلفة أو سبب الصرف..."
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تاريخ الصرف *
                                </label>
                                <input
                                    type="date"
                                    value={data.expense_date}
                                    onChange={(e) => setData('expense_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.expense_date && <p className="text-red-500 text-sm mt-1">{errors.expense_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رقم الإيصال
                                </label>
                                <input
                                    type="text"
                                    value={data.receipt_number}
                                    onChange={(e) => setData('receipt_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="رقم الإيصال أو المرجع (اختياري)"
                                />
                                {errors.receipt_number && <p className="text-red-500 text-sm mt-1">{errors.receipt_number}</p>}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddCostModal(false);
                                        reset();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'جاري الحفظ...' : 'إضافة التكلفة'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
