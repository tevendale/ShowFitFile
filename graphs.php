<?php

// Methods for rendering Chartjs graphs
//
// Copyright 2022 - 2023 Stuart Tevendale


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

	$html = "const ctx = document.getElementById('altitude');
	var latData = " . yft_showfitfile_block_latitude_data($attr) . ";
 	var longData = " . yft_showfitfile_block_longitude_data($attr) . ";
 	var circle = new L.circleMarker();
 	
 	
	const altChart = new Chart(ctx, {
		plugins: [{
		  afterEvent: function(chart, args, pluginOptions) {
		  	if (args.inChartArea) {

				var ctx = chart.ctx;
				var chartArea = chart.chartArea;

				ctx.save();
				ctx.strokeStyle = '#888888';
				ctx.lineWidth = 1
				ctx.moveTo(args.event.x, chartArea.bottom);
				ctx.lineTo(args.event.x, chartArea.top);
				ctx.stroke();
				ctx.restore();
			}

			},
		afterDraw: function(chart, args, pluginOptions) {
			chart.update();
			}
		}
		],
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
			events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
		  onHover: handleChartHover,

		  responsive: true,
		  maintainAspectRatio: false,
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
		},
	}
	});

	function handleChartHover (e) {
		var chartHoverData = altChart.getElementsAtEventForMode(e, 'x', { intersect: false }, false);
		if (chartHoverData.length) {
			var xPos = chartHoverData[0].index;
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
