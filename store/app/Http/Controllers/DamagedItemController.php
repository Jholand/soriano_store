<?php

namespace App\Http\Controllers;

use App\Models\DamagedItem;
use App\Models\Product;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DamagedItemController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $query = DamagedItem::with(['product', 'reporter', 'reviewer'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Staff can only see their own reports
        if ($request->user()->role !== 'admin') {
            $query->where('reported_by', $request->user()->id);
        }

        $items = $query->paginate($request->get('per_page', 20));

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|in:damaged,expired,lost,other',
            'notes' => 'nullable|string',
        ]);

        // Check if product has enough stock
        $product = Product::findOrFail($request->product_id);
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Quantity exceeds available stock'
            ], 422);
        }

        $item = DamagedItem::create([
            'product_id' => $request->product_id,
            'reported_by' => auth()->id(),
            'quantity' => $request->quantity,
            'reason' => $request->reason,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        $this->logActivity(
            'created',
            'DamagedItem',
            $item->id,
            "Reported {$request->quantity} units of {$product->name} as {$request->reason}"
        );

        return response()->json($item->load(['product', 'reporter']), 201);
    }

    public function approve(Request $request, $id)
    {
        // Only admin can approve
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'review_notes' => 'nullable|string',
        ]);

        $item = DamagedItem::findOrFail($id);

        if ($item->status !== 'pending') {
            return response()->json([
                'message' => 'Item already reviewed'
            ], 422);
        }

        DB::transaction(function () use ($item, $request) {
            // Deduct from stock
            $product = $item->product;
            $product->decrement('stock', $item->quantity);

            // Update damaged item status
            $item->update([
                'status' => 'approved',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'review_notes' => $request->review_notes,
            ]);

            $this->logActivity(
                'approved',
                'DamagedItem',
                $item->id,
                "Approved removal of {$item->quantity} units of {$product->name}. Stock reduced to {$product->stock}"
            );
        });

        return response()->json($item->load(['product', 'reporter', 'reviewer']));
    }

    public function reject(Request $request, $id)
    {
        // Only admin can reject
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'review_notes' => 'required|string',
        ]);

        $item = DamagedItem::findOrFail($id);

        if ($item->status !== 'pending') {
            return response()->json([
                'message' => 'Item already reviewed'
            ], 422);
        }

        $item->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'review_notes' => $request->review_notes,
        ]);

        $this->logActivity(
            'rejected',
            'DamagedItem',
            $item->id,
            "Rejected damaged item report for {$item->product->name}"
        );

        return response()->json($item->load(['product', 'reporter', 'reviewer']));
    }
}
