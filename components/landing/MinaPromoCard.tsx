import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  onPressMina?: () => void;
}

export const MinaPromoCard: React.FC<Props> = ({ onPressMina }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPressMina}
      activeOpacity={0.85}
    >
      {/* 3D Mina Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require('../../assets/images/mina-avatar.png')}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </View>

      {/* Description */}
      <View style={styles.content}>
        <Text style={styles.tag}>{t('landing.mina.tag')}</Text>
        <Text style={styles.title}>{t('landing.mina.title')}</Text>
        <Text style={styles.desc}>{t('landing.mina.desc')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 22,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  tag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D6A2E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    marginVertical: 2,
  },
  desc: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },
});
