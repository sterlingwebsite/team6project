// utils/templeHelpers.ts

export interface ITemple {
  _id?: string;
  slug: string;
  name: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string;
  state: string | null;
  country: string;
  phone: string | null;
  image: {
    full: string;
    thumb: string;
    caption?: string;
    credit?: string;
    subject?: string;
    type?: string;
  };
}


export function generateTempleSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "-");
}
