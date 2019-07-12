import { AbiItem } from "web3-utils";
import DarknodePayment from "darknode-sol/build/main/DarknodePayment.json";
import DarknodePaymentStore from "darknode-sol/build/main/DarknodePaymentStore.json";
import DarknodeRegistry from "darknode-sol/build/main/DarknodeRegistry.json";
import DarknodeRegistryStore from "darknode-sol/build/main/DarknodeRegistryStore.json";
import DarknodeRewardVault from "darknode-sol/build/main/DarknodeRewardVault.json";
import RenToken from "darknode-sol/build/main/RenToken.json";
import ERC20 from "darknode-sol/build/erc/ERC20.json";

export default {
    name: "mainnet",
    chain: "main",
    label: "Mainnet",
    chainLabel: "Mainnet",
    infura: "https://mainnet.infura.io",
    etherscan: "https://etherscan.io",
    addresses: {
        ren: {
            AlternativeREN: {
                address: "0x21C482f153D0317fe85C60bE1F7fa079019fcEbD",
                abi: RenToken.abi as AbiItem[],
            },
            DarknodeRegistryStore: {
                address: DarknodeRegistryStore.networks[1].address,
                abi: DarknodeRegistryStore.abi as AbiItem[],
            },
            DarknodeRegistry: {
                address: DarknodeRegistry.networks[1].address,
                abi: DarknodeRegistry.abi as AbiItem[],
                block: 7007558
            },
            SettlementRegistry: {
                address: "0x119da7a8500ade0766f758d934808179dc551036"
            },
            Orderbook: {
                address: "0x6b8bb175c092de7d81860b18db360b734a2598e0"
            },
            DarknodeRewardVault: {
                address: DarknodeRewardVault.networks[1].address,
                abi: DarknodeRewardVault.abi as AbiItem[],
            },
            DarknodeSlasher: {
                address: "0x0000000000000000000000000000000000000000"
            },
            DarknodePayment: {
                address: DarknodePayment.networks[1].address,
                abi: DarknodePayment.abi as AbiItem[],
            },
            DarknodePaymentStore: {
                address: DarknodePaymentStore.networks[1].address,
                abi: DarknodePaymentStore.abi as AbiItem[],
            }
        },
        shifter: {},
        tokens: {
            REN: {
                address: RenToken.networks[1].address,
                abi: RenToken.abi as AbiItem[],
                decimals: 18,
            },
            DAI: {
                address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
                decimals: 18,
            }
        },
        oldTokens: {
            DGX: {
                address: "0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF",
                decimals: 9,
            },
            TUSD: {
                address: "0x8dd5fbCe2F6a956C3022bA3663759011Dd51e73E",
                decimals: 18,
            },
            REN: {
                address: RenToken.networks[1].address,
                abi: RenToken.abi as AbiItem[],
                decimals: 18,
            },
            ZRX: {
                address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
                decimals: 18,
            },
            OMG: {
                address: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
                decimals: 18,
            },
            ETH: {
                address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                decimals: 18,
            }
        },
        erc: {
            ERC20: {
                abi: ERC20.abi as AbiItem[],
            }
        }
    }
}