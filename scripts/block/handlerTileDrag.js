import * as fh from "../fileHandler.js";
import * as connections from "./handlerConnection.js";
import { deleteBlock } from "../workspace.js"

var dragging = false;
var dragElem;
var dragMouseOrigin;
var dragPosOrigin;



document.addEventListener("mousemove", (event) => {
    if (dragging) {
        let left = dragPosOrigin[0] + event.x - dragMouseOrigin[0] < 0 ? 0 : dragPosOrigin[0] + event.x - dragMouseOrigin[0];
        let top = dragPosOrigin[1] + event.y - dragMouseOrigin[1] < 0 ? 0 : dragPosOrigin[1] + event.y - dragMouseOrigin[1];
        dragElem.style.left = left + "px";
        dragElem.style.top = top + "px";
        
        connections.drag();
    }
});


document.addEventListener("keydown", (event) => {
    if (event.key == "Backspace" && dragging) {
        dragging = false;
        deleteBlock(dragElem.dataset.refId);
    }
})

export function addDragListener(tileContainer) {
    let refId = tileContainer.dataset.refId;
    
    let title = tileContainer.querySelector(".title");
    title.addEventListener("mousedown", (event) => {
        if (!dragging) {
            dragElem = tileContainer;
            tileContainer.style.zIndex = 1;
            dragMouseOrigin = [event.x, event.y];
            dragPosOrigin = [parseInt(tileContainer.style.left), parseInt(tileContainer.style.top)];
            
            connections.startDrag(parseInt(dragElem.dataset.refId));
            dragging = true;
        }
    });
        
    title.addEventListener("mouseup", (event) => {
        if (dragging && (event.x != dragMouseOrigin[0] || event.y != dragMouseOrigin[1])) {
            tileContainer.style.zIndex = 0;
            let dat = fh.getBlockById(refId);            
            dat.basic.x = parseInt(tileContainer.style.left);
            dat.basic.y = parseInt(tileContainer.style.top);
            
            fh.updateBlock(dat);

            connections.endDrag();

            dragging = false;
        }
    });
}