import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import MobileBottomNav from '../Components/MobileBottomNav';
import CashierModal from '../Components/CashierModal';
import AuthModal from '../Components/AuthModal';
import StoreModal from '../Components/Modals/StoreModal';
import { DailyWheelModal } from '../Components/Modals/DailyWheelModal';
import BlockedAlertModal from '../Components/Modals/BlockedAlertModal';

export default function MainLayout({ children, currentCategory = 'All', searchQuery = '', setSearchQuery = () => {} }) {
    const { flash, auth } = usePage().props;
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isCashierOpen, setIsCashierOpen] = useState(false);
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [isWheelOpen, setIsWheelOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isBlockedAlertOpen, setIsBlockedAlertOpen] = useState(false);
    const [blockedNoticeData, setBlockedNoticeData] = useState(null);

    useEffect(() => {
        if (flash?.blocked_notice) {
            setBlockedNoticeData(flash.blocked_notice);
            setIsBlockedAlertOpen(true);
        } else if (auth?.user?.is_blocked || auth?.user?.status === 'blocked') {
            setBlockedNoticeData({
                name: auth.user.name,
                email: auth.user.email,
                case_number: 'CASE-' + new Date().getFullYear() + '-' + String(auth.user.id).padStart(4, '0') + '-SEC89A',
            });
            setIsBlockedAlertOpen(true);
        }

        // Open Auth modal if redirected from game launch or URL param
        if (!auth.user && typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const prompt = params.get('auth_prompt') || params.get('auth');
            if (prompt === 'register' || prompt === 'login') {
                setAuthMode(prompt);
                setIsAuthOpen(true);
            }
        }
    }, [flash?.blocked_notice, auth?.user?.is_blocked, auth?.user?.status]);

    const handleOpenAuth = (mode = 'login') => {
        setAuthMode(mode);
        setIsAuthOpen(true);
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-200 flex flex-col font-sans overflow-x-hidden">
            {/* Left Sidebar (Desktop Fixed + Mobile Offcanvas Drawer) */}
            <Sidebar
                currentCategory={currentCategory}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Header */}
            <Header
                onOpenAuth={handleOpenAuth}
                onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
                onOpenCashier={() => setIsCashierOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Main Content Area */}
            <main className="pl-0 lg:pl-64 pt-16 sm:pt-20 flex-1 flex flex-col min-h-screen pb-20 lg:pb-8 w-full max-w-full overflow-x-hidden">
                <div className="flex-1 w-full max-w-[86rem] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-16">
                    {children}
                </div>

                {/* Footer */}
                <Footer />
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav
                onOpenAuth={handleOpenAuth}
                onOpenStore={() => setIsStoreOpen(true)}
                onOpenWheel={() => setIsWheelOpen(true)}
                onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
                currentCategory={currentCategory}
            />

            {/* Modals */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                mode={authMode}
            />

            <CashierModal
                isOpen={isCashierOpen}
                onClose={() => setIsCashierOpen(false)}
            />

            <StoreModal
                isOpen={isStoreOpen}
                onClose={() => setIsStoreOpen(false)}
                user={auth.user}
                onOpenAuth={handleOpenAuth}
            />

            <DailyWheelModal
                isOpen={isWheelOpen}
                onClose={() => setIsWheelOpen(false)}
            />

            <BlockedAlertModal
                isOpen={isBlockedAlertOpen}
                onClose={() => setIsBlockedAlertOpen(false)}
                noticeData={blockedNoticeData}
            />
        </div>
    );
}


