<script>
    let {
        title = "Заголовок страницы | Slomexpert",
        description = "Стандартное описание страницы для поисковых систем.",
        url = "https://slomexpert.com",
        image = "https://slomexpert.com/og-default.png",
        type = "website",
        keywords = "svelte, sveltekit, seo",
        canonical = "",
        jsonLd = null
    } = $props();

    const siteName = "Slomexpert";
    const twitterHandle = "@yourhandle";
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    {#if canonical}
        <link rel="canonical" href={canonical} />
    {/if}

    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content={siteName} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:site" content={twitterHandle} />

    {#if jsonLd}
        <script type="application/ld+json">
      {JSON.stringify(jsonLd)}
        </script>
    {/if}
</svelte:head>
