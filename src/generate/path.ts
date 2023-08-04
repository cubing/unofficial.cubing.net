import { parse as csvParse } from "csv-parse/browser/esm/sync";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { serializeDOMNode } from "./jsdom";

const PROJECT_ROOT_FOLDER = resolve(
  join(dirname(new URL(import.meta.url).pathname), "../../"),
);

export class Path {
  constructor(private path: string) {}

  static fromProjectRootRelative(relativePath: string): Path {
    return new Path(join(PROJECT_ROOT_FOLDER, relativePath));
  }

  // Returns the original call object, for chaining.
  async ensureFolderExists(): Promise<Path> {
    mkdir(this.toString(), { recursive: true });
    return this;
  }

  toString(): string {
    return this.path;
  }

  getRelative(relativePath: string) {
    return new Path(join(this.path, relativePath));
  }

  get index(): Path {
    return this.getRelative("index.html");
  }

  async readText(): Promise<string> {
    return await readFile(this.toString(), "utf-8");
  }

  async readJSON<T>(): Promise<T> {
    return JSON.parse(await readFile(this.toString(), "utf-8"));
  }

  async readCSV<T>(): Promise<T[]> {
    const data = await readFile(this.toString(), "utf-8");
    return csvParse(data, {
      columns: true,
    });
  }

  async writeDOM(node: Node): Promise<void> {
    console.log("Writing:", this.toString());
    await writeFile(this.toString(), await serializeDOMNode(node));
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  async writeJSON(json: any): Promise<void> {
    await writeFile(this.toString(), JSON.stringify(json, null, "  "));
  }
}
