import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ projects }) {
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredProjects = projects.data.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            router.delete(route('admin.client-projects.destroy', id));
        }
    };

    // إحصائيات سريعة
    const totalProjects = projects.data.length;
    const completedProjects = projects.data.filter(p => p.status === 'completed').length;
    const inProgressProjects = projects.data.filter(p => p.status === 'in_progress').length;
    const totalValue = projects.data.reduce((sum, p) => sum + parseFloat(p.project_value || 0), 0);
    const totalPaid = projects.data.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0);

    // حساب إجمالي كلف التطوير وصافي الربح
    const totalDevelopmentCosts = projects.data.reduce((sum, p) => {
        const projectCosts = p.development_costs?.reduce((projectSum, cost) => projectSum + parseFloat(cost.amount || 0), 0) || 0;
        return sum + projectCosts;
    }, 0);
    const totalNetProfit = totalPaid - totalDevelopmentCosts;

    return (
        <AdminLayout title="مشاريع العملاء">
            <Head title="مشاريع العملاء" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">مشاريع العملاء</h1>
                        <p className="text-gray-600 mt-1">إدارة وتتبع مشاريع العملاء الخارجيين</p>
                    </div>
                    <Link
                        href={route('admin.client-projects.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        إضافة مشروع جديد
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="space-y-4">
                    {/* First Row - Project Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">إجمالي المشاريع</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalProjects.toLocaleString('en-US')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">مشاريع مكتملة</p>
                                    <p className="text-2xl font-bold text-gray-900">{completedProjects.toLocaleString('en-US')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">قيد التنفيذ</p>
                                    <p className="text-2xl font-bold text-gray-900">{inProgressProjects.toLocaleString('en-US')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">إجمالي القيمة</p>
                                    <p className="text-lg font-bold text-gray-900 truncate" title={formatCurrency(totalValue)}>
                                        {formatCurrency(totalValue)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Row - Financial Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">إجمالي المدفوع</p>
                                    <p className="text-lg font-bold text-gray-900 truncate" title={formatCurrency(totalPaid)}>
                                        {formatCurrency(totalPaid)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4 4m4-4l-4-4" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">إجمالي التكاليف</p>
                                    <p className="text-lg font-bold text-red-600 truncate" title={formatCurrency(totalDevelopmentCosts)}>
                                        {formatCurrency(totalDevelopmentCosts)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg flex-shrink-0 ${totalNetProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <svg className={`w-6 h-6 ${totalNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="mr-4 min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-600 truncate">صافي الربح</p>
                                    <p className={`text-lg font-bold truncate ${totalNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} title={formatCurrency(totalNetProfit)}>
                                        {formatCurrency(totalNetProfit)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="البحث عن مشروع أو عميل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                            {/* Card Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            العميل: <span className="font-medium text-gray-900">{project.client_name}</span>
                                        </p>
                                        {project.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 mr-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                                            {getStatusText(project.status)}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(project.payment_status)}`}>
                                            {getPaymentStatusText(project.payment_status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                {/* Financial Info */}
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">قيمة المشروع</span>
                                            <span className="text-lg font-bold text-gray-900">{formatCurrency(project.project_value)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">المدفوع</span>
                                            <span className="text-sm font-semibold text-green-600">{formatCurrency(project.paid_amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">كلف التطوير</span>
                                            <span className="text-sm font-semibold text-red-600">
                                                {formatCurrency(project.development_costs?.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) || 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-600">صافي الربح</span>
                                            <span className={`text-sm font-semibold ${
                                                (project.paid_amount - (project.development_costs?.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) || 0)) >= 0
                                                    ? 'text-emerald-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {formatCurrency(project.paid_amount - (project.development_costs?.reduce((sum, cost) => sum + parseFloat(cost.amount || 0), 0) || 0))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">المتبقي</span>
                                            <span className="text-sm font-semibold text-red-600">{formatCurrency(project.remaining_amount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-600">نسبة الدفع</span>
                                        <span className="text-sm font-semibold text-blue-600">
                                            {Math.round((project.paid_amount / project.project_value) * 100).toLocaleString('en-US')}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min((project.paid_amount / project.project_value) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="space-y-2 mb-4">
                                    {project.manager && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            مدير المشروع: {project.manager.name}
                                        </div>
                                    )}
                                    {project.start_date && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            تاريخ البداية: {new Date(project.start_date).toLocaleDateString('en-US')}
                                        </div>
                                    )}
                                    {project.delivery_date && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            موعد التسليم: {new Date(project.delivery_date).toLocaleDateString('en-US')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('admin.client-projects.show', project.id)}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        عرض
                                    </Link>
                                    <Link
                                        href={route('admin.client-projects.edit', project.id)}
                                        className="inline-flex items-center px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        تعديل
                                    </Link>
                                </div>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع عملاء</h3>
                        <p className="text-gray-600 mb-4">ابدأ بإضافة أول مشروع عميل</p>
                        <Link
                            href={route('admin.client-projects.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            إضافة مشروع جديد
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {projects.links && projects.links.length > 3 && (
                    <div className="flex justify-center">
                        <nav className="flex space-x-1">
                            {projects.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
