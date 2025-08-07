import { Loader } from '@mantine/core';
import { Order } from './Order';
import { fetcher } from '@/utils/fetcher';
import useSWR from 'swr';
import { OrdersWrapperStyled } from './Orders.style';

export const Orders = () => {
  const { data, error, isLoading } = useSWR('/api/order', fetcher);
  const orders = data?.orders || [];

  if (isLoading) return <Loader />;
  if (error) return <>error loading orders</>

  return (
    <OrdersWrapperStyled>
      {orders.map((order: any) => (
        <Order key={order._id} order={order} />
      ))}
    </OrdersWrapperStyled>
  );
};
