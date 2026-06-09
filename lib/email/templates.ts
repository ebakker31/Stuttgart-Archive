import { BRAND, FOOTER_DISCLAIMER } from "@/lib/brand";

/**
 * Transactional + lifecycle email templates. Each returns a subject + HTML +
 * text. Templates use hello/support/concierge addresses in the body and are
 * sent from noreply for system mail. Marketing emails include an unsubscribe
 * link (passed in) and require prior opt-in at the send site.
 */

export type EmailTemplateId =
  | "welcome"
  | "verify_email"
  | "password_reset"
  | "lead_notification"
  | "seller_packet_shared"
  | "buyer_inquiry"
  | "payment_receipt"
  | "upgrade_confirmation"
  | "weekly_activity"
  | "founder_notification";

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

function shell(title: string, bodyHtml: string, opts?: { unsubscribeUrl?: string }) {
  return `<!doctype html><html><body style="margin:0;background:#F4F1EA;font-family:Inter,Helvetica,Arial,sans-serif;color:#26292D;">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px;">
    <div style="font-family:Georgia,serif;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#8C2B2B;">Stuttgart Archive</div>
    <div style="height:1px;background:#D8D4C8;margin:16px 0 28px;"></div>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:24px;margin:0 0 16px;">${title}</h1>
    <div style="font-size:15px;line-height:1.6;color:#33373C;">${bodyHtml}</div>
    <div style="height:1px;background:#D8D4C8;margin:32px 0 16px;"></div>
    <p style="font-size:12px;line-height:1.5;color:#80837f;">${BRAND.tagline}<br/>Questions? Reach us at <a style="color:#8C2B2B;" href="mailto:${BRAND.emails.support}">${BRAND.emails.support}</a>.</p>
    <p style="font-size:10px;line-height:1.5;color:#9a9a93;margin-top:16px;">${FOOTER_DISCLAIMER}</p>
    ${opts?.unsubscribeUrl ? `<p style="font-size:10px;color:#9a9a93;">You opted in to product updates. <a style="color:#80837f;" href="${opts.unsubscribeUrl}">Unsubscribe</a>.</p>` : ""}
  </div></body></html>`;
}

const txt = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();

export function renderEmail(
  template: EmailTemplateId,
  data: Record<string, any> = {}
): RenderedEmail {
  switch (template) {
    case "welcome": {
      const body = `<p>Welcome to Stuttgart Archive — a private home for the story behind your machine.</p>
      <p>Start by adding your first vehicle, then upload a service record or two. We'll help you build a clean, collector-grade history that's yours to keep and yours to share, only when you choose.</p>
      <p><a href="${data.ctaUrl || "#"}" style="display:inline-block;background:#26292D;color:#F4F1EA;padding:12px 22px;border-radius:6px;text-decoration:none;">Open your garage</a></p>`;
      return { subject: "Welcome to Stuttgart Archive", html: shell("Preserve the story behind the machine.", body), text: txt(body) };
    }
    case "verify_email": {
      const body = `<p>Confirm your email to activate your archive.</p>
      <p><a href="${data.verifyUrl || "#"}" style="display:inline-block;background:#8C2B2B;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;">Verify email</a></p>
      <p style="color:#80837f;font-size:13px;">If you didn't create an account, you can ignore this message.</p>`;
      return { subject: "Verify your email", html: shell("Verify your email", body), text: txt(body) };
    }
    case "password_reset": {
      const body = `<p>We received a request to reset your password.</p>
      <p><a href="${data.resetUrl || "#"}" style="display:inline-block;background:#26292D;color:#F4F1EA;padding:12px 22px;border-radius:6px;text-decoration:none;">Reset password</a></p>
      <p style="color:#80837f;font-size:13px;">This link expires in 60 minutes. If you didn't request it, no action is needed.</p>`;
      return { subject: "Reset your Stuttgart Archive password", html: shell("Reset your password", body), text: txt(body) };
    }
    case "lead_notification": {
      const body = `<p>A buyer requested information about <strong>${data.vehicle || "your vehicle"}</strong>.</p>
      <table style="font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;color:#80837f;">Name</td><td>${data.name || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#80837f;">Email</td><td>${data.email || "—"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#80837f;">Message</td><td>${data.message || "—"}</td></tr>
      </table>
      <p style="color:#80837f;font-size:13px;">No reply is sent automatically. Review and respond from your dashboard.</p>`;
      return { subject: `New buyer inquiry — ${data.vehicle || "vehicle"}`, html: shell("New buyer inquiry", body), text: txt(body) };
    }
    case "seller_packet_shared": {
      const body = `<p>${data.sellerName || "A seller"} shared a Stuttgart Archive seller packet with you for <strong>${data.vehicle || "a vehicle"}</strong>.</p>
      <p><a href="${data.packetUrl || "#"}" style="display:inline-block;background:#26292D;color:#F4F1EA;padding:12px 22px;border-radius:6px;text-decoration:none;">View seller packet</a></p>
      <p style="color:#80837f;font-size:13px;">This packet reflects records the seller provided. Verify independently before purchase.</p>`;
      return { subject: `Seller packet — ${data.vehicle || "vehicle"}`, html: shell("A seller packet was shared with you", body), text: txt(body) };
    }
    case "buyer_inquiry": {
      const body = `<p>Your inquiry about <strong>${data.vehicle || "the vehicle"}</strong> was sent to the seller.</p>
      <p>The seller will review and respond directly. Stuttgart Archive does not send replies on anyone's behalf.</p>`;
      return { subject: "Your inquiry was sent", html: shell("Inquiry sent", body), text: txt(body) };
    }
    case "payment_receipt": {
      const body = `<p>Thank you. Here is your receipt.</p>
      <table style="font-size:14px;"><tr><td style="padding:4px 12px 4px 0;color:#80837f;">Item</td><td>${data.item || "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#80837f;">Amount</td><td>${data.amount || "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#80837f;">Date</td><td>${data.date || "—"}</td></tr></table>`;
      return { subject: "Your Stuttgart Archive receipt", html: shell("Payment receipt", body), text: txt(body) };
    }
    case "upgrade_confirmation": {
      const body = `<p>Your plan is now <strong>${data.plan || "upgraded"}</strong>. The new limits and tools are active immediately.</p>
      <p><a href="${data.ctaUrl || "#"}" style="display:inline-block;background:#8C2B2B;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;">Explore your new tools</a></p>`;
      return { subject: `You're on ${data.plan || "a new plan"}`, html: shell("Upgrade confirmed", body), text: txt(body) };
    }
    case "weekly_activity": {
      const body = `<p>Here's a quiet summary of your archive this week.</p>
      <ul style="font-size:14px;line-height:1.7;">${(data.items || []).map((i: string) => `<li>${i}</li>`).join("") || "<li>No new activity.</li>"}</ul>`;
      return {
        subject: "Your weekly archive summary",
        html: shell("Weekly archive summary", body, { unsubscribeUrl: data.unsubscribeUrl }),
        text: txt(body),
      };
    }
    case "founder_notification": {
      const body = `<p><strong>${data.title || "Operator notice"}</strong></p><p>${data.message || ""}</p>`;
      return { subject: `[Stuttgart Archive] ${data.title || "Operator notice"}`, html: shell("Operator notice", body), text: txt(body) };
    }
  }
}
