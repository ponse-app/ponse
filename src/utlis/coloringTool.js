const getColor = (value, grouped, parameter) => {
    let amountOfGaps = grouped.length;

    // If the last group contains -1, then amount of gaps is one less.
    // This is because we don't want the last group to be considered in the coloring.
    // The last group should be the only one which contains -1 values, if there's a such group.
    if (grouped[grouped.length - 1][0].properties[parameter] === -1)
        amountOfGaps = amountOfGaps - 1;

    if (amountOfGaps === 1) return "hsl(0 0 100)";

    // Start whichGap from -1 so we can determine if the gap is not found
    let whichGap = -1;
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

    // If the gap is not found, return specific color
    // This happens if the value is not part of any group, eg. value is -1.
    if (whichGap === -1) return "hsl(0 0 0)";

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

    const withoutMinusOnes = toBeGrouped.filter((feature) => feature.properties[parameter] !== -1);
    const onlyMinusOnes = toBeGrouped.filter((feature) => feature.properties[parameter] === -1);

    const interval = Math.ceil(toBeGrouped.length / maxAmountOfGroups); // Roughfly how many items in a group

    let grouped = []; // Array for the final group

    for (let i = 0, groupNumber = 0; i < withoutMinusOnes.length; i++) {
        // If there's not a group already and a one is needed, create a new one
        if (grouped.length <= groupNumber) {
            grouped.push([]);
        }

        // Push current value to current group
        grouped[groupNumber].push(withoutMinusOnes[i]);

        // Check if current value is the same as next one.
        // If it's then delay group change to keep same values in the same group
        if (
            withoutMinusOnes[i].properties[parameter] ===
            withoutMinusOnes[i + 1]?.properties[parameter]
        )
            continue;

        // If current group have enough items, change group
        if (grouped[groupNumber].length >= interval) groupNumber++;
    }

    // Put -1 values to the own group
    if (onlyMinusOnes.length > 0) return [...grouped, [...onlyMinusOnes]];

    return grouped;
};

const sortBy = (features, parameter) => {
    const sorted = features.toSorted(
        (a, b) => b.properties[parameter] - a.properties[parameter]
    );

    return sorted;
};

const createLegend = (parameter, grouped, hoverValue, maptype, noData) => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
        let eLegendContainer;

        // This is for the large map
        if (maptype === "large") {
            eLegendContainer = L.DomUtil.create(
                "div",
                "info legend flex flex-col bg-white/80 p-2 shadow-md rounded-md text-black overflow-y-auto max-h-[35vh] lg:max-h-[95vh]"
            );
        }
        // This is for the small previewMaps
        else {
            eLegendContainer = L.DomUtil.create(
                "div",
                "info legend flex flex-col bg-white/80 p-2 shadow-md rounded-md text-black overflow-y-auto overflow-x-auto max-h-[21vh] lg:max-w-[10vw]"
            );
        }

        L.DomEvent.disableClickPropagation(eLegendContainer);
        L.DomEvent.disableScrollPropagation(eLegendContainer);

        grouped.forEach((group, _, array) => {
            const startValueOriginal = group[group.length - 1].properties[parameter];
            const endValueOriginal = group[0].properties[parameter];

            // These will be rounded if small map
            let startValue = startValueOriginal;
            let endValue = endValueOriginal;

            /* if (maptype === "preview") {
                startValue = Math.round(startValue);
                endValue = Math.round(endValue);
            } */

            const eLegendLine = L.DomUtil.create("p", "legend-line flex gap-2 text-[0.9em]");
            if (startValue === -1) {
                eLegendLine.textContent = noData;
            } else if (startValue === endValue) {
                eLegendLine.textContent = `${startValue}`;
            } else {
                eLegendLine.textContent = `${startValue}–${endValue}`;
            }
            if (hoverValue >= startValue && hoverValue <= endValue && hoverValue != null) {
                eLegendLine.style.backgroundColor = "#7B9ACC";
                eLegendLine.style.color = "#FCF6F5";
            }

            let eColorBox = null;
            if (maptype === "large") {
                eColorBox = L.DomUtil.create("i", "w-[17] h-[17]");
            } else {
                eColorBox = L.DomUtil.create("i", "w-[10px] h-[10px]");
            }

            eColorBox.style.backgroundColor = getColor(startValueOriginal, array, parameter);

            eLegendLine.prepend(eColorBox);
            eLegendContainer.append(eLegendLine);
        });

        return eLegendContainer;
    };

    return legend;
};

export { getColor, group, sortBy, createLegend };
