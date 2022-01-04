import * as Comlink from "comlink";
import React, { useCallback, useRef, useEffect, useState } from "react";

import { WorkerApi } from "../workers/comlink.worker";
import Layout from "../components/Layout";

const IndexPage = () => {
    const [standardWorkerResponse, setStandardWorkerResponse] = useState("");
    const [comlinkWorkerResponse, setComlinkWorkerResponse] = useState("");

    const workerRef = useRef<Worker>();
    const comlinkWorkerRef = useRef<Worker>();
    const comlinkWorkerApiRef = useRef<Comlink.Remote<WorkerApi>>();

    const setStandardWorker = useCallback(() => {
        workerRef.current = new Worker("../workers/standard.worker", {
            type: "module",
        });

        workerRef.current.onmessage = (evt) => {
            setStandardWorkerResponse(
                `Standard web-worker Response => ${evt.data}`
            );
        };
    }, []);

    const setComlinkWorker = useCallback(() => {
        comlinkWorkerRef.current = new Worker("../workers/comlink.worker", {
            type: "module",
        });

        comlinkWorkerApiRef.current = Comlink.wrap<WorkerApi>(
            comlinkWorkerRef.current
        );
    }, []);

    const handleStandardWorkerButtonClick = useCallback(() => {
        workerRef.current?.postMessage(100000);
    }, []);

    const handleComlinkWorkerButtonClick = useCallback(async () => {
        const msg = await comlinkWorkerApiRef.current?.calculatePi(100000);
        setComlinkWorkerResponse(`Comlink web-worker response => ${msg}`);
    }, []);

    useEffect(() => {
        setStandardWorker();
        setComlinkWorker();

        return () => {
            workerRef.current?.terminate();
            comlinkWorkerRef.current?.terminate();
        };
    }, []);

    return (
        <Layout title="Next.js + TypeScript + Web-Worker/Comlink">
            <div>
                <h2>{"Standard web-worker!"}</h2>
                <button onClick={handleStandardWorkerButtonClick}>
                    {"Calculate random number by standard web-worker"}
                </button>
                <p>{`Result: ${standardWorkerResponse}`}</p>
            </div>
            <div>
                <h2>{"Comlink web-worker!"}</h2>
                <button onClick={handleComlinkWorkerButtonClick}>
                    {"Calculate random number by comlink web-worker"}
                </button>
                <p>{`Result: ${comlinkWorkerResponse}`}</p>
            </div>
        </Layout>
    );
};

export default IndexPage;
