import * as fh from "../fileHandler.js";
import { redrawBlockById } from "../workspace.js";
import * as general from "../generalScripts.js";

export function addEditInputBeginListener(element) {
    let tileContainer = element;
    let blockRefId = parseInt(tileContainer.dataset.refId);

    tileContainer.querySelectorAll(".inputs .row[data-editable]").forEach((row) => {
        let input = row.querySelector(".value");

        row.addEventListener("click", (event) => {
            if (!row.dataset.connectionId) {
                row.dataset.editing = true;
                selectElementContents(input);
            }
            // tileContainer.querySelectorAll(".outputs .row").forEach((i) => {
            //     if (i.dataset.editing == "true") {
            //         let rowRefId = parseInt(i.dataset.refId);
            //         cancelEdit(blockRefId, rowRefId);
            //     }
            // });
        });
    });
}