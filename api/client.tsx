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

// Fetch order by ID
export async function fetchOrderById(orderId: string) {
    const { data, error } = await client
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
    
    if (error) throw error;
    return data;
}

// Create a new order with order items
export async function createOrder(orderData: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    total_amount: number;
    status: string;
    items: Array<{
        product_id: string;
        name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }>;
}) {
    // First, create the order
    const { data: order, error: orderError } = await client
        .from('orders')
        .insert([{
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            customer_address: orderData.customer_address,
            total_amount: orderData.total_amount,
            status: orderData.status
        }])
        .select()
        .single();
    
    if (orderError) throw orderError;

    // Then, create the order items
    const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
    }));

    const { error: itemsError } = await client
        .from('order_items')
        .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return order;
}
