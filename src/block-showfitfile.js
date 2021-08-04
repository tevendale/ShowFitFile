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
const { ServerSideRender } = wp.editor;

registerBlockType('yft/showfitfileheader', {
	title: 'Header',
	textdomain: "yft"
	}),
 
 
registerBlockType('yft/showfitfile', {
	// Your block configuration and code here
	// TODO: Set Icon to map
	// TODO: Set description, category and keywords
	// TODO: Tidy up the actual attributes we need
	title: 'Show Fit File',
	icon: 'location-alt',
	category: 'common',
	description: 'Display Garmin data on a map',
	keywords: ['Garmin', 'Map', 'Route', 'Fit file'],
	textdomain: "yft",
	attributes: {
		mediaUrl: {
			type: 'string',
			default: 'http://placehold.it/500'
		},
		fileName: {
			type: 'string',
			default: ''
		},
		toggle: {
			type: 'boolean',
			default: false
		},
		showSummary: {
			type: 'boolean',
			default: true
		},
		units: {
			type: 'string',
			default: 'metric'
		},
		lineColour: {
			type: 'string',
			default: 'red'
		}
	},
	edit: (props) => { 
		const { attributes, setAttributes } = props;
// 		console.log(props);
		
		function selectImage(value) {
// 			console.log('Value = ' + value);
			console.log(value);
// 			filename = url.substring(value.url.lastIndexOf('/')+1);
// 			console.log('Filename = ' + filename);
			// We need to save the file name here
			setAttributes({
				mediaUrl: value.url,
				fileName: value.filename,
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
							<ToggleControl
								label="Show session summary"
								checked={attributes.showSummary}
								onChange={(newval) => setAttributes({ showSummary: newval })}
							/>
					</PanelRow>										
					<PanelRow>
							<SelectControl
								label="Units"
								value={attributes.units}
								options={[
									{label: "Imperial", value: 'imperial'},
									{label: "Metric", value: 'metric'},
								]}
								onChange={(newval) => setAttributes({ units: newval })}
							/>
					</PanelRow>
					<PanelRow>
						<ColorPicker
							color={attributes.lineColour}
							onChangeComplete={(newval) => setAttributes({ lineColour: newval.hex })}
							// disableAlpha
						/>
					</PanelRow>
					</PanelBody>
			</InspectorControls>
			
			<ServerSideRender
				block = "yft/showfitfileheader"
				attributes={{ 
					fileName: attributes.fileName, 
					toggle: attributes.toggle, 
					units: attributes.units, 
					lineColour: attributes.lineColour,
					showSummary: attributes.showSummary
				}}
			/>
			<MediaUpload
				onSelect={selectImage}
                render={ ({open}) => {
                    return <img 
                        src={js_data.my_image_url}
                        onClick={open}
                        />;
                }}				
			/>
			
			<MediaUpload 
				onSelect={selectImage}
				render={ ({open}) => {
					return (
						<Button onClick={open} variant='primary'>Click to select .fit file to show </Button>
					);
				}}
			/>

			</div> 
		);
	},
	save: (props) => { return null }	
});