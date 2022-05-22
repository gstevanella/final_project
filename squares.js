/**
 * CONSTANTS AND GLOBALS
 * */
 const widthsq = window.innerWidth * 0.9,
 heightsq = window.innerHeight * 0.7,
 marginsq = {top: 20, bottom: 50, left: 60, right:40};
 
 let svgsq;
 let tooltipsq;
 /**
 * APPLICATION STATE  //store our data - anything we need to know about user interaction
 * */
 let statesq = {
   data: null,
   hover: null   //waiting to be filled by the events that the user hovers over the rect
 };
 
 /**
 * LOAD DATA
 * */
 d3.json('data/squares.json',d3.autotype).then(data => {
   statesq.data = data;
   console.log(statesq.data)
   init();
 });
 
 /**
 * INITIALIZING FUNCTION (this is coming after the data has been loaded)
 * this will be run *one time* when the data finishes loading in
 * */
 function init() {
 
 
 const containersq = d3.select("#squares")
   .style ("position", "relative");
 
 svgsq = containersq
   .append("svg")
   .attr("width", widthsq)
   .attr("height", heightsq);
 
 tooltipsq = containersq.append("div")
   .attr("class", "tooltip")
   .style("top", 0)  //this is mandatory
   .style("left", 0)  //this is mandatory
   .style("color", "blue")
   .style("position", "absolute") //tooltip stays with the rectangle
 
   const rootsq = d3.hierarchy(statesq.data) //d3 looks into data - this is a method and creates that image that pulls the data into a node
 // we want d3 to run thru our state data - but now we also need to understand how we want to group the data, what field to use to draw the square?
   .sum(d => d.deaths) //this is going to summarise the data at each level (remember we have 4 levels here) - the big number in the console represents the totality of the square  
   .sort((a,b) => b.deaths - a.deaths); 
   console.log(rootsq)
 
 const treeLayout = d3.treemap() //you can call it anything it is a variable //set of algos that thinks the data as a tree //this generated x and y for each rectangle
   .size([widthsq - marginsq.left - marginsq.right,
   heightsq - marginsq.top - marginsq.bottom])
   .paddingInner(2); //this is optional
 
   const tree = treeLayout(rootsq)   //im making the root coming into the treelayout (like scaling again) //tree is a variable here, we could name it anything 
   const leaves = tree.leaves()  //leaves is a d3 functionality
 //select all data join (back to familiar code)
 
   console.log()
   const leafGroups = svgsq   //professor splits leaf groups in 2 groups > ask more! 
     .selectAll("g")
     .data(leaves)
     .join("g")
     .attr("transform", d=> `translate(${d.x0}, ${d.y0})`) //draw the "leaves" aka the rectangles - how to place the leaves on the screen
 
   leafGroups.append("rect")   //this is when I tell what shape I want my leaves to look like
       .attr("fill", "purple")
       .attr("stroke", "gray")
       .attr("width", d => d.x1 - d.x0)  //here we talk about the width and height of each rectangle based on the data
       .attr("height", d => d.y1 - d.y0)
 
 
   leafGroups   //set up the event > someone is running their mouse over the rectangle
     .on("mouseenter", (event, d) => {
       statesq.hover = {
         position: [d.x0, d.y0],   //this is the area of each rectangle where the user hovers their mouse over
         name: d.datasq.Region  //this is what I want the screen to display 
       }  //I want state.hover to do something
       draw()
     }) 
     .on("mouseleave", () => {
       statesq.hover = null
       draw();
     })
   draw(); // calls the draw function  aka the things that you are going to call over and over - normally user's selection
 }
 
 /**
 * DRAW FUNCTION 
 * we call this every time there is an update to the data/state
 * */
 function draw() {
   if(statesq.hover) {  //if state.hover exists then run this function
     tooltipsq
     .html(`<div>${statesq.hover.Region}</div>`)   //this is best practice
     .transition()
     .duration(700)
     .style("opacity", 0.9)
     .style("transform", `translate(${statesq.hover.position
     [0]}px, ${statesq.hover.position[1]}px)`)   //same as onmouse enter position-wise
   }
   }