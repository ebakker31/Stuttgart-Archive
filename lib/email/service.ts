import { Resend } from "resend";
import { config } from "@/lib/config";
import { getAdminSupabase } from "@/lib/supabase/server";
import { renderEmail, type EmailTemplateId } from "./templates";

/**
 * Email sending service.
 *
 * MOCK MODE (default when RESEND_API_KEY is absent or EMAIL_MOCK_MODE=true):
 * emails are NOT sent externally — they are logged to the console and recorded
 * in the `emails` table with status "mocked". This makes the entire email flow
 * testable with no domain or provider account.
 *
 * Email rules enforced here:
 *  - System mail sends from noreply.
 *  - Marketing mail requires `marketing: true` AND a prior opt-in (caller's
 *    responsibility) AND includes an unsubscribe link.
 *  - Buyer/seller messages are transactional notifications only; the platform
 *    never sends a reply on a user's behalf without explicit approval.
 */

export interface SendEmailArgs {
  to: string;
  template: EmailTemplateId;
  data?: Record<string, any>;
  from?: string;
  organizationId?: string;
  userId?: string;
  marketing?: boolean;
}

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (config.email.mockMode) return null;
  if (!_resend) _resend = new Resend(config.email.apiKey);
  return _resend;
}

export async function sendEmail(args: SendEmailArgs): Promise<{ ok: boolean; mocked: boolean; id?: string }> {
  const rendered = renderEmail(args.template, args.data);
  const from = args.from || config.email.from.noreply;
  const resend = getResend();

  let status = "mocked";
  let providerMessageId: string | undefined;
  let ok = true;

  if (!resend) {
    // eslint-disable-next-line no-console
    console.info(`\n[EMAIL · MOCK] to=${args.to} from=${from}\n  subject: ${rendered.subject}\n  template: ${args.template}\n`);
  } else {
    try {
      const result = await resend.emails.send({
        from,
        to: args.to,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      });
      providerMessageId = (result as any)?.data?.id;
      status = "sent";
    } catch (err) {
      status = "failed";
      ok = false;
      // eslint-disable-next-line no-console
      console.error("[EMAIL] send failed", err);
    }
  }

  // Persist an audit record of every email attempt.
  const admin = getAdminSupabase();
  if (admin && args.organizationId) {
    await admin.from("emails").insert({
      organization_id: args.organizationId,
      user_id: args.userId ?? null,
      to_email: args.to,
      from_email: from,
      subject: rendered.subject,
      template: args.template,
      status,
      provider_message_id: providerMessageId ?? null,
      metadata_json: { marketing: Boolean(args.marketing), mocked: !resend },
    });
  }

  return { ok, mocked: !resend, id: providerMessageId };
}

/** Notify the founder/operator. No-op if FOUNDER_NOTIFICATION_EMAIL is unset. */
export async function notifyFounder(title: string, message: string) {
  if (!config.email.founderEmail) return;
  await sendEmail({
    to: config.email.founderEmail,
    from: config.email.from.noreply,
    template: "founder_notification",
    data: { title, message },
  });
}
