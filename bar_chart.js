/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.6,
  height = window.innerHeight * 0.6,
  margin = { top: 10, bottom: 50, left: 60, right: 0 },
  radius = 5;
// since we use our scales in multiple functions, they need global scope
let svg;
let tooltip;
let xScale;
let yScale;
let xAxis;
let yAxis;

/* APPLICATION STATE */
let state = {
    data:[],
    selection: "all"
  };

/* LOAD DATA */
d3.csv('data/bar_chart.csv', d => {
  return {
    region: d.region,
    deaths: +d.deaths
  }
}).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  // xscale - categorical, activity
  xScale = d3.scaleBand()
    .domain(state.data.map(d=> d.region))
    .range([margin.left, width - margin.right]) // visual variable  //changed with professor
    .paddingInner(.4)

    // yscale - linear,count
  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d=> d.deaths)])
    .range([height - margin.bottom, margin.top])  //how far to go down, and then how far to go up

const container = d3.select("#barchart")
    .style("position", "relative");
 
 
svg = container //refer to the above container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "relative"); 

tooltip = d3.select("body")  //remember that this is done in 2 steps - first you create the above container and secondly you go to HTML elements to add the tooltip
    .append("div")  //this allow for styling control - suggested by the professor, but not mandatory
    .attr("class", "tooltip")  //this is good practice in case we would like to style this later
    .style("z-index", "10")  //z index, ensuring it appears on top , we give it a 10 as a default
    .style("position", "absolute")
    .style("visibility", "hidden")  //controlling what appears on screen
    .style("opacity", 0.8) //optional step semi-opaque
    .style("padding", "8px")  //to leave room 
    .text("tooltip"); 

const dropdown = d3.select("#bardropdown")

dropdown.selectAll("options")  //create a set of options that will appear
    .data(["all", "Afghanistan",
    "Afghanistan-Tajikistan",
    "Algeria",
    "Arabia",
    "Argentina",
    "Armenia",
    "Armenia-Azerbaijan",
    "Central Asia",
    "Chile",
    "China",
    "Colombia",
    "Colombia-Ecuador",
    "Ecuador",
    "El Salvador",
    "Ex-Yugoslavia",
    "Guatemala",
    "India",
    "India-Nepal",
    "Indonesia",
    "Iran",
    "Iran-Turkey",
    "Italy",
    "Japan",
    "Mexico",
    "Morocco",
    "New Guinea",
    "Nicaragua",
    "Pakistan",
    "Pakistan-Afghanistan",
    "Peru",
    "Philippines",
    "Romania",
    "Russia",
    "Taiwan",
    "Tajikistan",
    "Turkey",
    "Turkmenistan",
    "United States"])
    .join("option")
    .attr("value", d => d)  //pass back to your state management tracking area //for every item of the array, we want to show the individual ones
    .text(d => d)  //I want the text to appear 
    
dropdown.on("change", event => {  //functions go in curly brackets - this is an event function
    state.selection = event.target.value   //when the drop down changes the user should be able to se a change that goes to affect the let variable
    console.log(state.selection)
    draw();  //change in graphics base on selection - up to this point all is showing in the console but we need the reaction from the chart
})
  
    draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
  // svg
const filteredData = state.data
  .filter(d=> state.selection === d.region || state.selection === "all")
  
xAxis = d3.axisBottom(xScale)
yAxis = d3.axisLeft(yScale)

svg.append("g")
.attr("transform", `translate(0,${height - margin.bottom})`) ///with professor - original it was height
.call(xAxis)
.selectAll("text")  
.style("text-anchor", "end")
.attr("dx", "-.3em")
.attr("dy", ".10em")
.attr("transform", "rotate(-30)");

svg.append("g") 
.attr("transform", `translate(${margin.left}, 0)`)
.call(yAxis)
.selectAll("text")  
.style("text-anchor", "end")
.attr("dx", "-.8em")
.attr("dy", ".15em");

  //SEKECT JOIN DRAW - data is how we name the data table
svg.selectAll("rect") //select all the data
    .data(filteredData)  //select all of that graphics
    .join("rect") //take all the rectangles or circles and join them
//so if there are 400 rectangles in our data, then create 400 rectangles
   ///.attr("height", yScale.bandwidth) commented out - not sure why included in first place 
   .attr("width", xScale.bandwidth())
   //.attr("height", d=> height - yScale(d.deaths))  //for each data plot number of deaths
   .attr("height", d=> height - margin.bottom - yScale(d.deaths)) //looking back at the scale to know where to stop drawing the rectangles 
   .attr("x", d=>xScale(d.region))
   .attr("y", d=> yScale(d.deaths))
   .attr("fill", "#0040ff")
     .on("mouseover", function(event, d, i){
       tooltip
         .html(`<div>Region: ${d.region}</div>
          <div>Number of deaths recorded: ${d.deaths}</div>`)
          .style("visibility", "visible")
          .style("opacity", .8)
          .style("border-radius", "6px")
          .style("background", "pink")
          
      })

     .on("mousemove", function(event){
       tooltip
        .style("top", event.pageY - 5 + "px")  //for the top position find the event Y area where the mouse is moving and show the tooltip there
        .style("left", event.pageX + 5 + "px");
      })

    .on("mouseout", function (event,d) {  //function to clear everything out
      tooltip
        .html(``)  //outside the area we just want to clear out the tooltip and make it invisible again
        .style("visibility", "hidden");
    });
}
