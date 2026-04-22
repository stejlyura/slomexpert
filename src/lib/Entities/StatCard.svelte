<script>
    let { value = "", label = "" } = $props();
</script>

<div class="border-4 border-orange p-6 text-center bg-tire/50 relative overflow-hidden text-white">
    <div class="font-heading font-black text-5xl text-orange mb-2">{value}</div>
    <div class="font-bold text-lg">{label}</div>
</div>
