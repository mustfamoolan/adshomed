<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectExpense;
use App\Helpers\AuthHelper;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ProjectExpenseController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        // الحصول على جميع أنواع التسويق المتاحة
        $marketingTypes = \App\Models\MarketingType::pluck('key')->toArray();
        $allowedCategories = array_merge(['development', 'design', 'marketing', 'hosting', 'tools', 'other'], $marketingTypes);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => 'required|in:' . implode(',', $allowedCategories),
            'expense_date' => 'required|date'
        ]);

        // التأكد من وجود مستخدم مصادق والحصول على ID الصحيح
        $userId = AuthHelper::getUserId();
        if (!$userId) {
            return redirect()->route('login')
                ->with('error', 'جلسة المستخدم غير صالحة، يرجى تسجيل الدخول مرة أخرى');
        }

        $project->expenses()->create([
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'expense_date' => $validated['expense_date'],
            'added_by' => $userId
        ]);

        return redirect()->route('admin.projects.show', $project)
            ->with('success', 'تم إضافة المصروف بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, ProjectExpense $expense): RedirectResponse
    {
        if ($expense->project_id !== $project->id) {
            abort(404);
        }

        $expense->delete();

        return redirect()->route('admin.projects.show', $project)
            ->with('success', 'تم حذف المصروف بنجاح');
    }
}
