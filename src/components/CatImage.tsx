import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface CatImageProps {
  uri: string | null | undefined;
  accessibilityLabel: string;
  /** Same style is used for the photo and the placeholder, so the layout never changes. */
  style: StyleProp<ImageStyle>;
  iconSize?: number;
}

/** Photo of a breed, or a paw placeholder when there is no photo or it fails to load. */
export function CatImage({ uri, accessibilityLabel, style, iconSize = 40 }: CatImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [uri]);

  if (!uri || failed) {
    return (
      <View
        style={[styles.placeholder, style as StyleProp<ViewStyle>]}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`${accessibilityLabel}. No photo available`}
      >
        <Ionicons name="paw" size={iconSize} color={colors.placeholderIcon} />
        {/* Small thumbnails show only the paw, so big system fonts never overflow them. */}
        {iconSize >= 40 ? <Text style={styles.placeholderText}>No photo yet</Text> : null}
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 13,
  },
});
