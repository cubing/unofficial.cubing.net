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

  async apply(fields: Record<string, string>): Promise<Document> {
    const document = (await this.templateDocument).cloneNode(true) as Document;
    for (const [key, value] of Object.entries(fields)) {
      {
        const className = `template-class-${key}`;
        for (const elem of document.getElementsByClassName(className)) {
          elem.classList.add(`${key}-${value}`);
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
    }
    return document;
  }
}

export const eventPageTemplate = new PageTemplate("./event-template.html");
