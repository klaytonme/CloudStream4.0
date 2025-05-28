import * as fh from "../fileHandler.js";
import { redrawBlockById } from "../workspace.js";
import * as general from "../generalScripts.js";


function selectElementContents(element) {
    var range = document.createRange();
    range.selectNodeContents(element);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    setTimeout(function() {
        element.focus();
    }, 0);
}


export function addEditBeginListener(element) {
    let tileContainer = element;
    let blockRefId = parseInt(tileContainer.dataset.refId);

    tileContainer.querySelectorAll(".outputs .row[data-rel]:not([data-rel='internal'])").forEach((row) => {
        let input = row.querySelector(".editing .label");

        row.querySelector(".display .label").addEventListener("click", (event) => {
            tileContainer.querySelectorAll(".outputs .row").forEach((i) => {
                if (i.dataset.editing == "true") {
                    let rowRefId = parseInt(i.dataset.refId);
                    cancelEdit(blockRefId, rowRefId);
                }
            });
            
            row.dataset.editing = true;
            selectElementContents(input);
        });
    });
}

export function addEditConfirmListener(element) {
    let blockRefId = parseInt(element.dataset.refId);

    element.querySelectorAll(".outputs .row[data-editing]").forEach((row) => {
        let confirmButton = row.querySelector(".confirmButton");
        let nameInput = row.querySelector(".editing .label");
        let typeInput = row.querySelector(".editing select");
        let arrayInput = row.querySelector(".editing .arrayToggle");
        let hardInput = row.querySelector(".editing .hardToggle");
        let relInput = row.querySelector(".editing .relToggle");
        let rowRefId = parseInt(row.dataset.refId);


        let args = {blockRefId: blockRefId, rowRefId: rowRefId, nameInput: nameInput, typeInput: typeInput, arrayInput: arrayInput, relInput: relInput};
        if (relInput) args.relInput = relInput;
        if (hardInput) args.hardInput = hardInput;

        confirmButton.addEventListener("click", (event) => {confirmEdit(args);});

        nameInput.addEventListener("keydown", (event) => {
            if (event.key == 'Enter') {
                confirmEdit(args);
            }
        });
    });
}

function confirmEdit({blockRefId, rowRefId, nameInput, typeInput, arrayInput, hardInput=undefined, relInput=undefined}) {  
    let dat = fh.getBlockById(blockRefId);            
    let rowNumber = dat.outputs.display.findIndex((i) => i.refId === rowRefId);

    if (rowNumber == -1) {
        addNewOutput(blockRefId, nameInputValue);
    } else {
        let nameInputValue = nameInput.textContent.replaceAll(" ", "_");  
        let typeInputValue = typeInput.value.toLowerCase();
        let arrayInputValue = {"array": true, "single": false}[arrayInput.textContent.toLowerCase()];

        dat.outputs.display[rowNumber].name = nameInputValue;
        dat.outputs.display[rowNumber].type = typeInputValue;
        dat.outputs.display[rowNumber].isArray = arrayInputValue;

        if (hardInput) {
            let hardInputValue = {"Hard Type": true, "Soft Type": false}[hardInput.textContent]
            dat.outputs.display[rowNumber].hard = hardInputValue;
        }

        if (relInput) {
            let relInputValue = relInput.dataset.value;
            dat.outputs.display[rowNumber].rel = relInputValue;
        }

        fh.updateBlock(dat);
        redrawBlockById(blockRefId);
    }
}


export function addEditCancelListener(element) {
    let blockRefId = parseInt(element.dataset.refId);

    element.querySelectorAll(".outputs .row[data-editing]").forEach((row) => {
        let editingLabel = row.querySelector(".editing .label");
        let rowRefId = parseInt(row.dataset.refId);

        editingLabel.addEventListener("keydown", (event) => {
            if (event.key == 'Escape') {
                cancelEdit(blockRefId, rowRefId);
            }
        })
    });
}

