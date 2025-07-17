"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import client from "@/api/client";
import { object } from "zod";

type UserType = {
    id: string;
    email: string;
};

type AuthProviderProps = {
    children: React.ReactNode;
};
type AuthContextType = {
    user: UserType | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.auth.getSession().then(({ data }) => {
            console.log("Initial session data:", data.session);
            if (data.session) {
                const sessionUser = data?.session?.user;
                setUser(
                    sessionUser
                        ? {
                              id: sessionUser.id,
                              email: sessionUser.email ?? "",
                          }
                        : null
                );
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        const { data: authListener } = client.auth.onAuthStateChange(
            async (event, session) => {
                console.log("Auth state changed:", event, session);
                if (session) {
                    const sessionUser = session.user;
                    setUser(
                        sessionUser
                            ? {
                                  id: sessionUser.id,
                                  email: sessionUser.email ?? "",
                              }
                            : null
                    );
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
