// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 40, left: 120},
    width = 1100 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg = d3.select("#lollipop_chart")
  .append("svg")
    .attr('viewBox',`0 0 ${width + margin.left + margin.right} ${
      height + margin.top + margin.bottom
    }` )
    //.attr("width", width + margin.left + margin.right)
   // .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv('./data/top50_lollipop_chart.csv').then( function(data) {

// sort data
data.sort(function(b, a) {
  return a.EVI - b.EVI;
});

// Add X axis
const x = d3.scaleLinear()
  .domain([330, 470])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
const y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(function(d) { return d.Country_Standard; }))
  .padding(1);
svg.append("g")
  .call(d3.axisLeft(y))
.selectAll("text")
    .attr("text", 0.6)

// Lines
svg.selectAll("myline")
  .data(data)
  .join("line")
    .attr("x1", x(330))
    .attr("x2", x(330))
    .attr("y1", function(d) { return y(d.Country_Standard); })
    .attr("y2", function(d) { return y(d.Country_Standard); })
    .attr("stroke", "grey")

// Circles -> start at X=0
svg.selectAll("mycircle")
  .data(data)
  .join("circle")
    .attr("cx", x(0) )
    .attr("cy", function(d) { return y(d.Country_Standard); })
    .attr("r", "3")
    .style("fill", "rgb(75, 176, 8)")
    .attr("stroke", "white")

// Change the X coordinates of line and circle
svg.selectAll("circle")
  .transition()
  .duration(2000)
  .attr("cx", function(d) { return x(d.EVI); })

svg.selectAll("line")
  .transition()
  .duration(2000)
  .attr("x1", function(d) { return x(d.EVI); })

})