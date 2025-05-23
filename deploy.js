#!/usr/bin/env node

/**
 * Script de despliegue automatizado para VueDex
 * 
 * Este script:
 * 1. Construye la aplicación con 'npm run build'
 * 2. Despliega el contenido de la carpeta 'dist' en la rama gh-pages
 * 
 * Uso: npm run deploy
 */

import { execSync } from 'child_process';
import ghpages from 'gh-pages';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Obtiene el directorio actual del script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para ejecutar comandos de terminal
function runCommand(command) {
  try {
    console.log(`Ejecutando: ${command}`);
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    return true;
  } catch (error) {
    console.error(`Error al ejecutar: ${command}`);
    console.error(error);
    return false;
  }
}

// Función principal de despliegue
async function deploy() {
  console.log('🚀 Iniciando proceso de despliegue...');
  
  // Verificar que estamos en un repositorio Git
  if (!fs.existsSync(resolve(__dirname, '.git'))) {
    console.error('❌ Error: No se encontró un repositorio Git en este directorio');
    process.exit(1);
  }

  // Construir la aplicación
  console.log('📦 Generando build de producción...');
  if (!runCommand('npm run build')) {
    console.error('❌ Error al generar el build');
    process.exit(1);
  }

  // Verificar que la carpeta dist existe
  const distPath = resolve(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: No se encontró la carpeta dist después del build');
    process.exit(1);
  }

  // Desplegar a GitHub Pages
  console.log('🚀 Desplegando a GitHub Pages...');
  
  const options = {
    branch: 'gh-pages',         // Rama de despliegue
    repo: undefined,           // Usa el repositorio actual
    message: 'Deploy: [ci skip] VueDex actualizado el %a, %d %b %Y, %H:%M:%S %Z',
    user: {
      name: 'Despliegue automatizado',
      email: 'deploy@vuedex.app'
    }
  };

  try {
    await new Promise((resolve, reject) => {
      ghpages.publish(distPath, options, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    
    console.log('✅ Despliegue completado con éxito!');
    console.log('🌐 Tu aplicación está siendo publicada en GitHub Pages');
    console.log('   Puede tomar unos minutos en estar disponible.');
    
    // Tratar de determinar la URL de GitHub Pages
    try {
      const remoteUrl = execSync('git config --get remote.origin.url', { cwd: __dirname }).toString().trim();
      if (remoteUrl) {
        let ghPagesUrl;
        if (remoteUrl.includes('github.com')) {
          // Extraer usuario/repo de la URL de git
          const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
          if (match) {
            const [, user, repo] = match;
            ghPagesUrl = `https://${user}.github.io/${repo}/`;
            console.log(`   Tu aplicación estará disponible en: ${ghPagesUrl}`);
          }
        }
      }
    } catch (error) {
      // Ignorar errores al intentar determinar la URL
    }
    
  } catch (error) {
    console.error('❌ Error durante el despliegue:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
deploy().catch(err => {
  console.error('❌ Error inesperado durante el despliegue:', err);
  process.exit(1);
});
