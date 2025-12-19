// Animation compteur
document.querySelectorAll('.counter').forEach(counter => {
  const target = +counter.dataset.target;
  let count = 0;

  const update = () => {
    if (count < target) {
      count += Math.ceil(target / 100);
      counter.textContent = count;
      setTimeout(update, 20);
    } else {
      counter.textContent = target;
    }
  };

  update();
});

// Menu actif automatique
const links = document.querySelectorAll(".nav-link");
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
