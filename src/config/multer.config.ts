import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdirSync } from 'fs';

export const createMulterConfig = (folder: string) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `./uploads/${folder}`;
      mkdirSync(uploadPath, { recursive: true }); // auto-creates folder if missing
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
});
