let margin = 30;

let librettist_col = 12.5 * margin;
let composer_col = 7 * margin;

let map_nodes_lst;

let chart_axis;
let yScale;

let timeline_circles;
let timeline_rects;
let timeline_curves;

let map_edges_lst;
let self_map_edges;
let map_nodes;
let map_circles;

let min_weight;
let max_weight;

let titles;
// let title_performances;

const min_opacity = 0.4;
const max_opacity = 1;



/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
 function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }



function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                csv = allText; //alert(allText);
            }
        }
    }
    rawFile.send(null);
}





let librettists = [
    
    {
        "name": "Metastasio, Pietro",
        "born": 1698,
        "died": 1782,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Rossi, Gaetano",
        "born": 1774,
        "died": 1855,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Da Ponte, Lorenzo",
        "born": 1749,
        "died": 1838,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Bertati, Giovanni",    
        "born": 1735,
        "died": 1815,
        "collaborators": {},
        "performance_years": [],
        "titles": {}       
    },
    {
        "name": "Calzabigi, Ranieri de",        
        "born": 1714,
        "died": 1795,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Sografi, Simeone Antonio",
        "born": 1759,
        "died": 1818,
        "collaborators": {},
        "performance_years": [],
        "titles": {}      
    },
    {
        "name": "Goldoni, Carlo",        
        "born": 1707,
        "died": 1793,
        "collaborators": {},
        "performance_years": [],
        "titles": {}      
    },
    {
        "name": "Mazzolà, Caterino", 
        "born": 1745,
        "died": 1806,
        "collaborators": {},
        "performance_years": [],
        "titles": {}        
    }
];

let composers = [
    {
       "name": "Paisiello, Giovanni",
       "born": 1740,
       "died": 1816,
       "collaborators": {},
       "performance_years": [],
       "titles": {}
    },
    {
        "name": "Mayr, Johann Simon",
        "born": 1763,
        "died": 1845,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Anfossi, Pasquale",
        "born": 1727,
        "died": 1797,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Piccinni, Niccolò",
        "born": 1728,
        "died": 1800,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Cimarosa, Domenico",
        "born": 1749,
        "died": 1801,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Salieri, Antonio",
        "born": 1750,
        "died": 1825,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Mozart, Wolfgang Amadeus",
        "born": 1756,
        "died": 1791,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Meyerbeer, Giacomo",
        "born": 1791,
        "died": 1864,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Martín y Soler, Vicente",
        "born": 1754,
        "died": 1806,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    },
    {
        "name": "Rossini, Gioachino",
        "born": 1792,
        "died": 1868,
        "collaborators": {},
        "performance_years": [],
        "titles": {}
    }
];


let min_year = 1775;
let max_year = 1835;

let cur_min_year = min_year;
let cur_max_year = max_year;

let min_node_size = 5;
let max_node_size = 25;

let min_color = [252, 206, 126];
let max_color = [255, 0, 0];


const map_width = $("#map_container").width();
const map_height = $("#map_container").height();
const hypotenuse = Math.sqrt(map_width * map_width + map_height * map_height);

const scales = {
    // used to scale number of segments per line
    segments: d3.scaleLinear()
        .domain([0, hypotenuse])
        .range([1, 10])
};


let places = {};

let performance_data = {};
let librettist_idx = {};
let composer_idx = {};
let csv;

let collabs = {};

let arrow_id = 0;


let projection;
const map_svg = d3.select("#map_svg");
const timeline_svg = d3.select("#timeline_svg");
const g = {
    basemap: map_svg.select("g#basemap"),
    cities: map_svg.select("g#cities"),
    timeline: timeline_svg.select("g#timeline")
};
const chart_width = 1400;
const chart_height = 1000;




function color_map(num, min_num, max_num, c1, c2) {

    let num1 = (Math.floor(num / 10) * 10);
    
    let num2;
    if (parseFloat(("" + num)[3]) < 5) {
        num2 = num1 - 5;
    }
    else {
        num2 = num1 + 5;
    }

    let fraction = (num2 - min_num) / (max_num - min_num);

    let r = ((c2[0] - c1[0]) * fraction) + c1[0];
    let g = ((c2[1] - c1[1]) * fraction) + c1[1];
    let b = ((c2[2] - c1[2]) * fraction) + c1[2];

    return [r, g, b];
}

function range_map(old_val, old_min, old_max, new_min, new_max) {
    new_val = (((old_val - old_min) * (new_max - new_min)) / (old_max - old_min)) + new_min;
    return new_val;
}


function mean(lst) {
    let tot = 0;
    for (num of lst) {
        tot += num;
    }
    return (tot / lst.length)
}

function initialize_data(performances) {

    librettists.sort(function(a, b) {
        return a["born"] - b["born"];
    }); 

    composers.sort(function(a, b) {
        return a["born"] - b["born"];
    });
    let i = 0;
    for (librettist of librettists) {
        librettist_idx[librettist["name"]] = i;
        i += 1;
    }
    i = 0;
    for (composer of composers) {
        composer_idx[composer["name"]] = i;
        i += 1;
    }
    
    titles = [];
    for (performance of performances) {
        let librettist = performance["librettist"];
        let composer = performance["composer"];
        let title = performance["title"];
        let performance_year = performance["performance_year"];
        let placename = performance["placename"];
        let longitude = performance["longitude"];
        let latitude = performance["latitude"];

        if (!(titles.includes(title))) {
            titles.push(title);
        }

        if (!(librettist in performance_data)) {
            performance_data[librettist] = {};
        }
        if (!(composer in performance_data[librettist])) {
            performance_data[librettist][composer] = {};
        }
        if (!(title in performance_data[librettist][composer])) {
            performance_data[librettist][composer][title] = [];
        }
        
        if (!(placename in places)) {
            places[placename] = {
                "longitude": parseFloat(longitude),
                "latitude": parseFloat(latitude)
            }
        }
        
        performance_data[librettist][composer][title].push({
            "performance_year": parseInt(performance_year),
            "placename": placename
        });

        composers[composer_idx[composer]]["performance_years"].push(parseInt(performance_year));
        librettists[librettist_idx[librettist]]["performance_years"].push(parseInt(performance_year));

        let collab_key = librettist + "-" + composer;
        if (!(collab_key in collabs)) {
            collabs[collab_key] = [];
        }
        if (!(collabs[collab_key].includes(title))) {
            collabs[collab_key].push(title);

            if (!(librettist in composers[composer_idx[composer]]["collaborators"])) {
                composers[composer_idx[composer]]["collaborators"][librettist] = 0;
            }
            composers[composer_idx[composer]]["collaborators"][librettist]++;

            if (!(composer in librettists[librettist_idx[librettist]]["collaborators"])) {
                librettists[librettist_idx[librettist]]["collaborators"][composer] = 0;
            }
            librettists[librettist_idx[librettist]]["collaborators"][composer]++;
        }

        if (!(title in composers[composer_idx[composer]]["titles"])) {
            composers[composer_idx[composer]]["titles"][title] = [];
        }
        composers[composer_idx[composer]]["titles"][title].push(parseInt(performance_year));

        if (!(title in librettists[librettist_idx[librettist]]["titles"])) {
            librettists[librettist_idx[librettist]]["titles"][title] = [];
        }
        librettists[librettist_idx[librettist]]["titles"][title].push(parseInt(performance_year));
    }

    for (composer of composers) {
        let mean_year = mean(composer["performance_years"])
        composer["mean_year"] = mean_year;
        let c = color_map(mean_year, min_year, max_year, min_color, max_color);
        composer["color"] = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
    }
    for (librettist of librettists) {
        let mean_year = mean(librettist["performance_years"])
        librettist["mean_year"] = mean_year;
        let c = color_map(mean_year, min_year, max_year, min_color, max_color);
        librettist["color"] = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
    }

    titles.sort();
}


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


