import { FC, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import { InputField } from "@/components/form/InputField";
import { useForm } from "@/hooks/useForm";
import { useAppDispatch } from "@/store";
import { getChatConnection } from "@/hubs/chatHub";
import {
    useGetChatMessagesQuery,
    useAmIAdminQuery,
} from "@/services/chatService";
import { IMessageItem } from "@/types/chat/IMessageItem";

import EditChatModal from "./EditChatModal";
import {IMAGE_URL} from "@/constants/Urls";

interface ChatWindowProps {
    chatId: number | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ chatId }) => {
    const scrollRef = useRef<ScrollView>(null);

    const { data: history, isFetching } = useGetChatMessagesQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const { data: isAdmin } = useAmIAdminQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const [messages, setMessages] = useState<IMessageItem[]>([]);
    const [editVisible, setEditVisible] = useState(false);

    const msgForm = useForm<{ message: string }>({ message: "" });

    useEffect(() => {
        if (history) {
            setMessages(history);
        }
    }, [history]);

    useEffect(() => {
        if (!chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("JoinChat", chatId);

        const handler = (msg: IMessageItem) => {
            setMessages(prev => {
                if (prev.some(m => m.id === msg.id && msg.id !== undefined)) {
                    return prev;
                }
                return [...prev, msg];
            });
        };

        connection.on("ReceiveMessage", handler);

        return () => {
            connection.invoke("LeaveChat", chatId);
            connection.off("ReceiveMessage", handler);
            setMessages([]);
        };
    }, [chatId]);

    const sendMessage = () => {
        const text = msgForm.form.message.trim();
        if (!text || !chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("SendMessage", { chatId, message: text });

        msgForm.setForm({ message: "" });
    };

    if (!chatId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">Оберіть чат</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-row items-center justify-between p-3 border-b border-zinc-300 dark:border-zinc-700">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Чат {isFetching && "..."}
                </Text>

                {isAdmin && (
                    <TouchableOpacity
                        onPress={() => setEditVisible(true)}
                        className="px-3 py-1 bg-emerald-500 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Редагувати</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                ref={scrollRef}
                className="flex-1 p-4"
                contentContainerStyle={{
                    paddingBottom: 20,
                    gap: 8
                }}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() =>
                    scrollRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.map((m, i) => (
                    <View
                        key={m.id || `msg-${i}`}
                        className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl self-start max-w-[85%] flex-row items-start gap-2"
                    >
                        <Image
                            source={{ uri: `${IMAGE_URL}100_${m.userImage}` }}
                            className="w-10 h-10 rounded-full"
                        />
                        <View className="flex-1">
                            <Text className="text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                                {m.userName || "Користувач"}
                            </Text>
                            <Text className="text-zinc-900 dark:text-zinc-100">
                                {m.message}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View className="flex-row p-2 border-t border-zinc-300 dark:border-zinc-700 items-end gap-2">
                <View className="flex-1">
                    <InputField
                        placeholder="Напишіть повідомлення..."
                        value={msgForm.form.message}
                        onChangeText={msgForm.onChange("message")}
                        onSubmitEditing={sendMessage}
                    />
                </View>

                <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-emerald-500 px-4 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">OK</Text>
                </TouchableOpacity>
            </View>

            <EditChatModal
                chatId={chatId}
                visible={editVisible}
                onClose={() => setEditVisible(false)}
            />
        </View>
    );
};

export default ChatWindow;