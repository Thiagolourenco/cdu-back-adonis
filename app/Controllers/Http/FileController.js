"use strict";

const File = use("App/Models/File");
const Helpers = use("Helpers");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  async store({ request, response }) {
    try {
      if (!request.file("file")) return;

      const uploads = request.file("file", { size: "2mb" });

      const fileName = `${Date.now()}.${uploads.subtype}`;

      await uploads.move(Helpers.tmpPath("uploads/imagens"), {
        name: fileName
      });

      if (!uploads.moved()) {
        throw uploads.error();
      }

      const file = await File.create({
        file: fileName,
        name: uploads.clientName,
        type: uploads.type,
        subtype: uploads.subtype
      });

      return file;
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Erro durante o upload do arquivo" } });
    }
  }
}

module.exports = FileController;