$(document).ready(function() {

    $("#librettist_combo").prop("disabled", true);
    $("#composer_combo").prop("disabled", true);
    $("#opera_combo").prop("disabled", true);


    $( "#slider-range" ).slider({
        orientation: "vertical",
        range: true,
        min: 1775,
        max: 1835,
        values: [ 1775, 1835 ],
        slide: function( event, ui ) {
            cur_max_year = min_year + (max_year - ui.values[0]);
            cur_min_year =  min_year + (max_year - ui.values[1]);
            update_graph();
        }
      });
    $( "#slider-range").slider("disable");

    readTextFile("./opera.csv");

    let performances = $.csv.toObjects(csv);

    initialize_data(performances);

    $("#librettist_combo").append($('<option>', {
        value: "All",
        text: "All"
    }));

    $("#composer_combo").append($('<option>', {
        value: "All",
        text: "All"
    }));
    for (composer of composers) {
        $("#composer_combo").append($('<option>', {
            value: composer["name"],
            text: composer["name"]
        }));
    }

    $("#opera_combo").append($('<option>', {
        value: "All",
        text: "All"
    }));
    for (title of titles) {
        $("#opera_combo").append($('<option>', {
            value: title,
            text: title
        }));
    }



    for (librettist of Object.keys(performance_data).sort()) {
        $("#librettist_combo").append($('<option>', {
            value: librettist,
            text: librettist
        }));
    }


    $("#opera_combo").change(function() {
        update_graph();
    });


    $("#composer_combo").change(function() {
        let librettist = $("#librettist_combo").val();
        let composer = $("#composer_combo").val();
        let previous_title = $("#opera_combo").val();

        $("#opera_combo").empty();

        $("#opera_combo").append($('<option>', {
            value: "All",
            text: "All"
        }));

        let title_options = [];

        if (librettist === "All") {
            if (composer === "All") {
                for (l of Object.keys(performance_data)) {
                    for (c of Object.keys(performance_data[l])) {
                        for (title of Object.keys(performance_data[l][c])) {
                            title_options.push(title);
                        }
                    }
                }
                title_options = title_options.filter(onlyUnique);
            }
            else {
                for (l of Object.keys(performance_data)) {
                    if (composer in performance_data[l]) {
                        for (title of Object.keys(performance_data[l][composer])) {
                            title_options.push(title);
                        }
                    }
                }
            }
        }
        else {
            if (composer === "All") {
                for (c of Object.keys(performance_data[librettist])) {
                    for (title of Object.keys(performance_data[librettist][c])) {
                        title_options.push(title);
                    }
                }
            }
            else {
                title_options = Object.keys(performance_data[librettist][composer]);
            }
        }


        for (title of title_options.sort()) {
            $("#opera_combo").append($('<option>', {
                value: title,
                text: title
            }));
        }

        if (title_options.includes(previous_title)) {
            $("#opera_combo").val(previous_title).change();
        }
        else {
            $("#opera_combo").val($("#opera_combo:first").val()).change();
        }
    });





    $("#librettist_combo").change(function() {
        let librettist = $("#librettist_combo").val();
        let previous_composer = $("#composer_combo").val();

        $("#composer_combo").empty();

        $("#composer_combo").append($('<option>', {
            value: "All",
            text: "All"
        }));

        let composer_options = [];
        if (librettist === "All") {
            for (c of composers) {
                composer_options.push(c["name"]);
            }
        }
        else {
            composer_options = Object.keys(performance_data[librettist]);
        }


        for (c of composer_options.sort()) {
            $("#composer_combo").append($('<option>', {
                value: c,
                text: c
            }));
        }

        if (composer_options.includes(previous_composer)) {
            $("#composer_combo").val(previous_composer).change();
        }
        else {
            $("#composer_combo").val($("#composer_combo:first").val()).change();
        }
    });

    d3.select("map_svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + map_width + " " + map_height)
      .classed("svg-content", true);

    projection = d3.geoOrthographic().translate([map_width/2, map_height/2]).scale(6100).center([7.8,46.7]);
    
    var path = d3.geoPath().projection(projection);
    var worldmap = d3.json("custom.geo.json");



    const zoom = d3.zoom()
    .scaleExtent([0.5, 8])
    .on('zoom', zoomed);

    map_svg.call(zoom);

    Promise.all([worldmap]).then(function(values){ 
        g.basemap.selectAll("path")
            .data(values[0].features)
            .enter()
            .append("path")
            .attr("class","continent")
            .attr("d", path);

        draw_graph();




    });
})

function zoomed() {

    g.basemap
      .selectAll('path')
      .attr('transform', d3.event.transform);

    g.cities
      .selectAll('path')
      .attr('transform', d3.event.transform);

    g.cities
      .selectAll('.map_circle')
      .attr('transform', d3.event.transform);

    g.cities
      .selectAll('.map_text')
      .attr('transform', d3.event.transform);  

    g.cities
      .selectAll('.map_rect')
      .attr('transform', d3.event.transform);  

  }


function update_graph() {

    let cur_librettist = $("#librettist_combo").val();
    let cur_composer = $("#composer_combo").val();
    let cur_title = $("#opera_combo").val();


    let s_keys = [];
    if ((cur_librettist === "All" && cur_composer === "All") && cur_title === "All") {
        s_keys = ["All/All/All"];
    }
    else {

        let candidate_s_keys = [];
        let candidate_librettists = [];
        let candidate_composers = [];
        let candidate_titles = [];

        if (cur_librettist === "All") {
            for (librettist of librettists) {
                candidate_librettists.push(librettist["name"]);
            }

        }
        else {
            candidate_librettists = [cur_librettist];
        }

        if (cur_composer === "All") {
            for (composer of composers) {
                candidate_composers.push(composer["name"]);
            }

        }
        else {
            candidate_composers = [cur_composer];
        }

        
        if (cur_title === "All") {
            for (title of titles) {
                candidate_titles.push(title);
            }

        }
        else {
            candidate_titles = [cur_title];
        }


        for (candidate_librettist of candidate_librettists) {
            for (candidate_composer of candidate_composers) {
                for (candidate_title of candidate_titles) {
                    candidate_s_keys.push(candidate_librettist + "/" + candidate_composer + "/" + candidate_title);
                }
            }
        }



        for (s_key of candidate_s_keys) {
            let elements = s_key.split("/");
            let librettist = elements[0];
            let composer = elements[1];
            let title = elements[2];
    
            let valid = (composer in performance_data[librettist]) && (title in performance_data[librettist][composer]);
    
            if (valid) {
                s_keys.push(librettist + "/" + composer + "/" + title);
            }
        }

    }

    d3.selectAll(".map_curve")
        .data(map_edges_lst)
        .transition()
        .duration(250)
        .attr("opacity", function(d) {
            if ((d["performance_year"] < cur_min_year) || (d["performance_year"] >= cur_max_year)) {
                return 0;
            }
            if (s_keys[0] !== "All/All/All" && !s_keys.includes(d["s_key"])) {
                return 0;
            }
            return 0.9;
        });

    d3.selectAll(".self_map_curve")
        .data(Object.keys(self_map_edges))
        .transition()
        .duration(250)
        .attr("opacity", function(d) {
            if ((self_map_edges[d]["performance_year"] < cur_min_year) || (self_map_edges[d]["performance_year"] >= cur_max_year)) {
                return 0;
            }
            if (s_keys[0] !== "All/All/All" && !s_keys.includes(self_map_edges[d]["s_key"])) {
                return 0;
            }
            return 0.9;
        });

    let labelled_map_nodes = [];

    if (s_keys[0] === "All/All/All") {

        for (let i = 0; i < 16; i++) {
            labelled_map_nodes.push(map_nodes_lst[i]["placename"]);
        }

        d3.selectAll(".map_circle")
        .data(map_circles)
        .transition()
        .duration(250)
        .style("opacity", function(d) {
            if (d["highlight"]) {
                return 0;
            }
            else {
                return 1;
            }
        });
    }
    else {

        let premiere_performances = [];
        for (s_key of s_keys) {
            let elements = s_key.split("/");
            let librettist = elements[0];
            let composer = elements[1];
            let title = elements[2];

            let performances = performance_data[librettist][composer][title];
            performances.sort(function(a, b) {
                return a["performance_year"] - b["performance_year"];
            });
            let premiere_performance = performances[0]["placename"];
            for (performance of performances) {
                labelled_map_nodes.push(performance["placename"]);
            }
            premiere_performances.push(premiere_performance);
        }

        d3.selectAll(".map_circle")
            .data(map_circles)
            .transition()
            .duration(250)
            .style("opacity", function(d) {
                if (d["highlight"]) {
                    if (premiere_performances.includes(d["placename"])) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
                else {
                    return 1;
                }
            });

    }

    d3.selectAll(".map_rect")
        .data(map_nodes_lst)
        .transition()
        .duration(250)
        .style("opacity", function(d) {
            if (labelled_map_nodes.includes(d["placename"])) {
                return 0.6;
            }
            else {
                return 0;
            }
        });


    d3.selectAll(".map_text")
        .data(map_nodes_lst)
        .transition()
        .duration(250)
        .style("opacity", function(d) {
            if (labelled_map_nodes.includes(d["placename"])) {
                return 1;
            }
            else {
                return 0;
            }
        });


    yScale.domain([cur_min_year, cur_max_year]);


    d3.selectAll(".timeline_curve")
        .data(timeline_curves)
        .transition()
        .duration(250)
        .attr("opacity", function(d) {
            for (point of d["points"]) {
                if ((point[1] < cur_min_year) || (point[1] >= cur_max_year)) {
                    return 0;
                }
            }
            return d["opacity"];
        });


    d3.selectAll(".timeline_circle")
        .data(timeline_circles)
        .transition()
        .duration(250)
        .attr("r", function(d) {
            if ((d["mean_year"] < cur_min_year) || (d["mean_year"] >= cur_max_year)) {
                return 0;
            }
            return d["radius"];
        });

    d3.selectAll(".composer_librettist_names")
        .data(composers.concat(librettists))
        .transition()
        .duration(250)
        .attr("font-size", function(d) {
            if ((d["mean_year"] < cur_min_year) || (d["mean_year"] >= cur_max_year)) {
                return "0px";
            }
            return "16px";
        });


}

function draw_graph() {




    chart_axis = timeline_svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + (70) + ", 0)");

    yScale = d3.scaleLinear()
                .domain([min_year, max_year])
                .range([1.8*margin, chart_height - 8*margin]);


    let tick_values = [];
    for (let i = min_year; i <= max_year; i += 10) {
        tick_values.push(i);
    }
    chart_axis.call(d3.axisLeft(yScale).tickValues(tick_values).tickFormat(d3.format("d")).tickSize(25));

    timeline_curves = [];
    min_weight = 10000;
    max_weight = 0;

    for (collab of Object.keys(collabs)) {
        if (collabs[collab].length > max_weight) {
            max_weight = collabs[collab].length;
        }
        if (collabs[collab].length < min_weight) {
            min_weight = collabs[collab].length;
        }
    }

    for (collab of Object.keys(collabs)) {
        let collaborators = collab.split("-");
        let librettist = collaborators[0];
        let composer = collaborators[1];
        let weight = collabs[collab].length;

        let points = [
            [librettist_col, (librettists[librettist_idx[librettist]]["mean_year"])],
            [composer_col, (composers[composer_idx[composer]]["mean_year"])]
        ];
        
        let fraction = (weight - min_weight) / (max_weight - min_weight);
        let opacity = ((max_opacity - min_opacity) * fraction) + min_opacity;
        let d = {
            "points": points,
            "color": "white",
            "opacity": opacity
        }
        timeline_curves.push(d);
    }
    
    let curve = d3.line().curve(d3.curveLinear);
    g.timeline.selectAll(".path")
        .data(timeline_curves)
        .enter()
        .append("path")
        .attr("class", "path")
        .attr("class", "timeline_curve")
        .attr('d', function(d) {
            return curve([
                [d["points"][0][0], yScale(d["points"][0][1])],
                [d["points"][1][0], yScale(d["points"][1][1])]
            ])
        })
        .attr('stroke', function(d) {
            return d["color"];
        })
        .attr("stroke-width", 2)
        .attr("opacity", function(d) {
            return d["opacity"];
        })
        .attr('fill', 'none');


    map_nodes = {};
    for (librettist of Object.keys(performance_data)) {
        for (composer of Object.keys(performance_data[librettist])) {
            for (title of Object.keys(performance_data[librettist][composer])) {

                let performances = performance_data[librettist][composer][title];
                for (performance of performances) {
                    if (!(performance["placename"] in map_nodes)) {
                        map_nodes[performance["placename"]] = {
                            "years": []
                        };
                    }
                    map_nodes[performance["placename"]]["years"].push(performance["performance_year"]);
                }
            }
        }
    }


    let min_auth = 100000;
    let max_auth = 1;
    for (composer of composers) {
        let years = [];
        for (title in composer["titles"]) {
            years = years.concat(...composer["titles"][title]);
        }
        years.sort();
        composer["years"] = years;
        let num_titles = Object.keys(composer["years"]).length;
        if (num_titles > max_auth) {
            max_auth = num_titles;
        }
        if (num_titles < min_auth) {
            min_auth = num_titles;
        }
    }
    for (librettist of librettists) {
        let years = [];
        for (title in librettist["titles"]) {
            years = years.concat(...librettist["titles"][title]);
        }
        years.sort();
        librettist["years"] = years;
        let num_titles = Object.keys(librettist["years"]).length;
        if (num_titles > max_auth) {
            max_auth = num_titles;
        }
        if (num_titles < min_auth) {
            min_auth = num_titles;
        }
    }


    let min_map_node_weight = 100000;
    let max_map_node_weight = 1;
    for (placename of Object.keys(map_nodes)) {
        if (map_nodes[placename]["years"].length > max_map_node_weight) {
            max_map_node_weight = map_nodes[placename]["years"].length;
        }
        if (map_nodes[placename]["years"].length < min_map_node_weight) {
            min_map_node_weight = map_nodes[placename]["years"].length;
        }
    }

    min_val = Math.min(min_auth, min_map_node_weight);
    max_val = Math.max(max_auth, max_map_node_weight);


    timeline_circles = [];
    for (composer of composers) {
        let i = 0;
        let comp_circles = [];
        let years = composer["years"];
        for (year of years) {
            
            let circle = {};
            circle["radius"] = range_map(i+1, min_val, max_val, min_node_size, max_node_size);
            let c = color_map(year, min_year, max_year, min_color, max_color);
            circle["color"] = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
            circle["cx"] = composer_col;
            circle["mean_year"] = composer["mean_year"];
            circle["stroke"] = (i == years.length - 1);
            comp_circles.push(circle);
            i++;
        }
        comp_circles.sort(function(a, b) {
            return b["radius"] - a["radius"];
        });

        let index = 0;
        if (timeline_circles.length > 0) {
            while (comp_circles[0]["mean_year"] >= timeline_circles[index]["mean_year"]) {
                index++;
                if (index == timeline_circles.length) {
                    break;
                }
            }
        }
        for (comp_circle of comp_circles) {
            timeline_circles.splice(index, 0, comp_circle);
            index++;
        }
    }

    for (librettist of librettists) {
        let i = 0;
        let lib_circles = [];
        let years = librettist["years"];
        for (year of years) {
            
            let circle = {};
            circle["radius"] = range_map(i+1, min_val, max_val, min_node_size, max_node_size);
            let c = color_map(year, min_year, max_year, min_color, max_color);
            circle["color"] = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
            circle["cx"] = librettist_col;
            circle["mean_year"] = librettist["mean_year"];
            circle["stroke"] = (i == years.length - 1);
            lib_circles.push(circle);
            i++;
        }
        lib_circles.sort(function(a, b) {
            return b["radius"] - a["radius"];
        });

        let index = 0;
        if (timeline_circles.length > 0) {
            while (lib_circles[0]["mean_year"] >= timeline_circles[index]["mean_year"]) {
                index++;
                if (index == timeline_circles.length) {
                    break;
                }
            }
        }
        for (lib_circle of lib_circles) {
            timeline_circles.splice(index, 0, lib_circle);
            index++;
        }

    }

    map_circles = [];
    for (placename of Object.keys(map_nodes)) {
        let years = map_nodes[placename]["years"].sort();
        let longitude = places[placename]["longitude"];
        let latitude = places[placename]["latitude"];
        let i = 0;
        let city_circles = []
        for (year of years) {
            let circle = {};
            circle["radius"] = range_map(i+1, min_val, max_val, min_node_size, max_node_size);
            let c = color_map(year, min_year, max_year, min_color, max_color);
            circle["color"] = "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
            circle["cx"] = projection([longitude, latitude])[0];
            circle["cy"] = projection([longitude, latitude])[1];
            circle["stroke"] = (i == years.length - 1);
            circle["highlight"] = false;
            circle["placename"] = placename;
            city_circles.push(circle);
            i++;
        }
        city_circles.push({
            "radius": city_circles[city_circles.length-1]["radius"] + 5,
            "color": "white",
            "highlight": true,
            "cx": projection([longitude, latitude])[0],
            "cy": projection([longitude, latitude])[1],
            "placename": placename
        });

        

        city_circles.sort(function(a, b) {
            return b["radius"] - a["radius"];
        });
        map_circles = map_circles.concat(...city_circles);
    }


    let map_edges = {};
    self_map_edges = {};
    let label = 0;

    for (librettist of Object.keys(performance_data)) {
        for (composer of Object.keys(performance_data[librettist])) {
            for (title of Object.keys(performance_data[librettist][composer])) {
                let performances = performance_data[librettist][composer][title];

                performances.sort(function(a, b) {
                    return a["performance_year"] - b["performance_year"];
                });

                let premiere_city = performances[0]["placename"];
                if (!("premieres" in places[premiere_city])) {
                    places[premiere_city]["premieres"] = [];
                }
                places[premiere_city]["premieres"].push(title);

                for (let i = 1; i < performances.length; i++) {
                    let link = [performances[0], performances[i]];

                    let source_lon = places[link[0]["placename"]]["longitude"];
                    let source_lat = places[link[0]["placename"]]["latitude"];
                    let target_lon = places[link[1]["placename"]]["longitude"];
                    let target_lat = places[link[1]["placename"]]["latitude"];

                    label++;

                    if (!("outgoing" in places[link[0]["placename"]])) {
                        places[link[0]["placename"]]["outgoing"] = [];
                    }
                    places[link[0]["placename"]]["outgoing"].push(link[1]["placename"]);

                    if (link[0]["placename"] !== link[1]["placename"]) {
                        map_edges[label] = {
                            "weight": 1,
                            "points": 
                                [
                                    [
                                        projection([source_lon, source_lat])[0],
                                        projection([source_lon, source_lat])[1]
                                    ],
                                    [
                                        projection([target_lon, target_lat])[0],
                                        projection([target_lon, target_lat])[1]
                                    ],                                    
                                ],
                            "color": color_map(link[1]["performance_year"], min_year, max_year, min_color, max_color),
                            "performance_year": link[1]["performance_year"],
                            "s_key": librettist + "/" + composer + "/" + title
                        };
                    }
                    else {
                        let num_performances = map_nodes[link[0]["placename"]]["years"].length;
                        let radius = range_map(num_performances, min_val, max_val, min_node_size, max_node_size);
                        let right_arrow_names = ["Venezia", "Napoli", "Wien", "Sankt Petersburg"];
                        let mult;
                        if (right_arrow_names.includes(link[0]["placename"])) {
                            mult = -1;
                        }
                        else {
                            mult = 1;
                        }
                        self_map_edges[label] = {
                                "weight": 1,
                                "points": 
                                    [
                                        [
                                            projection([source_lon, source_lat])[0],
                                            projection([source_lon, source_lat])[1]
                                        ],
                                        [
                                            projection([source_lon-(mult * 0.25), source_lat-(mult * 0.25)])[0],
                                            projection([source_lon-(0.25), source_lat-(0.25)])[1]
                                        ],
                                        [
                                            projection([source_lon-(mult * 0.5), source_lat])[0],
                                            projection([source_lon-(0.5), source_lat])[1]
                                        ],
                                        [
                                            projection([source_lon-(mult * 0.25), source_lat+(mult * 0.25)])[0],
                                            projection([source_lon-(0.25), source_lat+(0.25)])[1]
                                        ],
                                        [
                                            projection([target_lon, target_lat])[0] - (mult * radius),
                                            projection([target_lon, target_lat])[1] - (radius)
                                        ],                                    
                                    ],
                                "color": color_map(link[1]["performance_year"], min_year, max_year, min_color, max_color),
                                "performance_year": link[1]["performance_year"],
                                "s_key": librettist + "/" + composer + "/" + title
                            };
                    }

                }
            }
        }
    }

    
    map_nodes_lst = [];
    for (placename of Object.keys(map_nodes)) {
        let longitude = places[placename]["longitude"];
        let latitude = places[placename]["latitude"];
        map_nodes_lst.push({
            "placename": placename, 
            "num_years": map_nodes[placename]["years"].length,
            "x": projection([longitude, latitude])[0],
            "y": projection([longitude, latitude])[1]
        });
    }


    map_edges_lst = [];
    for (linkname of Object.keys(map_edges)) {
        map_edge = {
            "source": {
                "x": map_edges[linkname]["points"][0][0],
                "y": map_edges[linkname]["points"][0][1]
            },
            "target": {
                "x": map_edges[linkname]["points"][1][0],
                "y": map_edges[linkname]["points"][1][1]
            },
            "weight": map_edges[linkname]["weight"],
            "opacity": map_edges[linkname]["opacity"],
            "color": map_edges[linkname]["color"],
            "performance_year": map_edges[linkname]["performance_year"],
            "s_key": map_edges[linkname]["s_key"]
        };
        map_edges_lst.push(map_edge);
    }


    draw_map_edges(map_nodes_lst, map_edges_lst);

    let map_curve = d3.line().curve(d3.curveBundle);
    g.cities.selectAll("self_path")
        .data(Object.keys(self_map_edges))
        .enter()
        .append("path")
        .attr("class", "path")
        .attr("class", "self_map_curve")
        .attr('d', function(d) {
            return map_curve(self_map_edges[d]["points"]);
        })
        .attr('stroke', function(d, i) {
            let c = self_map_edges[d]["color"];
            return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")";
        })
        .attr("stroke-linecap", "round")
        .attr('fill', 'none')
        .attr("stroke-width", 1)
        .attr("opacity", 0.9)
        .attr("marker-end", function(d) {
            let c = self_map_edges[d]["color"];
            return self_marker("rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")");
        });


    timeline_rects = [];
    let num_rects = 2 * (max_year - min_year);
    for (let i = 0; i < num_rects; i++) {
        let year = min_year + (i/2);
        let c = color_map(year, min_year, max_year, min_color, max_color);
        timeline_rects.push({
            "year": year,
            "color": "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")"
        });
    }


    g.timeline.selectAll(".rect")
        .data(timeline_rects)
        .enter()
        .append("rect")
        .attr("class", "timeline_rect")
        .attr("x", function(d) {
            return 50;
        })
        .attr("y", function(d) {
            return yScale(d["year"]);
        })
        .attr("height", function(d) {
            return yScale(d["year"] + 0.5) - yScale(d["year"]) + 1;
        })
        .attr("width", 20)
        .attr("fill", function(d) {
            return d["color"];
        });

    g.timeline.selectAll(".circle")
        .data(timeline_circles)
        .enter()
        .append("circle")
        .attr("class", "timeline_circle")
        .attr("cx", function(d) {
            return d["cx"];
        })
        .attr("cy", function(d) {
            return yScale(d["mean_year"]);
        })
        .attr("r", function(d) {
            return d["radius"];
        })
        .attr("fill", function(d) {
            return d["color"];
        })
        .attr("stroke-width", function(d) {
            if (d["stroke"])
                return 1;
            else
                return 0;
        })
        .attr("stroke", function(d) {
            return "black";
        });

    g.timeline.selectAll("text")
        .data(composers.concat(librettists))
        .enter()
        .append("text")
        .attr("class", "chart_text")
        .attr("class", "composer_librettist_names")
        .attr("x", function(d, i) {
            if (i < composers.length)
                return composer_col - 30;
            else
                return librettist_col + 30;
        })
        .attr("y", function(d) {
            return yScale(d["mean_year"]);
        })
        .attr("alignment-baseline", "central")
        .attr("text-anchor", function(d, i) {
            if (i < composers.length)
                return "end";
            else
                return "start";
        })
        .attr("font-size", "16px")
        .text(function(d) { return d["name"].split(",")[0]; })
        .style("cursor", "default");

    let text_label_data = [
        {
            "text": "Composers",
            "x": composer_col,
            "y": 40
        },
        {
            "text": "Librettists",
            "x": librettist_col,
            "y": 40
        }        
    ]
    g.timeline.selectAll("ltext")
        .data(text_label_data)
        .enter()
        .append("text")
        .attr("class", "label_text")
        .attr("x", function(d) {
            return d["x"];
        })
        .attr("y", function(d) {
            return d["y"];
        })
        .attr("alignment-baseline", "central")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text(function(d) { return d["text"]; }); 
        
        

    let timeline_width = $("#timeline_container").width();
    let timeline_legend_width = 220;
    let timeline_legend_height = 200;
    let timeline_year_legend_x = 10;
    let timeline_year_legend_y = chart_height - timeline_legend_height + 1 - 10;
    g.timeline.selectAll("timeline_year_legend_rect")
        .data([0])
        .enter()
        .append("rect")
        .attr("x", timeline_year_legend_x)
        .attr("y", timeline_year_legend_y)
        .attr("width", timeline_legend_width)
        .attr("height", timeline_legend_height)
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("stroke", "white")
        .attr("fill", "black")
        .attr("stroke-width", 1);

        g.timeline.selectAll("timeline_year_legend_label")
        .data(["Performance Year"])
        .enter()
        .append("text")
        .attr("class", "label_text")
        .attr("x", timeline_year_legend_x + (timeline_legend_width / 2))
        .attr("y", chart_height - timeline_legend_height + 1 - 10 + 20)
        .attr("alignment-baseline", "central")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text(function(d) { return d; });

    let circles_timeline_col = 10 + (timeline_legend_width / 2);

    let timeline_circle_legend_data = [{
        "text": String(min_year),
        "radius": Math.floor((min_node_size + max_node_size) / 2),
        "cx": circles_timeline_col,
        "cy":chart_height - timeline_legend_height + 1 - 10 + 20 + 50,
        "y": chart_height - timeline_legend_height + 1 - 10 + 20 + 50,
        "color": min_color
    },
    {
        "text": String((min_year + max_year) / 2),
        "radius": Math.floor((min_node_size + max_node_size) / 2),
        "cx": circles_timeline_col,
        "cy": chart_height - timeline_legend_height + 1 - 10 + 20 + 100,
        "y": chart_height - timeline_legend_height + 1 - 10 + 20 + 100,
        "color": color_map((min_year + max_year) / 2, min_year, max_year, min_color, max_color)
    },
    {
        "text": String(max_year),
        "radius": Math.floor((min_node_size + max_node_size) / 2),
        "cx": circles_timeline_col,
        "cy": chart_height - timeline_legend_height + 1 - 10 + 20 + 150,
        "y": chart_height - timeline_legend_height + 1 - 10 + 20 + 150,
        "color": max_color
    }];

    g.timeline.selectAll("timeline_year_legend_circle")
        .data(timeline_circle_legend_data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return d["cx"] + 20;
        })
        .attr("cy", function(d) {
            return d["cy"];
        })
        .attr("r", function(d) {
            return d["radius"];
        })
        .attr("fill", function(d) {
            return "rgb(" + d["color"][0] + "," + d["color"][1] + "," + d["color"][2] + ")";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    
    g.timeline.selectAll("timeline_year_legend_circle")
        .data(timeline_circle_legend_data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return d["cx"] + 20;
        })
        .attr("cy", function(d) {
            return d["cy"];
        })
        .attr("r", function(d) {
            return d["radius"] - 5;
        })
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    g.timeline.selectAll("timeline_year_legend_text")
        .data(timeline_circle_legend_data)
        .enter()
        .append("text")
        .attr("class", "chart_text")
        .attr("x", function(d) {
            return d["cx"] - 20;
        })
        .attr("y", function(d) {
            return d["cy"];
        })
        .attr("alignment-baseline", "central")
        .attr("text-anchor", "end")
        .attr("font-size", "16px")
        .text(function(d) { return d["text"]; });


    let timeline_colab_legend_x = timeline_width - timeline_legend_width - 30;
    let timeline_colab_legend_y = chart_height - timeline_legend_height + 1 - 10;

    g.timeline.selectAll("timeline_colab_legend_rect")
              .data([0])
              .enter()
              .append("rect")
              .attr("x", timeline_colab_legend_x)
              .attr("y", timeline_colab_legend_y)
              .attr("width", timeline_legend_width)
              .attr("height", timeline_legend_height)
              .attr("rx", 15)
              .attr("ry", 15)
              .attr("stroke", "white")
              .attr("fill", "black")
              .attr("stroke-width", 1);

    g.timeline.selectAll("timeline_colab_legend_label")
              .data(["No. of Collaborations"])
              .enter()
              .append("text")
              .attr("class", "label_text")
              .attr("x", timeline_colab_legend_x + (timeline_legend_width / 2))
              .attr("y", chart_height - timeline_legend_height + 1 - 10 + 20)
              .attr("alignment-baseline", "central")
              .attr("text-anchor", "middle")
              .attr("font-size", "16px")
              .text(function(d) { return d; });
    
    let x_start = timeline_colab_legend_x + (timeline_legend_width / 3) + 20;
    let x_end = timeline_colab_legend_x + (2 * timeline_legend_width / 3 + 20);
    let y_l0 = chart_height - timeline_legend_height + 1 - 10 + 20 + 50;
    let y_l1 = chart_height - timeline_legend_height + 1 - 10 + 20 + 100;
    let y_l2 = chart_height - timeline_legend_height + 1 - 10 + 20 + 150;

    let timeline_legend_data = [
        {
            "points": [
                        [x_start, y_l0],
                        [x_end, y_l0]
            ],
            "opacity": min_opacity,
            "text": min_weight
        },
        {
            "points": [
                        [x_start, y_l1],
                        [x_end, y_l1]
            ],
            "opacity": range_map(Math.floor((min_weight + max_weight) / 2), min_weight, max_weight, min_opacity, max_opacity),
            "text": Math.floor((min_weight + max_weight) / 2)
        },        
        {
            "points": [
                [x_start, y_l2],
                [x_end, y_l2]
            ],
            "opacity": max_opacity,
            "text": max_weight
        }
    ]
    g.timeline.selectAll("timeline_colab_legend_path")
            .data(timeline_legend_data)
            .enter()
            .append("path")
            .attr("class", "path")
            .attr('d', function(d) {
                return curve(d["points"]);
            })
            .attr('stroke', "white")
            .attr("stroke-width", 2)
            .attr("opacity", function(d) {
                return d["opacity"];
            })
            .attr('fill', 'none')
            .style("shape-rendering", "crispEdges");
    g.timeline.selectAll("timeline_colab_legend_text")
            .data(timeline_legend_data)
            .enter()
            .append("text")
            .attr("class", "chart_text")
            .attr("x", x_start - 20)
            .attr("y", function(d) {
                return d["points"][0][1];
            })
            .attr("alignment-baseline", "central")
            .attr("text-anchor", "end")
            .attr("font-size", "16px")
            .text(function(d) { return d["text"]; });


    g.cities.selectAll(".circle")
        .data(map_circles)
        .enter()
        .append("circle")
        .attr("class", "map_circle")
        .attr("cx", function(d) {
            return d["cx"];
        })
        .attr("cy", function(d) {
            return d["cy"];
        })
        .attr("r", function(d) {
            return d["radius"];
        })
        .attr("fill", function(d) {
            return d["color"];
        })
        .attr("opacity", function(d) {
            if (d["highlight"]) {
                return 0;
            }
            else {
                return 1;
            }
        })
        .attr("stroke-width", function(d) {
            if (d["stroke"])
                return 1;
            else
                return 0;
        })
        .attr("stroke", "black")

    
    map_nodes_lst.sort(function(a,b) {
        return b["num_years"] - a["num_years"];
    });


    let labelled_map_nodes = [];
    for (let i = 0; i < 16; i++) {
        labelled_map_nodes.push(map_nodes_lst[i]["placename"]);
    }


    let x_margin = 4;
    g.cities
      .selectAll("rect")
      .data(map_nodes_lst)
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr("class", "map_rect")
      .attr("x", function(d, i) {
            let lon = places[d["placename"]]["longitude"];
            let lat = places[d["placename"]]["latitude"];
            let text_width = getTextWidth(d["placename"], "16px arial") + x_margin;
            return projection([lon, lat])[0] - (text_width / 2);
        })
        .attr("y", function(d, i) {
            let lon = places[d["placename"]]["longitude"];
            let lat = places[d["placename"]]["latitude"];          
            
            let num_performances = d["num_years"];
            let radius = range_map(num_performances, min_val, max_val, min_node_size, max_node_size);
            return projection([lon, lat])[1] + radius + 3;
        })
        .attr("width", function(d) {
            return getTextWidth(d["placename"], "16px arial") + x_margin;
        })
        .attr("height", 18)
        .style("fill", "#faf9f0")
        .attr("stroke", "black")
        .attr("strokewidth", 1)
        .style("opacity", function(d) {
            if (labelled_map_nodes.includes(d["placename"])) {
                return 0.6;
            }
            else {
                return 0;
            }
        });


    g.cities.selectAll("text")
        .data(map_nodes_lst)
        .enter()
        .append("text")
        .attr("class", "chart_text")
        .attr("class", "map_text")
        .attr("x", function(d, i) {
            let lon = places[d["placename"]]["longitude"];
            let lat = places[d["placename"]]["latitude"];
            return projection([lon, lat])[0];
        })
        .attr("y", function(d, i) {
            let lon = places[d["placename"]]["longitude"];
            let lat = places[d["placename"]]["latitude"];          
            
            let num_performances = d["num_years"];
            let radius = range_map(num_performances, min_val, max_val, min_node_size, max_node_size);
            return projection([lon, lat])[1] + radius + 12;
        })
        
        .attr("alignment-baseline", "central")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text(function(d) { return d["placename"]; })
        .style("fill", "black")
        .style("cursor", "default")
        .style("opacity", function(d) {
            if (labelled_map_nodes.includes(d["placename"])) {
                return 1;
            }
            else {
                return 0;
            }
        });



    let legend_width = 220;
    let legend_height = 200;

    let legend_min_x = 0 + 20;
    let legend_min_y = chart_height - legend_height + 1 - 10;

    let circles_col = 20 + (legend_width / 2);

    let legend_text = [
        {
            "text": "No. of Performances",
            "x": circles_col,
            "y": chart_height - legend_height + 1 - 10 + 20
        }
    ];

    let circle_legend_data = [{
        "text": String(min_val),
        "radius": min_node_size,
        "cx": circles_col,
        "cy": chart_height - legend_height + 1 - 10 + 20 + 50,
        "y": chart_height - legend_height + 1 - 10 + 20 + 50
    },
    {
        "text": String(Math.floor((min_val + max_val) / 2)),
        "radius": Math.floor((min_node_size + max_node_size) / 2),
        "cx": circles_col,
        "cy": chart_height - legend_height + 1 - 10 + 20 + 100  - (Math.floor((min_node_size + max_node_size) / 2) / 2) + 3,
        "y": chart_height - legend_height + 1 - 10 + 20 + 100 - (Math.floor((min_node_size + max_node_size) / 2) / 2) + 3
    },
    {
        "text": String(max_val),
        "radius": max_node_size,
        "cx": circles_col,
        "cy": chart_height - legend_height + 1 - 10 + 20 + 150,
        "y": chart_height - legend_height + 1 - 10 + 20 + 150
    }];

    
    g.cities.selectAll(".rect")
        .data([0])
        .enter()
        .append("rect")
        .attr("x", legend_min_x)
        .attr("y", legend_min_y)
        .attr("width", legend_width)
        .attr("height", legend_height)
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("fill", "black")
        .attr("stroke", "white")
        .attr("stroke-width", 1);


    g.cities.selectAll(".text")
        .data(legend_text)
        .enter()
        .append("text")
        .attr("class", "label_text")
        .attr("x", function(d) {
        return d["x"];
        })
        .attr("y", function(d) {
        return d["y"];
        })
        .attr("alignment-baseline", "central")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text(function(d) { return d["text"]; });


    
    g.cities.selectAll(".circle")
          .data(circle_legend_data)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
              return d["cx"] + 20;
          })
          .attr("cy", function(d) {
            return d["cy"];
          })
          .attr("r", function(d) {
            return d["radius"];
          })
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("fill", "#faf9f0");
    
    g.cities.selectAll(".text")
          .data(circle_legend_data)
          .enter()
          .append("text")
          .attr("class", "chart_text")
          .attr("x", function(d) {
            return d["cx"] - 20;
          })
          .attr("y", function(d) {
            return d["y"];
          })
          .attr("alignment-baseline", "central")
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .text(function(d) { return d["text"]; });

}

