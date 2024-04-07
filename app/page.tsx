'use client';

import { OrderlyConfigProvider } from '@orderly.network/hooks';

import Dashboard from "@/components/dashboard";

export default function Home() {
  return (
    <div>
      <OrderlyConfigProvider networkId="testnet" brokerId="woofi_pro">
      <Dashboard />
      </OrderlyConfigProvider>
    </div>

  );
}
