---
title: Vector Maps
docs-libs: [jsvectormap, jsvectormap-world, jsvectormap-world-merc]
description: Interactive guide to creating vector maps with jsVectorMap.
summary: Vector maps are a great way to display geographical data in an interactive and visually appealing way. Learn how to create vector maps with jsVectorMap.
---

## Installation

To use vector maps in your project, you need to include the jsVectorMap library in your project. You can install it via npm or include it directly from a CDN. The following example demonstrates how to include the jsVectorMap library from a CDN:

```html
<script src="{{ cdnUrl }}/dist/libs/jsvectormap/dist/js/jsvectormap.min.js"></script>
<script src="{{ cdnUrl }}/dist/libs/jsvectormap/dist/maps/js/jsvectormap-world.js"></script>
```

## Sample demo

Integrating the vector map into your website is straightforward. Below is a sample implementation for a world map:

```html
<div id="map-world" class="w-100 h-100"></div>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const map = new jsVectorMap({
      selector: "#map-world",
      map: "world",
    });
  });
</script>
```

Look at the example below to see how the vector map works with a world map.

{% capture html -%}
<div class="card">
  <div class="card-body">
    <div class="ratio ratio-16x9">
      <div>
        <div id="map-world" class="w-100 h-100"></div>
      </div>
    </div>
  </div>
</div>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const map = new jsVectorMap({
      selector: "#map-world",
      map: "world",
      backgroundColor: "transparent",
      regionStyle: {
        initial: {
          fill: "var(--tblr-body-bg)",
          stroke: "var(--tblr-border-color)",
          strokeWidth: 2,
        },
      },
      zoomOnScroll: false,
      zoomButtons: false,
    });
    window.addEventListener("resize", () => {
      map.updateSize();
    });
  });
</script>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## Markers

You can add markers to the map to highlight specific locations. Below is a sample implementation for a world map with markers:

{% capture html -%}
<div class="card">
  <div class="card-body">
    <div class="ratio ratio-16x9">
      <div>
        <div id="map-world-markers" class="w-100 h-100"></div>
      </div>
    </div>
  </div>
</div>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const map = new jsVectorMap({
      selector: "#map-world-markers",
      map: "world_merc",
      backgroundColor: "transparent",
      regionStyle: {
        initial: {
          fill: "var(--tblr-body-bg)",
          stroke: "var(--tblr-border-color)",
          strokeWidth: 2,
        },
      },
      zoomOnScroll: false,
      zoomButtons: false,
      markers: [
        {
          coords: [61.524, 105.3188],
          name: "Russia",
        },
        {
          coords: [56.1304, -106.3468],
          name: "Canada",
        },
        {
          coords: [71.7069, -42.6043],
          name: "Greenland",
        },
        {
          coords: [26.8206, 30.8025],
          name: "Egypt",
        },
        {
          coords: [-14.235, -51.9253],
          name: "Brazil",
        },
        {
          coords: [35.8617, 104.1954],
          name: "China",
        },
        {
          coords: [37.0902, -95.7129],
          name: "United States",
        },
        {
          coords: [60.472024, 8.468946],
          name: "Norway",
        },
        {
          coords: [48.379433, 31.16558],
          name: "Ukraine",
        },
      ],
      markerStyle: {
        initial: {
          r: 4,
          stroke: "#fff",
          opacity: 1,
          strokeWidth: 3,
          stokeOpacity: 0.5,
          fill: "var(--tblr-primary)",
        },
        hover: {
          fill: "var(--tblr-primary)",
          stroke: "var(--tblr-primary)",
        },
      },
      markerLabelStyle: {
        initial: {
          fontSize: 10,
        },
      },
      labels: {
        markers: {
          render: function (marker) {
            return marker.name;
          },
        },
      },
    });
    window.addEventListener("resize", () => {
      map.updateSize();
    });
  });
</script>
{%- endcapture %}
{% include "docs/example.html" html=html %}