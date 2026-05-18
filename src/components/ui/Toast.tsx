import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { spacing } from "@/src/theme/spacing";
import { radius } from "@/src/theme/radius";
import { typography } from "@/src/theme/typography";

interface ToastProps {
    visible: boolean;
    message: string;
}

export default function Toast({ visible, message }: ToastProps) {
    const { colors, shadows } = useAppTheme();
    const translateY = useRef(new Animated.Value(40)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();

            const timeout = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 260,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 20,
                        duration: 260,
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 1800);

            return () => clearTimeout(timeout);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.container,
                shadows.md,
                {
                    backgroundColor: colors.surfaceTertiary,
                    borderColor: colors.border,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: colors.textPrimary,
                    },
                ]}
            >
                {message}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: spacing.xl,
        left: spacing.lg,
        right: spacing.lg,
        borderWidth: 1,
        borderRadius: radius.lg,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    text: {
        fontWeight: "600",
        fontSize: typography.bodyMedium,
        textAlign: "center",
    },
});
