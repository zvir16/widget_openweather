window.onload = function(){
  var weatherCurrent = document.getElementById('weather-current'),
      weatherForecast = document.getElementById('weather-5day'),
      weatherSearch = document.getElementById('weather-search');

// геолокация
  (function geo(){
        if ("geolocation" in navigator) {
      /* геолокация доступна */
      navigator.geolocation.getCurrentPosition(function(position) {
        var url = `https://api.openweathermap.org/data/2.5/weather?lat=` + position.coords.latitude + `&lon=` + position.coords.longitude + `&appid=85abf1d92c7ee9dc5c6a71a51201d5cc&units=metric`
            url4 = `https://api.openweathermap.org/data/2.5/forecast?lat=` + position.coords.latitude + `&lon=` + position.coords.longitude + `&appid=85abf1d92c7ee9dc5c6a71a51201d5cc&units=metric`;
          jsonpRequest(url, showCurrentWeather, fail);
          jsonpRequest(url4, showForecastWeather, fail);
          });
        } else {
      /* геолокация НЕдоступна */
    }
  })();
//обробка запитів з форми
  weatherSearch.addEventListener('submit', function(e){
        e.preventDefault();
    var url1 = `https://api.openweathermap.org/data/2.5/weather?q=` + e.target[0].value + `&appid=85abf1d92c7ee9dc5c6a71a51201d5cc&units=metric`,
        url2 =  `https://api.openweathermap.org/data/2.5/forecast?q=` + e.target[0].value + `&appid=85abf1d92c7ee9dc5c6a71a51201d5cc&units=metric`;

        jsonpRequest(url1, showCurrentWeather, fail);
        jsonpRequest(url2, showForecastWeather, fail);
        e.target[0].value = '';
      });

// запрос jsonp
    function jsonpRequest(url, onSuccess, onError) {
        var scriptOk = false,
            callbackName = 'cb' + String(Math.random()).slice(-6);
        url += ~url.indexOf('?') ? '&' : '?';
        url += 'callback=' + callbackName;

        // устанвока флага, удаление скрипта
        window[callbackName] = function(data) {
          scriptOk = true;
          delete window[callbackName];
          script.parentNode.removeChild(script);
          onSuccess(data);
        };
        // проверка отправки запроса даних
        function checkCallback() {
          if (scriptOk) return; //  обработчик?
          delete window[callbackName];
          script.parentNode.removeChild(script);
          onError(url); // нет - вызвать onError
        }
        var script = document.createElement('script');
        //запусе проверки отправки запроса
        script.onreadystatechange = function() {
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
            this.onreadystatechange = null;
            setTimeout(checkCallback, 0); // Вызвать checkCallback - после скрипта
          }
        }
        script.onload = script.onerror = checkCallback;
        script.src = url;
        document.body.appendChild(script);
      };
      // отрисовка блока погоди
      function showCurrentWeather(data) {
        weatherCurrent.innerHTML = '';
        var template = `<div class="weather-current-head">
          <div class=" weather-current-row">
            <h3>Weather in ` + data.name + `, `+ data.sys.country + `</h3>
          </div>
          <div class="weather-current-row">
            <img src="http://openweathermap.org/img/w/` + data.weather[0].icon + `.png" alt="1.jpg">
            <span>` + +data.main.temp.toFixed(1) + `&degC</span>
          </div>
          <div class="weather-current-row">
            <span>` + data.weather[0].main + `</span>
          </div>
          <div class="weather-current-row">
            <span>` + convertDate(data.dt, false) + `&nbsp</span>
            <span><a href='#'>Wrong data?</a></span>
          </div>
        </div>
        <div class="weather-current-table">
          <table>
            <tr>
              <td>Wind</td>
              <td>
              <span>` + data.wind.speed + ` m/s</span><br>
              <span> ` + data.wind.deg + ` &deg </span>
              </td>
            </tr>
            <tr>
              <td>Cloudiness</td>
              <td>` + data.clouds.all + `%</td>
            </tr>
            <tr>
              <td>Pressure</td>
              <td>` + data.main.pressure + ` hpa</td>
            </tr>
            <tr>
              <td>Humidity</td>
              <td>` + data.main.humidity + ` %</td>
            </tr>
            <tr>
              <td>Sunrise</td>
              <td>` + convertDate(data.sys.sunrise, true) + `</td>
            </tr>
            <tr>
              <td>Sunset</td>
              <td>` + convertDate(data.sys.sunset, true) + `</td>
            </tr>
            <tr>
              <td>Geo cord.</td>
              <td><a href='#'>[` + data.coord.lat + `, ` + data.coord.lon + `]</a></td>
            </tr>
          </table>
        </div>`;
        weatherCurrent.innerHTML = template;
      }
      // отрисовка блока Forecast
      function showForecastWeather(data) {
        weatherForecast.innerHTML = '';
        var weatherData = '';
        for (var i = 0; i < data.list.length; i++){
              var weatherDate = ``;
                if (data.list[i].dt % 86400 == 0) {
                  weatherDate = `<div class="table-row day">
                                    <span>` + convertDate(data.list[i].dt) +`</span>
                                  </div>`;
                    };
            weatherData += ``+ weatherDate +`<div class="table-row">
              <div class="table-row-time">
                <span>` + convertDate(data.list[i].dt, true) +`</span>
                <img src="http://openweathermap.org/img/w/` + data.list[i].weather[0].icon + `.png" alt="1.jpg">
              </div>
              <div class="table-row-data">
                <div class="table-data-temp">
                  <span class='temp-block'>` + +data.list[i].main.temp.toFixed(1) + `&degC</span>
                  <span><i>` + data.list[i].weather[0].description + `</i></span>
                </div>
                <div class="table-data-wind">
                  <span>` + data.list[i].wind.speed + ` m/s</span>
                  <span>Clouds: ` + data.list[i].clouds.all + `%</span>
                  <span>` + data.list[i].main.pressure + ` hPa</span>
                </div>
              </div>
            </div>`
          }

        var template = `<h3>Hourly weather and forecasts in ` + data.city.name + `, ` + data.city.country + `</h3>
                        <div class="weather-5day-table">
                          <div class="table-row day">
                            <span>` + convertDate(data.list[0].dt) +` Today</span>
                          </div>`
                          + weatherData + `
                        </div>`;
        weatherForecast.innerHTML = template;
      };
      // конверт дати
      function convertDate(date, size){
        var date = new Date(date * 1000);
        var optionsLong = {
                hour: 'numeric',
                minute: 'numeric',
                month: 'short',
                day: 'numeric',
                hour12: false
                };
          var optionsShort = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
                };
          var options = {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour12: false
          };
          if (size == undefined){
            return date.toLocaleString("en-US", options);
          } else if (size){
            return date.toLocaleString("en-US", optionsShort);
          } else {
            return date.toLocaleString("en-US", optionsLong);
          }
      };
      // вивод помилки
      function fail(url) {
        var error =  `<span><b>Something wrong,</b> maybe there are no such city</span>`
        weatherForecast.innerHTML = error;
        weatherCurrent.innerHTML = '';
      };
  };
