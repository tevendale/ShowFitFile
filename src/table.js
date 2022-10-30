// FontAwesome for Sport icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonBiking, faPersonRunning, faPersonSwimming, faHeartPulse, faBasketball, faFutbol, faFootball, faDumbbell, faPersonWalking, faPersonSkiingNordic, faPersonSkiing, faPersonSnowboarding, faMountain, faPersonHiking, faPlane, faMotorcycle, faSailboat, faCar, faGolfBallTee, faHorseHead, faFishFins, faPersonSkating, faParachuteBox} from '@fortawesome/free-solid-svg-icons';

import React, { useEffect, useState } from 'react';


	export const SessionTable = ( { time, duration, distance, show, units, sport, subSport, showShareRoute, ascent, descent, setAttributes } ) => {
		// Build the distance String in selected units
		const distString = buildDistanceString( distance, units );
		const ascentString = buildAscentString( ascent, units);
		const descentString = buildDescentString( descent, units);

		useEffect( () => {
			setAttributes( { distanceString: distString } );
			setAttributes( { ascentString: ascentString } );
			setAttributes( { descentString: descentString } );
		} );

		let shareRouteRow = null;
		if (showShareRoute) {
			shareRouteRow =<tr>
							<td className="dataTable" colSpan="4">
								<div>
								<a href='' className="shareRouteLink">Share this Route</a>
								</div>
							</td>
						</tr>;
		}


		if ( show ) {
			return (
				<table style={ { width: '100%' } } className="dataTable">
					<tbody>
						<tr>
							<td className="dataTable" colSpan="4">
								<div className="sportIcon" ><IconForSport sport={sport} /></div>
								<div className="sportNameBlock">
									<div className="sportName"> { sport }</div>
									<div className="subSportName" > { subSport }</div>
								</div>
							</td>
						</tr>
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
								<div className="dataItem"> <FontAwesomeIcon icon="fa-solid fa-arrow-trend-up" /> {ascentString} <FontAwesomeIcon icon="fa-solid fa-arrow-trend-down" /> { descentString} </div>
							</td>
							<td
								style={ { width: '18%' } }
								className="dataTable"
							>
								<div className="dataTitle">Distance:</div>
								<div className="dataItem"> { distString } </div>
							</td>
						</tr>
						{ shareRouteRow }
					</tbody>
				</table>
			);
		}
		return null;
	};

	const IconForSport = ( { sport } ) => {
		const sportUC = sport.toUpperCase();
		if (sportUC.includes( 'CYCLING' ) || sportUC.includes( 'BIKING' )) {
			return <FontAwesomeIcon icon={ faPersonBiking } />;
		}
		if (sportUC.includes( 'RUNNING' )) {
			return <FontAwesomeIcon icon={ faPersonRunning } />;
		}
		if (sportUC.includes( 'SWIMMING' )) {
			return <FontAwesomeIcon icon={ faPersonSwimming } />;
		}
		if (sportUC.includes( 'BASKETBALL' )) {
			return <FontAwesomeIcon icon={ faBasketball } />;
		}
		if (sportUC.includes( 'SOCCER' )) {
			return <FontAwesomeIcon icon={ faFutbol } />;
		}
		if (sportUC.includes( 'AMERICAN_FOOTBALL' )) {
			return <FontAwesomeIcon icon={ faFootball } />;
		}
		if (sportUC.includes( 'TRAINING' )) {
			return <FontAwesomeIcon icon={ faDumbbell } />;
		}
		if (sportUC.includes( 'WALKING' )) {
			return <FontAwesomeIcon icon={ faPersonWalking } />;
		}
		if (sportUC.includes( 'CROSS_COUNTRY_SKIING' )) {
			return <FontAwesomeIcon icon={ faPersonSkiingNordic } />;
		}
		if (sportUC.includes( 'ALPINE_SKIING' )) {
			return <FontAwesomeIcon icon={ faPersonSkiing } />;
		}
		if (sportUC.includes( 'SNOWBOARDING' )) {
			return <FontAwesomeIcon icon={ faPersonSnowboarding } />;
		}
		if (sportUC.includes( 'MOUNTAINEERING' )) {
			return <FontAwesomeIcon icon={ faMountain } />;
		}
		if (sportUC.includes( 'HIKING' )) {
			return <FontAwesomeIcon icon={ faPersonHiking } />;
		}
		if (sportUC.includes( 'FLYING' )) {
			return <FontAwesomeIcon icon={ faPlane } />;
		}
		if (sportUC.includes( 'MOTORCYCLING' )) {
			return <FontAwesomeIcon icon={ faMotorcycle } />;
		}
		if (sportUC.includes( 'BOATING' )) {
			return <FontAwesomeIcon icon={ faSailboat } />;
		}
		if (sportUC.includes( 'DRIVING' )) {
			return <FontAwesomeIcon icon={ faCar } />;
		}
		if (sportUC.includes( 'GOLF' )) {
			return <FontAwesomeIcon icon={ faGolfBallTee } />;
		}
		if (sportUC.includes( 'HORSEBACK_RIDING' )) {
			return <FontAwesomeIcon icon={ faHorseHead } />;
		}
		if (sportUC.includes( 'FISHING' )) {
			return <FontAwesomeIcon icon={ faFishFins } />;
		}
		if (sportUC.includes( 'SAILING' )) {
			return <FontAwesomeIcon icon={ faSailboat } />;
		}
		if (sportUC.includes( 'ICE_SKATING' )) {
			return <FontAwesomeIcon icon={ faPersonSkating } />;
		}
		if (sportUC.includes( 'SKY_DIVING' )) {
			return <FontAwesomeIcon icon={ faParachuteBox } />;
		}

		return <FontAwesomeIcon icon={ faHeartPulse } />;
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
