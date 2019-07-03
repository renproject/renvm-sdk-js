import { TransactionConfig } from "web3-core";
import { provider } from "web3-providers";

import { Payload } from "../lib/utils";
import { Token } from "./assets";

interface ContractCall {
    /**
     * The address of the adapter smart contract
     */
    sendTo: string;

    /**
     * The name of the function to be called on the Adapter contract
     */
    contractFn: string;

    /**
     * The parameters to be passed to the adapter contract
     */
    contractParams: Payload;

    // Set transaction options:
    transactionConfig?: TransactionConfig;
}

export interface ShiftInParams extends ContractCall {
    /**
     * The token, including the origin and destination chains
     */
    sendToken: Token;

    /**
     * The amount of `sendToken` to be sent
     */
    sendAmount: number;

    /**
     * An option to override the default nonce generated randomly
     */
    nonce?: string;
}

interface ShiftOutParamsCommon {
    /**
     * The token, including the origin and destination chains
     */
    sendToken: Token;
}

interface ShiftOutParamsContractCall extends ShiftOutParamsCommon, Partial<ContractCall> {

    /**
     * A Web3 provider
     */
    web3Provider: provider;

    /**
     * The account to call the transaction from
     */
    from: string;
}

interface ShiftOutParamsTxHash extends ShiftOutParamsCommon {
    /**
     * The hash of the burn transaction on Ethereum
     */
    txHash: string;
}

interface ShiftOutParamsBurnRef extends ShiftOutParamsCommon {
    /**
     * The reference ID of the burn emitted in the contract log
     */
    burnReference: string;
}

export type ShiftOutParams = ShiftOutParamsContractCall | ShiftOutParamsBurnRef | ShiftOutParamsTxHash;
export type ShiftOutParamsAll = ShiftOutParamsCommon & Partial<ShiftOutParamsContractCall> & Partial<ShiftOutParamsBurnRef> & Partial<ShiftOutParamsTxHash>;