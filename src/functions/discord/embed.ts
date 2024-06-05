import { settings } from "#settings";
import { createEmbed } from "@magicyan/discord";

type SettingsColors = typeof settings.color.theme;
type InteractionRes = Record<keyof SettingsColors, <O>(text: string, options?: O) => O>;

export const res: InteractionRes = Object.create({}, Object.entries(settings.color.theme)
    .reduce((obj, [name, color]) => ({ ...obj,
        [name]: {
            enumerable: true, writable: false,
            value(description: string, options?: object){
                const embed = createEmbed({ color , description });

                if (options && "embeds" in options && Array.isArray(options.embeds)){
                    options.embeds.unshift(embed);
                }
                const defaults = { fetchReply: true, ephemeral: true, embeds: [embed] };
                return Object.assign(defaults, options);
            }
        }
    }), {} as PropertyDescriptorMap)
);