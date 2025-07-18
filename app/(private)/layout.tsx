"use client";
import React, { useEffect } from "react";
import useAuth from "@/hooks/Auth";
import { useRouter } from "next/navigation";

function PrivatePagesLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            router.push("/login");
        }
    }, [user, loading]);

    return <>{children}</>;
}

export default PrivatePagesLayout;
