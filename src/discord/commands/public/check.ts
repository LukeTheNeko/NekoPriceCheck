import axios from "axios";
import { Command } from "#base";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "check",
    description: "Check a item Price.",
    dmPermission: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "skin",
            description: "skin name.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "currency",
            description: "currency type.",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'USD', value: '1' },
                { name: 'BRL', value: '7' },
            ],
            required: true,
        }
    ],
    async run(interaction) {
        const { options } = interaction;

        await interaction.deferReply({ ephemeral: false })

        const skin: string = options.getString("skin")!;
        const currency: string = options.getString("currency")!;

        if (!skin || !currency) {
            await interaction.reply("Please provide both skin name and currency type.");
            return;
        }

        const itemData = await getSteamData(skin, currency);

        if (!itemData) {
            await interaction.reply("Erro ao obter os dados da pele.");
            return;
        }

        const item = await getItemColor(skin);
        if (item) {
            const embed = createEmbed({
                color: `#${item.rarity_color}`,
                title: "Skin Prices",
                description: brBuilder(
                    ` **Skin:** ${skin}`,
                    ` **Type:** ${item.type}`,
                    ` **Rarity:** ${item.rarity}`,
                    ` **Price:** ${itemData.lowest_price}`,
                ),
                thumbnail: `https://community.akamai.steamstatic.com/economy/image/${item.icon_url}`
            });

            await interaction.editReply({ embeds: [embed] });
        }
    }
});

async function getSteamData(name: string, currency: string) {
    try {
        const response = await axios.get(
            `https://steamcommunity.com/market/priceoverview/?appid=730&currency=${currency}&market_hash_name=${name}`
        );
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getItemColor(name: string) {
    try {
        const response = await axios.get(
            `https://csgobackpack.net/api/GetItemsList/v2/`
        );
        const itemsList = response.data.items_list;
        const item = itemsList[name];
        if (item) {
            return item;
        } else {
            console.log("Item not found.");
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}