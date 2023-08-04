document.body.classList.add(
  ["blue", "orange", "red", "green"][Math.floor(Math.random() * 4)],
);

document.querySelector("#toggle-full-info")?.addEventListener("click", () => {
  document.body.classList.toggle("show-full-info");
});
