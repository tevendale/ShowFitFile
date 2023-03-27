// FontAwesome for Sport icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown} from '@fortawesome/free-solid-svg-icons';

import React, { useEffect, useState } from 'react';


	export const SessionTable = ( { time, duration, distance, show, units, ascent, descent, showMovingTime, setAttributes } ) => {
		// Build the distance String in selected units
		const distString = buildDistanceString( distance, units );
		const ascentString = buildAscentString( ascent, units);
		const descentString = buildDescentString( descent, units);

		useEffect( () => {
			setAttributes( { distanceString: distString } );
			setAttributes( { ascentString: ascentString } );
			setAttributes( { descentString: descentString } );
		} );

		if ( show ) {
			var durationLabel = "Duration:";
			if (showMovingTime) {
				durationLabel = "Moving Time:";
			}
			let timeCell;
			if (time != "") {
				timeCell = <td className='sff_dataCell'><div className='sff_dataTitle'>Time:</div><div className='sff_dataItem'> { time }</div></td>;
			}
			let durationCell;
			if (duration != "") {
				durationCell = <td className='sff_dataCell'><div className='sff_dataTitle'>{ durationLabel }</div><div className='sff_dataItem'> { duration }</div></td>;
			}
			
			return (
				<table className="sff_dataTable">
					<tbody>
						<tr>
							{timeCell}
							{durationCell}
							<td className="sff_dataCell">
								<div className="sff_dataTitle">Ascent/Descent:</div>
								<div className="sff_dataItem"> <FontAwesomeIcon className="sff_trend" icon={ faArrowTrendUp } /> {ascentString} / <FontAwesomeIcon className="sff_trend" icon={ faArrowTrendDown } /> { descentString} </div>
							</td>
							<td
								style={ { width: '18%' } }
								className="sff_dataCell"
							>
								<div className="sff_dataTitle">Distance:</div>
								<div className="sff_dataItem"> { distString } </div>
							</td>
						</tr>
					</tbody>
				</table>
			);
		}
		return null;
	};



	const buildDistanceString = ( distanceMetres, units ) => {
		let distString = '--';

		// If distance is 0 (i.e. before a .fit file is loaded), then just show '--'
		if ( distanceMetres > 0 ) {
			if ( units === 'metric' ) {
				// Fix distance to 2 significant digits
				distString =
					( distanceMetres / 1000.0 ).toFixed( 2 ).toString() + ' km';
			} else {
				distString =
					( distanceMetres / 1609.34 ).toFixed( 2 ).toString() + ' M';
			}
		}
		return distString;
	};

	const buildAscentString = ( ascent, units ) => {
		return buildAscentDescentString(ascent, units);
	};

	const buildDescentString = ( decent, units ) => {
		return buildAscentDescentString(decent, units);
	};


	const buildAscentDescentString = ( distance, units ) => {
		let distanceString = '--';

		// If distance is 0 (i.e. before a .fit file is loaded), then just show '--'
		if ( distance > 0 ) {
			if ( units === 'metric' ) {
				distanceString = distance.toFixed( 0 ).toString() + " m";
			} else {
				distanceString = (distance * 3.28).toFixed( 0 ).toString() + " ft";
			}
		}
		return distanceString;
	};
