let formateurs = [];

// Charger les formateurs
fetch("../data/formateurs.json")
  .then(res => res.json())
  .then(data => {
    formateurs = data;
    renderFormateurs();
  });

function renderFormateurs() {
  const tbody = document.getElementById("formateurTable");
  tbody.innerHTML = "";

  formateurs.forEach(f => {
    tbody.innerHTML += `
      <tr>
        <td>${f.nom}</td>
        <td>${f.email}</td>
        <td>${f.specialite}</td>
        <td>
          <span class="badge ${f.statut === 'Actif' ? 'bg-success' : 'bg-secondary'}">
            ${f.statut}
          </span>
        </td>
      </tr>
    `;
  });
}

function addFormateur() {
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const specialite = document.getElementById("specialite").value;
  const statut = document.getElementById("statut").value;

  if (!nom || !email || !specialite) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  formateurs.push({ nom, email, specialite, statut });
  renderFormateurs();

  // reset form
  document.getElementById("nom").value = "";
  document.getElementById("email").value = "";
  document.getElementById("specialite").value = "";
}
