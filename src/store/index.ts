import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string;
  deliveryFee: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], restaurantId: null, restaurantName: '', deliveryFee: 0 } as CartState,
  reducers: {
    addItem(state, action: PayloadAction<{ item: MenuItem; restaurantId: string; restaurantName: string; deliveryFee: number }>) {
      const { item, restaurantId, restaurantName, deliveryFee } = action.payload;
      // Clear cart if switching restaurant
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;
      state.deliveryFee = deliveryFee;

      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      const idx = state.items.findIndex(i => i.id === action.payload);
      if (idx === -1) return;
      if (state.items[idx].quantity > 1) {
        state.items[idx].quantity -= 1;
      } else {
        state.items.splice(idx, 1);
        if (state.items.length === 0) state.restaurantId = null;
      }
    },
    setInstructions(state, action: PayloadAction<{ id: string; instructions: string }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.specialInstructions = action.payload.instructions;
    },
    clearCart(state) {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = '';
    },
  },
});

export const { addItem, removeItem, setInstructions, clearCart } = cartSlice.actions;

export const store = configureStore({ reducer: { cart: cartSlice.reducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
