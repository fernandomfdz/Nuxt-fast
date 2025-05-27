#!/usr/bin/env node

import { addBlog } from './commands/add/blog.js'

const args = process.argv.slice(2);

async function main() {
  if (args.length === 0) {
    showHelp();
    return;
  }

  const command = args[0];
  const subcommand = args[1];

  if (command === "add") {
    if (!subcommand) {
      console.error("❌ Error: Debes especificar qué módulo añadir");
      console.log("Uso: npx nuxtfast add <módulo>");
      console.log("Módulos disponibles: blog");
      process.exit(1);
    }

    switch (subcommand) {
      case "blog":
        await addBlog();
        break;
      default:
        console.error(`❌ Error: Módulo "${subcommand}" no reconocido`);
        console.log("Módulos disponibles: blog");
        process.exit(1);
    }
  } else {
    console.error(`❌ Error: Comando "${command}" no reconocido`);
    showHelp();
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🚀 NuxtFast CLI

Uso: npx nuxtfast <comando> [opciones]

Comandos disponibles:
  add <módulo>    Añadir un módulo a tu proyecto NuxtFast

Módulos disponibles:
  blog           Sistema de blog con Nuxt Content
                 - Si no está instalado: instala el módulo
                 - Si ya está instalado: crea un nuevo artículo

Ejemplos:
  npx nuxtfast add blog    Instalar módulo de blog o crear nuevo artículo

Para más información, visita: https://nuxtfast.com/docs
`);
}

main().catch((error) => {
  console.error("❌ Error inesperado:", error);
  process.exit(1);
});
