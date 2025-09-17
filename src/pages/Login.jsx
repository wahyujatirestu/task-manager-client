import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
    useLoginMutation,
    useRegisterMutation,
} from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { setCredentials } from '../redux/slices/authSlice';
import Loading from '../components/Loader';
import {
    FaEye,
    FaEyeSlash,
    FaUser,
    FaLock,
    FaEnvelope,
    FaGoogle,
    FaBriefcase,
} from 'react-icons/fa';

const Login = () => {
    const { user } = useSelector((state) => state.auth);
    const {
        handleSubmit,
        formState: { errors },
        register,
        watch,
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [registerUser, { isLoading: isLoadingRegister }] =
        useRegisterMutation();
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [showPasswordSignup, setShowPasswordSignup] = useState(false);
    const [showConfirmPasswordSignup, setShowConfirmPasswordSignup] =
        useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const [isRegistered, setIsRegistered] = useState(false);

    const submitHandler = async (data) => {
        try {
            if (activeTab === 'login') {
                const result = await login(data).unwrap();
                dispatch(setCredentials(result));
                navigate('/');
            } else if (activeTab === 'signup') {
                const result = await registerUser(data).unwrap();
                dispatch(setCredentials(result));
                navigate('/resend-verification');
                toast.success(
                    result.message ||
                        'Registration successful! Please check your email to verify your account.'
                );
                setIsRegistered(true);
            }
        } catch (error) {
            if (error?.data?.message === 'Email is not verified.') {
                toast.error(
                    'Your email has not been verified yet. Please verify your email first.'
                );
            } else {
                toast.error(
                    error?.data?.message ||
                        'An error occurred. Please try again.'
                );
            }
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                {/* left side */}
                <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
                    <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10">
                        <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
                            Manage all your tasks in one place!
                        </span>
                        <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                            <span>Jastrate</span>
                            <span>Task Manager</span>
                        </p>
                    </div>
                </div>

                {/* right side */}
                <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
                    <div className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-12 pb-12">
                        <div className="-mt-4">
                            <p className="text-blue-600 text-3xl font-bold text-center">
                                Welcome!
                            </p>
                        </div>

                        <div className="flex justify-between border-b mb-2 -mt-5   ">
                            <button
                                className={`w-1/2 text-center py-2 font-semibold transition-all border-b-2 ${
                                    activeTab === 'login'
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-gray-500 border-transparent'
                                }`}
                                onClick={() => setActiveTab('login')}>
                                Login
                            </button>
                            <button
                                className={`w-1/2 text-center py-2 font-semibold transition-all border-b-2 ${
                                    activeTab === 'signup'
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-gray-500 border-transparent'
                                }`}
                                onClick={() => setActiveTab('signup')}>
                                Sign Up
                            </button>
                        </div>

                        {activeTab === 'login' && (
                            <form
                                onSubmit={handleSubmit(submitHandler)}
                                className="flex flex-col gap-y-5">
                                <div className=" w-full -mt-2">
                                    <FaUser className="relative top-[1.8rem] left-4 text-gray-400" />
                                    <Textbox
                                        placeholder="Email or Username"
                                        type="text"
                                        name="identifier"
                                        className="w-full rounded-full pl-10"
                                        register={register('identifier', {
                                            required:
                                                'Email or Username is required!',
                                        })}
                                        error={
                                            errors.identifier
                                                ? errors.identifier.message
                                                : ''
                                        }
                                    />
                                </div>

                                <div className="w-full -mt-2 relative">
                                    <FaLock className="relative top-[1.8rem] left-4 text-gray-400" />
                                    <div
                                        className="absolute right-4 w-fit top-8 flex items-center cursor-pointer"
                                        onClick={() =>
                                            setShowPasswordLogin(
                                                !showPasswordLogin
                                            )
                                        }>
                                        {showPasswordLogin ? (
                                            <FaEyeSlash className="text-gray-500 ml-auto" />
                                        ) : (
                                            <FaEye className="text-gray-500 ml-auto" />
                                        )}
                                    </div>
                                    <Textbox
                                        placeholder="Password"
                                        type={
                                            showPasswordLogin
                                                ? 'text'
                                                : 'password'
                                        }
                                        name="password"
                                        className="w-full rounded-full pl-10"
                                        register={register('password', {
                                            required: 'Password is required!',
                                        })}
                                        error={
                                            errors.password
                                                ? errors.password.message
                                                : ''
                                        }
                                    />
                                </div>

                                <span
                                    className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
                                    onClick={() =>
                                        navigate('/forget-password')
                                    }>
                                    Forget Password?
                                </span>

                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <Button
                                        type="submit"
                                        label="Submit"
                                        className="w-full h-10 bg-blue-700 text-white rounded-full"
                                    />
                                )}

                                {/* <div className="flex items-center">
                                    <hr className="w-full border-gray-300" />
                                    <span className="px-4 text-gray-500 text-sm">
                                        or
                                    </span>
                                    <hr className="w-full border-gray-300" />
                                </div>

                                <button
                                    type="button"
                                    className="w-full h-10 bg-red-500 text-white rounded-full flex items-center justify-center gap-2"
                                    onClick={() =>
                                        toast.info(
                                            'Google login is not implemented yet!'
                                        )
                                    }>
                                    <FaGoogle />
                                    Login with Google
                                </button> */}
                            </form>
                        )}

                        {activeTab === 'signup' && (
                            <form
                                onSubmit={handleSubmit(submitHandler)}
                                className="flex flex-col gap-y-5 -mt-2">
                                <div className="w-full -mt-2">
                                    <FaEnvelope className="relative top-[1.8rem] left-4 text-gray-400" />
                                    <Textbox
                                        placeholder="Email"
                                        type="email"
                                        name="email"
                                        className="w-full rounded-full pl-10"
                                        register={register('email', {
                                            required: 'Email is required!',
                                        })}
                                        error={
                                            errors.email
                                                ? errors.email.message
                                                : ''
                                        }
                                    />
                                </div>

                                <div className="w-full -mt-2">
                                    <FaUser className="relative top-[1.8rem] left-4 text-gray-400" />
                                    <Textbox
                                        placeholder="Username"
                                        type="text"
                                        name="username"
                                        className="w-full rounded-full pl-10"
                                        register={register('username', {
                                            required: 'Username is required!',
                                        })}
                                        error={
                                            errors.username
                                                ? errors.username.message
                                                : ''
                                        }
                                    />
                                </div>

                                <div className="w-full -mt-2 relative">
                                    <FaLock className="relative top-[1.8rem] left-4 text-gray-400" />
                                    <div
                                        className="absolute right-4 w-fit top-8 flex items-center cursor-pointer"
                                        onClick={() =>
                                            setShowPasswordSignup(
                                                !showPasswordSignup
                                            )
                                        }>
                                        {showPasswordSignup ? (
                                            <FaEyeSlash className="text-gray-500" />
                                        ) : (
                                            <FaEye className="text-gray-500" />
                                        )}
                                    </div>
                                    <Textbox
                                        placeholder="Password"
                                        type={
                                            showPasswordSignup
                                                ? 'text'
                                                : 'password'
                                        }
                                        name="password"
                                        className="w-full rounded-full pl-10"
                                        register={register('password', {
                                            required: 'Password is required!',
                                        })}
                                        error={
                                            errors.password
                                                ? errors.password.message
                                                : ''
                                        }
                                    />
                                </div>

                                <div className="w-full -mt-2 relative">
                                    <FaLock className="relative top-[1.8rem] left-4 text-gray-400" />
                                    <div
                                        className="absolute right-4 w-fit top-8 flex items-center cursor-pointer"
                                        onClick={() =>
                                            setShowConfirmPasswordSignup(
                                                !showConfirmPasswordSignup
                                            )
                                        }>
                                        {showConfirmPasswordSignup ? (
                                            <FaEyeSlash className="text-gray-500" />
                                        ) : (
                                            <FaEye className="text-gray-500" />
                                        )}
                                    </div>
                                    <Textbox
                                        placeholder="Confirm Password"
                                        type={
                                            showConfirmPasswordSignup
                                                ? 'text'
                                                : 'password'
                                        }
                                        name="confirmPassword"
                                        className="w-full rounded-full pl-10"
                                        register={register('confirmPassword', {
                                            required:
                                                'Confirm Password is required!',
                                        })}
                                        error={
                                            errors.confirmPassword
                                                ? errors.confirmPassword.message
                                                : ''
                                        }
                                    />
                                </div>

                                {isLoadingRegister ? (
                                    <Loading />
                                ) : (
                                    <Button
                                        type="submit"
                                        label="Submit"
                                        className="w-full h-10 bg-blue-700 text-white rounded-full"
                                    />
                                )}
                            </form>
                        )}
                        {isRegistered && activeTab === 'signup' && (
                            <div className="text-center">
                                <p>Didn't receive an email?</p>
                                <button
                                    onClick={async () => {
                                        try {
                                            const email = watch('email');
                                            if (email) {
                                                await resendVerification({
                                                    email,
                                                }).unwrap();
                                                toast.success(
                                                    'Verification email has been resent.'
                                                );
                                            } else {
                                                toast.error(
                                                    'Please enter your email first.'
                                                );
                                            }
                                        } catch (error) {
                                            toast.error(
                                                error?.data?.message ||
                                                    'Failed to resend verification email.'
                                            );
                                        }
                                    }}
                                    className="text-blue-600 underline">
                                    Resend Verification Email
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
