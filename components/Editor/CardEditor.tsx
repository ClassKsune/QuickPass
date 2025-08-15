import { CardVariantEnum, Editor } from "./Editor";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { addProduct, resetCart } from "@/lib/slices/cartSlice";
import { useRouter } from "next/navigation";

export const CardEditor = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleOrder = async (cards: any[]) => {
        dispatch(resetCart())
        cards.forEach((card: { variant: CardVariantEnum; url: string }) => {
            dispatch(addProduct({ variant: card.variant, url: card.url, amount: 1, type: "card", price: 1249 }));
        })
        router.push("/order")
    };

    return <Editor handleOrder={handleOrder} />
}