'use client';

import { useOrderEntry } from '@orderly.network/hooks';
import { OrderEntity, OrderSide, OrderType } from '@orderly.network/types';
import { Button, Flex, Heading, Select, Text, Input } from '@chakra-ui/react';
import { FC } from 'react';

export const CreateOrder: FC = () => {
  const { onSubmit } = useOrderEntry(
    {
      symbol: 'PERP_ETH_USDC',
      side: OrderSide.BUY,
      order_type: OrderType.MARKET
    },
    { watchOrderbook: true }
  );

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formValue = Object.fromEntries(formData) as unknown as OrderEntity;
    await onSubmit(formValue);
  };

  return (
    <Flex mt="1.5rem" gap="3" align="center" justify="center" direction="column">
      <Heading as="h2">Create Order</Heading>

      <form onSubmit={onFormSubmit}>
        <Flex gap="2" align="stretch" justify="center" direction="column">
          <label>
            Price (USDC):
            <Input type="number" step="0.1" min="2000" name="order_price" />
          </label>

          <label>
            Amount (ETH):
            <Input type="number" step="0.01" min="0" name="order_quantity" />
          </label>

          <label>
            Order Type:
            <Select defaultValue={OrderType.LIMIT} name="order_type">
              <option value={OrderType.LIMIT}>{OrderType.LIMIT}</option>
              <option value={OrderType.MARKET}>{OrderType.MARKET}</option>
            </Select>
          </label>

          <label>
            Side:
            <Select defaultValue={OrderSide.BUY} name="side">
              <option value={OrderSide.BUY}>{OrderSide.BUY}</option>
              <option value={OrderSide.SELL}>{OrderSide.SELL}</option>
            </Select>
          </label>

          <Input type="text" name="symbol" defaultValue="PERP_ETH_USDC" style={{ display: 'none' }} />

          <Button type="submit">Submit</Button>
        </Flex>
      </form>
    </Flex>
  );
};
