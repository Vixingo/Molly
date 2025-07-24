"use client";
import React, { useEffect, useState, useRef } from "react";
import client, { fetchCategories } from "@/api/client";

export default function ProductsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setFilteredCategories(
      form.category
        ? categories.filter((cat) =>
            cat.name.toLowerCase().includes(form.category.toLowerCase())
          )
        : categories
    );
  }, [form.category, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (catName: string) => {
    setForm({ ...form, category: catName });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await client.storage.from('product-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    setUploading(false);
    if (error) throw error;
    // Get public URL
    const { data: publicUrlData } = client.storage.from('product-images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      // Check if category exists
      let categoryId = null;
      const existing = categories.find(
        (cat) => cat.name.toLowerCase() === form.category.trim().toLowerCase()
      );
      if (existing) {
        categoryId = existing.id;
      } else {
        // Insert new category
        const { data: newCat, error: catError } = await client
          .from("categories")
          .insert([{ name: form.category.trim() }])
          .select()
          .single();
        if (catError) throw catError;
        categoryId = newCat.id;
        setCategories((prev) => [...prev, newCat]);
      }
      // Insert product
      const { error } = await client.from("products").insert([
        {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          image: imageUrl,
          category_id: categoryId,
          stock: parseInt(form.stock, 10)
        }
      ]);
      if (error) throw error;
      setMessage("Product added successfully!");
      setForm({ name: "", description: "", price: "", category: "", stock: "" });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMessage(err.message || "Error adding product");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-card p-4 rounded shadow-xs border border-border">
        <div>
          <label className="block mb-1 font-medium text-primary">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-primary">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-primary">Price</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-primary">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
          />
          {imageFile && <div className="text-sm text-muted-foreground mt-1">Selected: {imageFile.name}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-primary">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            autoComplete="off"
            required
            className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
            placeholder="Type or select a category"
            list="category-suggestions"
          />
          <datalist id="category-suggestions">
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.name} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block mb-1 font-medium text-primary">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" />
        </div>
        <button type="submit" disabled={loading || uploading} className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50">
          {loading ? "Adding..." : uploading ? "Uploading image..." : "Add Product"}
        </button>
        {message && <div className="mt-2 text-center text-sm text-green-600">{message}</div>}
      </form>
    </div>
  );
} 