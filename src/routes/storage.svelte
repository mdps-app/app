<script lang="ts">
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
	});
	//<button on:click={() => delItem(item)}>🗑️</button>

	let showModal = false;
	let selectedItem: {
		id?: string;
		group: number;
		name: string;
		num: string;
		term: string;
		termH: string;
		zone: number;
	};

	function showDetails(item: {
		id?: string | undefined;
		group: number;
		name: string;
		num: string;
		term: string;
		termH: string;
		zone: number;
	}) {
		selectedItem = item;
		showModal = true;
	}

	import { onMount } from 'svelte';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	let user: User | null = null;

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			user = currentUser;
		});

		return unsubscribe; // コンポーネントのアンマウント時にリスナーを解除
	});
</script>

<section>
	<div>
		<table width="100%">
			<tr>
				{#if user}<th width="2%"></th>{/if}
				<th width="5%">状態</th>
				<th width="25%">品名</th>
				<th width="10%">分類</th>
				<th width="10%">個数</th>
				<th width="15%">期限</th>
				<th width="15%">保管期間</th>
				<th width="10%">保管区域</th>
			</tr>
			{#each storage as item}
				<tr>
					{#if user}<tr><button on:click={() => delItem(item)}>🗑️</button></tr>{/if}
					<td></td>
					<td on:click={() => showDetails(item)}>{item.name}</td>
					<td>{item.group}</td>
					<td>{item.num}</td>
					<td>{item.term}</td>
					<td>{item.termH}</td>
					<td>{item.zone}</td>
				</tr>
			{/each}
		</table>

		{#if showModal}
			<div class="modal">
				<h2>{selectedItem.name}</h2>
				<p>Id: {selectedItem?.id}</p>
				<p>Group: {selectedItem.group}</p>
				<p>Number: {selectedItem.num}</p>
				<p>Term: {selectedItem.term}</p>
				<p>TermH: {selectedItem.termH}</p>
				<p>Zone: {selectedItem.zone}</p>
				<button on:click={() => (showModal = false)}>Close</button>
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	table {
		width: 100%;
		height: 100%;
		padding: 25px;
	}
</style>
