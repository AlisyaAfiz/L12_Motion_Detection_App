import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import { Gyroscope } from "expo-sensors";

const styles = StyleSheet.create({
    shakeText: {
        fontSize: 90,
        textAlign: "center",
        marginTop: 50
    }
});

export default function App() {
    const [isShaking, setIsShaking] = useState(false);

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require("./shaker.wav"));
        await sound.playAsync();
    }

    useEffect(() => {
        Gyroscope.setUpdateInterval(100);
        const subscription = Gyroscope.addListener(({ x, y, z }) => {
            if (Math.abs(x) > 1.5 || Math.abs(y) > 1.5 || Math.abs(z) > 1.5) {
                if (!isShaking) {
                    setIsShaking(true);
                    playSound();
                }
            } else {
                setIsShaking(false);
            }
        });

        return () => subscription.remove();
    }, [isShaking]);

    return (
        <View>
            <StatusBar />
            {isShaking && <Text style={styles.shakeText}>SHAKE!</Text>}
        </View>
    );
}
