const CHAIN_ID = "0x5";
const CHAIN_NAME = "Goerli";
const CONTRACT_ADDRESS = "0x9f4eC39A97634b3dD194a4B7584778492fF84cb2";

const form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let num1 = document.getElementById("num1");
    console.log("num1: ", num1);
    num1 = num1.value;
    if (isNaN(num1)) {
        alert("First input was not a number!");
        return;
    }
    num1 = Number(num1);

    let num2 = document.getElementById("num2");
    console.log("num2: ", num2);
    num2 = num2.value;

    if (isNaN(num2)) {
        alert("Second input was not a number!");
        return;
    }
    num2 = Number(num2);

    const operations = ["add", "sub", "mul", "div"];
    let operationToDo;
    for (let i = 0; i < operations.length; i++) {
        let currentOperation = document.getElementById(operations[i]);
        console.log(i, currentOperation)
        if (currentOperation.checked === true) {
            operationToDo = operations[i];
        }
    }
    console.log("operationToDo: ", operationToDo);

    let result;
    let funcName
    // variable declaration: const, let, var
    if (operationToDo === "add") {
        funcName = "adder";
        result = adder(num1, num2);
    } else if (operationToDo === "sub") {
        funcName = "subber";
        result = subtracter(num1, num2);
    } else if (operationToDo === "mul") {
        funcName = "multer";
        result = multiplier(num1, num2);
    } else if (operationToDo === "div") {
        funcName = "divver";
        result = divider(num1, num2);
    } else {
        alert("Unknown operation. Did you forget to select an operation?");
        return;
    }
    let CONTRACT_ABI = await fetch("./abi.json");
    CONTRACT_ABI = await CONTRACT_ABI.json();
    console.log(CONTRACT_ABI);

    const iface = new ethers.utils.Interface(CONTRACT_ABI);
    const encodedData = iface.encodeFunctionData(funcName, [
        num1, num2
    ])
    try {
        const result = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                from: window.ethereum.selectedAddress,
                to: CONTRACT_ADDRESS,
                data: encodedData
            }]
        })
        console.log(result);
    } catch (error) {
        console.log(error)
        alert("Something went wrong with your tx. Alert the developer.");
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    const encodedFilterTopic = iface.encodeFilterTopics("OperationHappened", [])
    let foundEvent = false
    while (!foundEvent) {
        await new Promise(r => setTimeout(r, 5000)) // sleep 5 seconds
        let currentBlockNumber = await provider.getBlockNumber();
        console.log("currentBlockNumber: ", currentBlockNumber);
        let oldBlockNumber = Number(currentBlockNumber) - 5;
        let logResult = await provider.getLogs({
            from: oldBlockNumber,
            to: currentBlockNumber,
            topics: encodedFilterTopic
        })
        console.log(logResult)
        try {
            const finalResult = Number(logResult[0]["topics"][2]);
            alert("Your result is: " + String(finalResult));
            return
        } catch (error) {
            console.log(error)
            alert("Tx pending, sleeping 5 seconds and then we will check again");
        }
    }
    //alert("Your result is: " + String(result));
})

function adder(num1, num2) {
    return num1 + num2;
}
function subtracter(num1, num2) {
    return num1 - num2;
}
function multiplier(num1, num2) {
    return num1 * num2;
}
function divider(num1, num2) {
    return num1 / num2;
}

async function connectWallet() {
    if (!window.ethereum) {
        alert("No injected provider found. Install Metamask.");
    } else {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];

            const chainId = await window.ethereum.request({
                method: "eth_chainId",
            });

            if (chainId !== CHAIN_ID) {
                alert("Connected to wrong chain! Please change to " + CHAIN_NAME)
            } else {
                alert("Connected to account: " + String(account) + 
                        " and chainId: " + String(chainId));
            }

        } catch {
            alert("Something went wrong connecting. Refresh and try again.");
        }
    }
}