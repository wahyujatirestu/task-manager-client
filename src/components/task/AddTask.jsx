import React, { useState, useEffect } from 'react';
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

const LISTS = ['TODO', 'IN-PROGRESS', 'COMPLETED'];
const PRIORITY = ['HIGH', 'MEDIUM', 'NORMAL', 'LOW'];

const AddTask = ({ open, setOpen, task, groups, groupId }) => {
    console.log('AddTask', { open, setOpen, task, groups, groupId });

    const [uploadedFileURLs, setUploadedFileURLs] = useState([]);
    const [previewURLs, setPreviewURLs] = useState([]);
    const [assets, setAssets] = useState([]);
    const [uploading, setUploading] = useState(false);

    const defaultValues = {
        title: task?.title || '',
        date: dateFormatter(task?.date || new Date()),
        team: task?.team || [],
        stage: task?.stage || LISTS[0],
        priority: task?.priority || PRIORITY[2],
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ defaultValues });

    const { user } = useSelector((state) => state.auth);
    const [team, setTeam] = useState(task?.team || []);
    const [stage, setStage] = useState(task?.stage || LISTS[0]);
    const [priority, setPriority] = useState(task?.priority || PRIORITY[2]);
    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();

    // Function to check if the user is an admin of the group
    const isAdmin = () => {
        if (!groupId || !groups.length) return false;
        const group = groups.find((group) => group.id === groupId);
        return group?.adminId === user.id;
    };

    const URLS = task?.assets || [];

    useEffect(() => {
        console.log('AddTask: useEffect', { task, groups, groupId });
        // Reset form when task changes
        if (task) {
            reset({
                title: task.title || '',
                date: dateFormatter(task.date || new Date()),
                team: task.team || [],
                stage: task.stage || LISTS[0],
                priority: task.priority || PRIORITY[2],
            });
            setStage(task.stage || LISTS[0]);
            setPriority(task.priority || PRIORITY[2]);
        }
    }, [task, reset]);

    const submitHandler = async (data) => {
        try {
            setUploading(true);
            console.log('AddTask: submitHandler', { data });

            // Upload assets
            const uploadedURLs = await Promise.all(
                assets.map((file) => uploadFile(file))
            );

            const taskData = {
                ...data,
                assets: [...URLS, ...uploadedURLs],
                stage: stage.toUpperCase(),
                priority: priority.toUpperCase(),
                team: team.map((member) => ({ id: member.id })), // Assign selected team members
            };

            // Add team if groupId exists and user is admin
            if (groupId && isAdmin(groupId)) {
                taskData.team = team;
            }

            if (task) {
                // Update task
                await updateTask({
                    id: task.id,
                    ...taskData,
                }).unwrap();
                toast.success('Task updated successfully');
            } else {
                // Create new task
                await createTask(taskData).unwrap();
                toast.success('Task created successfully');
            }

            setOpen(false);
        } catch (error) {
            console.error('AddTask: submitHandler', error);
            toast.error(error?.data?.message || error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSelect = (e) => {
        console.log('AddTask: handleSelect', e);
        const selectedFiles = Array.from(e.target.files);
        setAssets(selectedFiles);
        const previewURLs = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviewURLs(previewURLs);
    };

    const uploadFile = async (file) => {
        console.log('AddTask: uploadFile', file);
        const storage = getStorage(app);
        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed', null, reject, async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                setUploadedFileURLs((prev) => [...prev, downloadURL]);
                resolve(downloadURL);
            });
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

                    {groupId && isAdmin() && (
                        <UserList
                            groupId={groupId}
                            team={team}
                            setTeam={setTeam}
                        />
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
                                    onChange={handleSelect}
                                    accept=".jpg, .png, .jpeg"
                                    multiple
                                />
                                <BiImages />
                                <span>Add Assets</span>
                            </label>
                        </div>
                    </div>

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
