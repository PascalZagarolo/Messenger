import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversations = () =>{
    const params = useParams()


    //useMemo => saves the conversationIds in the cache, performance wise
    const conversationId = useMemo(() => {
        if(!params?.conversationId) {
            return '';
        }

        return params.conversationId as string;
    }, [params?.conversationid]);

    const isOpen = useMemo(() => !!conversationId, [conversationId])

    return useMemo(() => ({
        isOpen,
        conversationId
    }), [isOpen, conversationId])
};

export default useConversations;