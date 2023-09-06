import { NextResponse } from "next/server";
import conversationId from '../../../conversations/[conversationId]/page';
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";

interface IParams{
    conversationId? : string

}

export async function DELETE (
    request: Request,
    { params } : { params : IParams}
) {
    try {

        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if(!currentUser?.id) {
            return new NextResponse('Unautorisiert' , { status: 401})
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if (!existingConversation) {
            return new NextResponse('Ungültige KonversationsId', { status : 401 })
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id : conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        existingConversation.users.forEach((user) => {
            if(user.email){
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation)

    } catch (error: any) {

        console.log(error , 'Fehler beim löschen');

        return new NextResponse('Interner Error', {status: 500})

    }
}