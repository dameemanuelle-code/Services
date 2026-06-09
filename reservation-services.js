const availability = {
  1: ["Am", "Pm"],
  2: ["Am", "Pm"],
  3: ["Pm"],
  4: ["Am", "Pm", "Soirée"],
  5: ["Am", "Pm"],
  6: ["Pm", "Soirée"],
  0: []
};

const calendar = document.getElementById("calendar");
const dateInput = document.getElementById("date");
const slotSelect = document.getElementById("slot");
const slotPills = document.getElementById("slotPills");
const slotHint = document.getElementById("slotHint");

let selectedDate = "";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function buildCalendar() {
  calendar.innerHTML = "";

  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const day = d.getDay();
    const slots = availability[day] || [];
    const iso = formatDate(d);

    const el = document.createElement("button");
    el.type = "button";
    el.className = "day";

    if (slots.length === 0) {
      el.classList.add("unavailable");
    }

    if (iso === selectedDate) {
      el.classList.add("selected");
    }

    const dow = d.toLocaleDateString("fr-CA", { weekday: "short" });
    const month = d.toLocaleDateString("fr-CA", { month: "short" });

    el.innerHTML = `
      <div class="day-top">
        <span class="day-num">${d.getDate()}</span>
        <span class="day-dow">${dow}</span>
      </div>
      <div class="day-badges">
        <span class="badge">${month}</span>
        ${
          slots.length
            ? `<span class="badge">${slots.length} choix</span>`
            : `<span class="badge">Complet</span>`
        }
      </div>
    `;

    if (slots.length) {
      el.addEventListener("click", () => {
        selectedDate = iso;
        dateInput.value = iso;
        updateSlots(iso);
        buildCalendar();
      });
    }

    calendar.appendChild(el);
  }
}

function updateSlots(dateValue) {
  slotSelect.innerHTML = "";
  slotPills.innerHTML = "";
  slotHint.textContent = "";

  if (!dateValue) {
    slotSelect.innerHTML = `<option value="">Choisir une date d’abord</option>`;
    return;
  }

  const d = new Date(dateValue + "T12:00:00");
  const slots = availability[d.getDay()] || [];

  if (!slots.length) {
    slotSelect.innerHTML = `<option value="">Aucun créneau disponible</option>`;
    slotHint.textContent = "Cette date ne semble pas disponible. Choisissez une autre journée.";
    return;
  }

  slotSelect.innerHTML = `<option value="">Choisir un créneau</option>`;

  slots.forEach(slot => {
    const opt = document.createElement("option");
    opt.value = slot;
    opt.textContent = slot;
    slotSelect.appendChild(opt);

    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pill";
    pill.textContent = slot;

    pill.addEventListener("click", () => {
      slotSelect.value = slot;

      document.querySelectorAll(".pill").forEach(p => {
        p.classList.remove("selected");
      });

      pill.classList.add("selected");
    });

    slotPills.appendChild(pill);
  });
}

dateInput.addEventListener("change", () => {
  selectedDate = dateInput.value;
  updateSlots(selectedDate);
  buildCalendar();
});

buildCalendar();
