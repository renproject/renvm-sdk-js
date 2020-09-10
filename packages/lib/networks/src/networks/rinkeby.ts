import BasicAdapter from "@renproject/sol/build/testnet/BasicAdapter.json";
import GatewayLogic from "@renproject/sol/build/testnet/GatewayLogicV1.json";
import GatewayRegistry from "@renproject/sol/build/testnet/GatewayRegistry.json";
import RenERC20 from "@renproject/sol/build/testnet/RenERC20LogicV1.json";
import { AbiItem } from "web3-utils";

import { CastNetwork, Contract } from "./network";

// mintAuthority is generated by
// > utils.toChecksumAddress(utils.pubToAddress("... public key ...", true).toString("hex"))

export const renRinkeby = CastNetwork({
    version: "1.0.0",
    name: "rinkeby",
    chain: "rinkeby",
    isTestnet: true,
    label: "Rinkeby",
    chainLabel: "Rinkeby",
    networkID: 4,
    infura: "https://rinkeby.infura.io",
    etherscan: "https://rinkeby.etherscan.io",
    addresses: {
        GatewayRegistry: {
            address: "0x1CAD87e16b56815d6a0b4Cd91A6639eae86Fc53A",
            abi: GatewayRegistry.abi as AbiItem[],
            artifact: (GatewayRegistry as unknown) as Contract,
        },
        RenERC20: {
            abi: RenERC20.abi as AbiItem[],
            artifact: (RenERC20 as unknown) as Contract,
        },
        Gateway: {
            abi: GatewayLogic.abi as AbiItem[],
            artifact: (GatewayLogic as unknown) as Contract,
        },
        BasicAdapter: {
            address: "0xC8DD18A151FafFCab1B822108e49b4aE3bFff477",
            abi: BasicAdapter.abi as AbiItem[],
            artifact: (BasicAdapter as unknown) as Contract,
        },
    },
});
