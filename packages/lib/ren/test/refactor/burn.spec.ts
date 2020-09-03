// tslint:disable: no-console

import { Bitcoin, Ethereum } from "@renproject/chains";
import { RenNetwork } from "@renproject/interfaces";
import { renTestnet } from "@renproject/networks";
import BigNumber from "bignumber.js";
import chai from "chai";
import CryptoAccount from "send-crypto";
import HDWalletProvider from "truffle-hdwallet-provider";

import RenJS from "../../src/index";

chai.should();

require("dotenv").config();

const MNEMONIC = process.env.MNEMONIC;
const PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY;

describe("Refactor", () => {
    it("burning from contract", async function () {
        this.timeout(100000000000);

        const infuraURL = `${renTestnet.infura}/v3/${process.env.INFURA_KEY}`; // renBscTestnet.infura
        const provider = new HDWalletProvider(MNEMONIC, infuraURL, 0, 10);

        const asset = "BTC";
        const from = Ethereum(provider, RenNetwork.Testnet);

        const account = new CryptoAccount(PRIVATE_KEY, { network: "testnet" });
        const recipient = await account.address(asset);

        const renJS = new RenJS("testnet");

        // Use 0.0001 more than fee.
        const fees = await renJS.getFees();
        const suggestedAmount = new BigNumber(
            Math.floor(fees[asset.toLowerCase()].burn + 0.0001 * 1e8)
        )
            .decimalPlaces(0)
            .toFixed();

        const gateway = await from.getGatewayContractAddress(asset);

        const burnAndRelease = await renJS.burnAndRelease({
            asset,
            to: Bitcoin().Address(recipient),
            from: from.Contract((btcAddress) => ({
                // The contract we want to interact with
                sendTo: gateway,

                // The name of the function we want to call
                contractFn: "burn",

                // Arguments expected for calling `deposit`
                contractParams: [
                    {
                        type: "bytes" as const,
                        name: "_to",
                        value: btcAddress,
                    },
                    {
                        type: "uint256" as const,
                        name: "_amount",
                        value: suggestedAmount,
                    },
                ],
            })),
        });

        let confirmations = 0;

        await burnAndRelease
            .burn()
            .on("confirmation", (confs) => {
                confirmations = confs;
            })
            .on("transactionHash", console.log);

        await burnAndRelease
            .release()
            .on("status", (status) =>
                status === "confirming"
                    ? console.log(`confirming (${confirmations}/15)`)
                    : console.log(status)
            )
            .on("txHash", console.log);
    });

    it("burning from address", async function () {
        this.timeout(100000000000);

        const infuraURL = `${renTestnet.infura}/v3/${process.env.INFURA_KEY}`; // renBscTestnet.infura
        const provider = new HDWalletProvider(MNEMONIC, infuraURL, 0, 10);

        const asset = "BTC";
        const from = Ethereum(provider, RenNetwork.Testnet);

        const account = new CryptoAccount(PRIVATE_KEY, { network: "testnet" });
        const recipient = await account.address(asset);

        const renJS = new RenJS("testnet");

        // Use 0.0001 more than fee.
        const fees = await renJS.getFees();
        const suggestedAmount = new BigNumber(
            Math.floor(fees[asset.toLowerCase()].burn + 0.0001 * 1e8)
        )
            .decimalPlaces(0)
            .toFixed();

        const burnAndRelease = await renJS.burnAndRelease({
            asset,
            to: Bitcoin().Address(recipient),
            from: from.Account({ value: suggestedAmount }),
        });

        let confirmations = 0;

        await burnAndRelease
            .burn()
            .on("confirmation", (confs) => {
                confirmations = confs;
            })
            .on("transactionHash", console.log);

        await burnAndRelease
            .release()
            .on("status", (status) =>
                status === "confirming"
                    ? console.log(`confirming (${confirmations}/15)`)
                    : console.log(status)
            )
            .on("txHash", console.log);
    });
});