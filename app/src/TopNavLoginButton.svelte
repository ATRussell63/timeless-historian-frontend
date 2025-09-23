<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { ExternalLink, LogOut } from "lucide-svelte";
    import { redirectToAuthorize } from "$lib/oauth";
    import { account_name } from "./store";
    import { get } from "svelte/store";


    function logout() {
        account_name.set(null);
        localStorage.remove('token_exp')
        localStorage.remove('access_token')
    }
    // console.log(get(account_name))
    // account_name.set('Rooballeux#4717')
</script>

{#if $account_name !== null}
<div class='flex flex-row items-center'>
<strong>{$account_name}</strong><Button variant='ghost' class='mb-1 py-0 px-2 ml-4' onclick={logout}>Logout<LogOut class="w-4 h-4 ml-1" /></Button>
</div>
{:else}
<Button variant='ghost' class='mb-1 pr-2' onclick={redirectToAuthorize}><strong>Log in with your PoE Account</strong><ExternalLink strokeWidth={3} class="w-4 h-4 ml-1" /></Button>
{/if}

<style>
  strong {
    font-size: 16px;
  }  
</style>