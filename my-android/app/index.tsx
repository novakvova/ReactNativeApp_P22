import { Pressable, Text, View } from "react-native";
import { Link, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Index() {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const { user, isLoaded } = useSelector((state: RootState) => state.auth);

    if (!isLoaded) return null;

    if (user) {
        return <Redirect href="/(tabs)/chats" />;
    }

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <View className="flex-row justify-end px-6 pt-8">
                <Pressable
                    onPress={toggleColorScheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 active:opacity-70"
                >
                    <Ionicons
                        name={isDark ? "sunny" : "moon"}
                        size={24}
                        color={isDark ? "#FACC15" : "#1E293B"}
                    />
                </Pressable>
            </View>

            <View className="flex-1 justify-center px-6">
                <Text className="text-4xl font-black text-center mb-4 text-black dark:text-white tracking-tighter">
                    Ласкаво просимо
                </Text>

                <Text className="text-gray-500 dark:text-gray-400 text-center mb-10 text-lg font-medium">
                    Створіть обліковий запис, щоб продовжити
                </Text>

                <Link href="/register" asChild>
                    <Pressable
                        className="bg-black dark:bg-white py-4 rounded-2xl mb-4 shadow-md active:opacity-90 active:scale-[0.98]"
                    >
                        <Text className="text-white dark:text-black text-center font-bold text-lg">
                            Реєстрація
                        </Text>
                    </Pressable>
                </Link>

                <Link href="/login" asChild>
                    <Pressable
                        className="border border-gray-300 dark:border-slate-700 py-4 rounded-2xl active:bg-gray-50 dark:active:bg-slate-900 active:scale-[0.98]"
                    >
                        <Text className="text-center font-bold text-lg text-black dark:text-white">
                            Вхід
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}