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
    .style("background", "#eee")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xAttr = "sepal.length";
const yAttr = "petal.length";
const tickStep = 0.5;


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

    d3.select("#scatterplot_dropdown").style("display", "none");
// Read the iris dataset
d3.csv("/iris.csv", d3.autoType).then(function (data) {
    //find all numeric columns in data
    let attrs = Object.keys(data[0]).filter(
        (a) => typeof data[0][a] === "number",
    );
    /****************************************   
     TODO: Complete the scatter plot tasks
    *****************************************/
   
    let xDomain_scatter = d3.extent(data, (d) => d[xAttr]);
    let yDomain_scatter = d3.extent(data, (d) => d[yAttr]);
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
    // Draw gridlines first so they stay behind points.
    const gridLayer = svg_scatter.append("g").attr("class", "grid-layer");

    gridLayer
        .selectAll(".gridline-x")
        .data(xScale_scatter.ticks())
        .join("line")
        .attr("class", "gridline")
        .attr("stroke", "#cfcfcf")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2 2")
        .attr("x1", (d) => xScale_scatter(d))
        .attr("x2", (d) => xScale_scatter(d))
        .attr("y1", 0)
        .attr("y2", height);

    gridLayer
        .selectAll(".gridline-y")
        .data(yScale_scatter.ticks())
        .join("line")
        .attr("class", "gridline")
        .attr("stroke", "#cfcfcf")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2 2")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d) => yScale_scatter(d))
        .attr("y2", (d) => yScale_scatter(d));

    svg_scatter
        .append("g")
        .attr("class", "xAxis")
        .style("font", "11px Monaco")
        .attr("transform", `translate(0, ${height})`)
        // The call function calls the passed in function and gives itself
        // as argument so a.call(b) is equivalent to b(a).
        .call(
            d3.axisBottom(xScale_scatter)
                .tickValues(xScale_scatter.ticks())
                .tickFormat(d3.format(".1f")),
        );

    svg_scatter
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px Monaco")
        .call(
            d3.axisLeft(yScale_scatter)
                .tickValues(yScale_scatter.ticks())
                .tickFormat(d3.format(".1f")),
        );

    const varieties = Array.from(new Set(data.map((d) => d.variety)));
    const colorScale = d3
        .scaleOrdinal()
        .domain(varieties)
        .range(["#1f78b4","#a6cee3","#b2df8a"]);

    svg_scatter
        .append("g")
        .selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale_scatter(d[xAttr]))
        .attr("cy", (d) => yScale_scatter(d[yAttr]))
        .attr("r", 5)
        .attr("opacity", 0.95)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", (d) => colorScale(d.variety));

    svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 46)
        .text("Sepal Length");

    svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -42)
        .text("Petal Length");

    svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .attr("x", width / 2)
        .attr("y", -10)
        .text("Petal Length vs. Sepal Length")
        .style("text-decoration", "underline");

    /********************************************************************** 
     TODO: Complete the bar chart tasks

     Note: We provide starter code to compute the average values for each 
     attribute. However, feel free to implement this any way you'd like.
    ***********************************************************************/

    // Create an array that will hold all computed average values
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
