import { saveContact, sendOverviewEmail } from "@/lib/brevo";
import { overviewPath, parseLead, submittedPath } from "@/lib/lead";
import { createCooldown, createRateLimiter } from "@/lib/rate-limit";

const perIp = createRateLimiter(5, 60 * 60 * 1000);
const emailSent = createCooldown(24 * 60 * 60 * 1000);

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

async function readBody(request: Request): Promise<{ data: Record<string, unknown>; isForm: boolean }> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    return { data: (await request.json()) as Record<string, unknown>, isForm: false };
  }
  const form = await request.formData();
  return { data: Object.fromEntries(form.entries()), isForm: true };
}

export async function POST(request: Request) {
  let body: { data: Record<string, unknown>; isForm: boolean };
  try {
    body = await readBody(request);
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const parsed = parseLead(body.data);
  if (!parsed.ok) {
    if (body.isForm) return Response.redirect(`${origin}/?chyba=${parsed.error}#formular`, 303);
    return Response.json({ ok: false, error: parsed.error }, { status: 422 });
  }

  if (!perIp.hit(clientIp(request))) {
    console.warn("lead_rate_limited");
    if (body.isForm) return Response.redirect(`${origin}/?chyba=rate_limited#formular`, 303);
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const lead = parsed.lead;
  const path = overviewPath(lead);
  const done = () =>
    body.isForm ? Response.redirect(`${origin}${submittedPath(lead, request.headers.get("referer"))}`, 303) : Response.json({ ok: true, overview: path });

  if (lead.honeypot) return done();

  const key = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const sender = process.env.BREVO_SENDER_EMAIL;

  if (!key || !listId) {
    console.error("lead_storage_not_configured");
    console.error("lead_backup", JSON.stringify({ ...lead, honeypot: undefined, at: new Date().toISOString() }));
    return done();
  }

  try {
    await saveContact(lead, key, listId);
  } catch (err) {
    console.error("lead_contact_failed", String(err));
    console.error("lead_backup", JSON.stringify({ ...lead, honeypot: undefined, at: new Date().toISOString() }));
  }

  if (sender && emailSent.take(lead.email)) {
    try {
      await sendOverviewEmail(lead, `${origin}${path}`, key, sender);
    } catch (err) {
      emailSent.release(lead.email);
      console.error("lead_email_failed", String(err));
    }
  }

  return done();
}
