<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;
use App\Models\ClientProjectDevelopmentCost;
use App\Models\DevelopmentCategory;
use Illuminate\Http\Request;

class ClientProjectDevelopmentCostController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ClientProject $clientProject)
    {
        $validated = $request->validate([
            'development_category_id' => 'required|exists:development_categories,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:500',
            'expense_date' => 'required|date',
            'receipt_number' => 'nullable|string|max:100',
        ]);

        $validated['client_project_id'] = $clientProject->id;

        ClientProjectDevelopmentCost::create($validated);

        return redirect()->route('admin.client-projects.show', $clientProject)
            ->with('success', 'تم إضافة تكلفة التطوير بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientProject $clientProject, ClientProjectDevelopmentCost $developmentCost)
    {
        $developmentCost->delete();

        return redirect()->route('admin.client-projects.show', $clientProject)
            ->with('success', 'تم حذف تكلفة التطوير بنجاح');
    }
}
