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
fastify.listen(3000, "0.0.0.0", (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});
