<?php

namespace App\Http\Controllers;

use App\Models\SalesTransaction;
use App\Models\SalesTransactionItem;
use App\Models\Product;
use App\Models\DiscountRule;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesTransactionController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $query = SalesTransaction::with(['user', 'items.product', 'discountRule'])
            ->orderBy('created_at', 'desc');

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Staff can only see their own transactions
        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        // Filter by user
        if ($request->has('user_id') && $request->user()->role === 'admin') {
            $query->where('user_id', $request->user_id);
        }

        $transactions = $query->paginate($request->get('per_page', 20));

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'amount_paid' => 'required|numeric|min:0',
            'discount_rule_id' => 'nullable|exists:discount_rules,id',
        ]);

        return DB::transaction(function () use ($request) {
            $subtotal = 0;
            $items = [];

            // Calculate subtotal and prepare items
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                $itemSubtotal = $product->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            // Calculate discount
            $discount = 0;
            if ($request->discount_rule_id) {
                $discountRule = DiscountRule::findOrFail($request->discount_rule_id);
                if ($discountRule->isValid()) {
                    if (!$discountRule->min_purchase || $subtotal >= $discountRule->min_purchase) {
                        $discount = $discountRule->calculateDiscount($subtotal);
                    }
                }
            }

            // Calculate tax (assuming 0% for now, can be configured)
            $tax = 0;

            // Calculate total
            $total = $subtotal - $discount + $tax;

            // Calculate change
            $change = $request->amount_paid - $total;

            if ($change < 0) {
                throw new \Exception('Insufficient payment');
            }

            // Create transaction
            $transaction = SalesTransaction::create([
                'user_id' => auth()->id(),
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'amount_paid' => $request->amount_paid,
                'change' => $change,
                'discount_rule_id' => $request->discount_rule_id,
            ]);

            // Create transaction items and update stock
            foreach ($items as $item) {
                SalesTransactionItem::create([
                    'sales_transaction_id' => $transaction->id,
                    ...$item
                ]);

                Product::find($item['product_id'])->decrement('stock', $item['quantity']);
            }

            $this->logActivity(
                'created',
                'SalesTransaction',
                $transaction->id,
                "Processed sale {$transaction->transaction_code} - Total: ₱{$total}"
            );

            return response()->json($transaction->load(['items.product', 'discountRule']), 201);
        });
    }

    public function show($id)
    {
        $transaction = SalesTransaction::with(['user', 'items.product', 'discountRule'])
            ->findOrFail($id);

        // Staff can only view their own transactions
        if (auth()->user()->role !== 'admin' && $transaction->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($transaction);
    }
}
