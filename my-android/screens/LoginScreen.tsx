import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IconInput from "@/components/inputs/IconInput";
import { Link, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useLoginMutation } from "@/services/authService";
import { setAuth } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { saveToken } from "@/utils/storage";
import { StatusModal } from "@/components/modals/StatusModal";

export default function LoginScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const [login, { isLoading }] = useLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [modalConfig, setModalConfig] = useState({
        visible: false,
        type: 'info' as 'success' | 'error' | 'info',
        title: '',
        message: '',
    });

    const showModal = (type: 'success' | 'error', title: string, message: string) => {
        setModalConfig({ visible: true, type, title, message });
    };

    const handleModalClose = () => {
        setModalConfig((prev) => ({ ...prev, visible: false }));

        if (modalConfig.type === 'success') {
            router.replace("/chats");
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            showModal("error", "Помилка", "Введіть email та пароль");
            return;
        }

        try {
            const result = await login({
                email: email.trim(),
                password: password
            }).unwrap();

            const token = result.token;
            await saveToken(token);
            dispatch(setAuth(token));

            showModal("success", "Успіх!", "Ви успішно увійшли в систему.");

        } catch (error: any) {
            console.error("Login Error:", error);

            if (error.status === 'FETCH_ERROR') {
                showModal("error", "Помилка мережі", "Не вдалося з'єднатися з сервером. Перевірте інтернет.");
            } else {
                const msg = error?.data?.message || "Невірний логін або пароль";
                showModal("error", "Помилка входу", msg);
            }
        }
    };

    return (
        <>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                enableOnAndroid
                extraScrollHeight={100}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                className="bg-white dark:bg-slate-950"
            >
                <View className="px-6 py-6">
                    <View className="items-center mb-10">
                        <View className="w-16 h-16 bg-gray-100 dark:bg-slate-900 rounded-2xl items-center justify-center mb-4">
                            <Ionicons
                                name="log-in"
                                size={32}
                                color={isDark ? "white" : "black"}
                            />
                        </View>
                        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                            З поверненням!
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 mt-2 text-base text-center">
                            Увійдіть, щоб продовжити
                        </Text>
                    </View>

                    <View>
                        <IconInput
                            icon="mail-outline"
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <IconInput
                            icon="lock-closed-outline"
                            placeholder="Пароль"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            rightIcon={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={isDark ? "#94A3B8" : "#6B7280"}
                                    />
                                </Pressable>
                            }
                        />
                    </View>

                    <Pressable className="self-end mt-1 mb-8">
                        <Text className="text-blue-600 dark:text-blue-400 font-medium">
                            Забули пароль?
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleLogin}
                        disabled={isLoading}
                        className={`py-4 rounded-xl shadow-md items-center ${
                            isLoading ? "bg-gray-400" : "bg-black dark:bg-white active:opacity-90 active:scale-[0.98]"
                        }`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={isDark ? "black" : "white"} />
                        ) : (
                            <Text className="text-white dark:text-black text-center font-bold text-lg">
                                Увійти
                            </Text>
                        )}
                    </Pressable>

                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[0.5px] bg-gray-200 dark:bg-slate-800" />
                        <Text className="mx-4 text-gray-400 font-medium text-sm">Або</Text>
                        <View className="flex-1 h-[0.5px] bg-gray-200 dark:bg-slate-800" />
                    </View>

                    <Pressable
                        className="flex-row items-center justify-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 py-4 rounded-xl shadow-sm active:bg-gray-50 dark:active:bg-slate-800"
                    >
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text className="text-gray-700 dark:text-gray-200 font-bold text-lg ml-3">
                            Увійти через Google
                        </Text>
                    </Pressable>

                    <View className="flex-row justify-center mt-10">
                        <Text className="text-gray-500 dark:text-gray-400 text-base">
                            Немає акаунту?{" "}
                        </Text>
                        <Link href="/register" asChild>
                            <Text className="text-black dark:text-white font-bold text-base">
                                Створити
                            </Text>
                        </Link>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <StatusModal
                visible={modalConfig.visible}
                onClose={handleModalClose}
                type={modalConfig.type}
                title={modalConfig.title}
                description={modalConfig.message}
                buttonText={modalConfig.type === 'success' ? "Перейти" : "Спробувати ще"}
            />
        </>
    );
}