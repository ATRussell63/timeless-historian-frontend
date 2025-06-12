<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { ExternalLink, LogOut } from "lucide-svelte";
    import { redirectToAuthorize } from "$lib/oauth";
    import { account_name } from "./store";


    function logout() {
        account_name.set(null);
        localStorage.remove('token_exp')
        localStorage.remove('access_token')
    }

</script>

{#if account_name}
<div class='flex flex-row items-center'>
<p>{account_name}</p><Button variant='ghost' class='mb-1 pr-2 ml-4' on:click={logout}>Logout<LogOut class="w-4 h-4 ml-1" /></Button>
</div>
{:else}
<Button variant='ghost' class='mb-1 pr-2' on:click={redirectToAuthorize}><strong>Log in with your PoE Account</strong><ExternalLink strokeWidth={3} class="w-4 h-4 ml-1" /></Button>
{/if}