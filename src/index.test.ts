import path from "path";
import { exampleProjectFileList, exampleProjectSemanticErrors, exampleProjectCodeFixes } from "./index";

function relative(fileName: string) {
  return path.relative(__dirname, path.normalize(fileName));
}

test("exampleProjectFileList", async () => {
  const files = await exampleProjectFileList();
  expect(files).toHaveLength(1);
  expect(relative(files[0])).toEqual(path.normalize("../test-project/index.ts"));
});

test("exampleProjectErrors", async () => {
  const errors = await exampleProjectSemanticErrors();
  expect(errors).toHaveLength(2);
  for (const error of errors) {
    expect(error.code).toBe(4114);
  }
});

test("exampleProjectCodeFixes", async () => {
  const fixes = await exampleProjectCodeFixes();
  expect(fixes.map((f) => ({ ...f, changes: f.changes.map((c) => ({ ...c, fileName: relative(c.fileName) })) }))).toMatchInlineSnapshot(`
Array [
  Object {
    "changes": Array [
      Object {
        "fileName": "../test-project/index.ts",
        "textChanges": Array [
          Object {
            "newText": "override ",
            "span": Object {
              "length": 0,
              "start": 154,
            },
          },
        ],
      },
    ],
    "commands": undefined,
    "description": "Add 'override' modifier",
    "fixAllDescription": "Add all missing 'override' modifiers",
    "fixId": "fixAddOverrideModifier",
    "fixName": "fixOverrideModifier",
  },
  Object {
    "changes": Array [
      Object {
        "fileName": "../test-project/index.ts",
        "textChanges": Array [
          Object {
            "newText": "override ",
            "span": Object {
              "length": 0,
              "start": 228,
            },
          },
        ],
      },
    ],
    "commands": undefined,
    "description": "Add 'override' modifier",
    "fixAllDescription": "Add all missing 'override' modifiers",
    "fixId": "fixAddOverrideModifier",
    "fixName": "fixOverrideModifier",
  },
]
`);
});
