import { serve } from "https://deno.land/std@0.106.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as messageService from "./services/messageService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}
const server = serve({ port: port });

const viewMessages = async (request) => {
  const data = {
    messages: await messageService.findAll(),
  };

  request.respond({ body: await renderFile("index.eta", data) });
};

const sendMessage = async (request) => {
  const body = new TextDecoder().decode(await Deno.readAll(request.body));
  const params = new URLSearchParams(body);

  const sender = params.get("sender");
  const message = params.get("message");

  await messageService.send(sender, message);

  request.respond({
    status: 303,
    headers: new Headers({
      "Location": "/",
    }),
  });
};

for await (const request of server) {
  if (request.method === "POST") {
    await sendMessage(request);
  } else {
    await viewMessages(request);
  }
}