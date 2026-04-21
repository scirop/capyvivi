const capy = document.getElementById("capy-walker");

const SPEED = 3; // px per frame
const GLITTER = ["✨", "💨", "⭐", "🌟", "💫", "🌈", "💥"];

let x = window.innerWidth * 0.1;
let y = window.innerHeight - capy.offsetHeight - 60;
let dx = SPEED;
let dy = 0;

// Wander: change vertical drift occasionally
let wanderTimer = 0;
const WANDER_INTERVAL = 90; // frames

function clampY() {
  const minY = 60;
  const maxY = window.innerHeight - capy.offsetHeight - 56; // above footer
  return Math.min(Math.max(y, minY), maxY);
}

function step() {
  wanderTimer++;
  if (wanderTimer >= WANDER_INTERVAL) {
    dy = (Math.random() - 0.5) * 1.2;
    wanderTimer = 0;
  }

  x += dx;
  y += dy;

  const maxX = window.innerWidth - capy.offsetWidth;
  if (x >= maxX) { x = maxX; dx = -SPEED; }
  if (x <= 0)    { x = 0;    dx = SPEED; }

  y = clampY();

  capy.style.left = x + "px";
  capy.style.bottom = "auto";
  capy.style.top = y + "px";

  // Flip when moving left
  capy.classList.toggle("flipped", dx < 0);

  requestAnimationFrame(step);
}

requestAnimationFrame(step);

// Fart glitter on tap/click
capy.addEventListener("click", (e) => {
  const rect = capy.getBoundingClientRect();

  // Burst from the butt: bottom-left when moving right, bottom-right when moving left
  const cx = dx >= 0 ? rect.left+30 : rect.right-30;
  const cy = rect.bottom-50;

  for (let i = 0; i < 10; i++) {
    const el = document.createElement("span");
    el.className = "glitter";
    el.textContent = GLITTER[Math.floor(Math.random() * GLITTER.length)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    el.style.setProperty("--gx", Math.cos(angle) * dist + "px");
    el.style.setProperty("--gy", Math.sin(angle) * dist + "px");
    el.style.left = cx + "px";
    el.style.top = cy + "px";
    el.style.animationDelay = Math.random() * 120 + "ms";

    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
});
