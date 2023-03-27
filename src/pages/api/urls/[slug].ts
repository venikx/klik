import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (typeof slug != "string") {
    res.status(404).json({ message: "Slug me, daddy!" });
    return;
  }

  try {
    const data = await prisma.shortLink.findFirst({
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!data) {
      res.status(404).json({ message: "Slug left the building..." });
      return;
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=604800, stale-while-revalidate=86400"
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(e);
  }
}
