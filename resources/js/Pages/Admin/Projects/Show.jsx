import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const projectStatusColors = {
    planning: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-orange-100 text-orange-800',
    cancelled: 'bg-red-100 text-red-800'
};

const projectStatusLabels = {
    planning: 'تخطيط',
    active: 'نشط',
    completed: 'مكتمل',
    paused: 'متوقف',
    cancelled: 'ملغي'
};

const projectTypeLabels = {
    sales: 'مبيعات',
    subscription: 'اشتراكات',
    free: 'مجاني',
    downloads: 'تحميلات'
};

const platformLabels = {
    web: 'موقع ويب',
    android: 'أندرويد',
    ios: 'آيفون',
    desktop: 'سطح المكتب',
    facebook: 'فيسبوك',
    instagram: 'إنستغرام',
    youtube: 'يوتيوب',
    telegram: 'تيليجرام',
    whatsapp: 'واتساب',
    other: 'أخرى'
};

const expenseCategoryLabels = {
    development: 'تطوير',
    design: 'تصميم',
    marketing: 'تسويق',
    hosting: 'استضافة',
    tools: 'أدوات',
    other: 'أخرى'
};

export default function Show({ project, expensesByCategory, recentExpenses, recentBudgets, marketingTypes }) {
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showSubscriberModal, setShowSubscriberModal] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [showMarketingSubcategories, setShowMarketingSubcategories] = useState(false);

    // دالة للحصول على تسمية الفئة الصحيحة
    const getCategoryLabel = (category) => {
        // البحث في أنواع التسويق
        const marketingType = marketingTypes?.find(type => type.key === category);
        if (marketingType) {
            return marketingType.name_ar;
        }
        return expenseCategoryLabels[category] || category;
    };

    const { data: budgetData, setData: setBudgetData, post: postBudget, processing: budgetProcessing, errors: budgetErrors, reset: resetBudget } = useForm({
        amount: '',
        description: ''
    });

    const { data: expenseData, setData: setExpenseData, post: postExpense, processing: expenseProcessing, errors: expenseErrors, reset: resetExpense } = useForm({
        title: '',
        amount: '',
        description: '',
        category: 'development',
        expense_date: new Date().toISOString().split('T')[0] // تاريخ اليوم
    });

    // تحديد ما إذا كان يجب إظهار الفئات الفرعية للتسويق عند التحميل
    useEffect(() => {
        if (expenseData && expenseData.category && marketingTypes?.some(type => type.key === expenseData.category)) {
            setShowMarketingSubcategories(true);
        } else {
            setShowMarketingSubcategories(false);
        }
    }, [marketingTypes, expenseData.category]);    // دالة مخصصة لإعادة تعيين بيانات المصروف مع الحفاظ على فئة التسويق
    const resetExpenseForm = () => {
        setExpenseData({
            title: '',
            amount: '',
            description: '',
            category: 'development',
            expense_date: new Date().toISOString().split('T')[0]
        });
        setShowMarketingSubcategories(false);
    };

    const { data: platformStatsData, setData: setPlatformStatsData, post: postPlatformStats, processing: platformStatsProcessing, errors: platformStatsErrors, reset: resetPlatformStats } = useForm({
        platform: '',
        downloads_count: '',
        revenue: ''
    });

    const quickAddSale = () => {
        router.patch(`/admin/projects/${project.id}/quick-sale`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by server
            }
        });
    };

    const openSubscriberModal = () => {
        setSelectedPlanId('');
        setShowSubscriberModal(true);
    };

    const quickAddSubscriber = () => {
        const data = selectedPlanId ? { plan_id: selectedPlanId } : {};

        router.patch(`/admin/projects/${project.id}/quick-subscriber`, data, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSubscriberModal(false);
                setSelectedPlanId('');
            }
        });
    };    const handleAddPlatformStats = (e) => {
        e.preventDefault();
        postPlatformStats(route('admin.projects.platform-stats', project.id), {
            onSuccess: () => {
                resetPlatformStats();
            }
        });
    };

    const handleCategoryChange = (category) => {
        console.log('Category changed to:', category);
        console.log('Available marketing types:', marketingTypes);

        if (category === 'marketing') {
            setShowMarketingSubcategories(true);
            // إذا اختار التسويق، اختر أول نوع تسويق متاح
            if (marketingTypes?.length > 0) {
                const firstMarketingType = marketingTypes[0].key;
                console.log('Setting category to first marketing type:', firstMarketingType);
                setExpenseData('category', firstMarketingType);
            }
        } else {
            setShowMarketingSubcategories(false);
            setExpenseData('category', category);
        }
    };    const handleAddBudget = (e) => {
        e.preventDefault();
        postBudget(route('admin.projects.budgets.store', project.id), {
            onSuccess: () => {
                resetBudget();
                setShowAddBudget(false);
            }
        });
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        postExpense(route('admin.projects.expenses.store', project.id), {
            onSuccess: () => {
                resetExpenseForm();
                setShowAddExpense(false);
            }
        });
    };

    const handleDeleteExpense = (expenseId) => {
        if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
            router.delete(route('admin.projects.expenses.destroy', [project.id, expenseId]), {
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by server
                }
            });
        }
    };

    const handleDeleteBudget = (budgetId) => {
        if (confirm('هل أنت متأكد من حذف هذه الميزانية؟')) {
            router.delete(route('admin.projects.budgets.destroy', [project.id, budgetId]), {
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by server
                }
            });
        }
    };

    const formatCurrency = (amount) => {
        // التأكد من أن المبلغ رقم صحيح
        const numericAmount = Number(amount) || 0;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numericAmount);
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

    const calculateTotalExpenses = (project) => {
        // حساب إجمالي المصروفات من قاعدة البيانات
        return project.expenses ? project.expenses.reduce((total, expense) => {
            return total + (Number(expense.amount) || 0);
        }, 0) : 0;
    };

    const getTotalBudget = (project) => {
        return project.calculated_total_budget || project.total_budget || project.initial_budget || 0;
    };    const calculateProfit = (project) => {
        const revenue = calculateRevenue(project) || 0;
        const expenses = calculateTotalExpenses(project);
        return revenue - expenses;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <Head title={`مشروع: ${project.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${projectStatusColors[project.status]}`}>
                                {projectStatusLabels[project.status]}
                            </span>
                            <span className="text-sm text-gray-600">
                                نوع المشروع: {projectTypeLabels[project.type]}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Quick Action Buttons */}
                        {project.type === 'sales' && (
                            <button
                                onClick={quickAddSale}
                                className="inline-flex items-center px-3 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                إضافة مبيعة
                            </button>
                        )}

                        {project.type === 'subscription' && (
                            <button
                                onClick={openSubscriberModal}
                                className="inline-flex items-center px-3 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                إضافة مشترك
                            </button>
                        )}

                        <Link
                            href={route('admin.projects.edit', project.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            تعديل
                        </Link>
                        <Link
                            href={route('admin.projects.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            العودة
                        </Link>
                    </div>
                </div>

                {/* Project Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mr-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">إجمالي الميزانية</dt>
                                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(getTotalBudget(project))}</dd>
                                    <p className="text-xs text-gray-400 mt-1">المضافة عند الإنشاء + المضافة لاحقاً</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mr-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">إجمالي المصروفات</dt>
                                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(calculateTotalExpenses(project))}</dd>
                                    <p className="text-xs text-gray-400 mt-1">جميع المصروفات المضافة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mr-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">إجمالي الإيرادات</dt>
                                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(calculateRevenue(project))}</dd>
                                    <p className="text-xs text-gray-400 mt-1">حسب نوع المشروع والأسعار</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${calculateProfit(project) >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mr-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">صافي الربح</dt>
                                    <dd className={`text-lg font-medium ${calculateProfit(project) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(calculateProfit(project))}
                                    </dd>
                                    <p className="text-xs text-gray-400 mt-1">الإيرادات - المصروفات</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(getTotalBudget(project) - calculateTotalExpenses(project)) >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mr-5 w-0 flex-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">الميزانية المتبقية</dt>
                                    <dd className={`text-lg font-medium ${(getTotalBudget(project) - calculateTotalExpenses(project)) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {formatCurrency(getTotalBudget(project) - calculateTotalExpenses(project))}
                                    </dd>
                                    <p className="text-xs text-gray-400 mt-1">الميزانية - المصروفات</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Information Based on Project Type */}
                {(project.type === 'sales' || project.type === 'subscription' || project.type === 'downloads') && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">معلومات التسعير والإيرادات</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            {project.type === 'sales' && (
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">سعر المنتج</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                            {formatCurrency(project.product_price || 0)}
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">عدد المبيعات</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                            {project.sales_count || 0} مبيعة
                                        </dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">إجمالي إيرادات المبيعات</dt>
                                        <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2 font-bold text-lg">
                                            {formatCurrency(calculateRevenue(project))}
                                        </dd>
                                    </div>
                                </dl>
                            )}

                            {project.type === 'subscription' && (
                                <div className="space-y-6">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">إجمالي المشتركين</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                                {getTotalSubscribers(project)} مشترك
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">إيرادات الاشتراكات الشهرية</dt>
                                            <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2 font-bold text-lg">
                                                {formatCurrency(calculateRevenue(project))}
                                            </dd>
                                        </div>
                                    </dl>

                                    {project.subscription_plans && project.subscription_plans.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-4 px-6">باقات الاشتراك:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6">
                                                {project.subscription_plans.map((plan, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                        <div className="text-sm font-medium text-gray-900 mb-2">
                                                            {plan.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1">
                                                            السعر: {formatCurrency(plan.price)}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1">
                                                            نوع الدفع: {plan.billing_cycle === 'monthly' ? 'شهري' : plan.billing_cycle === 'yearly' ? 'سنوي' : 'مدى الحياة'}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-2">
                                                            المشتركين: {plan.subscriber_count || 0}
                                                        </div>
                                                        <div className="text-sm font-semibold text-green-600">
                                                            إيرادات شهرية: {formatCurrency((plan.price || 0) * (plan.subscriber_count || 0) * (plan.billing_cycle === 'yearly' ? 12 : plan.billing_cycle === 'lifetime' ? 1 : 1))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.type === 'downloads' && (
                                <div className="space-y-6">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">إجمالي التحميلات</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                                {project.platform_stats ? project.platform_stats.reduce((total, stat) => total + (stat.downloads_count || 0), 0) : project.downloads_count || 0} تحميل
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">إجمالي الإيرادات</dt>
                                            <dd className="mt-1 text-sm text-green-600 sm:mt-0 sm:col-span-2 font-bold text-lg">
                                                {formatCurrency(project.platform_stats ? project.platform_stats.reduce((total, stat) => total + (stat.revenue || 0), 0) : project.total_revenue || 0)}
                                            </dd>
                                        </div>
                                    </dl>

                                    {project.platform_stats && project.platform_stats.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-4 px-6">إحصائيات المنصات:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6">
                                                {project.platform_stats.map((stat, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                        <div className="text-sm font-medium text-gray-900 mb-2">
                                                            {stat.platform}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mb-1">
                                                            التحميلات: {stat.downloads_count || 0}
                                                        </div>
                                                        <div className="text-sm font-semibold text-green-600">
                                                            الإيرادات: {formatCurrency(stat.revenue || 0)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Platform Stats Form */}
                                    <div className="px-6 pb-6">
                                        <h4 className="text-md font-medium text-gray-900 mb-4">إضافة إحصائيات منصة:</h4>
                                        <form onSubmit={handleAddPlatformStats} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">المنصة</label>
                                                <select
                                                    value={platformStatsData.platform}
                                                    onChange={(e) => setPlatformStatsData('platform', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    required
                                                >
                                                    <option value="">اختر المنصة</option>
                                                    {project.platforms && project.platforms.map((platform, index) => (
                                                        <option key={index} value={platform.platform}>{platform.platform}</option>
                                                    ))}
                                                </select>
                                                {platformStatsErrors.platform && <div className="text-red-600 text-xs mt-1">{platformStatsErrors.platform}</div>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">عدد التحميلات</label>
                                                <input
                                                    type="number"
                                                    value={platformStatsData.downloads_count}
                                                    onChange={(e) => setPlatformStatsData('downloads_count', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    min="1"
                                                    required
                                                />
                                                {platformStatsErrors.downloads_count && <div className="text-red-600 text-xs mt-1">{platformStatsErrors.downloads_count}</div>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">الإيرادات (اختياري)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={platformStatsData.revenue}
                                                    onChange={(e) => setPlatformStatsData('revenue', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    min="0"
                                                    placeholder="0.00"
                                                />
                                                {platformStatsErrors.revenue && <div className="text-red-600 text-xs mt-1">{platformStatsErrors.revenue}</div>}
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="submit"
                                                    disabled={platformStatsProcessing}
                                                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    إضافة
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Project Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">معلومات المشروع</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">اسم المشروع</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.name}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">الوصف</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.description || 'لا يوجد وصف'}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">مدير المشروع</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.manager?.name}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">تاريخ بداية التطوير</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(project.development_start_date)}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">تاريخ انتهاء التطوير</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(project.development_end_date)}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">تاريخ النشر</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(project.publication_date)}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">حالة النشر</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            project.publication_status === 'published' ? 'bg-green-100 text-green-800' :
                                            project.publication_status === 'unpublished' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {project.publication_status === 'published' ? 'منشور' :
                                             project.publication_status === 'unpublished' ? 'مغلق' : 'لم يعرض'}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Platforms */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">المنصات</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <div className="px-4 py-5 sm:p-6">
                                {project.platforms && project.platforms.length > 0 ? (
                                    <div className="space-y-3">
                                        {project.platforms.map((platform, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-900">{platformLabels[platform.platform]}</span>
                                                {platform.platform_url && (
                                                    <a
                                                        href={platform.platform_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-500"
                                                    >
                                                        رابط المنصة
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">لا توجد منصات مضافة</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget and Expenses Management */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Budget Section */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">إدارة الميزانية</h3>
                            <button
                                onClick={() => setShowAddBudget(!showAddBudget)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                إضافة ميزانية
                            </button>
                        </div>

                        {showAddBudget && (
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                                <form onSubmit={handleAddBudget} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={budgetData.amount}
                                            onChange={e => setBudgetData('amount', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0.00"
                                            required
                                        />
                                        {budgetErrors.amount && <div className="text-red-500 text-sm mt-1">{budgetErrors.amount}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">الوصف</label>
                                        <input
                                            type="text"
                                            value={budgetData.description}
                                            onChange={e => setBudgetData('description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {budgetErrors.description && <div className="text-red-500 text-sm mt-1">{budgetErrors.description}</div>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={budgetProcessing}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            إضافة
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddBudget(false)}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="border-t border-gray-200">
                            <div className="px-4 py-5 sm:p-6">
                                {recentBudgets && recentBudgets.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentBudgets.map((budget) => (
                                            <div key={budget.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{formatCurrency(budget.amount)}</p>
                                                    <p className="text-xs text-gray-500">{budget.description}</p>
                                                    <p className="text-xs text-gray-400">بواسطة: {budget.added_by?.name}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(budget.created_at)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteBudget(budget.id)}
                                                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-300 hover:bg-red-50"
                                                        title="حذف الميزانية"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">لا توجد ميزانيات مضافة</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expenses Section */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">إدارة المصروفات</h3>
                            <button
                                onClick={() => setShowAddExpense(!showAddExpense)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                إضافة مصروف
                            </button>
                        </div>

                        {showAddExpense && (
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                                <form onSubmit={handleAddExpense} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">عنوان المصروف</label>
                                        <input
                                            type="text"
                                            value={expenseData.title}
                                            onChange={e => setExpenseData('title', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="مثال: شراء استضافة"
                                            required
                                        />
                                        {expenseErrors.title && <div className="text-red-500 text-sm mt-1">{expenseErrors.title}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">المبلغ</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={expenseData.amount}
                                            onChange={e => setExpenseData('amount', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {expenseErrors.amount && <div className="text-red-500 text-sm mt-1">{expenseErrors.amount}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">الفئة</label>
                                        <select
                                            value={marketingTypes?.some(type => type.key === expenseData.category) ? 'marketing' : expenseData.category}
                                            onChange={e => handleCategoryChange(e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {Object.entries(expenseCategoryLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                        {expenseErrors.category && <div className="text-red-500 text-sm mt-1">{expenseErrors.category}</div>}
                                    </div>

                                    {/* فئات التسويق الفرعية */}
                                    {showMarketingSubcategories && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">نوع التسويق</label>
                                            <select
                                                value={marketingTypes?.some(type => type.key === expenseData.category) ? expenseData.category : (marketingTypes?.[0]?.key || '')}
                                                onChange={e => setExpenseData('category', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {marketingTypes?.map((type) => (
                                                    <option key={type.key} value={type.key}>{type.name_ar}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">الوصف</label>
                                        <input
                                            type="text"
                                            value={expenseData.description}
                                            onChange={e => setExpenseData('description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="تفاصيل إضافية اختيارية"
                                        />
                                        {expenseErrors.description && <div className="text-red-500 text-sm mt-1">{expenseErrors.description}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">تاريخ المصروف</label>
                                        <input
                                            type="date"
                                            value={expenseData.expense_date}
                                            onChange={e => setExpenseData('expense_date', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {expenseErrors.expense_date && <div className="text-red-500 text-sm mt-1">{expenseErrors.expense_date}</div>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={expenseProcessing}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            إضافة
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddExpense(false)}
                                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="border-t border-gray-200">
                            <div className="px-4 py-5 sm:p-6">
                                {recentExpenses && recentExpenses.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentExpenses.map((expense) => (
                                            <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</p>
                                                    <p className="text-xs text-gray-500">{expense.description}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {getCategoryLabel(expense.category)} - بواسطة: {expense.added_by?.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="text-xs text-gray-500">
                                                        {formatDate(expense.created_at)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-300 hover:bg-red-50"
                                                        title="حذف المصروف"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">لا توجد مصروفات مضافة</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expenses by Category Chart */}
                {expensesByCategory && Object.keys(expensesByCategory).length > 0 && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">المصروفات حسب الفئة</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(expensesByCategory).map(([category, amount]) => (
                                    <div key={category} className="text-center p-4 border rounded-lg">
                                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(amount)}</div>
                                        <div className="text-sm text-gray-500">{getCategoryLabel(category)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Subscriber Modal */}
            {showSubscriberModal && (
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
                                    المشروع: <span className="font-medium">{project.name}</span>
                                </p>

                                {project.subscription_plans && project.subscription_plans.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اختر الباقة:
                                        </label>
                                        <div className="space-y-2">
                                            {project.subscription_plans.map((plan) => (
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
                                    disabled={project.subscription_plans && project.subscription_plans.length > 0 && !selectedPlanId}
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
