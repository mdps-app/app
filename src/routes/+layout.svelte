<script lang="ts">
	import { goto } from '$app/navigation';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { tTop, check } from '$lib/pageMove';
	import { signOut } from 'firebase/auth';
	import Signin from './signin.svelte';

	let userId: string | null;
	onAuthStateChanged(auth, (user) => {
		userId = user ? user.uid : null;
	});
	import { onMount } from 'svelte';
	import { setupAuthListener } from '$lib/logg.js';
	import { query, collection, where, getDocs } from 'firebase/firestore';
	let user = null;
	onMount(() => {
		const unsubscribe = setupAuthListener(async (currentUser) => {
			user = currentUser;
			if (user) {
				const q = query(collection(db, 'approvedUsers'), where('uid', '==', user.uid));
				const querySnapshot = await getDocs(q);
				if (!querySnapshot.empty) {
				} else {
					signOut(auth);
					alert('承認されたアカウントでないため、ログアウトしました');
				}
			} else {
			}
		});
		return unsubscribe;
	});
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="https://unpkg.com/modern-css-reset/dist/reset.min.css" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@100;300;400;500;700;800;900&display=swap"
		rel="stylesheet"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
</svelte:head>

<input id="checkbox" type="checkbox" bind:checked={$check} />
<span id="triangle" style="top: {$tTop}px;"></span>
<header>
	<div>
		<div>
			<p>備品管理システム</p>
			<p>-mdps-</p>
		</div>
		<img src="https://placehold.jp/150x150.png" alt="logo" />
	</div>
	<nav>
		<ul>
			<li>
				<p><a href="./dashboard">ダッシュボード</a></p>
				<span class="material-symbols-outlined"><a href="./dashboard"> dashboard </a></span>
			</li>
			<li>
				<p><a href="./database">一覧</a></p>
				<span class="material-symbols-outlined"><a href="./database"> database </a></span>
			</li>
			<li>
				<p><a href="./map">配置図</a></p>
				<span class="material-symbols-outlined"><a href="./map"> map </a></span>
			</li>
			<li>
				<p><a href="./setting">設定</a></p>
				<span class="material-symbols-outlined"><a href="./setting"> settings </a></span>
			</li>
			<li id="menu">
				<div>
					{#if userId}
						<div class="fixed right-2 top-2">
							<button
								class="underline"
								on:click={() => {
									goto(window.location.pathname, { replaceState: true });
									signOut(auth);
								}}>Logout</button
							>
						</div>
					{:else if userId === null}
						<Signin />
					{:else}
						<!-- ローディング表示 -->
						<div class="flex justify-center mt-20">
							<div
								class="animate-spin h-10 w-10 border-4 border-gray-500 rounded-full border-t-transparent"
							></div>
						</div>
					{/if}
				</div>
				<label for="checkbox"><span class="material-symbols-outlined"> menu </span></label>
			</li>
		</ul>
	</nav>
</header>
<main>
	<slot />
</main>

<style lang="scss">
	:global(body) {
		font-family: 'M PLUS 1p', sans-serif;
		font-weight: 400;
		font-style: normal;
		background-color: #6ec8f5;
	}
	header {
		z-index: 999;
		width: 300px;
		height: 100vh;
		background-color: #5eabd1;
		position: fixed;
		user-select: none;

		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 100px 1fr;
		gap: 20px;

		div {
			width: 100%;
			height: 100%;

			display: grid;
			grid-template-columns: 1fr 100px;
			grid-template-rows: 1fr;
		}
		nav {
			height: 100%;
		}

		ul {
			width: 100%;
			height: 100%;

			margin: 0;
			padding: 0;

			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: repeat(4, 100px) 1fr 100px;
			gap: 10px;

			li {
				list-style: none;
				cursor: pointer;

				display: grid;
				grid-template-columns: 1fr 100px;

				p {
					width: 100%;
					height: 100%;

					font-size: 1.5em;
					display: flex;
					justify-content: right;
					align-items: center;

					a {
						color: #101213;
						text-decoration: none;
					}
				}
				span {
					width: 100%;
					height: 100%;

					font-size: 2.5em;
					display: flex;
					justify-content: center;
					align-items: center;

					a {
						color: #101213;
						text-decoration: none;
					}
				}
			}

			#menu {
				grid-row: 6 / 7;
				cursor: default;

				div {
					display: flex;
					justify-content: center;
					align-items: center;
				}

				label {
					display: flex;
					justify-content: center;
					align-items: center;
				}

				span {
					grid-column: 2 / 3;
					cursor: pointer;
				}
			}
		}
	}

	header {
		transform: translateX(-200px);
		transition: all 300ms 0s ease;
	}

	input[type='checkbox'] {
		display: none;

		&:checked {
			~ header {
				transform: translateX(0px);
			}
			~ #triangle {
				transform: translateX(200px);
			}
		}
	}

	#triangle {
		width: 0;
		height: 0;
		border-top: 20px solid transparent;
		border-right: 20px solid #6ec8f5;
		border-bottom: 20px solid transparent;
		position: fixed;
		z-index: 1000;
		left: 80px;
		transform: translateX(-300px);
		transition: all 300ms 0s ease;
	}
	#triangle {
		transform: translateX(0px);
		transform: translateY(-25%);
		transition: all 300ms 0s ease;
	}

	button {
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
		background-color: #3388dd;
		border: #fff;
		color: #fff;
	}

	main {
		margin-left: 110px;
	}

	@media (max-width: 1000px) {
		header {
			width: 200px;
			top: 0;
			right: 0;
			grid-template-rows: 60px 1fr;
			gap: 20px;

			div {
				grid-template-columns: 1fr 60px;
			}

			ul {
				grid-template-rows: repeat(4, 60px) 1fr 60px;
				position: relative;

				li {
					grid-template-columns: 60px 1fr;

					p {
						grid-column: 2 / 3;
						grid-row: 1 / 2;
						width: 100%;
						height: 100%;

						font-size: 1em;
						display: flex;
						justify-content: left;
						align-items: center;

						a {
							color: #101213;
							text-decoration: none;
						}
					}
					span {
						grid-column: 1 / 2;
						grid-row: 1 / 2;
						width: 100%;
						height: 100%;

						font-size: 2em;
						display: flex;
						justify-content: center;
						align-items: center;

						a {
							color: #101213;
							text-decoration: none;
						}
					}
				}
			}
		}
		#menu {
			grid-template-columns: 1fr;

			label {
				position: absolute;
				top: -60px;
				right: 220px;
			}
			div {
				display: flex;
				justify-content: center;
				align-items: center;
			}
			span {
				cursor: pointer;
			}
		}
		header {
			transform: translateX(200px);
			transition: all 300ms 0s ease;
		}
		#triangle {
			display: none;
		}
		main {
			margin-left: 10px;
		}
	}
</style>
