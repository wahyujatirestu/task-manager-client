import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { Dialog } from '@headlessui/react';
import { useSelector } from 'react-redux';
import Textbox from '../Textbox';
import { useForm } from 'react-hook-form';
import UserList from './UserList';
import SelectList from '../SelectList';
import { BiImages } from 'react-icons/bi';
import Button from '../Button';
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../utils/firebase';
import {
    useCreateTaskMutation,
    useUpdateTaskMutation,
} from '../../redux/slices/api/taskApiSlice';
import { dateFormatter } from '../../utils';
import { toast } from 'sonner';

const LISTS = ['TODO', 'IN-PROGRESS', 'COMPLETED']; // List of stages as per enum TaskStage
const PRIORITY = ['HIGH', 'MEDIUM', 'NORMAL', 'LOW']; // List of priorities

const AddTask = ({ open, setOpen, task }) => {
    const [uploadedFileURLs, setUploadedFileURLs] = useState([]); // URLs after upload
    const [previewURLs, setPreviewURLs] = useState([]); // Preview before upload
    const [assets, setAssets] = useState([]); // Selected files
    const [uploading, setUploading] = useState(false); // Uploading status

    const defaultValues = {
        title: task?.title || '',
        date: dateFormatter(task?.date || new Date()),
        team: [],
        stage: '',
        priority: '',
        assets: [],
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const { user } = useSelector((state) => state.auth);
    const [team, setTeam] = useState(task?.team || []);
    const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]); // Ensure stage is uppercase
    const [priority, setPriority] = useState(
        task?.priority?.toUpperCase() || PRIORITY[2]
    );

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const URLS = task?.assets ? [...task.assets] : [];

    // Submit handler for the form
    const submitHandler = async (data) => {
        try {
            setUploading(true); // Set upload status to true
            const uploadedURLs = await Promise.all(
                assets.map((file) => uploadFile(file)) // Upload files and get URLs
            );

            const newData = {
                ...data,
                assets: [...URLS, ...uploadedURLs], // Add uploaded URLs to form data
                team,
                stage: stage.toUpperCase(), // Convert to uppercase to match the enum in Prisma
                priority,
            };

            // Send data to the backend (create or update task)
            const res = task?.id
                ? await updateTask({ ...newData, id: task.id }).unwrap()
                : await createTask(newData).unwrap();

            toast.success(res.message);
            setOpen(false);
        } catch (error) {
            console.error('Error during task submission:', error);
            toast.error(error?.data?.message || error.message);
        } finally {
            setUploading(false); // Set upload status to false after completion
        }
    };

    // Handle file selection and save it to state
    const handleSelect = (e) => {
        const selectedFiles = Array.from(e.target.files); // Get files as an array
        setAssets(selectedFiles); // Save files to assets state

        // Create preview URLs for selected files
        const previewURLs = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviewURLs(previewURLs);

        console.log('Selected files:', selectedFiles); // Log selected files
    };

    // Function to upload files to Firebase
    const uploadFile = async (file) => {
        const storage = getStorage(app);
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    console.log(
                        `Uploading ${file.name}: ${snapshot.bytesTransferred}/${snapshot.totalBytes}`
                    );
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            setUploadedFileURLs((prev) => [
                                ...prev,
                                downloadURL,
                            ]); // Add new URL to state
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            console.error('Failed to get download URL:', error);
                            reject(error);
                        });
                }
            );
        });
    };

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(submitHandler)}>
                <Dialog.Title
                    as="h2"
                    className="text-base font-bold leading-6 text-gray-900 mb-4">
                    {task ? 'UPDATE TASK' : 'ADD TASK'}
                </Dialog.Title>

                <div className="mt-2 flex flex-col gap-6">
                    <Textbox
                        placeholder="Task Title"
                        type="text"
                        name="title"
                        label="Task Title"
                        className="w-full rounded"
                        register={register('title', {
                            required: 'Title is required',
                        })}
                        error={errors.title ? errors.title.message : ''}
                    />

                    {user.role === 'Admin' && (
                        <UserList setTeam={setTeam} team={team} />
                    )}

                    <div className="flex gap-4">
                        <SelectList
                            label="Task Stage"
                            lists={LISTS}
                            selected={stage}
                            setSelected={setStage}
                        />

                        <Textbox
                            placeholder="Date"
                            type="date"
                            name="date"
                            label="Task Date"
                            className="w-full rounded"
                            register={register('date', {
                                required: 'Date is required!',
                            })}
                            error={errors.date ? errors.date.message : ''}
                        />
                    </div>

                    <div className="flex gap-4">
                        <SelectList
                            label="Priority Level"
                            lists={PRIORITY}
                            selected={priority}
                            setSelected={setPriority}
                        />

                        <div className="w-full flex items-center justify-center mt-4">
                            <label
                                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                                htmlFor="imgUpload">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="imgUpload"
                                    onChange={handleSelect} // Handle file selection
                                    accept=".jpg, .png, .jpeg"
                                    multiple
                                />
                                <BiImages />
                                <span>Add Assets</span>
                            </label>
                        </div>
                    </div>

                    {/* Preview selected images before upload */}
                    {previewURLs.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {previewURLs.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                    )}

                    <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
                        {uploading ? (
                            <span className="text-sm py-2 text-red-500">
                                Uploading assets...
                            </span>
                        ) : (
                            <Button
                                label="Submit"
                                type="submit"
                                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                            />
                        )}

                        <Button
                            type="button"
                            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                            onClick={() => setOpen(false)}
                            label="Cancel"
                        />
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default AddTask;
