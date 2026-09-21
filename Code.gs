/**
 * Emotionally Whole — Reviews backend
 * Google Apps Script Web App backed by a Google Sheet.
 *
 * SETUP (once):
 *   1. Create a Google Sheet. Extensions ▸ Apps Script.
 *   2. Delete the sample code, paste this whole file in.
 *   3. Change ADMIN_KEY below to your own secret passcode.
 *   4. Deploy ▸ New deployment ▸ type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the Web app URL (ends in /exec) into CONFIG.endpoint in index.html.
 *
 * The sheet ("Reviews") is created automatically on first use. You can also
 * moderate straight in the sheet: edit the comment cell, set hidden to TRUE
 * to hide a row from visitors, or delete the row to remove it.
 */

const SHEET_NAME  = 'Reviews';
const ADMIN_KEY   = 'change-this-to-a-long-secret';  // <-- set your own admin passcode
const MAX_COMMENT = 1500;
const MAX_NAME    = 80;

/* Google Apps Script entry point for GET (and JSONP). */
function doGet(e){
  const cb = (e && e.parameter && e.parameter.callback) || '';
  let out;
  try {
    const p = (e && e.parameter) || {};
    const action  = p.action || 'list';
    const isAdmin = !!p.admin && p.admin === ADMIN_KEY;
    switch (action) {
      case 'list':   out = { ok:true, admin:isAdmin, reviews: listReviews(isAdmin) }; break;
      case 'create': out = createReview(p.name, p.comment); break;
      case 'edit':   out = requireAdmin(isAdmin) || editReview(p.id, p.comment); break;
      case 'hide':   out = requireAdmin(isAdmin) || setHidden(p.id, String(p.hidden) === 'true'); break;
      case 'delete': out = requireAdmin(isAdmin) || deleteReview(p.id); break;
      default:       out = { ok:false, error:'Unknown action' };
    }
  } catch (err) {
    out = { ok:false, error: String((err && err.message) || err) };
  }
  return reply(out, cb);
}

/* Some hosts send writes as POST — route them the same way. */
function doPost(e){ return doGet(e); }

function reply(obj, cb){
  const json = JSON.stringify(obj);
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function requireAdmin(isAdmin){ return isAdmin ? null : { ok:false, error:'Not authorized' }; }

/* ---------- sheet helpers ---------- */
function sheet(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'timestamp', 'name', 'comment', 'hidden']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function getRows(){
  const values = sheet().getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    rows.push({
      rowIndex: i + 1,
      id:        String(r[0]),
      timestamp: r[1] instanceof Date ? r[1].toISOString() : String(r[1]),
      name:      String(r[2]),
      comment:   String(r[3]),
      hidden:    r[4] === true || String(r[4]).toLowerCase() === 'true'
    });
  }
  return rows;
}

function findRow(id){ return getRows().filter(function(r){ return r.id === String(id); })[0]; }

function clean(s, max){
  s = (s == null ? '' : String(s)).replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  if (s.length > max) s = s.slice(0, max);
  return s;
}

/* ---------- operations ---------- */
function listReviews(isAdmin){
  let rows = getRows();
  if (!isAdmin) rows = rows.filter(function(r){ return !r.hidden; });
  rows.sort(function(a, b){ return (b.timestamp || '').localeCompare(a.timestamp || ''); });
  return rows.map(function(r){
    return { id:r.id, date:r.timestamp, name:r.name, comment:r.comment, hidden:r.hidden };
  });
}

function createReview(name, comment){
  name    = clean(name, MAX_NAME);
  comment = clean(comment, MAX_COMMENT);
  if (!name || !comment) return { ok:false, error:'Name and reflection are both required.' };
  const id = Utilities.getUuid();
  const ts = new Date().toISOString();
  sheet().appendRow([id, ts, name, comment, false]);
  return { ok:true, review:{ id:id, date:ts, name:name, comment:comment, hidden:false } };
}

function editReview(id, comment){
  const row = findRow(id);
  if (!row) return { ok:false, error:'Review not found.' };
  comment = clean(comment, MAX_COMMENT);
  if (!comment) return { ok:false, error:'Reflection cannot be empty.' };
  sheet().getRange(row.rowIndex, 4).setValue(comment);
  return { ok:true, id:String(id), comment:comment };
}

function setHidden(id, hidden){
  const row = findRow(id);
  if (!row) return { ok:false, error:'Review not found.' };
  sheet().getRange(row.rowIndex, 5).setValue(hidden);
  return { ok:true, id:String(id), hidden:hidden };
}

function deleteReview(id){
  const row = findRow(id);
  if (!row) return { ok:false, error:'Review not found.' };
  sheet().deleteRow(row.rowIndex);
  return { ok:true, id:String(id), deleted:true };
}
