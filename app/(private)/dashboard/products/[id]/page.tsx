"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import client, { fetchCategories } from "@/api/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const { data, error } = await client.from("products").select("*", { count: "exact" }).eq("id", id).single();
      if (data) {
        setProduct(data);
        if (data.category_id) {
          const cats = await fetchCategories();
          setCategory(cats.find((c: any) => c.id === data.category_id));
        }
      }
      setLoading(false);
    }
    if (id) loadProduct();
  }, [id]);

  const handleBuyNow = () => {
    toast.success("Redirecting to checkout...");
    // TODO: Implement direct checkout functionality
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!product) return <div className="p-8 text-center text-destructive">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card text-card-foreground rounded shadow-xs border border-border mt-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 w-full md:w-64 h-64 bg-muted rounded flex items-center justify-center">
          {product.image && (product.image.startsWith('http://') || product.image.startsWith('https://')) ? (
            <Image src={product.image} alt={product.name} width={256} height={256} className="object-contain max-h-60" />
          ) : (
            <span className="text-muted-foreground">No Image</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-primary mb-2">{product.name}</h1>
          <div className="text-muted-foreground mb-2">{product.description}</div>
          <div className="font-bold text-lg mb-2">${product.price}</div>
          <div className="mb-2">Stock: <span className="font-medium">{product.stock}</span></div>
          {category && <div className="mb-2">Category: <span className="font-medium">{category.name}</span></div>}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category_id: product.category_id
              }}
              className="flex-1"
              openCartOnAdd={true}
            />
            <Button 
              onClick={handleBuyNow}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 