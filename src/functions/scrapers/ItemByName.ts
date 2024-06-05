import axios from "axios";

interface Item {
    id: string;
    skin_id: string;
    name: string;
    description: string;
    weapon: {
        id: string;
        name: string;
    };
    category: {
        id: string;
        name: string;
    };
    pattern: {
        id: string;
        name: string;
    };
    min_float: number;
    max_float: number;
    wear: {
        id: string;
        name: string;
    };
    stattrak: boolean;
    souvenir: boolean;
    paint_index: string;
    rarity: {
        id: string;
        name: string;
        color: string;
    };
    collections: [
        {
            id: string;
            name: string;
            image: string
      }
    ];
    market_hash_name: string;
    team: {
        id: string;
        name: string;
    };
    image: string;
}   

export async function getItemByName(name: string) {
    try {
        const response = await axios.get(
            `https://cs2-api.vercel.app/api/en/market-items.json`
        );
        const itemsList: Record<string, Item> = response.data;

        const matchingItems = Object.values(itemsList)
            .filter((item: Item) => item.name.toLowerCase().includes(name.toLowerCase()));

        if (matchingItems.length === 0) {
            console.log("Nenhum item encontrado com o nome fornecido.");
            return null;
        }

        return matchingItems;
    } catch (err) {
        console.error("Erro ao obter dados da API:", err);
        return null;
    }
}