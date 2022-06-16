import React from "react";
import { getOrca, OrcaPoolConfig, Network } from "@orca-so/sdk";
import Decimal from "decimal.js";
import {
  ConnectionContextState,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

function swap() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  //const owner = publicKey;

  const swapTokens = async () => {
    /*** Swap ***/
    //swapping 0.1 SOL for some ORCA
    console.log("endpoint:", connection.rpcEndpoint);
    //settings
    //devnet pool options are limited
    const orca = getOrca(connection, Network.DEVNET);
    const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
    const solToken = orcaSolPool.getTokenB();
    const solAmount = new Decimal(0.1);

    //get quote
    const quote = await orcaSolPool.getQuote(solToken, solAmount);
    const orcaAmount = quote.getMinOutputAmount();
    console.log(
      `Swap ${solAmount.toString()} SOL for at least ${orcaAmount.toNumber()} ORCA`
    );
    // get tx
    if (publicKey) {
      const payload = await orcaSolPool.swap(
        publicKey,
        solToken,
        solAmount,
        orcaAmount
      );

      //sign and send
      const signature = await sendTransaction(payload.transaction, connection);
    }
  };

  return (
    <div>
      <div className="flex justify-center ">
        <form action="" className="bg-slate-300 p-2 space-x-2">
          <select id="pool" name="token_pools" className="">
            <option value="SOL/ORCA">Sol-Orca</option>
            <option disabled value="SOL/USDC">
              SOL-USDC
            </option>
            <option disabled value="SOL/USDC">
              SOL-ETH
            </option>
          </select>
          <input
            type="number"
            id="amount"
            placeholder="swap amount in Sol"
            name="amount"
          />
        </form>
        <button className="bg-green-500 text-sm px-2 " onClick={swapTokens}>
          Token Swap
        </button>
      </div>
    </div>
  );
}

export default swap;
