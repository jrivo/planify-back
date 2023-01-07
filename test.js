const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
    while (true){
        console.log("Hello World");
        await sleep(10000);
    }
}

main();