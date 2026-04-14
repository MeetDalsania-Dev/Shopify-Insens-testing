import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';

interface Props {
  code: string[];
  onChange: (code: string[]) => void;
}

export default function OtpInput({ code, onChange }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const OTP_LENGTH = 5;

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];

    // Handle paste — fill all boxes at once
    if (text.length > 1) {
      const pastedDigits = text.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      pastedDigits.forEach((d, i) => { newCode[i] = d; });
      onChange(newCode);
      inputRefs.current[Math.min(pastedDigits.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    newCode[index] = text.replace(/\D/g, '');
    onChange(newCode);

    // Auto-advance
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputRefs.current[index] = ref; }}
          value={code[index] ?? ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          selectTextOnFocus
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: colors.white,
            fontSize: 20,
            fontWeight: '700',
            color: colors.textPrimary,
            textAlign: 'center',
            borderWidth: code[index] ? 1.5 : 0,
            borderColor: code[index] ? colors.buttonBg : 'transparent',
          }}
        />
      ))}
    </View>
  );
}
