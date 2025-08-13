import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Edit({ employee, departments }) {
    const [data, setData] = useState({
        name: employee.name || '',
        phone: employee.phone || '',
        email: employee.email || '',
        password: '',
        department_id: employee.department_id || '',
        is_active: employee.is_active ?? true
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const submitData = { ...data };
        // Only include password if it's not empty
        if (!submitData.password) {
            delete submitData.password;
        }

        router.patch(route('admin.employees.update', employee.id), submitData, {
            onSuccess: () => {
                // Success handled by redirect
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <AdminLayout title="تعديل الموظف">
            <Head title={`تعديل الموظف - ${employee.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">تعديل الموظف</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            تعديل بيانات الموظف: {employee.name}
                        </p>
                    </div>

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

                {/* Form */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم الموظف <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="أدخل اسم الموظف"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    رقم الهاتف <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="05xxxxxxxx"
                                    required
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    البريد الإلكتروني (اختياري)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="example@domain.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    كلمة المرور الجديدة (اختياري)
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="اتركها فارغة للاحتفاظ بكلمة المرور الحالية"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    اتركها فارغة إذا كنت لا تريد تغيير كلمة المرور
                                </p>
                            </div>

                            {/* Department */}
                            <div>
                                <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    القسم <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="department_id"
                                    name="department_id"
                                    value={data.department_id}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.department_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">اختر القسم</option>
                                    {departments.map(department => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-2">
                                    حالة الموظف
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={data.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_active" className="mr-2 text-sm text-gray-700">
                                        موظف نشط
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    الموظف النشط يمكنه تسجيل الدخول للنظام
                                </p>
                            </div>
                        </div>

                        {/* Employee Info Card */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">معلومات إضافية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">تاريخ الإضافة:</span>
                                    <span className="mr-2 text-gray-900">
                                        {new Date(employee.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">آخر تحديث:</span>
                                    <span className="mr-2 text-gray-900">
                                        {new Date(employee.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">القسم الحالي:</span>
                                    <span className="mr-2 text-gray-900">
                                        {employee.department ? employee.department.name : 'غير محدد'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
                            <Link
                                href={route('admin.employees.index')}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                إلغاء
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 ${
                                    processing
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-700'
                                }`}
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 ml-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        جاري الحفظ...
                                    </div>
                                ) : (
                                    'حفظ التغييرات'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
