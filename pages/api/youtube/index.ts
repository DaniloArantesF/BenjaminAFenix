// Declaration of Youtube API and export youtube types
import type { YoutubeItem } from '../../../types/youtube';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseYoutubeItems } from '../../../components/YoutubeEmbed/Youtube';

type SearchResponse = {
  items: Array<YoutubeItem>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  switch (req.method) {
    case 'GET':
      const { value } = req.query;
      if (!value) {
        res.status(200).send({ items: [] });
        break;
      }
      const { data } = { data: { items: [] }};
      const items = parseYoutubeItems(data.items);
      res.status(200).send({ items });
      break;
    case 'POST':
      console.log("TODO");
      res.status(405);
      break;
    default:
      res.status(405);
  }
}