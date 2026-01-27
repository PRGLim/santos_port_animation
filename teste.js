//vars
var currentTick = 0;
var t = 0;
var initialSpeedFactor = 1;
var sp = initialSpeedFactor; //intial speed factor. hoursPerFrame * sp equals the hours per tick/frame
var paused = false;
var startDate, endDate;
var ships = [];
var currTime, cT;
var sliderdiv, timeslider;
var map;
var routes = [];
var r = 0;
var selectedItem = [];
var graphHide = false;
var kpiHide = false;
var originalWidth = window.innerWidth;
var newWidth;
var widthScale = 0;
var iconHtml;
var accessToken =
  "pk.eyJ1IjoiaXZvbWFqb29yIiwiYSI6ImNsa3V2emNzMDB0cTkzanBwZXYwbzgxZjYifQ.Adx8h8_XLLCJD8a4N5a8MQ"; //mapbox access token - get at mapbox
var tileLayer = "hkoopstra.55ffdd36"; //mapbox tile layer - get at mapbox;
var isSliding = false;
var dataRaw = {};
var numberTicks = 0;
var shipsData = [];
var locationsData = [];
var shipsDataTick = {};
var mapLoaded = false;
var shipTypes = [];
var queueWaiting = {};
var currentTimeUnix = 0;
var scenarioStartMoment;

let teste = {};

let maneuvers = [];
let animationManeuvers = [];

function gradualAngleCalculator(currentAngle, targetAngle, turnRate = 2) {
  // Normaliza os ângulos para 0–360
  currentAngle = (currentAngle + 360) % 360;
  targetAngle = (targetAngle + 360) % 360;

  // Diferença entre o atual e o desejado
  let angleDiff = targetAngle - currentAngle;

  // Pega o menor caminho (clockwise ou anti-clockwise)
  if (angleDiff > 180) {
    angleDiff -= 360;
  } else if (angleDiff < -180) {
    angleDiff += 360;
  }

  // Decide o próximo ângulo
  let newAngle;
  if (Math.abs(angleDiff) <= turnRate) {
    // Se já está perto, fixa no alvo
    newAngle = targetAngle;
  } else {
    // Se não, gira gradualmente
    if (angleDiff > 0) {
      newAngle = currentAngle + turnRate;
    } else {
      newAngle = currentAngle - turnRate;
    }
  }

  // Normaliza novamente para 0–360
  return (newAngle + 360) % 360;
}

// Otimizado: função de ângulo simples como no primeiro código
function angleCalculator(lon1, lat1, lon2, lat2) {
  // Convert degrees to radians
  const toRadians = (deg) => (deg * Math.PI) / 180;

  // Convert the input coordinates to radians
  const lon1Rad = toRadians(lon1);
  const lat1Rad = toRadians(lat1);
  const lon2Rad = toRadians(lon2);
  const lat2Rad = toRadians(lat2);

  // Compute the difference in longitudes
  const deltaLon = lon2Rad - lon1Rad;

  // Calculate the bearing using the formula
  const x = Math.sin(deltaLon) * Math.cos(lat2Rad);
  const y =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
  let bearing = Math.atan2(x, y);

  // Convert bearing from radians to degrees
  bearing = (bearing * 180) / Math.PI;

  // Normalize the bearing to a range of 0 to 360 degrees
  bearing = (bearing + 360) % 360;

  return bearing;
}

async function createAnimation() {
  $("#controls .hideText").text("Hide Extra");

  showHideGraph(0);
  showHideKPI(0);
  await initMap();
  await getScenarioStartDate();
  await getRoutes();
  await getManeuvers();
  await getDefManeuvers();
  await getShipTypes();
  await getShipLog();
  parseShipLog();
  parseDataPerTick();

  if (mapLoaded) {
    finishedLoading();
  } else {
    window.addEventListener("mapLoaded", function () {
      finishedLoading();
    });
  }
  requestAnimationFrame(tick);
}


