import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useResendVerificationEmailMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';

const ResendVerification = () => {
    const [isSent, setIsSent] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [resendVerificationEmail, { isLoading }] =
        useResendVerificationEmailMutation();

    const onSubmit = async (data) => {
        try {
            const result = await resendVerificationEmail(data.email).unwrap();
            toast.success(result.message || 'Verification email sent.');
            setIsSent(true); // Tandai bahwa email telah berhasil dikirim
        } catch (error) {
            toast.error(error?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            {!isSent ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white p-8 shadow-md rounded-md">
                    <h1 className="text-2xl font-bold mb-4">
                        Resend Verification
                    </h1>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                        placeholder="Enter your email"
                        className="w-full border rounded px-3 py-2 mb-4"
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded"
                        disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Resend Email'}
                    </button>
                </form>
            ) : (
                <div className="bg-white p-8 shadow-md rounded-md text-center">
                    <h1 className="text-2xl font-bold mb-4">Email Sent</h1>
                    <p className="text-gray-600">
                        A verification email has been sent to your email
                        address. Please check your inbox or spam folder.
                    </p>
                    <button
                        onClick={() => setIsSent(false)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Send Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResendVerification;
