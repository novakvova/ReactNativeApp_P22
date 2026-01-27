import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {useSystemBars} from "@/hooks/useSystemBars";
import {StatusBar, useColorScheme} from "react-native";

export default function RootLayout() {
    const isDark = useColorScheme() === "dark";

    useSystemBars();

    return (
        <>
            <SafeAreaProvider>
                <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
                <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
        </>
    );
}
