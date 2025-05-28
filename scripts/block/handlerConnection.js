import * as fh from "../fileHandler.js";
import * as workspace from "../workspace.js";

var prefs = {
    minSpace: 40,
    backCoef: 1
}

var connecting = false;
var connections;
var moving = false;
var origin;
var conSource;
var conEndpoint;

var canvas;
var ctx;
var canvasT;
var ctxT;

var affected;

export function initiateVars() {
    canvas = document.getElementById("splineCanvas");
    ctx = canvas.getContext("2d");

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvasT = document.getElementById("tempCanvas");
    ctxT = canvasT.getContext("2d");

    canvasT.style.width = "100%";
    canvasT.style.height = "100%";
    canvasT.width = canvasT.offsetWidth;
    canvasT.height = canvasT.offsetHeight;
}

export function addConnectionListeners(tileContainer) {
    let refId = tileContainer.dataset.refId;
    
    let outputs = tileContainer.querySelectorAll(".outputs .row");
    outputs.forEach((output) => {

        let connector = output.querySelector(".nodeConnector");
        connector.addEventListener("mousedown", (event) => {

            let conR = connector.getBoundingClientRect();
            let canvR = canvasT.getBoundingClientRect();
            
            origin = [(conR.x + conR.width/2) - canvR.x, (conR.y + conR.height/2) - canvR.y]
            
            conSource = {
                block: refId,
                output: output.dataset.refId
            }

            connecting = true;
        });
    });

    let inputs = tileContainer.querySelectorAll(".inputs .row");
    inputs.forEach((input) => {

        let connector = input.querySelectorAll(".nodeConnector");
        connector.forEach((c) => {c.addEventListener("mousedown", (event) => {
            clearScreenT();
            if (input.dataset.connectionId) {
                connections = fh.getAllConnections();
                connections.forEach((connection) => {
                    if (connection.endpoint.block == refId && connection.endpoint.input == input.dataset.refId) {
                        deleteConnection(connection.refId)
                    }
                });
            };

            if (!connecting) return;

            connecting = false;


            conEndpoint = {
                block: refId,
                input: input.dataset.refId
            };

            addConnection();
            
        });


        c.addEventListener("mouseover", (event) => {
            if (!input.dataset.connectionId) {
                c.style.cursor = "";
                return;
            };
            if (connecting) {
                c.style.cursor = "not-allowed";

            } else {
                c.style.cursor = "cell";
            }
        });})
    });
}

document.addEventListener("mousemove", (event) => {
    if (connecting) {
        let canvR = canvasT.getBoundingClientRect();

        ctxT.clearRect(0,0,canvasT.width,canvasT.height);

        let end = [event.clientX - canvR.x, event.clientY - canvR.y];
        drawConnection(origin, end, ctxT);
    }
});

function clearScreen() {ctx.clearRect(0,0,canvas.width,canvas.height);}
function clearScreenT() {ctxT.clearRect(0,0,canvasT.width,canvasT.height);}

export function redrawConnections(connections) {
    clearScreen();
    clearScreenT();

    connections.forEach((i) => {
        if (moving != i.source.block && moving != i.endpoint.block) {
            let start = getConnectorLocation(i.source.block, i.source.output, 0, canvas);
            let end = getConnectorLocation(i.endpoint.block, i.endpoint.input, 1, canvas);
            
            drawConnection(start, end);
        }
    })
}

export function redrawMovingConnections(connections) {
    clearScreenT();

    connections.forEach((i) => {
        if (moving == i.source.block || moving == i.endpoint.block) {
            let start = getConnectorLocation(i.source.block, i.source.output, 0, canvasT);
            let end = getConnectorLocation(i.endpoint.block, i.endpoint.input, 1, canvasT);
            
            drawConnection(start, end, ctxT);
        }
    })
}

