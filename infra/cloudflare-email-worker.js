/**
 * Cloudflare Email Routing worker: parses inbound mail, forwards a copy,
 * POSTs JSON to the FlowHQ API /mail/inbound.
 *
 * Route `contact@ahmadcodes.com` to this worker in the dashboard
 * (Email → Email Routing → Email Workers).
 *
 * @typedef {{ INBOUND_MAIL_SECRET: string; FORWARD_TO: string; INBOUND_API_URL?: string }} Env
 */

import PostalMime from 'postal-mime';

const DEFAULT_INBOUND_URL = 'https://api.ahmadcodes.com/mail/inbound';
 * @returns {string}
 */
function pickAddress(addr) {
  if (addr == null) return '';
  if (typeof addr === 'string') return addr.trim();
  if (typeof addr === 'object' && addr !== null && 'address' in addr) {
    return String(/** @type {{ address: string }} */ (addr).address).trim();
  }
  return '';
}

/**
 * @param {unknown} list
 * @returns {string[]}
 */
function mapAddresses(list) {
  if (!list) return [];
  const arr = Array.isArray(list) ? list : [list];
  return arr.map(pickAddress).filter(Boolean);
}

/**
 * @param {*} parsed
 * @param {Env} env
 */
async function postInbound(parsed, env) {
  const url = env.INBOUND_API_URL || DEFAULT_INBOUND_URL;
  const fromAddress = pickAddress(parsed.from);
  const subject = parsed.subject || '(no subject)';
  const bodyHtml = parsed.html || '';
  const bodyText = parsed.text || '';

  let toAddresses = mapAddresses(parsed.to);
  if (!toAddresses.length) {
    toAddresses = ['contact@ahmadcodes.com'];
  }

  const payload = {
    fromAddress,
    toAddresses,
    ccAddresses: mapAddresses(parsed.cc),
    bccAddresses: mapAddresses(parsed.bcc),
    subject,
    bodyHtml,
    bodyText,
    messageId: parsed.messageId || undefined,
    inReplyTo: parsed.inReplyTo || undefined,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-inbound-secret': env.INBOUND_MAIL_SECRET,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[ahmadcodes-email] inbound POST ${res.status}: ${text}`);
  }
}

export default {
  /**
   * @param {*} message
   * @param {Env} env
   * @param {*} ctx
   */
  async email(message, env, ctx) {
    try {
      const parsed = await PostalMime.parse(message.raw);

      try {
        await message.forward(env.FORWARD_TO);
      } catch (err) {
        console.error('[ahmadcodes-email] forward failed', err);
      }

      try {
        await postInbound(parsed, env);
      } catch (err) {
        console.error('[ahmadcodes-email] inbound POST failed', err);
      }
    } catch (err) {
      console.error('[ahmadcodes-email] parse failed', err);
      try {
        await message.forward(env.FORWARD_TO);
      } catch (err2) {
        console.error('[ahmadcodes-email] fallback forward failed', err2);
      }
    }
  },
};
