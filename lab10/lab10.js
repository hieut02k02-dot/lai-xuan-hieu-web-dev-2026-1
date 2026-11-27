document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedbackForm");
  const message = document.getElementById("formMessage");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    message.textContent = "Спасибо! Ваше сообщение принято (демо-форма).";
    form.reset();
  });
});
