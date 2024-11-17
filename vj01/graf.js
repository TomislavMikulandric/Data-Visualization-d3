const crtajGraf = async () => {
    const dataset = await d3.json("vrijeme.json");
    console.log(dataset);
    console.table(dataset[0]);

    const yAccessor = data => (data.temperatureMax - 32) * 0.5556;
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = data => dateParser(data.date);
    const yAccessorMin = data => (data.temperatureMin-32)*0.5556;


    console.log(xAccessor(dataset[0]));

    const dimenzije = {
        width: window.innerHeight * 0.9,
        heigth : 400,
        margin:{
            top: 15,
            right: 15,
            bottom: 40,
            left: 60
        },
    }
    dimenzije.boundsWidth = dimenzije.width - dimenzije.margin.left - dimenzije.margin.right
    dimenzije.boundsHeight = dimenzije.heigth - dimenzije.margin.top - dimenzije.margin.bottom

    const okvir = d3
    .select("#sadrzaj")
         .append("svg")
            .attr("width", dimenzije.width)
            .attr("height", dimenzije.heigth);
    const granice = okvir.append("g").style("transform",`translate(${dimenzije.margin.left}px, ${dimenzije.margin.top}px)`);

    //const yMjerilo = d3.scaleLinear()
        //.domain(d3.extent(dataset, yAccessor))
        //.range([dimenzije.boundsHeight, 0]);
    
    const yMjerilo = d3.scaleLinear()
        .domain([d3.min(dataset, data => d3.min([yAccessor(data), yAccessorMin(data)])),
        d3.max(dataset, data => d3.max([yAccessor(data), yAccessorMin(data)]))])
        .range([dimenzije.boundsHeight,0]);
    const xMjerilo = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimenzije.boundsWidth]);
    const granicaNule = yMjerilo(0);
    const oznakaNule = granice.append("rect")
        .attr("x", 0)
        .attr("width", dimenzije.boundsWidth)
        .attr("y", granicaNule)
        .attr("height", dimenzije.boundsHeight - granicaNule)
        .attr("fill", "#e0f3f3");

    const granica25 = yMjerilo(25);
    const oznaka25 = granice.append("rect")
        .attr("x",0)
        .attr("width",dimenzije.boundsWidth)
        .attr("y",0)
        .attr("height",dimenzije.boundsHeight-(dimenzije.boundsHeight-granica25))
        .attr("fill","#FF7F7F");

    //granice.append("path").attr("d", "M 0 0 L 100 0 L 100 100 L 0 50 Z")

    const generatorLinije = d3.line()
        .x(data => xMjerilo(xAccessor(data)))
        .y(data => yMjerilo(yAccessor(data)));
    const linija = granice.append("path")
        .attr("d", generatorLinije(dataset))
        .attr("fill", "none")
        .attr("stroke", "#00b30b")
        .attr("stroke-width", 2);

    const generatorLinijeMin = d3.line()
        .x(data => xMjerilo(xAccessor(data)))
            .y(data => yMjerilo(yAccessorMin(data)));

    const linijaMin = granice.append("path")
        .attr("d", generatorLinijeMin(dataset))
            .attr("fill", "none")
                .attr("stroke", "#8B0000")
                    .attr("stroke-width", 2)

    const yOsGenerator = d3.axisLeft().scale(yMjerilo);
    const yOs = granice.append("g").call(yOsGenerator);
    const xOsGenerator = d3.axisBottom().scale(xMjerilo);
    const xOs = granice.append("g")
        .call(xOsGenerator)
        .style("transform", `translateY(${dimenzije.boundsHeight}px)`);

}

crtajGraf();