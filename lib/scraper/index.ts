import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url : string){
    if (!url) {
        return;
    }

    //BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    
    const options = {
        auth : {
            username : `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized:false,
    }

    try{
        //Fetch the product page
        const response = await axios.get(url , options);
        // console.log(response.data);
        
        const $ = cheerio.load(response.data);

        const title = $("#productTitle").text().trim();
        const currentPrice = extractPrice(
            $(".priceToPay span.a-price-whole"),
            $("a.size.base.a-color-price"),
            $(".a-button-selected .a-color-base")
        );

        const originalPrice = extractPrice(
            $("#priceblock_ourprice"),
            $(".a-price.a-text-price span.a-offscreen"),
            $("#listPrice"),
            $("#priceblock_dealprice"),

        )

        const outOfStock = $("#availability span").text().trim().toLowerCase() === "currently unavailable";
        const imgs = $("#imgBlkFront").attr("data-a-dynamic-image") || 
        $("#landingImage").attr("data-a-dynamic-image") || "{}";

        const imgUrls = Object.keys(JSON.parse(imgs))
        const currency = extractCurrency($(".a-price-symbol"));
        const discountRate = $(".savingsPercentage").text().replace(/[-%]/g,"");

        const description = extractDescription($);

        //console.log(title , currentPrice , originalPrice, outOfStock, imgUrls, currency , discountRate);
        
        const data = {
            url,
            currency:currency || "INR",
            image: imgUrls[0],
            title,
            currentPrice:Number(currentPrice) || Number(originalPrice),
            originalPrice:Number(originalPrice) || Number(currentPrice),
            discountRate:Number(discountRate),
            priceHistory:[],
            stars: 0,
            category : "category",
            reviewsCount:100,
            isOutOfStock : outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice)
        }
        //console.log(data);
        return data;
        
    }catch(e: any){
        throw new Error(`Failed to scrape product : ${e.message}`)
    }
}