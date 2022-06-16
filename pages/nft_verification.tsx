import React, { useEffect } from "react";
import { useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
//import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
//import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import bs58 from "bs58";

import { deprecated } from "@metaplex-foundation/mpl-token-metadata";

// we will get the creators array from a legit NFT that we want to use for gated access
// And check if one of the nfts in the users wallet matches

interface Creator {
  address: string;
  share: number;
  verified: boolean;
}

// This is a token account from an NFT collection that you know is verified & part of the collection
// to test with an nft in your wallet search for your nft on solscan and
// copy/paste that address into VERIFIED_TOKEN_ADDRESS
const VERIFIED_TOKEN_ADDRESS = "38BmVqfCVh9Xu8sSEP8QUHwPEM8fA16F2Bf5rV9aUxeq";

function nft_verification() {
  let [isVerified, setIsVerified] = useState(false);
  let [userNfts, setUserNfts] = useState<deprecated.Metadata[]>([]);
  let [verifiedNftCreators, setVerifiedNftCreators] = useState<
    Creator[] | null
  >([]);
  let [tokenMint, setTokenMint] = useState("");

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  //return the list of creators from a given nft mint
  //this nft mint will be from the nft collection you want to use as a key for gated access
  const getCreatorList = async (tokenMint: string) => {
    const metadataPDA = await deprecated.Metadata.getPDA(
      new PublicKey(tokenMint)
    );
    const tokenMetadata = await deprecated.Metadata.load(
      connection,
      metadataPDA
    );
    console.log(tokenMetadata.data?.data.creators);
    return setVerifiedNftCreators(tokenMetadata.data.data?.creators);
    //console.log(tokenMetadata.data.data.creators);
  };

  const getNftMetadata = async () => {
    if (publicKey != null) {
      //const myNfts = await metaplex.nfts().findAllByOwner(metaplex.identity().publicKey);
      const nftsMetadata = await deprecated.Metadata.findDataByOwner(
        connection,
        publicKey
      );

      //console.log(nftsMetadata);
      return nftsMetadata;
      // setUserNfts(nftsMetadata)
    }
  };

  //Check the verified nft creators array against the nfts in the users wallet
  const checkCreators = (verified: Creator[], nftCreators: Creator[]) => {
    let found = false;

    let result = true;
    for (let i = 0; i < verified.length; i++) {
      const filteredResult = nftCreators.find(
        (creator) =>
          creator.address == verified[i].address &&
          creator.share == verified[i].share &&
          creator.verified == verified[i].verified
      );

      if (filteredResult === undefined) {
        result = false;
        break;
      }
    }
    console.log("result: " + result);
    return result;

    //return found ? true : false;
  };

  const verifyNftasync = async () => {
    let nftArray = await getNftMetadata();
    console.log(nftArray);
    //console.log("got nft array");
    if (nftArray) {
      for (const nft of nftArray) {
        //check creators array to verify
        //const nftCreators: Creator[] = nft.data.creators;
        console.log("checking...");
        let checkedCreators = checkCreators(
          verifiedNftCreators,
          nft.data.creators
        );
        if (checkedCreators) {
          setIsVerified(true);
          let verifiedNft = nft.data.name;
          console.log(verifiedNft);
        }
      }
    }
  };

  const handleClick = () => {
    getCreatorList(VERIFIED_TOKEN_ADDRESS);
    verifyNftasync();
  };

  /* useEffect(() => {
    getCreatorList(VERIFIED_TOKEN_ACCOUNT);
    
    verifyNftasync();
  }, []); */

  return (
    <div className="flex items-center justify-center">
      <button onClick={handleClick} className="bg-slate-300 px-2 rounded-md">
        Verify
      </button>

      {isVerified && <p>Access Granted ✅</p>}
      {!isVerified && <p>You cannot access this page without a verified NFT</p>}
    </div>
  );
}
export default nft_verification;
