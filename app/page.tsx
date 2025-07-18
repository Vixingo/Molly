"use client";

import Calendar23 from "@/components/calendar-23";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/hooks/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
            return;
        }
    }, [loading, user, router]);

    const CheckUser = () => {
        if (user) {
            router.push("/dashboard");
            return <p>Redirecting to dashboard...</p>;
        } else {
            router.push("/login");
            return <p>Redirecting to login...</p>;
        }
    };

    return (
        <>
            <p>Hello World</p>
            {loading ? (
                <p className="flex items-center justify-center position-absolute top-0 left-0 w-full h-full bg-amber-400">
                    Loading...
                </p>
            ) : (
                <p>Log in to continue</p>
            )}

            <Button onClick={CheckUser}>Go Dashboard</Button>

            <ModeToggle />
        </>
    );
}
