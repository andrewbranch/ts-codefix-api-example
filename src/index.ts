import os from "os";
import path from "path";
import { CodeFixAction, Diagnostic, getDefaultFormatCodeSettings } from "typescript";
import { createProject } from "@ts-morph/bootstrap";

const tsConfigFilePath = path.resolve(__dirname, "../test-project/tsconfig.json");

export async function exampleProjectFileList(): Promise<string[]> {
  const project = await createProject({ tsConfigFilePath });
  return project.getSourceFiles().map(f => f.fileName);
}

export async function exampleProjectSemanticErrors(): Promise<readonly Diagnostic[]> {
  const project = await createProject({ tsConfigFilePath });
  return project.createProgram().getSemanticDiagnostics();
}

export async function exampleProjectCodeFixes(): Promise<readonly CodeFixAction[]> {
  const project = await createProject({ tsConfigFilePath });
  const errors = project.createProgram().getSemanticDiagnostics();
  const ls = project.getLanguageService();
  const fixes = [];
  for (const error of errors) {
    if (error.file && error.start !== undefined && error.length !== undefined) {
      fixes.push(...ls.getCodeFixesAtPosition(
        error.file.fileName,
        error.start,
        error.start + error.length,
        [error.code],
        getDefaultFormatCodeSettings(os.EOL),
        {}));
    }
  }
  return fixes;
}
