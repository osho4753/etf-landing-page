import { formatCzk } from "./calc";
import type { LeadPayload } from "./lead";

const API = "https://api.brevo.com/v3";

function headers(key: string) {
  return { "api-key": key, "Content-Type": "application/json", Accept: "application/json" };
}

export async function saveContact(lead: LeadPayload, key: string, listId: number) {
  const attributes = {
    VARIANTA: lead.variant.toUpperCase(),
    ETF: lead.etf,
    VKLAD_START: lead.initial,
    VKLAD_MESIC: lead.monthly,
    HORIZONT: lead.years,
    ROZDIL: lead.difference,
    ZDROJ_FORM: lead.location,
    LEAD_CAS: new Date().toISOString(),
    MARKETING: lead.marketing,
  };
  const body = { email: lead.email, listIds: [listId], updateEnabled: true, attributes };
  let res = await fetch(`${API}/contacts`, { method: "POST", headers: headers(key), body: JSON.stringify(body) });
  if (res.status === 400) {
    const detail = await res.text();
    console.warn("brevo_contact_attributes_rejected", detail.slice(0, 200));
    res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: headers(key),
      body: JSON.stringify({ email: lead.email, listIds: [listId], updateEnabled: true }),
    });
  }
  if (!res.ok && res.status !== 204) throw new Error(`brevo_contact_${res.status}`);
}

export async function sendOverviewEmail(lead: LeadPayload, link: string, key: string, sender: string) {
  const html = `<!doctype html><html lang="cs"><body style="margin:0;background:#f5f0e6;font-family:Arial,sans-serif;color:#0f2a22">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:520px;background:#fffdf8;border-radius:16px;padding:28px">
<tr><td>
<p style="margin:0 0 4px;font-size:13px;color:#3d5249">TrustOne · osobní přehled</p>
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2">Váš přehled ETF je tady</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:1.5">Podle vašich čísel (${formatCzk(lead.initial)} na začátek, ${formatCzk(lead.monthly)} měsíčně, ${lead.years} let) vychází modelový rozdíl v nákladech <strong>${formatCzk(Math.abs(lead.difference))}</strong>.</p>
<p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;background:#14533f;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:12px">Otevřít přehled a stáhnout PDF</a></p>
<p style="margin:0;font-size:12px;line-height:1.5;color:#3d5249">Modelový výpočet, nejde o investiční doporučení. Minulá ani modelová výkonnost nezaručuje budoucí výnosy. TrustOne není banka ani obchodník s cennými papíry.</p>
</td></tr></table></td></tr></table></body></html>`;
  const res = await fetch(`${API}/smtp/email`, {
    method: "POST",
    headers: headers(key),
    body: JSON.stringify({
      sender: { email: sender, name: "TrustOne" },
      to: [{ email: lead.email }],
      subject: "Váš osobní přehled ETF",
      htmlContent: html,
      tags: ["lead-overview"],
    }),
  });
  if (!res.ok) throw new Error(`brevo_email_${res.status}`);
}
