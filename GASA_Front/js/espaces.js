let espaces = [];
let promotions = [];
let formateurs = [];

// Charger données
Promise.all([
  fetch("../data/espaces.json").then(r => r.json()),
  fetch("../data/promotions.json").then(r => r.json()),
  fetch("../data/formateurs.json").then(r => r.json())
]).then(([e, p, f]) => {
  espaces = e;
  promotions = p;
  formateurs = f;

  renderEspaces();
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

function renderEspaces() {
  const tbody = document.getElementById("espaceTable");
  tbody.innerHTML = "";

  espaces.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.promotion}</td>
        <td>${e.formateur}</td>
        <td>${e.matiere}</td>
      </tr>
    `;
  });
}

function addEspace() {
  const promotion = document.getElementById("promotion").value;
  const formateur = document.getElementById("formateur").value;
  const matiere = document.getElementById("matiere").value;

  if (!matiere) {
    alert("Veuillez saisir la matière");
    return;
  }

  espaces.push({ promotion, formateur, matiere });
  renderEspaces();

  document.getElementById("matiere").value = "";
}

