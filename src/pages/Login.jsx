import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { setCredentials } from '../redux/slices/authSlice';
import Loading from '../components/Loader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const { user } = useSelector((state) => state.auth);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState();

    const submitHandler = async (data) => {
        console.log('Data submitted:', data);
        try {
            const result = await login(data).unwrap();
            console.log('Login success:', result);

            dispatch(setCredentials(result));
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            if (error.data && error.data.message) {
                toast.error(error.data.message);
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        }
    };

    useEffect(() => {
        user && navigate('/dashboard');
    }, [user]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                {/* left side */}
                <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
                    <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
                        <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
                            Manage all your task in one place!
                        </span>
                        <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                            <span>Jastrate</span>
                            <span>Task Manager</span>
                        </p>

                        <div className="cell">
                            <div className="circle rotate-in-up-left"></div>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14">
                        <div className="">
                            <p className="text-blue-600 text-3xl font-bold text-center">
                                Welcome
                            </p>
                            <p className="text-center text-base text-gray-700 ">
                                Keep all your credential safe.
                            </p>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            <Textbox
                                placeholder="email or username"
                                type="text"
                                name="identifier"
                                label="Email or Username"
                                className="w-full rounded-full"
                                register={register('identifier', {
                                    required: 'Email or Username is required!',
                                })}
                                error={
                                    errors.identifier
                                        ? errors.identifier.message
                                        : ''
                                }
                            />

                            <div className="relative w-full">
                                <Textbox
                                    placeholder="your password"
                                    type={showPassword ? 'text' : 'password'} // Toggle type
                                    name="password"
                                    label="Password"
                                    className="w-full rounded-full"
                                    register={register('password', {
                                        required: 'Password is required!',
                                    })}
                                    error={
                                        errors.password
                                            ? errors.password.message
                                            : ''
                                    }
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-5 mt-7 flex items-center cursor-pointer"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }>
                                    {showPassword ? (
                                        <FaEyeSlash className="text-gray-500" />
                                    ) : (
                                        <FaEye className="text-gray-500" />
                                    )}
                                </div>
                            </div>

                            <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div className="h-[100vh] w-[100vw] flex items-center justify-center">
    //         <div className="h-[85vh] bg-white text-opacity-90 shadow-2xl w-[85vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
    //             <div className="flex flex-col items-center justify-center gap-10  -mt-14">
    //                 <div className="flex items-center justify-center flex-col">
    //                     <div className="flex items-center justify-center">
    //                         <img
    //                             src={Chitid}
    //                             alt="ChitChatID"
    //                             className="h-[200px]"
    //                         />
    //                     </div>
    //                     <p className="font-medium text-center -mt-[75px]">
    //                         Ngobrol Aja Dulu!
    //                     </p>
    //                 </div>
    //                 <div className="flex items-center justify-center w-full">
    //                     <Tabs className="w-3/4">
    //                         <TabsList className="bg-transparent rounded-none w-full">
    //                             <TabsTrigger
    //                                 value="login"
    //                                 className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300">
    //                                 Login
    //                             </TabsTrigger>
    //                             <TabsTrigger
    //                                 value="signup"
    //                                 className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300">
    //                                 Sign Up
    //                             </TabsTrigger>
    //                         </TabsList>
    //                         <TabsContent
    //                             className="flex flex-col gap-4 mt-10"
    //                             value="login">
    //                             <Input
    //                                 id="login-email-username"
    //                                 name="emailOrUsername"
    //                                 type="text"
    //                                 placeholder="Email atau Username"
    //                                 className="rounded-full p-2 px-4"
    //                                 value={email || username}
    //                                 onChange={handleEmailOrUsernameChange}
    //                                 onKeyDown={handleKeyDownLogin} // Add this line
    //                             />
    //                             <div className="relative">
    //                                 <Input
    //                                     id="login-password"
    //                                     name="password"
    //                                     type={
    //                                         showPassword ? 'text' : 'password'
    //                                     }
    //                                     placeholder="Password"
    //                                     className="rounded-full p-2 px-4 w-full"
    //                                     value={password}
    //                                     onChange={(e) =>
    //                                         setPassword(e.target.value)
    //                                     }
    //                                     onKeyDown={handleKeyDownLogin} // Add this line
    //                                 />
    //                                 <button
    //                                     type="button"
    //                                     className="absolute right-4 top-3 text-gray-600"
    //                                     onClick={() =>
    //                                         setShowPassword(!showPassword)
    //                                     }>
    //                                     {showPassword ? (
    //                                         <FaEyeSlash />
    //                                     ) : (
    //                                         <FaEye />
    //                                     )}
    //                                 </button>
    //                             </div>
    //                             <Button
    //                                 className="rounded-full p-4 mt-8"
    //                                 onClick={handleLogin}>
    //                                 Login
    //                             </Button>
    //                             <div className="flex items-center justify-center ">
    //                                 <span className="border-b w-1/4 lg:w-1/3"></span>
    //                                 <span className="px-2 text-sm text-gray-500">
    //                                     or
    //                                 </span>
    //                                 <span className="border-b w-1/4 lg:w-1/3"></span>
    //                             </div>
    //                             <Button
    //                                 className="rounded-full p-4 btn btn-block btn-sm  bg-slate-100 text-black border-none flex items-center justify-center hover:bg-white"
    //                                 onClick={loginWithGoogle}>
    //                                 <FcGoogle className="mr-2" /> Login with
    //                                 Google
    //                             </Button>
    //                         </TabsContent>
    //                         <TabsContent
    //                             className="flex flex-col gap-5 mt-1"
    //                             value="signup">
    //                             <Input
    //                                 id="signup-email"
    //                                 name="email"
    //                                 type="email"
    //                                 placeholder="Email"
    //                                 className="rounded-full p-2 px-4"
    //                                 value={email}
    //                                 onChange={(e) => setEmail(e.target.value)}
    //                                 onKeyDown={handleKeyDownSignup} // Add this line
    //                             />
    //                             <Input
    //                                 id="signup-username"
    //                                 name="username"
    //                                 type="text"
    //                                 placeholder="Username"
    //                                 className="rounded-full p-2 px-4"
    //                                 value={username}
    //                                 onChange={(e) =>
    //                                     setUsername(e.target.value)
    //                                 }
    //                                 onKeyDown={handleKeyDownSignup} // Add this line
    //                             />
    //                             <div className="relative">
    //                                 <Input
    //                                     id="signup-password"
    //                                     name="password"
    //                                     type={
    //                                         showPassword ? 'text' : 'password'
    //                                     }
    //                                     placeholder="Password"
    //                                     className="rounded-full p-2 px-4 w-full"
    //                                     value={password}
    //                                     onChange={(e) =>
    //                                         setPassword(e.target.value)
    //                                     }
    //                                     onKeyDown={handleKeyDownSignup} // Add this line
    //                                 />
    //                                 <button
    //                                     type="button"
    //                                     className="absolute right-4 top-3 text-gray-600"
    //                                     onClick={() =>
    //                                         setShowPassword(!showPassword)
    //                                     }>
    //                                     {showPassword ? (
    //                                         <FaEyeSlash />
    //                                     ) : (
    //                                         <FaEye />
    //                                     )}
    //                                 </button>
    //                             </div>
    //                             <div className="relative">
    //                                 <Input
    //                                     id="signup-confirm-password"
    //                                     name="confirmPassword"
    //                                     type={
    //                                         showConfirmPassword
    //                                             ? 'text'
    //                                             : 'password'
    //                                     }
    //                                     placeholder="Konfirmasi Password"
    //                                     className="rounded-full p-2 px-4 w-full"
    //                                     value={confirmPassword}
    //                                     onChange={(e) =>
    //                                         setConfirmPassword(e.target.value)
    //                                     }
    //                                     onKeyDown={handleKeyDownSignup} // Add this line
    //                                 />
    //                                 <button
    //                                     type="button"
    //                                     className="absolute right-4 top-3 text-gray-600"
    //                                     onClick={() =>
    //                                         setShowConfirmPassword(
    //                                             !showConfirmPassword
    //                                         )
    //                                     }>
    //                                     {showConfirmPassword ? (
    //                                         <FaEyeSlash />
    //                                     ) : (
    //                                         <FaEye />
    //                                     )}
    //                                 </button>
    //                             </div>
    //                             <Button
    //                                 className="rounded-full p-3 bg-sky-700 text-white -mb-[4px]"
    //                                 onClick={handleSignup}>
    //                                 Sign Up
    //                             </Button>
    //                         </TabsContent>
    //                     </Tabs>
    //                 </div>
    //             </div>
    //             <div className="hidden xl:flex justify-center items-center">
    //                 <img
    //                     src={Background}
    //                     alt="Background Login"
    //                     className="h-[560px] w-[430px] -ml-8"
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default Login;
