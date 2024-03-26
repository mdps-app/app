import { collection, onSnapshot, query, QuerySnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '$lib/firebase';

export type Item = {
    id?: string;
    group: number;
    name: string;
    num: string;
    term: string;
    termH: string;
    zone: number;
};

export function delItem(item: Item) {
    if (!item.id) return;
    let confirmResult = window.confirm('「' + item.name + '」を削除しますか？');
    if (confirmResult) {
        deleteDoc(doc(db, 'storage', item.id));
    }
}//<button on:click={() => delItem(item)}>🗑️</button>

let storage: Item[] = [];

type IdTextPair = {
    id: number;
    text: string;
};

type zoneTextPair = {
    id: number;
    text: string;
}

export const idTextList: IdTextPair[] = [
    { id: 1, text: 'トイレ' },
    { id: 2, text: '衛生' },
    { id: 3, text: '食品関連' },
    { id: 4, text: '衣類' },
    { id: 5, text: '安全' },
    { id: 6, text: '暮らし' },
    { id: 7, text: '文房具' },
];

export const zoneTextList: zoneTextPair[] = [
    { id: 1, text: 'A1' },
    { id: 2, text: 'A2' },
    { id: 3, text: 'A3' },
]

export function getTextById(id: number, list: any[]): number {
    const pair = list.find((pair) => pair.id === id);
    return pair ? pair.text : id;
}

onSnapshot(query(collection(db, 'storage')), (snapshot: QuerySnapshot): any => {
    storage = snapshot.docs.map((doc) => {
        const data = doc.data();
        const item: Item = {
            id: doc.id,
            group: getTextById(data.group, idTextList),
            name: data.name,
            num: data.num,
            term: data.term,
            termH: data.termH,
            zone: getTextById(data.zone, zoneTextList)
        };
        return item;
    });
});

export function test() {
    return storage;
}