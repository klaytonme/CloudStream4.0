export function toTitleCase(str) {
    let title = [];
    str.toLowerCase().split(' ').forEach((i) => {title.push(i.charAt(0).toUpperCase() + i.slice(1))});

    return title.join(' ');
}


export function mkE(type, classes=[], textContent="", children=[], context={}) {
    let newElement = document.createElement(type);

    classes = [].concat(classes);
    classes.forEach((i) => {newElement.classList.add(i);});

    newElement.textContent = textContent;

    for (let i in context) {
        newElement[i] = context[i];
    }

    children = [].concat(children);
    children.forEach((i) => {newElement.appendChild(i);});

    return newElement;
}