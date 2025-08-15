<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerNote;
use App\Models\CustomerActivity;
use App\Models\CustomerRequest;
use App\Models\Project;
use App\Models\ClientProject;
use App\Models\ProjectSubscriptionPlan;
use App\Models\ProjectSubscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customer::with(['project', 'clientProject'])
            ->withCount(['notes', 'requests']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('source', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by project
        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $customers = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status', 'project_id', 'date_from', 'date_to', 'sort', 'direction']),
            'projects' => Project::select('id', 'name')->get(),
            'statusOptions' => Customer::getStatusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Customers/Create', [
            'projects' => Project::select('id', 'name', 'type')->get(),
            'clientProjects' => ClientProject::select('id', 'name', 'client_name')->get(),
            'statusOptions' => Customer::getStatusOptions(),
            'customerTypeOptions' => Customer::getCustomerTypeOptions(),
            'projectTypeOptions' => Customer::getProjectTypeOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:customers,phone',
            'customer_type' => 'required|in:service_request,our_project_client,client_project_owner',
            'project_id' => 'nullable|exists:projects,id',
            'client_project_id' => 'nullable|exists:client_projects,id',
            'subscription_type' => 'nullable|in:sale,subscription,download',
            'status' => 'required|in:' . implode(',', array_keys(Customer::getStatusOptions())),
            'source' => 'nullable|string|max:255',
            'initial_notes' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        // Handle different customer types
        $this->handleCustomerTypeSetup($customer, $request);

        // Add initial note if provided
        if ($request->filled('initial_notes')) {
            $user = auth()->user();
            $userId = $user ? $user->id : 1;

            CustomerNote::create([
                'customer_id' => $customer->id,
                'user_id' => $userId,
                'type' => 'general',
                'title' => 'ملاحظة أولية',
                'content' => $request->initial_notes,
                'is_important' => false,
            ]);
        }

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم إضافة العميل بنجاح');
    }

    /**
     * Handle customer type specific setup
     */
    private function handleCustomerTypeSetup(Customer $customer, Request $request)
    {
        switch ($customer->customer_type) {
            case Customer::TYPE_SERVICE_REQUEST:
                // Automatically create a service request
                $customer->requests()->create([
                    'type' => 'خدمة عامة',
                    'description' => 'طلب خدمة جديد من العميل',
                    'status' => 'pending',
                ]);
                break;

            case Customer::TYPE_OUR_PROJECT_CLIENT:
                // No automatic activation code generation
                // Will be added manually from customer page
                break;

            case Customer::TYPE_CLIENT_PROJECT_OWNER:
                // No special setup needed
                break;
        }
    }    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $customer->load([
            'project',
            'clientProject',
            'notes.user',
            'activities.user',
            'requests.clientProject',
            'subscriptions.subscriptionPlan.project'
        ]);

        $notes = $customer->notes()->with('user')->latest()->get();
        $activities = $customer->activities()->with('user')->latest()->get();
        $requests = $customer->requests()->with('clientProject')->latest()->get();
        $subscriptions = $customer->subscriptions()->with('subscriptionPlan.project')->latest()->get();

        // Get available subscription plans for the customer's project
        $availableSubscriptionPlans = collect();
        if ($customer->project_id && $customer->customer_type === Customer::TYPE_OUR_PROJECT_CLIENT && $customer->subscription_type === Customer::PROJECT_TYPE_SUBSCRIPTION) {
            $availableSubscriptionPlans = ProjectSubscriptionPlan::where('project_id', $customer->project_id)
                ->where('is_active', true)
                ->get();
        }

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
            'notes' => $notes,
            'activities' => $activities,
            'requests' => $requests,
            'subscriptions' => $subscriptions,
            'availableSubscriptionPlans' => $availableSubscriptionPlans,
            'projects' => Project::select('id', 'name', 'type')->get(),
            'clientProjects' => ClientProject::select('id', 'name', 'client_name')->get(),
            'statusOptions' => Customer::getStatusOptions(),
            'customerTypeOptions' => Customer::getCustomerTypeOptions(),
            'projectTypeOptions' => Customer::getProjectTypeOptions(),
            'subscriptionStatusOptions' => ProjectSubscription::getStatusOptions(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        return Inertia::render('Admin/Customers/Edit', [
            'customer' => $customer,
            'projects' => Project::select('id', 'name', 'type')->get(),
            'clientProjects' => ClientProject::select('id', 'name', 'client_name')->get(),
            'statusOptions' => Customer::getStatusOptions(),
            'customerTypeOptions' => Customer::getCustomerTypeOptions(),
            'projectTypeOptions' => Customer::getProjectTypeOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:customers,phone,' . $customer->id,
            'customer_type' => 'required|in:service_request,our_project_client,client_project_owner',
            'project_id' => 'nullable|exists:projects,id',
            'client_project_id' => 'nullable|exists:client_projects,id',
            'subscription_type' => 'nullable|in:sale,subscription,download',
            'status' => 'required|in:' . implode(',', array_keys(Customer::getStatusOptions())),
            'source' => 'nullable|string|max:255',
            'activation_code' => 'nullable|string|max:50',
            'download_id' => 'nullable|string|max:100',
        ]);

        $oldStatus = $customer->status;
        $oldCustomerType = $customer->customer_type;

        $customer->update($validated);

        // Handle customer type changes
        if ($oldCustomerType !== $customer->customer_type) {
            $this->handleCustomerTypeSetup($customer, $request);
        }

        // Handle status changes
        if ($oldStatus !== $customer->status) {
            // Generate activation code if became subscriber
            if ($customer->status === 'subscriber' && !$customer->activation_code) {
                $activationCode = strtoupper(Str::random(8));
                $customer->update(['activation_code' => $activationCode]);
            }

            // Add status change note
            $user = auth()->user();
            $userId = $user ? $user->id : 1;

            CustomerNote::create([
                'customer_id' => $customer->id,
                'user_id' => $userId,
                'type' => 'status_change',
                'title' => 'تغيير حالة العميل',
                'content' => "تم تغيير حالة العميل من {$oldStatus} إلى {$customer->status}",
                'is_important' => false,
            ]);
        }

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم تحديث بيانات العميل بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('admin.customers.index')
            ->with('success', 'تم حذف العميل بنجاح');
    }

    /**
     * Add a note to customer
     */
    public function storeNote(Request $request, Customer $customer)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'is_important' => 'boolean',
        ]);

        // Get the authenticated user's actual ID from the database
        $user = auth()->user();
        $userId = $user ? $user->id : 1; // Fallback to user ID 1 if auth fails

        $customer->notes()->create([
            'type' => 'general',
            'title' => 'ملاحظة عامة',
            'content' => $request->content,
            'is_important' => $request->boolean('is_important'),
            'user_id' => $userId,
        ]);

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم إضافة الملاحظة بنجاح');
    }

    /**
     * Add a request to customer
     */
    public function storeRequest(Request $request, Customer $customer)
    {
        $request->validate([
            'type' => 'required|string|max:100',
            'description' => 'required|string|max:1000',
            'client_project_id' => 'nullable|exists:client_projects,id',
            'status' => 'in:pending,in_progress,completed,cancelled',
        ]);

        $customer->requests()->create([
            'type' => $request->type,
            'description' => $request->description,
            'client_project_id' => $request->client_project_id,
            'status' => $request->status ?? 'pending',
        ]);

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم إضافة الطلب بنجاح');
    }

    /**
     * Generate new activation code
     */
    public function generateActivationCode(Customer $customer)
    {
        $activationCode = strtoupper(Str::random(8));

        $customer->update([
            'activation_code' => $activationCode
        ]);

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم إنشاء كود التفعيل: ' . $activationCode);
    }

    /**
     * Update download ID for download type customers
     */
    public function updateDownloadId(Request $request, Customer $customer)
    {
        $request->validate([
            'download_id' => 'required|string|max:100',
        ]);

        $customer->update([
            'download_id' => $request->download_id
        ]);

        // Add note about download ID update
        $user = auth()->user();
        $userId = $user ? $user->id : 1;

        CustomerNote::create([
            'customer_id' => $customer->id,
            'user_id' => $userId,
            'type' => 'system',
            'title' => 'تحديث معرف التحميل',
            'content' => "تم تحديث معرف التحميل إلى: {$request->download_id}",
            'is_important' => false,
        ]);

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم تحديث معرف التحميل بنجاح');
    }

    /**
     * Add subscription to customer
     */
    public function addSubscription(Request $request, Customer $customer)
    {
        $request->validate([
            'project_subscription_plan_id' => 'required|exists:project_subscription_plans,id',
            'activation_code' => 'nullable|string',
            'status' => 'in:pending,active,expired,cancelled',
            'started_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:started_at',
            'notes' => 'nullable|string|max:1000',
        ]);

        // تحقق من كود التفعيل إذا تم تمريره
        if ($request->activation_code) {
            $request->validate([
                'activation_code' => 'unique:project_subscriptions,activation_code',
            ]);
        }

        $subscription = $customer->subscriptions()->create([
            'project_subscription_plan_id' => $request->project_subscription_plan_id,
            'activation_code' => $request->activation_code ? strtoupper($request->activation_code) : null,
            'status' => $request->status ?? 'pending',
            'started_at' => $request->started_at ? now()->parse($request->started_at) : null,
            'expires_at' => $request->expires_at ? now()->parse($request->expires_at) : null,
            'notes' => $request->notes,
        ]);

        // Update subscription plan counter
        $subscriptionPlan = ProjectSubscriptionPlan::find($request->project_subscription_plan_id);
        $subscriptionPlan->increment('subscribers_count');

        // Add activity about subscription
        $user = auth()->user();
        $userId = $user ? $user->id : 1;

        // إنشاء محتوى النشاط بناءً على وجود كود التفعيل
        $activityDescription = "تم إضافة اشتراك جديد: {$subscriptionPlan->plan_name}";
        if ($subscription->activation_code) {
            $activityDescription .= " - كود التفعيل: {$subscription->activation_code}";
        }

        CustomerActivity::create([
            'customer_id' => $customer->id,
            'user_id' => $userId,
            'type' => CustomerActivity::TYPE_SUBSCRIPTION_ADDED,
            'title' => 'إضافة اشتراك جديد',
            'description' => $activityDescription,
            'meta_data' => [
                'subscription_id' => $subscription->id,
                'plan_name' => $subscriptionPlan->plan_name,
                'activation_code' => $subscription->activation_code,
                'status' => $subscription->status,
            ],
        ]);

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم إضافة الاشتراك بنجاح');
    }

    /**
     * Update subscription status
     */
    public function updateSubscriptionStatus(Request $request, Customer $customer, ProjectSubscription $subscription)
    {
        $request->validate([
            'status' => 'required|in:pending,active,expired,cancelled',
        ]);

        $oldStatus = $subscription->status;
        $subscription->update([
            'status' => $request->status
        ]);

        // Add activity about status change
        $user = auth()->user();
        $userId = $user ? $user->id : 1;

        // الحصول على تسميات الحالات
        $subscriptionStatusOptions = [
            'pending' => 'قيد الانتظار',
            'active' => 'نشط',
            'expired' => 'منتهي الصلاحية',
            'cancelled' => 'ملغي'
        ];

        CustomerActivity::create([
            'customer_id' => $customer->id,
            'user_id' => $userId,
            'type' => CustomerActivity::TYPE_SUBSCRIPTION_STATUS_CHANGED,
            'title' => 'تغيير حالة الاشتراك',
            'description' => "تم تغيير حالة الاشتراك من {$subscriptionStatusOptions[$oldStatus]} إلى {$subscriptionStatusOptions[$request->status]}",
            'meta_data' => [
                'subscription_id' => $subscription->id,
                'old_status' => $oldStatus,
                'new_status' => $request->status,
            ],
        ]);

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'تم تحديث حالة الاشتراك بنجاح');
    }
}
