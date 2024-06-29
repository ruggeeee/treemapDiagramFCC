document.addEventListener("DOMContentLoaded", function () {
    const width = 960;
    const height = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const tooltip = d3.select("#tooltip");
  
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")
      .then(data => {
        const root = d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);
  
        d3.treemap()
          .size([width, height])
          .paddingInner(1)
          (root);
  
        const svg = d3.select("#treemap")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
  
        const node = svg.selectAll("g")
          .data(root.leaves())
          .enter().append("g")
          .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
        node.append("rect")
          .attr("class", "tile")
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0)
          .attr("fill", d => color(d.data.category))
          .attr("data-name", d => d.data.name)
          .attr("data-category", d => d.data.category)
          .attr("data-value", d => d.data.value)
          .on("mousemove", function (event, d) {
            tooltip.style("display", "block")
              .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
              .attr("data-value", d.data.value)
              .style("top", `${event.pageY + 10}px`)
              .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", function () {
            tooltip.style("display", "none");
          });
  
        node.append("text")
          .attr("class", "tile-text")
          .selectAll("tspan")
          .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
          .enter().append("tspan")
          .attr("x", 4)
          .attr("y", (d, i) => 13 + i * 10)
          .text(d => d);
  
        // Legend
        const categories = [...new Set(root.leaves().map(d => d.data.category))];
        const legendWidth = 600;
        const legendHeight = 20;
  
        const legendSvg = d3.select("#legend")
          .append("svg")
          .attr("width", legendWidth)
          .attr("height", Math.ceil(categories.length / 6) * legendHeight);
  
        const legend = legendSvg.selectAll(".legend-item")
          .data(categories)
          .enter().append("g")
          .attr("class", "legend-item")
          .attr("transform", (d, i) => `translate(${(i % 6) * 100}, ${Math.floor(i / 6) * 20})`);
  
        legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("class", "legend-item")
          .style("fill", d => color(d));
  
        legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .attr("dominant-baseline", "middle")
          .text(d => d);
      });
  });
  