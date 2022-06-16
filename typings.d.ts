export interface nftMetadata {
  data: nftData;
  mint: string;
  updateAuthority: string;
}

export interface nftData {
  creators: object[];
  name: string;
  symbol: string;
}
