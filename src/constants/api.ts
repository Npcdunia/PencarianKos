export const OVERPASS_URL = "https://overpass.private.coffee/api/interpreter";


const AREA = "-8.03,112.57,-7.90,112.69";


const QUERY = `
[out:json][timeout:25];
(
  nwr["tourism"~"guest_house|hostel"]["name"](${AREA});
  nwr["building"="dormitory"]["name"](${AREA});
  nwr["name"~"^(kos|kost) ",i](${AREA});
);
out center tags 20;
`;


export const KOS_API_URL = `${OVERPASS_URL}?data=${encodeURIComponent(QUERY)}`;