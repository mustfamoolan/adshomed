import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ projects }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IQD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <AdminLayout title="إدارة الحملات الإعلانية">
            <Head title="إدارة الحملات الإعلانية" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">إدارة الحملات الإعلانية</h1>
                        <p className="text-gray-600 mt-1">اختر مشروعاً لإدارة حملاته التسويقية</p>
                    </div>
                </div>

                {/* Projects Grid */}
                {projects && projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="p-6">
                                    {/* Project Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                                            <p className="text-sm text-gray-600">{project.type}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                project.status === 'active'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : project.status === 'completed'
                                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {project.status === 'active' ? 'نشط' :
                                                 project.status === 'completed' ? 'مكتمل' :
                                                 project.status === 'planning' ? 'تخطيط' : 'متوقف'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Campaign Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">{project.campaigns_count || 0}</div>
                                            <div className="text-xs text-blue-600">إجمالي الحملات</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{project.active_campaigns || 0}</div>
                                            <div className="text-xs text-green-600">حملات نشطة</div>
                                        </div>
                                    </div>

                                    {/* Budget Info */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">إجمالي الميزانية:</span>
                                            <span className="text-sm font-medium text-gray-900">{formatCurrency(project.total_budget)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">إجمالي الإنفاق:</span>
                                            <span className="text-sm font-medium text-red-600">{formatCurrency(project.total_spent)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">المتبقي:</span>
                                            <span className="text-sm font-medium text-green-600">
                                                {formatCurrency((project.total_budget || 0) - (project.total_spent || 0))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {project.total_budget > 0 && (
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-600">نسبة الإنفاق</span>
                                                <span className="text-xs text-gray-600">
                                                    {Math.round(((project.total_spent || 0) / project.total_budget) * 100)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${Math.min(((project.total_spent || 0) / project.total_budget) * 100, 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('admin.campaigns.show', project.id)}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                            إدارة الحملات
                                        </Link>
                                        <Link
                                            href={route('admin.projects.show', project.id)}
                                            className="inline-flex items-center justify-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مشاريع</h3>
                        <p className="mt-1 text-sm text-gray-500">لا توجد مشاريع متاحة لإدارة الحملات.</p>
                        <div className="mt-6">
                            <Link
                                href={route('admin.projects.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                إضافة مشروع جديد
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
