<script>
    import * as Card from '$lib/components/ui/card';
    import SidebarHomeButton from './SidebarHomeButton.svelte';
    import SidebarButton from './SidebarButton.svelte'
    import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<Card.Root class="inline-block mr-4 Sidebar">
  <Card.Content class="flex flex-col items-end px-0 py-2">
    <SidebarHomeButton />
    <SidebarButton label='About' url='/about'/>
  </Card.Content>
</Card.Root>