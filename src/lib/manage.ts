import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase';
import { onMount } from 'svelte';

export let user: User | null = null;

onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
    });

    return unsubscribe; // コンポーネントのアンマウント時にリスナーを解除
});