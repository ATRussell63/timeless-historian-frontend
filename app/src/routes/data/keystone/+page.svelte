<script>
    import KeystoneHistogram from "../../../KeystoneHistogram.svelte";
    import * as Card from '$lib/components/ui/card';
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    let { data } = $props()

    let hardcore = $state(false)

    let histogram_data = data.data.body.results
    console.log(histogram_data)

</script>

<div class='flex flex-col mx-8 mt-8 gap-4'>
    <span class="pageTitle">Keystones by League</span>
    <Card.Root class='flex flex-row gap-4 w-fit p-4'>
        <Switch bind:checked={hardcore} id='hardcore-switch'/>
        <Label for='hardcore-switch'>Hardcore Leagues</Label>
    </Card.Root>
    <Card.Root class='transparentBackground px-6'>
        <KeystoneHistogram {histogram_data} {hardcore} />
    </Card.Root>
</div>
<Card.Root class='my-8 mx-auto w-fit'>
    <p class='roboto px-4 py-1'>Note: Not all characters tracked by this chart have allocated the corresponding keystone.</p>
</Card.Root>
