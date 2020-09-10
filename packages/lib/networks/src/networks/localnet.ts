import BasicAdapter from "@renproject/sol/build/localnet/BasicAdapter.json";
import GatewayLogic from "@renproject/sol/build/localnet/GatewayLogicV1.json";
import GatewayRegistry from "@renproject/sol/build/localnet/GatewayRegistry.json";
import RenBTC from "@renproject/sol/build/localnet/RenBTC.json";
import { AbiItem } from "web3-utils";

import { CastNetwork, Contract } from "./network";

const networkID = 42;

// mintAuthority is generated by
// > utils.toChecksumAddress(utils.pubToAddress("... public key ...", true).toString("hex"))

export const renLocalnet = CastNetwork({
    version: "1.0.0",
    name: "localnet" as "localnet",
    chain: "kovan",
    isTestnet: true,
    label: "Localnet",
    chainLabel: "Kovan",
    networkID,
    infura: "https://kovan.infura.io",
    etherscan: "https://kovan.etherscan.io",
    addresses: {
        GatewayRegistry: {
            address: GatewayRegistry.networks[networkID].address,
            abi: GatewayRegistry.abi as AbiItem[],
            artifact: (GatewayRegistry as unknown) as Contract,
        },
        RenERC20: {
            abi: RenBTC.abi as AbiItem[],
            artifact: (RenBTC as unknown) as Contract,
        },
        Gateway: {
            abi: GatewayLogic.abi as AbiItem[],
            artifact: (GatewayLogic as unknown) as Contract,
        },
        BasicAdapter: {
            address: BasicAdapter.networks[networkID].address,
            abi: BasicAdapter.abi as AbiItem[],
            artifact: (BasicAdapter as unknown) as Contract,
        },
    },
});
