<script lang="ts">
	import { FirebaseError } from 'firebase/app';
	import { signInWithRedirect} from 'firebase/auth';
	import { auth, provider } from '$lib/firebase';

	async function signInWithGoogle() {
		try {
			signInWithRedirect(auth, provider);
		} catch (error) {
			if (error instanceof FirebaseError) {
				console.log(error);
			}
		}
	}
</script>

<section class="flex justify-center">
	<div class="mt-20 border border-gray-500 rounded bg-gray-200 py-1 px-2">
		<button on:click={signInWithGoogle}>Sign in with Google</button>
	</div>
</section>
