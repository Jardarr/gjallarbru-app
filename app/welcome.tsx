import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import PressableCard from "@/src/components/ui/PressableCard";
import ScreenLoader from "@/src/components/ui/ScreenLoader";
import type { InterfaceLanguage } from "@/src/store/settings.store";
import { useAppSettingsStore } from "@/src/store/settings.store";

export default function WelcomeScreen() {
    const { i18n } = useTranslation();
    const [isApplyingLanguage, setIsApplyingLanguage] = useState(false);
    const [isStoreHydrated, setIsStoreHydrated] = useState(() =>
        useAppSettingsStore.persist.hasHydrated(),
    );
    const completeLanguageSelection = useAppSettingsStore(
        (state) => state.completeLanguageSelection,
    );
    const hasSelectedInterfaceLanguage = useAppSettingsStore(
        (state) => state.hasSelectedInterfaceLanguage,
    );
    const interfaceLanguage = useAppSettingsStore(
        (state) => state.interfaceLanguage,
    );
    useEffect(() => {
        const unsubscribe = useAppSettingsStore.persist.onFinishHydration(
            () => {
                setIsStoreHydrated(true);
            },
        );
        if (useAppSettingsStore.persist.hasHydrated()) {
            setIsStoreHydrated(true);
        }
        return unsubscribe;
    }, []);
    useEffect(() => {
        if (
            isStoreHydrated &&
            hasSelectedInterfaceLanguage &&
            interfaceLanguage
        ) {
            router.replace("/poems");
        }
    }, [hasSelectedInterfaceLanguage, interfaceLanguage, isStoreHydrated]);

    const handleSelectLanguage = async (language: InterfaceLanguage) => {
        setIsApplyingLanguage(true);

        try {
            await i18n.changeLanguage(language);
            completeLanguageSelection(language);
            router.replace("/poems");
        } finally {
            setIsApplyingLanguage(false);
        }
    };

    if (
        !isStoreHydrated ||
        isApplyingLanguage ||
        (hasSelectedInterfaceLanguage && interfaceLanguage)
    ) {
        return (
            <ScreenLoader
                label={i18n.language === "ru" ? "Загрузка..." : "Loading..."}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.heroBlock}>
                <View>
                    <View style={styles.iconWrap}>
                        <Image
                            source={require("@/assets/images/gold-bridge.png")}
                            style={{ width: 270, height: 170 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <Text style={styles.title}>Gjallarbru</Text>
                <Text style={styles.subtitle}>Elder Edda</Text>
                <View style={styles.invocationBlock}>
                    <Text style={styles.invocationLine}>Heilir Æsir!</Text>
                    <Text style={styles.invocationLine}>Heilar Ásynjur!</Text>
                    <Text style={styles.invocationLine}>Heilir Vanir!</Text>
                    <Text style={styles.invocationLine}>Heilar Dísir!</Text>
                    <Text style={styles.invocationLine}>Heilir Forfeðr!</Text>
                </View>

                <Text style={styles.description}>
                    Choose interface language / Выберите язык интерфейса
                </Text>
            </View>

            <View style={styles.buttons}>
                <PressableCard
                    style={styles.button}
                    onPress={() => handleSelectLanguage("ru")}
                >
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Русский</Text>
                    </View>
                </PressableCard>

                <PressableCard
                    style={styles.button}
                    onPress={() => handleSelectLanguage("en")}
                >
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>English</Text>
                    </View>
                </PressableCard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0B0C",
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    heroBlock: {
        alignItems: "center",
        marginBottom: 42,
    },

    iconWrap: {
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 34,
        fontWeight: "700",
        color: "#F3E9D2",
        letterSpacing: 1.2,
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 18,
        color: "#B89B5E",
        letterSpacing: 0.8,
        marginBottom: 28,
    },

    invocationBlock: {
        alignItems: "center",
        marginBottom: 32,
    },

    invocationLine: {
        fontSize: 16,
        lineHeight: 30,
        letterSpacing: 1.1,
        textAlign: "center",
        color: "#B89B5E",
        opacity: 0.78,
    },

    description: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: "center",
        color: "rgba(255,255,255,0.72)",
        maxWidth: 320,
    },

    buttons: {
        gap: 14,
    },

    button: {
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    buttonContent: {
        minHeight: 58,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    buttonText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#F5F1E8",
        letterSpacing: 0.4,
        textAlign: "center",
    },
});
