const button = document.createElement("button")
button.textContent = "generate identity"
button.addEventListener("click", () => {
  window.electron.generateIdentity()
})
document.body.appendChild(button)
