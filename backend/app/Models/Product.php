<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage; 

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'price', 'stock', 'category_id', 'image'
    ];
    
    protected $casts = [
        'price' => 'float',
        'stock' => 'integer'
    ];
    
    protected $appends = ['image_url'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getImageUrlAttribute()
    {
        $fallback = 'https://media.istockphoto.com/id/1071359118/vector/missing-image-vector-illustration-no-image-available-vector-concept.jpg?s=612x612&w=0&k=20&c=ukQmxO3tnUxz6mk7akh7aRCw_nyO9mmuvabs9FDPpfw=';

        // No image recorded in DB -> return fallback
        if (!$this->image) {
            return $fallback;
        }

        // Check if the file actually exists in storage/app/public
        if (Storage::disk('public')->exists($this->image)) {
            return Storage::url($this->image); // -> /storage/products/...
        }

        // File missing on disk -> return fallback
        return $fallback;
    }
}