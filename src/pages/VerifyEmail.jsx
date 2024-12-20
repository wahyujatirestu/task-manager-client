import React, { useEffect, useState } from 'react';
import { useVerifyEmailQuery } from '../redux/slices/api/authApiSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [countdown, setCountdown] = useState(3); // Tambahkan state untuk countdown

    const id = searchParams.get('id'); // Ambil ID dari query string
    const token = searchParams.get('token'); // Ambil Token dari query string

    console.log('ID:', id);
    console.log('Token:', token);

    // Format query string
    const queryString = id && token ? `id=${id}&token=${token}` : null;

    // Panggil API hanya jika query string valid
    const { data, error, isLoading } = useVerifyEmailQuery(
        { queryString }, // Kirim queryString ke Redux query
        { skip: !queryString } // Skip jika queryString tidak valid
    );

    useEffect(() => {
        if (isLoading) {
            setStatusMessage('Verifying, please wait...');
        } else if (error) {
            console.error('Error:', error);
            setStatusMessage(
                error?.data?.message ||
                    'Something went wrong. Please try again.'
            );
        } else if (data) {
            console.log('Data received:', data);
            if (data.status) {
                setIsVerified(true);
                setStatusMessage('Your email has been successfully verified!');

                // Mulai countdown sebelum redirect
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval); // Hentikan interval saat countdown selesai
                            navigate('/login'); // Redirect ke login
                            return 0;
                        }
                        return prev - 1; // Kurangi countdown
                    });
                }, 1000);

                return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
            } else {
                setStatusMessage(data.message || 'Verification failed.');
            }
        }
    }, [data, error, isLoading, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Email Verification
                </h2>
                <div
                    className={`text-gray-700 ${
                        isVerified ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {statusMessage}
                </div>
                {isVerified && countdown > 0 && (
                    <p className="text-green-600 mt-4">
                        Redirecting to login page in {countdown} seconds...
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
