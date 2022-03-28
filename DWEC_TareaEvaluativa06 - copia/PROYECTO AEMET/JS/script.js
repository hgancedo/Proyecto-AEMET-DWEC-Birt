'use-strict'

var api_key = 'api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoZ2FuY2Vkb0BiaXJ0LmV1cyIsImp0aSI6ImJkMmZmNWQ3LWE4ZjItNDRlMC04MWQ3LTFjY2NjYjU4Y2JhYSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNjQ1NTI0NTAyLCJ1c2VySWQiOiJiZDJmZjVkNy1hOGYyLTQ0ZTAtODFkNy0xY2NjY2I1OGNiYWEiLCJyb2xlIjoiIn0.cjoJiPY8O6O9jmSMY5TFjwSjrjWhfQ1nBU6v6bEBKis';

var urlForecast= `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/48020/?${api_key}`;
var urlHourly =  `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/48020/?${api_key}`;

/*variable para la url que contiene los datos de la prevision diaria*/
var urlForeData;

/*variables para el grafico*/
var myCanvas;
var chart;

/*variables que contienen las previsiones de los días siguientes*/
var forecast;
var forecast1;
var forecast2;
var forecast3;
var forecast4;
var forecast5;
var forecast6;

var urlHourData;
var hourly;

/*variables que contienen los datos para las graficas de los dias siguientes por hora*/
var hourlyAfterOne;

/*Variables que contendran la fecha de cada dia*/
var today;
var after1;
var after2;
var after3;
var after4;
var after5;
var after6;

/*variables que contiene los valores diarios de estado del cielo, probabilidad de precipitaciones, tª, etc que se van a
mostrar*/
var descrip;
var probPrecip;
var temMax;
var temMin;
var viento;

/*el array guardara los datos para mostrar en la gráfica*/
var temperatura;
var arrayTemperaturas = [];

/*variables que contienen los parrafos donde se anade la informacion*/
var contenedorSuperior = document.querySelector('#contPrevision');
var estado = document.createElement('p');
var probabilidad = document.createElement('p');
var temperaturas = document.createElement('p');
var estadoViento = document.createElement('p');

fetch(urlForecast)
    .then(info=>info.json())
    .then(valores=>{
        urlForeData=valores.datos;
        console.log(urlForeData);
        return peticionForecast(urlForeData);
    })
    .then(newUrl=>newUrl.json())
    .then(datos=>{
        forecast = datos[0].prediccion.dia[0];
        forecast1 = datos[0].prediccion.dia[1];
        forecast2 = datos[0].prediccion.dia[2];
        forecast3 = datos[0].prediccion.dia[3];
        forecast4 = datos[0].prediccion.dia[4];
        forecast5 = datos[0].prediccion.dia[5];
        forecast6 = datos[0].prediccion.dia[3];
        return pintarPrediccionFore();
    })
    .then(result=>result.json())
    .then(collection=>{
        urlHourData = collection.datos;
        return peticionHourly(urlHourData);
    })
    .then(data=>data.json())
    .then(pack=>{
        hourlyAfterOne = pack[0].prediccion.dia[1];
        pintarPrediccionHour();
    })


/*Del primer fetch extraemos una segunda url que nos devolvera los datos de la prevision meteorologica diaria*/
function peticionForecast(url) {
    return fetch(url);
}

