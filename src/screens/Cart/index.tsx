import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, selectCartTotal, addItem, removeItem, clearCart } from '../../store';

const TIPS = [0, 10, 15, 20, 25];

export default function CartScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, restaurantName, deliveryFee } = useSelector((s: RootState) => s.cart);
  const subtotal = useSelector(selectCartTotal);
  const [selectedTip, setSelectedTip] = useState(15);

  const tip = (subtotal * selectedTip) / 100;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tip + tax;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.empty}>
        <Ionicons name="bag-outline" size={60} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Add items from a restaurant to get started</Text>
        <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
          <Text style={styles.browseBtnText}>Browse Restaurants</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Pressable onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart()) }
        ])}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant */}
        <View style={styles.section}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>

        {/* Items */}
        {items.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <View style={[styles.vegDot, { backgroundColor: item.isVeg ? '#10b981' : '#ef4444' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.qtyControls}>
              <Pressable onPress={() => dispatch(removeItem(item.id))} style={styles.qtyBtn}>
                <Ionicons name="remove" size={16} color="#6366f1" />
              </Pressable>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Pressable onPress={() => dispatch(addItem({ item, restaurantId: '', restaurantName, deliveryFee }))} style={styles.qtyBtn}>
                <Ionicons name="add" size={16} color="#6366f1" />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Tip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a Tip</Text>
          <View style={styles.tipRow}>
            {TIPS.map(t => (
              <Pressable key={t} onPress={() => setSelectedTip(t)}
                style={[styles.tipOption, selectedTip === t && styles.tipSelected]}>
                <Text style={[styles.tipText, selectedTip === t && styles.tipTextSelected]}>
                  {t === 0 ? 'None' : `${t}%`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          {[
            ['Subtotal', `$${subtotal.toFixed(2)}`],
            ['Delivery Fee', deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`],
            [`Tip (${selectedTip}%)`, `$${tip.toFixed(2)}`],
            ['Tax (8%)', `$${tax.toFixed(2)}`],
          ].map(([label, value]) => (
            <View key={label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{label}</Text>
              <Text style={styles.summaryValue}>{value}</Text>
            </View>
          ))}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutText}>Proceed to Checkout · ${total.toFixed(2)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  browseBtn: { marginTop: 8, backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  browseBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  section: { backgroundColor: '#fff', marginBottom: 8, padding: 16 },
  restaurantName: { fontSize: 15, fontWeight: '600', color: '#6366f1' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemInfo: { flexDirection: 'row', gap: 10, flex: 1 },
  vegDot: { width: 14, height: 14, borderRadius: 7, marginTop: 3 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#111827' },
  itemPrice: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f0f0ff', borderRadius: 10, padding: 6 },
  qtyBtn: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
  qty: { fontSize: 15, fontWeight: '700', color: '#6366f1', minWidth: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 12 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipOption: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center' },
  tipSelected: { borderColor: '#6366f1', backgroundColor: '#eef2ff' },
  tipText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  tipTextSelected: { color: '#6366f1', fontWeight: '700' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#6b7280' },
  summaryValue: { fontSize: 14, color: '#374151' },
  totalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 16, fontWeight: '800', color: '#6366f1' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  checkoutBtn: { backgroundColor: '#6366f1', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
