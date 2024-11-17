async function crtajScatter() {

  // 1. Pristup podacima

  const dataset = await d3.json("../vrijeme.json")

  const xAccessor = d => (d.dewPoint - 32) * 0.5556;
  const yAccessor = d => d.humidity

  // 2. Dimezije grafa

  const sirina = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  let dimenzije = {
    sirina: sirina,
    visina: sirina,
    margine: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right
  dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom

  // 3. Crtanje canvasa

  const okvir = d3.select("#okvir")
    .append("svg")
      .attr("width", dimenzije.sirina)
      .attr("height", dimenzije.visina)

  const granice = okvir.append("g")
    .style("transform", `translate(${dimenzije.margine.left}px, ${dimenzije.margine.top}px)`)

  // 4. Definiranje razmjera

  const xSkala = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimenzije.grSirina])
    .nice()

  const ySkala = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimenzije.grVisina, 0])
    .nice()

  const crtajTocke = (dataset) => {

    // 5. Crtanje podataka

    const tocke = granice.selectAll("circle")
      .data(dataset, d => d[0])

    const noveTocke = tocke.enter().append("circle")

    const sveTocke = noveTocke.merge(tocke)
        .attr("cx", d => xSkala(xAccessor(d)))
        .attr("cy", d => ySkala(yAccessor(d)))
        .attr("r", 4)

    const stareTocke = tocke.exit()
        .remove()
  }
  crtajTocke(dataset)

  // 6. Crtanje pomocne grafike

  const xOsGenerator = d3.axisBottom()
    .scale(xSkala)

  const xOs = granice.append("g")
    .call(xOsGenerator)
      .style("transform", `translateY(${dimenzije.grVisina}px)`)

  const xOsOznaka = xOs.append("text")
      .attr("class", "x-os-oznaka")
      .attr("x", dimenzije.grSirina / 2)
      .attr("y", dimenzije.margine.bottom - 10)
      .html("Temp. rosišta (&deg;C)")

  const yOsGenerator = d3.axisLeft()
    .scale(ySkala)
    .ticks(4)

  const yOs = granice.append("g")
    .call(yOsGenerator)

  const yOsOznake = yOs.append("text")
      .attr("class", "y-os-oznaka")
      .attr("x", -dimenzije.grVisina / 2)
      .attr("y", -dimenzije.margine.left + 10)
      .text("Relativna vlažnost")

  // 7. Dodavanje interakcija

}
crtajScatter()