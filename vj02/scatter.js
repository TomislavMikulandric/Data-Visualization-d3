async function crtajScatter() {
  let dataset = await d3.json("vrijeme.json")
  console.log(dataset[0])

  const xAccessor = data => (data.dewPoint - 32) * 0.5556
  const yAccessor = data => data.humidity
  const colorAccessor = data => data.cloudCover  // new accessor for clouds

  
  const sirina = d3.min([
    window.innerWidth * 0.9, 
    window.innerHeight * 0.9
  ]);

  let dimenzije = {
    sirina: sirina,  // varijabla iz prethodnog koraka
    visina: sirina, // zadrzavamo pravokutne dimenzije
    margine: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  // Racunamo dimenzije granica
  dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right
  dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom
  	
  const okvir = d3.select("#okvir")
  .append("svg")
  .attr("width", dimenzije.sirina)
  .attr("height", dimenzije.visina)

  const granice = okvir.append("g").style(
    "transform",
    `translate(
      ${dimenzije.margine.left}px, 
      ${dimenzije.margine.top}px
    )`
  );

  //console.log(xSkala.domain())
  const xSkala = d3.scaleLinear()
  .domain(d3.extent(dataset, xAccessor))
  .range([0, dimenzije.grSirina])
  .nice()

  const ySkala = d3.scaleLinear()
  .domain(d3.extent(dataset, yAccessor))
  .range([dimenzije.grVisina, 0])
  .nice()

  const colorSkala = d3.scaleLinear()
  .domain(d3.extent(dataset, colorAccessor))
  .range(["lightblue", "darkblue"])

  const crtajTocke = (podaci, boja) => {
    const tocke = granice.selectAll("circle").data(podaci)
  
    tocke.join("circle")
      .attr("cx", d => xSkala(xAccessor(d)))
      .attr("cy", d => ySkala(yAccessor(d)))
      .attr("r", 4)
      .attr("fill", d => colorSkala(colorAccessor(d)))
}

  //crtajTocke(dataset.slice(0,200), "darkgrey")
  setTimeout( ()=> {
    crtajTocke(dataset, "blue")
  }, 1000)

  //console.log(tocke)
  const xOsGen = d3.axisBottom().scale(xSkala)
  const xOs = granice.append("g")
    .call(xOsGen)
      .style("transform",
      `translateY(${dimenzije.grVisina}px)`)
  const xOsOznaka = xOs.append("text")
  .attr("x", dimenzije.grSirina / 2)
  .attr("y", dimenzije.margine.bottom - 10)
  .attr("fill", "black")
  .style("font-size", "1.5em")
  .html("Temperatura rosišta (&deg;C)")

  const yOsGen = d3.axisLeft()
    .scale(ySkala)
    .ticks(4)
  const yOs = granice.append("g")
    .call(yOsGen)

  const yOsOznaka = yOs.append("text")
  .attr("x", -dimenzije.grVisina / 2)
  .attr("y", -dimenzije.margine.left + 15)
  .attr("fill", "black")
  .style("font-size", "1.5em")
  .html("Relativna vlažnost")
  .style("transform", "rotate(-90deg)")
  .style("text-anchor", "middle")
}
crtajScatter()