import { settings } from "#settings";
import { formatEmoji } from "discord.js";

type EmojiList = typeof settings.emojis;
type EmojiKey = keyof EmojiList["icons"] | `:a:${keyof EmojiList["animated"]}`;

export function icon(name: EmojiKey){
    const animated = name.startsWith(":a:");
    const discordEmoji = name.startsWith(":s:");
    const pose = name.startsWith(":p:")
    let id: string = "";

    if (animated) {
        id = settings.emojis.animated[name.slice(3) as keyof EmojiList["animated"]];
    } 
    if (!animated && !discordEmoji && !pose) {
        id = settings.emojis.icons[name as keyof EmojiList["icons"]];
    }

    const toString = () => formatEmoji(id, animated);

    return { id, animated, toString };
}