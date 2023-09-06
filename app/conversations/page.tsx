'use client';

import clsx from "clsx";


import EmptyState from "../components/EmptyState";
import useConversations from "../hooks/useConversations";

const Home = () => {
    const { isOpen } = useConversations();

    return (
        <div
        className={clsx(`
        lg:pl-80 h-full lg:block`,
        isOpen ? 'block' : 'hidden')}
        >
            <EmptyState />
        </div>
    )
};

export default Home;