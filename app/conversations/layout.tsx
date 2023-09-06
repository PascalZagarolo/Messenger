import getConversations from "../actions/getConversations"
import ConversationList from "./components/ConversationList"
import Sidebar from "../components/sidebar/Sidebar"
import getUsers from "../actions/getUsers";
import { User } from "@prisma/client";

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode
}) {

    const conversations = await getConversations();
    const users = await getUsers();
    console.log('layout.tsx erhaltene nutzer : ', users)
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList
                users={users}
                initialItems={conversations}/>
                {children}
            </div>
        </Sidebar>
    )
};