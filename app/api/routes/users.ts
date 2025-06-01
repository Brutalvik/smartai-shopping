// apps/api/routes/users.ts
import { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users/check", async (request, reply) => {
    const { email } = request.query as { email?: string };

    if (!email) {
      return reply.status(400).send({ error: "Email is required" });
    }

    // Placeholder for real DynamoDB logic
    const userExists = email.toLowerCase().endsWith("@xyvo.ai");

    return reply.send({ exists: userExists });
  });
}
