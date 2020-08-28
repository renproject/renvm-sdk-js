import ERC20 from "@renproject/sol/build/erc/ERC20.json";
import BasicAdapter from "@renproject/sol/build/localnet/BasicAdapter.json";
import BCHGateway from "@renproject/sol/build/localnet/BCHGateway.json";
import BTCGateway from "@renproject/sol/build/localnet/BTCGateway.json";
import DarknodePayment from "@renproject/sol/build/localnet/DarknodePayment.json";
import DarknodePaymentStore from "@renproject/sol/build/localnet/DarknodePaymentStore.json";
import DarknodeRegistryLogic from "@renproject/sol/build/localnet/DarknodeRegistryLogicV1.json";
import DarknodeRegistryProxy from "@renproject/sol/build/localnet/DarknodeRegistryProxy.json";
import DarknodeRegistryStore from "@renproject/sol/build/localnet/DarknodeRegistryStore.json";
import DarknodeSlasher from "@renproject/sol/build/localnet/DarknodeSlasher.json";
import GatewayLogic from "@renproject/sol/build/localnet/GatewayLogicV1.json";
import GatewayRegistry from "@renproject/sol/build/localnet/GatewayRegistry.json";
import ProtocolLogic from "@renproject/sol/build/localnet/ProtocolLogicV1.json";
import ProtocolProxy from "@renproject/sol/build/localnet/ProtocolProxy.json";
import RenBCH from "@renproject/sol/build/localnet/RenBCH.json";
import RenBTC from "@renproject/sol/build/localnet/RenBTC.json";
import RenToken from "@renproject/sol/build/localnet/RenToken.json";
import RenZEC from "@renproject/sol/build/localnet/RenZEC.json";
import ZECGateway from "@renproject/sol/build/localnet/ZECGateway.json";
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
        ren: {
            Protocol: {
                address: ProtocolProxy.networks[networkID].address,
                abi: ProtocolLogic.abi as AbiItem[],
                artifact: ProtocolLogic as Contract,
            },
            DarknodeSlasher: {
                address: DarknodeSlasher.networks[networkID].address,
                abi: DarknodeSlasher.abi as AbiItem[],
                artifact: DarknodeSlasher as Contract,
            },
            DarknodeRegistry: {
                address: DarknodeRegistryProxy.networks[networkID].address,
                abi: DarknodeRegistryLogic.abi as AbiItem[],
                artifact: DarknodeRegistryLogic as Contract,
                block: 11974083,
            },
            DarknodeRegistryStore: {
                address: DarknodeRegistryStore.networks[networkID].address,
                abi: DarknodeRegistryStore.abi as AbiItem[],
                artifact: DarknodeRegistryStore as Contract,
            },
            DarknodePayment: {
                address: DarknodePayment.networks[networkID].address,
                abi: DarknodePayment.abi as AbiItem[],
                artifact: DarknodePayment as Contract,
            },
            DarknodePaymentStore: {
                address: DarknodePaymentStore.networks[networkID].address,
                abi: DarknodePaymentStore.abi as AbiItem[],
                artifact: DarknodePaymentStore as Contract,
            },
        },
        gateways: {
            GatewayRegistry: {
                address: GatewayRegistry.networks[networkID].address,
                abi: GatewayRegistry.abi as AbiItem[],
                artifact: GatewayRegistry as Contract,
            },
            RenERC20: {
                abi: RenBTC.abi as AbiItem[],
                artifact: RenBTC as Contract,
            },
            Gateway: {
                abi: GatewayLogic.abi as AbiItem[],
                artifact: GatewayLogic as Contract,
            },
            BasicAdapter: {
                address: BasicAdapter.networks[networkID].address,
                abi: BasicAdapter.abi as AbiItem[],
                artifact: BasicAdapter as Contract,
            },
        },
        tokens: {
            DAI: {
                address: "0xc4375b7de8af5a38a93548eb8453a498222c4ff2",
                decimals: 18,
            },
            BTC: {
                address: RenBTC.networks[networkID].address,
                abi: RenBTC.abi as AbiItem[],
                artifact: RenBTC as Contract,
                decimals: 8,
            },
            ZEC: {
                address: RenZEC.networks[networkID].address,
                abi: RenZEC.abi as AbiItem[],
                artifact: RenZEC as Contract,
                decimals: 8,
            },
            BCH: {
                address: RenBCH.networks[networkID].address,
                abi: RenBCH.abi as AbiItem[],
                artifact: RenBCH as Contract,
                decimals: 8,
            },
            REN: {
                address: RenToken.networks[networkID].address,
                abi: RenToken.abi as AbiItem[],
                artifact: RenToken as Contract,
                decimals: 18,
            },
            ETH: {
                address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                decimals: 18,
            },
        },
        erc: {
            ERC20: {
                abi: ERC20.abi as AbiItem[],
                artifact: ERC20 as Contract,
            },
        },
    },
});
