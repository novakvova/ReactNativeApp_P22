import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <>
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
                <View className="flex-1 items-center justify-center px-6">

                    <View className="w-20 h-20 bg-gray-100 dark:bg-slate-900 rounded-2xl items-center justify-center mb-6">
                        <Ionicons
                            name="alert-circle-outline"
                            size={40}
                            color={isDark ? "white" : "black"}
                        />
                    </View>

                    <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                        Сторінку не знайдено
                    </Text>

                    <Text className="text-gray-500 dark:text-gray-400 mt-3 text-base text-center mb-10 px-4">
                        Схоже, цей маршрут не існує або був переміщений.
                    </Text>

                    <Link href="/" asChild>
                        <Pressable
                            className="w-full bg-black dark:bg-white py-4 rounded-xl shadow-md active:opacity-90 active:scale-[0.98]"
                        >
                            <Text className="text-white dark:text-black text-center font-bold text-lg">
                                На головну
                            </Text>
                        </Pressable>
                    </Link>

                    <View className="flex-row justify-center mt-8">
                        <Link href=".." asChild>
                            <Pressable>
                                <Text className="text-gray-500 dark:text-gray-400 font-medium text-base">
                                    Повернутись назад
                                </Text>
                            </Pressable>
                        </Link>
                    </View>

                </View>
            </SafeAreaView>
        </>
    );
}