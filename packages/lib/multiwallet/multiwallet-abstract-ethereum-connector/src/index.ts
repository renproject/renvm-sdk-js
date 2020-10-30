import { Address } from "@renproject/chains-ethereum";
import { RenNetwork } from "@renproject/interfaces";
import {
    ConnectorEmitter,
    ConnectorInterface,
    ConnectorUpdate,
} from "@renproject/multiwallet-base-connector";
import { HttpProvider, provider } from "web3-providers";

const isResults = <T>(x: { results: T } | T): x is { results: T } =>
    (x as { results: T }).results !== undefined;

const resultOrRaw = <T>(x: { results: T } | T) => {
    if (isResults(x)) {
        return x.results;
    }
    return x;
};

export const ethNetworkToRenNetwork = (id: number | string): RenNetwork => {
    let decodedId = id;
    if (typeof id === "string") {
        try {
            decodedId = parseInt(id);
        } catch (e) {
            decodedId = Buffer.from(id.split("0x").pop() || "", "hex")[0];
        }
    }
    return {
        1: RenNetwork.Mainnet,
        42: RenNetwork.Testnet,
    }[decodedId];
};

export interface EthereumConnectorOptions {
    debug?: boolean;
    // Map chain ids to ren network versions
    networkIdMapper?: typeof ethNetworkToRenNetwork;
}

export type SaneProvider = Exclude<provider, string | null | HttpProvider> & {
    removeListener?: (name: string, listener: unknown) => void;
    close?: () => Promise<void>;
};

export abstract class AbstractEthereumConnector<
    Provider extends SaneProvider = SaneProvider
> implements ConnectorInterface<Provider, Address> {
    supportsTestnet = true;
    networkIdMapper = ethNetworkToRenNetwork;
    emitter: ConnectorEmitter<Provider, Address>;
    constructor({
        debug = false,
        networkIdMapper = ethNetworkToRenNetwork,
    }: EthereumConnectorOptions) {
        this.networkIdMapper = networkIdMapper;
        this.emitter = new ConnectorEmitter<Provider, Address>(debug);
    }
    abstract activate: ConnectorInterface<Provider, Address>["activate"];
    abstract getProvider: ConnectorInterface<Provider, Address>["getProvider"];
    abstract deactivate: ConnectorInterface<Provider, Address>["deactivate"];
    // Get the complete connector status in one call
    async getStatus(): Promise<ConnectorUpdate<Provider, Address>> {
        return {
            account: await this.getAccount(),
            renNetwork: await this.getRenNetwork(),
            provider: await this.getProvider(),
        };
    }

    // Get default ethereum account
    async getAccount() {
        const account = resultOrRaw(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await ((await this.getProvider()) as any).request({
                method: "eth_requestAccounts",
            })
        )[0];
        if (!account) {
            throw new Error("Not activated");
        }
        return account;
    }
    // Cast current ethereum network to Ren network version or throw
    async getRenNetwork() {
        return this.networkIdMapper(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await resultOrRaw((await this.getProvider()) as any).request({
                method: "eth_chainId",
            })
        );
    }
}