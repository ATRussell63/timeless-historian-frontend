<script>
    import * as Card from '$lib/components/ui/card';
    import SidebarHomeButton from './SidebarHomeButton.svelte';
    import SidebarButton from './SidebarButton.svelte'
    import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<!-- <Card.Root>
    <Card.Content class='p-2 grid gap-4'>
        <div class='flex flex-col items-end space-y-2'>
        <SidebarHomeButton class=''></SidebarHomeButton>
        <SidebarButton class='' label='About' url='/about'></SidebarButton>
            </div>
    </Card.Content>
</Card.Root> -->

<Card.Root class="inline-block mt-1 mr-4 Sidebar">
        <Card.Content class="flex flex-col items-end gap-2 p-2">
          <SidebarHomeButton />
          <SidebarButton label='About' url='/about'/>
        </Card.Content>
      </Card.Root>