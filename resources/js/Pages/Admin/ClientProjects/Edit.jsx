import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ project, managers }) {
    const { data, setData, put, processing, errors } = useForm({
        name: project.name || '',
        description: project.description || '',
        client_name: project.client_name || '',
        client_phone: project.client_phone || '',
        client_email: project.client_email || '',
        project_value: project.project_value || '',
        paid_amount: project.paid_amount || '',
        status: project.status || 'pending',
        payment_status: project.payment_status || 'unpaid',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        delivery_date: project.delivery_date || '',
        manager_id: project.manager_id || '',
        notes: project.notes || '',
        requirements: project.requirements || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.client-projects.update', project.id));
    };

    return (
        <AdminLayout title={`تعديل المشروع: ${project.name}`}>
            <Head title={`تعديل المشروع: ${project.name}`} />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-900">تعديل مشروع العميل</h1>
                        <p className="text-gray-600 mt-1">تعديل بيانات مشروع: {project.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* معلومات المشروع */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات المشروع</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اسم المشروع *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        مدير المشروع *
                                    </label>
                                    <select
                                        value={data.manager_id}
                                        onChange={(e) => setData('manager_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">اختر مدير المشروع</option>
                                        {managers.map((manager) => (
                                            <option key={manager.id} value={manager.id}>
                                                {manager.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.manager_id && <p className="text-red-500 text-sm mt-1">{errors.manager_id}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وصف المشروع
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* معلومات العميل */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات العميل</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اسم العميل *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.client_name}
                                        onChange={(e) => setData('client_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="text"
                                        value={data.client_phone}
                                        onChange={(e) => setData('client_phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.client_phone && <p className="text-red-500 text-sm mt-1">{errors.client_phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={data.client_email}
                                        onChange={(e) => setData('client_email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.client_email && <p className="text-red-500 text-sm mt-1">{errors.client_email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* المعلومات المالية */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">المعلومات المالية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        قيمة المشروع (IQD) *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.project_value}
                                        onChange={(e) => setData('project_value', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.project_value && <p className="text-red-500 text-sm mt-1">{errors.project_value}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المبلغ المدفوع (IQD)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.paid_amount}
                                        onChange={(e) => setData('paid_amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.paid_amount && <p className="text-red-500 text-sm mt-1">{errors.paid_amount}</p>}
                                </div>
                            </div>
                        </div>

                        {/* حالة المشروع والدفع */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">حالة المشروع</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        حالة المشروع *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="in_progress">قيد التنفيذ</option>
                                        <option value="completed">مكتمل</option>
                                        <option value="cancelled">ملغي</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        حالة الدفع *
                                    </label>
                                    <select
                                        value={data.payment_status}
                                        onChange={(e) => setData('payment_status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="unpaid">غير مدفوع</option>
                                        <option value="partial">مدفوع جزئياً</option>
                                        <option value="paid">مدفوع بالكامل</option>
                                    </select>
                                    {errors.payment_status && <p className="text-red-500 text-sm mt-1">{errors.payment_status}</p>}
                                </div>
                            </div>
                        </div>

                        {/* التواريخ */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">التواريخ المهمة</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تاريخ البداية
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تاريخ الانتهاء المتوقع
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        موعد التسليم
                                    </label>
                                    <input
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.delivery_date && <p className="text-red-500 text-sm mt-1">{errors.delivery_date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ملاحظات */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ملاحظات إضافية
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="أي ملاحظات أو تفاصيل إضافية حول المشروع..."
                            />
                            {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                        </div>

                        {/* أزرار التحكم */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.get(route('admin.client-projects.show', project.id))}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
