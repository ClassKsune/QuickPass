import { CardVariantEnum } from "@/components/Editor/Editor";

export interface ProductState {
  id: string;
  type: 'card';
  price: number;
  amount: number;
  variant: CardVariantEnum;
  url: string;
}

export interface CartState {
  products: ProductState[];
}
