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
                { name: 'USD', value: 'USD' },
                { name: 'BRL', value: 'BRL' },
            ],
            required: true,
        }
    ],
    async run(interaction) {
        const { options } = interaction;

        interaction.deferReply({ ephemeral: false })

        const skin: string = options.getString("skin")!;
        const currency: string = options.getString("currency")!;

        if (!skin || !currency) {
            await interaction.reply("Please provide both skin name and currency type.");
            return;
        }

        const itemData = await getItemData(skin, 7, currency);

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
                    ` **Gun Type:** ${item.gun_type}`,
                    ` **Exterior:** ${item.exterior}`,
                    ` **Rarity:** ${item.rarity}`,
                    ` **Average Price:** ${itemData.average_price} ${currency}`,
                ),
                thumbnail: `https://community.akamai.steamstatic.com/economy/image/${item.icon_url}`
            });

            await interaction.editReply({ embeds: [embed] });
        }
    }
});

async function getItemData(name: string, time: number, currency: string) {
    try {
        const response = await axios.get(
            `https://csgobackpack.net/api/GetItemPrice/?currency=${currency}&id=${name}&time=${time}`
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