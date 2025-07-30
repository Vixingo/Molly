"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/context/CartProvider";
import { useCartSidebar } from "@/components/context/CartSidebarProvider";
import { Button } from "@/components/ui/button";

export function CartIcon() {
  const { getTotalItems } = useCart();
  const { openCartSidebar } = useCartSidebar();
  const totalItems = getTotalItems();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative"
      onClick={openCartSidebar}
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
} 