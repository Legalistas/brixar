"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import Loading from "@/components/ui/Loading";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.role !== "CUSTOMER") {
            // Redirect non-customer users to an appropriate page
            router.push("/access-denied");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <Loading />; // Show loading component while session is loading
    }

    if (status !== "authenticated" || !session || session.user.role !== "CUSTOMER") {
        return null; // Do not render if unauthenticated or not a customer
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - hidden on mobile, shown on larger screens */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
