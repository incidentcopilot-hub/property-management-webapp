import { NextFunction, Request, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  const status = typeof (err as { status?: number })?.status === 'number' ? (err as { status: number }).status : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  // Log the full error for server visibility.
  // eslint-disable-next-line no-console
  console.error(err);

  res.status(status).json({
    message,
    ...(isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
