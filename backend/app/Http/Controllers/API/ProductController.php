<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // عرض جميع المنتجات مع روابط الصور
    public function index()
    {
        return response()->json(Product::with('category')->paginate(12), 200);
    }

    // إنشاء منتج جديد مع رفع الصورة
    public function store(ProductRequest $request)
    {
        $user = $request->user();

        // السماح فقط للمشرف (admin)
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();

        // رفع الصورة إذا تم إرسالها
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        // إنشاء slug تلقائي إذا لم يتم إرساله
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        $product = Product::create($data);

        // إعادة المنتج مع رابط الصورة
        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'category_id' => $product->category_id,
            'image_url' => $product->image_url,
        ], 201);
    }

    // عرض منتج واحد
    public function show(Product $product)
    {
        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'category_id' => $product->category_id,
            'image_url' => $product->image_url,
        ], 200);
    }

    // تحديث المنتج + رفع صورة جديدة
    public function update(ProductRequest $request, Product $product)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }

        $product->update($data);

        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'category_id' => $product->category_id,
            'image_url' => $product->image_url,
        ], 200);
    }

    // حذف المنتج
    public function destroy(Request $request, Product $product)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $product->delete();
        return response()->json(null, 204);
    }
}
