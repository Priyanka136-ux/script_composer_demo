"use client";
import {
  Account,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";
import {
  CallArgument,
  scriptComposerSimpleTransaction,
} from "aptos-script-composer-ts-sdk";
import DELAGATE_SCRIPT_ABI from "@/app/abi/delegatedScripts.json";

const walletAddress =
  "0x59c3ce271da339c1629dc41e826a30ed4bc77654d56e5fda6143ad8fc103ea29";
export const marketIds = [1338, 1339, 1340];
export default function Home() {
  const account = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey(
      process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY as string
    ),
  });
  console.log("account", account.accountAddress.toString());
  const config = new AptosConfig({
    network: Network.TESTNET,
  });
  const aptos = new Aptos(config);

  const handleScriptComposeSimulation = async () => {
    const transaction = await scriptComposerSimpleTransaction({
      sender: account?.accountAddress,
      builder: async (builder: any) => {
        for (const market of marketIds) {
          await builder.addBatchedCalls({
            function:
              "0x7a38039fffd016adcac2c53795ee49325e5ec6fddf3bf02651c09f9a583655a6::delegated_scripts::update_delegated_position",
            functionArguments: [
              CallArgument.newSigner(0),
              walletAddress,
              market,
            ],
            typeArguments: [],
            moduleAbi: DELAGATE_SCRIPT_ABI,
            config: config,
          });
        }
        return builder;
      },
      options: {
        gasUnitPrice: 100,
        maxGasAmount: 5000,
      },
      withFeePayer: true,
      config: config,
    });
    // simulate
    const sim = await aptos.transaction.simulate.simple({
      transaction,
    });
    console.log("simulate", sim);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div onClick={handleScriptComposeSimulation}>Simulate</div>
      </main>
    </div>
  );
}
