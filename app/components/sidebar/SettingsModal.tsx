'use client';

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../inputs/Input";
import { Image } from "next/dist/client/image-component";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

interface SettingsModalProps {
    isOpen? : boolean
    onClose : () => void
    currentUser : User
}

const SettingsModal: React.FC<SettingsModalProps> = ({

    isOpen,
    onClose,
    currentUser

}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    });

    const image = watch('image');

    const handleUpload = ( result: any ) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        })
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        axios.post('/api/settings', data)
        .then(() => {
            router.refresh();
            onClose();
        })
        .catch(() => toast.error('Etwas ist schief gelaufen, versuche es nochmal'))
        .finally(() => setIsLoading(false))
    }

    return (         
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2
                            className="
                                text-base
                                font-semibold
                                leading-7
                                text-gray-900">
                                    Profil
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Profilinformationen verwalten
                        </p>

                        <div className="
                            mt-10
                            flex
                            flex-col
                            gap-y-8">
                                <Input
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                errors={errors}
                                required
                                register={register}
                                />
                                <div>
                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-medium
                                            leading-6
                                            text-gray-900">

                                                Foto

                                    </label>
                                    <div className="
                                        mt-2
                                        flex
                                        items-center
                                        gap-x-3">
                                            <Image
                                                alt="Avatar"
                                                src={image || currentUser?.image || '/images/placeholder.jpeg'}
                                                width="42"
                                                height="42"
                                                className="rounded-full"
                                                />
                                                <CldUploadButton
                                                    options={{ maxFiles : 1 }}
                                                    onUpload={handleUpload}
                                                    uploadPreset="mlxoigas">

                                                        <Button
                                                            type="button"
                                                            disabled={isLoading}
                                                            secondary
                                                            >
                                                            Profilbild ändern
                                                        </Button>

                                                </CldUploadButton>
                                    </div>
                                </div> 
                        </div>
                    </div>
                <div
                    className="
                    mt-6
                    flex
                    items-center
                    justify-center
                    gap-x-6">
                        <Button
                            disabled={isLoading}
                            secondary
                            onClick={onClose}>
                                Abbrechen
                        </Button>

                        <Button
                            disabled={isLoading}
                            type='submit'
                            onClick={onClose}>
                                Änderungen speichern
                        </Button>

                </div>
               </div>
            </form>
        </Modal>
 
     );
}
 
export default SettingsModal;