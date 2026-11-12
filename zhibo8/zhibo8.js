// Quantumult X response rewrite for Zhibo8
const url = $request.url;
try {
  const data = JSON.parse($response.body);
  if (/^https:\/\/headline\.qiumibao\.com\/recommend\/list\?/i.test(url)) {
    if (Array.isArray(data.news)) data.news = data.news.filter(x => x && (x.model === "news" || x.model === "video"));
  } else if (/^https:\/\/a\.qiumibao\.com\/found\/\?/i.test(url)) {
    if (Array.isArray(data)) data.splice(0, data.length, ...data.filter(x => x && x.is_game !== true));
  } else if (/^https:\/\/a\.qiumibao\.com\/ios\/config\/\?/i.test(url)) {
    for (const key of ["skin","advert","advert_config","mall","httpdns","reward","pgame","corner_mark","liveshop","theme","pop","live_activity_push"]) delete data[key];
    const labels = data.all_sections && data.all_sections.match_sections && data.all_sections.match_sections.labels;
    if (labels && typeof labels === "object") {
      for (const key of ["blacks_disable","show"]) {
        if (Array.isArray(labels[key])) labels[key] = labels[key].filter(x => x !== "游戏");
      }
    }
  } else if (/^https:\/\/guess\.qiumibao\.com\/api\/(?:n\/rcd|c\/menu)$/i.test(url)) {
    if (data.data && typeof data.data === "object") delete data.data.banner;
  } else if (/^https:\/\/pre-match\.qiumibao\.com\/pre_match_data\/v\d\/\d+-\d+-\d+\/\d+_fund\.htm\?/i.test(url)) {
    if (Array.isArray(data.data)) data.data = data.data.filter(x => !(x && x.type === "guide"));
  } else if (/^https:\/\/s\.qiumibao\.com\/m\/ios\/json\/zhibo\/zuqiu\/\d+\/match\d+vl\.htm\?/i.test(url)) {
    delete data.ep_v2;
    delete data.ep_live;
  }
  $done({body: JSON.stringify(data)});
} catch (e) {
  console.log("Zhibo8 rewrite skipped: " + e);
  $done({});
}