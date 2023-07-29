document.querySelector("#toggle-attempts")?.addEventListener("click", () => {
  document.body.classList.toggle("toggle-attempts");
})

document.body.classList.add([
  "blue",
  "orange",
  "red",
  "green"
][Math.floor(Math.random()*4)])
