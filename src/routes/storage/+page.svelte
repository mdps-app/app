<script lang="ts">
	import { page } from '$app/stores';
	let items: string;

	$: {
		items = $page.url.hash.slice(1);
	}

	import { collection, onSnapshot, query, QuerySnapshot, deleteDoc, doc } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	type Item = {
		id?: string;
		group: number;
		name: string;
		num: string;
		term: string;
		termH: string;
		zone: number;
	};

	let storage: Item[] = [];

	function delItem(item: Item) {
		if (!item.id) return;
		let confirmResult = window.confirm('「' + item.name + '」を削除しますか？');
		if (confirmResult) {
			deleteDoc(doc(db, 'storage', item.id));
		}
	}

	let urlItem: Item | undefined;

	function details(item: Item | undefined) {
		if (item) {
			urlItem = item;
		}
	}

	onSnapshot(query(collection(db, 'storage')), (snapshot: QuerySnapshot): any => {
		storage = snapshot.docs.map((doc) => {
			const data = doc.data();
			const item: Item = {
				id: doc.id,
				group: data.group,
				name: data.name,
				num: data.num,
				term: data.term,
				termH: data.termH,
				zone: data.zone
			};
			return item;
		});
		details(storage.find((item: Item) => item.id === items));
	});

	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	let canvas: HTMLCanvasElement;
	let url = 'https://mdps-app.web.app/storage' + $page.url.hash;

	onMount(async () => {
		await QRCode.toCanvas(canvas, url);
	});

	import { writable } from 'svelte/store';
	import { idTextList, zoneTextList } from '$lib';

	// モーダルの表示状態を管理するストア
	export const showModal = writable(false);

</script>

<h1>{urlItem?.name}</h1>
<div>
	<p>分類：{urlItem?.group}</p>
	<p>個数：{urlItem?.num}</p>
	<p>期限：{urlItem?.term}</p>
	<p>保管期間：{urlItem?.termH}</p>
	<p>保管区域：{urlItem?.zone}</p>
</div>
<canvas bind:this={canvas}></canvas>
<a href="../database">戻る</a>
<button on:click={() => showModal.set(true)}>編集</button>

<style lang="scss">
</style>
