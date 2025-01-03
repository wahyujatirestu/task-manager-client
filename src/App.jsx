import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import TaskDetails from './pages/TaskDetail';
import TaskList from './components/TaskList';
import Tasks from './pages/Task';
import Trash from './pages/Trash';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import { setOpenSidebar } from './redux/slices/authSlice';
import VerifyEmail from './pages/VerifyEmail';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import ResendVerificationEmail from './components/ResendVerificationEmail';
import VerifyEmailInfo from './components/VerifyEmailInfo';
import Teams from './components/Teams';

function Layout() {
    const { user } = useSelector((state) => state.auth);

    const location = useLocation();

    return user ? (
        <div className="w-full h-screen flex flex-col md:flex-row">
            <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
                <Sidebar />
            </div>

            <MobileSidebar />

            <div className="flex-1 overflow-y-auto">
                <Navbar />

                <div className="p-4 2xl:px-10">
                    <Outlet />
                </div>
            </div>
        </div>
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
}

const MobileSidebar = () => {
    const { isSidebarOpen } = useSelector((state) => state.auth);
    const mobileMenuRef = useRef(null);
    const dispatch = useDispatch();

    const closeSidebar = () => {
        dispatch(setOpenSidebar(false));
    };

    return (
        <>
            <Transition
                show={isSidebarOpen}
                as={Fragment}
                enter="transition-opacity duration-700"
                enterFrom="opacity-x-10"
                enterTo="opacity-x-100"
                leave="transition-opacity duration-700"
                leaveFrom="opacity-x-100"
                leaveTo="opacity-x-0">
                {(ref) => (
                    <div
                        ref={(node) => (mobileMenuRef.current = node)}
                        className={clsx(
                            'md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ',
                            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        )}
                        onClick={() => closeSidebar()}>
                        <div className="bg-white w-3/4 h-full">
                            <div className="w-full flex justify-end px-5 pt-3 ">
                                <button
                                    onClick={() => closeSidebar()}
                                    className="flex justify-end items-end mt-2">
                                    <IoClose size={25} />
                                </button>
                            </div>

                            <div className="-mt-10">
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
};

function App() {
    return (
        <main className="w-full min-h-screen bg-[#f3f4f6] ">
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        index
                        path="/"
                        element={<Navigate to="/dashboard" />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/completed/:status" element={<Tasks />} />
                    <Route path="/in-progress/:status" element={<Tasks />} />
                    <Route path="/todo/:status" element={<Tasks />} />
                    <Route path="/team" element={<Users />} />
                    <Route path="/trashed" element={<Trash />} />
                    <Route path="/task/:id" element={<TaskDetails />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/group" element={<Teams />} />
                </Route>
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route
                    path="/verify-email-info"
                    element={<VerifyEmailInfo />}
                />
                <Route
                    path="/resend-verification"
                    element={<ResendVerificationEmail />}
                />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                <Route path="/login" element={<Login />} />
            </Routes>

            <Toaster richColors />
        </main>
    );
}

export default App;
