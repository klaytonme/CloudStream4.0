import * as editOutputs from "./handlerEditOutputs.js";
import * as tileDrag from "./handlerTileDrag.js";
import * as connection from "./handlerConnection.js";


export function addEditOutputListeners(obj) {
    editOutputs.addArrayToggleListener(obj);
    editOutputs.addEditBeginListener(obj);
    editOutputs.addEditCancelListener(obj);
    editOutputs.addEditConfirmListener(obj);
    editOutputs.addEditDeleteListener(obj);
    editOutputs.addNewOutputListener(obj);
    editOutputs.addHardToggleListener(obj);
    editOutputs.addRelToggleListener(obj);
    
    connection.addConnectionListeners(obj);
};

export function addWorkspaceListeners(obj) {
    tileDrag.addDragListener(obj);
}

