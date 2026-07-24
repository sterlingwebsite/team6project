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
}

export function generateTempleSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "-");
}

export function getTempleImageUrl(slug: string): string {
  return `https://churchofjesuschrist.org{slug}/${slug}-main.jpg`;
}
