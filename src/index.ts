import path from "path";
import { CodeFixAction, Diagnostic } from "typescript";
import { createProject } from "@ts-morph/bootstrap";

const tsConfigFilePath = path.resolve(__dirname, "../test-project/tsconfig.json");

export async function exampleProjectFileList(): Promise<string[]> {
  const project = await createProject({ tsConfigFilePath });
  throw new Error("Not implemented yet");
}

export async function exampleProjectSemanticErrors(): Promise<readonly Diagnostic[]> {
  throw new Error("Not implemented yet");
}

export async function exampleProjectCodeFixes(): Promise<readonly CodeFixAction[]> {
  throw new Error("Not implemented yet");
}
