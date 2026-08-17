import fs from "node:fs/promises";
import path from "node:path";
import { AlbumManifestSchema, type AlbumManifest } from "../../domain/album-manifest.js";

const MANIFEST_FILE = "album-manifest.json";

export class JsonAlbumManifestStore {
  async write(albumDir: string, manifest: AlbumManifest): Promise<void> {
    const validated = AlbumManifestSchema.parse(manifest);
    const filePath = path.join(albumDir, MANIFEST_FILE);
    const tempPath = path.join(albumDir, ".album-manifest.tmp");
    await fs.writeFile(tempPath, `${JSON.stringify(validated, null, 2)}\n`, "utf-8");
    await fs.rename(tempPath, filePath);
  }
}
