import { defineCollection, z } from "astro:content";
import fs from "fs/promises";
import { parse as parseToml } from "smol-toml";

const categories = defineCollection({
  loader: async () => {
    const files = await fs.readdir("./feeds");
    return await Promise.all(
      files
        .filter((file) => file.endsWith(".toml"))
        .map(async (file) => {
          const content = await fs.readFile(`./feeds/${file}`, {
            encoding: "utf-8",
          });
          return {
            ...parseToml(content),
            id: file.replace(".toml", ""),
          };
        })
    );
  },
  schema: z
    .object({
      feed: z.array(
        z.object({
          title: z.string(),
          site: z.string().url(),
          url: z.string().url(),
        })
      ),
    })
    .transform((o) => o.feed),
});

export const collections = { categories };
