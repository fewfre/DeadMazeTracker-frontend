export enum ZoneId {
	SacramentoSuburbs = 1,
	BodegaBay = 2,
	SantaRosa = 3,
	College = 4,
	Mall = 5,
	WalkerRiver = 6,
	Museum = 7,
	Highway99 = 8,
	BlueMesa = 9
}

interface ZoneInfo {
	name: string;
	nameShort: string;
	icon: string;
}
export const zoneTypeMap:Record<ZoneId, ZoneInfo> = {
	[ZoneId.SacramentoSuburbs]: { name: "Sacramento Suburbs", nameShort: "Sacramento", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/4/47/Sacramento_Suburbs_icon.png" },
	[ZoneId.BodegaBay]: { name: "Bodega Bay", nameShort: "Bodega Bay", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/b/b5/Bodega_Bay_icon.png" },
	[ZoneId.SantaRosa]: { name: "Santa Rosa", nameShort: "Santa Rosa", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/d/d7/Downtown_Santa_Rosa_icon.png" },
	[ZoneId.College]: { name: "Mazon College", nameShort: "College", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/c/c0/Mazon_College_icon.png" },
	[ZoneId.Mall]: { name: "Sunset Mall", nameShort: "Sunset Mall", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/a/a6/Sunset_Mall_icon.png" },
	[ZoneId.WalkerRiver]: { name: "Walker River", nameShort: "Walker River", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/a/a0/Walker_River_icon.png" },
	[ZoneId.Museum]: { name: "Jurassic Museum", nameShort: "Museum", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/7/77/Arizona_Jurassic_Museum_icon.png" },
	[ZoneId.Highway99]: { name: "Highway 99", nameShort: "Highway 99", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/c/c0/South_Fallon_icon.png" },
	[ZoneId.BlueMesa]: { name: "Blue Mesa", nameShort: "Blue Mesa", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/d/d5/Blue_Mesa_icon.png" }
};