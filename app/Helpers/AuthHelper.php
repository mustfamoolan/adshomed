<?php

namespace App\Helpers;

use App\Models\User;

class AuthHelper
{
    /**
     * الحصول على ID المستخدم الصحيح
     *
     * يحل مشكلة إرجاع auth()->id() لرقم الهاتف بدلاً من ID الحقيقي
     */
    public static function getUserId(): ?int
    {
        if (!auth()->check()) {
            return null;
        }

        $authId = auth()->id();

        // إذا كان ID صحيح (رقم صغير)
        if (is_numeric($authId) && $authId > 0 && strlen((string)$authId) <= 5) {
            // تأكد من وجود المستخدم
            $user = User::find($authId);
            return $user ? $user->id : null;
        }

        // إذا بدا كرقم هاتف، ابحث عن المستخدم
        $user = User::where('phone', $authId)->first();
        return $user ? $user->id : null;
    }

    /**
     * الحصول على المستخدم الحالي
     */
    public static function getCurrentUser(): ?User
    {
        $userId = self::getUserId();
        return $userId ? User::find($userId) : null;
    }
}
