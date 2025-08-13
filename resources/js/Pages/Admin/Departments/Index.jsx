import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ departments }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDepartments = departments.data.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteDepartment = (department) => {
        if (confirm(`هل أنت متأكد من حذف القسم "${department.name}"؟`)) {
            router.delete(route('admin.departments.destroy', department.id));
        }
    };

    return (
        <AdminLayout title="إدارة الأقسام">
            <Head title="إدارة الأقسام" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">إدارة الأقسام</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            إجمالي الأقسام: {departments.total}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('admin.employees.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            إدارة الموظفين
                        </Link>

                        <Link
                            href={route('admin.departments.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            إضافة قسم جديد
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            البحث في الأقسام
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ابحث عن قسم..."
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Departments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.length === 0 ? (
                        <div className="col-span-full">
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد أقسام</h3>
                                <p className="mt-2 text-sm text-gray-500">ابدأ بإضافة قسم جديد</p>
                            </div>
                        </div>
                    ) : (
                        filteredDepartments.map((department) => (
                            <div key={department.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        department.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {department.is_active ? 'نشط' : 'غير نشط'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {department.name}
                                    </h3>
                                    {department.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {department.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {department.employees_count} موظف
                                    </span>
                                    <span>
                                        {new Date(department.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-3 space-x-reverse">
                                        <Link
                                            href={route('admin.departments.show', department.id)}
                                            className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors duration-200"
                                        >
                                            عرض
                                        </Link>
                                        <Link
                                            href={route('admin.departments.edit', department.id)}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors duration-200"
                                        >
                                            تعديل
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => deleteDepartment(department)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors duration-200"
                                        disabled={department.employees_count > 0}
                                        title={department.employees_count > 0 ? 'لا يمكن حذف القسم لوجود موظفين به' : 'حذف القسم'}
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {departments.links && (
                    <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <span className="text-sm text-gray-700">
                                    عرض {departments.from} إلى {departments.to} من أصل {departments.total} قسم
                                </span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                                {departments.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
