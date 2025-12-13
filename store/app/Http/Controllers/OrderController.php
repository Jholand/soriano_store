<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(): JsonResponse
    {
        $orders = Order::with('items.product')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:cash,gcash,card',
            'amount_paid' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'discount_type' => 'nullable|string|in:none,percentage,amount',
            'discount_value' => 'nullable|numeric|min:0',
            'discount_category' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();
        try {
            // Calculate subtotal
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }

            // Apply discount
            $discountAmount = $validated['discount'] ?? 0;
            $totalAmount = $subtotal - $discountAmount;

            // Validate amount paid
            if ($validated['amount_paid'] < $totalAmount) {
                return response()->json([
                    'message' => 'Insufficient payment amount'
                ], 422);
            }

            // Create order
            $order = Order::create([
                'customer_name' => $validated['customer_name'] ?? 'Walk-in Customer',
                'total_amount' => $totalAmount,
                'subtotal' => $subtotal,
                'discount' => $discountAmount,
                'discount_type' => $validated['discount_type'] ?? 'none',
                'discount_value' => $validated['discount_value'] ?? 0,
                'discount_category' => $validated['discount_category'] ?? null,
                'payment_method' => $validated['payment_method'],
                'amount_paid' => $validated['amount_paid'],
                'change_amount' => $validated['amount_paid'] - $totalAmount,
                'payment_status' => 'paid',
                'order_status' => 'completed',
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null
            ]);

            // Create order items and update stock
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity']
                ]);

                // Update product stock
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Order completed successfully',
                'order' => $order->load('items.product'),
                'change_amount' => $validated['amount_paid'] - $totalAmount
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): JsonResponse
    {
        return response()->json($order->load('orderItems.product'));
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|string|in:pending,completed,cancelled',
            'notes' => 'nullable|string'
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order): JsonResponse
    {
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
}
