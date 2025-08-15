<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;
use App\Models\User;
use App\Models\DevelopmentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = ClientProject::with(['manager', 'developmentCosts'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/ClientProjects/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $managers = User::where('type', 'admin')
            ->orWhere('type', 'employee')
            ->get(['id', 'name']);

        return Inertia::render('Admin/ClientProjects/Create', [
            'managers' => $managers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'nullable|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'project_value' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'payment_status' => 'required|in:unpaid,partial,paid',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'delivery_date' => 'nullable|date',
            'manager_id' => 'required|exists:users,id',
            'notes' => 'nullable|string',
            'requirements' => 'nullable|array'
        ]);

        $validated['paid_amount'] = $validated['paid_amount'] ?? 0;

        ClientProject::create($validated);

        return redirect()->route('admin.client-projects.index')
            ->with('success', 'تم إنشاء مشروع العميل بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(ClientProject $clientProject)
    {
        $clientProject->load(['manager', 'developmentCosts.developmentCategory']);
        $developmentCategories = DevelopmentCategory::active()->ordered()->get();

        return Inertia::render('Admin/ClientProjects/Show', [
            'project' => $clientProject,
            'developmentCategories' => $developmentCategories
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientProject $clientProject)
    {
        $managers = User::where('type', 'admin')
            ->orWhere('type', 'employee')
            ->get(['id', 'name']);

        return Inertia::render('Admin/ClientProjects/Edit', [
            'project' => $clientProject,
            'managers' => $managers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ClientProject $clientProject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'nullable|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'project_value' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'payment_status' => 'required|in:unpaid,partial,paid',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'delivery_date' => 'nullable|date',
            'manager_id' => 'required|exists:users,id',
            'notes' => 'nullable|string',
            'requirements' => 'nullable|array'
        ]);

        $validated['paid_amount'] = $validated['paid_amount'] ?? 0;

        $clientProject->update($validated);

        return redirect()->route('admin.client-projects.index')
            ->with('success', 'تم تحديث مشروع العميل بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientProject $clientProject)
    {
        $clientProject->delete();

        return redirect()->route('admin.client-projects.index')
            ->with('success', 'تم حذف مشروع العميل بنجاح');
    }
}
