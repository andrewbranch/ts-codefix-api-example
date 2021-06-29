import os from "os";
import path from "path";
import { CodeFixAction, Diagnostic, getDefaultFormatCodeSettings, TextChange } from "typescript";
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

export function applyChanges(fileContent: string, changes: readonly TextChange[]): string {
  for (const change of changes) {
    const prefix = fileContent.substring(0, change.span.start);
    const middle = change.newText;
    const suffix = fileContent.substring(change.span.start + change.span.length);
    fileContent = prefix + middle + suffix;
  }
  return fileContent;
}

// What fixes do you want to apply?
// > fix all the override stuff -> "fixOverrides"
//
/* "fixOverrides" > [{
  errorCode: [4114, 4116],
  fixId: "fixAddOverrideModifier"
}, {
  errorCode: [4115, 4117],
  fixId: "fixRemoveOverrideModifier"
}]

// code fixes for ...
//
// results.filter(fix => fix.fixId === "fixAddOverrideModifier")

// What fix ids to you want to apply?
// > fixAddOverrideModifier
// ... the error code(s) for that are ... 4114, 4116

// getCodeFixes(errorCode) // fixAddOverrideModifier
