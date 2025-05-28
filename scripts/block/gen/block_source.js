import * as tileHandlers from "../tileHandlers.js";
import * as general from "../../generalScripts.js";
import * as generalGen from "./generalBlockGen.js";
import * as editOutputs from "../handlerEditOutputs.js";
import * as connection from "../handlerConnection.js";
import { mkE } from "../../generalScripts.js";

export function aveva(obj) {

    let newTitle = mkE("div", "title", "", [mkE("span", "label", obj.basic.title), mkE("div", "editIcon")]);

    // SECTION: INPUT
    let inputRows = [];
    obj.inputs.forEach((i) => {
        let newRowChildren = []
        newRowChildren.push(mkE("div", "label", i.label));
        newRowChildren.push(mkE("div", "value", i.value));
        if (i.isEditable) newRowChildren[newRowChildren.length - 1].contentEditable = "true";
        if (i.takesInput) {newRowChildren.push(mkE("div", "nodeConnector", "", [mkE("div", ["nodeConnectorDisplay", "ttC"], ""), mkE("div", ["tooltip", "ttT"], i.type)]));}
        

        let newRow = mkE("div", "row", "", newRowChildren);
        newRow.dataset.datatype = i.encrypted ? "encrypted" : i.type;
        if (i.connectionId) newRow.dataset.connectionId = i.connectionId;
        newRow.dataset.editable = i.isEditable;
        newRow.dataset.refId = i.refId ? i.refId : inputId;

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
    let outputsSorted = generalGen.sortOutputs(obj.outputs.display.map((value) => {return Object.assign({}, value)}));
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
    
    let newOutput = mkE("div", "outputs", "", outputRows);

    let newContainer = mkE("div", ["tileContainer", obj.basic.category, obj.basic.type], "", [newTitle, newInputs, newAction, newOutput]);
    newContainer.style.left = obj.basic.x + "px";
    newContainer.style.top = obj.basic.y + "px";
    newContainer.dataset.refId = obj.refId;


    document.getElementById("workspace").appendChild(newContainer);
    connection.addConnectionListeners(newContainer);
    tileHandlers.addWorkspaceListeners(newContainer);
}

export function constant(obj) {

    let newTitle = mkE("div", "title", "", [mkE("span", "label", obj.basic.title), mkE("div", "editIcon")]);

    // SECTION: INPUT
    let inputRows = [];
    obj.inputs.forEach((i) => {
        let newRowChildren = []
        newRowChildren.push(mkE("div", "label", i.label));
        newRowChildren.push(mkE("div", "value", i.value));
        if (i.takesInput) {newRowChildren.push(mkE("div", "nodeConnector", "", [mkE("div", ["nodeConnectorDisplay", "ttC"], ""), mkE("div", ["tooltip", "ttT"], i.type)]));}
        

        let newRow = mkE("div", "row", "", newRowChildren);
        newRow.dataset.datatype = i.encrypted ? "encrypted" : i.type;
        if (i.connectionId) newRow.dataset.connectionId = i.connectionId;
        newRow.dataset.editable = i.isEditable;
        newRow.dataset.refId = i.refId ? i.refId : inputId;

        inputRows.push(newRow);
    });
    let newInputs = mkE("div", "inputs", "", inputRows);



    // SECTION: OUTPUT
    let outputRows = [];
    let outputsSorted = generalGen.sortOutputs(obj.outputs.display.map((value) => {return Object.assign({}, value)}));
    //                              ^ This statement passes a copy of the objects list instead of a reference
    
    outputsSorted.forEach((i) => {
        let rowChildren = [];
        let editableChildren = [];
        let editableChildrenDropMenu = [];

        let newInputField = mkE("div", "label", i.name);
        newInputField.contentEditable = "true";
        editableChildren.push(newInputField);


        let hardCondition = i.hard ? "Hard Type" : "Soft Type";
        editableChildrenDropMenu.push(mkE("div", "hardToggle", hardCondition));

        let arrayCondition = i.isArray == undefined ? "Any" : (i.isArray ? "Array" : "Single");
        editableChildrenDropMenu.push(mkE("div", "arrayToggle", arrayCondition));

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

        editableChildrenDropMenu.push(newSelect);
        editableChildrenDropMenu.push(mkE("div", "deleteButton"));
        editableChildrenDropMenu.push(mkE("div", "confirmButton"));
        editableChildren.push(mkE("div", "dropRow", "", editableChildrenDropMenu));

        rowChildren.push(mkE("div", ["editing", "container"], "", editableChildren));

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
    
    let newOutput = mkE("div", "outputs", "", outputRows);

    let newContainer = mkE("div", ["tileContainer", obj.basic.category, obj.basic.type], "", [newTitle, newInputs, newOutput]);
    newContainer.style.left = obj.basic.x + "px";
    newContainer.style.top = obj.basic.y + "px";
    newContainer.dataset.refId = obj.refId;


    document.getElementById("workspace").appendChild(newContainer);
    editOutputs.addArrayToggleListener(newContainer);
    editOutputs.addEditBeginListener(newContainer);
    editOutputs.addEditCancelListener(newContainer);
    editOutputs.addEditConfirmListener(newContainer);
    editOutputs.addEditDeleteListener(newContainer);
    editOutputs.addNewOutputListener(newContainer);
    editOutputs.addHardToggleListener(newContainer);
    
    connection.addConnectionListeners(newContainer);
    tileHandlers.addWorkspaceListeners(newContainer);
}

export function timer(obj) {

    let newTitle = mkE("div", "title", "", [mkE("span", "label", obj.basic.title), mkE("div", "editIcon")]);

    // SECTION: INPUT
    let inputRows = [];
    obj.inputs.forEach((i) => {
        let newRowChildren = []
        newRowChildren.push(mkE("div", "label", i.label));
        newRowChildren.push(mkE("div", "value", i.value));
        if (i.takesInput) {newRowChildren.push(mkE("div", "nodeConnector", "", [mkE("div", ["nodeConnectorDisplay", "ttC"], ""), mkE("div", ["tooltip", "ttT"], i.type)]));}
        

        let newRow = mkE("div", "row", "", newRowChildren);
        newRow.dataset.datatype = i.encrypted ? "encrypted" : i.type;
        if (i.connectionId) newRow.dataset.connectionId = i.connectionId;
        newRow.dataset.editable = i.isEditable;
        newRow.dataset.refId = i.refId ? i.refId : inputId;

        inputRows.push(newRow);
    });
    let newInputs = mkE("div", "inputs", "", inputRows);



    // SECTION: OUTPUT
    let outputRows = [];
    let outputsSorted = generalGen.sortOutputs(obj.outputs.display.map((value) => {return Object.assign({}, value)}));
    //                              ^ This statement passes a copy of the objects list instead of a reference
    
    outputsSorted.forEach((i) => {
        let rowChildren = [];
        
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
    
    let newOutput = mkE("div", "outputs", "", outputRows);

    let newContainer = mkE("div", ["tileContainer", obj.basic.category, obj.basic.type], "", [newTitle, newInputs, newOutput]);
    newContainer.style.left = obj.basic.x + "px";
    newContainer.style.top = obj.basic.y + "px";
    newContainer.dataset.refId = obj.refId;


    document.getElementById("workspace").appendChild(newContainer);
    
    connection.addConnectionListeners(newContainer);

    tileHandlers.addWorkspaceListeners(newContainer);
}