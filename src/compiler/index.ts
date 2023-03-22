import { CompilerInput, CompilerOutput } from "hardhat/types";

export type { CompilerInput, CompilerOutput };

export interface SolidityCompilerModule {
  cwrap: Function;
}
export type WorkerCommand = {
  id: number;
  type: "compile";
  request: {
    input: CompilerInput;
  };
  response: {
    output: SolidityCompilerOutput;
  };
};
export interface SolidityCompiler {
  version: string;
  compile(input: CompilerInput): CompilerOutput;
}
export type WorkerRequest = Pick<WorkerCommand, "id" | "type" | "request">;
export type WorkerResponse = Pick<WorkerCommand, "id" | "type" | "response">;
export type SolidityCompilerOutput = { errors: any[] } | CompilerOutput;

import fetch from "cross-fetch";
import { useEffect, useRef } from "react";

type IWorker = {
  importScripts: (...urls: string[]) => void;
};

function isWebWorker(value: any): value is IWorker {
  return typeof value.importScripts === "function";
}

export function createCompilerInput(
  files: Record<string, string>
): CompilerInput {
  return {
    language: "Solidity",
    sources: Object.fromEntries(
      Object.entries(files).map(([name, content]) => [name, { content }])
    ),
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
}

export function wrapCompilerModule(
  solc: SolidityCompilerModule
): SolidityCompiler {
  const version = solc.cwrap("solidity_version", "string", [])();

  const solidityCompile = solc.cwrap("solidity_compile", "string", [
    "string",
    "number",
    "number",
  ]);

  return {
    version,
    compile(input: CompilerInput): CompilerOutput {
      return JSON.parse(solidityCompile(JSON.stringify(input)));
    },
  };
}

// const COMPILER_URL =
//   "https://binaries.soliditylang.org/bin/soljson-v0.8.9+commit.e5eed63a.js";
const COMPILER_URL =
  "https://binaries.soliditylang.org/bin/soljson-v0.8.18+commit.87f61d96.js";

export async function downloadCompiler(): Promise<SolidityCompilerModule> {
  const self = globalThis;

  if (isWebWorker(self)) {
    self.importScripts(COMPILER_URL);
    return (self as any).Module;
  } else {
    const result = await fetch(COMPILER_URL);
    const text = await result.text();
    // eslint-disable-next-line no-eval
    const solc = eval(text + "\n;Module;");
    return solc;
  }
}

export async function getCompiler(): Promise<SolidityCompiler> {
  const solc = await downloadCompiler();
  return wrapCompilerModule(solc);
}

export function useCompiler(): {
  compile: (files: Record<string, string>) => Promise<SolidityCompilerOutput>;
} {
  const requestId = useRef(0);
  const worker = useRef<Worker>();

  useEffect(() => {
    worker.current = new Worker(new URL("../worker", import.meta.url));
  }, [worker]);

  return {
    compile: (files: Record<string, string>) => {
      return new Promise<SolidityCompilerOutput>((resolve) => {
        const request: WorkerRequest = {
          id: requestId.current++,
          type: "compile",
          request: {
            input: createCompilerInput(files),
          },
        };

        function handler(e: MessageEvent) {
          const data = e.data as WorkerResponse;

          if (!(data.id === request.id && data.type === request.type)) return;

          worker.current?.removeEventListener("message", handler);

          resolve(data.response.output);
        }

        worker.current?.addEventListener("message", handler);
        worker.current?.postMessage(request);
      });
    },
  };
}
