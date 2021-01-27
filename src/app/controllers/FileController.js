import File from '../models/File';

class FileController {
  async store(req) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({
      name,
      path,
    });
    return file;
  }
}
export default new FileController();
