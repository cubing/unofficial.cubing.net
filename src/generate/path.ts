import { mkdir, open, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { parse as csvParse } from "csv-parse/browser/esm/sync";
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

  async touchFile(): Promise<void> {
    const fileHandle = await open(this.toString(), "a");
    fileHandle.close?.();
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
    const { DIST_SITE_FOLDER } = await import("./processing/folders"); // Avoid cyclic import
    console.log(
      "Writing:",
      relative(DIST_SITE_FOLDER.toString(), this.toString()),
    );
    await writeFile(this.toString(), await serializeDOMNode(node));
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async writeJSON(json: any): Promise<void> {
    await writeFile(this.toString(), JSON.stringify(json, null, "  "));
  }
}
