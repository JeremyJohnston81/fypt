<script>
    import { variables } from '$lib/variables'
    import database from '$lib/database.js' 
    import img2base from '$lib/imageToBase64'
    //import * as i2b from 'imageurl-base64'

    let searchResults = []
    let searchAddress = ""

    const createPdfReport = async (subjectProperty, comps) => {

        const compCount = comps.length
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

        const subjectPropertyAdjustedPrice = (subjectProperty.sqFt * compAvgSqFtPrice) + subjectProperty.landValue + subjectProperty.xFeatures
        const taxSavings = (subjectProperty.marketValue - subjectPropertyAdjustedPrice) * (subjectProperty.taxRate / 100) < 0 ?
                            0 : (subjectProperty.marketValue - subjectPropertyAdjustedPrice) * (subjectProperty.taxRate / 100)

        subjectProperty.address = `${subjectProperty.addr1}, ${subjectProperty.addr2}, ${subjectProperty.addr3}`

        let mapURL = "https://maps.googleapis.com/maps/api/staticmap?scale=2&size=600x300&maptype=roadmap";
        
        mapURL += encodeURI('&markers=color:red|label:S|' + subjectProperty.address);

        const subjectData = [['Account\n----------\nAddress','Neigbr Code','Built/Remodel\n----------\nDEPR','CAD Desc\n----------\nCAD','CDU Desc\n----------\nCDU','Grade Desc\n----------\nGrade','SqFt','Land $','Imprv $\n----------\nXtra Feat','Market $']];

        const subjectDataRow = [];

        subjectDataRow.push(subjectProperty.account + '\n' + subjectProperty.addr1)
        subjectDataRow.push(subjectProperty.hoodCode)
        subjectDataRow.push(subjectProperty.yrUpdated)
        subjectDataRow.push(subjectProperty.cadDesc.substr(0,13) + '\n' + subjectProperty.cadAdj)
        subjectDataRow.push(subjectProperty.cduDesc + '\n' + subjectProperty.cduAdj)
        subjectDataRow.push(subjectProperty.grdDesc + '\n' + subjectProperty.grdAdj)
        subjectDataRow.push(subjectProperty.sqFt)
        subjectDataRow.push(subjectProperty.landValue.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'))
        subjectDataRow.push(subjectProperty.imprvVal.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '\n' + subjectProperty.xFeatures.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'))
        subjectDataRow.push(subjectProperty.marketValue.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'))
    
        subjectData.push(subjectDataRow)

        let compData = [['Account\n----------\nAddress','Neigbr Code', 'Built/Remodel','CAD Desc\n----------\nCAD','CDU Desc\n----------\nCDU','Grade Desc\n----------\nGrade','Imprv $\n----------\nMinus Xtra Feat','Plus CAD $ Adj','Plus CDU $ Adj','Plus Grade $ Adj','Equals Adj Imprv Value', 'Divided By SqFt','Equals Adj $ per SqFt']];

        mapURL += encodeURI('&markers=color:blue|label:C');

        comps.forEach(function(sourceRow) {
            const dataRow = [];
        
            dataRow.push(sourceRow.account + '\n' + sourceRow.address.substr(0,22).split(',',1))
            dataRow.push(sourceRow.hoodCode);
            dataRow.push(sourceRow.yrUpdated);
            dataRow.push(sourceRow.cadDesc.substr(0,13) + '\n' + sourceRow.cadAdj);
            dataRow.push(sourceRow.cduDesc + '\n' + sourceRow.cduAdj);
            dataRow.push(sourceRow.grdDesc + '\n' + sourceRow.grdAdj);
            dataRow.push(sourceRow.imprvVal.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,') + '\n' + sourceRow.xFeatures.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
            dataRow.push(sourceRow.cadAdjust.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
            dataRow.push(sourceRow.cduAdjust.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
            dataRow.push(sourceRow.grdAdjust.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
            dataRow.push(sourceRow.adjImpValue.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'));
            dataRow.push(sourceRow.sqFt);
            dataRow.push(sourceRow.adjSqFtValue.toFixed(2));
            
            compData.push(dataRow);
            
            mapURL += encodeURI('|' + sourceRow.address);
        });

        mapURL += '&key=' + variables.googleKey;
        console.log(mapURL)
        const mapImage = await img2base(mapURL)
        //const mapImage = await i2bPromise(mapURL);

        const docDefinition = {
            info: {
            	title: 'Property Tax Comparable Report',
            	author: 'FIGHT YOUR PROPERTY TAXES LLC',
            	creator: 'FIGHT YOUR PROPERTY TAXES LLC',
            	producer: 'FIGHT YOUR PROPERTY TAXES LLC',
            },
            pagesize: 'LETTER',
            pageOrientation: 'landscape',
            footer: [
                        [{margin: [20,0,0,0], justify: 'right', fontSize: 6, text: 'Report Generated ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').substr(0, 10), style: 'coverPage', marginBottom: 20}]
                    ],
            /************* PAGE 1 - Cover Page ************/
            content: [
                {text: 'Property Tax Comparable Report', style: 'coverPage', fontSize: 20, marginBottom: 10, marginTop: 130},
                {text: subjectProperty.account, style: 'coverPage'},
                {text: subjectProperty.owner, style: 'coverPage'},
                {text: subjectProperty.address, style: 'coverPage', marginBottom: 10},
                {
                    style: 'coverPage',
                    table: {
                        headerRows: 0,
                        widths: ['auto', 'auto'],
                        body: [
                            [{text: 'Year Built / Updated:'}, {text: subjectProperty.yrUpdated}],
                            [{text: 'Cost and Design (CAD):'}, {text: subjectProperty.cadDesc}],
                            [{text: 'Condition, Desirability, and Utility (CDU):'}, {text: subjectProperty.cduDesc}],
                            [{text: 'Grade:'}, {text: subjectProperty.grdDesc}],
                            [{text: 'Appaised Market Value:'}, {text: '$' + subjectProperty.marketValue.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}],
                            [{text: 'Fair Market Value:'}, {text: '$' + subjectPropertyAdjustedPrice.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}]
                        ]
                    },
                    layout: 'noBorders'
                },
            /************ PAGE 2 - U&E Description ***************/
                {text: 'Uniform and Equal Calculations', style: 'uandePage', fontSize: 20, marginBottom: 10, marginTop: 30, alignment: 'center', pageBreak: 'before'},
                {text: 'We are protesting this tax appraisal on the basis of a Uniform and Equal appraisal. We are only debating IMPROVEMENT value per square foot. Land value and extra ' + 
                        'features have been exluded from calculations. Comparable properties are chosen +/- 10% sq ft of the subject, +/- 5 years built/remodeled, in the same neighborhood, with similar ' +
                        'grades, conditions, and desirability as determined by HCAD.', style: 'uandePage'},
                {text: 'We then make adjustments to the comparables against the subject property on 3 factors...', style: 'uandePage'},
                {ul: ['CAD (Cost & Design): This accounts for differences in what is typical for the neighborhood. For example, new remodels or a new home in an older neighborhood, etc. Not all properties will have a CAD value.', 
                        'CDU (Condition, Desirability, and Utility): This is also known as the "Percent Good" factor. It accounts for age and depreciation.',
                        'GRD (Grade): This is a score assigned by the appraisal district to account for the quality of workmanship and materials'], style: 'uandePage'},
                {text: '(((Comp Improvement Value * Comp CAD/CDU/GRD Factor) * Subject CAD/CDU/GRD Factor) - Comp Improvement Value) = CAD/CDU/GRD Adjustment $', style: 'uandePage'},
                {text: 'We make these adjustments to each comparable IMPROVEMENT value and then divide by the sqaure footage to get an adjusted price per sq ft. ' +
                        'We take the MEDIAN adjusted price per sq ft and multiply it by the subject property square footage to get the fair market IMPROVEMENT value. ' +
                        'Finally, we add the land value and any extra features to the fair market improvement value to get an Adjusted Fair Market Value which is what the house should be appraised for ' + 
                        'under the Uniform and Equal law in Section 41.43 of the Texas Property Tax Code.', style: 'uandePage'},
            /************ PAGE 3 - Comps Table ***************/
                {text: 'Subject Property', fontSize: 15, bold: 'true', pageBreak: 'before'},
                {
                    style: 'compTable',
                    table: 
                        {
                            headerRows: 1,
                            widths: [110,30,40,55,40,30,30,35,35,35],
                            body: subjectData
                        },
            			layout: 'headerLineOnly'
                },
                {text: 'vs Comparable Properties', fontSize: 15, bold: 'true'},
                {
                    style: 'compTable',
                    table: 
                        {
                            headerRows: 1,
                            widths: [110,30,40,55,40,30,35,35,35,35,35,30,30],
                            body: compData
                        },
                        layout: 'lightHorizontalLines',
                },
                {
                    style: 'summaryTable',
                    table: {
                        headerRows: 0,
                        widths: ['auto', 10, 'auto'],
                        body: [
                            [{text: 'Median Price Per Sq Ft:'}, {text: '$'}, {text: compAvgSqFtPrice.toFixed(2)}],
                            [{text: 'Subject Imprv Value @ Median: '}, {text: '$'}, {text: (subjectProperty.sqFt * compAvgSqFtPrice).toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}],
                            [{text: '+ Extra Features: '}, {text: '$'}, {text: subjectProperty.xFeatures.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}],
                            [{text: '+ Land Value: ', border: [false, false, false, true]}, {text: '$', border: [false, false, false, true]}, {text: subjectProperty.landValue.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,'), border: [false, false, false, true]}],
                            [{text: '= Adjusted Market Value: '}, {text: '$'}, {text: subjectPropertyAdjustedPrice.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')}]
                        ]
                    },
                    layout: {
                        defaultBorder: false
                    }
                },
            /************ PAGE 4 - Google Map ***************/
                {text: 'Map View', fontSize: 20, marginBottom: 10, marginTop: 30, alignment: 'center', pageBreak: 'before'},
                {image: mapImage,  width: 765},
            /************ STYLES ***************/
            ],
            styles: {
                coverPage: {
                    margin: [230, 0, 0, 0]
                },
                uandePage: {
                    margin: [100, 10, 100, 0],
                    fontSize: 12
                },
                compTable: {
                    margin: [0, 10, 0, 10],
                    fontSize : 8,
                    alignment: 'right'
                },
                summaryTable: {
                    margin: [500, 0, 0, 0],
                    alignment: 'right',
                    fontSize: 10
                }
            }
        }

        pdfMake.createPdf(docDefinition).open()
    }

    const propertySearch = async(address) => {
        searchResults = await database.getAccountId(address)
    }

    const getCompReport = async(account) => {
        const { subjectProperty, comps } = await database.getComps(account)
        createPdfReport(subjectProperty, comps)
    }
</script>

<h1>Protest Your Property Taxes</h1>
<form on:submit|preventDefault="{propertySearch(searchAddress)}">
    <input type="textbox" placeholder="Enter Property Address" bind:value={searchAddress}>
    <button type="submit" on:click="{propertySearch(searchAddress)}">Search</button>
</form>
<br />
{#each searchResults as property }
    <p>{property.owner} - {property.addr1}, {property.addr2}, {property.addr3}</p>
    <button on:click={getCompReport(property.account)}>Get Report</button>
{/each}

<style lang="scss">

</style>
