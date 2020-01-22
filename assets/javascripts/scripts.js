var current_coords;

function position_success(position) {
  current_coords = [position.coords.latitude, position.coords.longitude];
  sortRestaurants("location");
}

function position_error(error) {
  console.warn("Could not get current position (" + error.code + "): " + error.message);
  window.history.back();
}

function sortRestaurants(sortKey) {
  var parent = document.getElementById("restaurant-overview");
  var children = parent.getElementsByClassName("restaurant");
  var ids = [];
  var obj, i;

  for (i = 0; i < children.length; i++) {
    obj = {};
    obj.element = children[i];
    sort_param = children[i].getAttribute("data-" + sortKey);
    if (sortKey == "location") {
      if (sort_param) {
        restaurant_coords = JSON.parse(sort_param);
        distance = haversine(current_coords, restaurant_coords, {
          unit: "mile",
          format: "[lat,lon]"
        });
        obj.key = distance;
      } else {
        obj.key = 12450.7305;
      }
    } else {
      obj.key = sort_param;
    }
    ids.push(obj);
  }

  // sort descending
  ids.sort((a, b) => (a.key < b.key ? 1 : -1));

  if (sortKey == "location") {
    // sort ascending
    ids = ids.reverse();
  }

  for (i = 0; i < ids.length; i++) {
    parent.appendChild(ids[i].element);
  }
}

function sortEvent() {
  var sortKey;
  if (location.hash) {
    sortKey = location.hash.substr(1);
  } else {
    sortKey = "date";
  }

  if (sortKey == "location") {
    navigator.geolocation.getCurrentPosition(position_success, position_error);
  } else {
    sortRestaurants(sortKey);
  }

  document
    .getElementById("nav-bar")
    .querySelectorAll("a")
    .forEach(a => a.classList.remove("highlight"));
  document.getElementById(sortKey + "-link").classList.add("highlight");
}

if (window.location.pathname == "/") {
  window.onload = sortEvent;
  window.onhashchange = sortEvent;
}
