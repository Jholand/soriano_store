<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesTransaction extends Model
{
    protected $fillable = [
        'transaction_code',
        'user_id',
        'subtotal',
        'discount',
        'tax',
        'total',
        'payment_method',
        'amount_paid',
        'change',
        'discount_rule_id',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(SalesTransactionItem::class);
    }

    public function discountRule()
    {
        return $this->belongsTo(DiscountRule::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (!$transaction->transaction_code) {
                $transaction->transaction_code = 'TXN-' . date('YmdHis') . '-' . rand(1000, 9999);
            }
        });
    }
}
