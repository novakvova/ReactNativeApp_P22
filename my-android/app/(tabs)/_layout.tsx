import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTabs = withLayoutContext(Navigator);

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <MaterialTabs
            tabBarPosition="bottom"
            screenOptions={{
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
                tabBarShowIcon: true,
                tabBarPressColor: isDark ? '#1e293b' : '#e2e8f0',

                tabBarIndicatorStyle: {
                    backgroundColor: '#3b82f6',
                    height: 3,
                    top: 0,
                },

                tabBarStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
                    height: 60,
                },

                tabBarLabelStyle: {
                    fontSize: 10,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    marginBottom: 5,
                },

                swipeEnabled: true,
            }}
        >
            <MaterialTabs.Screen
                name="chats"
                options={{
                    title: 'Чати',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <Ionicons name="chatbubbles-outline" size={24} color={color} />
                    ),
                }}
            />
            <MaterialTabs.Screen
                name="profile"
                options={{
                    title: 'Налаштування',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <Ionicons name="settings-outline" size={24} color={color} />
                    ),
                }}
            />
        </MaterialTabs>
    );
}