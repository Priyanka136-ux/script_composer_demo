"use client";
import {
  Aptos,
  AptosConfig,
  CallArgument,
  Network,
  
} from "@aptos-labs/ts-sdk";

const walletAddress =
  "0x59c3ce271da339c1629dc41e826a30ed4bc77654d56e5fda6143ad8fc103ea29";
export default function Home() {
  // const account = Account.fromPrivateKey({
  //   privateKey: new Ed25519PrivateKey(
  //     process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY as string
  //   ),
  // });
  // console.log("account", account.accountAddress.toString());
  const config = new AptosConfig({
    network: Network.TESTNET,
  });
  const aptos = new Aptos(config);

  const handleScriptComposeSimulation = async () => {

    let transaction = await aptos.transaction.build.scriptComposer({
      sender:"0x1",
      builder: async (builder) => {
          await builder.addBatchedCalls({
            function:
              "0x1::aptos_account::transfer",
            functionArguments: [
              CallArgument.newSigner(0),
              walletAddress,
              1
            ],
            typeArguments: []
          });
        
        return builder;
      }, })
     
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
