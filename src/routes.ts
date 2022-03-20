import express, { Request, Response } from 'express';
import { MahasiswaCreateReq } from './interface';
import { Mahasiswa } from './models/mahasiswa';

const MahasiswaRouter = express.Router();

MahasiswaRouter.get(
  '/mahasiswa/:npm',
  async (req: Request & { params: { npm: number } }, res: Response) => {
    const { npm } = req.params;
    const mahasiswa = await Mahasiswa.findOne({ npm });
    if (!mahasiswa) {
      return res.status(404).json({
        error: 'mahasiswa_not_found',
        error_description: 'Mahasiswa Tidak Ditemukan',
      });
    }
    return res.json(mahasiswa);
  }
);

MahasiswaRouter.post(
  '/mahasiswa',
  async (req: MahasiswaCreateReq, res: Response) => {
    try {
      const { npm, alamat, nama } = req.body;
      const mahasiswa = await Mahasiswa.create([{ npm, alamat, nama }], {
        validateBeforeSave: true,
      });
      return res.status(201).json(mahasiswa[0]);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'ada kesalahan',
      });
    }
  }
);

MahasiswaRouter.put(
  '/mahasiswa/:npm',
  async (
    req: MahasiswaCreateReq & { params: { npm: number } },
    res: Response
  ) => {
    try {
      const { npm } = req.params;
      const { alamat, nama } = req.body;
      const mahasiswa = await Mahasiswa.findOneAndUpdate(
        { npm },
        { nama, alamat },
        { runValidators: true, upsert: false, new: true }
      );

      if (!mahasiswa) {
        return res.status(404).json({
          error: 'mahasiswa_not_found',
          error_description: 'Mahasiswa Tidak Ditemukan',
        });
      }

      return res.status(200).json(mahasiswa);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'ada kesalahan',
      });
    }
  }
);

MahasiswaRouter.delete(
  '/mahasiswa/:npm',
  async (req: Request & { params: { npm: number } }, res: Response) => {
    const { npm } = req.params;
    const mahasiswa = await Mahasiswa.findOneAndDelete({ npm });
    if (!mahasiswa) {
      return res.status(404).json({
        error: 'mahasiswa_not_found',
        error_description: 'Mahasiswa Tidak Ditemukan',
      });
    }
    return res.status(200).json({
      message: 'Mahasiswa Deleted',
      item: mahasiswa.toJSON(),
    });
  }
);

export default MahasiswaRouter;
