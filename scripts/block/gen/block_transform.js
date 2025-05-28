import * as tileHandlers from "../tileHandlers.js";
import * as general from "../../generalScripts.js";
import { mkE } from "../../generalScripts.js";
import { sortOutputs } from "./generalBlockGen.js";

export function parseObj(obj) {

    let newTitle = mkE("div", "title", "", [mkE("span", "label", obj.basic.title), mkE("div", "editIcon")]);

    // SECTION: INFO
    let inputRows = [];
    obj.inputs.forEach((i) => {
        let newRowChildren = []
        newRowChildren.push(mkE("div", "label", i.label));
        newRowChildren.push(mkE("div", "value", i.value));
        if (i.takesInput) {newRowChildren.push(mkE("div", "nodeConnector", "", [mkE("div", ["nodeConnectorDisplay", "ttC"], ""), mkE("div", ["tooltip", "ttT"], i.type)]));}
        
        let newRow = mkE("div", "row", "", newRowChildren);
        newRow.dataset.datatype = i.encrypted ? "encrypted" : i.type;
        if (i.connectionId) newRow.dataset.connectionId = i.connectionId;
        newRow.dataset.refId = i.refId;

        inputRows.push(newRow);
    });
    let newInputs = mkE("div", "inputs", "", inputRows);

    // SECTION: ACTION
    let actionRows = [];
    obj.actions.forEach((i) => {
        let newButton = mkE("div", "button", i.label);
        actionRows.push(newButton);
    });
    let newAction = mkE("div", "actions", "", actionRows);

    // SECTION: OUTPUT
    let outputRows = [];
    let outputsSorted = sortOutputs(obj.outputs.display.map((value) => {return Object.assign({}, value)}));
    //                              ^ This statement passes a copy of the objects list instead of a reference
    
    outputsSorted.forEach((i) => {
        let rowChildren = [];

        rowChildren.push(mkE("div", ["indicator", "ttC"], "", mkE("div", ["tooltip", "ttR"], i.rel)));

        if (i.rel != "internal") {
            let editableChildren = [];
            let editableChildren2 = [];

            let newInputField = mkE("div", "label", i.name);
            newInputField.contentEditable = "true";
            editableChildren.push(newInputField);

            if (i.rel == "source" || i.rel == "depricated" || obj.outputs.sourceFields.includes(i.name)) {
                let relToggle = mkE("div", "relToggle", general.toTitleCase(i.rel));
                relToggle.dataset.value = i.rel;
                editableChildren2.push(relToggle);
            }

            let arrayCondition = i.isArray == undefined ? "Any" : (i.isArray ? "Array" : "Single");
            editableChildren2.push(mkE("div", "arrayToggle", arrayCondition));

            let options = [];
            let typeList = ["bool", "int", "float", "str", "obj", "date", "any"];
            typeList.forEach((j) => {
                let newOption = mkE("option", [], general.toTitleCase(j));
                newOption.value = j;
                options.push(newOption);
            });
            let newSelect = mkE("select", [], "", options);
            newSelect.name = "type";
            newSelect.value = typeList.includes(i.type) ? i.type : "unspecified";

            editableChildren2.push(newSelect);
            editableChildren2.push(mkE("div", "deleteButton"));
            editableChildren2.push(mkE("div", "confirmButton"));
            editableChildren.push(mkE("div", "dropRow", "", editableChildren2));

            rowChildren.push(mkE("div", ["editing", "container"], "", editableChildren));
        }

        rowChildren.push(mkE("div", ["display", "container"], "", [mkE("span", "label", i.name)]));
        rowChildren.push(mkE("div", "nodeConnector", "", [mkE("div", ["nodeConnectorDisplay", "ttC"], ""), mkE("div", ["tooltip", "ttT"], i.type + (i.isArray ? " array" : ""))]));

        let newRow = mkE("div", "row", "", rowChildren);
        newRow.dataset.isarray = i.isArray;
        newRow.dataset.datatype = i.type;
        newRow.dataset.rel = i.rel;
        newRow.dataset.refId = i.refId;
        if (i.connectionId) newRow.dataset.connectionId = i.connectionId;
        if (i.rel != "internal") {newRow.dataset.editing = "false";}

        outputRows.push(newRow);
    });
    outputRows.push(mkE("div", "addOutput", "", mkE("div", "addOutputIcon")));

    let newOutput = mkE("div", "outputs", "", outputRows);

    let newContainer = mkE("div", ["tileContainer", obj.basic.category, obj.basic.type], "", [newTitle, newInputs, newAction, newOutput]);
    newContainer.style.left = obj.basic.x + "px";
    newContainer.style.top = obj.basic.y + "px";
    newContainer.dataset.refId = obj.refId;


    document.getElementById("workspace").appendChild(newContainer);
    

    tileHandlers.addEditOutputListeners(newContainer);
    tileHandlers.addWorkspaceListeners(newContainer);
}