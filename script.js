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
    //find all numeric columns in data
    let attrs = Object.keys(data[0]).filter(
        (a) => typeof data[0][a] === "number",
    );

    d3.select("#xAxisDropdown")
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);
    //TODO: do the same for yAxisDropdown

    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // TODO: Implement the x-scale domain and range for the x-axis
    let xScale_scatter = d3
        .scaleLinear()
        //TODO: make this depend on the dropdown option
        .domain(d3.extent(data, (d) => d["sepal.length"]))
        .range([0, width]);

    // TODO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    // Hint: You can create variables to represent the min and max of the y-axis values

    let yScale_scatter = d3
        .scaleLinear()
        // TODO: Fill these out
        // .domain()
        .range([height, 0]);

    // TODO: Append the scaled x-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "xAxis")
        .style("font", "11px monaco")
        .attr("transform", `translate(0, ${height})`)
        // TODO: Explain the following line of code in a comment
        .call(d3.axisBottom(xScale_scatter));

    // TODO: Append the scaled y-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px monaco")
        .call(d3.axisLeft(yScale_scatter));

    // TODO: Draw scatter plot dots here. Finish the rest of this
    let dots = svg_scatter
        .append("g")
        .selectAll(".dot")
        //TODO: feed real data here
        .data([
            {"sepal.length": 6.0, x: 100, y: 100, color: "blue"},
            {"sepal.length": 5.0, x: 100, y: 180, color: "orange"},
        ])
        .join("circle")
        .attr("class", "dot")
        // TODO: Fix these, find position of dots using appropriate scale
        .attr("cx", (d) => xScale_scatter(d["sepal.length"]))
        .attr("cy", (d) => d.y)
        .attr("r", 10)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        //TODO: color points by iris variety using a categorical color map
        .style("fill", (d) => d.color);

    //TODO: add tooltip here
    dots.on("mouseover", (event, d) => {
        console.log("Moused over a dot. \nEvent:", event, "D:", d);
    });

    // TODO: X axis label
    svg_scatter
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left + width / 2)
        .attr("y", height + 36)
        // TODO: Finish this...
        .text("TODO x label");

    // TODO: Y axis label
    svg_scatter
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        // .attr("y", ...)
        // .attr("x", ...)
        .text("TODO y label");

    // TODO: Chart title
    svg_scatter
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline");
    // TODO: Finish these...
    // .attr("x", ...)
    // .attr("y", ...)
    // .text(...);

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
