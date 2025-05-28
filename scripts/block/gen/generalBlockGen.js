export function sortOutputs(outputs) {
    let sortedOutputs = [];

    ["internal", "source", "depricated", "user"].forEach((flag) => {
        let nextSet = [];
        for (let i = outputs.length - 1; i >= 0; i--) {
            if (outputs[i].rel == flag) {nextSet.push(outputs.splice(i, 1)[0])}
        }

        nextSet.sort((a, b) => (a.label > b.label) ? 1 : -1);
        sortedOutputs = sortedOutputs.concat(nextSet);
    })

    outputs.sort((a, b) => (a.label > b.label) ? 1 : -1);
    sortedOutputs = sortedOutputs.concat(outputs);

    return sortedOutputs;
}