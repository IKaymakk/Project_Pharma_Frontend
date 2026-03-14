import { Outlet } from "react-router-dom";
import { Header } from "./Header"; // 👈 Eski TopBar ve NavBar'ı sildik, yeni canavarımızı çağırdık!
import { Footer } from "./Footer";

export function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            <Header />

            <main className="flex-1 w-full flex flex-col">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}