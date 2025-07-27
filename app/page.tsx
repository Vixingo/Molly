"use client";

import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "@/api/client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(cats || []);
        setProducts(prods || []);
      } catch (e) {
        // handle error
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-4 max-w-6xl mx-auto">
      {/* Carousel */}
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-8">
        <span className="text-2xl font-bold text-primary">[Carousel Slider Placeholder]</span>
      </div>

      {/* Categories */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.length === 0 && <div className="text-muted-foreground">No categories found.</div>}
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center p-4 bg-card text-card-foreground rounded shadow-xs border border-border">
              {/* Replace with icon logic if you have icons */}
              <div className="w-12 h-12 bg-muted rounded-full mb-2 flex items-center justify-center">
                <span className="text-lg">{cat.icon || "📦"}</span>
              </div>
              <span>{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.product_count || 0} products</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 && <div className="text-muted-foreground">No products found.</div>}
          {products.map((prod) => (
            <div key={prod.id} className="bg-card text-card-foreground rounded shadow-xs border border-border p-4 flex flex-col">
              <div className="w-full h-40 bg-muted rounded mb-2 flex items-center justify-center">
                {prod.image && (prod.image.startsWith('http://') || prod.image.startsWith('https://')) ? (
                  <Image src={prod.image} alt={prod.name} width={160} height={160} className="object-contain max-h-36" />
                ) : (
                  <span className="text-muted-foreground">No Image</span>
                )}
              </div>
              <div className="font-semibold mb-1">{prod.name}</div>
              <div className="text-muted-foreground text-sm mb-2 line-clamp-2">{prod.description}</div>
              <div className="font-bold text-lg mb-2">${prod.price}</div>
              <Link href={`/dashboard/products/${prod.id}`} className="mt-auto bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90 text-center">View Product</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
