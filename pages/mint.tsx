//import { actions } from "@metaplex/js";
//import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Metaplex,
  walletAdapterIdentity,
  useMetaplexFileFromBrowser,
  bundlrStorage,
  BundlrStorageDriver,
  divideAmount,
} from "@metaplex-foundation/js";

//import { mockStorage } from "@metaplex-foundation/js";

function mint() {
  const [file, setFile] = useState<File>();
  const [nftName, setNftName] = useState("My AMAZING NFT");
  const [symbol, setSymbol] = useState("TEST");
  const [description, setDescription] = useState("this is a test description");

  const wallet = useWallet();
  const { connection } = useConnection();

  const mx = Metaplex.make(connection).use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    })
  );

  if (wallet) {
    mx.use(walletAdapterIdentity(wallet));
  }

  async function onChange(e: React.ChangeEvent<any>) {
    const files = e.target.files[0];
    console.log(files);
    setFile(files);

    //console.log("img: ", file);
  }
  async function onClick(e: React.ChangeEvent<any>) {
    /*  mx.use(mockStorage()); */
    e.preventDefault();
    console.log(file);
    if (!file) {
      return console.error("no image uploaded");
    }
    //fund bundlr account to pay for upload
    const bundlrStorage = mx.storage().driver() as BundlrStorageDriver;
    (await bundlrStorage.bundlr()).fund(1000);

    // upload the image first
    const imageUri = await useMetaplexFileFromBrowser(file);

    // add the image url to metadata
    const { uri, metadata } = await mx.nfts().uploadMetadata({
      name: nftName,
      symbol: symbol,
      description: description,
      image: imageUri,
      properties: {
        files: [
          {
            type: "image/png",
            uri: imageUri,
          },
        ],
      },
    });
    console.log(uri);
    console.log(metadata);

    const { nft } = await mx.nfts().create({
      uri: uri,
    });

    console.log("nft successfully minted: ", nft);
  }

  return (
    <div>
      {wallet ? (
        <form action="">
          <input
            type="file"
            accept=".png,.jpeg"
            placeholder="image"
            onChange={(e) => onChange(e)}
          />
          <button className="bg-green-500" type="submit" onClick={onClick}>
            Mint NFT
          </button>
        </form>
      ) : (
        <p>Please connect wallet </p>
      )}
    </div>
  );
}

export default mint;
