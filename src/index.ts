
import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "AFC Gym AI Assistant",
    version: "1.0.0",
  });

  // Tool 1: Gym Information
  server.registerTool(
    "get_gym_info",
    {
      description:
        "Get AFC Gym services and official website information.",
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
              "Confirm current address, phone number and opening hours with the gym before sharing them.",
          }),
        },
      ],
    })
  );

  // Tool 2: Membership Plans
  server.registerTool(
    "get_membership_plans",
    {
      description:
        "Get recorded AFC Gym membership prices. Confirm current prices before quoting customers.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            registrationFee: "₹500 (historical; confirm current fee)",
            strengthAndCardio: [
              { duration: "1 month", price: "₹1,200" },
              { duration: "3 months", price: "₹2,800" },
              { duration: "6 months", price: "₹5,000" },
              { duration: "12 months", price: "₹9,000" },
            ],
            cardioOnly: [
              { duration: "1 month", price: "₹1,800" },
              { duration: "3 months", price: "₹4,000" },
              { duration: "12 months", price: "₹12,000" },
            ],
            note:
              "These are previously recorded rates, not verified current prices. Confirm with AFC Gym before offering a package.",
          }),
        },
      ],
    })
  );

  // Tool 3: Draft WhatsApp Replies
  server.registerTool(
    "draft_whatsapp_reply",
    {
      description:
        "Draft a WhatsApp response to a gym enquiry in English or Hinglish. Does not send messages.",
      inputSchema: {
        enquiry: z.string().min(1).max(1500),
        language: z.enum(["English", "Hinglish"]),
        customerName: z.string().max(100).optional(),
      },
    },
    async ({ enquiry, language, customerName }) => {
      const greeting = customerName
        ? `Hi ${customerName}!`
        : "Hi!";

      const reply =
        language === "Hinglish"
          ? `${greeting} 👋 Azhar Fitness Center mein welcome! Aapki enquiry: "${enquiry}". Hum Personal Training, Fat Loss, Muscle Building aur Body Transformation mein help karte hain. Current fees aur available timings confirm karne ke liye hamari team se contact karein. 💪`
          : `${greeting} Welcome to Azhar Fitness Center! 👋 Regarding your enquiry: "${enquiry}". We offer Personal Training, Fat Loss, Muscle Building and Body Transformation. Please contact our team to confirm current fees and available timings. 💪`;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              reply,
              sent: false,
              note: "Draft only. Review before sending.",
            }),
          },
        ],
      };
    }
  );

  return server;
}

const handler = createMcpHandler(createServer);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
