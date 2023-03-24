import { getCompiler } from "@/compiler";

const compilerPromise = getCompiler();

// eslint-disable-next-line no-restricted-globals
addEventListener("message", async (event) => {
  const request = event.data;

  switch (request.type) {
    case "compile": {
      const compiler = await compilerPromise;

      const output = compiler.compile(request.request.input);

      const response = {
        id: request.id,
        type: request.type,
        response: { output },
      };

      postMessage(response);
    }
  }
});
