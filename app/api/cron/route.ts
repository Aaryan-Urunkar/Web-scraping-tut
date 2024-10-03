import Product from "@lib/models/product.model";
import { generateEmailBody, sendEmail } from "@lib/nodemailer";
import { scrapeAmazonProduct } from "@lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(){
    try {
        const products = await Product.find({});

        const updatedProducts = await Promise.all(
            products.map(async(currentProduct) =>{
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
            
                if(!scrapedProduct) throw new Error("No product found");

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    {price : scrapedProduct.currentPrice}
                ]

                const product = {
                    ...scrapedProduct,
                    priceHistory : updatedPriceHistory,
                    lowestPrice : getLowestPrice(updatedPriceHistory),
                    highestPrice : getHighestPrice(updatedPriceHistory),
                    avergaePrice : getAveragePrice(updatedPriceHistory),
                }

                const updatedProduct = await Product.findOneAndUpdate(
                    {url:product.url},
                    product,
                    {upsert:true , new :true}
                )
                
                //CHECK EACH PRODUCT'S STATUS AND SEND EMAIL ACCORDINGLY
                const emailNotifType = getEmailNotifType(scrapedProduct,
                    currentProduct
                )
                
                if(emailNotifType && updatedProduct.users.length > 0){
                    const productInfo = {
                        title : updatedProduct.title,
                        url : updatedProduct.url
                    }

                    const emailContent = await generateEmailBody(productInfo , emailNotifType);

                    const userEmails = updatedProduct.users.map((user : any) => {
                        return user.email
                    })

                    await sendEmail(emailContent , userEmails);
                }

                return updatedProduct;
            })
        )

        return NextResponse.json({
            message:"OK" , data : updatedProducts
        })
    } catch (error) {
        throw new Error(`Error in GET : ${error}`);
    }
}