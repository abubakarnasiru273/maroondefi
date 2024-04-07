'use client';

import { Button, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useEffect, useState } from 'react';

import { Account } from '../components/accounts';
import { Assets } from '../components/assets';
import { CreateOrder } from '../components/createOrder';
import { Orders } from '../components/order';
import { checkValidNetwork } from '../app/core/network';

function Dashboard() {
  const [provider, setProvider] = useState<BrowserProvider | undefined>();
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();

  useEffect(() => {
    async function run() {
      if (!window.ethereum) return;
      const p = new BrowserProvider(window.ethereum);
      setProvider(p);
      const s = await p.getSigner();
      setSigner(s);
    }
    run();
  }, []);

  useEffect(() => {
    if (!provider) return;
    checkValidNetwork(provider);
  }, [provider]);

  return (
    <Container maxW="45rem" mt="2rem" mx="auto">
      <Flex gap="4" align="center" wrap="wrap">
        <Button
          onClick={async () => {
            if (!window.ethereum) return;
            let p = provider;
            if (!provider) {
              p = new BrowserProvider(window.ethereum);
              setProvider(p);
            }
            if (!p) return;
            if (!signer) {
              const s = await p.getSigner();
              setSigner(s);
            }
          }}
        >
          {signer
            ? `${signer.address.substring(0, 6)}...${signer.address.substr(-4)}`
            : 'Connect wallet'}
        </Button>
      </Flex>

      <Tabs defaultIndex={0} mt="1rem">
        <TabList>
          <Tab>Account</Tab>
          <Tab>Assets</Tab>
          <Tab>Create Order</Tab>
          <Tab>Orders</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Account signer={signer} />
          </TabPanel>
          <TabPanel>
            <Assets signer={signer} />
          </TabPanel>
          <TabPanel>
            <CreateOrder />
          </TabPanel>
          <TabPanel>
            <Orders />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default Dashboard;
