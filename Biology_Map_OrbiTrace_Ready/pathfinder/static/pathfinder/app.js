const COLORS={BFS:"#3778f6",DFS:"#8b5cf6",Dijkstra:"#16a579","A*":"#f08b35"};
let map, markers={}, polylines=[], directions, isLeaflet=false;

function initMap(){
 const center={lat:23.755,lng:90.405};
 map=new google.maps.Map(document.getElementById("map"),{center,zoom:12,mapTypeControl:false,streetViewControl:false,fullscreenControl:true,styles:[
 {featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},
 {featureType:"transit",elementType:"labels",stylers:[{visibility:"off"}]},
 {featureType:"landscape",elementType:"geometry",stylers:[{color:"#f2f5f9"}]},
 {featureType:"water",elementType:"geometry",stylers:[{color:"#dce9f5"}]},
 {featureType:"road",elementType:"geometry",stylers:[{color:"#ffffff"}]},
 {featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#dce2ea"}]}
 ]});
 directions=new google.maps.DirectionsService();
 const bounds=new google.maps.LatLngBounds();
 Object.entries(GRAPH_NODES).forEach(([id,n])=>{
  const pos={lat:n.lat,lng:n.lng};bounds.extend(pos);
  const marker=new google.maps.Marker({position:pos,map,title:n.name,label:{text:id.replace("n",""),color:"#334155",fontSize:"10px"},icon:{path:google.maps.SymbolPath.CIRCLE,scale:7,fillColor:"#fff",fillOpacity:1,strokeColor:"#4678c8",strokeWeight:2}});
  marker.addListener("click",()=>handleMarkerClick(id));
  markers[id]=marker;
 });
 map.fitBounds(bounds);
 setupUI();
}

function initLeafletMap(){
 isLeaflet=true;
 map=L.map('map').setView([23.775, 90.405], 12);
 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
 }).addTo(map);
 const bounds=[];
 Object.entries(GRAPH_NODES).forEach(([id,n])=>{
  const pos=[n.lat, n.lng];
  bounds.push(pos);
  const marker=L.circleMarker(pos, {
   radius: 8,
   fillColor: "#ffffff",
   color: "#3778f6",
   weight: 2.5,
   opacity: 1,
   fillOpacity: 1
  }).addTo(map);
  marker.bindTooltip(`${id.replace("n","")}. ${n.name}`, {permanent: false, direction: 'top'});
  marker.on('click', ()=>handleMarkerClick(id));
  markers[id]=marker;
 });
 if(bounds.length) map.fitBounds(bounds, {padding:[30,30]});
 setupUI();
 setStatus("Map ready (No API key needed). Select nodes or click markers.");
}

function handleMarkerClick(id){
 const s=document.getElementById("start"),g=document.getElementById("goal");
 if(!window.pickNext||window.pickNext==="start"){
  s.value=id;window.pickNext="goal";
  setStatus(`Source set to ${GRAPH_NODES[id].name}. Click another marker for destination.`);
 }else{
  g.value=id;window.pickNext="start";
  setStatus(`Destination set to ${GRAPH_NODES[id].name}. Ready to run.`);
 }
}

function setupUI(){
 populateSelects();
 document.getElementById("runBtn").addEventListener("click",runComparison);
}

function populateSelects(){
 const s=document.getElementById("start"), g=document.getElementById("goal");
 s.innerHTML=""; g.innerHTML="";
 for(const id of Object.keys(GRAPH_NODES)){
  for(const sel of [s, g]){
   const o=document.createElement("option");
   o.value=id;
   o.textContent=`${GRAPH_NODES[id].name} (${id})`;
   sel.appendChild(o);
  }
 }
 s.value="n1";
 g.value="n15";
}

function setStatus(t){document.getElementById("status").textContent=t}

function clearRoutes(){
 if(isLeaflet){
  polylines.forEach(p=>map.removeLayer(p));
 }else{
  polylines.forEach(p=>p.setMap(null));
 }
 polylines=[];
}

