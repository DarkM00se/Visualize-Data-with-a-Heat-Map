let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();
let baseTemp
let arrayValues= [];

//svg chart dimensions
const w = 700;
const h = 600;
const padding = 60;

let minYear
let maxYear

let svg = d3.select("svg");
let tooltip= d3.select("#tooltip")//mouse tooltip css selector

let drawChart = ()=>{
//assigning h and width attributes
svg.attr("width",w)
svg.attr("height",h)

}
//generate scales for the graph
let generateScales =()=>{
 minYear=d3.min(arrayValues,(item)=>{
  return item["year"]
 })
 maxYear=d3.max(arrayValues,(item)=>{
  return item["year"]
 })

 xScale =d3.scaleLinear()
.range([padding, w-padding])
.domain([minYear,maxYear+1])

yScale = d3.scaleTime()//scale time since we are using dates
.range([padding,h-padding])
.domain([new Date(0,0,0,0,0,0,0,), new Date(0,12,0,0,0,0,0)])//creates a new date in javascript with the values set to 0
    


}
let drawAxes=()=>{
let xAxis = d3.axisBottom(xScale)// drawing the bottom axis
.tickFormat(d3.format("d"))//removes commas from x axis year values, d is for decimal and displays it as an interger
svg.append("g") 
  .call(xAxis)
  .attr("id","x-axis")//set id to y-axis
  .attr("transform", "translate(0, "  + (h-padding) + ")" )
   
  
  
  let yAxis = d3.axisLeft(yScale)//axis left so the axes is on the left 
  .tickFormat(d3.timeFormat("%B"))
  svg.append("g")
  .call(yAxis)
  .attr("id","y-axis")
  .attr("transform","translate(  "  + padding + " , 0 )" )
}


let drawCells=()=>{

  svg.selectAll(".cell")
  .data(arrayValues)
  .enter()
  .append("rect")
  .attr("class","cell")
  .attr("fill",(item)=>{ //fill color is idfferent for each cell
    variance =item["variance"]//variance is the temp data in the dataset
    
    if(variance<= -1){

      return "Teal"
    }else if(variance <= 0){
      
      return "Purple"
    
    }else if(variance <= 1){
    
      return "Yellow"
    
    }else{
      
      return "Crimson"
    }
  })
  .attr("data-year", function(item){
    return item["year"]
  })
  .attr("data-month", function(item){
    return item["month"] - 1 //javascript months start from 11
  })
  .attr("data-temp", function(item){
    return baseTemp + item["variance"]
  })
  .attr("height",(h-(2*padding))/12)
  .attr("y",(item)=>{
    return yScale(new Date(0,item["month"]-1,0,0,0,0,0))
  })
  .attr("width",(item)=>{//creates the width of the cells
    let numeberOfYears = maxYear-minYear
    return (w-(2*padding)) / numeberOfYears
  })
  .attr("x",(item)=>{
    return xScale(item["year"])
  })

  

  .on("mouseover",(event,item) => {//event handler for mouseover function, must include and event and data argument.
      
    tooltip.transition().style("visibility", "visible");
   
   let monthName=[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

   ]
   
    tooltip.text(item["year"]+" "+ monthName[item["month"]-1] + "-"+(baseTemp+ item["variance"])+ "(" + item["variance"]+")"); //display the year and month on the tooltip text
   
    document.querySelector("#tooltip").setAttribute("data-year",item["year"]);
  })
  
  .on("mouseout", () => {
    tooltip.transition().style("visibility", "hidden");
  });

}
//http request to get data
//fetching the JSON data
req.open("GET",url,true)//get request to get the database values 
req.onload= () => {//onload values to data
 let   data = JSON.parse(req.responseText) //convert the response into json.parse
  baseTemp = data["baseTemperature"]//values to data
  arrayValues= data["monthlyVariance"]  
  console.log(arrayValues)//console.log the data
  console.log(baseTemp)  
  drawChart()
  generateScales() 
  drawAxes()
  drawCells()
}
req.send()//send the response