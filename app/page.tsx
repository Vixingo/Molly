"use client";

import Calendar23 from "@/components/calendar-23";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/hooks/Auth";
import { useRouter } from "next/navigation";
export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!loading && user) {
        router.push("/dashboard");
        return <p>Redirecting to dashboard...</p>;
    }

    return (
        <>
            <p>Hello World</p>
            {loading ? <p>Loading...</p> : <p>Log in to continue</p>}
            <Link href="/dashboard">
                <Button>Click me</Button>
            </Link>
            <ModeToggle />
        </>
    );
}
