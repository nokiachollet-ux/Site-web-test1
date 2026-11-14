// Adresse e-mail qui recevra les demandes du formulaire de contact
const EMAIL_CONTACT = "contact@vert-et-toit.fr";

document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const ouvert = nav.classList.toggle("ouvert");
      burger.classList.toggle("ouvert", ouvert);
      burger.setAttribute("aria-expanded", ouvert);
    });
  }

  // Sous-menu "Services" (clic / clavier)
  document.querySelectorAll(".dropdown > button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.parentElement;
      const ouvert = parent.classList.toggle("ouvert");
      btn.setAttribute("aria-expanded", ouvert);
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.ouvert").forEach((d) => d.classList.remove("ouvert"));
  });

  // Année du pied de page
  document.querySelectorAll(".annee").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Formulaire de contact
  const form = document.querySelector("#form-contact");
  if (form) {
    // Pré-sélection du service via l'URL : contact.html?service=toiture
    const service = new URLSearchParams(window.location.search).get("service");
    const select = form.querySelector("#service");
    if (service && select) {
      const option = [...select.options].find((o) => o.value === service);
      if (option) select.value = service;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const serviceTxt = select.options[select.selectedIndex].text;
      const sujet = `Demande de devis – ${serviceTxt} – ${d.get("nom")}`;
      const corps =
        `Nom : ${d.get("nom")}\n` +
        `Téléphone : ${d.get("telephone")}\n` +
        `E-mail : ${d.get("email")}\n` +
        `Commune : ${d.get("commune") || "-"}\n` +
        `Service : ${serviceTxt}\n\n` +
        `${d.get("message")}`;
      window.location.href = `mailto:${EMAIL_CONTACT}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
      const ok = document.querySelector(".message-ok");
      if (ok) ok.style.display = "block";
    });
  }
});
