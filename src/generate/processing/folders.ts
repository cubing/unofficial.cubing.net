import { Path } from "../path";

export const COMPETITON_SOURCE_DATA_FOLDER =
  Path.fromProjectRootRelative("data/competitions");

export const DIST_SITE_FOLDER =
  Path.fromProjectRootRelative("dist/unofficial.cubing.net");
export const DIST_COMPETITIONS_FOLDER = DIST_SITE_FOLDER.getRelative("competitions");
