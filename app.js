const WHATSAPP_NUMBER = "6280000000000"; // Replace with the official WhatsApp number before launch.
const SHEET_ID = "1ZRDM1XyNebsnc1yr81OKpzM0hhAr_LSTsW6jPnyVgyg";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;
const JAKARTA_TIME_ZONE = "Asia/Jakarta";

const formatRupiah = (amount) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(Number(amount));
const makeWhatsAppUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

const parseSheetDate = (value) => {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const match = String(value).match(/(?:Date\()?([0-9]{4})[,\-]([0-9]{1,2})[,\-]([0-9]{1,2})|([0-9]{1,2})-([A-Za-z]{3})-([0-9]{4})/);
  if (!match) return null;
  if (match[1]) return new Date(Number(match[1]), Number(match[2]), Number(match[3]));
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  return new Date(Number(match[6]), months[match[5]], Number(match[4]));
};

const parseStartTime = (value) => {
  const googleTime = String(value).match(/Date\(\d{4},\d{1,2},\d{1,2},(\d{1,2}),(\d{1,2})/);
  if (googleTime) return { hours: Number(googleTime[1]), minutes: Number(googleTime[2]) };
  const match = String(value).match(/(\d{1,2}):(\d{2})/);
  return match ? { hours: Number(match[1]), minutes: Number(match[2]) } : { hours: 0, minutes: 0 };
};

const formatClassDate = (date) => new Intl.DateTimeFormat("en-GB", {
  weekday: "long", day: "numeric", month: "short", timeZone: JAKARTA_TIME_ZONE,
}).format(date);

const formatTimeRange = (startTime, duration) => {
  const { hours, minutes } = parseStartTime(startTime);
  const durationHours = Number(String(duration).match(/\d+/)?.[0] || 1);
  const endHours = (hours + durationHours) % 24;
  const pad = (number) => String(number).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}–${pad(endHours)}:${pad(minutes)}`;
};

const normalizeRows = (table) => {
  const headers = table.cols.map((column) => String(column.label || "").trim().toLowerCase());
  return table.rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row.c[index]?.v ?? ""])));
};

const isWithinDisplayWindow = (item) => {
  const date = parseSheetDate(item.date);
  if (!date || String(item.active).toUpperCase() !== "TRUE") return false;
  const { hours, minutes } = parseStartTime(item.start_time);
  date.setHours(hours, minutes, 0, 0);
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return date >= oneDayAgo;
};

let allClasses = [];
let activeFilter = "all";

const renderClasses = (items) => {
  const classGrid = document.querySelector("#class-grid");
  if (!classGrid) return;
  const limit = Number(classGrid.dataset.limit || 0);
  const visibleItems = (activeFilter === "all" ? items : items.filter((item) => item.audience === activeFilter)).slice(0, limit || undefined);
  if (!visibleItems.length) {
    classGrid.innerHTML = '<p class="class-empty">There are no upcoming classes right now. Check back soon.</p>';
    return;
  }
  classGrid.innerHTML = visibleItems.map((item) => {
    const date = parseSheetDate(item.date);
    const program = escapeHtml(item.program);
    const message = `Hi Sync, I'd like to ask about the ${item.audience} ${item.program} class on ${formatClassDate(date)}.`;
    return `
      <article class="class-card">
        <div class="card-top"><span class="class-type">${escapeHtml(item.audience)}</span><span class="slots">${escapeHtml(item.slots)} slots left</span></div>
        <h3>${program.replace(" &amp; ", " &amp;<br />")}</h3>
        <p class="age">${escapeHtml(item.age)}</p>
        <dl class="class-details">
          <div><dt>When</dt><dd>${formatClassDate(date)}, ${formatTimeRange(item.start_time, item.duration)}</dd></div>
          <div><dt>Where</dt><dd><a class="location-link" href="${escapeHtml(item.location_url)}" target="_blank" rel="noopener">${escapeHtml(item.location)} <span aria-hidden="true">↗</span></a></dd></div>
          <div><dt>Duration</dt><dd>${escapeHtml(item.duration)}</dd></div>
          <div><dt>Coach</dt><dd>${escapeHtml(item.coach || "To be confirmed")}</dd></div>
        </dl>
        <div class="card-bottom"><span>From <strong>${formatRupiah(item.price)}</strong></span><a class="card-link" href="${makeWhatsAppUrl(message)}" target="_blank" rel="noopener">Join <span aria-hidden="true">↗</span></a></div>
      </article>`;
  }).join("");
};

const getSheetTable = () => new Promise((resolve, reject) => {
  const callbackName = "syncSheetCallback";
  const script = document.createElement("script");
  const timeout = window.setTimeout(() => reject(new Error("Class schedule request timed out.")), 10000);

  window[callbackName] = (response) => {
    window.clearTimeout(timeout);
    script.remove();
    delete window[callbackName];
    if (response.status === "error") {
      reject(new Error(response.errors?.[0]?.detailed_message || "Class schedule could not be loaded."));
      return;
    }
    resolve(response.table);
  };

  script.src = `${SHEET_URL}?tqx=out:json;responseHandler:${callbackName}`;
  script.onerror = () => {
    window.clearTimeout(timeout);
    delete window[callbackName];
    reject(new Error("Class schedule could not be loaded."));
  };
  document.head.append(script);
});

const loadClasses = async () => {
  const classGrid = document.querySelector("#class-grid");
  try {
    const table = await getSheetTable();
    allClasses = normalizeRows(table)
      .filter(isWithinDisplayWindow)
      .sort((a, b) => parseSheetDate(a.date) - parseSheetDate(b.date));
    renderClasses(allClasses);
  } catch (error) {
    if (classGrid) classGrid.innerHTML = '<p class="class-empty">Classes are temporarily unavailable. Please try again shortly.</p>';
    console.error(error);
  }
};

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = makeWhatsAppUrl(link.dataset.message || "Hi Sync, I'd like to ask about a class.");
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filter) => filter.classList.toggle("active", filter === button));
    renderClasses(allClasses);
  });
});

loadClasses();