function getConnectorLocation(blockId, connectorId, io, canv) {
    // io = {0: output, 1: input}

    blockId = '[data-ref-id="'+blockId+'"]';
    io = io ? '.inputs' : ' .outputs';
    connectorId = '[data-ref-id="'+connectorId+'"]';

    let workspace = document.getElementById("workspace");
    let connector = workspace.querySelector(".tileContainer" + blockId + " " + io + " " + connectorId + " .nodeConnector");

    let conR = connector.getBoundingClientRect();
    let canvR = canv.getBoundingClientRect();
    let pos = [(conR.x + conR.width/2) - canvR.x, (conR.y + conR.height/2) - canvR.y];

    return pos;
}


function drawConnection(beg, end, contx = ctx) {
    let [p1, p2, p3, p4] = genPoints(beg, end);


    contx.strokeStyle = "white";
    contx.lineWidth = 2;

    contx.beginPath();
    contx.moveTo(p1[0], p1[1]);
    contx.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
    contx.stroke();
}


function addConnection() {
    connections = fh.getAllConnections();
    let i = 1;
    while (connections.find((elem) => elem.refId == i)) {i++;}

    let newConnection = {
        refId: i,
        source: conSource,
        endpoint: conEndpoint
    }
    let tile, row;

    tile = workspace.getBlockObj(newConnection.source.block);
    if (tile) row = tile.querySelector(".outputs [data-ref-id='" + newConnection.source.output + "']");
    if (row) row.dataset.connectionId = i;

    tile = workspace.getBlockObj(newConnection.endpoint.block);
    if (tile) row = tile.querySelector(".inputs [data-ref-id='" + newConnection.endpoint.input + "']");
    if (row) row.dataset.connectionId = i;

    connections.push(newConnection);
    fh.updateConnections(connections);
    redrawConnections(connections);
}


export function deleteConnection(refId) {
    connections = fh.getAllConnections();

    let i;
    for (i = 0; i < connections.length; i++) {
        if (connections[i].refId == refId) break;
    }

    if (i >= connections.length) return;
    let todel = connections[i]; 
    connections.splice(i, 1);
    fh.updateConnections(connections);

    let blockData = fh.getBlockById(todel.source.block);
    if (blockData) {
        blockData.outputs.display.forEach((row) => {
            if (row.refId = todel.source.output) row.connectionId = undefined;
        });
        fh.updateBlock(blockData);
    }

    blockData = fh.getBlockById(todel.endpoint.block);
    if (blockData) {
        blockData.inputs.forEach((row) => {
            if (row.refId = todel.endpoint.input) row.connectionId = undefined;
        });
        fh.updateBlock(blockData);
    }



    let src = workspace.getBlockObj(todel.source.block);
    if (src) {
        let output = src.querySelector(".outputs [data-ref-id='" + todel.source.output + "']");
        output.removeAttribute("data-connection-id");
    }
    
    let end = workspace.getBlockObj(todel.endpoint.block);
    if (end) {
        let input = end.querySelector(".inputs [data-ref-id='" + todel.endpoint.input + "']");
        input.removeAttribute("data-connection-id");
    }

    redrawConnections(connections);
}

function genPoints(beg, end) {
    let d = [end[0] - beg[0], end[1] - beg[1]];

    let p1 = [0, beg[1]];
    p1[0] = d[0] > prefs.minSpace ? beg[0] + d[0]/2 : beg[0] + Math.abs(d[0]/2 - prefs.minSpace);

    let p2 = [0, end[1]];
    p2[0] = d[0] > prefs.minSpace ? beg[0] + d[0]/2 : end[0] - Math.abs(d[0]/2 - prefs.minSpace);

    return [beg, p1, p2, end];
}


document.addEventListener("keydown", (e) => {
    if (e.key == "Escape" && connecting) {
        connecting = false;

        let canvR = canvasT.getBoundingClientRect();
        ctxT.clearRect(0,0,canvasT.width,canvasT.height);
    }
});

export function startDrag(blockId) {
    moving = blockId;

    connections = fh.getAllConnections();
    
    redrawConnections(connections);
    redrawMovingConnections(connections);
}

export function drag() {
    redrawMovingConnections(connections);
}

export function endDrag() {
    moving = false;
    
    redrawConnections(connections);
    clearScreenT();
}