import { readFile } from "node:fs/promises";
import { sharedDOMParser } from "./jsdom";
import { dirname, join } from "node:path";
import { Path } from "./path";

const TEMPLATES_FOLDER = Path.fromProjectRootRelative("./src/templates");

class PageTemplate {
  templateDocument: Promise<Document>;
  constructor(templateRelativePath: string) {
    const templateFilePath =
      TEMPLATES_FOLDER.getRelative(templateRelativePath).toString();
    this.templateDocument = (async () => {
      const file = await readFile(templateFilePath, "utf-8");
      return sharedDOMParser.parseFromString(file, "text/html");
    })();
  }

  async apply<T extends Node>(
    fields: Record<string, string>,
  ): Promise<Document> {
    const document = (await this.templateDocument).cloneNode(true) as Document;
    for (const [key, value] of Object.entries(fields)) {
      {
        const className = `template-class-${key}`;
        for (const elem of document.getElementsByClassName(className)) {
          elem.classList.add(`${value}`);
          elem.classList.remove(className);
        }
      }
      {
        const className = `template-textContent-${key}`;
        for (const elem of document.getElementsByClassName(className)) {
          elem.textContent = value;
          elem.classList.remove(className);
        }
      }
      {
        const className = `template-href-${key}`;
        for (const elem of document.getElementsByClassName(className)) {
          (elem as HTMLAnchorElement).href = value;
          elem.classList.remove(className);
        }
      }
    }
    return document;
  }
}

export const rootPageTemplate = new PageTemplate("./index.html");
export const competitionPageTemplate = new PageTemplate(
  "./competitions/each-competition/index.html",
);
export const eventPageTemplate = new PageTemplate(
  "./competitions/each-competition/each-event/index.html",
);
