// bulk-delete-fetch.js
const BASE_URL = 'https://crm.tat.ua/api/clients';
const AUTH_TOKEN = 'c906bb1c8c3f6c81725ae5509d26c4fb8933cef2';

async function deleteClient(id) {
    const url = `${BASE_URL}/${id}`;
    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'X-AUTH-TOKEN': AUTH_TOKEN,
                'Content-Type': 'application/json',
                'Accept': 'application/json;q=0.9'
            }
        });
        console.log(`✅ [${id}] → ${res.status} ${res.statusText}`);
    } catch (e) {
        console.error(`❌ [${id}] →`, e.message);
    }
}

(async () => {
    console.log('🚀 Старт видалення');
    for (let i = 251500; i <= 251599; i++) {
        await deleteClient(i);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('🏁 Готово.');
})();