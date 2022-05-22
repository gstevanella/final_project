
    /* CONSTANTS AND GLOBALS */
   

    const margin = { top: 10, bottom: 60, left: 90, right: 10 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const staticColor = "#0756b7";
    const hoverColor = "gold";
    const tipColor = "#e8e8e8e8";
    
    // adding let variables here
    // adding global scope
    let svg;
    let xScale;
    let yScale;
    let tooltip;
    let xAxis;
    let yAxis;
    
    
    // manage interactivity
    /* APPLICATION STATE */
    let state = {
      data: null,
      selection: "all",
      hover: null
    };
    
    
    /* LOAD DATA */
    
    d3.csv('./data/bar_chart_bottom.csv', d3.autoType)
    .then(raw_data => {
      console.log("data", raw_data);
      // save  data to application state
      raw_data.sort(function(a, b) {
        return a.deaths - b.deaths;
      });
      state.data = raw_data;
      init();
    });
    
    
    /* INITIALIZING FUNCTION */
    
    function init() {
    
      /* SCALES */
    
      xScale = d3.scaleBand()
      .domain(state.data.map(d=> d.region))
      .range([margin.left, width-margin.right])
      .paddingInner(.2)
    
      yScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d=> d.deaths)])
      .range([height-margin.bottom, margin.top])  
    
      const container = d3.select("#chart_bottom").style("position", "relative");
    
      svg = container
        .append("svg")
        //add class for CSS use
        .attr("class", "chart")
        .style('background', "white")
        .attr(
            'viewBox',
            `0 0 ${width + margin.left + margin.right} ${
              height + margin.top + margin.bottom
            }`
          )
        .style("position", "relative");
    
      // tooltip = d3.select("body")
      // change the d3.select to SPECIFIC ID for this graph's <div> instead of just the body
      tooltip = d3.select("#chart_bottom")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("opacity", 1)
      .style("padding", "8px")
      .style('background', "blue")  //.style('background', tipColor)
      .style("border-radius", "4px")
      .style("color", "blue")
      .style("font-size", "0.8em" )
      .text("tooltip");
    
    
    // axes
    
    
        svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .attr("x",  width / 2 )
        .attr("y", height + 10)
        .text("Region or Country");
    
        svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .attr("x", -(height/2))
        .attr("y", 6)
        .attr("dy", ".90em")
        .attr("transform", "rotate(-90)")
        .text("Number of deaths recorded");
        // check if additional draw call req'd
        draw(); 
    
        //set up selector
       
        const dropdown = d3.select("#dropdown_bottom")
    
        dropdown.selectAll("options")
          .data(["all","Central Asia",
          "Morocco",
          "Tajikistan",
          "India-Nepal",
          "Philippines",
          "Mexico",
          "Nicaragua",
          "Argentina",
          "Taiwan",
          "Russia",
          "Algeria",
          "Ecuador",
          "Iran-Turkey",
          "Afghanistan",
          "Afghanistan-Tajikistan",
          "United States",
          "Arabia",
          "Armenia-Azerbaijan",
          "New Guinea",
          "Indonesia",
          "Romania",
          "Colombia",
          "Pakistan-Afghanistan",
          "Ex-Yugoslavia",
          "Colombia-Ecuador",
          "El Salvador"])
          .join("option")
          .attr("value", d => d)
          .text(d => d)
    
          // dropdown.on("change", event => {
          // change this to use NON-arrow syntax for the function
          dropdown.on("change", function () {
            //state.selection = event.target.value
            // using "this." syntax now 
            state.selection = this.value
            console.log(state.selection)
            draw();
          });
    
      draw(); // calls the draw function
    }
 
    /* DRAW FUNCTION */
    // calling this every time there is an update to the data/state
    function draw() {
    
      const filteredData = state.data
      .filter(d => 
        state.selection === d.region || state.selection === "all")
        console.log(filteredData)

    xAxis = d3.axisBottom(xScale)
    yAxis = d3.axisLeft(yScale)
        
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`) 
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
    


      svg.selectAll("rect.bar")
      .data(filteredData)
      .join("rect")
      .attr("class", "bar")
      .attr("width", xScale.bandwidth)
      .attr("height",  d=> height-margin.bottom - yScale(d.deaths))
      .attr("x", d=>xScale(d.region))
      .attr("y", d=>yScale(d.deaths))
      .attr("fill", staticColor)
        // remove the term "event" here 
        //.on("mouseover", function(event,d,i){
        .on("mouseover", function(d,i){
          tooltip
          .html(`<div>Region: ${d.region}</div><div>Deaths: ${d.deaths}</div>`)
          .style("visibility", "visible")
          .style("opacity", 1)
          .style("background", "yellow")
          d3.select(this)
              .transition()
              .attr("fill", hoverColor);
          })
         
          // positioning is via d3.event reference to rect.bar attributes
          .on('mousemove', 
            function(d){
              let xPos = d3.select(this).attr("x")
              let width = d3.select(this).attr("width")/2
              let tipPosX = +xPos
              let yPos = d3.select(this).attr("y")
              let height = d3.select(this).attr("height")-2
              let tipPosY = +yPos
              console.log(xPos)
              console.log(yPos)
              console.log('tipPos '+tipPosX+" - "+tipPosY)
              d3.select('.tooltip').style("display", null)
              d3.select('.tooltip')
              .style("left", tipPosX + "px")
              .style("top",  tipPosY + "px")
                //.html(html)
            })
        
            // "event"  no longer needed here
            .on("mouseout", function(event, d){
            //.on("mouseout", function(d){
              tooltip
              .html(``)
              .style("visibility","hidden");
              d3.select(this)
                  .transition()
                  .attr("fill", staticColor);
              });

    
    console.log(state)
    }
    //  final end curly bracket might be required
    //}