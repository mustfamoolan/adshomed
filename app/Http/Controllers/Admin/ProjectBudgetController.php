<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectBudget;
use App\Helpers\AuthHelper;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ProjectBudgetController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255'
        ]);

        // التأكد من وجود مستخدم مصادق والحصول على ID الصحيح
        $userId = AuthHelper::getUserId();
        if (!$userId) {
            return redirect()->route('login')
                ->with('error', 'جلسة المستخدم غير صالحة، يرجى تسجيل الدخول مرة أخرى');
        }

        $project->budgets()->create([
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'added_by' => $userId
        ]);

        return redirect()->route('admin.projects.show', $project)
            ->with('success', 'تم إضافة الميزانية بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, ProjectBudget $budget): RedirectResponse
    {
        if ($budget->project_id !== $project->id) {
            abort(404);
        }

        $budget->delete();

        return redirect()->route('admin.projects.show', $project)
            ->with('success', 'تم حذف الميزانية بنجاح');
    }
}
