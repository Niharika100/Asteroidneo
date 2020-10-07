// To get the query search string
const queryString = window.location.search;

// Get the list of Parameter(from_date & to_date)
const urlParams = new URLSearchParams(queryString);

// Get the value of Sdate parameter from URL
const from_date = urlParams.get('Sdate');
// Get the value of Sdate parameter from URL
const to_date = urlParams.get('Edate');

// console.log("Fdate: " + from_date + " TDate: " + to_date);

// variable
nearestAsteroid = [];
fastestAsteroid = [];

// Display the Chart
doChart();
async function doChart() {
  // Call the getData to retrieve the required information from the API text file
  const data1 = await getData();
  var ctx = document.getElementById('chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data1.date,
      datasets: [{
        label: ' Number of Asteroids passing near the Earth each day',
        data: data1.no_of_objects,
        backgroundColor:
          'rgba(153, 102, 255, 0.2)',
        borderColor:
          'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: false,
      }]
    }
  });
}

async function getData() {
  const no_of_objects = [];
  const date = [];
  const Heights = [];
  const Asteroids = [];
  var size = 0;
  
  const data = await server_response();

  const date_array = await data.near_earth_objects;
  // number of asteroids count
  const elementCount = data.element_count;
  // console.log(date_array);

  for (x in date_array) {
    // number of objects each day
    no_of_objects.push(date_array[x].length);
    date.push(x);

    // for storing the heights and the speed
    for (y in date_array[x]) {
      Heights.push(date_array[x][y].close_approach_data[0].miss_distance.kilometers);
      Asteroids.push(date_array[x][y].close_approach_data[0].relative_velocity.kilometers_per_hour);
      size += date_array[x][y].estimated_diameter.kilometers.estimated_diameter_max;
    }
  }
  const avgSize = size / elementCount;

  // find minimum height logic
  Array.min = function (Heights) {
    return Math.min.apply(Math, Heights);
  };
  var minimum = Array.min(Heights);
  // console.log(minimum);

  // find maximum speed logic
  Array.max = function (Asteroids) {
    return Math.max.apply(Math, Asteroids);
  };
  var maximum = Array.max(Asteroids);


  // find minimum height object and max speed object logic
  for (x in date_array) {
    for (y in date_array[x]) {
      if (date_array[x][y].close_approach_data[0].miss_distance.kilometers == minimum) {
        nearestAsteroid.push(date_array[x][y].name);
      }
      if ((date_array[x][y].close_approach_data[0].relative_velocity.kilometers_per_hour) == maximum) {
        fastestAsteroid.push(date_array[x][y].name);
      }
    }
  }

  // display
  document.getElementById('fastest').innerHTML = `${fastestAsteroid}`
  document.getElementById('nearest').innerHTML = `${nearestAsteroid}`
  document.getElementById('average').innerHTML = `${avgSize.toFixed(3)} Km`
  
  return { no_of_objects, date };
}


// server call to fetch data
async function server_response(){
  const data = {from_date, to_date};
  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};
  const response = await fetch('/neo',options);
  const val = await response.json();
  console.log(val);
  return val;
}