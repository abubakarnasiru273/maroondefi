'use client';

import { useAccount } from '@orderly.network/hooks';
import { AccountStatusEnum } from '@orderly.network/types';
import { Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { JsonRpcSigner } from 'ethers';
import { FC, useEffect } from 'react';
import { testnetChainIdHex } from '../app/core/network';

export const Account: FC<{
  signer?: JsonRpcSigner;
}> = ({ signer }) => {
  const { account, state } = useAccount();

  useEffect(() => {
    if (!signer) return;
    account.setAddress(signer.address, {
      provider: window.ethereum,
      chain: {
        id: testnetChainIdHex
      }
    });
  }, [signer, account]);

  return (
    <Flex margin="1.5rem" gap="3" align="center" justify="center" direction="column">
      <Heading as="h2">Account</Heading>

      <Container maxW="240px">
        {state.accountId ? (
          <Flex gap="2" direction="column">
            <Text fontSize="md" fontWeight="bold">
              Orderly Account ID:
            </Text>
            <Text fontSize="md">
              {state.accountId}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Address:
            </Text>
            <Text fontSize="md">
              {state.address}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              User ID:
            </Text>
            <Text fontSize="md">
              {state.userId}
            </Text>
          </Flex>
        ) : (
          <Text fontSize="lg" fontWeight="bold" color="red">
            Not connected!
          </Text>
        )}
      </Container>

      <Button
        disabled={state.status !== AccountStatusEnum.NotSignedIn}
        onClick={async () => {
          await account.createAccount();
        }}
      >
        Create Account
      </Button>

      <Button
        disabled={
          state.status > AccountStatusEnum.DisabledTrading ||
          state.status === AccountStatusEnum.NotConnected
        }
        onClick={async () => {
          await account.createOrderlyKey(30);
        }}
      >
        Create Orderly Key
      </Button>
    </Flex>
  );
};