async function runComparison(){
 const btn=document.getElementById("runBtn"),start=document.getElementById("start").value,goal=document.getElementById("goal").value,algorithm=document.getElementById("algorithm").value;
 document.getElementById("activeAlgorithmLabel").textContent=algorithm;
 document.getElementById("activeLegend").className="line "+({BFS:"blue",DFS:"violet",Dijkstra:"green","A*":"orange"}[algorithm]);
 btn.disabled=true;btn.innerHTML="<span>Computing routes…</span><span>◌</span>";setStatus(`Running ${algorithm} and preparing comparison…`);clearRoutes();
 try{
  const response=await fetch("/api/compare/",{method:"POST",headers:{"Content-Type":"application/json","X-CSRFToken":getCookie("csrftoken")},body:JSON.stringify({start,goal,algorithm})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"Request failed");
  renderMainResult(data.results,algorithm);renderCards(data.results);document.getElementById("summary").textContent=`${algorithm} · ${start.toUpperCase()} → ${goal.toUpperCase()}`;
  const selectedResult=data.results.find(r=>r.algorithm===algorithm);
  if(selectedResult&&selectedResult.found)await drawRoadPath(selectedResult.path,COLORS[selectedResult.algorithm]);
  setStatus(`${algorithm} route displayed on map. All four results are below.`);
 }catch(e){setStatus(e.message);console.error(e)}
 finally{btn.disabled=false;btn.innerHTML="<span>Run selected algorithm</span><span>↗</span>"}
}

function renderMainResult(results, selectedAlgorithm){
 const container=document.getElementById("mainResult");
 const r=results.find(item=>item.algorithm===selectedAlgorithm);
 if(!r){container.innerHTML='<article class="result-card">No selected result.</article>';return;}
 const color=COLORS[r.algorithm],path=r.path.map(id=>GRAPH_NODES[id].name).join(" → ");
 container.innerHTML=`<article class="result-card main-card">
  <div class="card-top"><span class="algo-dot" style="background:${color}"></span><b>${r.algorithm} · Selected result</b><span class="tag ${r.found?'found':'notfound'}">${r.found?'FOUND':'NO PATH'}</span></div>
  <div class="metrics"><div class="metric"><label>PATH COST</label><strong>${r.cost===null?'—':r.cost}</strong></div><div class="metric"><label>VISITED NODES</label><strong>${r.visited_count}</strong></div><div class="metric"><label>EXECUTION TIME</label><strong>${r.execution_ms}<small> ms</small></strong></div><div class="metric"><label>PATH LENGTH</label><strong>${r.path.length}</strong></div></div>
  <div class="pathtext">${r.found?path:'No path found.'}</div></article>`;
}

function renderCards(results){
 const cards=document.getElementById("cards");cards.innerHTML="";
 results.forEach(r=>{
  const color=COLORS[r.algorithm];
  const card=document.createElement("article");card.className="mini-card";
  card.innerHTML=`<div class="mini-title"><span class="algo-dot" style="background:${color}"></span><b>${r.algorithm}</b><span class="tag ${r.found?'found':'notfound'}">${r.found?'FOUND':'—'}</span></div>
   <div class="mini-stats"><span>Cost <b>${r.cost===null?'—':r.cost}</b></span><span>Visited <b>${r.visited_count}</b></span><span>Time <b>${r.execution_ms} ms</b></span></div>`;
  cards.appendChild(card);
 });
}

async function drawRoadPath(path,color){
 if(isLeaflet){
  const latlngs=path.map(id=>[GRAPH_NODES[id].lat, GRAPH_NODES[id].lng]);
  const line=L.polyline(latlngs, {color: color, weight: 5, opacity: 0.9}).addTo(map);
  polylines.push(line);
  map.fitBounds(line.getBounds(), {padding:[40,40]});
  return;
 }
 if(path.length===1){polylines.push(new google.maps.Polyline({map,path:[markers[path[0]].getPosition()],strokeColor:color,strokeWeight:6}));return}
 for(let i=0;i<path.length-1;i++){
  const a=GRAPH_NODES[path[i]],b=GRAPH_NODES[path[i+1]];
  try{
   const result=await new Promise((resolve,reject)=>directions.route({origin:{lat:a.lat,lng:a.lng},destination:{lat:b.lat,lng:b.lng},travelMode:google.maps.TravelMode.DRIVING},(res,status)=>status==="OK"?resolve(res):reject(status)));
   const points=[];result.routes[0].legs.forEach(leg=>leg.steps.forEach(step=>step.path.forEach(p=>points.push(p))));
   polylines.push(new google.maps.Polyline({map,path:points,strokeColor:color,strokeOpacity:.88,strokeWeight:5,zIndex:4}));
  }catch(err){
   polylines.push(new google.maps.Polyline({map,path:[{lat:a.lat,lng:a.lng},{lat:b.lat,lng:b.lng}],strokeColor:color,strokeOpacity:.85,strokeWeight:4,zIndex:3}));
  }
 }
}

function getCookie(name){let v=null;if(document.cookie){document.cookie.split(";").forEach(c=>{c=c.trim();if(c.startsWith(name+"="))v=decodeURIComponent(c.substring(name.length+1))})}return v}
window.initMap=initMap;
window.initLeafletMap=initLeafletMap;
