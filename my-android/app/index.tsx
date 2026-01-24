import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className={"text-xl font-bold text-blue-500"}>Добре їсти</Text>
    </View>
  );
}