function marker(color) {
    let val = "arrow-" + arrow_id;
    arrow_id++;
    map_svg.append("svg:defs").selectAll("marker")
         .data([val])
         .enter().append("svg:marker")    
         .attr("id", String(val))
         .attr("viewBox", "0 0 12 12")
         .attr("markerUnits", "strokeWidth")
         .attr("refX", -25)
         .attr("refY", 6)
         .attr("markerWidth", 18)
         .attr("markerHeight", 18)
         .attr("orient", "auto")
         .style("fill", color)
         .append("svg:path")
         .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
    return "url(#" +val+ ")";
}

function self_marker(color) {
    let val = "arrow-" + arrow_id;
    arrow_id++;
    map_svg.append("svg:defs").selectAll("marker")
         .data([val])
         .enter().append("svg:marker")    
         .attr("id", String(val))
         .attr("viewBox", "0 0 12 12")
         .attr("markerUnits", "strokeWidth")
         .attr("refX", 6)
         .attr("refY", 6)
         .attr("markerWidth", 18)
         .attr("markerHeight", 18)
         .attr("orient", "auto")
         .style("fill", color)
         .append("svg:path")
         .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
    return "url(#" +val+ ")";

}



function draw_map_edges(map_nodes_lst, map_edges_lst) {

    let bundle = generate_segments(map_nodes_lst, map_edges_lst);

    let line = d3.line()
                 .curve(d3.curveBundle)
                 .x(d => d.x)
                 .y(d => d.y);

    let links = g.cities.selectAll("path")
                 .data(bundle.paths)
                 .enter()
                 .append("path")
                 .attr("class", "map_curve")
                 .attr("d", line)
                 .attr("fill", "none")
                 .attr("stroke-width", 1)
                 .attr("opacity", 0.9)
                 .attr("marker-start", function(d, i) {
                    let c = map_edges_lst[i]["color"];
                    return marker("rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")");
                  })
                 .attr("stroke-linecap", "round")
                 .attr("stroke", function(d, i) {
                    let c = map_edges_lst[i]["color"];
                    return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")";
                });

    let layout = d3.forceSimulation()
                   .alphaDecay(0.1)
                   .force("charge", d3.forceManyBody()
                        .strength(1) //4.75)
                        .distanceMax(450)
                    )
                    .force("link", d3.forceLink()
                        .strength(0.09)
                        .distance(5.1)
                    )
                    .on("tick", function(d) {
                        links.attr("d", line)
                    })
                    .on("end", function(d) {
                        $("#librettist_combo").prop("disabled", false);
                        $("#composer_combo").prop("disabled", false);
                        $("#opera_combo").prop("disabled", false);
                        $("#slider-range").slider("enable");
                    });

    
    layout.nodes(bundle.nodes).force("link").links(bundle.links);
}

