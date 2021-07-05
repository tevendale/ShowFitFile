// Inspector Controls
// Colour - color picker
// Can Zoom - toggle
// Units - popu for Imperial/Metric



const { registerBlockType } = wp.blocks;
// const { RichText } = wp.blocks;
const { TextControl, PanelBody, PanelRow, ToggleControl, SelectControl, ColorPicker, Text, Button, FormFileUpload } = wp.components;
const { MediaUpload, InspectorControls } = wp.editor;
const { Fragment } = wp.element;
const { MediaUploadCheck } = wp.blockEditor;


const BlockEdit = (props) => {
	const { attributes, setAttributes } = props;
 
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={__('Select block background image', 'awp')}
					initialOpen={ true }
				>
					<div className="editor-post-featured-image">
						...We will add code here...
					</div>
				</PanelBody>
			</InspectorControls>
			<div>
				... Your block content here...
			</div>
		</Fragment>
	);
};

 
registerBlockType('yft/showfitfile', {
	// Your block configuration and code here
	title: 'Show Fit File',
	icon: 'smiley',
	category: 'common',
	description: 'Project in progress',
	keywords: ['test', 'exanple'],
	attributes: {
		mediaId: {
			type: 'number',
			default: 0
		},
		imgUrl: {
			type: 'string',
			default: 'http://placehold.it/500'
		},
		mediaUrl: {
			type: 'string',
			default: 'http://placehold.it/500'
		},

		bgImageId: {
			type: 'number',
			default: 0
		},

		exampleText: {
			type: 'string',
			default: ''
		},
		toggle: {
			type: 'boolean',
			default: true
		},
		postIds: {
			type: 'array',
			default: []
		}
	},
	edit: (props) => { 
		const { attributes, setAttributes } = props;
		console.log(props);
		
		function selectImage(value) {
			console.log('Value = ' + value);
			setAttributes({
				mediaUrl: value.url,
			});
		}
		
		return (
			<div>
			<InspectorControls>
					<PanelBody
						title="Map Settings"
						initialOpen={true}
					>
					<PanelRow>
							<ToggleControl
								label="Interactive"
								checked={attributes.toggle}
								onChange={(newval) => setAttributes({ toggle: newval })}
							/>
					</PanelRow>
					<PanelRow>
							<SelectControl
								label="Units"
								value={attributes.favoriteAnimal}
								options={[
									{label: "Imperial", value: 'imperial'},
									{label: "Metric", value: 'metric'},
								]}
								onChange={(newval) => setAttributes({ favoriteAnimal: newval })}
							/>
					</PanelRow>
					<PanelRow>
						<ColorPicker
							color={attributes.favoriteColor}
							onChangeComplete={(newval) => setAttributes({ favoriteColor: newval.hex })}
							disableAlpha
						/>
					</PanelRow>
					</PanelBody>
			</InspectorControls>

				Text Input:
				<TextControl 
					value={attributes.exampleText}
					onChange={(newtext) => setAttributes({ exampleText: newtext })}
				/>
				<MediaUpload 
					onSelect={selectImage}
					render={ ({open}) => {
						return (
							<button onClick={open}>
								<img 
									src={attributes.mediaUrl}
									/>
							</button>
						);
					}}
				/>
			</div> 
		);
	},
	save: (props) => { 
		const { attributes } = props;
		return <div>{attributes.mediaUrl}<img src={attributes.mediaUrl} /></div> 
	}	
});