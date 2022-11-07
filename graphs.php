<?php

// Methods for rendering Chartjs graphs
//
// Copyright 2022 Stuart Tevendale


function yft_showfitfile_block_altitudegraph($attr) {
	$polyline = "";
	$conversionFactor = 1;
	$elevationFactor = 1;
	$xAxisLabel = "";
	$yAxisLabel = "";
	if ($attr['units'] == 'metric') {
		$conversionFactor = 1000; // metres to km
		$xAxisLabel = "Distance (km)";
		$yAxisLabel = "Height (m)";
	}
	else {
		$conversionFactor = 1609; // metres to miles
		$xAxisLabel = "Distance (miles)";
		$elevationFactor = 3.28;
		$yAxisLabel = "Height (ft)";
	}
    foreach($attr['altitude'] as $point) {
		$distance = $point[0]/$conversionFactor;
		$elevation = $point[1] * $elevationFactor;

     	$polyline .= "{x: " . $distance . ", y: " . $elevation . "},";
    }

    $polyline = rtrim($polyline, ",");
	$polyline = "[" . $polyline . "]";

// 	print_r($polyline);

	$html = "const ctx = document.getElementById('altitude');
	var latData = " . yft_showfitfile_block_latitude_data($attr) . ";
 	var longData = " . yft_showfitfile_block_longitude_data($attr) . ";
 	var circle = new L.circleMarker();

	const myChart = new Chart(ctx, {
		type: 'scatter',
		data: {
		  datasets: [
			{
			  data: " . $polyline . ",
			  fill: {value: -1000},
			  borderColor: '" . $attr['lineColour'] . "',
			  backgroundColor: '" . $attr['lineColour'] . "',
			},
		  ],
		},

		options: {
		  onHover: handleChartHover,
		  responsive: true,
		  maintainAspectRatio: true,
		  showLine: true,
		  plugins: {
			legend: {
			  display: false,
			},
			title: {
			  display: true,
			  text: 'Altitude',
			},
			tooltip: {
				// No tooltips
				events: []
			},
		  },
		  elements: {
		  	point: {
		  		radius: 1,
		  		borderWidth: 0
		  	},
		  },
		scales: {
			x: {
			  title: {
				display: true,
				text: '". $xAxisLabel ."'
			  },
			  ticks: {
				callback: function(value, index, ticks) {
					return value.toFixed(2);
					}
				},
			},
			y: {
				title: {
					display: true,
					text: '" . $yAxisLabel ."'
				},
				ticks: {
                    callback: function(value, index, ticks) {
                        return value.toFixed(0);
						}
					}
			}
		}
	}

	});

	function handleChartHover (e) {
		var chartHoverData = myChart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
		if (chartHoverData.length) {
			var xPos = chartHoverData[0].index;
// 			console.log(xPos);
			if (xPos < latData.length) {
				var lat = latData[chartHoverData[0].index].y;
				var long = longData[chartHoverData[0].index].y;
				map.removeLayer(circle);

				circle = L.circleMarker([lat, long], {
					color: 'blue',
					fillColor: 'blue',
					fillOpacity: 0.5,
					radius: 5
				});
				map.addLayer(circle);
				}
			}
	}
	";

	return $html;
}

?>
