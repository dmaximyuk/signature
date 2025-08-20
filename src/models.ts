type Signature = string | undefined;

export interface DecodeParams {
  botToken: string;
}

export type DecodeFunction<T> = (params: DecodeParams, signature: Signature) => T | undefined;
export type EncodeFunction = (initDataRaw: string | null | undefined) => Signature;
