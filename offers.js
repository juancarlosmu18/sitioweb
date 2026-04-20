import { getAllOffers } from './offers-db.js';

async function init() {
  let offers = await getAllOffers();

  // Ordenar: más reciente primero
  offers.sort((a, b) => b.date - a.date);

  renderOffers(offers);
}

function renderOffers(offers) {
  const container = document.getElementById("offers-feed");
  if (!container) return;

  container.innerHTML = '';

  offers.forEach(o => {
    const html = `
      <div class="offer-card">
        <img src="${o.image}" class="offer-img"/>

        <div class="offer-body">
          <h3>${o.title}</h3>
          <p>${o.note}</p>
          <span class="offer-date">
            ${new Date(o.date).toLocaleDateString('es-CO')}
          </span>
        </div>
      </div>
    `;

    container.innerHTML += html;
  });
}

document.addEventListener("DOMContentLoaded", init);