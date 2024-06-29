import { world, system } from "@minecraft/server"

world.sendMessage(`§aアイテムIDアドオンが導入されています`)

system.runInterval(() => {
    world.getPlayers().forEach(player => {
        for (let slot = 0; slot < 35; slot++) {
            let item = player.getComponent("inventory").container.getItem(slot);

            if(!(item === undefined)) {

                if(player.getDynamicProperty("item_id")) {
                    item = item.clone()
                    const lore = item.getLore()

                    let hasid = false

                    lore.forEach(lore => {
                        if(lore === item.typeId) hasid = true
                    })

                    if(!hasid) {
                        lore.push(item.typeId)

                        const firstIndex = lore.indexOf(item.typeId)
                        const secondIndex = lore.indexOf(item.typeId, firstIndex + 1)

                        if (firstIndex !== -1 && secondIndex !== -1) {
                            lore.splice(secondIndex, 1)
                        }

                        item.setLore(lore)

                        player.getComponent("inventory").container.setItem(slot, item)
                    }
                }
                else {
                    item = item.clone()
                    const lore = item.getLore()
                    const firstIndex = lore.indexOf(item.typeId)

                    lore.splice(firstIndex, 1)

                    item.setLore(lore)

                    player.getComponent("inventory").container.setItem(slot, item)
                }

                if(item.typeId === "item_id:setting") {
                    item = item.clone()
                    item.nameTag = "アイテムID 設定"
                    player.getComponent("inventory").container.setItem(slot, item)
                }
            }
        }
        
        if(player.getDynamicProperty("item_id") === undefined) player.setDynamicProperty("item_id", true)
    })
}, 1)

world.afterEvents.itemUse.subscribe(ev => {
    if(ev.itemStack.typeId === "item_id:setting") {
        const item_id = ev.source.getDynamicProperty("item_id")
        if(item_id) { //有効なら無効に
            ev.source.setDynamicProperty("item_id", false) 
            ev.source.sendMessage(`§fアイテムID表示を§c無効§fにしました`)
        }
        else if(!item_id) { //無効なら有効に
            ev.source.setDynamicProperty("item_id", true)
            ev.source.sendMessage(`§fアイテムID表示を§a有効§fにしました`)
        }
    }
})