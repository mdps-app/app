<script lang="ts">
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
    import Storage from './storage.svelte';

	let userId: string | null;
	onAuthStateChanged(auth, (user) => {
		userId = user ? user.uid : null;
	});
</script>

{#if userId}
	<Storage/>
{:else}
	<!-- ローディング表示 -->
	<div class="flex justify-center mt-20">
		<div
			class="animate-spin h-10 w-10 border-4 border-gray-500 rounded-full border-t-transparent"
		></div>
	</div>
{/if}
