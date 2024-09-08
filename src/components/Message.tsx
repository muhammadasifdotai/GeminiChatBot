import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

const date = new Date();

export default function Message(props) {
	return (
		<View style={styles.message}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<Image source={require("../assets//images/Asif.png")} style={styles.icon} />
					<Text style={{ fontWeight: 500, fontSize: 15, color: 'white' }}>User</Text>
				</View>
				<Text style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>
					{date.getHours()}:{date.getMinutes()}
				</Text>
			</View>
			<Text style={{ fontSize: 15, width: "100%", flex: 1, paddingLeft: 0, color: 'white' }}>{props.message}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	message: {
		flexDirection: "column",
		gap: 8,
		backgroundColor: "#55E6C1",
		marginBottom: 8,
		padding: 16,
		borderRadius: 16,
	},
	icon: {
		width: 28,
		height: 28,
		borderRadius: 40,
	},
});
