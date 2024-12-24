import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import { Dialog } from '@headlessui/react';
import Textbox from './Textbox';
import Loading from './Loader';
import Button from './Button';
import { toast } from 'sonner';
import { useUpdateUserMutation } from '../redux/slices/api/userApiSlice';
import { setCredentials } from '../redux/slices/authSlice';

const UpdateUser = ({ open, setOpen, userData }) => {
    let defaultValues = userData ?? {};
    const { user } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const dispatch = useDispatch();

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const handleOnSubmit = async (data) => {
        try {
            console.log('Submitting data:', data);

            if (userData) {
                const result = await updateUser(data).unwrap();
                toast.success('Profile Updated Successfully');
                console.log('Update result:', result);

                if (userData?.id === user.id) {
                    dispatch(
                        setCredentials({
                            user: result.user,
                            accessToken: result.accessToken, // Tambahkan ini jika API mengembalikan token baru
                            refreshToken: result.refreshToken, // Tambahkan ini jika API mengembalikan refreshToken baru
                        })
                    );
                }
            }

            setTimeout(() => {
                setOpen(false);
            }, 1500);
        } catch (error) {
            toast.error('Something went wrong');
            console.error('Error updating user:', error);
        }
    };

    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(handleOnSubmit)} className="">
                    <Dialog.Title
                        as="h2"
                        className="text-base font-bold leading-6 text-gray-900 mb-4">
                        {userData ? 'UPDATE PROFILE' : 'ADD NEW USER'}
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col gap-6">
                        <Textbox
                            placeholder="Full name"
                            type="text"
                            name="name"
                            label="Full Name"
                            className="w-full rounded"
                            register={register('name', {
                                required: 'Full name is required!',
                            })}
                            error={errors.name ? errors.name.message : ''}
                        />
                        <Textbox
                            placeholder="Username"
                            type="text"
                            name="username"
                            label="Username"
                            className="w-full rounded"
                            register={register('username', {
                                required: 'Full name is required!',
                            })}
                            error={
                                errors.username ? errors.username.message : ''
                            }
                        />
                        <Textbox
                            placeholder="Title"
                            type="text"
                            name="title"
                            label="Title"
                            className="w-full rounded"
                            register={register('title', {
                                required: 'Title is required!',
                            })}
                            error={errors.title ? errors.title.message : ''}
                        />
                        <Textbox
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            label="Email Address"
                            className="w-full rounded"
                            register={register('email', {
                                required: 'Email Address is required!',
                            })}
                            error={errors.email ? errors.email.message : ''}
                        />
                    </div>

                    {isUpdating ? (
                        <div className="py-5">
                            <Loading />
                        </div>
                    ) : (
                        <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                            <Button
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                                label="Submit"
                            />

                            <Button
                                type="button"
                                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                                onClick={() => setOpen(false)}
                                label="Cancel"
                            />
                        </div>
                    )}
                </form>
            </ModalWrapper>
        </>
    );
};

export default UpdateUser;
