'use client';

import {
    useAccount,
    useChains,
    useCollateral,
    useDeposit,
    useWithdraw
  } from '@orderly.network/hooks';
  import { API } from '@orderly.network/types';
  import { Button, Flex, Grid, Heading, Input, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
  import { JsonRpcSigner } from 'ethers';
  import { FC, useMemo, useState } from 'react';
  
  import { testnetChainId } from '../app/core/network';
  
  export const Assets: FC<{
    signer?: JsonRpcSigner;
  }> = ({ signer }) => {
    const { account } = useAccount();
    const collateral = useCollateral();
    const [chains] = useChains('testnet', {
      filter: (item: API.Chain) => item.network_infos?.chain_id === Number(testnetChainId)
    });
  
    const token = useMemo(() => {
      return Array.isArray(chains) ? chains[0].token_infos[0] : undefined;
    }, [chains]);
  
    const [amount, setAmount] = useState<string | undefined>();

  
  
    const deposit = useDeposit({
      address: token?.address,
      decimals: token?.decimals,
      srcToken: token?.symbol,
      srcChainId: Number(testnetChainId)
    });

    const handleDeposit = async () => {
      try {
        // Ensure amount is valid
        if (amount == null || isNaN(Number(amount))) {
          console.log("Invalid amount");
          return;
        }
    
        const amountNumber = Number(amount);
    
        // Check if the allowance is sufficient
        if (Number(deposit.allowance) < amountNumber) {
          console.log("Approving amount...");
          await deposit.approve(amountNumber.toString());
          console.log("Approved:", amountNumber.toString());
        } else {
          console.log("Depositing amount...");
          // Convert amountNumber to string before setting the quantity
          deposit.setQuantity(amountNumber.toString());
          // Perform the deposit
          const depositResult = await deposit.deposit();
          console.log("Deposit result:", depositResult);
          console.log("Deposited:", amountNumber);
        } 
      } catch (error) {
        console.error("Error occurred during deposit:", error);
      }
    };
    
    
    

    console.log("deposit address", deposit)
    console.log("collateral", collateral)
  
    const { withdraw, unsettledPnL } = useWithdraw();

    return (
      <Flex mt="1.5rem" gap="3" align="center" justify="center" direction="column">
        <Heading as="h2">Assets</Heading>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Category</Th>
              <Th>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Wallet Balance:</Td>
              <Td>{deposit.balance}</Td>
            </Tr>
            <Tr>
              <Td>Deposit Balance:</Td>
              <Td>{collateral.availableBalance}</Td>
            </Tr>
            <Tr>
              <Td>Unsettled PnL:</Td>
              <Td>{unsettledPnL}</Td>
            </Tr>
          </Tbody>
        </Table>
        <Grid
          templateColumns="repeat(2, 1fr)"
          templateRows="repeat(4, 1fr)"
          gap="1"
          mt="1rem"
          style={{
            gridTemplateAreas: `'input input' 'deposit withdraw' 'mint mint' 'settlepnl settlepnl'`
          }}
        >
          <Input
            gridArea="input"
            type="number"
            step="0.01"
            min="0"
            placeholder="USDC amount"
            onChange={(event) => {
              setAmount(event.target.value);
            }}
          />
  
          <Button
            gridArea="deposit"
            disabled={amount == null}
            onClick={handleDeposit}
          >
            {Number(deposit.allowance) < Number(amount) ? 'Approve' : 'Deposit'}
          </Button>
  
          <Button
            gridArea="withdraw"
            disabled={amount == null}
            onClick={async () => {
              if (amount == null) return;
              await withdraw({
                chainId: Number(testnetChainId),
                amount,
                token: 'USDC',
                allowCrossChainWithdraw: false
              });
            }}
          >
            Withdraw
          </Button>
  
  
          <Button
            gridArea="settlepnl"
            disabled={signer == null && unsettledPnL > 0}
            onClick={async () => {
              await account.settle();
            }}
          >
            Settle PnL
          </Button>
        </Grid>
      </Flex>
    );
  };
  