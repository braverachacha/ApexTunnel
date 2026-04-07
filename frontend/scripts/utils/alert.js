export const showAlert = (displayElement, message, isError, duration = 3000) => {
  if (!displayElement) return;

  displayElement.textContent = message;
  displayElement.style.color = isError ? "red" : "green";
  displayElement.style.display = "block";

  setTimeout(() => {
    displayElement.style.display = "none";
    displayElement.textContent = "";
  }, duration);
};