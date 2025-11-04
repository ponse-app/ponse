const getColor = (value, grouped, parameter) => {
    const amountOfGaps = grouped.length;

    let whichGap = 0;
    for (let i = 0; i < amountOfGaps; i++) {
        const currentGap = grouped[i];
        if (
            currentGap[currentGap.length - 1].properties[parameter] <= value &&
            value <= currentGap[0].properties[parameter]
        ) {
            whichGap = i;
            break;
        }
    }

    const gapPercentage = (whichGap / (amountOfGaps - 1)) * 100;

    let lightness, hue;

    if (gapPercentage <= 50) {
        lightness = 50 + gapPercentage;
        hue = 120;
    } else {
        lightness = 50 + (100 - gapPercentage);
        hue = 0;
    }

    return `hsl(${hue} 100 ${lightness})`;
};

const group = (toBeGrouped, parameter, maxAmountOfGroups) => {
    // Groups data to the following structure: [[200, 100, ..., 50], [ 40, ..., 30], ..., [29, ..., 10]]
    // Aims to group items equidistantly (every group have the same amount of items)
    // but designed to keep same values in the same group

    const interval = Math.ceil(toBeGrouped.length / maxAmountOfGroups); // Roughfly how many items in a group

    let grouped = []; // Array for the final group

    for (let i = 0, groupNumber = 0; i < toBeGrouped.length; i++) {
        // If there's not a group already and a one is needed, create a new one
        if (grouped.length <= groupNumber) {
            grouped.push([]);
        }

        // Push current value to current group
        grouped[groupNumber].push(toBeGrouped[i]);

        // Check if current value is the same as next one.
        // If it's then delay group change to keep same values in the same group
        if (
            toBeGrouped[i].properties[parameter] ===
            toBeGrouped[i + 1]?.properties[parameter]
        )
            continue;

        // If current group have enough items, change group
        if (grouped[groupNumber].length >= interval) groupNumber++;
    }

    return grouped;
};

const sortBy = (features, parameter) => {
    const sorted = features.toSorted(
        (a, b) => b.properties[parameter] - a.properties[parameter]
    );

    return sorted;
};

export { getColor, group, sortBy };
