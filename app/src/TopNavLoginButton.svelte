<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { ExternalLink, Check, X } from "lucide-svelte";

    function login() {
        console.log('bing bong')
        // build request, send to /oauth/authorize, etc
    }
</script>

<!-- This is a placeholder for when we support bulk searches -->

<Button variant='ghost' class='mb-1 pr-2' on:click={login()}><strong>Log in with your PoE Account</strong><ExternalLink strokeWidth={3} class="w-4 h-4 ml-1" /></Button>