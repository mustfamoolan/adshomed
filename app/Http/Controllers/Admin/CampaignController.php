<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Project;
use App\Models\MarketingType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CampaignController extends Controller
{
    /**
     * Display a listing of projects for campaign management.
     */
    public function index()
    {
        $projects = Project::withCount(['campaigns'])
            ->with(['campaigns' => function($query) {
                $query->selectRaw('project_id, count(*) as total_campaigns, sum(budget) as total_budget, sum(actual_cost) as total_spent')
                    ->groupBy('project_id');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        // حساب الإحصائيات لكل مشروع
        $projects->each(function($project) {
            $campaigns = Campaign::where('project_id', $project->id)->get();

            $project->campaigns_count = $campaigns->count();
            $project->active_campaigns = $campaigns->where('status', 'active')->count();
            $project->total_budget = $campaigns->sum('budget');
            $project->total_spent = $campaigns->sum('actual_cost');
        });

        return Inertia::render('Admin/Campaigns/Index', [
            'projects' => $projects
        ]);
    }

    /**
     * Show campaigns for a specific project.
     */
    public function projectCampaigns(Project $project)
    {
        $campaigns = Campaign::with(['marketingType'])
            ->forProject($project->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $marketingTypes = MarketingType::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Campaigns/ProjectCampaigns', [
            'project' => $project,
            'campaigns' => $campaigns,
            'marketingTypes' => $marketingTypes
        ]);
    }

    /**
     * Show the form for creating a new campaign.
     */
    public function create(Request $request)
    {
        $projectId = $request->query('project_id');
        $projects = Project::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Campaigns/Create', [
            'projects' => $projects,
            'selectedProjectId' => $projectId
        ]);
    }

    /**
     * Store a newly created campaign.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'marketing_type_key' => 'required|string|exists:marketing_types,key',
        ]);

        $campaign = Campaign::create($validated);

        return redirect()
            ->route('admin.campaigns.show', $campaign->project_id)
            ->with('success', 'تم إنشاء الحملة بنجاح');
    }

    /**
     * Display the specified project campaigns.
     */
    public function show(Project $project)
    {
        $campaigns = Campaign::with(['marketingType'])
            ->forProject($project->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $marketingTypes = MarketingType::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Campaigns/Show', [
            'project' => $project,
            'campaigns' => $campaigns,
            'marketingTypes' => $marketingTypes
        ]);
    }

    /**
     * Show the form for editing the specified campaign.
     */
    public function edit(Campaign $campaign)
    {
        $campaign->load(['project', 'marketingType']);
        $projects = Project::select('id', 'name')->orderBy('name')->get();
        $marketingTypes = MarketingType::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Campaigns/Edit', [
            'campaign' => $campaign,
            'projects' => $projects,
            'marketingTypes' => $marketingTypes
        ]);
    }

    /**
     * Update the specified campaign.
     */
    public function update(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'budget' => 'required|numeric|min:0',
            'marketing_type_key' => 'required|string|exists:marketing_types,key',
        ]);

        $campaign->update($validated);

        return redirect()->route('admin.campaigns.show', $campaign->project_id)
            ->with('success', 'تم تحديث الحملة بنجاح');
    }

    /**
     * Remove the specified campaign.
     */
    public function destroy(Campaign $campaign)
    {
        $projectId = $campaign->project_id;
        $campaign->delete();

        return redirect()
            ->route('admin.campaigns.show', $projectId)
            ->with('success', 'تم حذف الحملة بنجاح');
    }

    /**
     * Show campaign details with metrics and analytics.
     */
    public function details(Campaign $campaign)
    {
        $campaign->load(['project', 'marketingType']);

        // جلب البيانات اليومية مرتبة بالتاريخ
        $dailyMetrics = $campaign->dailyMetrics()
            ->orderBy('date')
            ->get();

        return Inertia::render('Admin/Campaigns/Details', [
            'campaign' => $campaign,
            'project' => $campaign->project,
            'marketingType' => $campaign->marketingType,
            'dailyMetrics' => $dailyMetrics
        ]);
    }

    /**
     * Update campaign metrics.
     */
    public function updateMetrics(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'metrics' => 'required|array'
        ]);

        $campaign->update([
            'metrics' => $validated['metrics']
        ]);

        return redirect()->route('admin.campaigns.details', $campaign)
            ->with('success', 'تم تحديث الإحصائيات بنجاح');
    }

    /**
     * Store or update daily metrics for a campaign.
     */
    public function storeDailyMetrics(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'metrics' => 'required|array'
        ]);

        $campaign->dailyMetrics()->updateOrCreate(
            ['date' => $validated['date']],
            ['metrics' => $validated['metrics']]
        );

        return redirect()->route('admin.campaigns.details', $campaign)
            ->with('success', 'تم حفظ البيانات اليومية بنجاح');
    }

    /**
     * Generate default daily metrics for campaign duration.
     */
    public function generateDailyMetrics(Campaign $campaign)
    {
        $startDate = $campaign->start_date;
        $endDate = $campaign->end_date;
        $currentDate = $startDate->copy();

        $defaultMetrics = [
            'impressions' => 0,
            'clicks' => 0,
            'reach' => 0,
            'ctr' => 0,
            'cpm' => 0,
            'cpc' => 0,
            'engagement' => 0,
            'conversions' => 0,
            'total_conversations' => 0,
            'customers_purchased' => 0,
            'customers_not_purchased' => 0,
        ];

        while ($currentDate <= $endDate) {
            $campaign->dailyMetrics()->updateOrCreate(
                ['date' => $currentDate->toDateString()],
                ['metrics' => $defaultMetrics]
            );
            $currentDate->addDay();
        }

        return redirect()->route('admin.campaigns.details', $campaign)
            ->with('success', 'تم إنشاء البيانات اليومية بنجاح');
    }
}
