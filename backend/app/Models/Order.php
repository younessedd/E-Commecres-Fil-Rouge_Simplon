<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'total'];

    // كل طلب ينتمي إلى مستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // كل طلب يحتوي على عناصر (OrderItem)
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
