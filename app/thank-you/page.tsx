"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Package, Clock, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { fetchOrderById } from "@/api/client";

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const order = await fetchOrderById(orderId);
        setOrderDetails(order);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderId || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the order details."}
          </p>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                <p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded mt-1">
                  {orderDetails.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                <p className="text-lg mt-1">
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Customer Name</label>
                <p className="text-lg mt-1">{orderDetails.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  ${orderDetails.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Contact Information */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-lg mt-1">{orderDetails.customer_phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Shipping Address</label>
                  <p className="text-lg mt-1 whitespace-pre-line">{orderDetails.customer_address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-muted-foreground">
                  Your order is being processed and will be shipped to the address above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              What's Next?
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• You'll receive an order confirmation email shortly</li>
              <li>• We'll notify you when your order ships</li>
              <li>• Track your order using the Order ID above</li>
              <li>• Your order will be shipped to the address provided</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="flex-1">
              <Button className="w-full flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/dashboard/products" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 