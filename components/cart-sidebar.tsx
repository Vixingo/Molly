"use client";

import { useCart } from "@/components/context/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    clearCart 
  } = useCart();
  const router = useRouter();

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      toast.success("Item removed from cart");
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(`${name} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    onClose(); // Close the sidebar
    router.push("/checkout"); // Navigate to checkout page
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              {items.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                  {items.length}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">
                  Add some items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-muted rounded flex items-center justify-center">
                          {item.image && (item.image.startsWith('http://') || item.image.startsWith('https://')) ? (
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              width={64} 
                              height={64} 
                              className="object-contain rounded"
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">No Image</span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-muted-foreground text-sm">${item.price.toFixed(2)}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-6 h-6"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-6 h-6"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total & Remove */}
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="w-6 h-6 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCheckout}
                  size="lg"
                  className="flex-1 h-12 text-base font-semibold"
                >
                  Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-destructive hover:text-destructive h-12"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 