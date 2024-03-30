<script lang="ts">
	import { tTop, check } from '$lib/pageMove';
	import { onMount } from 'svelte';
	onMount(() => {
		check.set(false);
	});

	tTop.set(490);

	import Signin from '../signin.svelte';
	import { goto } from '$app/navigation';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { signOut } from 'firebase/auth';

	let userId: string | null;
	onAuthStateChanged(auth, (user) => {
		userId = user ? user.uid : null;
	});
	import { setupAuthListener } from '$lib/logg.js';
	import { query, collection, where, getDocs } from 'firebase/firestore';
	let user = null;
	let displayName: string | null;
	let email: string | null;
	let photoURL: string | null;
	onMount(() => {
		const unsubscribe = setupAuthListener(async (currentUser) => {
			user = currentUser;
			if (user) {
				const q = query(collection(db, 'approvedUsers'), where('uid', '==', user.uid));
				const querySnapshot = await getDocs(q);
				displayName = user.displayName;
				email = user.email;
				photoURL = user.photoURL;
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

	import { updatePassword } from 'firebase/auth';
	let newPass: string;
	async function updatePass(newPassword: string) {
		if (newPassword.length <= 6) {
			const user = auth.currentUser;
			if (user) {
				try {
					await updatePassword(user, newPassword);
					console.log('Password updated successfully');
					signOut(auth);
				} catch (error) {
					console.error('Error updating password: ', error);
				}
			} else {
				console.error('No user is currently logged in');
			}
		}
	}
</script>

<h1>setting</h1>
{#if userId}
	<div class="fixed right-2 top-2">
		<button
			class="underline"
			on:click={() => {
				goto(window.location.pathname, { replaceState: true });
				signOut(auth);
			}}>Logout</button
		>
		<p>user:<span><img src={photoURL} alt="userIcon" />{displayName}（{email}）</span></p>
	</div>
	<input type="text" placeholder="new password" bind:value={newPass} />
	<button on:click={() => updatePass(newPass)}>パスワード変更</button>
{:else if userId === null}
	<Signin />
{/if}
