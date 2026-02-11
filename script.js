// Color maps you can use: https://colorbrewer2.org/

// Set the dimensions and margins of the graph. You don't need to change this.
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* SVG_SCATTER WILL REPRESENT THE CANVAS THAT YOUR SCATTERPLOT WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_scatter = d3
    .select("#my_scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background", "#ffffff")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const defaultXAttr = "sepal.length";
const defaultYAttr = "petal.length";
const tickStep = 0.5;

function axisLabel(attr) {
    return attr
        .split(".")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

/* SVG_BAR WILL REPRESENT THE CANVAS THAT YOUR BARCHART WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_bar = d3
    .select("#my_barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background", "#eee")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read the iris dataset
d3.csv("/iris.csv", d3.autoType).then(function (data) {

    /****************************************   
     TODO: Complete the scatter plot tasks
    *****************************************/
    let attrs = Object.keys(data[0]).filter(
        (a) => typeof data[0][a] === "number",
    )
    const varieties = Array.from(new Set(data.map((d) => d.variety)));
    const colorScale = d3
        .scaleOrdinal()
        .domain(varieties)
        .range([ "#1f78b4","#a6cee3","#b2df8a"]);

    let currentXAttr = attrs.includes(defaultXAttr) ? defaultXAttr : attrs[0];
    let currentYAttr = attrs.includes(defaultYAttr) ? defaultYAttr : attrs[1];
    const xDropdown = d3.select("#xAxisDropdown");
    const yDropdown = d3.select("#yAxisDropdown");
    xDropdown
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);
    yDropdown
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);
    xDropdown.property("value", currentXAttr);
    yDropdown.property("value", currentYAttr);
    // Draw layers once, then update.
    const gridLayer = svg_scatter.append("g").attr("class", "grid-layer");
    const xAxisGroup = svg_scatter
        .append("g")
        .attr("class", "xAxis")
        .style("font", "11px Monaco")
        .attr("transform", `translate(0, ${height})`);
    const yAxisGroup = svg_scatter
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px Monaco");
    const dotsLayer = svg_scatter.append("g").attr("class", "dots-layer");
    const tooltipGroup = svg_scatter
        .append("g")
        .style("display", "none")
        .style("pointer-events", "none");
    const tooltipText = tooltipGroup
        .append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font", "12px Monaco")
     const tooltipBg = tooltipGroup
        .insert("rect", "text")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "#ffffff")
        .attr("stroke", "#eeeeee")
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.75);
    const xAxisLabel = svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 46);

    const yAxisLabel = svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -42);

    const chartTitle = svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("font-decoration", "underline")
        .attr("x", width / 2)
        .attr("y", -10);

    // Scatter legend above the chart title area.
    // centered horizontally, with some spacing from the title.
    // Scatter legend above the chart title area.
    const scatterLegend = d3.select("#scatterplot_legend");
    scatterLegend.selectAll("*").remove();
    const legendWidth = width + margin.left + margin.right;
    const legendHeight = 56;
    const legendSvg = scatterLegend
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    legendSvg
        .append("text")
        .attr("x", legendWidth / 2)
        .attr("y", 14)
        .attr("text-anchor", "middle")
        .style("font", "13px Monaco")
        .style("font-weight", "bold")
        .text("Iris Varieties");

    const legendRow = legendSvg.append("g").attr("transform", "translate(0, 36)");
    const legendItems = legendRow 
        .selectAll(".legend-item")
        .data(varieties)
        .join("g")
        .attr("class", "legend-item")

    legendItems
        .append("circle")
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity", 0.95)
        .attr("fill", (d) => colorScale(d));

    legendItems
        .append("text")
        .attr("x", 10)
        .attr("y", 4)
        .style("font", "12px Monaco")
        .text((d) => d);
    const legendGap = 18;
    const itemWidths = [];
    let totalWidth = 0;
    legendItems.each(function () {
        const w = this.getBBox().width;
        itemWidths.push(w);
        totalWidth += w;
    });
    totalWidth += legendGap * Math.max(0, itemWidths.length - 1);

    let cursorX = (legendWidth - totalWidth) / 2;
    const itemPositions = itemWidths.map((w) => {
        const x = cursorX;
        cursorX += w + legendGap;
        return x;
    });
    legendItems.attr("transform", (d, i) => `translate(${itemPositions[i]}, 0)`);
    function updateScatter() {
        const t = svg_scatter.transition().duration(450).ease(d3.easeCubicOut);
        let xDomain_scatter = d3.extent(data, (d) => d[currentXAttr]);
        let yDomain_scatter = d3.extent(data, (d) => d[currentYAttr]);
        const xScale_scatter = d3
            .scaleLinear()
            .domain([xDomain_scatter[0] * 0.93, xDomain_scatter[1] * 1.05])
            .nice()
            .range([0, width]);
        const yScale_scatter = d3
            .scaleLinear()
            .domain([yDomain_scatter[0] * 0.93, yDomain_scatter[1] * 1.05])
            .range([height, 0])
            .nice();


        // Gridlines (kept behind dots).
        gridLayer
            .selectAll(".gridline-x")
            .data(xScale_scatter.ticks())
            .join("line")
            .attr("class", "gridline-x")
            .attr("stroke", "#cfcfcf")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2 2")
            .transition(t)
            .attr("x1", (d) => xScale_scatter(d))
            .attr("x2", (d) => xScale_scatter(d))
            .attr("y1", 0)
            .attr("y2", height);

        gridLayer
            .selectAll(".gridline-y")
            .data(yScale_scatter.ticks())
            .join("line")
            .attr("class", "gridline-y")
            .attr("stroke", "#cfcfcf")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "2 2")
            .transition(t)
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", (d) => yScale_scatter(d))
            .attr("y2", (d) => yScale_scatter(d));

        xAxisGroup.transition(t).call(
            d3.axisBottom(xScale_scatter)
                .tickValues(xScale_scatter.ticks())
                .tickFormat(d3.format(".1f")),
        );
        yAxisGroup.transition(t).call(
            d3.axisLeft(yScale_scatter)
                .tickValues(yScale_scatter.ticks())
                .tickFormat(d3.format(".1f")),
        );

        dotsLayer
            .selectAll(".dot")
            .data(data)
            .join("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("opacity", 0.95)
            .style("fill", (d) => colorScale(d.variety))
            .on("mouseover", function (event, d) {
                d3.select(event.currentTarget)
                .raise()
                .transition().duration(50).ease(d3.easeCubicOut)
                .attr("r", 8)
                .attr("stroke-width", 2);
                const lines = [
                    `${axisLabel(currentXAttr)}: ${d[currentXAttr].toFixed(1)}`,
                    `${axisLabel(currentYAttr)}: ${d[currentYAttr].toFixed(1)}`,
                    `Variety: ${d.variety}`,
                ];
                tooltipText
                    .selectAll("tspan")
                    .data(lines)
                    .join("tspan")
                    .attr("x", 0)
                    .attr("dy", (line, i) => (i === 0 ? 0 : 14))
                    .text((line) => line);
                const bbox = tooltipText.node().getBBox();
                const padX = 6;
                const padY = 4;
                tooltipBg
                    .attr("x", bbox.x - padX)
                    .attr("y", bbox.y - padY)
                    .attr("width", bbox.width + padX * 2)
                    .attr("height", bbox.height + padY * 2);
                const [mx, my] = d3.pointer(event, svg_scatter.node());
                tooltipGroup.attr("transform", `translate(${mx}, ${my - 10})`).style("display", null);
            })
            .on("mousemove", function (event) {
                const [mx, my] = d3.pointer(event, svg_scatter.node());
                tooltipGroup.attr("transform", `translate(${mx}, ${my - 10})`);
            })
            .on("mouseout", function (event) {
                d3.select(event.currentTarget)
                .transition().duration(100).ease(d3.easeCubicOut)
                .attr("r", 5)
                .attr("stroke-width", 1);
                tooltipGroup.style("display", "none");
            })
            .transition(t)
            .attr("cx", (d) => xScale_scatter(d[currentXAttr]))
            .attr("cy", (d) => yScale_scatter(d[currentYAttr]));

        xAxisLabel.text(axisLabel(currentXAttr));
        yAxisLabel.text(axisLabel(currentYAttr));
        chartTitle.text(`${axisLabel(currentYAttr)} vs. ${axisLabel(currentXAttr)}`);
    }
    xDropdown.on("change", function () {
        currentXAttr = this.value;
        tooltipGroup.style("display", "none");
        updateScatter();
    });
    yDropdown.on("change", function () {
        currentYAttr = this.value;
        tooltipGroup.style("display", "none");
        updateScatter();
    });

    updateScatter();
    

    
    /********************************************************************** 
     TODO: Complete the bar chart tasks

     Note: We provide starter code to compute the average values for each 
     attribute. However, feel free to implement this any way you'd like.
    ***********************************************************************/

    let average_data = [attrs.map((a) => ({[a]: d3.mean(data, (d) => d[a])}))];
    let max_average = d3.max(average_data[0], (d) => Object.values(d)[0]);
    let min_average = d3.min(average_data[0], (d) => Object.values(d)[0]);
    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // Hint: the domain for X should be the attributes of the dataset
    // xDomain = ['sepal.length', ...]
    // then you can use 'xDomain' as input to .domain()
    let xDomain = attrs;
    let xScale_bar = d3
        .scaleBand()
        .domain(xDomain)
        .range([0, width])
        .padding(0.4);

    let yScale_bar = d3
        .scaleLinear()
        .domain([0, max_average * 1.1])
        .range([height, 0])
        .nice();
        // Draw gridlines first so they stay behind axes and bars
    const gridLayerbar = svg_bar.append("g").attr("class", "grid-layerbar");
    gridLayerbar
        .selectAll(".gridlinebar-y")
        .data(yScale_bar.ticks())
        .join("line")
        .attr("class", "gridlinebar")
        .attr("stroke", "#cfcfcf")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2 2")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d) => yScale_bar(d))
        .attr("y2", (d) => yScale_bar(d));

    gridLayerbar
        .selectAll(".gridlinebar-x")
        .data(xScale_bar.domain())
        .join("line")
        .attr("class", "gridlinebar")
        .attr("stroke", "#cfcfcf")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2 2")
        .attr("x1", (d) => xScale_bar(d) + xScale_bar.bandwidth() / 2)
        .attr("x2", (d) => xScale_bar(d) + xScale_bar.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", height);
    svg_bar
        .append("g")
        .attr("class", "xAxis")
        .style("font", "11px Monaco")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale_bar));
    svg_bar
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px Monaco")
        .call(d3.axisLeft(yScale_bar))
    svg_bar
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 46)
        .text("Attribute");
    svg_bar
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -42)
        .text("Average");

    svg_bar
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .attr("x", width / 2)
        .attr("y", -10)
        .text("Average Values Per Attribute")
        .style("text-decoration", "underline");

    // TODO: You can create a variable that will serve as a map function for your sequential color map
    // Hint: Look at d3.scaleLinear()
    // let bar_color = d3.scaleLinear()...
    // Hint: What would the domain and range be?
    let bar_color = d3.scaleLinear()
    .domain([0, d3.max(average_data[0], d => Object.values(d)[0])])   // min → max data value
    .range(["#fff7ec", "#d7301f"]);          // light → dark color

    // .domain()
    // .range()

    // TODO: Append bars to the bar chart with the appropriately scaled height
    // Hint: the data being used for the bar chart is the computed average values! Not the entire dataset
    // TODO: Color the bars using the sequential color map
    // Hint: .attr("fill") should fill the bars using a function, and that function can be from the above bar_color function we created
    svg_bar
        .selectAll(".bar")
        // TODO: Fix these
        .data(average_data[0])
        .join("rect")
        .attr("x", (d) => xScale_bar(Object.keys(d)[0]))
        .attr("y", (d) => yScale_bar(Object.values(d)[0]))
        .attr("width", xScale_bar.bandwidth())
        .attr("height", (d) => height - yScale_bar(Object.values(d)[0]))
        .attr("fill", (d) => bar_color(Object.values(d)[0]))
        .attr("stroke", "black");
});
