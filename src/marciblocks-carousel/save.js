import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save() {
	const blockProps = useBlockProps.save();

	/**
	 * Here we only save inner blocks
	 * The front is rendered dynamically in PHP
	 */

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}
