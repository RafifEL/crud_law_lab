import { Request } from 'express';
import { IMahasiswa } from './models/mahasiswa';

export interface MahasiswaCreateReq extends Request {
  body: IMahasiswa;
}
