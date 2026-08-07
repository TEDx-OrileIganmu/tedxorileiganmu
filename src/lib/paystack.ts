import { createServerFn } from "@tanstack/react-start";

type InitInput = {
  email: string;
  amount: number;
  reference: string;
  tier: string;
  name: string;
  callbackUrl: string;
};

type VerifyInput = {
  reference: string;
};

export const initializePayment = createServerFn({ method: "POST" })
  .validator((d: InitInput) => d)
  .handler(async ({ data }) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not configured");

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: data.amount * 100,
        reference: data.reference,
        callback_url: data.callbackUrl,
        metadata: {
          name: data.name,
          tier: data.tier,
          custom_fields: [
            { display_name: "Full Name", variable_name: "full_name", value: data.name },
            { display_name: "Ticket Tier", variable_name: "ticket_tier", value: data.tier },
          ],
        },
      }),
    });

    const json = (await res.json()) as {
      status: boolean;
      message: string;
      data: { authorization_url: string; access_code: string; reference: string };
    };
    if (!json.status) throw new Error(json.message || "Paystack initialization failed");
    return { authorization_url: json.data.authorization_url, access_code: json.data.access_code };
  });

export const verifyPayment = createServerFn({ method: "GET" })
  .validator((d: VerifyInput) => d)
  .handler(async ({ data }) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not configured");

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } },
    );

    const json = (await res.json()) as {
      status: boolean;
      message: string;
      data: {
        status: "success" | "failed" | "abandoned";
        amount: number;
        reference: string;
        customer: { email: string };
      };
    };
    if (!json.status) throw new Error(json.message || "Payment verification failed");

    return {
      status: json.data.status,
      amount: json.data.amount / 100,
      reference: json.data.reference,
    };
  });

type EmailInput = {
  to: string;
  name: string;
  tier: string;
  reference: string;
  amount: number;
  quantity: number;
};

