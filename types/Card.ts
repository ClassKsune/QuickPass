import { CardVariantEnum } from "@/components/Editor/Editor";

export interface CardState {
  variant: CardVariantEnum | null;
  svg: string | null;
}

export interface CardInitialState {
  cards: CardState[];
}
