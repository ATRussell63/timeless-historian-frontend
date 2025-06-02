<script>
    import * as Card from '$lib/components/ui/card';
    import SidebarHomeButton from './SidebarHomeButton.svelte';
    import SidebarButton from './SidebarButton.svelte'
    import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<!-- <Card.Root class="Sidebar">
  <Card.Content class="Sidebar flex flex-col items-end px-0 py-2 mx-1"> -->
  <div class='Sidebar flex flex-col items-end py-2 border'>
    <SidebarHomeButton />
    <SidebarButton label='About' url='/about'/>
  </div>
  <!-- </Card.Content>
</Card.Root> -->

<style>
  .Sidebar {
    background-color: hsl(var(--background));
    border-radius: 10px;
  }
</style>