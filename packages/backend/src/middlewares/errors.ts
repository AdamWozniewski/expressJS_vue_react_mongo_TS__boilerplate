import { Response, Request } from 'express';
import { NOT_FOUND } from '../static/values';

export const notFound = (req: Request, res: Response, next): void => {
  const err: any = new Error('404 page not found');
  err.status = NOT_FOUND;
  next(err);
};

export const catchAsync = (fn) => {
  return (req: Request, res: Response, next): void =>
    fn(req, res, next).catch((err: Error) => next(err));
};

export const catchErrors = (err, req: Request, res: Response): void => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
  });
};
