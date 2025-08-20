// import { createHmac } from "crypto";
// import { type VKontakteUserData } from "@/pkg/models";
//
// function verifyLaunchParams(searchOrParsedUrlQuery: string, secretKey: string) {
//   try {
//     let sign;
//     const queryParams: Record<string, string>[] = [];
//
//     const processQueryParam = (key: string, value: string) => {
//       if (key === "sign") {
//         sign = value;
//       } else if (key.startsWith("vk_")) {
//         queryParams.push({ key, value });
//       }
//     };
//
//     const formattedSearch = searchOrParsedUrlQuery.startsWith("?")
//       ? searchOrParsedUrlQuery.slice(1)
//       : searchOrParsedUrlQuery;
//
//     for (const param of formattedSearch.split("&")) {
//       const [key, value] = param.split("=");
//       processQueryParam(key, value);
//     }
//
//     if (!sign || queryParams.length === 0) {
//       return false;
//     }
//     const queryString = queryParams
//       .sort((a, b) => a.key.localeCompare(b.key))
//       .reduce((acc, { key, value }, idx) => {
//         return acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`;
//       }, "");
//
//     const paramsHash = createHmac("sha256", secretKey)
//       .update(queryString)
//       .digest()
//       .toString("base64")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=$/, "");
//
//     if (paramsHash === sign) {
//       const result: Partial<VKontakteUserData> = {};
//
//       for (let i = 0; i <= queryParams.length; i++) {
//         const r = queryParams[i];
//         if (r?.key && r?.value) {
//           const { key, value } = r;
//           (result as any)[key] = isNaN(+value) ? value : +value;
//         }
//       }
//
//       return result as VKontakteUserData;
//     }
//   } catch (e) {
//     return;
//   }
// }
//
// export default verifyLaunchParams;
