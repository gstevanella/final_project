const margin1 = {top: 10, right: 30, bottom: 50, left: 120},
    width1 = 1100 - margin1.left - margin1.right,
    height1 = 550 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
const svg1 = d3.select("#lollipop_var")
  .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform", `translate(${margin1.left}, ${margin1.top})`);

// Initialize the X axis
const x1 = d3.scaleBand()
  .range([ 0, width1 ])
  .padding(1);
const xAxis1 = svg1.append("g")
  .attr("transform", `translate(0, ${height1})`)

// Initialize the Y axis
const y1 = d3.scaleLinear()
  .range([ height1, 0]);
const yAxis1 = svg1.append("g")
  .attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(selectedVar) {

  // Parse the Data
  d3.csv('./data/lollipop_top30_variables.csv').then( function(data) {

  //sort data
  data.sort(function (b,a){return a.EARTHQKEVI - b.EARTHQKEVI;});
    // X axis
    x1.domain(data.map(function(d) { return d.Country_Standard; }))
    xAxis1.transition().duration(1000).call(d3.axisBottom(x1))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-35)")
    .style("text-anchor", "end")
    .style("font-size", 20);

    // Add Y axis
    y1.domain([0, d3.max(data, function(d) { return +d[selectedVar] }) ]);
    yAxis1.transition().duration(1000).call(d3.axisLeft(y1));

    // variable u: map data to existing circle
    const j = svg1.selectAll(".myLine")  //should be svg only?
      .data(data)
    // update lines
    j
      .join("line")
      .attr("class", "myLine")
      .transition()
      .duration(1000)
        .attr("x1", function(d) { return x1(d.Country_Standard); })
        .attr("x2", function(d) { return x1(d.Country_Standard); })
        .attr("y1", y1(0))
        .attr("y2", function(d) { return y1(d[selectedVar]); })
        .attr("stroke", "#00cc99")


    // variable u: map data to existing circle
    const u = svg1.selectAll("circle")
      .data(data)
    // update bars
    u
      .join("circle")
      .transition()
      .duration(1000)
        .attr("cx", function(d) { return x1(d.Country_Standard); })
        .attr("cy", function(d) { return y1(d[selectedVar]); })
        .attr("r", 7)
        .attr("fill", "#009933")

  })

}
// Initialize plot
update('EARTHQKEVI')