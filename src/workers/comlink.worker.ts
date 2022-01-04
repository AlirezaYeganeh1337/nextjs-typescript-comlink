import * as Comlink from "comlink";
import random from "../utils/random";

const calculatePi = (data: number) => {
    return random(0, data);
};

export interface WorkerApi {
    calculatePi: typeof calculatePi;
}

const workerApi: WorkerApi = {
    calculatePi,
};

Comlink.expose(workerApi);
