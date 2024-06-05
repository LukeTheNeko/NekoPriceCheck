import axios from "axios";

export async function getSteamData(name: string, currency: string) {
    try {
        const response = await axios.get(
            `https://steamcommunity.com/market/priceoverview/?appid=730&currency=${currency}&market_hash_name=${name}`
        );
        return response.data;
    } catch (err) {
        return null;
    }
}