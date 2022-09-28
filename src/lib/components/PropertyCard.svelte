<script>
    export let property = {}
    export let animate = false

    import database from '$lib/database.js' 
    import createReport from '$lib/compReport'
    import Stretch from '$lib/components/Stretch.svelte'

    let subjectProperty, comps = []
    let subjectPropertyAdjustedPrice
    let taxSavings
    let compCount
    let compsRun = false
    let protest = false
    let flip = false

    const submit = (action) => {
        createReport(subjectProperty, comps, action)
    }

    const formatAmount = (amount) => {
        return amount.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
    }

    const getComps = async (account) => {
        flip = true
        const compResults = await database.getComps(account)
        subjectProperty = compResults.subjectProperty
        comps = compResults.comps

        compCount = comps.length
        let compAvgSqFtPrice
        
        if (compCount > 0) {
            //Find the Median SqFt Price
            if (compCount % 2 == 0) { //It's even - we need to avg the middle numbers
                compAvgSqFtPrice = (comps[compCount / 2].adjSqFtValue + comps[(compCount / 2) - 1].adjSqFtValue) / 2
            }
            else {
                compAvgSqFtPrice = comps[(compCount - 1) / 2].adjSqFtValue
            }
        }
        else {
            compAvgSqFtPrice = subjectProperty.priceSqFt
        }

        if (subjectProperty.taxRate == 0) {
            subjectProperty.taxRate = 2.5
        }

        subjectPropertyAdjustedPrice = (subjectProperty.sqFt * compAvgSqFtPrice) + subjectProperty.landValue + subjectProperty.xFeatures
        taxSavings = (subjectProperty.marketValue - subjectPropertyAdjustedPrice) * (subjectProperty.taxRate / 100) < 0 ?
                            0 : (subjectProperty.marketValue - subjectPropertyAdjustedPrice) * (subjectProperty.taxRate / 100)
        
        if (taxSavings > 0)
            protest = true

        subjectPropertyAdjustedPrice = formatAmount(subjectPropertyAdjustedPrice)
        taxSavings = formatAmount(taxSavings)
        compsRun = true;
    }

</script>

<div class="propCard" class:animate={!flip && animate} class:flip={flip}>
    {#if flip}
        {#if compsRun}
        <div class="details center back">
            <div class="center fadein">
                <p>{property.owner} - {property.addr1} {property.addr2} {property.addr3}</p>
            </div>
            <div class="right">
                <div class="comps fadein">
                    <p>Comparable Properties: <strong>{compCount}</strong></p>
                    <p>Adjusted Market Value: <strong>${subjectPropertyAdjustedPrice}</strong></p>
                    <p>Tax Savings: <strong>${taxSavings}</strong></p>
                    {#if protest}
                        <p>Based on this evidence, you should definitely protest your taxes this year</p>
                    {:else}
                        <p>Based on this evidence, you should probably not protest your taxes this year</p>
                    {/if}
                </div>
            </div>
            <button class="fadein" on:click={() => submit('open')}>View Report</button>
            <button class="fadein" on:click={() => submit('download')}>Download Report</button>
        </div>  
        {:else}
        <div class="loading delay">
            <Stretch />
        </div>
        {/if}
    {:else}
        <div class="details left">
            <div class="left">
                <p>{property.owner}</p>
                <p>{property.addr1}</p>
                <p>{property.addr2} {property.addr3}</p>
            </div>
        </div>  
        <button on:click={() => getComps(property.account)}>Get Comps</button>
    {/if}
</div>

<style lang="scss">

    @keyframes fadeIn {
        0% { opacity: 0; }
        90% { opactiy: 0; }
        100% { opacity: 1; }
    }

    .delay {
        animation: fadeIn 5s;
    }

    .fadein {
        animation: fadeIn 2s;
    }

    .loading {
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .propCard {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        background-color: white;
        margin: 1.5rem;

        transform:
            perspective(750px)
            translate3d(0px, 0px, -25px)
            rotateX(15deg)
            scale(0.9, 0.9);
        border-radius: 20px;
        border: 5px solid #e6e6e6;
        box-shadow: 0 70px 40px -20px rgba(0, 0, 0, 0.2);
        transition: 0.4s ease-in-out transform;

        &:hover {
            transform: translate3d(0px, 0px, -25px);
        }

        &:active {
            transform-origin: center;
            transform: rotateY(180deg);
            transition: 0.7s ease-in-out transform;
        }

        &.flip {
            transform-origin: center;
            transform: 
                perspective(1000px)
                rotateY(180deg);
            transition: 1.5s ease-in-out transform;
        }

        &.animate {
            transform: translate3d(0px, 0px, -250px);
        }

        * p {
            margin: 0.5rem;
        }

        > .details {
            display: flex;

            &.left {
                flex-direction: row;
            }

            &.center {
                flex-direction: column;
            }

            &.back {
                transform: rotateY(180deg);

            }

            > button {
                margin: .3rem;
            }

            > .center {
                display: flex;
                justify-content: center;
            }
        }
    }

</style>