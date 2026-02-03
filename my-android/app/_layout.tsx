import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/store";
import { useEffect } from "react";
import { setAuth } from "@/store/authSlice";
import {getToken} from "@/utils/storage";

function AppContent() {
    const { colorScheme } = useColorScheme();
    const dispatch = useDispatch();
    const isLoaded = useSelector((state: RootState) => state.auth.isLoaded);

    useEffect(() => {
        async function loadToken() {
            try {
                await SplashScreen.preventAutoHideAsync();

                const token = await getToken();
                dispatch(setAuth(token));
            } catch (e) {
                console.error("Помилка завантаження токена:", e);
                dispatch(setAuth(null));
            } finally {
                await SplashScreen.hideAsync();
            }
        }
        loadToken();
    }, [dispatch]);

    if (!isLoaded) return null;

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-white dark:bg-slate-950">
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: 'default',
                        contentStyle: {
                            backgroundColor: colorScheme === "dark" ? "#020617" : "#ffffff"
                        },
                    }}
                />
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            </View>
        </SafeAreaProvider>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}