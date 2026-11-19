import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';

const acceptedImageTypes = new Map<string, string[]>([
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/webp', ['.webp']],
  ['image/gif', ['.gif']],
]);

export const escudoUploadOptions = {
  storage: diskStorage({
    destination: (_request, _file, callback) => {
      const directory = join(process.cwd(), 'uploads', 'escudos');
      try {
        mkdirSync(directory, { recursive: true });
        callback(null, directory);
      } catch (error) {
        callback(
          error instanceof Error ? error : new Error(String(error)),
          directory,
        );
      }
    },
    filename: (_request, file, callback) => {
      const extension = extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _request: unknown,
    file: { mimetype: string; originalname: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const expectedExtensions = acceptedImageTypes.get(file.mimetype);
    const extension = extname(file.originalname).toLowerCase();
    if (!expectedExtensions?.includes(extension)) {
      callback(
        new BadRequestException(
          'El escudo debe ser una imagen JPG, PNG, WEBP o GIF valida',
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};

export const escudoPath = (filename: string): string =>
  `uploads/escudos/${filename}`;
