import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';
import { TouchableOpacityProps } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { TextStyles } from '@/constants/Text';

interface ThemedTextButtonProps extends TouchableOpacityProps {
    lightColor?: string;
    darkColor?: string;
    colorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
    text: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    textColorType?: keyof typeof Colors.light & keyof typeof Colors.dark;
    textType?: keyof typeof TextStyles;
}

export function ThemedTextButton({ lightColor, darkColor, text, onPress, style, textStyle, textType, colorType, textColorType = "backgroundPrimary"  }: ThemedTextButtonProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, colorType ?? "backgroundSecondary");

    return (
        <TouchableOpacity style={[style, {backgroundColor: color}]} onPress={onPress} >
            <ThemedText style={[textStyle]} colorType={textColorType} type={textType}>{text}</ThemedText>
        </TouchableOpacity>
    );
};