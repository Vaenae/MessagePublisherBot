import Telegraf, { ContextMessageUpdate } from 'telegraf'
import { getServerConfig } from '../config/config'
import { saveMessage } from '../database/messages'
import { queryChatsByChatId, saveChat, deleteChats } from '../database/chats'
import * as crypto from 'crypto'

const publishUrl = (publishId: string): string =>
    `${getServerConfig().urlProd}/${publishId}`

function createRandomId(): string {
    const arr = crypto.randomBytes(20)
    return arr.toString('hex')
}

export const bot = new Telegraf(getServerConfig().botToken)
bot.command('hello', async ctx => await ctx.reply('Hello'))
bot.help(async ctx => await ctx.reply('Help: needed'))

const publish = async (ctx: ContextMessageUpdate) => {
    const chat = ctx.message?.chat || ctx.chat
    if (chat == null) {
        await ctx.reply('Error: Chat not found!')
        return
    }
    if (chat.type === 'private') {
        await ctx.reply("Can't publish private chats!")
        return
    }
    const queryResults = await queryChatsByChatId(chat.id)
    if (queryResults.length > 0) {
        await ctx.reply(
            `Chat already published with url ${publishUrl(
                queryResults[0].chatPublishId
            )}`
        )
        return
    }
    const publishId = createRandomId()
    const firstMessageId = ctx.message?.message_id || 0
    await saveChat(publishId, firstMessageId, chat)
    await ctx.reply(`Chat published in url ${publishUrl(publishId)}`)
}

const unpublish = async (ctx: ContextMessageUpdate) => {
    const chat = ctx.message?.chat || ctx.chat
    if (chat == null) {
        await ctx.reply('Error: Chat not found!')
        return
    }
    if (chat.type === 'private') {
        await ctx.reply("Can't publish private chats!")
        return
    }
    const queryResults = await queryChatsByChatId(chat.id)
    if (queryResults.length === 0) {
        await ctx.reply('Chat already unpublished')
        return
    }
    await deleteChats(queryResults.map(result => result.chatPublishId))
    await ctx.reply('Chat unpublished')
}

bot.on('text', async update => {
    if (update.message) {
        switch (update.message.text) {
            case '/publish': {
                await publish(update)
                return
            }
            case '/unpublish': {
                await unpublish(update)
                return
            }
            default: {
                console.log(update.message)
                if (update.message.chat.type !== 'private') {
                    await saveMessage(update.message)
                }
                return
            }
        }
    }
})
