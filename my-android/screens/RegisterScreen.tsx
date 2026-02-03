import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useColorScheme } from "nativewind";
import { Link, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import AvatarPicker from "@/components/pickers/AvatarPicker";
import IconInput from "@/components/inputs/IconInput";
import { useRegisterMutation } from "@/services/authService";
import { IRegister } from "@/types/auth/IRegister";
import { saveToken } from "@/utils/storage";
import { setAuth } from "@/store/authSlice";
import {StatusModal} from "@/components/modals/StatusModal";

export default function RegisterScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const [modalConfig, setModalConfig] = useState({
        visible: false,
        type: 'info' as 'success' | 'error' | 'info',
        title: '',
        message: '',
    });

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const showModal = (type: 'success' | 'error', title: string, message: string) => {
        setModalConfig({ visible: true, type, title, message });
    };

    const handleModalClose = () => {
        setModalConfig((prev) => ({ ...prev, visible: false }));

        if (modalConfig.type === 'success') {
            router.replace("/chats");
        }
    };

    const handleRegister = async () => {
        const { firstName, lastName, email, password, confirmPassword } = formData;

        if (!firstName || !lastName || !email || !password) {
            showModal("error", "Помилка валідації", "Будь ласка, заповніть усі обов'язкові поля.");
            return;
        }

        if (password !== confirmPassword) {
            showModal("error", "Помилка пароля", "Паролі не співпадають.");
            return;
        }

        const registerData: IRegister = {
            firstName,
            lastName,
            email,
            password,
        };

        if (imageUri) {
            const filename = imageUri.split('/').pop() || "avatar.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            registerData.imageFile = {
                uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
                name: filename,
                type: type,
            };
        }

        try {
            const result = await register(registerData).unwrap();
            const token = result.token;
            await saveToken(token);
            dispatch(setAuth(token));

            showModal("success", "Вітаємо!", "Реєстрація пройшла успішно.");

        } catch (error: any) {
            console.error(error);
            showModal("error", "Помилка сервера", error?.data?.title || "Щось пішло не так під час реєстрації.");
        }
    };

    const handleGoogleLogin = async () => {
        console.log("Google login pressed");
    };

    return (
        <>
            <KeyboardAwareScrollView
                className="bg-white dark:bg-slate-950"
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                enableOnAndroid
                extraScrollHeight={100}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 py-10">
                    <Text className="text-3xl font-extrabold text-center mb-8 text-black dark:text-white">
                        Реєстрація
                    </Text>

                    <AvatarPicker image={imageUri} onChange={setImageUri} />

                    <View className="space-y-3 mt-4">
                        <View className="flex-row space-x-3 gap-2">
                            <View className="flex-1">
                                <IconInput
                                    icon="person-outline"
                                    placeholder="Ім'я"
                                    value={formData.firstName}
                                    onChangeText={(t) => handleChange("firstName", t)}
                                />
                            </View>
                            <View className="flex-1">
                                <IconInput
                                    icon="person-outline"
                                    placeholder="Прізвище"
                                    value={formData.lastName}
                                    onChangeText={(t) => handleChange("lastName", t)}
                                />
                            </View>
                        </View>

                        <IconInput
                            icon="mail-outline"
                            placeholder="Email"
                            value={formData.email}
                            onChangeText={(t) => handleChange("email", t)}
                            keyboardType="email-address"
                        />

                        <IconInput
                            icon="lock-closed-outline"
                            placeholder="Пароль"
                            value={formData.password}
                            onChangeText={(t) => handleChange("password", t)}
                            secureTextEntry={!showPassword}
                            rightIcon={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color={isDark ? "#94A3B8" : "#6B7280"}
                                    />
                                </Pressable>
                            }
                        />

                        <IconInput
                            icon="lock-closed-outline"
                            placeholder="Підтвердження"
                            value={formData.confirmPassword}
                            onChangeText={(t) => handleChange("confirmPassword", t)}
                            secureTextEntry={!showPassword}
                        />
                    </View>

                    <Pressable
                        className={`py-4 rounded-2xl mt-8 shadow-lg items-center ${
                            isLoading ? "bg-gray-400" : "bg-black dark:bg-white active:opacity-90"
                        }`}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white dark:text-black text-center font-bold text-lg">
                                Зареєструватися
                            </Text>
                        )}
                    </Pressable>

                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[0.5px] bg-gray-200 dark:bg-slate-800" />
                        <Text className="mx-4 text-gray-400 font-medium text-sm">Або</Text>
                        <View className="flex-1 h-[0.5px] bg-gray-200 dark:bg-slate-800" />
                    </View>

                    <Pressable
                        onPress={handleGoogleLogin}
                        className="flex-row items-center justify-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 py-4 rounded-xl shadow-sm active:bg-gray-50 dark:active:bg-slate-800"
                    >
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text className="text-gray-700 dark:text-gray-200 font-bold text-lg ml-3">
                            Увійти через Google
                        </Text>
                    </Pressable>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-500 dark:text-gray-400 text-base">
                            Вже маєте акаунт?{" "}
                        </Text>
                        <Link href="/login" asChild>
                            <Text className="text-black dark:text-white font-bold text-base">
                                Увійти
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
                buttonText={modalConfig.type === 'success' ? "Продовжити" : "Спробувати ще"}
            />
        </>
    );
}