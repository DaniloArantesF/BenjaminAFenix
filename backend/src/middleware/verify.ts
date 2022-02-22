import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const secret = process.env.JWT_SECRET_KEY;
      const payload = jwt.verify(token, secret);
      console.log(payload);
    } catch (error) {
      console.log(error);
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(401);
  }
};

export default authenticateToken;