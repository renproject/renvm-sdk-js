import {
    crossChainParamsType,
    RenVMCrossChainTransaction,
    RenVMProvider,
    RenVMTransaction,
    RenVMTransactionWithStatus,
    TransactionInput,
} from "@renproject/provider";
import {
    ChainTransactionProgress,
    ChainTransactionStatus,
    eventEmitter,
    EventEmitterTyped,
    generateTransactionHash,
    PromiEvent,
    TxStatus,
    TxSubmitter,
    TypedPackValue,
    utils,
} from "@renproject/utils";

export const RENVM_CHAIN = "RenVM";

class RenVMTxSubmitter<Transaction extends RenVMTransaction>
    implements
        TxSubmitter<
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            }
        >
{
    public chain = "RenVM";
    public _hash: string;

    private version = "1";
    private provider: RenVMProvider;
    private selector: string;
    private params: TypedPackValue;

    public get tx(): TransactionInput<TypedPackValue> {
        return {
            hash: this._hash,
            selector: this.selector,
            version: this.version,
            in: this.params,
        };
    }

    private signatureCallback?: (
        response: RenVMTransactionWithStatus<Transaction>,
    ) => Promise<void>;
    public eventEmitter: EventEmitterTyped<{
        progress: [
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            },
        ];
    }>;

    public progress: ChainTransactionProgress & {
        response?: RenVMTransactionWithStatus<Transaction>;
    };

    private updateProgress = (
        progress: Partial<
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            }
        >,
    ) => {
        this.progress = {
            ...this.progress,
            ...progress,
        };
        this.eventEmitter.emit("progress", this.progress);
        return this.progress;
    };

    public constructor(
        provider: RenVMProvider,
        selector: string,
        params: TypedPackValue,
        signatureCallback?: (
            response: RenVMTransactionWithStatus<Transaction>,
        ) => Promise<void>,
    ) {
        this.provider = provider;
        this.selector = selector;
        this.params = params;
        this.eventEmitter = eventEmitter();
        this.signatureCallback = signatureCallback;

        this._hash = utils.toURLBase64(
            generateTransactionHash(this.version, this.selector, this.params),
        );

        this.progress = {
            chain: RENVM_CHAIN,
            status: ChainTransactionStatus.Ready,
            target: 1,
            transaction: {
                chain: RENVM_CHAIN,
                txid: this._hash,
                txidFormatted: this._hash,
                txindex: "0",
            },
        };
    }

    public submit(): PromiEvent<
        ChainTransactionProgress & {
            response?: RenVMTransactionWithStatus<Transaction>;
        },
        {
            progress: [
                ChainTransactionProgress & {
                    response?: RenVMTransactionWithStatus<Transaction>;
                },
            ];
        }
    > {
        const promiEvent = utils.newPromiEvent<
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            },
            {
                progress: [
                    ChainTransactionProgress & {
                        response?: RenVMTransactionWithStatus<Transaction>;
                    },
                ];
            }
        >(this.eventEmitter);

        (async (): Promise<
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            }
        > => {
            // Alternate trying to submit and trying to query.
            const retries = 4;
            let errorInner;
            for (let i = 0; i < retries; i++) {
                try {
                    await this.provider.submitTx(this.tx, 1);
                    break;
                } catch (error) {
                    errorInner = error;
                }
                try {
                    await this.provider.queryTx(this._hash, 1);
                    break;
                } catch (error) {
                    // Ignore error.
                }
                if (i === retries - 1) {
                    throw errorInner;
                }
            }

            return this.updateProgress({
                status: ChainTransactionStatus.Confirming,
            });

            // const response = {
            //     version: parseInt(tx.version),
            //     hash: tx.hash,
            //     selector: tx.selector,
            //     in: unmarshalTypedPackValue(tx.in),
            // };
        })()
            .then(promiEvent.resolve)
            .catch(promiEvent.reject);

        return promiEvent;
    }

    public wait(): PromiEvent<
        ChainTransactionProgress & {
            response?: RenVMTransactionWithStatus<Transaction>;
        },
        {
            progress: [
                ChainTransactionProgress & {
                    response?: RenVMTransactionWithStatus<Transaction>;
                },
            ];
        }
    > {
        const promiEvent = utils.newPromiEvent<
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            },
            {
                progress: [
                    ChainTransactionProgress & {
                        response?: RenVMTransactionWithStatus<Transaction>;
                    },
                ];
            }
        >(this.eventEmitter);

        (async (): Promise<
            ChainTransactionProgress & {
                response?: RenVMTransactionWithStatus<Transaction>;
            }
        > => {
            let tx: RenVMTransactionWithStatus<Transaction>;
            let existingStatus: TxStatus | undefined = undefined;
            while (true) {
                try {
                    tx = await this.provider.queryTx(this._hash, 1);
                    if (tx && tx.txStatus === TxStatus.TxStatusDone) {
                        break;
                    }
                    if (
                        tx.txStatus !== existingStatus ||
                        !this.progress.response
                    ) {
                        try {
                            existingStatus = tx.txStatus;
                            this.updateProgress({
                                response: tx,
                                status: ChainTransactionStatus.Done,
                            });
                        } catch (error) {
                            // Ignore non-critical error.
                        }
                    }
                } catch (error: unknown) {
                    if (
                        error instanceof Error &&
                        /(not found)|(not available)/.exec(
                            String((error || {}).message),
                        )
                    ) {
                        // ignore
                    } else {
                        console.error(error);
                        // TODO: throw unexpected errors
                    }
                }
                await utils.sleep(15 * utils.sleep.SECONDS);
            }

            const maybeCrossChainTx = tx as any as RenVMCrossChainTransaction;
            if (
                maybeCrossChainTx.out &&
                maybeCrossChainTx.out.revert &&
                maybeCrossChainTx.out.revert.length > 0
            ) {
                const revertMessage = maybeCrossChainTx.out.revert;
                this.updateProgress({
                    status: ChainTransactionStatus.Reverted,
                    revertReason: revertMessage,
                });
                throw new Error(`RenVM transaction reverted: ${revertMessage}`);
            }

            if (this.signatureCallback) {
                await this.signatureCallback(tx);
            }

            return this.updateProgress({
                response: tx,
                status: ChainTransactionStatus.Done,
            });
        })()
            .then(promiEvent.resolve)
            .catch(promiEvent.reject);

        return promiEvent;
    }
}

export class RenVMCrossChainTxSubmitter extends RenVMTxSubmitter<RenVMCrossChainTransaction> {
    public constructor(
        provider: RenVMProvider,
        selector: string,
        params: RenVMCrossChainTransaction["in"],
        signatureCallback?: (
            response: RenVMTransactionWithStatus<RenVMCrossChainTransaction>,
        ) => Promise<void>,
    ) {
        super(
            provider,
            selector,
            {
                t: crossChainParamsType,
                v: {
                    txid: utils.toURLBase64(params.txid),
                    txindex: params.txindex.toFixed(),
                    amount: params.amount.toFixed(),
                    payload: utils.toURLBase64(params.payload),
                    phash: utils.toURLBase64(params.phash),
                    to: params.to,
                    nonce: utils.toURLBase64(params.nonce),
                    nhash: utils.toURLBase64(params.nhash),
                    gpubkey: utils.toURLBase64(params.gpubkey),
                    ghash: utils.toURLBase64(params.ghash),
                },
            },
            signatureCallback,
        );
    }
}