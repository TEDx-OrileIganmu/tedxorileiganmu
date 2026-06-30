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
  <span class="ted">TED</span><span class="tedx">x</span><span class="evname">OrileIganmu</span>
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
    <div class="row"><span class="lbl">Venue</span><span class="val">The Stable by Union Bank, Surulere, Lagos</span></div>
    <div class="theme-row"><span class="theme-bar"></span><span class="theme-txt">Beyond Boundaries &middot; Ideas that transcend place, perspective, and possibility.</span></div>
  </div>
  <div class="cta"><a class="btn" href="https://tedxorileiganmu.com/tickets">View Event Info &rarr;</a></div>
</div>
<div class="foot">
  <p>Keep your reference number safe &mdash; you may be asked at the door. No re-entry without event badge. Doors open 8:30&nbsp;AM.<br/><br/>TEDxOrileIganmu &middot; The Stable by Union Bank &middot; Surulere, Lagos &middot; 6&nbsp;March&nbsp;2027<br/>Independently operated under license from TED.</p>
</div>
</div>
</body>
</html>`;

    const from = process.env.RESEND_FROM_EMAIL ?? "TEDxOrileIganmu <noreply@tedxorileiganmu.com>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [data.to],
          subject: `Your TEDxOrileIganmu ticket · ${data.reference}`,
          html,
        }),
      });
      if (!res.ok) return { sent: false, reason: await res.text() };
    } catch {
      return { sent: false, reason: "fetch_error" };
    }
    return { sent: true };
  });