async function getRoutes() {
  const url = sn.getTableDataURL(routesTable, 1, "json");
  console.log("getting routes", url);

  try {
    const raw = await fetch(url).then((res) => res.json());
    if (raw.length === 0) {
      alert("No routes found in " + routesTable);
    }
    routes = _.groupBy(raw, "R");

    //calculate distances
    _.each(routes, function (r) {
      var prevX = 0,
        prevY = 0,
        currX = 0,
        currY = 0,
        totDist = 0,
        deltaTime = 0,
        dist = 0;
      _.each(r, function (s, i) {
        r.P = s.P == "false" ? false : true;
        currX = s.X !== undefined ? s.X : s.Lon;
        currY = s.Y !== undefined ? s.Y : s.Lat;

        if (s["S"] > 1) {
          dist = distance(prevY, prevX, currY, currX);
          s.dist = dist;
          totDist += dist;
        }
        prevX = currX;
        prevY = currY;
        if (i === r.length - 1) {
          r.waitingShipHeading = s["ShipWaitingAngle"];
          r.waitingShipOffsetX = s["ShipWaitingOffsetX"];
          r.waitingShipOffsetY = s["ShipWaitingOffsetY"];
        }
      });
      r.totalDistance = totDist;
      
    });
    console.log("routessss:")
    console.log(routes)
  } catch (error) {
    console.error("Error fetching routes:", error);
  }

}

// Resto do código mantido igual ao segundo, apenas com as otimizações de performance aplicadas
function parseShipLog() {
  const t0 = new Date();
  const shipID = shipLog.columns.shipID;
  ships = _.groupBy(dataRaw["shipLog"], shipID);
  _.forEach(ships, function (dataVoyages, shipID) {
    const voyages = _.map(dataVoyages, function (v, i) {
      const routeID = v[shipLog.columns.route];
      const route = routes[routeID];
      if (route === undefined) {
        console.warn(
          "Ship ID",
          shipID,
          "could not find routeID",
          routeID,
          "available routes:",
          routes
        );
      }
      const dir = +v[shipLog.columns.direction];
      const isPort = route.P;
      const waitingShipDir = routes[routeID].waitingShipHeading;
      const waitingShipOffsetX = routes[routeID].waitingShipOffsetX;
      const waitingShipOffsetY = routes[routeID].waitingShipOffsetY;
      const description = v[shipLog.columns.description];
      const startTime = scenarioStartMoment + +v[shipLog.columns.time] * 3600; // PANAMA is using hours
      const duration = +v[shipLog.columns.duration]; // in days
      const endTime = startTime + duration * 24 * 3600;

      let voyage = {
        start: startTime,
        end: endTime,
        duration: duration,
        description: description.split(" /n "),
        routeID: routeID,
        isPort: isPort == 1 ? true : false,
        direction: dir,
        waitingShipDirection: waitingShipDir,
        waitingShipOffsetX: waitingShipOffsetX,
        waitingShipOffsetY: waitingShipOffsetY,
        waypoints: [],
        currentHeading: null,
      };

      let deltaTime = 0; //deltaTime in days

      //loop over route segments
      for (let s = 0; s < route.length; s++) {
        if (dir === 1) i = s;
        else i = route.length - s - 1;

        if (s > 0) {
          if (dir === 1)
            deltaTime += (duration * route[i].dist) / route.totalDistance;
          else
            deltaTime += (duration * route[i + 1].dist) / route.totalDistance;
        }

        const wp = {
          t: startTime + deltaTime * 24 * 3600,
          coords: { x: +route[i]["X"], y: +route[i]["Y"] },
        };

        voyage.waypoints.push(wp);
      }
      return voyage;
    });

    // find ship type
    const type = _.find(shipTypes, (d) => {
      return d["ID"] === shipID;
    });

    ships[shipID] = {
      name: type["Name"],
      sch: type["SCH"],
      typeID: type["TypeID"],
      typeName: type["TypeName"],
      color: colors[type["TypeID"]],
      voyages: voyages,
      timeOfFirstWaypoint: _.minBy(voyages, "start")["start"],
      timeOfLastWaypoint: _.maxBy(voyages, "end")["end"],
    };
  });

  const earliest = _.minBy(_.map(ships, "timeOfFirstWaypoint"));
  const latest = _.max(_.map(ships, "timeOfLastWaypoint"));
  startDate = moment.unix(earliest);
  endDate = moment.unix(latest);
  numberTicks = Math.ceil((latest - earliest) / 3600 / hoursPerFrame);

  //Add the time slider
  sliderdiv = d3.select("#slider");
  sliderdiv.call(
    (timeslider = d3
      .slider()
      .min(1)
      .max(endDate.diff(startDate, "hours") / hoursPerFrame)
      .on("slide", function (evt, value) {
        currentTick = value + 1;
        isSliding = true;
        if (paused) {
          paused = false;
          tick();
        }
      }))
  );

  console.log("parsing ship log done in", (new Date() - t0) / 1000, "seconds");
}

