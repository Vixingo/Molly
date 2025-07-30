"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/context/CartProvider";
import { useCartSidebar } from "@/components/context/CartSidebarProvider";
import { toast } from "sonner";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category_id?: string;
  };
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  openCartOnAdd?: boolean;
}

export function AddToCartButton({ 
  product, 
  variant = "default", 
  size = "default",
  className = "",
  openCartOnAdd = false
}: AddToCartButtonProps) {
  const { addToCart, getItemQuantity } = useCart();
  const { openCartSidebar } = useCartSidebar();
  const [isAdding, setIsAdding] = useState(false);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
      
      // Optionally open cart sidebar
      if (openCartOnAdd) {
        openCartSidebar();
      }
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant={variant}
      size={size}
      className={className}
    >
      {isAdding ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Adding...
        </div>
      ) : quantity > 0 ? (
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          In Cart ({quantity})
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </div>
      )}
    </Button>
  );
} 