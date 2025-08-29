import { CardVariantEnum, Editor } from "./Editor";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { addProduct, resetCart } from "@/lib/slices/cartSlice";
import { useRouter } from "next/navigation";

interface CardWithUrl {
  variant: CardVariantEnum;
  url: string;
  json?: any;
  svg?: string;
  objects?: any[];
}

export const CardEditor = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleOrder = async (cards: CardWithUrl[]) => {
        try {
            dispatch(resetCart());
            cards.forEach((card) => {
                if (card.url) {
                    dispatch(addProduct({ 
                        variant: card.variant, 
                        url: card.url, 
                        amount: 1, 
                        type: "card", 
                        price: 1249 
                    }));
                }
            });
            router.push("/order");
        } catch (error) {
            console.error('Error handling order:', error);
        }
    };

    return <Editor handleOrder={handleOrder} />;
};