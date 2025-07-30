"use client";

import React, { createContext, useContext, useState } from "react";

interface CartSidebarContextType {
  isCartSidebarOpen: boolean;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
  toggleCartSidebar: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(undefined);

export const useCartSidebar = () => {
  const context = useContext(CartSidebarContext);
  if (!context) {
    throw new Error("useCartSidebar must be used within a CartSidebarProvider");
  }
  return context;
};

export const CartSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  const openCartSidebar = () => setIsCartSidebarOpen(true);
  const closeCartSidebar = () => setIsCartSidebarOpen(false);
  const toggleCartSidebar = () => setIsCartSidebarOpen(!isCartSidebarOpen);

  const value = {
    isCartSidebarOpen,
    openCartSidebar,
    closeCartSidebar,
    toggleCartSidebar,
  };

  return (
    <CartSidebarContext.Provider value={value}>
      {children}
    </CartSidebarContext.Provider>
  );
}; 