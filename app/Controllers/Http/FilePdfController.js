"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const FilePdf = use("App/Models/FilePdf");
const Helpers = use("Helpers");
/**
 * Resourceful controller for interacting with filepdfs
 */
class FilePdfController {
  /**
   * Create/save a new filepdf.
   * POST filepdfs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      if (!request.file("file_pdfs_grade")) return;

      const upload = request.file("file_pdfs_grade", { size: "2mb" });

      const fileName = `${Date.now()}.${upload.subtype}`;

      await upload.move(Helpers.tmpPath("uploads/grade"), {
        name: fileName
      });

      if (!upload.moved()) {
        throw upload.error();
      }

      const file = await FilePdf.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      });

      return file;
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Erro durante o upload do arquivo" } });
    }
  }

  /**
   * Display a single filepdf.
   * GET filepdfs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}
}

module.exports = FilePdfController;
