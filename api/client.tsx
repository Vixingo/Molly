import { createClient } from "@supabase/supabase-js";

const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default client;

// Fetch all products
export async function fetchProducts() {
    const { data, error } = await client.from('products').select('*');
    if (error) throw error;
    return data;
}

// Fetch all categories
export async function fetchCategories() {
    const { data, error } = await client.from('categories').select('*');
    if (error) throw error;
    return data;
}

// Fetch all orders
export async function fetchOrders() {
    const { data, error } = await client.from('orders').select('*');
    if (error) throw error;
    return data;
}
