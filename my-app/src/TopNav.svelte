<script>
    import TopNavButton from "./TopNavButton.svelte";
    import TopNavLoginButton from "./TopNavLoginButton.svelte";
    import TopNavDisabledButton from "./TopNavDisabledButton.svelte";
</script>

<nav class="bg-white text-white px-4 pt-10 pb-0 flex items-center justify-between">
    <!-- Centered Buttons -->
    <div class="absolute left-1/2 transform -translate-x-1/2 flex space-x-4">
      <TopNavButton label='Search' url='/search'/>
      <TopNavButton label='Browse' url='/browse'/>
      <TopNavDisabledButton label='Bulk (Coming Soon)'></TopNavDisabledButton>
      <!-- <TopNavButton label='Bulk (coming soon)' enabled={false}/> -->
    </div>
    <!-- Login button on the right -->
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