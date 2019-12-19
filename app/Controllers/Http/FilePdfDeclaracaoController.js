"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const FilePdfDeclaracao = use("App/Models/FilePdfDeclaracao");
const Helpers = use("Helpers");
/**
 * Resourceful controller for interacting with filepdfdeclaracaos
 */
class FilePdfDeclaracaoController {
  /**
   * Create/save a new filepdfdeclaracao.
   * POST filepdfdeclaracaos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      if (!request.file("file_pdfs_dec")) return;

      const upload = request.file("file_pdfs_dec", { size: "2mb" });

      const fileName = `${Date.now()}.${upload.subtype}`;

      await upload.move(Helpers.tmpPath("uploads/declaracao"), {
        name: fileName
      });

      if (!upload.moved()) {
        throw upload.error();
      }

      const file = await FilePdfDeclaracao.create({
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
   * Display a single filepdfdeclaracao.
   * GET filepdfdeclaracaos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}
}

module.exports = FilePdfDeclaracaoController;
