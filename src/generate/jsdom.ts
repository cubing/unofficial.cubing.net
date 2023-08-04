import { JSDOM } from "jsdom";
import { format } from "prettier";

const dom = new JSDOM("<!DOCTYPE html>");

export const { document: sharedDomDocument } = dom.window;
export const sharedXMLSerializer = new dom.window.XMLSerializer();
export const sharedDOMParser = new dom.window.DOMParser();

export async function serializeDOMNode(node: Node): Promise<string> {
  return await format(sharedXMLSerializer.serializeToString(node), {
    parser: "html",
  });
}
