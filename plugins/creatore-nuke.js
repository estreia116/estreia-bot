let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let newName = `${oldName} | 𝑺𝑽𝑻 𝑩𝒀  𝑬𝑺𝑻𝑹𝑬𝑰𝑨`;
        await conn.groupUpdateSubject(m.chat, newName);
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    // 🔹 RESET LINK GRUPPO
    let newInviteLink = '';
    try {
        await conn.groupRevokeInvite(m.chat); // invalida il vecchio link
        let code = await conn.groupInviteCode(m.chat); // prende il nuovo codice
        newInviteLink = `https://chat.whatsapp.com/${code}`;
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    await conn.sendMessage(m.chat, {
        text: "𝑨𝒗𝒆𝒕𝒆 𝒂𝒗𝒖𝒕𝒐 𝒍'𝒐𝒏𝒐𝒓𝒆 𝒅𝒊 𝒆𝒔𝒔𝒆𝒓𝒆 𝒔𝒕𝒂𝒕𝒊 𝒔𝒗𝒖𝒐𝒕𝒂𝒕𝒊 𝒅𝒂 𝒆𝒔𝒕𝒓𝒆𝒊𝒂, 𝒕𝒓𝒐𝒊𝒆 𝒎𝒊𝒆 𝒆𝒔𝒕𝒓𝒆𝒊𝒂 𝒓𝒆𝒈𝒏𝒂 𝒆 𝒑𝒆𝒓 𝒔𝒆𝒎𝒑𝒓𝒆 𝒍𝒐 𝒔𝒂𝒓𝒂́ʕ •́؈•̀ ₎"
    });

    await conn.sendMessage(m.chat, {
        text: `𝒆𝒔𝒕𝒓𝒆𝒊𝒂 𝒓𝒆𝒈𝒏𝒂 𝒃𝒓𝒖𝒕𝒕𝒆 𝒕𝒓𝒐𝒊𝒆 𝒓𝒂𝒏𝒅𝒐𝒎 `,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'hard wipe.");
    }
};

handler.command = ['troie'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;