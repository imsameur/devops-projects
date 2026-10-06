const http = require("node:http");

const port = Number(process.env.PORT || 3000);
const shopName = process.env.SHOP_NAME || "Mini Shop";

const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "ok", application: shopName }));
    return;
  }

  if (request.url === "/") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${shopName}</title>
        </head>
        <body>
          <h1>${shopName}</h1>
          <p>Deployed with Ansible on Amazon Linux 2023.</p>
          <p>Node.js application behind Nginx reverse proxy.</p>
        </body>
      </html>
    `);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`${shopName} listening on 127.0.0.1:${port}`);
});
