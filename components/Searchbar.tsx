"use client";

import { scrapeAndStoreProduct } from '@lib/actions';
import {FormEvent, useState} from 'react';

const isValidAmazonProductURL = (url:string) =>{
  try{
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    if(hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.endsWith("amazon")){
      return true;
    }
  }catch(e){
    return false;
  }
}

const Searchbar = () => {

  const [searchPrompt , setSearchPrompt] = useState("");
  const [isLoading , setIsLoading] = useState(false);

  const handleSubmit = async(event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);
    //alert(isValidLink? "Valid link" : "Invalid link");
    if(!isValidLink){
      return alert("Please provide a valid Amazon link");
    }

    try{
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch(e){
      console.log(e);
      
    } finally{
      setIsLoading(false);
    }
  }


  return (
   <form 
   className='flex flex-wrap gap-r mt-12'
   onSubmit={handleSubmit}
   >
    <input 
    type="text" 
    placeholder='Enter product link..'
    className='searchbar-input'
    onChange={(e) => setSearchPrompt(e.target.value)}
    />
    <button 
    type='submit' 
    disabled={searchPrompt === ""}
    className='searchbar-btn'
    >
        {isLoading ? "Searching..." : "Search"}
    </button>
   </form>
  )
}

export default Searchbar