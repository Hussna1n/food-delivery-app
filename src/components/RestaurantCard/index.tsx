import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Restaurant } from '../../types';

interface Props { restaurant: Restaurant; }

export default function RestaurantCard({ restaurant }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/restaurant/${restaurant.id}`)}>
      <View style={styles.imageContainer}>
        <Image source={restaurant.imageUrl} style={styles.image} contentFit="cover" />
        {restaurant.offers && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>{restaurant.offers}</Text>
          </View>
        )}
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.cuisine} numberOfLines={1}>{restaurant.cuisine.join(' · ')}</Text>

        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color="#9ca3af" />
            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.metaItem}>
            <Ionicons name="bicycle-outline" size={13} color="#9ca3af" />
            <Text style={styles.metaText}>
              {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color="#9ca3af" />
            <Text style={styles.metaText}>{restaurant.distance.toFixed(1)} km</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  pressed: { opacity: 0.95, transform: [{ scale: 0.99 }] },
  imageContainer: { height: 180, position: 'relative' },
  image: { width: '100%', height: '100%' },
  offerBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  offerText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  closedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  closedText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 17, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fef3c7', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  rating: { fontSize: 12, fontWeight: '700', color: '#92400e' },
  cuisine: { fontSize: 13, color: '#6b7280', marginBottom: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: '#9ca3af' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#d1d5db' },
});
