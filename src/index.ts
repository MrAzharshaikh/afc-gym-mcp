
import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "AFC Gym Assistant",
    version: "1.0.0",
  });

  server.registerTool(
    "get_gym_info",
    {
      description:
        "Get general information about Azhar Fitness Center and its services.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            business: "Azhar Fitness Center (AFC Gym)",
            website: "https://azhartrainer.com",
            services: [
              "Personal Training",
              "Fat Loss",
              "Muscle Building",
              "Body Transformation",
              "Online Coaching",
              "Group Training",
            ],
            note:
              "Confirm current address, timings, and contact number before sharing them with customers.",
          }),
        },
      ],
    }),
  );

  server.registerTool(
    "get_membership_plans",
    {
      description:
        "Return recorded AFC Gym membership rates. Warn users that prices must be confirmed before quoting.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: "Historical rates — not yet confirmed as current",
            registrationFeeINR: 500,
            strengthAndCardio: [
              { duration: "1 month", priceINR: 1200 },
              { duration: "3 months", priceINR: 2800 },
              { duration: "6 months", priceINR: 5000 },
              { duration: "12 months", priceINR: 9000 },
            ],
            cardioOnly: [
              { duration: "1 month", priceINR: 1800 },
              { duration: "3 months", priceINR: 4000 },
              { duration: "12 months", priceINR: 12000 },
            ],
            instruction:
              "These are previously recorded prices. Confirm the latest rates with AFC Gym before giving a customer a final quote.",
          }),
        },
      ],
    }),
  );

  server.registerTool(
    "draft_whatsapp_reply",
    {
      description:
        "Draft a WhatsApp response to an AFC Gym enquiry. Draft only; does not send messages.",
      inputSchema: {
        enquiry: z.string().min(1).max(1500).describe("Customer's enquiry"),
        language: z
          .enum(["English", "Hinglish"])
          .describe("Language of the reply"),
        customerName: z
          .string()
          .max(100)
          .optional()
          .describe("Customer's first name, if provided"),
      },
    },
    async ({ enquiry, language, customerName }) => {
      const greeting = customerName
        ? `Hi ${customerName}!`
        : "Hi!";

      const reply =
        language === "Hinglish"
          ? `${greeting} Azhar Fitness Center mein enquiry karne ke liye thank you! Aapki enquiry: "${enquiry}". Aapko Personal Training, Fat Loss, Muscle Building ya Membership Plans mein se kiski details chahiye? Current prices aur availability team se confirm karwa lein.`
          : `${greeting} Thank you for contacting Azhar Fitness Center! Regarding your enquiry: "${enquiry}". Would you like details about Personal Training, Fat Loss, Muscle Building, or Membership Plans? Our team can confirm the latest prices and availability.`;

      return {
        content: [{ type: "text", text: reply }],
      };
    },
  );

  return server;
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return createMcpHandler(createServer)(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
