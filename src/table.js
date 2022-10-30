// FontAwesome for Sport icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown} from '@fortawesome/free-solid-svg-icons';

import React, { useEffect, useState } from 'react';


	export const SessionTable = ( { time, duration, distance, show, units, ascent, descent, setAttributes } ) => {
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
			return (
				<table style={ { width: '100%' } } className="dataTable">
					<tbody>
						<tr>
							<td className="dataTable">
								<div className="dataTitle">Time:</div>
								<div className="dataItem"> { time }</div>
							</td>
							<td className="dataTable">
								<div className="dataTitle">Duration:</div>
								<div className="dataItem"> { duration } </div>
							</td>
							<td className="dataTable">
								<div className="dataTitle">Ascent/Descent:</div>
								<div className="dataItem"> <FontAwesomeIcon icon={ faArrowTrendUp } /> {ascentString}  <FontAwesomeIcon icon={ faArrowTrendDown } /> { descentString} </div>
							</td>
							<td
								style={ { width: '18%' } }
								className="dataTable"
							>
								<div className="dataTitle">Distance:</div>
								<div className="dataItem"> { distString } </div>
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
