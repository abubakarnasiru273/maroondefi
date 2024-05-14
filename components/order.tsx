'use client';

import { useOrderStream } from '@orderly.network/hooks';
import { OrderSide, OrderStatus, OrderType } from '@orderly.network/types';
import { Button, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { FC } from 'react';

type Order = {
  price: number;
  quantity: number;
  created_time: number;
  order_id: number;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  executed: number;
};

export const Orders: FC = () => {
  const [o, { cancelOrder }] = useOrderStream({ symbol: 'PERP_ETH_USDC' });
  const orders = o as Order[] | null;

  console.log("orders", orders)

  return (
    <Flex mt="1.5rem" gap="3" align="center" justify="center" direction="column">
      <Heading as="h2">Orders</Heading>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Created</Th>
            <Th>Price (USDC)</Th>
            <Th>Quantity (ETH)</Th>
            <Th>Type</Th>
            <Th>Side</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {orders &&
            orders.map(({ created_time, price, quantity, type, side, status, order_id }) => (
              <Tr key={order_id} style={{ verticalAlign: 'middle' }}>
                <Td>{new Date(created_time).toLocaleString()}</Td>
                <Td>{price}</Td>
                <Td>{quantity}</Td>
                <Td>{type}</Td>
                <Td>{side}</Td>
                <Td>{status}</Td>
                <Td>
                  {[OrderStatus.OPEN, OrderStatus.NEW, OrderStatus.PARTIAL_FILLED].includes(
                    status
                  ) && (
                    <Button
                      onClick={async () => {
                        await cancelOrder(order_id, 'PERP_ETH_USDC');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Flex>
  );
};
