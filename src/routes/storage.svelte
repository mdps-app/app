<script lang="ts">
	import { collection, onSnapshot, query, QuerySnapshot, deleteDoc, doc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { goto } from '$app/navigation';

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
		goto(`/${item.id}`);
	}

	import { onMount } from 'svelte';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	let user: User | null = null;

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			user = currentUser;
		});

		return unsubscribe;
	});

	let search = '';
	let sortField = '';
	let sortAscending = true;

	function sortItems(field) {
		if (sortField === field) {
			sortAscending = !sortAscending;
		} else {
			sortField = field;
			sortAscending = true;
		}

		storage = storage.sort((a, b) => {
			if (field === 'term' || field === 'termH') {
				const dateA = new Date(a[field].replace(/\//g, '-'));
				const dateB = new Date(b[field].replace(/\//g, '-'));
				if (isNaN(dateA) || isNaN(dateB)) return 0;
				return sortAscending ? dateA - dateB : dateB - dateA;
			} else if (field === 'group' || field === 'zone') {
				if (typeof a[field] !== 'string' || typeof b[field] !== 'string') return 0;
				const groupA = a[field].toUpperCase();
				const groupB = b[field].toUpperCase();
				if (groupA < groupB) return sortAscending ? -1 : 1;
				if (groupA > groupB) return sortAscending ? 1 : -1;
				return 0;
			} else {
				if (a[field] < b[field]) return sortAscending ? -1 : 1;
				if (a[field] > b[field]) return sortAscending ? 1 : -1;
				return 0;
			}
		});
	}
</script>

<input type="text" bind:value={search} placeholder="Search by name..." />
<section>
	<div>
		<table width="100%" id="th">
			<tr id="point">
				<th width="5%">状態</th>
				<th width="25%">品名</th>
				<th width="10%" on:click={() => sortItems('group')}>分類</th>
				<th width="10%">個数</th>
				<th width="15%" on:click={() => sortItems('term')}>期限</th>
				<th width="15%" on:click={() => sortItems('termH')}>保管期間</th>
				<th width="10%" on:click={() => sortItems('zone')}>保管区域</th>
			</tr>
		</table>
	</div>
	<div id="table">
		<table width="100%" id="td">
			{#each storage as item (item.id)}
				{#if item.name.includes(search)}
					<tr>
						<td width="5%"></td>
						<td width="25%" on:click={() => showDetails(item)}>{item.name}</td>
						<td width="10%">{item.group}</td>
						<td width="10%">{item.num}</td>
						<td width="15%">{item.term}</td>
						<td width="15%">{item.termH}</td>
						<td width="10%">{item.zone}</td>
					</tr>
				{/if}
			{/each}
		</table>
	</div>
</section>

<style lang="scss">
	section {
		width: 100%;
		height: calc(100vh - 10em);
		padding: 25px;
	}
	#table {
		width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		-ms-overflow-style: none;
		scrollbar-width: none;

		border-bottom: solid 4px rgb(0, 153, 255);

		&::-webkit-scrollbar {
			display: none;
		}
	}
	#th {
		border-collapse: collapse;
		border: solid 4px rgb(0, 153, 255);

		th {
			padding: 10px;
			border: dashed 3px rgb(0, 153, 255);

			position: sticky;
			top: 0;
			left: 0;
		}
	}
	#td {
		width: 100%;
		height: 100%;
		border-collapse: collapse;
		border: solid 4px rgb(0, 153, 255);

		td {
			padding: 3px 10px;
			border: dashed 3px rgb(0, 153, 255);
		}
	}
</style>
