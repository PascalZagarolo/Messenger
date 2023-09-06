import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import  prisma from "@/app/libs/prismadb"
export async function POST (
    request: Request
) {
    try {

        const currentUser = await getCurrentUser()
        const body = await request.json();
        const {
            name,
            image
        } = body

        if (!currentUser?.id) {
            return new NextResponse('Nicht autorisiert' , { status: 401})
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                image: image,
                name: name
            }
        });

    } catch (error: any) {
        console.log (error, 'Fehler in Einstellungen');
        return new NextResponse('Interner Fehler ', { status : 500})
    }
}