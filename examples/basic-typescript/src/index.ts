import Fastify from "fastify";

const fastify = Fastify({
  logger: false,
});

fastify.get("/", (_, reply) => {
  reply.send({
    message: "hello world",
  });
});

// Run the server!
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
