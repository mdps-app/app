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

	type IdTextPair = {
		id: number;
		text: string;
	};

	const idTextList: IdTextPair[] = [
		{ id: 1, text: 'トイレ' },
		{ id: 2, text: '衛生' },
		{ id: 3, text: '食品関連' },
		{ id: 4, text: '衣類' },
		{ id: 5, text: '安全' },
		{ id: 6, text: '暮らし' },
		{ id: 7, text: '文房具' },
	];
	const zoneTextList: zoneTextPair[] = [
		{ id: 1, text: 'A1'},
		{ id: 2, text: 'A2'},
		{ id: 3, text: 'A3'},
	]
	function getTextById(id: number, list): string | undefined {
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
		if (sortField !== field) {
			sortField = field;
			sortAscending = true;
		} else {
			sortAscending = !sortAscending;
		}

		storage = [...storage].sort((a, b) => {
			if (field === 'term' || field === 'termH' || field === 'zone') {
				if (!a[field] && !b[field]) return 0;
				if (!a[field]) return 1;
				if (!b[field]) return -1;
			}

			if (field === 'name') {
				const nameA = a[field] || '';
				const nameB = b[field] || '';
				return sortAscending ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja');
			} else if (field === 'term' || field === 'termH') {
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

<input type="text" bind:value={search} placeholder="🔍検索" />
<section>
	<div>
		<table width="100%" id="th">
			<tr id="point">
				<th width="25%" on:click={() => sortItems('name')}>品名</th>
				<th width="10%" on:click={() => sortItems('group')}>分類</th>
				<th width="10%" id="num">個数</th>
				<th width="10%" on:click={() => sortItems('term')}>期限</th>
				<th width="10%" on:click={() => sortItems('termH')}>保管期間</th>
				<th width="10%" on:click={() => sortItems('zone')}>保管区域</th>
			</tr>
		</table>
	</div>
	<div id="table">
		<table width="100%" id="td">
			{#each storage as item (item.id)}
				{#if item.name.includes(search)}
					<tr>
						<td width="25%" on:click={() => showDetails(item)}>{item.name}</td>
						<td width="10%">{item.group}</td>
						<td width="10%">{item.num}</td>
						<td width="10%">{item.term}</td>
						<td width="10%">{item.termH}</td>
						<td width="10%">{item.zone}</td>
					</tr>
				{/if}
			{/each}
		</table>
	</div>
</section>

<style lang="scss">
	input {
		height: 40px;
		width: 300px;
		margin-left: 25px;
		margin-top: 10px;
		padding-left: 10px;
		background-color: #6ec8f5;
		border: 3px solid rgb(0, 153, 255);
		border-radius: 20px;
	}
	section {
		width: 100%;
		height: calc(100vh - 10em);
		padding: 25px;
		padding-top: 10px;
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

			user-select: none;

			position: sticky;
			top: 0;
			left: 0;
		}

		th:not([id]) {
			cursor: pointer;
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
