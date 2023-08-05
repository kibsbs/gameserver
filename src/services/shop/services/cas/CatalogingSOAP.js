const mgmt = require("mgmt");

const getThumbnailUrl = (song) => {
  return (song.cover && song.cover.data)
    ? mgmt.url + song.cover.data.attributes.url
    : "https://wii-ssl-static.ubi.com/JD2015/WII/cover/DontYouWorryDLC_Cover_WII.jpg";
};

const getVideoPreviewUrl = (song) => {
  return (song.videoPreview && song.videoPreview.data)
    ? mgmt.url + song.videoPreview.data.attributes.url
    : "https://wii-ssl-static.ubi.com/JD2015/WII/previewvideo/DontYouWorryDLC_Preview_Shop_128.webm";
};

const getAvatarPreviewUrl = (song) => {
  return (song.avatarPreview && song.avatarPreview.data)
    ? mgmt.url + song.avatarPreview.data.attributes.url
    : "https://wii-ssl-static.ubi.com/JD2015/WII/cover/DontYouWorryDLC_Avatars_Shop_WII.png";
};

const buildSongsJD2015 = (mgmtSongs, titleId) => {
  const songs = [];

  for (let i = 0; i < mgmtSongs.length; i++) {
    const song = mgmtSongs[i].attributes;
    const newSince = song.publishedAt || song.createdAt;

    songs.push({
      TitleId: titleId,
      Contents: {
        TitleIncluded: true,
        ContentIndex: i + 1
      },
      Attributes: [
        { Name: "TitleVersion", Value: song.titleVersion },
        { Name: "NewSince", Value: Date.parse(newSince) },
        { Name: "badge", Value: song.badge },
        { Name: "avatarcount", Value: song.avatarCount || 0 },
        { Name: "thumbnail", Value: getThumbnailUrl(song) },
        { Name: "artist", Value: song.artist },
        { Name: "videopreview", Value: getVideoPreviewUrl(song) },
        { Name: "name", Value: song.title },
        { Name: "avatarpreview", Value: getAvatarPreviewUrl(song) },
        { Name: "song_order", Value: i },
        { Name: "longdesc", Value: song.credits }
      ]
    });
  }

  return songs;
};

const buildSongsJD3 = (mgmtSongs, titleId) => {
  const songs = [];

  for (let i = 0; i < mgmtSongs.length; i++) {
    const song = mgmtSongs[i].attributes;
    const newSince = song.publishedAt || song.createdAt;

    songs.push({
      TitleId: titleId,
      Contents: {
        TitleIncluded: true,
        ContentIndex: i + 1
      },
      Attributes: [
        { Name: "TitleVersion", Value: song.titleVersion },
        { Name: "NewSince", Value: Date.parse(newSince) },
        { Name: "badge", Value: song.badge },
        { Name: "avatarcount", Value: song.avatarCount || 0 },
        { Name: "thumbnail", Value: getThumbnailUrl(song) },
        { Name: "artist", Value: song.artist },
        { Name: "videopreview", Value: getVideoPreviewUrl(song) },
        { Name: "name", Value: song.title },
        { Name: "avatarpreview", Value: getAvatarPreviewUrl(song) },
        { Name: "song_order", Value: i },
        { Name: "longdesc", Value: song.credits },
        { Name: "duration", Value: 200 },
        { Name: "rating PEGI", Value: "2" },
        { Name: "soloduo", Value: "solo" },
        { Name: "shortdesc", Value: "shoreetdesc" },
        { Name: "difficulty", Value: 1 },
        { Name: "sweat", Value: 1 },
        { Name: "featured", Value: 1 },
        { Name: "popular", Value: 1 },
        { Name: "news", Value: 1 },
        { Name: "dlc_type", Value: 1 },
        { Name: "dlc_flags", Value: 0 },
        { Name: "high_light", Value: 1 },
        { Name: "prio_en", Value: "2" },
        { Name: "prio_es", Value: "2" },
        { Name: "prio_it", Value: "2" },
        { Name: "prio_du", Value: "2" },
        { Name: "prio_fr", Value: "2" },
        { Name: "prio_ge", Value: "2" },
        { Name: "Prices", Value: [
            { Name: "prio_en", Value: "2" },
            { Name: "prio_es", Value: "2" },
            { Name: "prio_it", Value: "2" },
            { Name: "prio_du", Value: "2" },
            { Name: "prio_fr", Value: "2" },
            { Name: "prio_ge", Value: "2" },
          ] 
        },
        { Name: "BestBuy", Value: 1 },
        { Name: "Target", Value: 1 },
        { Name: "SpecialEdition", Value: 1 },
      ]
    });
  }

  return songs;
};