function parseDataPerTick(tick) {
  if (!tick) tick = 0;

  shipsDataTick = {};
  queueWaiting = {};
  currentTimeUnix = moment(startDate)
    .add(tick * hoursPerFrame, "hours")
    .unix();
  const time = currentTimeUnix;
  _.forEach(ships, (d, id) => {
    if (time >= d.timeOfFirstWaypoint && time <= d.timeOfLastWaypoint) {
      if (shipsDataTick[id] === undefined) {
        shipsDataTick[id] = [];
        d.id = id;
      }

      ships[id]["waiting"] = false;
      let rv;

      if (isSliding || d.cv === -1) {
        d.cv = relevantVoyage(d.voyages, time);
        console.log("Queue Waiting", queueWaiting);
        console.log("ID", id);
        console.log("Ship", ships[id]);
        console.log("CV", d.cv);
        if (time <= d.voyages[d.cv].end) {
          rv = d.voyages[d.cv];
        } else {
          console.log("ID waiting", id);
          //shipWaiting();
        }
      } else {
        if (d.cv === undefined) {
          d.cv = 0;
          d.cw = 0;
        }
        if (time >= d.voyages[d.cv].start && time <= d.voyages[d.cv].end) {
          rv = d.voyages[d.cv];
        } else if (
          d.cv + 1 < d.voyages.length &&
          time >= d.voyages[d.cv + 1].start
        ) {
          for (let i = d.cv + 1; i < d.voyages.length; i++) {
            if (time >= d.voyages[i].start) {
              d.cv++;
              if (time <= d.voyages[d.cv].end) {
                rv = d.voyages[d.cv];
                d.cw = 0;
                break;
              }
            } else break;
          }
        } else {
          shipWaiting();
        }
      }

      function shipWaiting() {
        ships[id]["waiting"] = true;
        rv = undefined;
        const coords =
          d.voyages[d.cv].waypoints[d.voyages[d.cv].waypoints.length - 1]
            .coords;
        const location =
          Math.round(coords.x * 10000) + "_" + Math.round(coords.y * 10000);
        if (queueWaiting[location] === undefined) queueWaiting[location] = [];
        // console.log(
        //   "Teste",
        //   teste[(d.voyages[d.cv].routeID, d.voyages[d.cv].direction)]
        // );
        if (d.voyages[d.cv].isPort) {
          const key = `${id}_${d.voyages[d.cv].direction}`;
          ships[id]["heading"] =
            maneuvers[animationManeuvers[key].maneuver].angle;
          // ships[id]["heading"] =
          //   teste[(id, d.voyages[d.cv].routeID, d.voyages[d.cv].direction)];
        }
        // if (d.voyages[d.cv].waitingShipDirection !== undefined) {
        //   ships[id]["heading"] = d.voyages[d.cv].waitingShipDirection;
        // }
        queueWaiting[location].push(d);
      }

      if (rv !== undefined) {
        let rw = [];
        if (isSliding) {
          d.cw = getRelevantWaypoints(rv.waypoints, time);
          rw[0] = rv.waypoints[d.cw];
          rw[1] = rv.waypoints[d.cw + 1];
        } else {
          if (
            d.cw + 1 < rv.waypoints.length &&
            time >= rv.waypoints[d.cw + 1].t
          )
            d.cw++;
          rw[0] = rv.waypoints[d.cw];
          rw[1] = rv.waypoints[d.cw + 1];
        }

        if (!rw[1]) {
          shipsDataTick[id] = [rw[0].coords.x, rw[0].coords.y];
        } else {
          shipsDataTick[id] = interpWaypoints(time, rw[0], rw[1]);
          const key = `${id}_${rv.direction}`;
          if (
            animationManeuvers[key] !== undefined &&
            animationManeuvers[key].route == rv.routeID &&
            animationManeuvers[key].direction == rv.direction
          ) {
            ships[id]["heading"] = gradualAngleCalculator(
              ships[id]["heading"],
              maneuvers[animationManeuvers[key].maneuver].angle,
              1
            );
          } else if (!rv.isPort) {
            ships[id]["heading"] = angleCalculator(
              rw[0].coords.x,
              rw[0].coords.y,
              rw[1].coords.x,
              rw[1].coords.y
            );
          }
        }

        teste[(id, rv.routeID, rv.direction)] = ships[id]["heading"];
      }
    } else {
      d.cv = undefined;
    }
  });

  if (isSliding) isSliding = false;


  // OTIMIZADO: Sistema de fila mais simples
  _.forEach(queueWaiting, (queue, location) => {
    const queueSorted = _.sortBy(queue, (d) => d.voyages[d.cv].start);
    _.forEach(queueSorted, (d, i) => {
      const coords =
        d.voyages[d.cv].waypoints[d.voyages[d.cv].waypoints.length - 1].coords;
      let point = map.project([coords.x, coords.y]);
      point.x = point.x + i * 7;
      const newCoords = map.unproject(point);
      shipsDataTick[d.id] = [newCoords["lng"], newCoords["lat"]];
    });
  });
}


