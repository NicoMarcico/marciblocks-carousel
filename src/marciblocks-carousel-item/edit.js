import { useBlockProps } from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";

import Toolbar from "./toolbar";
import Block from "./block";

export default function Edit(props) {
	const blockProps = useBlockProps();

	const { attributes, setAttributes, isSelected } = props;
	const { pictureId, pictureUrl, pictureAlt } = attributes;

	/**
	 * Set image attributes when picture selected
	 * Selection done via media modal
	 *
	 * @param {*} picture picture meta
	 */
	const onSelectImage = (picture) => {
		if (!picture) return;
		const imageUrl = picture.sizes?.medium?.url || picture.url;

		setAttributes({
			pictureId: picture.id,
			pictureUrl: imageUrl,
			pictureAlt: picture.alt,
		});
	};

	return (
		<Fragment>
			<Toolbar // Render of block toolbar && change media modal
				{...{
					pictureId,
					onSelectImage,
				}}
			/>

			<Block // Render of block itself && set media modal
				{...{
					attributes,
					setAttributes,
					onSelectImage,
					isSelected,
					blockProps,
				}}
			/>
		</Fragment>
	);
}
