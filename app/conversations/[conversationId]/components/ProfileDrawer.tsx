'use client';

import Avatar from "@/app/components/Avatar";
import Modal from "@/app/components/Modal";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Dialog, Transition } from "@headlessui/react";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { Fragment, useMemo, useState } from 'react';
import { IoClose, IoTrash, IoTrashBin } from "react-icons/io5"
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Conversation & {
        users: User[]
    }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
    isOpen,
    onClose,
    data
}) => {
    const otherUser = useOtherUser(data);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { members } = useActiveList();
    const isActive = members.indexOf(otherUser?.email!) !== -1;


    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), ' dd. MMM yyy ')
    },[otherUser.createdAt])

    const title = useMemo(() => {
        return data.name || otherUser?.name;
    },[data.name, otherUser.name])

   

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users.length} Mitglieder`;
        }

        return isActive ? 'ist Online' : 'ist derzeit Offline';
    },[data, isActive])

    return (
        <>
        <ConfirmModal 
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}>
            <div
                className="bg-white p-5">
                    <p> Konversation endgültig löschen ? </p>
            </div>
            </ConfirmModal>
            
       
        <Transition.Root show={isOpen} as={Fragment}>
        
            <Dialog as="div" className="relative-z50" onClose={onClose}>
                <Transition.Child as={Fragment}
                enter="ease-out duration-700"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-700"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                    <div
                    className="
                    fixed
                    inset-0
                 bg-white
                    bg-opacity-100"/>
                </Transition.Child> 
                
                
                    <div
                        className="
                        fixed
                        inset-0
                        overflow-hidden">
                             <div className="absolute inset-0 overflow-hidden">
                            <div className="
                            pointer-events-none
                            fixed
                            inset-y-0
                            right-0
                            flex
                            max-w-full
                            pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500"
                                    leaveTo="translate-x-full"
                                    >
                                        <Dialog.Panel
                                                className="
                                                pointer-events-auto
                                                w-screen
                                                max-w-md">

                                                <div
                                                className="
                                                    flex
                                                    h-full
                                                    flex-col
                                                    overflow-y-scroll
                                                    bg:white
                                                    py-6
                                                    shadow-xl">
                                                        <div className="px-4 sm:px-6">
                                                            <div className="
                                                                flex
                                                                items-start
                                                                justify-end">
                                                                    <div className="
                                                                    ml-3
                                                                    flex
                                                                    h-7
                                                                    items-center">
                                                                        <button
                                                                            type="button"
                                                                            className="
                                                                            rounded-md
                                                                            bg-white
                                                                            text-gray-400
                                                                            hover:text-gray-500
                                                                            focus:outline-none
                                                                            focus:ring-2
                                                                            focus:ring-sky-500
                                                                            focus:ring-offset-2"
                                                                            onClick={onClose}
                                                                            >
                                                                                <span className="sr-only">Verzeichnis verlassen.</span>
                                                                                <IoClose
                                                                                    size={24} />

                                                                        </button>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="relativ mt-6 flex-1 px-4 sm:px6">
                                                                <div className="
                                                                flex flex-col items-center">
                                                                    <div className="mb-2">
                                                                       {data.isGroup ? (
                                                                        <AvatarGroup users={data.users}/>
                                                                       ) : (
                                                                        
                                                                       
                                                                        <Avatar user = {otherUser} />
                                                                        )}
                                                                      
                                                                    </div>
                                                                    <div className="font-semibold">
                                                                        {title}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                                {statusText}
                                                                    </div>
                                                                    <div className="flex gap-10 my-8">
                                                                        <div
                                                                            onClick={() => setConfirmOpen(true)}
                                                                            className="
                                                                            flex
                                                                            flex-col
                                                                            gap-3
                                                                            items-center
                                                                            cursor-pointer
                                                                            hover:opacity-75">
                                                                                <div
                                                                                    className="
                                                                                    w-10
                                                                                    h-10
                                                                                    bg-neutral-100
                                                                                    rounded-full
                                                                                    flex
                                                                                    items-center
                                                                                    justify-center">
                                                                                        <IoTrashBin size={28}/>
                                                                                </div>
                                                                                <div className="
                                                                                text-sm
                                                                                font-semibold
                                                                                text-neutral-900">
                                                                                    Konversation löschen
                                                                                </div>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="
                                                                            w-full
                                                                            pb-5
                                                                            pt-5
                                                                            sm:px-0
                                                                            sm:pt-0">
                                                                                <dl className="
                                                                                    space-y-8
                                                                                    px-4
                                                                                    sm:space-y-6
                                                                                    sm:px-6">
                                                                                        {!data.isGroup && (
                                                                                            <div>
                                                                                                <dt className="
                                                                                                        text-sm
                                                                                                        font-medium
                                                                                                        text-gray-900
                                                                                                        sm:w-40
                                                                                                        sm:flex-shrink-0">
                                                                                                            Email-Adresse
                                                                                                </dt>
                                                                                                <dd
                                                                                                    className="
                                                                                                    mt-1
                                                                                                    text-sm
                                                                                                    text-gray-900
                                                                                                    sm:col-span-2">
                                                                                                        {otherUser.email}
                                                                                                </dd>
                                                                                            </div>
                                                                                        )}
                                                                                        {data.isGroup && (
                                                                                            <div>
                                                                                                <dt
                                                                                                    className="
                                                                                                    text-sm
                                                                                                    font-medium
                                                                                                    text-gray-500
                                                                                                    sm:w-40
                                                                                                    sm:flex-shrink-0">

                                                                                                        Email-Adressen
                                                                                                </dt>
                                                                                                <dd
                                                                                                    className="
                                                                                                    mt-1
                                                                                                    text-sm
                                                                                                    text-gray-900
                                                                                                    sm:col-span-2">
                                                                                                        {data.users.map((users) => users.email).join(' , ')}

                                                                                                </dd>
                                                                                            </div>
                                                                                        )}
                                                                                        {!data.isGroup && (
                                                                                            <>
                                                                                                <hr/>
                                                                                                <div>
                                                                                                    <dt
                                                                                                    className="
                                                                                                    text-sm
                                                                                                    font-medium
                                                                                                    text-gray-500
                                                                                                    sm:w-40
                                                                                                    sm:flex-shrink-0">
                                                                                                        auf Messenger seit:
                                                                                                    </dt>
                                                                                                    <dd
                                                                                                        className="
                                                                                                        mt-1
                                                                                                        text-sm
                                                                                                        text-gray-900
                                                                                                        sm:col-span-2">
                                                                                                            
                                                                                                            <time dateTime={joinedDate}>
                                                                                                                {joinedDate}
                                                                                                            </time>

                                                                                                    </dd>
                                                                                                </div>
                                                                                                
                                                                                            </>
                                                                                        )}
                                                                                </dl>

                                                                    </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
            </Dialog>
        </Transition.Root>
        </>
     );
}
 
export default ProfileDrawer;