/*pintamos la prediccion del dia actual en el primer div y del resto de la semana en el segundo div*/
function pintarPrediccionFore() {
    /*Conseguimos la fecha del día y de los 6 dias siguientes*/
    let tiempoTranscurrido = Date.now();
    let hoy = new Date(tiempoTranscurrido);
    let sum1 = new Date(tiempoTranscurrido + 86400000);
    let sum2 = new Date(tiempoTranscurrido + (86400000*2));
    let sum3 = new Date(tiempoTranscurrido + (86400000*3));
    let sum4 = new Date(tiempoTranscurrido + (86400000*4));
    let sum5 = new Date(tiempoTranscurrido + (86400000*5));
    let sum6 = new Date(tiempoTranscurrido + (86400000*6));
    today = hoy.toLocaleDateString();
    after1 = sum1.toLocaleDateString();
    after2 = sum2.toLocaleDateString();
    after3 = sum3.toLocaleDateString();
    after4 = sum4.toLocaleDateString();
    after5 = sum5.toLocaleDateString();
    after6 = sum6.toLocaleDateString();
    
    let titulo = document.querySelector('#title');
    titulo.innerHTML = "Previsión meteorológica para el día " + today + ' en Bilbao';

    descrip = forecast.estadoCielo[0].descripcion;
    probPrecip = forecast.probPrecipitacion[0].value;
    temMax = forecast.temperatura.maxima;
    temMin = forecast.temperatura.minima;
    viento = forecast.viento[0];


    /*anadimos los valores extraidos del fetch a los parrafos para mostrarlos*/
    estado.innerHTML = 'Estado del Cielo: ' + descrip;
    probabilidad.innerHTML = 'Probabilidad de Precipitaciones (%): ' + probPrecip;;
    temperaturas.innerHTML = 'Temperatura Máxima: ' + temMax + '°C' + '  ' + 'Temperatura Mínima: ' + temMin + '°C';
    estadoViento.innerHTML = 'Viento: Dirección ('+ viento.direccion + ') Velocidad (' + viento.velocidad + 'Km/h)';
    
    contenedorSuperior.appendChild(estado);
    contenedorSuperior.appendChild(probabilidad);
    contenedorSuperior.appendChild(temperaturas);
    contenedorSuperior.appendChild(estadoViento);

    /*creamos una tabla y añadimos los valores de los 6 dias siguientes. Insertamos la tabla en el segundo div*/
    var conte2 = document.querySelector('#conte2');
    var tabla = document.createElement('table');
    tabla.setAttribute('id', 'tabla');

    var array1 = ['Día', after1, after2, after3, after4, after5, after6];
    var array2 = ['Estado Cielo', forecast1.estadoCielo[0].descripcion, forecast2.estadoCielo[0].descripcion, forecast3.estadoCielo[0].descripcion, forecast4.estadoCielo[0].descripcion, forecast5.estadoCielo[0].descripcion, forecast6.estadoCielo[0].descripcion];
    var array3 = ['Probabilidad Precipit. (%)',forecast1.probPrecipitacion[0].value, forecast2.probPrecipitacion[0].value, forecast3.probPrecipitacion[0].value, forecast4.probPrecipitacion[0].value, forecast5.probPrecipitacion[0].value, forecast6.probPrecipitacion[0].value];
    var array4 = ['Tª Max.', forecast1.temperatura.maxima, forecast2.temperatura.maxima, forecast3.temperatura.maxima, forecast4.temperatura.maxima, forecast5.temperatura.maxima, forecast6.temperatura.maxima];
    var array5 = ['Tª Min', forecast1.temperatura.minima, forecast2.temperatura.minima, forecast3.temperatura.minima, forecast4.temperatura.minima, forecast5.temperatura.minima, forecast6.temperatura.minima];
    var array6 = ['Viento (Dirección)', forecast1.viento[0].direccion, forecast2.viento[0].direccion, forecast3.viento[0].direccion, forecast4.viento[0].direccion, forecast5.viento[0].direccion, forecast6.viento[0].direccion];
    var array7 = ['Viento (km/h)', forecast1.viento[0].velocidad, forecast2.viento[0].velocidad, forecast3.viento[0].velocidad, forecast4.viento[0].velocidad, forecast5.viento[0].velocidad, forecast6.viento[0].velocidad];

    var arrayBid = [array1, array2, array3, array4, array5, array6, array7];
    var fila = [];
    var row = [];

    /*recorremos el array bidimensional para insertar los datos en la tabla*/
    for(let i = 0; i < 7; i++) {
        fila[i]=document.createElement('tr');

        for(let z = 0; z < 7; z++) {
            row[z] = document.createElement('td');
            row[z].innerHTML = arrayBid[i][z];
            fila[i].append(row[z]);
        }

        tabla.append(fila[i]);
    }
    conte2.append(tabla);
 
    return fetch(urlHourly);
}

function peticionHourly(dat) {    
    return fetch(dat);
} 

/*mostramos la previsión de la temperatura por horas en la grafica*/
function pintarPrediccionHour() {
    var title3 = document.querySelector('#title3');
    title3.innerHTML = "Evolución de la temperatura para el dia " + after1;
    temperatura = hourlyAfterOne.temperatura;


    /*asignamos los datos de las temperaturas al array para mostrar en la gráfica en el eje x*/
    temperatura.map(function(datos, i){
        arrayTemperaturas[i] = datos.value;
    })


    myCanvas = document.querySelector('#grafico').getContext("2d");
    chart = new Chart(myCanvas, {
        type: "bar",
        data:{
            labels:['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'],
            datasets:[
                {
                    label:"Temperatura en °C",
                    backgroundColor: "rgb(0, 255, 0)",
                    data: arrayTemperaturas
                }
            ]
        },

    })

}