function tick() {
  //update current time:
  currTime = moment(startDate).add(currentTick * hoursPerFrame, "hours");
  $("#controls .time").text(currTime.format("DD-MM-YYYY HH:mm"));

  // get data for all ship at current tick
  shipsData.data.features = [];

  for (const id in shipsDataTick) {
    var currentVoyage = ships[id].voyages[ships[id].cv];
    shipsData.data.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: shipsDataTick[id],
      },

      properties: {
        id: id,
        name: ships[id].sch,
        color: ships[id].color,
        waiting: ships[id]["waiting"],
        heading: ships[id].heading,
      },
    });
  }

  // draw ships on map
  map.getSource("source_ships").setData(shipsData.data);

  // update slide and time line
  timeslider.value(currentTick);
  d3.select(".d3-slider").style(
    "background-size",
    (currentTick / (endDate.diff(startDate, "hours") / hoursPerFrame)) * 100 +
      "% 100%"
  );

  //redraw the time line
  var x = window.innerWidth;
  var bottomXScale = d3.time.scale().domain([startDate, endDate]).range([0, x]);
  var bottomGraph = d3.select("#bottomgraph").transition();
  var timelineX = bottomXScale(
    startDate + (currentTick / (1 / hoursPerFrame)) * 60 * 60 * 1000
  );
  bottomGraph
    .select(".timeline")
    .duration(0)
    .attr("x1", timelineX)
    .attr("x2", timelineX);

  // update kpi panel
  //updateSelectedKPIPane();

  // parse and play next tick
  if (!paused) currentTick = currentTick + sp;
  if (currentTick < numberTicks && !paused) {
    parseDataPerTick(currentTick);
    requestAnimationFrame(tick);
  }
}

//Interpolate waypoints
function interpWaypoints(time, prev, next) {
  const perc = Math.min((time - prev.t) / (next.t - prev.t), 1);
  const x = +prev.coords.x + (next.coords.x - prev.coords.x) * perc;
  const y = +prev.coords.y + (next.coords.y - prev.coords.y) * perc;
  return [x, y];
}

//Find the voyage that match the current time, only used when sliding time
function relevantVoyage(voyages, time) {
  return _.findLastIndex(voyages, function (v) {
    return time >= v.start;
  });
}

//Find the waypoints that match the current time, only used when sliding time
function getRelevantWaypoints(v, time) {
  for (let i = 0; i < v.length - 1; i++) {
    if (v[i].t < time && time <= v[i + 1].t) {
      return i;
    }
  }
}

