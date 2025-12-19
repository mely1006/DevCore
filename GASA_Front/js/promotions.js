let promotions = [];

fetch("../data/promotions.json")
  .then(res => res.json())
  .then(data => {
    promotions = data;
    renderPromotions();
  });

function renderPromotions() {
  const tbody = document.getElementById("promotionTable");
  tbody.innerHTML = "";

  promotions.forEach(promo => {
    tbody.innerHTML += `
      <tr>
        <td>${promo.annee}</td>
        <td>
          <span class="badge ${promo.statut === 'En cours' ? 'bg-success' : 'bg-secondary'}">
            ${promo.statut}
          </span>
        </td>
      </tr>
    `;
  });
}

function addPromotion() {
  const annee = document.getElementById("annee").value;
  const statut = document.getElementById("statut").value;

  if (!annee) {
    alert("Veuillez saisir l'année académique");
    return;
  }

  promotions.push({ annee, statut });
  renderPromotions();

  document.getElementById("annee").value = "";
}
