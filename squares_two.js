/* CONSTANTS AND GLOBALS*/
const widthsq = 1500,
 heightsq = 1000,
 marginsq = { top: 10, bottom: 30, left: 90, right: 10 };
 
 let svgsq;
 let tooltipsq;

/**
* APPLICATION STATE
* */
let statesq = {
data: null,
hover: null
};

/**
* LOAD DATA
* */
d3.json("./data/squares.json", d3.autotype).then(data => {
statesq.data = data;
console.log(statesq.data)
init();
});

/**
* INITIALIZING FUNCTION
* */
function init() {

const containersq = d3.select("#squares")
            .style("position","relative");

svgsq = containersq.append("svg")
  .attr(
  'viewBox',
  `0 0 ${widthsq + marginsq.left + marginsq.right} ${
  heightsq + marginsq.top + marginsq.bottom
  }`
  )
 .style("position", "relative");

tooltipsq = containersq.append("div")
    .attr("class", "tooltip")
    .style("top", 0)
    .style("left", 0)
    .style("visibility", "hidden")

const root = d3.hierarchy(statesq.data) 
  .sum(d => d.deaths) 
  .sort((a,b) => b.deaths - a.deaths) //this should sort the square, but it does not appear to have some sort of effect on the chart  
console.log(root)

const treelayout = d3.treemap()
                .size([widthsq-marginsq.left-marginsq.right, 
                      heightsq-marginsq.top-marginsq.bottom])
                .paddingInner(1);

const tree = treelayout(root)
const leaf = tree.leaves()

/*SELECT - DATA - JOIN */
const colorScale = d3.scaleSequential()
            .domain([0, 702000])
            .interpolator(d3.interpolateGreens)  

console.log(tree)
console.log(leaf)
const leafGroup = svgsq
    .selectAll("g")
    .data(leaf)
    .join("g")
    .attr("transform", d=>`translate(${d.x0}, ${d.y0})`) 

leafGroup.append("rect")
    .attr("class","rect")
    .attr("fill", d=>colorScale(d.data.deaths))
    .attr("stroke","grey")
    .attr("width", d => d.x1 - d.x0) // detailing width for each shape
    .attr("height", d => d.y1 - d.y0) // detailing height for each shape

leafGroup.on("mouseenter", (event, d) => {
        statesq.hover = {
            position: [d.x0, d.y0]
            //location_name: d.data.location_name,  // I keep getting an error here!!!
            //deaths: d.data.deaths
        }
      draw();  
      })
      .on("mouseleave", () => {
        statesq.hover = null
        draw();
      })

draw(); // calls the draw function
}

/**
* DRAW FUNCTION
* we call this every time there is an update to the data/state
* */
function draw() {
if(statesq.hover){
tooltipsq
.html(`<div>Region: ${statesq.data.location_name}</div>`)
.transition()
.duration(100)
.style("visibility","visible")
}
};