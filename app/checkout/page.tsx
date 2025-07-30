"use client";

import { useState } from "react";
import { useCart } from "@/components/context/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { createOrder } from "@/api/client";
import { useRouter } from "next/navigation";

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    name: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Create order using the API function
      const orderData = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        total_amount: getTotalPrice(),
        status: "pending",
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }))
      };

      const order = await createOrder(orderData);

      toast.success("Order placed successfully!");
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to thank you page with order details
      const params = new URLSearchParams({
        orderId: order.id,
        customerName: form.name,
        totalAmount: getTotalPrice().toString()
      });
      
      router.push(`/thank-you?${params.toString()}`);
      
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checkout.
          </p>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete shipping address"
                    rows={4}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </div>
                  ) : (
                    `Place Order - $${getTotalPrice().toFixed(2)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-muted rounded flex items-center justify-center">
                      {item.image && (item.image.startsWith('http://') || item.image.startsWith('https://')) ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={48} 
                          height={48} 
                          className="object-contain rounded"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {/* Customer Info Preview */}
              {form.name && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Shipping To:</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Name:</strong> {form.name}</p>
                      <p><strong>Phone:</strong> {form.phone}</p>
                      <p><strong>Address:</strong> {form.address}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 