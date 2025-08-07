import { useAppDispatch } from "@/lib/hooks/hooks";
import { resetCart } from "@/lib/slices/cartSlice";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { OrdersSuccessWrapperStyled } from "./OrderSuccess.style";
import { useTranslations } from "next-intl";

export const OrderSuccess = () => {
    const t = useTranslations("Order.success");
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (orderId) {
        axios.get(`/api/order/success?orderId=${orderId}`)
        .then(() => {
            dispatch(resetCart())
            localStorage.removeItem("canvasState");
        })
        }
    }, [orderId])

    if (!orderId) return (
        <OrdersSuccessWrapperStyled>
            <h1>{t("notFound")}</h1>
        </OrdersSuccessWrapperStyled>
    )

    return (
        <OrdersSuccessWrapperStyled>
            <h1>{t("title")}</h1>
            <p>{t("desc")}</p>
        </OrdersSuccessWrapperStyled>
    )
}