const getColor = (value, grouped, parameter) => {
    const amountOfGaps = grouped.length;

    if (amountOfGaps === 1) return "hsl(0 0 0)";

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
            ||
            toBeGrouped[i + 1]?.properties[parameter] === -1
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

const createLegend = (parameter, grouped) => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
        let eLegendContainer;

        // This is for the large map
        if (grouped.length > 10) {
            eLegendContainer = L.DomUtil.create(
                "div",
                "info legend flex flex-col bg-white/80 p-2 shadow-md rounded-md text-black overflow-y-auto max-h-[35vh] lg:max-h-[95vh]"
            );
        }
        // This is for the small previewMaps
        else {
            eLegendContainer = L.DomUtil.create(
                "div",
                "info legend flex flex-col bg-white/80 p-2 shadow-md rounded-md text-black overflow-y-auto max-h-[21vh]"
            );
        }

        L.DomEvent.disableClickPropagation(eLegendContainer);
        L.DomEvent.disableScrollPropagation(eLegendContainer);

        grouped.forEach((group, index, array) => {
            const startValue = group[group.length - 1].properties[parameter];
            const endValue = group[0].properties[parameter];

            const eLegendLine = L.DomUtil.create(
                "p",
                "legend-line flex gap-2 text-[0.9em]"
            );
            if (startValue === -1) {
                const prevGroup = array[index - 1];
                const prevStartValue = prevGroup[prevGroup.length - 1].properties[parameter];
                eLegendLine.textContent = `< ${prevStartValue}`;
            } else if (startValue === endValue) {
                eLegendLine.textContent = `${startValue}`;
            } else {
                eLegendLine.textContent = `${startValue}–${endValue}`;
            }

            const eColorBox = L.DomUtil.create("i", "w-[17] h-[17]");
            eColorBox.style.backgroundColor = getColor(
                startValue,
                array,
                parameter
            );

            eLegendLine.prepend(eColorBox);
            eLegendContainer.append(eLegendLine);
        });

        return eLegendContainer;
    };

    return legend;
};

export { getColor, group, sortBy, createLegend };