function generate_segments(map_nodes_lst, map_edges_lst) {

    let bundle = {nodes: [], links: [], paths: []};

    bundle.nodes = map_nodes_lst.map(function(d, i) {
        d.fx = d.x;
        d.fy = d.y;
        return d;
    });

    map_edges_lst.forEach(function(d, i) {

        let length = distance(d.source, d.target);

        let total = Math.round(scales.segments(length));

        let xscale = d3.scaleLinear()
                       .domain([0, total+1])
                       .range([d.source.x, d.target.x]);
        let yscale = d3.scaleLinear()
                       .domain([0, total+1])
                       .range([d.source.y, d.target.y]);

        let source = d.source;
        let target = null;

        let local = [source];

        for (let j = 1; j <= total; j++) {
            target = {
                x: xscale(j),
                y: yscale(j)
            };
            local.push(target);
            bundle.nodes.push(target);
            bundle.links.push({
                source: source,
                target: target
            });
            source = target;
        }

        local.push(d.target);

        bundle.links.push({
            source: target,
            target: d.target
        });

        bundle.paths.push(local);
    });

    return bundle;

}



// calculates the distance between two nodes
// sqrt( (x2 - x1)^2 + (y2 - y1)^2 )
function distance(source, target) {
    const dx2 = Math.pow(target.x - source.x, 2);
    const dy2 = Math.pow(target.y - source.y, 2);
  
    return Math.sqrt(dx2 + dy2);
  }