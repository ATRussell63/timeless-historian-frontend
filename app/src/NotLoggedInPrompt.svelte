<script>
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { redirectToAuthorize } from "$lib/oauth";
</script>

<div class="flex flex-row mt-20 justify-center">
    <Card.Root class="transparentBackground">
        <Card.Header>
            <Card.Title class="text-center"
                >You are not currently logged in</Card.Title
            >
        </Card.Header>
        <Card.Content>
            <div class="flex flex-row justify-center mb-4">
                <Button class="w-[200px] h-[50px] lg:w-[300px] lg:h-[80px]" onclick={redirectToAuthorize}
                    ><p class="homeSearchButton text-[24px] lg:text-[32px]">Login</p></Button
                >
            </div>
            <p class="text-center roboto">
                Log in to grant Timeless Historian access to view your stash
                tabs.
            </p>
        </Card.Content>
    </Card.Root>
</div>
