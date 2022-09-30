<script>  
</script>

<!-- MARKUP -->
<div class="brand">
<a href="/">
    <div class="logos">
        <img class="logo" src='/fypt.png' alt="logo">
        <img class="logo text" src='/fypt-text.png' alt="logo text">
    </div>  
</a>
</div>

<!-- STYLES -->
<style lang="scss">
.brand {
    align-self: center;
    padding: 0.15rem 0;
}

.version {
    font-size: 0.75rem;
    opacity: 0.7;
    align-self: center;
    margin-top: var(--version-offset);
    margin-bottom: calc(-1 * var(--version-offset));

    &:hover {
    opacity: 1;
    }
}

.logos {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;

    > .logo {
        margin-right: 1rem;
        max-height: 100%;

        &.text {
            margin: 0;
        }
    }
}

a {
    font-size: var(--brand-size);
    letter-spacing: -0.05em;
    transition: color 0.2s ease;
    display: inline-block;
    transform-origin: 0% 50%;
    color: var(--brand-color);

    &:hover {
    color: var(--accent-color);
    }
}

@media(max-width: 480px) {
    .logo {
        margin: 0;

        &.text {
            height: 25px;
        }
    }
}

</style>