export const sendTicketEmail = createServerFn({ method: "POST" })
  .validator((d: EmailInput) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { sent: false, reason: "no_key" };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your TEDxOrileIganmu Ticket</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
.wrap{max-width:600px;margin:32px auto;background:#fff;}
.hdr{background:#111;padding:32px;border-top:4px solid #E62B1E;}
.ted{background:#E62B1E;color:#fff;font-size:13px;font-weight:900;letter-spacing:.08em;padding:5px 8px 5px 10px;line-height:1;display:inline;}
.tedx{background:#111;color:#E62B1E;border:1px solid #E62B1E;font-size:13px;font-weight:900;padding:5px 8px;line-height:1;display:inline;}
.evname{margin-left:10px;color:rgba(255,255,255,.5);font-size:11px;letter-spacing:.25em;text-transform:uppercase;}
.body{padding:40px 32px 32px;}
h1{font-size:34px;font-weight:700;color:#111;letter-spacing:-.02em;margin-bottom:6px;}
.sub{color:#666;font-size:15px;line-height:1.5;margin-bottom:32px;}
.card{border:1px solid #e5e5e5;margin-bottom:32px;}
.card-top{background:#111;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;}
.tier{background:#E62B1E;color:#fff;font-size:10px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;padding:6px 14px;}
.ref{color:rgba(255,255,255,.4);font-size:10px;letter-spacing:.15em;font-family:monospace;}
.row{display:flex;justify-content:space-between;align-items:baseline;padding:14px 24px;border-bottom:1px solid #f0f0f0;}
.row:last-child{border-bottom:none;}
.lbl{color:#999;font-size:10px;text-transform:uppercase;letter-spacing:.2em;}
.val{color:#111;font-size:14px;font-weight:500;}
.theme-row{display:flex;align-items:center;gap:10px;padding:14px 24px;border-top:1px solid #f0f0f0;}
.theme-bar{width:20px;height:2px;background:#E62B1E;flex-shrink:0;}
.theme-txt{color:#E62B1E;font-size:10px;letter-spacing:.2em;text-transform:uppercase;}
.cta{text-align:center;padding:0 32px 32px;}
.btn{display:inline-block;background:#E62B1E;color:#fff;text-decoration:none;font-size:11px;letter-spacing:.25em;text-transform:uppercase;padding:16px 32px;}
.foot{background:#f9f9f9;border-top:1px solid #eee;padding:24px 32px;}
.foot p{color:#999;font-size:11px;line-height:1.7;}
</style>
</head>
<body>
<div class="wrap">
<div class="hdr">
  <img src="https://tedxorileiganmu.xyz/logo-white.png" alt="TEDxOrileIganmu" width="160" style="display:block;height:auto;" />
</div>
<div class="body">
  <h1>You're in the room.</h1>
  <p class="sub">Your seat at TEDxOrileIganmu is confirmed. See you on 6&nbsp;March&nbsp;2027.</p>
  <div class="card">
    <div class="card-top">
      <span class="tier">${data.tier}</span>
      <span class="ref">${data.reference}</span>
    </div>
    <div class="row"><span class="lbl">Attendee</span><span class="val">${data.name}</span></div>
    <div class="row"><span class="lbl">Seats</span><span class="val">${data.quantity} seat${data.quantity > 1 ? "s" : ""}</span></div>
    <div class="row"><span class="lbl">Amount Paid</span><span class="val">&#8358;${data.amount.toLocaleString()}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">6 March 2027</span></div>
    <div class="row"><span class="lbl">Venue</span><span class="val">Rita Lori Event Centre, 1 Taoridi St, Surulere, Lagos 101211</span></div>
    <div class="theme-row"><span class="theme-bar"></span><span class="theme-txt">Beyond Boundaries &middot; Ideas that transcend place, perspective, and possibility.</span></div>
  </div>
  <!-- WhatsApp CTA -->
  <div style="border:1px solid #e8e8e8;margin:0 32px 32px;overflow:hidden;">
    <div style="height:3px;background:#25D366;"></div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 3px;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#aaa;">Volunteer Group</p>
      <p style="margin:0 0 5px;font-size:16px;font-weight:700;color:#111;">Join our WhatsApp Group</p>
      <p style="margin:0 0 16px;font-size:12px;color:#666;line-height:1.5;">Connect with attendees, get event updates and stay in the loop.</p>
      <a href="https://chat.whatsapp.com/DUDnFrjo24lBzlXzhUiJiH?mode=gi_t" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-size:10px;letter-spacing:.2em;text-transform:uppercase;padding:12px 20px;font-weight:700;">Join Now &rarr;</a>
    </div>
  </div>
  <div class="cta"><a class="btn" href="https://tedxorileiganmu.xyz">View Event Info &rarr;</a></div>
</div>
<div class="foot">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:18px;"><tr>
    <td style="padding-right:10px;"><a href="https://instagram.com/tedxorileiganmu" style="display:inline-block;background:#333333;border-radius:8px;text-decoration:none;line-height:0;padding:9px;" title="Instagram"><img src="https://tedxorileiganmu.xyz/icon-instagram.svg" width="18" height="18" alt="Instagram" style="display:block;border:0;"/></a></td>
    <td style="padding-right:10px;"><a href="https://tedxorileiganmu.xyz" style="display:inline-block;background:#333333;border-radius:8px;text-decoration:none;line-height:0;padding:9px;" title="Website"><img src="https://tedxorileiganmu.xyz/icon-website.svg" width="18" height="18" alt="Website" style="display:block;border:0;"/></a></td>
    <td><a href="https://chat.whatsapp.com/DUDnFrjo24lBzlXzhUiJiH?mode=gi_t" style="display:inline-block;background:#25D366;border-radius:8px;text-decoration:none;line-height:0;padding:9px;" title="WhatsApp Group"><img src="https://tedxorileiganmu.xyz/icon-whatsapp.svg" width="18" height="18" alt="WhatsApp" style="display:block;border:0;"/></a></td>
  </tr></table>
  <p>Keep your reference number safe &mdash; you may be asked at the door. No re-entry without event badge. Doors open 8:30&nbsp;AM.<br/><br/>TEDxOrileIganmu &middot; Rita Lori Event Centre &middot; 1 Taoridi St, Surulere, Lagos 101211 &middot; 6&nbsp;March&nbsp;2027<br/>Independently operated under license from TED.</p>
</div>
</div>
</body>
</html>`;

    const from = process.env.RESEND_FROM_EMAIL ?? "TEDxOrileIganmu <noreply@tedxorileiganmu.xyz>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [data.to],
          subject: `Your TEDxOrileIganmu ticket · ${data.reference}`,
          html,
          reply_to: "tedxorileiganmu@gmail.com",
        }),
      });
      if (!res.ok) return { sent: false, reason: await res.text() };
    } catch {
      return { sent: false, reason: "fetch_error" };
    }
    return { sent: true };
  });

type AdminMessageInput = {
  to: string;
  name: string;
  subject: string;
  body: string;
};

export const sendAdminMessage = createServerFn({ method: "POST" })
  .validator((d: AdminMessageInput) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { sent: false, reason: "no_key" };

    const bodyHtml = data.body
      .split("\n")
      .map((line) =>
        line.trim()
          ? `<p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.75;font-weight:400;">${line}</p>`
          : `<p style="margin:0 0 18px;">&nbsp;</p>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${data.subject}</title>
</head>
<body style="margin:0;padding:0;background:#efefef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<div style="max-width:600px;margin:0 auto;">

  <!-- Header -->
  <div style="background:#111111;border-top:4px solid #E62B1E;">
    <div style="padding:36px 44px 40px;">
      <!-- Logo -->
      <div style="margin-bottom:40px;">
        <img src="https://tedxorileiganmu.xyz/logo-white.png" alt="TEDxOrileIganmu" width="160" style="display:block;height:auto;" />
      </div>
      <!-- Hero -->
      <p style="margin:0 0 8px;color:rgba(255,255,255,.3);font-size:10px;letter-spacing:.3em;text-transform:uppercase;">Message from the curator</p>
      <h1 style="margin:0;color:#fff;font-size:38px;font-weight:800;letter-spacing:-.025em;line-height:1.1;">Beyond<br/><span style="color:#E62B1E;font-weight:300;font-style:italic;">Boundaries.</span></h1>
    </div>
    <!-- Red accent bar -->
    <div style="height:1px;background:linear-gradient(to right,#E62B1E,transparent);"></div>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:48px 44px 40px;">
    <!-- Greeting -->
    <p style="margin:0 0 32px;font-size:28px;font-weight:700;color:#111;letter-spacing:-.02em;line-height:1.2;">Hi ${data.name},</p>

    <!-- Message body -->
    <div style="margin-bottom:40px;">${bodyHtml}</div>

    <!-- Divider with diamond -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-flex;align-items:center;gap:16px;">
        <div style="width:60px;height:1px;background:#e5e5e5;display:inline-block;vertical-align:middle;"></div>
        <div style="width:7px;height:7px;background:#E62B1E;transform:rotate(45deg);display:inline-block;vertical-align:middle;"></div>
        <div style="width:60px;height:1px;background:#e5e5e5;display:inline-block;vertical-align:middle;"></div>
      </div>
    </div>

    <!-- Event card -->
    <div style="border:1px solid #e8e8e8;position:relative;overflow:hidden;">
      <div style="height:3px;background:#E62B1E;"></div>
      <div style="padding:28px 32px;">
        <p style="margin:0 0 20px;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#aaa;">Event Details</p>
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="padding:0 32px 0 0;vertical-align:top;white-space:nowrap;">
              <p style="margin:0 0 4px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#bbb;">Date</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#111;letter-spacing:-.01em;">6 March 2027</p>
              <p style="margin:2px 0 0;font-size:11px;color:#888;">Saturday · Doors 8:30 AM</p>
            </td>
            <td style="padding:0 32px 0 0;vertical-align:top;white-space:nowrap;">
              <p style="margin:0 0 4px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#bbb;">Venue</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#111;letter-spacing:-.01em;">Rita Lori Event Centre</p>
              <p style="margin:2px 0 0;font-size:11px;color:#888;">1 Taoridi St, Surulere, Lagos 101211</p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- WhatsApp CTA -->
    <div style="border:1px solid #e8e8e8;margin-top:40px;overflow:hidden;">
      <div style="height:3px;background:#25D366;"></div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:#aaa;">Volunteer Group</p>
        <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111;letter-spacing:-.01em;">Join our WhatsApp Group</p>
        <p style="margin:0 0 20px;font-size:13px;color:#666;line-height:1.5;">Stay in the loop — get event updates, behind-the-scenes news, and connect with fellow attendees.</p>
        <a href="https://chat.whatsapp.com/DUDnFrjo24lBzlXzhUiJiH?mode=gi_t" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase;padding:14px 24px;font-weight:700;">Join Now &rarr;</a>
      </div>
    </div>

    <!-- Signature -->
    <div style="margin-top:40px;padding-top:28px;border-top:1px solid #f0f0f0;">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#111;">Ekanem Michael</p>
      <p style="margin:0;font-size:12px;color:#999;letter-spacing:.05em;">Curator · TEDxOrileIganmu</p>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#111111;padding:28px 44px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:20px;"><tr>
      <td style="padding-right:10px;"><a href="https://instagram.com/tedxorileiganmu" style="display:inline-block;background:#333333;border-radius:8px;text-decoration:none;line-height:0;padding:9px;" title="Instagram"><img src="https://tedxorileiganmu.xyz/icon-instagram.svg" width="18" height="18" alt="Instagram" style="display:block;border:0;"/></a></td>
      <td style="padding-right:10px;"><a href="https://tedxorileiganmu.xyz" style="display:inline-block;background:#333333;border-radius:8px;text-decoration:none;line-height:0;padding:9px;" title="Website"><img src="https://tedxorileiganmu.xyz/icon-website.svg" width="18" height="18" alt="Website" style="display:block;border:0;"/></a></td>
      <td><a href="https://chat.whatsapp.com/DUDnFrjo24lBzlXzhUiJiH?mode=gi_t" style="display:inline-block;background:#25D366;border-radius:8px;text-decoration:none;line-height:0;padding:9px;" title="WhatsApp Group"><img src="https://tedxorileiganmu.xyz/icon-whatsapp.svg" width="18" height="18" alt="WhatsApp" style="display:block;border:0;"/></a></td>
    </tr></table>
    <p style="margin:0 0 10px;color:rgba(255,255,255,.25);font-size:11px;line-height:1.8;">
      TEDxOrileIganmu &middot; Rita Lori Event Centre, 1 Taoridi St, Surulere, Lagos 101211 &middot; 6&nbsp;March&nbsp;2027<br/>
      This event is independently organised under a license from TED.
    </p>
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,.15);">
      Questions? <a href="mailto:tedxorileiganmu@gmail.com" style="color:#E62B1E;text-decoration:none;">tedxorileiganmu@gmail.com</a>
    </p>
  </div>

</div>
</body>
</html>`;

    const from = process.env.RESEND_FROM_EMAIL ?? "TEDxOrileIganmu <noreply@tedxorileiganmu.xyz>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [data.to],
          subject: data.subject,
          html,
          reply_to: "tedxorileiganmu@gmail.com",
        }),
      });
      if (!res.ok) return { sent: false, reason: await res.text() };
    } catch {
      return { sent: false, reason: "fetch_error" };
    }
    return { sent: true };
  });
