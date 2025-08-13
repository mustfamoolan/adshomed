<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $projects = Project::with(['manager', 'platforms', 'subscriptionPlans', 'platformStats', 'budgets', 'expenses'])
            ->withCount(['expenses', 'budgets'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $managers = User::where('is_active', true)->get();

        return Inertia::render('Admin/Projects/Create', [
            'managers' => $managers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'initial_budget' => 'required|numeric|min:0',
            'product_price' => 'nullable|numeric|min:0|required_if:type,sales',
            'type' => 'required|in:sales,subscription,free,downloads',
            'status' => 'required|in:planning,active,completed,paused,cancelled',
            'manager_id' => 'required|exists:users,id',
            'development_start_date' => 'nullable|date',
            'development_end_date' => 'nullable|date|after_or_equal:development_start_date',
            'publication_date' => 'nullable|date',
            'publication_status' => 'required|in:published,unpublished,not_displayed',
            'platforms' => 'nullable|array',
            'platforms.*' => 'string|in:web,android,ios,desktop,facebook,instagram,youtube,telegram,whatsapp,other',
            'platform_urls' => 'nullable|array',
            'platform_urls.*' => 'nullable|url',
            // Subscription plans validation
            'subscription_plans' => 'nullable|array|required_if:type,subscription',
            'subscription_plans.*.plan_name' => 'required_with:subscription_plans|string|max:255',
            'subscription_plans.*.price' => 'required_with:subscription_plans|numeric|min:0',
            'subscription_plans.*.billing_cycle' => 'required_with:subscription_plans|in:monthly,yearly,lifetime',
            'subscription_plans.*.description' => 'nullable|string'
        ]);

        // تنظيف البيانات قبل الإنشاء
        $createData = $validated;
        $createData['sales_count'] = $validated['sales_count'] ?? 0;
        $createData['downloads_count'] = $validated['downloads_count'] ?? 0;
        $createData['total_revenue'] = 0;
        $createData['total_expenses'] = 0;

        $project = Project::create($createData);

        // Add platforms
        if ($request->has('platforms')) {
            foreach ($request->platforms as $index => $platform) {
                $project->platforms()->create([
                    'platform' => $platform,
                    'platform_url' => $request->platform_urls[$index] ?? null
                ]);
            }
        }

        // Add subscription plans if project type is subscription
        if ($project->type === 'subscription' && $request->has('subscription_plans')) {
            foreach ($request->subscription_plans as $plan) {
                $project->subscriptionPlans()->create([
                    'plan_name' => $plan['plan_name'],
                    'price' => $plan['price'],
                    'billing_cycle' => $plan['billing_cycle'],
                    'description' => $plan['description'] ?? null,
                    'subscribers_count' => 0
                ]);
            }
        }

        return redirect()->route('admin.projects.index')
            ->with('success', 'تم إنشاء المشروع بنجاح');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        $project->load([
            'manager',
            'platforms',
            'budgets.addedBy',
            'expenses.addedBy',
            'subscriptionPlans',
            'platformStats'
        ]);

        // حساب إجمالي الميزانية (الأساسية + المضافة)
        $project->calculated_total_budget = $project->initial_budget + $project->budgets->sum('amount');

        $expensesByCategory = $project->getExpensesByCategory();

        $recentExpenses = $project->expenses()
            ->with('addedBy')
            ->latest()
            ->take(10)
            ->get();

        $recentBudgets = $project->budgets()
            ->with('addedBy')
            ->latest()
            ->take(5)
            ->get();

        // Get marketing types for categories
        $marketingTypes = \App\Models\MarketingType::all();

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
            'expensesByCategory' => $expensesByCategory,
            'recentExpenses' => $recentExpenses,
            'recentBudgets' => $recentBudgets,
            'marketingTypes' => $marketingTypes
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {
        $project->load('platforms');
        $managers = User::where('is_active', true)->get();

        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
            'managers' => $managers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'initial_budget' => 'required|numeric|min:0',
            'total_revenue' => 'nullable|numeric|min:0',
            'sales_count' => 'nullable|integer|min:0',
            'downloads_count' => 'nullable|integer|min:0',
            'type' => 'required|in:sales,subscription,free,downloads',
            'status' => 'required|in:planning,active,completed,paused,cancelled',
            'manager_id' => 'required|exists:users,id',
            'development_start_date' => 'nullable|date',
            'development_end_date' => 'nullable|date|after_or_equal:development_start_date',
            'publication_date' => 'nullable|date',
            'publication_status' => 'required|in:published,unpublished,not_displayed',
            'platforms' => 'nullable|array',
            'platforms.*' => 'string|in:web,android,ios,desktop,facebook,instagram,youtube,telegram,whatsapp,other',
            'platform_urls' => 'nullable|array',
            'platform_urls.*' => 'nullable|url'
        ]);

        // تنظيف البيانات قبل التحديث
        $updateData = $validated;
        $updateData['sales_count'] = $validated['sales_count'] ?? 0;
        $updateData['downloads_count'] = $validated['downloads_count'] ?? 0;
        $updateData['total_revenue'] = $validated['total_revenue'] ?? 0;

        $project->update($updateData);

        // Update platforms
        $project->platforms()->delete();
        if ($request->has('platforms')) {
            foreach ($request->platforms as $index => $platform) {
                $project->platforms()->create([
                    'platform' => $platform,
                    'platform_url' => $request->platform_urls[$index] ?? null
                ]);
            }
        }

        return redirect()->route('admin.projects.index')
            ->with('success', 'تم تحديث المشروع بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('success', 'تم حذف المشروع بنجاح');
    }

    /**
     * Add quick sale to project
     */
    public function quickSale(Project $project): RedirectResponse
    {
        if ($project->type !== 'sales') {
            return back()->with('error', 'هذا المشروع ليس من نوع المبيعات');
        }

        $project->increment('sales_count');

        return back()->with('success', 'تمت إضافة مبيعة جديدة بنجاح');
    }

    /**
     * Add quick subscriber to project
     */
    public function quickSubscriber(Request $request, Project $project): RedirectResponse
    {
        if ($project->type !== 'subscription') {
            return back()->with('error', 'هذا المشروع ليس من نوع الاشتراكات');
        }

        $planId = $request->input('plan_id');

        if ($planId) {
            $plan = $project->subscriptionPlans()->find($planId);
            if ($plan) {
                $plan->increment('subscriber_count');
                return back()->with('success', 'تمت إضافة مشترك جديد بنجاح');
            }
            return back()->with('error', 'الباقة المحددة غير موجودة');
        }

        // If no plan specified, add to the first available subscription plan
        $firstPlan = $project->subscriptionPlans()->first();
        if ($firstPlan) {
            $firstPlan->increment('subscriber_count');
            return back()->with('success', 'تمت إضافة مشترك جديد بنجاح');
        }

        return back()->with('error', 'لا توجد باقات اشتراك متاحة');
    }

    /**
     * Add downloads and revenue for specific platform
     */
    public function addPlatformStats(Request $request, Project $project): RedirectResponse
    {
        if ($project->type !== 'downloads') {
            return back()->with('error', 'هذا المشروع ليس من نوع التحميلات');
        }

        $validated = $request->validate([
            'platform' => 'required|string',
            'downloads_count' => 'required|integer|min:1',
            'revenue' => 'nullable|numeric|min:0'
        ]);

        $platformStat = $project->platformStats()->where('platform', $validated['platform'])->first();

        if ($platformStat) {
            // Update existing platform stats
            $platformStat->increment('downloads_count', $validated['downloads_count']);
            $platformStat->increment('revenue', $validated['revenue'] ?? 0);
        } else {
            // Create new platform stats
            $project->platformStats()->create([
                'platform' => $validated['platform'],
                'downloads_count' => $validated['downloads_count'],
                'revenue' => $validated['revenue'] ?? 0
            ]);
        }

        return back()->with('success', 'تمت إضافة الإحصائيات بنجاح');
    }
}
