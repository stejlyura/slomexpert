<script lang="ts">
    let { message = "", type = "success" as "success" | "error" } = $props();
</script>

{#if message}
    <div 
        class="mt-6 p-4 font-bold border-3 text-center {type === 'success' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-red-100 text-red-800 border-red-800'}"
    >
        {message}
    </div>
{/if}
