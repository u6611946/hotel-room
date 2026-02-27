'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const { confirmPassword, ...userData } = formData;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                onClose();
                router.refresh();
                window.location.reload();
            } else {
                setErrors({ submit: data.error || 'Registration failed' });
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ submit: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-red-900">Create Account</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-red-700 to-yellow-500 mt-2"></div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="John"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-700 hover:bg-red-800 text-yellow-400 font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-red-700 hover:text-red-800 font-semibold"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
