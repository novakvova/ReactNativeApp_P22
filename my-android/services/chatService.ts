import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "@/utils/createBaseQuery";
import {IChatItem} from "@/types/сhat/IChatItem";
import {IChatCreate} from "@/types/сhat/IChatCreate";
import {IChatMessage} from "@/types/сhat/IChatMessage";

export const chatService = createApi({
    reducerPath: 'api/chat',
    baseQuery: createBaseQuery('Chats'),
    tagTypes: ['Chats', 'Messages'],
    endpoints: (builder) => ({
        getMyChats: builder.query<IChatItem[], void>({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['Chats']
        }),

        createChat: builder.mutation<number, IChatCreate>({
            query: (body) => ({ url: '', method: 'POST', body: body }),
            invalidatesTags: ['Chats']
        }),

        getChatMessages: builder.query<IChatMessage[], number>({
            query: (chatId) => ({
                url: `${chatId}/messages`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        })
    })
});

export const {
    useGetMyChatsQuery,
    useCreateChatMutation,
    useGetChatMessagesQuery
} = chatService;