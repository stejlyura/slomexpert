<script>
    import Input from '../shared/ui/Input.svelte';
    import Button from '../shared/ui/Button.svelte';

    let {
        title = "Швидка оцінка об'єкта",
        description = "Залишіть заявку, і наш спеціаліст зв'яжеться з вами протягом 15 хвилин.",
        buttonText = "ВИКЛИКАТИ МАЙСТРА",
        id = "contact-form"
    } = $props();

    let name = $state("");
    let phone = $state("");

    function handleSubmit() {
        console.log("Form submitted:", { name, phone });
        // Handle form submission logic here
    }
</script>

<div class="card-brutal" {id}>
    <h2 class="title">{title}</h2>
    <p class="description">{description}</p>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="form-layout">
        <Input 
            bind:value={name} 
            placeholder="Ваше ім'я" 
            required 
            className="flex-1"
        />
        <Input 
            bind:value={phone} 
            type="tel" 
            placeholder="+38 (0__) ___-__-__" 
            required 
            className="flex-1"
        />
        <Button type="submit" variant="orange" className="px-8 py-4 text-lg">
            {buttonText}
        </Button>
    </form>
</div>

<style>
    .title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    @media (min-width: 768px) {
        .title {
            font-size: 2.5rem;
        }
    }

    .description {
        color: var(--color-steel);
        font-weight: 500;
        margin-bottom: 2rem;
    }

    .form-layout {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    @media (min-width: 768px) {
        .form-layout {
            flex-direction: row;
            align-items: stretch;
        }
    }
</style>
