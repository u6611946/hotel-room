'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import ProfileModal from '@/components/auth/ProfileModal';

function NavbarContent() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');

        setIsLoggedIn(!!loggedIn);

        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [pathname]);

    const isActive = (path) => pathname === path;

    const handleSwitchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    return (
        <nav className="bg-black text-white shadow-lg border-b-2 border-red-700">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center">
                        <h1 className="text-xl font-bold text-yellow-500 hover:text-yellow-400 transition">
                            🏨 Luxury Hotel
                        </h1>
                    </Link>

                    <div className="flex items-center space-x-1">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg transition ${
                                isActive('/')
                                    ? 'bg-red-700 text-yellow-400'
                                    : 'text-gray-300 hover:bg-red-900 hover:text-yellow-400'
                            }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/booking"
                            className={`px-4 py-2 rounded-lg transition ${
                                isActive('/booking')
                                    ? 'bg-red-700 text-yellow-400'
                                    : 'text-gray-300 hover:bg-red-900 hover:text-yellow-400'
                            }`}
                        >
                            Book Now
                        </Link>

                        {isLoggedIn ? (
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="px-4 py-2 rounded-lg transition flex items-center gap-2 text-gray-300 hover:bg-red-900 hover:text-yellow-400"
                            >
                                {user?.firstName || 'Profile'}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="px-4 py-2 rounded-lg transition text-gray-300 hover:bg-red-900 hover:text-yellow-400"
                                >
                                    Login
                                </button>

                                <button
                                    onClick={() => setShowRegisterModal(true)}
                                    className="px-4 py-2 rounded-lg transition border-2 text-yellow-400 border-yellow-400 hover:bg-red-900"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={handleSwitchToRegister}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={handleSwitchToLogin}
            />

            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </nav>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={null}>
            <NavbarContent />
        </Suspense>
    );
}