<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;

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

    // Checkout: تحويل السلة إلى طلب
    public function checkout(Request $request)
    {
        $cartItems = CartItem::where('user_id', $request->user()->id)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message'=>'Cart is empty'], 400);
        }

        $total = 0;
        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json(['message'=>'Not enough stock for '.$item->product->name], 400);
            }
            $total += $item->product->price * $item->quantity;
        }

        // إنشاء الطلب
        $order = Order::create([
            'user_id'=>$request->user()->id,
            'total'=>$total
        ]);

        // إنشاء عناصر الطلب وتحديث المخزون
        foreach ($cartItems as $item) {
            $order->items()->create([
                'product_id'=>$item->product->id,
                'quantity'=>$item->quantity,
                'price'=>$item->product->price
            ]);
            $item->product->decrement('stock', $item->quantity);
        }

        // تفريغ السلة بعد إنشاء الطلب
        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json(['message'=>'Checkout completed','order'=>$order->load('items.product')],201);
    }
}
