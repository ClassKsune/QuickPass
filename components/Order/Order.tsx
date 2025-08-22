import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { OrdeNoItemsCartWrapperStyled, OrderCartWholeWrapperStyled, OrderCartWrapperStyled, OrderContainerStyled, OrderDeliveryWrapperStyled, OrderInfoWrapperStyled, OrderLoginWrapperStyled, OrderProductsWrapperStyled, OrderRowWrapperStyled, OrderTotalProductWrapperStyled, OrderTotalWrapperStyled, OrderVirtualCartWrapperStyled, OrderWrapperStyled } from "./Order.style";
import { TextInput } from "@mantine/core";
import { useSession } from "next-auth/react"; 
import { useMemo, useState } from "react";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import { useRouter } from "next/navigation";
import { VirtualCardBgStyled } from "../VirtualCard/VirtualCard.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { addToProduct, minusFromProduct } from "@/lib/slices/cartSlice";
import { loadStripe } from '@stripe/stripe-js';
import Image from "next/image";
import { useForm } from "@mantine/form";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { useTranslations } from "next-intl";
import { Shipping } from "./Shipping";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const deliveryPrice = 89;

export const Order = () => {
  const t = useTranslations("Order");
  const tCards = useTranslations("Editor");
  const { data, isLoading } = useSWR('/api/order', fetcher);
  const pendingOrder = useMemo(() => data?.orders.find((order: any) => order.status === "pending"), [data, isLoading]);
  const [packetAddress, setPacketAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const cart = useAppSelector((state) => state.cart);
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const orderForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      country: "Czech Republic",
      name: "",
      surname: "",
      address: "",
      postalCode: "",
      phone: "",
    },
    validate: pendingOrder ? {} : {
      country: (value) => (value.length < 2 ? t("validations.country") : null),
      name: (value) => (value.length < 2 ? t("validations.name") : null),
      surname: (value) => (value.length < 2 ? t("validations.surname") : null),
      address: (value) => (value.length < 5 ? t("validations.address") : null),
      postalCode: (value) => (value.length < 3 ? t("validations.postalCode") : null),
      phone: (value) => (value.length < 9 ? t("validations.phone") : null),
    },
  })

  const handleCheckout = async ({ country, name, surname, address, postalCode, phone }: { country: string; name: string; surname: string; address: string; postalCode: string; phone: string }) => {
    setLoading(true);
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout-sessions', {
      method: 'POST',
      body: JSON.stringify({
        products: cart.products,
        delivery: {
          country,
          name,
          surname,
          address,
          postalCode,
          phone,
          packet: packetAddress,
        }
      }),
    });
    const session = await response.json();
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      console.error("Stripe failed to load.");
    }
    setLoading(false);
  };

  return (
    <OrderWrapperStyled onSubmit={orderForm.onSubmit(handleCheckout)}>
      {user ? (
        <OrderInfoWrapperStyled>
          <h1>{t("order")}</h1>
          <h2>{t("contact")}</h2>
          <div>
            <TextInput
              label={t("email")}
              value={user.email as string}
              disabled
            />
          </div>
          <h2>{t("delivery")}</h2>
          <div>
            {pendingOrder ? (
              <TextInput
                label={t("country")}
                value={pendingOrder.delivery.country}
                disabled
                key="country-disabled"
              />
            ) : (
              <TextInput
                label={t("country")}
                placeholder="Czech Republic"
                key={orderForm.key("country")}
                {...orderForm.getInputProps("country")}
              />
            )}
            <OrderRowWrapperStyled>
              {pendingOrder ? (
                <TextInput
                  label={t("name")}
                  value={pendingOrder.delivery.name}
                  disabled
                  key="name-disabled"
                />
              ) : (
                <TextInput
                  label={t("name")}
                  placeholder="John"
                  key={orderForm.key("name")}
                  {...orderForm.getInputProps("name")}
                />
              )}
              {pendingOrder ? (
                <TextInput
                  label={t("surname")}
                  value={pendingOrder.delivery.surname}
                  disabled
                  key="surname-disabled"
                />
              ) : (
                <TextInput
                  label={t("surname")}
                  placeholder="Smith"
                  key={orderForm.key("surname")}
                  {...orderForm.getInputProps("surname")}
                />
              )}
            </OrderRowWrapperStyled>
            {pendingOrder ? (
              <TextInput
                label={t("address")}
                value={pendingOrder.delivery.address}
                disabled
                key="address-disabled"
              />
            ) : (
              <TextInput
                label={t("address")}
                placeholder="Třída Míru 1141/49, Olomouc"
                key={orderForm.key("address")}
                {...orderForm.getInputProps("address")}
              />
            )}
            {pendingOrder ? (
              <TextInput
                label={t("postalCode")}
                value={pendingOrder.delivery.postalCode}
                disabled
                key="postalCode-disabled"
              />
            ) : (
              <TextInput
                label={t("postalCode")}
                placeholder="779 00"
                key={orderForm.key("postalCode")}
                {...orderForm.getInputProps("postalCode")}
              />
            )}
            {pendingOrder ? (
              <TextInput
                label={t("phone")}
                value={pendingOrder.delivery.phone}
                disabled
                key="phone-disabled"
              />
            ) : (
              <TextInput
                label={t("phone")}
                placeholder="+420 123 456 789"
                key={orderForm.key("phone")}
                {...orderForm.getInputProps("phone")}
              />
            )}
          </div>
          <h2>{t("shipping")}</h2>
          <Shipping pendingOrder={!!pendingOrder} packetAddress={pendingOrder ? pendingOrder.delivery.packet : packetAddress} setPacketAddress={setPacketAddress} />
        </OrderInfoWrapperStyled>
      ) : (
        <OrderLoginWrapperStyled>
          <h2>{t("logIn")}</h2>
          <div>
            <Button onClick={() => router.push("/login")} size={ButtonSize.md} variant={ButtonVariant.PRIMARY} label={t("loginButton")} />
            <Button onClick={() => router.push("/register")} size={ButtonSize.md} variant={ButtonVariant.OUTLINE} label={t("registerButton")} />
          </div>
        </OrderLoginWrapperStyled>
      )}
      <OrderContainerStyled>
        <OrderCartWrapperStyled $count={cart.products.length}>
          {cart.products.map((product) => (
            <OrderCartWholeWrapperStyled key={product.id} $count={cart.products.length}>
              <OrderVirtualCartWrapperStyled>
                  <Image priority src={product.url as string} height={150} width={200} alt={product.url as string} />
                  <VirtualCardBgStyled priority src={`/images/${product.variant}.png`} height={150} width={200} alt={product.variant as string} />
              </OrderVirtualCartWrapperStyled>
              <div>
                <FontAwesomeIcon onClick={() => dispatch(minusFromProduct(product))} icon={faMinusCircle} />
                <span>{product.amount}</span>
                <FontAwesomeIcon onClick={() => dispatch(addToProduct(product))} icon={faPlusCircle} />
              </div>
            </OrderCartWholeWrapperStyled>
          ))}
          {cart.products.length === 0 && <OrdeNoItemsCartWrapperStyled>{t("noItems")}</OrdeNoItemsCartWrapperStyled>}
        </OrderCartWrapperStyled>
        <OrderTotalWrapperStyled>
          <div>
            <h3>{t("info")}</h3>
            <OrderProductsWrapperStyled>
              {cart.products.map((product) => (
                <OrderTotalProductWrapperStyled key={product.id}>
                  <span>{product.amount}x {tCards(`cards.${product.variant}`)}</span>
                  <span>{product.price * product.amount} Kč</span>
                </OrderTotalProductWrapperStyled>
              ))}
            </OrderProductsWrapperStyled>
          </div>
          {(packetAddress || pendingOrder) && (
            <OrderDeliveryWrapperStyled>
              <h3>{t("delivery_price")}</h3>
              <div>
                <span>{deliveryPrice + " Kč"}</span>
              </div>
            </OrderDeliveryWrapperStyled>
        )}
          <div>
            <h3>{t("total")}</h3>
            <span>{cart.products.reduce((acc, product) => acc + product.price * product.amount, packetAddress ? deliveryPrice : 0)} Kč</span>
          </div>
        </OrderTotalWrapperStyled>
      </OrderContainerStyled>
      <Button loading={loading} disabled={(packetAddress === null && !pendingOrder) || cart.products.length === 0 || !user} size={ButtonSize.md} variant={ButtonVariant.PRIMARY} label={t("checkout")} type="submit" />
    </OrderWrapperStyled>
  );
};