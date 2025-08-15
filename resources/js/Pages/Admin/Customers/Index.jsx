import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ customers, filters, projects, statusOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const customerTypeOptions = {
        'service_request': 'عميل يطلب خدمة',
        'our_project_client': 'عميل في مشروع من مشاريعنا',
        'client_project_owner': 'صاحب مشروع من مشاريع العميل',
    };

    const projectTypeOptions = {
        'sale': 'بيع',
        'subscription': 'اشتراك',
        'download': 'تحميل',
    };

    const handleSearch = () => {
        router.get(route('admin.customers.index'), {
            search,
            status,
            project_id: projectId,
            date_from: dateFrom,
            date_to: dateTo,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setProjectId('');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.customers.index'));
    };

    const getStatusBadge = (customerStatus) => {
        const statusColors = {
            'potential_buyer': 'bg-yellow-100 text-yellow-800',
            'subscriber': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'bad': 'bg-red-100 text-red-800',
            'service_request': 'bg-blue-100 text-blue-800',
            'service_completed': 'bg-purple-100 text-purple-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[customerStatus] || 'bg-gray-100 text-gray-800'}`}>
                {statusOptions[customerStatus] || customerStatus}
            </span>
        );
    };

    const getCustomerTypeBadge = (type) => {
        const typeColors = {
            'service_request': 'bg-purple-100 text-purple-800',
            'our_project_client': 'bg-blue-100 text-blue-800',
            'client_project_owner': 'bg-green-100 text-green-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
                {customerTypeOptions[type] || type}
            </span>
        );
    };

    const deleteCustomer = (customer) => {
        if (confirm(`هل أنت متأكد من حذف العميل "${customer.name}"؟`)) {
            router.delete(route('admin.customers.destroy', customer.id));
        }
    };

    return (
        <AdminLayout title="إدارة العملاء">
            <Head title="إدارة العملاء" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
                        <p className="text-gray-600 mt-1">إدارة قاعدة بيانات العملاء والمتابعة معهم</p>
                    </div>
                    <Link
                        href={route('admin.customers.create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                        إضافة عميل جديد
                    </Link>
                </div>

                {/* Simple Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">قائمة العملاء</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        العميل
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        نوع العميل
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        تاريخ التسجيل
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        العمليات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            لا توجد عملاء
                                        </td>
                                    </tr>
                                ) : (
                                    customers.data.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">{customer.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getCustomerTypeBadge(customer.customer_type || 'service_request')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(customer.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(customer.created_at).toLocaleDateString('en-US')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={route('admin.customers.show', customer.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        عرض
                                                    </Link>
                                                    <Link
                                                        href={route('admin.customers.edit', customer.id)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        تعديل
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
