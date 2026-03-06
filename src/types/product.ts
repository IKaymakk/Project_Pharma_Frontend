export interface Product {
    Id: number;
    BrandName: string;
    GenericName: string;
    Specification: string;
    ImageUrl?: string;
    CategoryId: number;
    CategoryName: string;
    DosageFormId?: number;
    DosageFormName?: string;
    Indication: string;
    Description: string;
}

export interface CreateProductDto {
    categoryId: number;
    dosageFormId?: number;
    brandName: string;
    genericName: string;
    specification: string;
    imageUrl?: string;
    indication: string;
    description: string;
    languageCode: string;
}