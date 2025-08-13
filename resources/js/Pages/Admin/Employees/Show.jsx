import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ employee }) {
    return (
        <AdminLayout title="عرض الموظف">
            <Head title={`عرض الموظف - ${employee.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">عرض الموظف</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            عرض تفاصيل الموظف: {employee.name}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                        <Link
                            href={route('admin.employees.edit', employee.id)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            تعديل الموظف
                        </Link>

                        <Link
                            href={route('admin.employees.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            العودة للقائمة
                        </Link>
                    </div>
                </div>

                {/* Employee Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {employee.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold">{employee.name}</h1>
                                <p className="text-blue-100 mt-1">
                                    {employee.department ? employee.department.name : 'غير محدد'}
                                </p>
                                <div className="flex items-center mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        employee.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {employee.is_active ? 'نشط' : 'غير نشط'}
                                    </span>
                                    <span className="mr-3 text-blue-100">
                                        {employee.type === 'admin' ? 'مدير' : 'موظف'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employee Details */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Contact Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    معلومات التواصل
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">رقم الهاتف:</span>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{employee.phone}</p>
                                    </div>
                                    {employee.email && (
                                        <div>
                                            <span className="text-xs text-gray-500">البريد الإلكتروني:</span>
                                            <p className="text-sm font-medium text-gray-900 mt-1">{employee.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Department Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    معلومات القسم
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">اسم القسم:</span>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {employee.department ? employee.department.name : 'غير محدد'}
                                        </p>
                                    </div>
                                    {employee.department?.description && (
                                        <div>
                                            <span className="text-xs text-gray-500">وصف القسم:</span>
                                            <p className="text-sm text-gray-600 mt-1">{employee.department.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    معلومات الحساب
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">نوع الحساب:</span>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {employee.type === 'admin' ? 'مدير النظام' : 'موظف'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">حالة الحساب:</span>
                                        <p className={`text-sm font-medium mt-1 ${
                                            employee.is_active ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {employee.is_active ? 'نشط' : 'غير نشط'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Information */}
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                التواريخ المهمة
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500">تاريخ الإضافة:</span>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {new Date(employee.created_at).toLocaleDateString('ar-IQ', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(employee.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">آخر تحديث:</span>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {new Date(employee.updated_at).toLocaleDateString('ar-IQ', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(employee.updated_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
