import { getLeftMenuData } from "./fileHandler.js";
import { mkE } from "./generalScripts.js";

const anonymousLogoPath = "assets/images/sourceLogos/anonymousLogo.svg";

export function populateLeftMenu() {
    var data = getLeftMenuData();

    populateMenu("source", data.source, document.getElementById("sourceList"));
    populateMenu("endpoint", data.endpoint, document.getElementById("endpointList"));
    populateMenu("transform", data.transform, document.getElementById("transformList"));
}

function populateMenu(category, obj, listElement = document.getElementById("sourceList")) {
    for (let i in obj) {
        let newIcon = mkE('div', 'icon');
        if (obj[i].basic.icon) newIcon.style.backgroundImage = "url('" + obj[i].basic.icon + "')";
        else newIcon.style.backgroundImage = "url('" + anonymousLogoPath + "')";

        let newLabel = mkE('div', 'label', obj[i].basic.title);

        let newContainer = mkE('div', 'container', '', [newIcon, newLabel]);
        newContainer.dataset.category = category;
        newContainer.dataset.type = obj[i].basic.type;
        newContainer.draggable = true;

        listElement.appendChild(newContainer);
    }

    addListDragHandlers(listElement);
}


export function addListDragHandlers(list) {
    list.querySelectorAll(".container").forEach((elem) => {
        addDragHandler(elem);
    });
}

function addDragHandler(elem) {
    elem.addEventListener("dragstart", (e) => {

        var dat = {
            category: elem.dataset.category,
            type: elem.dataset.type
        };
        dat = JSON.stringify(dat);
        e.dataTransfer.setData("text", dat);
    });

    elem.addEventListener("dragend", (e) => {
    });
}