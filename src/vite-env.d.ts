
/// <reference types="vite/client" />

// Product description type to match the new JSONB structure
interface ProductDescription {
  texto: string | null;
  imagens: string[];
}

