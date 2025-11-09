<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;

class CartController extends Controller
{
    // عرض محتويات السلة
    public function index(Request $request)
    {
        $cart = CartItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        return response()->json($cart);
    }

    // إضافة منتج للسلة
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = CartItem::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
            ],
            [
                'quantity' => $request->quantity,
            ]
        );

        return response()->json($item, 201);
    }

    // حذف منتج من السلة
    public function destroy(Request $request, $id)
    {
        $item = CartItem::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $item->delete();
        return response()->json(['message' => 'Deleted'], 204);
    }

    // تفريغ السلة كاملة
    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
