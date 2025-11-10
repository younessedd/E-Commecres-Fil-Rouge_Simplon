<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'price'];

    // كل عنصر طلب ينتمي إلى طلب واحد
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // كل عنصر طلب ينتمي إلى منتج واحد
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
