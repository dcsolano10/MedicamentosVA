var margin2 = {top: 20, right: 20, bottom: 30, left: 35},
    width2 = 750 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

var x02 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x12 = d3.scale.ordinal();

var y2 = d3.scale.linear()
    .range([height, 0]);

var xAxis2 = d3.svg.axis()
    .scale(x02)
    .tickSize(0)
    .orient("bottom");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left");

var color2 = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0","#00e6b8","#cc99ff"]);

var svg2 = d3.select("#pato").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.json("data2.json", function(error, data) {

  var categoriesNames2 = data.map(function(d) { return d.categorie; });
  var rateNames2 = data[0].values.map(function(d) { return d.rate; });

  x02.domain(categoriesNames2);
  x12.domain(rateNames2).rangeRoundBands([0, x02.rangeBand()]);
  y2.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  svg2.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis2)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold');

  svg2.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice2 = svg2.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x02(d.categorie) + ",0)"; });

  slice2.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x12.rangeBand())
      .attr("x", function(d) { return x12(d.rate); })
      .style("fill", function(d) { return color(d.rate) })
      .attr("y", function(d) { return y2(0); })
      .attr("height", function(d) { return height2 - y2(0); })
      .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.rate));
      });

  slice2.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  //Legend
  var legend2 = svg2.selectAll(".legend")
      .data(data[0].values.map(function(d) { return d.rate; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend2.append("rect")
      .attr("x", width2 - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend2.append("text")
      .attr("x", width2 - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend2.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

});