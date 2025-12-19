let matieres = [];
let promotions = [];
let formateurs = [];

Promise.all([
  fetch("../data/matieres.json").then(r => r.json()),
  fetch("../data/promotions.json").then(r => r.json()),
  fetch("../data/formateurs.json").then(r => r.json())
]).then(([m, p, f]) => {
  matieres = m;
  promotions = p;
  formateurs = f;

  renderMatieres();
  fillSelects();
});

function fillSelects() {
  const promoSelect = document.getElementById("promotion");
  const formateurSelect = document.getElementById("formateur");

  promotions.forEach(p => {
    promoSelect.innerHTML += `<option>${p.nom}</option>`;
  });

  formateurs.forEach(f => {
    formateurSelect.innerHTML += `<option>${f.nom}</option>`;
  });
}

function renderMatieres() {
  const tbody = document.getElementById("matiereTable");
  tbody.innerHTML = "";

  matieres.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.nom}</td>
        <td>${m.promotion}</td>
        <td>${m.formateur}</td>
      </tr>
    `;
  });
}

function addMatiere() {
  const nom = document.getElementById("nomMatiere").value;
  const promotion = document.getElementById("promotion").value;
  const formateur = document.getElementById("formateur").value;

  if (!nom) {
    alert("Veuillez saisir le nom de la matière");
    return;
  }

  matieres.push({ nom, promotion, formateur });
  renderMatieres();

  document.getElementById("nomMatiere").value = "";
}
