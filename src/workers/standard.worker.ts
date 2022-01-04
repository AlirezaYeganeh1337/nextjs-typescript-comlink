import random from "../utils/random";

addEventListener("message", (event: MessageEvent) => {
    console.log("standard worker event message", event.target, event.type);
    postMessage(random(0, Number(event.data)));
});
