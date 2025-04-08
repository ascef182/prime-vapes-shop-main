
import { supabase } from "@/integrations/supabase/client";

export async function seedDatabase() {
  try {
    console.log("Checking if database needs to be seeded...");
    
    // First, check if we've already inserted data
    const { data: existingCategorias, error: checkError } = await supabase
      .from("categorias")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error checking for existing data:", checkError);
      return;
    }

    if (existingCategorias && existingCategorias.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Create categorias
    const categoriasData = [
      { 
        nome: "Ignite 8000 puffs", 
        descricao: "Vapes Prime Ignite com 8000 puffs de duração." 
      },
      { 
        nome: "Ignite 15000 puffs", 
        descricao: "Vapes Prime Ignite com 15000 puffs de duração." 
      },
      { 
        nome: "Coolplay 1500 puffs", 
        descricao: "Vapes Prime Coolplay com 1500 puffs de duração." 
      },
      { 
        nome: "Lost Mary 10000 puffs", 
        descricao: "Vapes Prime Lost Mary com 10000 puffs de duração." 
      },
      { 
        nome: "Oxbar 8000 puffs", 
        descricao: "Vapes Prime Oxbar com 8000 puffs de duração."
      }
    ];

    const { data: categorias, error: categoriasError } = await supabase
      .from("categorias")
      .insert(categoriasData)
      .select();

    if (categoriasError) {
      console.error("Error seeding categorias:", categoriasError);
      return;
    }

    console.log("Categories created successfully:", categorias);

    // Map to access categoria IDs by name
    const categoriaMap = new Map();
    categorias?.forEach(categoria => {
      categoriaMap.set(categoria.nome, categoria.id);
    });

    // Create produtos with updated descricao as JSONB
    const produtosData = [
      // Ignite 8000 puffs
      {
        nome: "Ignite 8000 - Passion Fruit Sour Kiwi",
        descricao: {
          texto: "Vape Prime Ignite 8000 puffs sabor Passion Fruit Sour Kiwi.",
          imagens: []
        },
        preco: 120.00,
        estoque: 3,
        categoria_id: categoriaMap.get("Ignite 8000 puffs")
      },
      {
        nome: "Ignite 8000 - Watermelon Ice",
        descricao: {
          texto: "Vape Prime Ignite 8000 puffs sabor Watermelon Ice.",
          imagens: []
        },
        preco: 120.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Ignite 8000 puffs")
      },
      {
        nome: "Ignite 8000 - Banana Ice",
        descricao: {
          texto: "Vape Prime Ignite 8000 puffs sabor Banana Ice.",
          imagens: []
        },
        preco: 120.00,
        estoque: 5,
        categoria_id: categoriaMap.get("Ignite 8000 puffs")
      },
      {
        nome: "Ignite 8000 - Grape Ice",
        descricao: {
          texto: "Vape Prime Ignite 8000 puffs sabor Grape Ice.",
          imagens: []
        },
        preco: 120.00,
        estoque: 3,
        categoria_id: categoriaMap.get("Ignite 8000 puffs")
      },
      {
        nome: "Ignite 8000 - Strawberry Kiwi",
        descricao: {
          texto: "Vape Prime Ignite 8000 puffs sabor Strawberry Kiwi.",
          imagens: []
        },
        preco: 120.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Ignite 8000 puffs")
      },
      
      // Ignite 15000 puffs
      {
        nome: "Ignite 15000 - Strawberry Kiwi",
        descricao: {
          texto: "Vape Prime Ignite 15000 puffs sabor Strawberry Kiwi.",
          imagens: []
        },
        preco: 180.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Ignite 15000 puffs")
      },
      {
        nome: "Ignite 15000 - Icy Mint",
        descricao: {
          texto: "Vape Prime Ignite 15000 puffs sabor Icy Mint.",
          imagens: []
        },
        preco: 180.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Ignite 15000 puffs")
      },
      
      // Coolplay 1500 puffs
      {
        nome: "Coolplay 1500 - Banana Ice",
        descricao: {
          texto: "Vape Prime Coolplay 1500 puffs sabor Banana Ice.",
          imagens: []
        },
        preco: 80.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Coolplay 1500 puffs")
      },
      {
        nome: "Coolplay 1500 - Candy",
        descricao: {
          texto: "Vape Prime Coolplay 1500 puffs sabor Candy.",
          imagens: []
        },
        preco: 80.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Coolplay 1500 puffs")
      },
      
      // Lost Mary 10000 puffs
      {
        nome: "Lost Mary 10000 - Matcha Mint Ice",
        descricao: {
          texto: "Vape Prime Lost Mary 10000 puffs sabor Matcha Mint Ice.",
          imagens: []
        },
        preco: 150.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Lost Mary 10000 puffs")
      },
      
      // Oxbar 8000 puffs
      {
        nome: "Oxbar 8000 - Cranberry Grape",
        descricao: {
          texto: "Vape Prime Oxbar 8000 puffs sabor Cranberry Grape.",
          imagens: []
        },
        preco: 130.00,
        estoque: 1,
        categoria_id: categoriaMap.get("Oxbar 8000 puffs")
      }
    ];

    const { error: produtosError } = await supabase
      .from("produtos")
      .insert(produtosData);

    if (produtosError) {
      console.error("Error seeding produtos:", produtosError);
      return;
    }

    console.log("Database seeded successfully with all products!");
  } catch (error) {
    console.error("Unexpected error during database seeding:", error);
  }
}

// Function to manually trigger seeding
export async function manualSeedDatabase() {
  try {
    // Force clear existing data first (optional - only use if requested by user)
    // await clearExistingData();
    
    return await seedDatabase();
  } catch (error) {
    console.error("Error in manual seeding:", error);
    throw error;
  }
}
