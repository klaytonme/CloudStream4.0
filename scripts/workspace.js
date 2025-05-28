import * as fh from "./fileHandler.js";

import * as genSource from "./block/gen/block_source.js"
import * as genTransform from "./block/gen/block_transform.js"
import { initiateVars } from "./block/handlerConnection.js"
import { redrawConnections, deleteConnection } from "./block/handlerConnection.js";

var genObject = {
    source: {
        aveva: genSource.aveva,
        constant: genSource.constant,
        timer: genSource.timer
    },
    transform: {
        parseObj: genTransform.parseObj
    }
}


function initializeWorkspace() {
    var workspace = document.getElementById("workspace");

    addDropHandler(workspace);
    initiateVars();
}



function redrawWorkspace() {
    let workspace = document.getElementById("workspace");
    while (workspace.children.length > 2) workspace.removeChild(workspace.children[2]);


    let data = fh.getAllBlocks();
    data.forEach((elem) => {
        genObject[elem.basic.category][elem.basic.type](elem);
    });

    data = fh.getAllConnections();
    redrawConnections(data);
}


function drawNewBlock(info, pos) {
    let [obj, ref] = fh.getDefaultBlockData(info);
    obj.refId = ref;
    obj.basic.x = pos[0];
    obj.basic.y = pos[1];

    fh.updateBlock(Object.assign({}, obj));
    console.log(obj.basic.category, obj.basic.type);
    genObject[obj.basic.category][obj.basic.type](obj);
}


function redrawBlockById(refId) {
    let workspace = document.getElementById("workspace");
    let block = workspace.querySelector(".tileContainer[data-ref-id='"+refId+"']");
    workspace.removeChild(block);

    let obj = fh.getBlockById(refId);
    genObject[obj.basic.category][obj.basic.type](obj);
}


function deleteBlock(refId) {
    let blockData = fh.getAllBlocks();
    let i;
    for (i = 0; i < blockData.length; i++) {
        if (blockData[i].refId == refId) break;
    }

    if (i < blockData.length) blockData.splice(i, 1);
    fh.updateAllBlocks(blockData);

    let connectionData = fh.getAllConnections();
    for (i = 0; i < connectionData.length; i++) {
        if (connectionData[i].source.block == refId || connectionData[i].endpoint.block == refId) {
            deleteConnection(connectionData[i].refId);
        }
    }

    redrawWorkspace();
}


function addDropHandler(workspace) {
    workspace.addEventListener("dragenter", (e) => {
        e.preventDefault();
    })
    workspace.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    workspace.addEventListener("drop", (e) => {
        e.preventDefault();
        var dat = JSON.parse(e.dataTransfer.getData("text"));
        drawNewBlock(dat, [e.layerX, e.layerY]);
    })
}


function getBlockObj(refId) {
    let block = workspace.querySelector(".tileContainer[data-ref-id='"+refId+"']");
    return block;
}

export {initializeWorkspace, redrawWorkspace, redrawBlockById, deleteBlock, getBlockObj};