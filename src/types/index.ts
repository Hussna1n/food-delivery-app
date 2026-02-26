export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  distance: number; // km
  offers?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isVeg: boolean;
  isSpicy: boolean;
  calories?: number;
  popular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'picked_up' | 'delivered' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  tip: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  estimatedTime: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}
