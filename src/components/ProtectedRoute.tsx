import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<"loading" | "authed" | "unauthed">("loading");

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ? "authed" : "unauthed");
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ? "authed" : "unauthed");
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    if (session === "loading") return (
        <div style={{
            minHeight: "100vh", background: "#080c14",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa"
        }}>
            Loading...
        </div>
    );

    if (session === "unauthed") return <Navigate to="/login" replace />;

    return <>{children}</>;
}