const buildSongsJD2 = (mgmtSongs, titleId) => {
  const songs = [];

  for (let i = 0; i < mgmtSongs.length; i++) {
    const song = mgmtSongs[i].attributes;
    const newSince = song.publishedAt || song.createdAt;

    songs.push({
      TitleId: titleId,
      Contents: {
        TitleIncluded: true,
        ContentIndex: i + 1
      },
      Attributes: [
        { Name: "name", Value: song.title },
        { Name: "artist", Value: song.artist },
        { Name: "category", Value: 1 },
        { Name: "duration", Value: 200 },
        { Name: "rating PEGI", Value: "PEGI_Age" },
        { Name: "soloduo", Value: "solo" },
        { Name: "shortdesc", Value: "shoreetdesc" },
        { Name: "longdesc", Value: song.credits },
        { Name: "NewSince", Value: Date.parse(newSince) },
        { Name: "thumbnail", Value: getThumbnailUrl(song) },
        { Name: "videopreview", Value: getVideoPreviewUrl(song) },
        { Name: "difficulty", Value: 1 },
        { Name: "sweat", Value: 1 },
        { Name: "featured", Value: false },
        { Name: "popular", Value: true },
        { Name: "news", Value: false },
        { Name: "TitleVersion", Value: 333342312 ||song.titleVersion },
        { Name:  "Prices", Value: 10304033 },
      ]
    });
  }

  return songs;
};


const buildSongsJD5 = (mgmtSongs, titleId) => {
  const songs = [];

  for (let i = 0; i < mgmtSongs.length; i++) {
    const song = mgmtSongs[i].attributes;
    const newSince = song.publishedAt || song.createdAt;

    songs.push({
      TitleId: titleId,
      Contents: {
        TitleIncluded: true,
        ContentIndex: i + 1
      },
      Attributes: [
        { Name: "TitleVersion", Value: 0 ||song.titleVersion },
        { Name: "map_name", Value: song.mapName },
        { Name: "name", Value: song.title },
        { Name: "artist", Value: song.artist },
        { Name: "thumbnail", Value: getThumbnailUrl(song) },
        { Name: "videopreview", Value: getVideoPreviewUrl(song) },
        { Name: "avatarpreview", Value: getAvatarPreviewUrl(song) },
        { Name: "avatarcount", Value: song.avatarCount || 0 },
        { Name: "badge", Value: 1 ||song.badge },
        { Name: "song_order", Value: i },
        { Name: "NewSince", Value: Date.parse(newSince) },
        { Name: "longdesc", Value: song.credits },
        { Name: "duration", Value: 1 },
        { Name: "soloduo", Value: 1 },
        { Name: "shortdesc", Value: "shortdesc" },
        { Name: "difficulty", Value: 1 },
        { Name: "sweat", Value: 2 },
        { Name: "featured", Value: 1 },
        { Name: "dlc_type", Value: 1 },
        { Name: "dlc_flags", Value: 0 },
        { Name: "high_light", Value: 1 },
        { Name: "prio_en", Value: "2" },
        { Name: "prio_es", Value: "2" },
        { Name: "prio_it", Value: "2" },
        { Name: "prio_du", Value: "2" },
        { Name: "prio_fr", Value: "2" },
        { Name: "prio_ge", Value: "2" },
        { Name: "Prices", Value: [
            { Name: "prio_en", Value: "2" },
            { Name: "prio_es", Value: "2" },
            { Name: "prio_it", Value: "2" },
            { Name: "prio_du", Value: "2" },
            { Name: "prio_fr", Value: "2" },
            { Name: "prio_ge", Value: "2" },
          ] 
        },
        { Name: "BestBuy", Value: 1 },
        { Name: "Target", Value: 1 },
        { Name: "SpecialEdition", Value: 1 },
      ]
    });
  }

  return songs;
};

module.exports = async (req, res, next) => {
  const action = req.action;
  const body = req.body;

  let actionResponse;

  console.log(body)

  switch (action) {
    case "ListContentSetsEx":
      try {
        const applicationId = body.ApplicationId;
        const titleId = body.TitleId;
        const mgmtSongs = await mgmt.getShopSongs();
        
        let finalSongs;

        switch(titleId) {
          // 2015
          case "0001000573453345":
            finalSongs = buildSongsJD2015(mgmtSongs, titleId);
            break;
          // 2014
          case "00010005734A4F45":
            finalSongs = buildSongsJD5(mgmtSongs, titleId);
            break;
          // JD3
          case "0001000573443245":
            finalSongs = buildSongsJD2(mgmtSongs, titleId);
            break;
          // JD3
          case "00010005734A4450":
            finalSongs = buildSongsJD3(mgmtSongs, titleId);
            break;
          default:
            return next({
              status: 401,
              message: titleId + " is not allowed!"
            });
        };

        const slicedSongs = finalSongs.slice(body.ListResultOffset, body.ListResultLimit);

        actionResponse = {
          ListResultTotalSize: finalSongs.length,
          Contents: slicedSongs
        };
      } catch (error) {
        global.logger.error("[CAS - CatalogingSOAP] Error: " + error);
        return res.status(500).send();
      }
      break;
    default:
      global.logger.warn("[CAS - CatalogingSOAP] Unknown SOAP action " + action);
      break;
  }

  if (actionResponse) return res.soap(actionResponse);
  else return res.status(404).send();
};
