// ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import Textbox from '../components/Textbox';
import Button from '../components/Button';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        try {
            await resetPassword({
                token,
                newPassword: password,
                confirmNewPassword: confirmPassword,
            }).unwrap();
            toast.success('Password has been reset. You can now login.');
            navigate('/login');
        } catch (error) {
            toast.error(error?.data?.message || 'Error resetting password.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-center text-2xl font-bold text-blue-600 mb-4">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <Textbox
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4"
                        required
                    />
                    <Textbox
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mb-4"
                        required
                    />
                    <Button
                        type="submit"
                        label="Reset Password"
                        className="w-full bg-blue-600 text-white"
                        disabled={isLoading}
                    />
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
