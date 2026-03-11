import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Navbar } from "./NavBar";
import { Footer } from "./Footer";

export function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <TopBar />
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}