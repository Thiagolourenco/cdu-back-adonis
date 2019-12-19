"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FilePdfDeclaracaoSchema extends Schema {
  up() {
    this.create("file_pdf_declaracaos", table => {
      table.increments();
      table.string("file").notNullable();
      table.string("name").notNullable();
      table.string("type", 20);
      table.string("subtype", 20);
      table.timestamps();
    });
  }

  down() {
    this.drop("file_pdf_declaracaos");
  }
}

module.exports = FilePdfDeclaracaoSchema;
