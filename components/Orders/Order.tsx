import { useRef } from "react";
import { OrderChipStyled, OrderClickWrapperStyled, OrderInfoWrapperStyled, OrderProductsWrapperStyled, OrderProductWrapperStyled, OrderQRWrapperStyled, OrderWrapperStyled } from "./Order.style";
import { VirtualCard } from "../VirtualCard/VirtualCard";
import { QRCodeSVG } from 'qrcode.react';
import { Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

const deliveryPrice = 89

export const Order = ({ order }: any) => {
    const t = useTranslations("Orders");
    const [opened, { toggle }] = useDisclosure(false);
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    const handleLinkDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    };

    const handleDownload = () => {
    if (qrCodeRef.current) {
        const svg = qrCodeRef.current.querySelector('svg');
        if (svg) {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        handleLinkDownload(url, 'qrcode.svg');
        URL.revokeObjectURL(url);
        }
    }
    };

    return (
        <OrderWrapperStyled>
            <OrderClickWrapperStyled onClick={toggle}>
                <div>
                    <span>{order.profile.name} {order.profile.surname}</span>
                    <OrderChipStyled $status={order.status}>{t(`status.${order.status}`)}</OrderChipStyled>
                </div>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </OrderClickWrapperStyled>
            <Collapse in={opened}>
                <div>
                    <OrderInfoWrapperStyled>
                        <span>{t("orderId")}: {order._id}</span>
                        <span>{t("country")}: {order.delivery.country}</span>
                        <span>{t("address")}: {order.delivery.address}</span>
                        <span>{t("postalCode")}: {order.delivery.postalCode}</span>
                        <span>{t("phone")}: {order.delivery.phone}</span>
                        <span>{t("packet")}: {order.delivery.packet}</span>
                        <b>{t("total")}: {order.products.reduce((acc: number, product: any) => acc + product.price * product.amount, deliveryPrice)} Kč</b>
                    </OrderInfoWrapperStyled>
                    <OrderProductsWrapperStyled>
                        {order.products.map((product: any) => (
                            <OrderProductWrapperStyled key={product._id} onClick={() => handleLinkDownload(product.url, product.variant)}>
                                <VirtualCard virtualCard={product} />
                            </OrderProductWrapperStyled>
                        ))}
                    </OrderProductsWrapperStyled>
                    <OrderQRWrapperStyled onClick={handleDownload} ref={qrCodeRef}>
                        <QRCodeSVG value={`${baseUrl}/profile/${order.profile.url}`} />
                    </OrderQRWrapperStyled>
                </div>
            </Collapse>
        </OrderWrapperStyled>
    )
}
