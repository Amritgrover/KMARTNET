// Supabase Edge Function: send-push
// Automatically sends web push notifications when rows are inserted into pwa_notifications.
// Triggered via a PostgreSQL trigger + pg_net HTTP call.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  ApplicationServer,
  importVapidKeys,
} from "https://esm.sh/jsr/@negrel/webpush@0.5.0";

// Helper: Convert URL-safe base64 raw key to JWK format for P-256 ECDSA
function rawPrivateKeyToJwk(
  privateKeyB64: string,
  publicKeyB64: string,
): { publicKey: JsonWebKey; privateKey: JsonWebKey } {
  // Decode public key from URL-safe base64
  const pubBytes = Uint8Array.from(
    atob(publicKeyB64.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );

  // Skip 0x04 prefix, split into x (32 bytes) and y (32 bytes)
  const x = btoa(String.fromCharCode(...pubBytes.slice(1, 33)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const y = btoa(String.fromCharCode(...pubBytes.slice(33, 65)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return {
    publicKey: {
      kty: "EC",
      crv: "P-256",
      x,
      y,
      ext: true,
      key_ops: ["verify"],
    },
    privateKey: {
      kty: "EC",
      crv: "P-256",
      x,
      y,
      d: privateKeyB64,
      ext: true,
      key_ops: ["sign"],
    },
  };
}

Deno.serve(async (req) => {
  try {
    // Parse the incoming webhook payload
    const payload = await req.json();

    // The payload from pg_net / database webhook contains the row data
    const record = payload.record || payload;

    const { id, user_role, user_id, title, body, url, image_url } = record;

    if (!id || !user_role || !user_id || !title) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(
      `[send-push] Processing notification #${id} for ${user_role} (ID: ${user_id})`,
    );

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch push subscription for this user
    const { data: subData, error: subError } = await supabase
      .from("pwa_push_subscriptions")
      .select("subscription")
      .eq("user_role", user_role)
      .eq("user_id", user_id)
      .maybeSingle();

    if (subError) {
      console.error(`[send-push] DB error:`, subError);
      await supabase
        .from("pwa_notifications")
        .update({
          status: "failed",
          error_message: `Database error: ${subError.message}`,
        })
        .eq("id", id);
      return new Response(JSON.stringify({ error: subError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!subData || !subData.subscription) {
      console.warn(
        `[send-push] No subscription found for ${user_role} (ID: ${user_id})`,
      );
      await supabase
        .from("pwa_notifications")
        .update({
          status: "failed",
          error_message: "No active push subscription for this user.",
        })
        .eq("id", id);
      return new Response(
        JSON.stringify({ error: "No subscription found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Setup VAPID keys
    const publicVapidKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const privateVapidKey = Deno.env.get("VAPID_PRIVATE_KEY")!;

    const jwks = rawPrivateKeyToJwk(privateVapidKey, publicVapidKey);
    const vapidKeys = await importVapidKeys(jwks, {
      extractable: false,
    });

    // Create application server
    const appServer = await ApplicationServer.new({
      contactInformation: "mailto:kmart-notifications@example.com",
      vapidKeys,
    });

    // Build push payload
    const pushPayload: Record<string, string> = {
      title: title,
      body: body,
      url: url || "/",
    };
    if (image_url) {
      pushPayload.image = image_url;
    }

    // Get the subscription object from DB
    const subscription = subData.subscription;

    // Create a PushSubscriber using appServer.subscribe()
    const pushSubscriber = appServer.subscribe(subscription);

    // Build the push HTTP request
    const pushRequest = await pushSubscriber.pushTextMessage(
      JSON.stringify(pushPayload),
      {},
    );

    // Send to the push service
    const pushResponse = await fetch(pushRequest.endpoint, {
      method: "POST",
      headers: pushRequest.headers,
      body: pushRequest.body,
    });

    if (pushResponse.ok || pushResponse.status === 201) {
      console.log(
        `[send-push] ✅ Notification #${id} sent successfully (status: ${pushResponse.status})`,
      );
      await supabase
        .from("pwa_notifications")
        .update({ status: "sent" })
        .eq("id", id);

      return new Response(
        JSON.stringify({ success: true, status: pushResponse.status }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      const errorText = await pushResponse.text();
      console.error(
        `[send-push] ❌ Push service error for #${id}: ${pushResponse.status} ${errorText}`,
      );
      await supabase
        .from("pwa_notifications")
        .update({
          status: "failed",
          error_message: `Push service error: ${pushResponse.status} ${errorText}`,
        })
        .eq("id", id);

      return new Response(
        JSON.stringify({
          error: `Push service error: ${pushResponse.status}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("[send-push] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
