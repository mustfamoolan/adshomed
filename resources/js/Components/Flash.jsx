import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Flash() {
    const { flash } = usePage().props;

    if (!flash.success && !flash.error) {
        return null;
    }

    return (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
            {flash.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg animate-pulse">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-800 text-sm font-medium">{flash.success}</p>
                    </div>
                </div>
            )}

            {flash.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg animate-pulse">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-red-800 text-sm font-medium">{flash.error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
