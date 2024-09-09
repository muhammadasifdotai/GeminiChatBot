import React, { useState, useRef } from "react";
import { StyleSheet, StatusBar, Text, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import Message from "./src/components/Message";
import Response from "./src/components/Response";

export default function App() {
    const [inputText, setInputText] = useState("");
    const [listData, setListData] = useState([]);
    const flatListRef = useRef(null);

    const SearchInput = () => {
        if (inputText.trim() === "") {
            // Prevent sending an empty message
            return;
        }

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
                <Image source={require("./src/assets/images/Gemini.png")} style={styles.icon} />
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
                showsVerticalScrollIndicator={false}
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
                        <Image source={require("./src/assets/images/DownArrow.png")} style={styles.Arrow} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Search-Bar */}
            <View style={styles.searchBar}>
                <TextInput placeholder="Ask to Gemini AI" placeholderTextColor={'black'} style={styles.input} value={inputText} onChangeText={(text) => setInputText(text)} selectionColor={"#323232"} />
                <TouchableOpacity onPress={SearchInput} style={styles.send}>
                    <Image source={require("./src/assets/images/Message.png")} style={styles.message} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    header: {
        backgroundColor: "#55E6C1",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 8,
        justifyContent: "space-between",
    },
    icon: {
        width: 60,
        height: 60,
    },
    message: {
        width: 40,
        height: 40,
    },
    Arrow: {
        width: 20,
        height: 20,
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
        backgroundColor: "#CAD3C8",
        borderRadius: 30,
    },
    send: {
        backgroundColor: '#55E6C1',
        borderRadius: 40,
        padding: 5,
        marginRight: 5,
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
        backgroundColor: "#d1ccc0",
        width: "90%",
        fontSize: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 32,
        borderWidth: 0.1,
        marginLeft: 11,
    },
});
