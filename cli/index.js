#!/usr/bin/env node

import { addBlog } from './commands/add/blog.js'
import { addAuth } from './commands/add/auth.js'
import { addOrganizations } from './commands/add/organizations.js'
import { removeBlog } from './commands/remove/blog.js'
import { removeAuth } from './commands/remove/auth.js'
import { removeOrganizations } from './commands/remove/organizations.js'

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
      console.log("Módulos disponibles: blog, auth, organizations");
      process.exit(1);
    }

    switch (subcommand) {
      case "blog":
        await addBlog();
        break;
      case "auth":
        await addAuth();
        break;
      case "organizations":
        await addOrganizations();
        break;
      default:
        console.error(`❌ Error: Módulo "${subcommand}" no reconocido`);
        console.log("Módulos disponibles: blog, auth, organizations");
        process.exit(1);
    }
  } else if (command === "remove") {
    if (!subcommand) {
      console.error("❌ Error: Debes especificar qué módulo remover");
      console.log("Uso: npx nuxtfast remove <módulo>");
      console.log("Módulos disponibles: blog, auth, organizations");
      process.exit(1);
    }

    switch (subcommand) {
      case "blog":
        await removeBlog();
        break;
      case "auth":
        await removeAuth();
        break;
      case "organizations":
      await removeOrganizations();
      break;
      default:
        console.error(`❌ Error: Módulo "${subcommand}" no reconocido`);
        console.log("Módulos disponibles: blog, auth");
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
  add <módulo>       Añadir un módulo a tu proyecto NuxtFast
  remove <módulo>    Remover un módulo de tu proyecto NuxtFast

Módulos disponibles:
  blog              Sistema de blog con Nuxt Content
  auth              Sistema de autenticación con Better Auth
  organizations     Sistema de organizaciones con Better Auth
                    
Comandos de blog:
  add blog          - Si no está instalado: instala el módulo
                    - Si ya está instalado: crea un nuevo artículo
  remove blog       - Remueve la configuración del blog
                    - Mantiene el contenido en content/

Comandos de autenticación:
  add auth          - Si no está instalado: configura autenticación
                    - Si ya está instalado: añade métodos adicionales
  remove auth       - Remueve la configuración de autenticación
                    - Opción de mantener o eliminar archivos del módulo

Comandos de organizaciones:
  add organizations  - Si no está instalado: configura organizaciones
                    - Si ya está instalado: añade métodos adicionales
  remove organizations - Remueve la configuración de organizaciones
                    - Opción de mantener o eliminar archivos del módulo

Ejemplos:
  npx nuxtfast add blog       Instalar módulo de blog o crear nuevo artículo
  npx nuxtfast add auth       Configurar autenticación con Better Auth
  npx nuxtfast remove blog    Remover módulo de blog (mantiene contenido)
  npx nuxtfast remove auth    Remover módulo de autenticación

Para más información, visita: https://nuxtfast.com/docs
`);
}

main().catch((error) => {
  console.error("❌ Error inesperado:", error);
  process.exit(1);
});
