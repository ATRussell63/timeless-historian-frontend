<script>
    import TopNavButton from "./TopNavButton.svelte";
    import TopNavLoginButton from "./TopNavLoginButton.svelte";
    import TopNavDisabledButton from "./TopNavDisabledButton.svelte";
</script>

<nav class="bg-white text-white px-4 pt-8 pb-0 flex items-center justify-center">
    <div class='mr-auto'>
    </div>
    <div class='flex flex-row pb-0 gap-4 items-end h-[46px]'>
      <TopNavButton label='Search' url='/search'/>
      <!-- <TopNavButton label='Browse' url='/browse'/> -->
      <TopNavDisabledButton label='Bulk (Coming Soon)'></TopNavDisabledButton>
      <!-- <TopNavButton label='Bulk (coming soon)' enabled={false}/> -->
    </div>
    <div class="ml-auto">
      <!-- <TopNavLoginButton /> -->
    </div>
  </nav>

<style>

nav {
  background: rgba(76, 175, 80, 0.0);
  /* background-color: black; */
	/* box-shadow: 0 8px 8px -6px rgba(0, 0, 0, 0.3); */
}

</style>