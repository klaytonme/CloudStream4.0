document.querySelectorAll(".lmDrop .title").forEach((element) => {
    element.addEventListener("click", (e) => {
        let dat = element.parentElement.dataset;
        dat.active = dat.active == "true" ? "false" : "true";

    });
});