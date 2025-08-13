import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const projectStatusColors = {
    planning: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800'
};

const projectStatusLabels = {
    planning: 'في التخطيط',
    active: 'نشط',
    completed: 'مكتمل',
    paused: 'متوقف مؤقت',
    cancelled: 'ملغى'
};

const projectTypeLabels = {
    sales: 'مبيعات',
    subscription: 'اشتراكات',
    free: 'مجاني',
    downloads: 'تحميلات'
};

const publicationStatusLabels = {
    'not_displayed': 'لم يعرض',
    'published': 'منشور',
    'unpublished': 'مغلق'
};

const publicationStatusColors = {
    'not_displayed': 'bg-gray-100 text-gray-800',
    'published': 'bg-green-100 text-green-800',
    'unpublished': 'bg-red-100 text-red-800'
};

export default function ProjectsIndex({ projects }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSubscriberModal, setShowSubscriberModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState('');

    const quickAddSale = (projectId) => {
        router.patch(`/admin/projects/${projectId}/quick-sale`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by server
            }
        });
    };

    const openSubscriberModal = (project) => {
        setSelectedProject(project);
        setSelectedPlanId('');
        setShowSubscriberModal(true);
    };

    const quickAddSubscriber = () => {
        if (!selectedProject) return;

        const data = selectedPlanId ? { plan_id: selectedPlanId } : {};

        router.patch(`/admin/projects/${selectedProject.id}/quick-subscriber`, data, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSubscriberModal(false);
                setSelectedProject(null);
                setSelectedPlanId('');
            }
        });
    };

    const calculateRevenue = (project) => {
        let revenue = 0;

        switch (project.type) {
            case 'sales':
                revenue = (Number(project.product_price) || 0) * (Number(project.sales_count) || 0);
                break;
            case 'subscription':
                // Calculate revenue from subscription plans
                if (project.subscription_plans && project.subscription_plans.length > 0) {
                    revenue = project.subscription_plans.reduce((total, plan) => {
                        const price = Number(plan.price) || 0;
                        const subscriberCount = Number(plan.subscriber_count) || 0;
                        const multiplier = plan.billing_cycle === 'yearly' ? 12 :
                                         plan.billing_cycle === 'lifetime' ? 1 : 1; // monthly
                        return total + (price * subscriberCount * multiplier);
                    }, 0);
                } else {
                    revenue = Number(project.calculated_revenue) || Number(project.total_revenue) || 0;
                }
                break;
            case 'downloads':
                // Calculate from platform stats if available
                if (project.platform_stats && project.platform_stats.length > 0) {
                    revenue = project.platform_stats.reduce((total, stat) => total + (Number(stat.revenue) || 0), 0);
                } else {
                    revenue = Number(project.total_revenue) || 0;
                }
                break;
            case 'free':
            default:
                revenue = 0;
        }

        return Number(revenue) || 0;
    };

    const getTotalSubscribers = (project) => {
        if (project.type !== 'subscription' || !project.subscription_plans) {
            return 0;
        }
        return project.subscription_plans.reduce((total, plan) => total + (plan.subscriber_count || 0), 0);
    };

    const getTotalDownloads = (project) => {
        if (project.type !== 'downloads') {
            return project.downloads_count || 0;
        }
        if (project.platform_stats && project.platform_stats.length > 0) {
            return project.platform_stats.reduce((total, stat) => total + (stat.downloads_count || 0), 0);
        }
        return project.downloads_count || 0;
    };

    const calculateProfit = (project) => {
        const revenue = calculateRevenue(project) || 0;
        const expenses = project.expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
        return revenue - expenses;
    };

    const calculateTotalBudget = (project) => {
        const initialBudget = Number(project.initial_budget) || 0;
        const additionalBudgets = project.budgets ?
            project.budgets.reduce((sum, budget) => sum + (Number(budget.amount) || 0), 0) : 0;

        // تشخيص مؤقت - سيتم إزالته لاحقاً
        if (project.id === 1) { // تغيير الرقم حسب المشروع المطلوب
            console.log('Project Debug:', {
                id: project.id,
                initial_budget: project.initial_budget,
                budgets: project.budgets,
                total: initialBudget + additionalBudgets
            });
        }

        return initialBudget + additionalBudgets;
    };    const formatCurrency = (amount) => {
        // التأكد من أن المبلغ رقم صحيح
        const numericAmount = Number(amount) || 0;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0
        }).format(numericAmount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'غير محدد';

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(dateString));
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            router.delete(route('admin.projects.destroy', id));
        }
    };

    const filteredProjects = projects.data.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.manager?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <Head title="إدارة المشاريع" />

            <div className="min-h-screen bg-gray-50/80 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة المشاريع</h1>
                                <p className="text-gray-600">إدارة المشاريع والميزانيات والتقارير المالية</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="البحث في المشاريع..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <Link
                                    href={route('admin.projects.create')}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                                >
                                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    إضافة مشروع جديد
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {filteredProjects.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مشاريع</h3>
                            <p className="text-gray-600 mb-6">ابدأ بإضافة أول مشروع لك</p>
                            <Link
                                href={route('admin.projects.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                إضافة مشروع جديد
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <div className="p-6">
                                        {/* Project Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    نوع المشروع: {projectTypeLabels[project.type]}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${projectStatusColors[project.status]}`}>
                                                {projectStatusLabels[project.status]}
                                            </span>
                                        </div>

                                        {/* Project Description */}
                                        {project.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Financial Info */}
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">إجمالي الميزانية</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(calculateTotalBudget(project))}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">إجمالي المصروفات</p>
                                                <p className="text-sm font-semibold text-red-600">
                                                    {formatCurrency(
                                                        project.expenses ? project.expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0) : 0
                                                    )}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">صافي الربح</p>
                                                <p className={`text-sm font-semibold ${calculateProfit(project) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(calculateProfit(project))}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Manager & Stats */}
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-500 mb-1">مدير المشروع</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {project.manager?.name || 'غير محدد'}
                                            </p>
                                        </div>

                                        {/* Dates */}
                                        <div className="mb-4 text-xs text-gray-500">
                                            <div className="flex justify-between">
                                                <span>بداية التطوير:</span>
                                                <span>{formatDate(project.development_start_date)}</span>
                                            </div>
                                            {project.development_end_date && (
                                                <div className="flex justify-between mt-1">
                                                    <span>انتهاء التطوير:</span>
                                                    <span>{formatDate(project.development_end_date)}</span>
                                                </div>
                                            )}
                                            {project.publication_date && (
                                                <div className="flex justify-between mt-1">
                                                    <span>تاريخ النشر:</span>
                                                    <span>{formatDate(project.publication_date)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Publication Status */}
                                        <div className="mb-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${publicationStatusColors[project.publication_status]}`}>
                                                {publicationStatusLabels[project.publication_status]}
                                            </span>
                                        </div>

                                        {/* Platforms */}
                                        {project.platforms_count > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-500 mb-2">المنصات ({project.platforms_count})</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.platforms?.slice(0, 3).map((platform, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {platform.platform}
                                                        </span>
                                                    ))}
                                                    {project.platforms?.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                            +{project.platforms.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick Actions for specific project types */}
                                        {project.type === 'sales' && (
                                            <div className="mb-4 pb-4 border-b border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        المبيعات: {project.sales_count || 0}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        سعر المنتج: {formatCurrency(project.product_price || 0)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-green-600">
                                                        إجمالي الإيرادات: {formatCurrency(calculateRevenue(project))}
                                                    </span>
                                                    <button
                                                        onClick={() => quickAddSale(project.id)}
                                                        className="inline-flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                                    >
                                                        <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        إضافة مبيعة
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {project.type === 'subscription' && (
                                            <div className="mb-4 pb-4 border-b border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        إجمالي المشتركين: {getTotalSubscribers(project)}
                                                    </span>
                                                    <span className="text-sm font-semibold text-green-600">
                                                        إيرادات شهرية: {formatCurrency(calculateRevenue(project))}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => openSubscriberModal(project)}
                                                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                                >
                                                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    إضافة مشترك
                                                </button>
                                            </div>
                                        )}

                                        {project.type === 'downloads' && (
                                            <div className="mb-4 pb-4 border-b border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        التحميلات: {project.downloads_count || 0}
                                                    </span>
                                                    <span className="text-sm font-semibold text-green-600">
                                                        إجمالي الإيرادات: {formatCurrency(project.total_revenue || 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-2 space-x-reverse">
                                                <Link
                                                    href={route('admin.projects.show', project.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                                >
                                                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    عرض
                                                </Link>

                                                <Link
                                                    href={route('admin.projects.edit', project.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                                                >
                                                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    تعديل
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    حذف
                                                </button>
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {project.expenses_count} مصروف | {project.budgets_count} ميزانية
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {projects.links && projects.links.length > 3 && (
                        <div className="mt-8 flex items-center justify-center">
                            <nav className="flex items-center space-x-1 space-x-reverse">
                                {projects.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                            link.active
                                                ? 'bg-blue-500 text-white'
                                                : link.url
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Subscriber Modal */}
            {showSubscriberModal && selectedProject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    إضافة مشترك جديد
                                </h3>
                                <button
                                    onClick={() => setShowSubscriberModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    المشروع: <span className="font-medium">{selectedProject.name}</span>
                                </p>

                                {selectedProject.subscription_plans && selectedProject.subscription_plans.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اختر الباقة:
                                        </label>
                                        <div className="space-y-2">
                                            {selectedProject.subscription_plans.map((plan) => (
                                                <label key={plan.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="plan"
                                                        value={plan.id}
                                                        checked={selectedPlanId == plan.id}
                                                        onChange={(e) => setSelectedPlanId(e.target.value)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {plan.name}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {formatCurrency(plan.price)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                {plan.billing_cycle === 'monthly' ? 'شهري' :
                                                                 plan.billing_cycle === 'yearly' ? 'سنوي' : 'مدى الحياة'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                المشتركين: {plan.subscriber_count || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">لا توجد باقات اشتراك لهذا المشروع</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-2 space-x-reverse">
                                <button
                                    onClick={() => setShowSubscriberModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={quickAddSubscriber}
                                    disabled={selectedProject.subscription_plans && selectedProject.subscription_plans.length > 0 && !selectedPlanId}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    إضافة مشترك
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
