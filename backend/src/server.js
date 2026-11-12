 import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { ZodError } from 'zod';
import { config } from './config.js';

import accountRouter from './routes/account.js';

const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', accountRouter);

app.use('/api', (_req, res) =>
  res.status(404).json({ error: 'Not found.' })
);

app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const issue = err.issues[0];
    return res.status(400).json({
      error: `${issue.path.join('.') || 'Input'}: ${issue.message}`,
      issues: err.issues
    });
  }

  if (err instanceof multer.MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;

    return res.status(status).json({
      error: err.code === 'LIMIT_FILE_SIZE'
        ? 'Files must be 150 MB or smaller.'
        : err.message
    });
  }

  if (err?.code === '22P02')
    return res.status(404).json({ error: 'Not found.' });

  if (err?.type?.startsWith?.('Stripe')) {
    console.error('Stripe error:', err.message);
    return res.status(502).json({ error: `Stripe: ${err.message}` });
  }

  if (err?.status && err.status < 500)
    return res.status(err.status).json({ error: err.message });

  console.error(err);

  return res.status(500).json({
    error: 'Something went wrong on our side. Try again in a moment.'
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Facet API -> http://localhost:${config.port}`);
});