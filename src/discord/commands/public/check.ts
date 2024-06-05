import { Command } from "#base";
import { getItemByName, getSteamData, icon } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";
import axios from "axios";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "check",
    description: "🪙 Check a Skin Price.",
    dmPermission: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "skin",
            description: "skin name.",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required,
        },
        {
            name: "currency",
            description: "currency type.",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'USD', value: '1' },
                { name: 'BRL', value: '7' },
                { name: 'EUR', value: '3' },
                { name: 'RUB', value: '5' },
                { name: 'CAD', value: '20' },
                { name: 'AUD', value: '21' },
                { name: 'GBP', value: '2' },
                { name: 'CHF', value: '4' },
            ],
            required: true,
        }
    ],
    async autocomplete(interaction) {
        const focused = interaction.options.getFocused(true);

        if (focused.name === "skin") {
            try {
                const response = await axios.get(`https://cs2-api.vercel.app/api/en/market-items.json`);
                const itemsList: { [key: string]: { market_hash_name: string } } = response.data;

                const filteredSkins = Object.values(itemsList)
                    .filter((item: { market_hash_name: string }) => {
                        const { market_hash_name } = item;
                        return focused.value && market_hash_name && market_hash_name.toLowerCase().includes(focused.value.toLowerCase());
                    })
                    .slice(0, 25)
                    .map((item: { market_hash_name: string }) => ({ name: item.market_hash_name, value: item.market_hash_name }));

                await interaction.respond(filteredSkins);
            } catch (err) {
                console.log("Error fetching skin names for autocomplete:", err);
            }
        }
    },

    async run(interaction) {
        const { options } = interaction;

        await interaction.deferReply({})

        const skin = options.getString("skin")!;
        const currency = options.getString("currency")!;

        const encodedSkin = encodeURIComponent(skin);
        const itemData = await getSteamData(encodedSkin, currency);

        const itemStatus = await getItemByName(skin);
        
        if (itemStatus) {
            const firstItem = itemStatus[0];
        
            const embed = createEmbed({
                color: firstItem.rarity?.color ? parseInt(firstItem.rarity.color.replace('#', ''), 16) : 0x999999,
                title: `${icon("view")} CS2 Price Checker`,
                url: `https://steamcommunity.com/market/listings/730/${encodedSkin}`,
                description: brBuilder(
                    `🔫 **Skin:** ${skin}`,
                    `📦 **Type:** ${firstItem.category?.name || 'undefined'}`,
                    `💎 **Rarity:** ${firstItem.rarity?.name }`,
                    `🧊 **Collection:** ${firstItem.collections?.[0].name || 'undefined'}`,
                ),
                fields: [
                    { name: `${icon("steam")}  Steam`, value: `[${itemData?.lowest_price || 'undefined'}](https://steamcommunity.com/market/listings/730/${encodedSkin})`, inline: true },
                ],
                timestamp: new Date(),
                thumbnail: `${firstItem.image}`,
            });
            
        await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({ content: "error" });
        }
    }
});