import { Bucket } from "encore.dev/storage/objects";

export const storage = new Bucket("clozet-storage", {
  public: false,
  versioned: false,
});
