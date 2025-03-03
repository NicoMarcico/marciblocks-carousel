import { useBlockProps } from "@wordpress/block-editor";

export default function save(props) {
	const { pictureId, pictureUrl, pictureAlt } = props.attributes;

	const blockProps = useBlockProps.save();

	return (
		pictureId && (
			<div {...blockProps}>
				<img src={pictureUrl} alt={pictureAlt} />
			</div>
		)
	);
}
