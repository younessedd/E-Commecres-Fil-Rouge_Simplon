<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->paginate(12);
        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        return response()->json($products, 200);
    }

    public function store(ProductRequest $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        $data = $request->validated();

        // 🔥 تأكد من رفع الصورة بشكل صحيح
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // احفظ في storage
            $path = $file->storeAs('products', $filename, 'public');
            $data['image'] = $path; // ستكون 'products/filename.jpg'
            
            \Log::info('Image uploaded', ['path' => $path]);
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        $product = Product::create($data);
        
        // 🔥 تأكد من تحميل العلاقات والعناصر المحسوبة
        $product->load('category');
        
        return response()->json($this->formatProductResponse($product), 201);
    }

    public function show(Product $product)
    {
        $product->load('category');
        return response()->json($this->formatProductResponse($product), 200);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $user = $request->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            // احذف الصورة القديمة
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $data['image'] = $path;
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . time();
        }

        $product->update($data);
        $product->load('category');
        
        return response()->json($this->formatProductResponse($product), 200);
    }

    public function destroy(Product $product)
    {
        $user = auth()->user();
        if ($user->role !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json(null, 204);
    }

    public function search(Request $request)
    {
        $query = $request->query('q');
        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->with('category')
            ->paginate(12);

        $products->getCollection()->transform(fn($p) => $this->formatProductResponse($p));
        return response()->json($products, 200);
    }

    // 🔥 الدالة المصححة بالكامل
    private function formatProductResponse($product)
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'price' => (float) $product->price,
            'stock' => (int) $product->stock,
            'category_id' => $product->category_id,
            'category' => $product->category,
            'image' => $product->image,
            'image_url' => $product->image_url, // 🔥 استخدم accessor من Model
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }
}