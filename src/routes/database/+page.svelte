<script lang="ts">
	import { addDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { idTextList, zoneTextList } from '$lib';
	import type { Item } from '$lib';

	let itemName: string = '';
	let num: string = '';
	let selected = idTextList[0];
	let term = '';
	let termH = '';
	let zone = zoneTextList[0];

	function addItem() {
		if (itemName == '') return;
		const item: Item = {
			group: selected.id,
			name: itemName,
			num: num,
			term: term,
			termH: termH,
			zone: zone.id
		};
		addDoc(collection(db, 'storage'), item);
		itemName = '';
		num = '';
		term = '';
		termH = '';
		selected = idTextList[0];
		zone = zoneTextList[0];
	}

	import { tTop, check } from '$lib/pageMove';
	import { onMount } from 'svelte';
	import Storage from '../storage.svelte';
	onMount(() => {
		check.set(false);
	});
	tTop.set(270);

	let flag = false;

	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	let user: User | null = null;

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			user = currentUser;
		});
		return unsubscribe;
	});
</script>

<h1>database</h1>

{#if user}
	<label for="flag_window" class="open_sub_window"><span></span></label>
	<input type="checkbox" id="flag_window" class="check_sub_window" bind:checked={flag} />
{/if}

{#if flag}
	<div>
		<ul>
			<li>
				<p>品名</p>
				<input type="text" bind:value={itemName} placeholder="品名を記入してください" />
			</li>
			<li>
				<p>分類</p>
				<select bind:value={selected}>
					{#each idTextList as question}
						<option value={question}>
							{question.text}
						</option>
					{/each}
				</select>
			</li>
			<li>
				<p>個数</p>
				<input type="text" bind:value={num} placeholder="個数を記入してください" />
			</li>
			<li>
				<p>期限</p>
				<input type="date" name="term" bind:value={term} />
			</li>
			<li>
				<p>保管期間</p>
				<input type="date" name="term" bind:value={termH} />
			</li>
			<li>
				<p>保管区域</p>
				<select bind:value={zone}>
					{#each zoneTextList as question}
						<option value={question}>
							{question.text}
						</option>
					{/each}
				</select>
			</li>
			<li>
				<button on:click={addItem}>追加する</button>
			</li>
		</ul>
	</div>
{/if}
<Storage />

<style lang="scss">
	.open_sub_window {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background-color: #3388dd;
		color: #fff;
		text-align: center;
		cursor: pointer;
		display: grid;
		place-items: center;

		span {
			display: block;
			width: 40px;
			height: 5px;
			border-radius: 10px;
			background-color: #fff;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				display: block;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: inherit;
				border-radius: inherit;
				transform: rotate(90deg);
			}
		}
	}

	.open_sub_window:hover {
		background-color: #559ee7;
	}

	.check_sub_window {
		display: none;
	}

	div {
		width: 500px;
		height: 400px;
		padding: 40px;
		border-radius: 10px;
		background-color: #fdfeff;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		z-index: 99;

		user-select: none;

		ul {
			margin: 0;
			padding: 0;

			width: 100%;
			height: 100%;

			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: repeat(6, 1fr) 1.5fr;
			gap: 10px;

			li {
				list-style: none;

				display: grid;
				grid-template-columns: 100px 1fr;
				grid-template-rows: 1fr;
				gap: 20px;

				p {
					display: flex;
					justify-content: right;
					align-items: center;
				}

				&:last-child {
					margin-top: 10px;
				}

				button {
					grid-column: 1 / 3;

					border-radius: 5px;
					cursor: pointer;
					background-color: #3388dd;
					border: #fff;
					color: #fff;
				}
			}
		}
	}

	@media (max-width: 1000px) {
		.open_sub_window {
			width: 50px;
			height: 50px;

			bottom: 15px;
			right: 15px;

			span {
				width: 30px;
			}
		}
		div {
			width: 90%;

			ul {
				li {
					grid-template-columns: 50px 1fr;
					gap: 5px;

					width: 100%;

					p {
						font-size: .5em;
					}
				}
			}
		}
	}
</style>
