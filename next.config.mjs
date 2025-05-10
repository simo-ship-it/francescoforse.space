/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. rende l’app completamente statica (cartella out/)
  output: 'export',

  // 2. evita 404 quando si fa refresh su una pagina nidificata
  trailingSlash: true,

  // 3. disattiva l’image optimizer (GitHub Pages non può eseguirlo)
  images: { unoptimized: true },

  // 4. lascialo vuoto: il sito vive alla root del dominio personalizzato
  basePath: '',
};

// sintassi ES modules
export default nextConfig;
