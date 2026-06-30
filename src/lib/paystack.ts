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
