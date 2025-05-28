console.clear();
import { loadResources } from "./fileHandler.js";
import { initializeWorkspace, redrawWorkspace } from "./workspace.js";
import { populateLeftMenu } from "./leftMenu.js";



await loadResources(() => {
    populateLeftMenu();

    initializeWorkspace();
    redrawWorkspace();
});