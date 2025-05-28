export var defaultValues;
var blockData;
var connectionData;
var leftMenuData;

const resources = [
    fetch("../ref/defaultList.json"),
    fetch("../data/importBlockData.json"),
    fetch("../data/importConnectionData.json")
]


export async function loadResources(callback) {
    try {
        const res = await Promise.allSettled(resources);

        const successArray = [];
        res.map(obj => {
            if (obj.status === "fulfilled") {
                successArray.push(obj.value);
            } else {
                console.log("ERROR: One import failed in File Handler");
            }
        });

        const data = await Promise.all(successArray.map((item) => {
            return item.json();
        }));


        for (let dat in data) {;
            if (data[dat].rel == "blockData") {
                blockData = data[dat].data;
            } else if (data[dat].rel == "defaultData") {
                defaultValues = data[dat];
            } else if (data[dat].rel == "connectionData") {
                connectionData = data[dat].data;
            }
        }

        callback();
    } catch(e) {
        console.log("ERROR: Import resources failed in File Handler", e);
    }
}


export function getAllBlocks() {
    return blockData;
}

export function updateAllBlocks(blockData) {
    blockData = blockData;
}

export function getBlockById(refId) {
    for (let i in blockData) {
        if (blockData[i].refId == refId) {
            return blockData[i];
        }
    }
}

export function getAllConnections() {
    return connectionData;
}

export function updateBlock(obj) {
    for (let i in blockData) {
        if (blockData[i].refId == obj.refId) {
            blockData[i] = obj;
            return;
        }
    }

    blockData.push(obj);
}

export function updateConnections(data) {
    connectionData = data;
}

export function getLeftMenuData() {
    return defaultValues;
}

export function getDefaultBlockData(info) {
    console.log(defaultValues);
    let obj = defaultValues[info.category][info.type];


    let ref = 0;
    for (let i in blockData) {
        if (blockData[i].refId > ref) ref++;
    }

    return [obj, ++ref];
}

export function getConnected() {
    connections = {};
}