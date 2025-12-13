<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderRepository
{
    public function create(array $orderData, array $items)
    {
        return DB::transaction(function () use ($orderData, $items) {
            $order = Order::create($orderData);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price']
                ]);
            }

            return $order->load('items');
        });
    }

    public function find($id)
    {
        return Order::with('items.product', 'user')->findOrFail($id);
    }

    public function update(Order $order, array $orderData)
    {
        return DB::transaction(function () use ($order, $orderData) {
            $order->update($orderData);
            return $order->fresh();
        });
    }

    public function delete(Order $order)
    {
        return $order->delete();
    }

    public function listOrders($perPage = 10)
    {
        return Order::with('items.product', 'user')
            ->latest()
            ->paginate($perPage);
    }

    public function updateStatus(Order $order, string $status)
    {
        return $order->update(['order_status' => $status]);
    }

    public function updatePaymentStatus(Order $order, string $status)
    {
        return $order->update(['payment_status' => $status]);
    }
}