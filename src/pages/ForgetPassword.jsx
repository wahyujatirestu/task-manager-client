// ForgetPassword.jsx
import React, { useState } from 'react';
import { useRequestPasswordResetMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import Loading from '../components/Loader';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [requestPasswordReset, { isLoading }] =
        useRequestPasswordResetMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted with email:', email); // Debug log

        if (!email.trim()) {
            toast.error('Please enter your email.');
            return;
        }

        try {
            const response = await requestPasswordReset({ email }).unwrap();
            console.log('Server response:', response); // Debug log
            toast.success('Password reset link has been sent to your email.');
        } catch (error) {
            console.error('Error during API call:', error); // Debug log
            toast.error(
                error?.data?.message || 'Error sending password reset email.'
            );
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-center text-2xl font-bold text-blue-600 mb-4">
                    Forget Password
                </h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <Textbox
                        type="email"
                        placeholder="Enter your email"
                        value={email} // Bind value ke state
                        onChange={(e) => {
                            console.log(
                                'Textbox value changed:',
                                e.target.value
                            ); // Debug log
                            setEmail(e.target.value); // Perbarui state
                        }}
                        className="mb-4"
                        required
                    />

                    {isLoading ? (
                        <Loading />
                    ) : (
                        <Button
                            type="submit"
                            label="Send Reset Link"
                            className="w-full h-10 bg-blue-700 text-white rounded-full"
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
