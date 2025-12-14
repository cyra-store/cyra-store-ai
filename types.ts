
export interface Product {
  id: string;
  name: string;
  nameKm?: string; // Added
  description: string;
  descriptionKm?: string; // Added
  price: number;
  costPrice: number; // For admin dashboard
  category: string;
  categoryKm?: string; // Added
  image: string;
  rating: number;
  reviews: number;
  isNewArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameKm?: string; // Added
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  user: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped';
  customer: {
    name: string;
    phone: string;
    address: string;
    province: string;
  };
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isProductRecommendation?: boolean;
  recommendedProductIds?: string[];
  image?: string; // For user uploads
}
