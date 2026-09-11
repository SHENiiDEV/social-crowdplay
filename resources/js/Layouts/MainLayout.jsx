import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CashierModal from '../Components/CashierModal';
import AuthModal from '../Components/AuthModal';
import BlockedAlertModal from '../Components/Modals/BlockedAlertModal';

export default function MainLayout({ children, currentCategory = 'All', searchQuery = '', setSearchQuery = () => {} }) {
    const { flash, auth } = usePage().props;
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isCashierOpen, setIsCashierOpen] = useState(false);
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Left Sidebar */}
            <Sidebar currentCategory={currentCategory} />

            {/* Header */}
            <Header
                onOpenAuth={handleOpenAuth}
                onOpenCashier={() => setIsCashierOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Main Content Area */}
            <main className="pl-64 pt-20 flex-1 flex flex-col min-h-screen">
                <div className="flex-1 p-8">
                    {children}
                </div>

                {/* Footer */}
                <Footer />
            </main>

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

            <BlockedAlertModal
                isOpen={isBlockedAlertOpen}
                onClose={() => setIsBlockedAlertOpen(false)}
                noticeData={blockedNoticeData}
            />
        </div>
    );
}

