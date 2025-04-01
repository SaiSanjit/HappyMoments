interface Vendor {
    id:number;
    name:string;
    category: Array<string>;
    subcategory?:string;
    location:string;
    rating:number;
    reviews:number;
    image:string;
    featured:boolean;
    price?:PricingCategory;
    Videos?:[];
    description?:string;
}


export enum PricingCategory {
    basic= "Basic" , standard ="Standard", premium = "Premium"
}

export default Vendor;