import { useEffect } from "react";
import { ShippingWrapperStyled } from "./Shipping.style";
import { useTranslations } from "next-intl";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Colors } from "@/utils";

export const Shipping = ({ pendingOrder, packetAddress, setPacketAddress }: { pendingOrder: boolean; packetAddress: string | null; setPacketAddress: Function }) => {
  const t = useTranslations("Order");

  useEffect(() => {
    // Načti Packeta widget pouze jednou
    const script = document.createElement("script");
    script.src = "https://widget.packeta.com/v6/www/js/library.js";
    script.async = true;
    document.body.appendChild(script);

    // Funkce pro callback
    (window as any).showSelectedPickupPoint = (point: any) => {
      setPacketAddress(point.formatedValue ?? null)
    };

    return () => {
      document.body.removeChild(script);
      delete (window as any).showSelectedPickupPoint;
    };
  }, []);

  const handleOpenWidget = () => {
    const packetaOptions = {
      country: "cz,sk",
      language: "cs",
      valueFormat: 'carrierId,carrierPickupPointId,name,city,street',
      view: "modal",
    };
    // @ts-ignore
    if (window.Packeta && window.Packeta.Widget) {
      // @ts-ignore
      window.Packeta.Widget.pick(
        process.env.NEXT_PUBLIC_PACKET_API_KEY,
        // @ts-ignore
        window.showSelectedPickupPoint,
        packetaOptions
      );
    }
  };

  return (
    <ShippingWrapperStyled>
      {packetAddress && (
        <span>
          <FontAwesomeIcon color={Colors.error} icon={faLocationDot} />
          {packetAddress}
        </span>
    )}
      <Button disabled={pendingOrder} size={ButtonSize.md} variant={ButtonVariant.SECONDARY} label={t("packet")} onClick={handleOpenWidget} />
    </ShippingWrapperStyled>
  );
};
