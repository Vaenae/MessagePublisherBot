import { clearMessagesTable } from '../database/messages'
import { clearChatsTable } from '../database/chats'

async function clearDatabase() {
    try {
        await clearMessagesTable()
        await clearChatsTable()
    } catch (reason) {
        console.error(`Failed registering webhook, reason ${reason}`)
    }
}

clearDatabase()
