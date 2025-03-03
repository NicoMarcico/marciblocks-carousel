import { useBlockProps } from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";

import "./editor.scss";

import Toolbar from "./toolbar";
import Inspector from "./inspector";
import Block from "./block";

export default function Edit(props) {
	const blockProps = useBlockProps();
	const { attributes, setAttributes, isSelected, clientId } = props;
	const {
		imagesIds,
		images,
		imageFit,
		isCaption,
		isDescription,
		isRadius,
		radius,
		aspectRatio,
		highlightColor,
		backgroundColor,
		captionColor,
		descriptionColor,
		carouselNumber,
	} = attributes;

	/**
	 * Multiple images selection in media modal set as inner images blocks
	 *
	 * @param {*} pictures
	 * @returns
	 */
	const onSelectImages = (pictures) => {
		if (!pictures || !pictures.length) return;

		// Map pictures items to inner blocks carousel-item
		const newInnerBlocks = pictures.map((picture) => {
			const imageUrl = picture.sizes?.medium?.url || picture.url;

			return wp.blocks.createBlock("marciblocks/carousel-item", {
				pictureUrl: imageUrl,
				pictureAlt: picture.alt,
				pictureId: picture.id,
			});
		});

		// Insert images as inner blocks
		wp.data
			.dispatch("core/block-editor")
			.replaceInnerBlocks(
				wp.data.select("core/block-editor").getSelectedBlockClientId(),
				newInnerBlocks,
			);
	};

	return (
		<Fragment>
			<Toolbar // Render of block toolbar
				{...{
					imagesIds,
					onSelectImages,
				}}
			/>
			<Inspector // Render of edit panel
				{...{
					imageFit,
					isCaption,
					isDescription,
					isRadius,
					radius,
					aspectRatio,
					highlightColor,
					backgroundColor,
					captionColor,
					descriptionColor,
					setAttributes,
				}}
			/>

			<Block // Render of block itself
				{...{
					imagesIds,
					images,
					imageFit,
					isCaption,
					isRadius,
					radius,
					aspectRatio,
					highlightColor,
					backgroundColor,
					captionColor,
					descriptionColor,
					isDescription,
					carouselNumber,
					setAttributes,
					onSelectImages,
					isSelected,
					clientId,
					blockProps,
				}}
			/>
		</Fragment>
	);
}
