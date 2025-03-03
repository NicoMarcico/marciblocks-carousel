import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

import "./style.scss";

import Edit from "./edit";
import save from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	title: __("Carousel", "marciblocks-carousel"),
	description: __(
		"Carousel of images with thumbnails.",
		"marciblocks-carousel",
	),
	keywords: __("Carousel, Images, Gallery", "marciblocks-carousel"),
	edit: Edit,
	save,
});
