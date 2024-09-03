import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import ModalWrapper from './ModalWrapper';
import Textbox from './Textbox';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';
import Loading from './Loader';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import eye icons from react-icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [changeUserPassword, { isLoading }] = useChangePasswordMutation();
    const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

    const handleOnSubmit = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const res = await changeUserPassword(data).unwrap();
            toast.success('Password changed successfully');

            setTimeout(() => {
                setOpen(false);
            }, 1500);
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="">
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4">
                        Change Password
                    </Dialog.Title>
                    <div className="flex flex-col mt-2 gap-6">
                        <div className="relative w-full">
                            <Textbox
                                placeholder="New Password"
                                type={showNewPassword ? 'text' : 'password'} // Toggle type
                                name="newPassword"
                                label="New Password"
                                className="w-full rounded"
                                register={register('newPassword', {
                                    required: 'New Password is required',
                                })}
                                error={
                                    errors.newPassword
                                        ? errors.newPassword.message
                                        : ''
                                }
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center cursor-pointer"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }>
                                {showNewPassword ? (
                                    <FaEyeSlash className="text-gray-500" />
                                ) : (
                                    <FaEye className="text-gray-500" />
                                )}
                            </div>
                        </div>
                        <div className="relative w-full">
                            <Textbox
                                placeholder="Confirm New Password"
                                type={showConfirmPassword ? 'text' : 'password'} // Toggle type
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                className="w-full rounded"
                                register={register('confirmNewPassword', {
                                    required:
                                        'Confirm New Password is required',
                                })}
                                error={
                                    errors.confirmNewPassword
                                        ? errors.confirmNewPassword.message
                                        : ''
                                }
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 mt-6 flex items-center cursor-pointer"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }>
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="text-gray-500" />
                                ) : (
                                    <FaEye className="text-gray-500" />
                                )}
                            </div>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="py-5">
                            <Loading />
                        </div>
                    ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700"
                                label="Save"
                            />
                            <button
                                type="button"
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                                onClick={() => setOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    );
};

export default ChangePassword;
