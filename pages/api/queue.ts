import type { NextApiRequest, NextApiResponse } from 'next';
import tracks from '../../mock/mockQueue';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(tracks)
}