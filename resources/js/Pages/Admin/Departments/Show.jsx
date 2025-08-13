import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ department }) {
    return (
        <AdminLayout title="عرض القسم">
            <Head title={`عرض القسم - ${department.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">عرض القسم</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            عرض تفاصيل القسم: {department.name}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                        <Link
                            href={route('admin.departments.edit', department.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            تعديل القسم
                        </Link>

                        <Link
                            href={route('admin.departments.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            العودة للقائمة
                        </Link>
                    </div>
                </div>

                {/* Department Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">{department.name}</h1>
                                {department.description && (
                                    <p className="text-blue-100 mt-1">{department.description}</p>
                                )}
                                <div className="flex items-center mt-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        department.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {department.is_active ? 'نشط' : 'غير نشط'}
                                    </span>
                                    <span className="mr-3 text-blue-100 text-sm">
                                        {department.employees ? department.employees.length : 0} موظف
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Department Information */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    معلومات أساسية
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">اسم القسم:</span>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{department.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">الحالة:</span>
                                        <p className={`text-sm font-medium mt-1 ${
                                            department.is_active ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {department.is_active ? 'نشط' : 'غير نشط'}
                                        </p>
                                    </div>
                                    {department.description && (
                                        <div>
                                            <span className="text-xs text-gray-500">الوصف:</span>
                                            <p className="text-sm text-gray-600 mt-1">{department.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    الإحصائيات
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">إجمالي الموظفين:</span>
                                        <p className="text-lg font-bold text-blue-600 mt-1">
                                            {department.employees ? department.employees.length : 0}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">الموظفين النشطين:</span>
                                        <p className="text-lg font-bold text-green-600 mt-1">
                                            {department.employees ? department.employees.filter(emp => emp.is_active).length : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Information */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                التواريخ المهمة
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500">تاريخ الإنشاء:</span>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {new Date(department.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(department.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">آخر تحديث:</span>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {new Date(department.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(department.updated_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Employees List */}
                        {department.employees && department.employees.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    موظفي القسم ({department.employees.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {department.employees.map((employee) => (
                                        <div key={employee.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {employee.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {employee.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {employee.phone}
                                                    </p>
                                                    <div className="flex items-center mt-1">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                            employee.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {employee.is_active ? 'نشط' : 'غير نشط'}
                                                        </span>
                                                        {employee.type === 'admin' && (
                                                            <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                مدير
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex justify-end">
                                                <Link
                                                    href={route('admin.employees.show', employee.id)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    عرض التفاصيل
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
