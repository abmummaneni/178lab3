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
const xAttr = defaultXAttr;
const yAttr = defaultYAttr;
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
        .range(d3.schemePaired.slice(0, varieties.length));

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
    const tooltipText = svg_scatter
        .append("text")
        .attr("x", 8)
        .attr("y", 16)
        .style("font", "12px Monaco")
        .style("font-weight", "bold")
        .style("display", "none");

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
    const scatterLegend = d3.select("#scatterplot_legend");
    scatterLegend.selectAll("*").remove();
    scatterLegend
        .append("div")
        .style("font", "13px Monaco")
        .style("font-weight", "bold")
        .style("margin-bottom", "6px")
        .text("Variety of Iris Flowers");
    const legendItems = scatterLegend
        .append("div")
        .style("display", "flex")
        .style("gap", "14px")
        .style("align-items", "center")
        .style("flex-wrap", "wrap");
    legendItems
        .selectAll(".legend-item")
        .data(varieties)
        .join("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "6px")
        .html(
            (d) =>
                `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${colorScale(
                    d,
                )};"></span><span style="font:12px Monaco">${d}</span>`,
        );
    
    function updateScatter() {
        const t = svg_scatter.transition().duration(450).ease(d3.easeCubicOut);
        let xDomain_scatter = d3.extent(data, (d) => d[currentXAttr]);
        let yDomain_scatter = d3.extent(data, (d) => d[currentYAttr]);
        const xScale_scatter = d3
            .scaleLinear()
            .domain([xDomain_scatter[0] * 0.95, xDomain_scatter[1] * 1.05])
            .nice()
            .range([0, width]);
        const yScale_scatter = d3
            .scaleLinear()
            .domain([yDomain_scatter[0] * 0.95, yDomain_scatter[1] * 1.05])
            .nice()
            .range([height, 0]);


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
                d3.select(event.currentTarget).attr("r", 8).attr("stroke-width", 2);
                tooltipText
                    .style("display", null)
                    .text(
                        `${axisLabel(currentXAttr)}: ${d[currentXAttr].toFixed(
                            1,
                        )} | ${axisLabel(currentYAttr)}: ${d[currentYAttr].toFixed(
                            1,
                        )} | Variety: ${d.variety}`,
                    );
            })
            .on("mouseout", function (event) {
                d3.select(event.currentTarget).attr("r", 5).attr("stroke-width", 1);
                tooltipText.style("display", "none").text("");
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
        tooltipText.style("display", "none").text("");
        updateScatter();
    });
    yDropdown.on("change", function () {
        currentYAttr = this.value;
        tooltipText.style("display", "none").text("");
        updateScatter();
    });

    updateScatter();
    

    
    /********************************************************************** 
     TODO: Complete the bar chart tasks

     Note: We provide starter code to compute the average values for each 
     attribute. However, feel free to implement this any way you'd like.
    ***********************************************************************/

    // Create an array that will hold all computed average values
    let average_data = [];
    // Compute all average values for each attribute, except 'variety'
    average_data.push({
        "sepal.length": d3.mean(data, (d) => d["sepal.length"]),
    });
    // TODO (optional): Add the remaining values to your array
    average_data.push(0);
    average_data.push(0);
    average_data.push(0);

    // Compute the maximum and minimum values from the average values to use for later
    let max_average = Object.values(average_data[0])[0];
    let min_average = Object.values(average_data[0])[0];
    average_data.forEach((element) => {
        max_average = Math.max(max_average, Object.values(element)[0]);
        min_average = Math.min(min_average, Object.values(element)[0]);
    });

    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // Hint: the domain for X should be the attributes of the dataset
    // xDomain = ['sepal.length', ...]
    // then you can use 'xDomain' as input to .domain()
    let xDomain = [];
    let xScale_bar = d3
        .scaleBand()
        // .domain(...)
        .range([0, width])
        .padding(0.4);

    // TODO: Finish this
    svg_bar
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale_bar));
    // ....

    // TODO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    let yScale_bar = d3
        .scaleLinear()
        // TODO: Fix this!
        // .domain(...)
        .range([height, 0]);

    // TODO: Finish this
    svg_bar.append("g").attr("class", "yAxis").call(d3.axisLeft(yScale_bar));
    // ....

    // TODO: You can create a variable that will serve as a map function for your sequential color map
    // Hint: Look at d3.scaleLinear()
    // let bar_color = d3.scaleLinear()...
    // Hint: What would the domain and range be?
    let bar_color = d3.scaleLinear();
    // .domain()
    // .range()

    // TODO: Append bars to the bar chart with the appropriately scaled height
    // Hint: the data being used for the bar chart is the computed average values! Not the entire dataset
    // TODO: Color the bars using the sequential color map
    // Hint: .attr("fill") should fill the bars using a function, and that function can be from the above bar_color function we created
    svg_bar
        .selectAll(".bar")
        // TODO: Fix these
        .data([
            {x: 100, y: 100},
            {x: 150, y: 200},
            {x: 200, y: 180},
        ])
        .join("rect")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", 40)
        .attr("height", 80)
        .attr("fill", d3.schemeCategory10[0]);

    // TODO: Append x-axis label
    svg_bar.append("text"); // TODO: Fix this
    // TODO: Append y-axis label
    // TODO: Append bar chart title
    // TODO: Draw gridlines for both charts

    // Fix these (and maybe you need more...)
    // d3.selectAll("g.yAxis g.tick")
    // .append("line")
    // .attr("class", "gridline")
    // .attr("x1", ...)
    // .attr("y1", ...)
    // .attr("x2", ...)
    // .attr("y2", ...)
    // .attr("stroke", ...)
    // .attr("stroke-dasharray","2")
});
