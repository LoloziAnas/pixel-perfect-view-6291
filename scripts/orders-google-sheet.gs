/**
 * NOAUMA — receives orders from the website, saves them in this Google Sheet and emails the shop.
 *
 * Setup (once):
 *   1. Create a Google Sheet, then Extensions → Apps Script. Replace Code.gs with this file.
 *   2. Set SECRET below to a long random password. Put the same value in the website's
 *      ORDERS_WEBHOOK_SECRET setting.
 *   3. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone.
 *      Authorize when asked, then copy the Web app URL into ORDERS_WEBHOOK_URL.
 *   After editing this script later: Deploy → Manage deployments → Edit → Version: New version
 *   (keeps the same URL).
 */

const SECRET = "CHANGE-ME-to-a-long-random-password";
const NOTIFY_EMAIL = "contact.noauma@gmail.com";
const SHEET_NAME = "Commandes";
const STATUSES = ["Nouvelle", "Appelée", "Confirmée", "Expédiée", "Livrée", "Annulée", "Injoignable"];
const HEADERS = [
  "Date",
  "N° commande",
  "Statut",
  "Nom",
  "Téléphone",
  "Ville",
  "Adresse",
  "Articles",
  "Total (MAD)",
  "Remarque",
  "Langue",
];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "bad request" });
  }
  if (data.secret !== SECRET) return json({ ok: false, error: "forbidden" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet().appendRow([
      new Date(data.createdAt),
      data.id,
      "Nouvelle",
      safe(data.name),
      "'" + String(data.phone), // keep the leading 0 / +212
      safe(data.city),
      safe(data.address),
      safe(data.itemsText),
      Number(data.total),
      safe(data.notes),
      data.lang === "ar" ? "Arabe" : "Français",
    ]);
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "Nouvelle commande " + data.id + " — " + data.total + " MAD",
    body: String(data.message) + "\n\nSuivi des commandes : " + SpreadsheetApp.getActive().getUrl(),
  });

  return json({ ok: true });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    // Status dropdown for following up each order.
    sheet
      .getRange("C2:C")
      .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES).build());
  }
  return sheet;
}

// Customer text starting with = + - @ would otherwise be run as a spreadsheet formula.
function safe(value) {
  const s = value == null ? "" : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
