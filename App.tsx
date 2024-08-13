import React, { useState, useRef } from "react";
import { StyleSheet, StatusBar, Text, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import Message from "./src/components/Message";
import Response from "./src/components/Response";

export default function App() {
    const [inputText, setInputText] = useState("");
    const [listData, setListData] = useState([]);
    const flatListRef = useRef(null);

    const SearchInput = () => {
        setListData((prevList) => [...prevList, inputText]);
        setInputText("");

        // Scroll to the bottom when a new message is added
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100);
    };

    const clearAllChat = () => {
        setListData([]);
    };

    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar/>

            {/* Header */}
            <View style={styles.header}>
                <Image source={require("./src/assets/images/robot.png")} style={styles.icon} />
                <Text style={{ fontSize: 24, fontWeight: "800", color: "#323232" }}>Gemini AI</Text>
                <TouchableOpacity onPress={clearAllChat} style={styles.clearButton}>
                    <Text style={{ color: "#FF0000", fontWeight: "bold" }}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <FlatList
                ref={flatListRef}
                style={{ paddingHorizontal: 16, marginBottom: 80 }}
                data={listData}
                renderItem={({ item }) => (
                    <View>
                        <Message message={item} />
                        <Response prompt={item} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />

            {/* Go to Bottom Button */}
            {listData.length > 0 && (
                <View style={styles.goToBottomContainer}>
                    <TouchableOpacity onPress={scrollToBottom} style={styles.goToBottomButton}>
                        <Text style={{ color: "#0000FF", fontWeight: "bold" }}>Go to Bottom</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Search-Bar */}
            <View style={styles.searchBar}>
                <TextInput placeholder="Ask to Gemini AI" style={styles.input} value={inputText} onChangeText={(text) => setInputText(text)} selectionColor={"#323232"} />
                <TouchableOpacity onPress={SearchInput}>
                    <Image source={require("./src/assets/images/right-arrow.png")} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        paddingTop: 36,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        margin: 8,
        gap: 8,
        justifyContent: "space-between",
    },
    icon: {
        width: 32,
        height: 32,
    },
    clearButton: {
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    goToBottomContainer: {
        position: "absolute",
        right: 20,
        bottom: 100, // Place it just above the search bar
    },
    goToBottomButton: {
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    searchBar: {
        backgroundColor: "#ffffff",
        width: "100%",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 16,
        gap: 8,
    },
    input: {
        backgroundColor: "#fff",
        width: "100%",
        fontSize: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 32,
        borderWidth: 0.1,
    },
});