function cancelEdit(blockRefId, rowRefId) {
    let tileContainer = document.querySelector(".tileContainer[data-ref-id='"+blockRefId+"']");
    let tileDat = fh.getBlockById(blockRefId);
    let rowDat = tileDat.outputs.display.find((i) => i.refId == rowRefId);
    let row = tileContainer.querySelector(".outputs .row[data-ref-id='"+rowRefId+"']");
    
    let editingLabel = row.querySelector(".editing .label");
    let displayLabel = row.querySelector(".display .label");
    let typeDrop = row.querySelector(".editing select");
    let arrayToggle = row.querySelector(".editing .arrayToggle");
    let hardToggle = row.querySelector(".editing .hardToggle");
    let relToggle = row.querySelector(".editing .relToggle");

    editingLabel.textContent = rowDat.name;
    displayLabel.textContent = rowDat.name;
    typeDrop.value = rowDat.type;
    arrayToggle.textContent = rowDat.isArray == undefined ? "Any" : (rowDat.isArray ? "Array" : "Single");
    if (hardToggle) hardToggle.textContent = rowDat.hard ? "Hard Type" : "Soft Type";
    if (relToggle) {
        relToggle.dataset.value = rowDat.rel;
        relToggle.textContent = general.toTitleCase(rowDat.rel);
    }

    row.dataset.editing = false;
}



export function addEditDeleteListener(element) {
    let blockRefId = parseInt(element.dataset.refId);

    element.querySelectorAll(".outputs .row[data-editing]").forEach((row) => {
        let confirmButton = row.querySelector(".deleteButton");
        let rowRefId = parseInt(row.dataset.refId);

        confirmButton.addEventListener("click", (event) => {
            let dat = fh.getBlockById(blockRefId);
            
            let rowNumber = dat.outputs.display.findIndex((i) => i.refId === rowRefId);

            if (rowNumber == -1) {
                redrawBlockById(blockRefId);
            } else {
                dat.outputs.display.splice(rowNumber, 1);
                
                fh.updateBlock(dat);
                redrawBlockById(blockRefId);
            }
        });
    });
}


export function addNewOutputListener(element) {
    let tileContainer = element;
    let blockRefId = parseInt(element.dataset.refId);
    let addButton = tileContainer.querySelector(".addOutput");

    if (addButton == null) return;
    addButton.addEventListener("mousedown", (event) => {
        addButton.style.backgroundColor = "rgb(121, 121, 121)";
        addNewOutput(blockRefId, "unnamed", "user", "obj", "single");
    });

    addButton.addEventListener("mouseup", (event) => {
        addButton.style.backgroundColor = "";
    })
}


function addNewOutput(blockRefId, name, rel, type, isArray=undefined) {
    let dat = fh.getBlockById(blockRefId);
    let max = 0;
    for (let i in dat.outputs.display) {
        if (dat.outputs.display[i].refId > max) {
            max = dat.outputs.display[i].refId;
        }
    }
    let rowRefId = max + 1;

    dat.outputs.display.push({
        refId: rowRefId,
        name: name,
        rel: rel,
        type: type,
        isArray: isArray
    });
    
    fh.updateBlock(dat);
    redrawBlockById(blockRefId);

    let tileContainer = document.querySelector(".tileContainer[data-ref-id='"+blockRefId+"']");
    let row = tileContainer.querySelector(".outputs .row[data-ref-id='"+rowRefId+"']");
    let input = row.querySelector(".editing .label");
    tileContainer.querySelectorAll(".outputs .row").forEach((i) => {
        if (i.dataset.editing == "true") {
            let rowRefId = parseInt(i.dataset.refId);
            cancelEdit(blockRefId, rowRefId);
        }
    });
    
    row.dataset.editing = true;
    selectElementContents(input);
}


export function addArrayToggleListener(element) {
    element.querySelectorAll(".arrayToggle").forEach((toggle) => {
        toggle.addEventListener("click", (event) => {
            let options = ["single", "array", "any"];
            let value = options[(options.indexOf(toggle.textContent.toLowerCase()) + 1) % 3]
            toggle.textContent = general.toTitleCase(value);
        });
    });
}

export function addHardToggleListener(element) {
    element.querySelectorAll(".hardToggle").forEach((toggle) => {
        toggle.addEventListener("click", (event) => {
            let options = ["Hard Type", "Soft Type"];
            let value = options[(options.indexOf(toggle.textContent) + 1) % 2]
            toggle.textContent = value;
        });
    });
}

export function addRelToggleListener(element) {
    element.querySelectorAll(".relToggle").forEach((toggle) => {
        let options = {depricated: ["depricated", "user"], source: ["source", "user"], user: ["source", "user"]}[toggle.dataset.value];
        toggle.addEventListener("click", (event) => {
            let value = options[(options.indexOf(toggle.textContent.toLowerCase()) + 1) % 2]
            toggle.dataset.value = value;
            toggle.textContent = general.toTitleCase(value);
        });
    });
}